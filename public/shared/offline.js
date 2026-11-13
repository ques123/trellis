// Offline support for Trellis.
//
// Each app keeps a snapshot of its state in IndexedDB:
//   { state, shadow, version, dirty, savedAt }
// `shadow` is the last state known to be on the server and `version` its
// version; `dirty` means `state` holds edits the server hasn't accepted yet.
// When the network comes back the app merges its edits (three-way, against
// `shadow`) with whatever the server has now and saves the result.
//
// Also draws a small status pill (offline / syncing / synced) in the corner.
(function () {
  const DB_NAME = 'trellis-offline';
  const STORE = 'kv';
  let dbPromise = null;
  const memory = new Map(); // fallback when IndexedDB is unavailable

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch { resolve(null); }
    });
    return dbPromise;
  }

  async function get(key) {
    const db = await openDb();
    if (!db) return memory.get(key);
    return new Promise((resolve) => {
      try {
        const r = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => resolve(memory.get(key));
      } catch { resolve(memory.get(key)); }
    });
  }

  // Writes are serialised per key so a slow older write can never land after a
  // newer one and leave a stale snapshot behind.
  const chains = new Map();
  function set(key, value) {
    memory.set(key, value);
    const prev = chains.get(key) || Promise.resolve();
    const next = prev.then(async () => {
      const db = await openDb();
      if (!db) return;
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE, 'readwrite');
          tx.objectStore(STORE).put(value, key);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
          tx.onabort = () => resolve();
        } catch { resolve(); }
      });
    });
    chains.set(key, next);
    return next;
  }

  // A failed fetch (no network) or a gateway error from Cloudflare/nginx while
  // the server is unreachable both count as "offline": keep the edit locally.
  function isOfflineResponse(res) {
    return !res || res.status === 0 || res.status === 502 || res.status === 503
      || res.status === 504 || res.status === 520 || res.status === 521
      || res.status === 522 || res.status === 523 || res.status === 524 || res.status === 530;
  }

  // ---- Status pill ----
  let pill = null;
  let hideTimer = null;
  function ensurePill() {
    if (pill) return pill;
    pill = document.createElement('div');
    pill.id = 'pb-offline-pill';
    pill.setAttribute('role', 'status');
    pill.style.cssText = [
      'position:fixed', 'right:12px', 'bottom:12px', 'z-index:2147483000',
      'padding:6px 12px', 'border-radius:999px', 'font:500 12px/1.3 system-ui,-apple-system,sans-serif',
      'color:#fff', 'box-shadow:0 2px 10px rgba(0,0,0,.25)', 'pointer-events:none',
      'transition:opacity .3s', 'opacity:0', 'max-width:70vw'
    ].join(';');
    document.body.appendChild(pill);
    return pill;
  }
  const COLORS = { offline: '#6b7280', syncing: '#2563eb', synced: '#16a34a', error: '#dc2626' };
  // kind: 'offline' | 'syncing' | 'synced' | 'error' | null (hide)
  function status(kind, text) {
    if (!document.body) return;
    const p = ensurePill();
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (!kind) { p.style.opacity = '0'; return; }
    p.textContent = text;
    p.style.background = COLORS[kind] || COLORS.offline;
    p.style.opacity = '1';
    if (kind === 'synced') hideTimer = setTimeout(() => { p.style.opacity = '0'; }, 2500);
  }

  // Call `cb` when connectivity probably returned: the browser's online event,
  // tab focus, or every `intervalMs` while the app reports itself offline.
  function onReconnect(isOffline, cb, intervalMs) {
    const fire = () => { if (isOffline()) cb(); };
    window.addEventListener('online', fire);
    window.addEventListener('focus', fire);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) fire(); });
    setInterval(fire, intervalMs || 5000);
  }

  window.PBOffline = { get, set, status, isOfflineResponse, onReconnect };
})();
