const { Pool, Client } = require('pg');
const { EventEmitter } = require('events');
const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : false
});

// ===== STATE-CHANGE PUBSUB =====
// Every write announces the app's new version on a Postgres NOTIFY channel, and
// a dedicated LISTEN connection re-emits it in-process. Going through Postgres
// rather than a plain EventEmitter means a write from ANY connection reaches
// every subscriber — a second pm2 instance, a migration script, a psql session —
// so live clients can't silently miss an update. Subscribers get {app, version};
// they fetch the state themselves (payloads are capped at 8000 bytes).
const NOTIFY_CHANNEL = 'app_state_changed';
// Identifies this process's own notifications. We always emit locally (with the
// state attached) before the NOTIFY goes out, so hearing our own message back
// would be a strictly worse duplicate — and one that costs a subscriber its
// diff baseline, forcing clients into a full refetch on every other write.
const PROCESS_ID = crypto.randomUUID();
const stateEvents = new EventEmitter();
stateEvents.setMaxListeners(0);
let listenClient = null;
let listenBackoff = 1000;

function notifyStateChanged(appName, version) {
  if (!Number.isFinite(version)) return;
  pool.query('SELECT pg_notify($1, $2)', [NOTIFY_CHANNEL, JSON.stringify({ app: appName, version, pid: PROCESS_ID })])
    .catch(err => console.error('pg_notify failed:', err.message));
}

// Announce a write. Subscribers in THIS process also get the new state object,
// which lets a caller diff it against what it last saw and push just the change
// to clients — worth it because shipping the whole blob to a far-away browser
// costs about a second, while a diff is a few KB. Other processes only get the
// version over NOTIFY (its payload is capped at 8000 bytes), and fall back to
// refetching. `local` marks which kind an event is.
function publishStateChange(appName, version, state) {
  if (Number.isFinite(version)) stateEvents.emit('change', { app: appName, version, state, local: true });
  notifyStateChanged(appName, version);
}

// Keep one long-lived LISTEN connection alive, reconnecting with backoff. It is
// deliberately NOT from the pool: a pooled client running LISTEN would keep the
// subscription on whichever connection it happened to get, and lose it on release.
function startStateListener() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
  });
  listenClient = client;
  const retry = (why) => {
    if (listenClient !== client) return; // already replaced
    listenClient = null;
    console.error(`state listener ${why}; reconnecting in ${listenBackoff}ms`);
    setTimeout(startStateListener, listenBackoff);
    listenBackoff = Math.min(listenBackoff * 2, 30000);
  };
  client.on('error', err => { retry(`errored (${err.message})`); client.end().catch(() => {}); });
  client.on('end', () => retry('disconnected'));
  client.on('notification', msg => {
    try {
      const payload = JSON.parse(msg.payload);
      if (!payload || !payload.app) return;
      if (payload.pid === PROCESS_ID) return; // our own write, already emitted locally with its state
      stateEvents.emit('change', payload);
    } catch { /* malformed payload — ignore */ }
  });
  client.connect()
    .then(() => client.query(`LISTEN ${NOTIFY_CHANNEL}`))
    .then(() => { listenBackoff = 1000; console.log('state listener connected'); })
    .catch(err => retry(`failed to connect (${err.message})`));
}

// Subscribe to writes for one app. Returns an unsubscribe function.
function onStateChange(appName, handler) {
  const listener = payload => { if (payload.app === appName) handler(payload); };
  stateEvents.on('change', listener);
  return () => stateEvents.off('change', listener);
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      app_name VARCHAR(50) PRIMARY KEY,
      state JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  // Monotonic version per app, bumped on every write — used for optimistic
  // concurrency so a stale whole-blob PUT (e.g. a browser tab that loaded
  // before an agent added a card) is rejected instead of silently clobbering.
  await pool.query(`ALTER TABLE app_state ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0`);
  // Rolling archive of previous states: every write snapshots the row it
  // replaces, pruned to the most recent HISTORY_KEEP per app. Makes any
  // future clobber a one-query restore instead of a pg_dump excavation.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state_history (
      id BIGSERIAL PRIMARY KEY,
      app_name VARCHAR(50) NOT NULL,
      version BIGINT NOT NULL,
      state JSONB NOT NULL,
      saved_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS app_state_history_app_idx ON app_state_history (app_name, id DESC)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS magic_links (
      token VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getState(appName) {
  const { rows } = await pool.query(
    'SELECT state FROM app_state WHERE app_name = $1',
    [appName]
  );
  return rows.length ? rows[0].state : null;
}

const HISTORY_KEEP = 30;

// Fire-and-forget: trim an app's history to the newest HISTORY_KEEP snapshots.
function pruneHistory(appName) {
  pool.query(
    `DELETE FROM app_state_history
     WHERE app_name = $1 AND id < COALESCE((
       SELECT min(id) FROM (
         SELECT id FROM app_state_history
         WHERE app_name = $1 ORDER BY id DESC LIMIT $2
       ) keep), 0)`,
    [appName, HISTORY_KEEP]
  ).catch(err => console.error('history prune failed:', err.message));
}

async function setState(appName, state) {
  const { rows } = await pool.query(
    `WITH prev AS (
       SELECT app_name, version, state FROM app_state WHERE app_name = $1
     ), archived AS (
       INSERT INTO app_state_history (app_name, version, state)
       SELECT app_name, version, state FROM prev
     )
     INSERT INTO app_state (app_name, state, version, updated_at)
     VALUES ($1, $2, 1, NOW())
     ON CONFLICT (app_name)
     DO UPDATE SET state = $2, version = app_state.version + 1, updated_at = NOW()
     RETURNING version`,
    [appName, JSON.stringify(state)]
  );
  pruneHistory(appName);
  if (rows.length) publishStateChange(appName, Number(rows[0].version), state);
}

// Read state together with its current version (for optimistic concurrency).
async function getStateWithVersion(appName) {
  const { rows } = await pool.query(
    'SELECT state, version FROM app_state WHERE app_name = $1',
    [appName]
  );
  return rows.length
    ? { state: rows[0].state, version: Number(rows[0].version) }
    : { state: null, version: 0 };
}

// Conditional whole-blob write: only succeeds if the stored version still
// matches `expectedVersion` (i.e. nobody wrote since the caller last read).
// Returns { ok:true, version } on success, or { ok:false, current:{state,version} }
// on conflict so the caller can reconcile. expectedVersion 0 also covers the
// first-ever write (no row yet).
async function setStateIfVersion(appName, state, expectedVersion) {
  const { rows } = await pool.query(
    `WITH prev AS (
       SELECT app_name, version, state FROM app_state WHERE app_name = $1 AND version = $3
     ), archived AS (
       INSERT INTO app_state_history (app_name, version, state)
       SELECT app_name, version, state FROM prev
     )
     UPDATE app_state
       SET state = $2, version = version + 1, updated_at = NOW()
     WHERE app_name = $1 AND version = $3
     RETURNING version`,
    [appName, JSON.stringify(state), expectedVersion]
  );
  if (rows.length) {
    pruneHistory(appName);
    publishStateChange(appName, Number(rows[0].version), state);
    return { ok: true, version: Number(rows[0].version) };
  }

  // No row updated: either the row doesn't exist yet, or the version moved on.
  const current = await getStateWithVersion(appName);
  if (current.state == null && expectedVersion === 0) {
    const ins = await pool.query(
      `INSERT INTO app_state (app_name, state, version, updated_at)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (app_name) DO NOTHING
       RETURNING version`,
      [appName, JSON.stringify(state)]
    );
    if (ins.rows.length) {
      publishStateChange(appName, Number(ins.rows[0].version), state);
      return { ok: true, version: Number(ins.rows[0].version) };
    }
    return { ok: false, current: await getStateWithVersion(appName) };
  }
  return { ok: false, current };
}

// Atomic read-modify-write of an app's JSONB state. `fn` receives the current
// state object, mutates it in place (and may return a value to hand back to the
// caller), all inside a transaction that holds a row lock — so concurrent agent
// writes serialize instead of clobbering each other mid-flight.
async function mutateState(appName, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'SELECT state FROM app_state WHERE app_name = $1 FOR UPDATE',
      [appName]
    );
    if (!rows.length || rows[0].state == null) {
      throw Object.assign(new Error(`No state for app "${appName}"`), { status: 404 });
    }
    const state = rows[0].state;
    const result = await fn(state);
    await client.query(
      `INSERT INTO app_state_history (app_name, version, state)
       SELECT app_name, version, state FROM app_state WHERE app_name = $1`,
      [appName]
    );
    const written = await client.query(
      `INSERT INTO app_state (app_name, state, version, updated_at)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (app_name)
       DO UPDATE SET state = $2, version = app_state.version + 1, updated_at = NOW()
       RETURNING version`,
      [appName, JSON.stringify(state)]
    );
    // Inside the transaction on purpose: Postgres holds the notification until
    // COMMIT, so subscribers never see a version they can't yet read.
    await client.query('SELECT pg_notify($1, $2)', [
      NOTIFY_CHANNEL,
      JSON.stringify({ app: appName, version: Number(written.rows[0].version), pid: PROCESS_ID })
    ]);
    await client.query('COMMIT');
    pruneHistory(appName);
    stateEvents.emit('change', {
      app: appName, version: Number(written.rows[0].version), state, local: true
    });
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function createMagicLink(email) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await pool.query(
    'INSERT INTO magic_links (token, email, expires_at) VALUES ($1, $2, $3)',
    [token, email, expiresAt]
  );
  return token;
}

async function verifyMagicLink(token) {
  const { rows } = await pool.query(
    'SELECT * FROM magic_links WHERE token = $1 AND used = FALSE AND expires_at > NOW()',
    [token]
  );
  if (!rows.length) return null;
  await pool.query('UPDATE magic_links SET used = TRUE WHERE token = $1', [token]);
  return rows[0];
}

async function createSession(email) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await pool.query(
    'INSERT INTO sessions (token, email, expires_at) VALUES ($1, $2, $3)',
    [token, email, expiresAt]
  );
  return token;
}

async function getSession(token) {
  const { rows } = await pool.query(
    'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
    [token]
  );
  return rows.length ? rows[0] : null;
}

async function verifyPassword(password) {
  const stored = process.env.AUTH_PASSWORD_HASH;
  if (!stored || !password) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, salt, expected.length);
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

module.exports = { pool, initDb, getState, setState, getStateWithVersion, setStateIfVersion, mutateState, onStateChange, startStateListener, createMagicLink, verifyMagicLink, createSession, getSession, verifyPassword };
