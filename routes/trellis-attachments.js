// Trellis file attachments: the bytes live on disk, the card only keeps a small
// reference ({ id, name, url, mime, size, ... }) inside the trellis JSONB blob.
// Inlining files as data URLs would bloat the blob that every write ships to
// every open board, so it never goes in there.
//
// Mounted behind the cookie auth middleware (server.js), so only a signed-in
// session can upload or read. The directory (data/, gitignored) must survive
// deploys: exclude it from anything that overwrites the app folder, and back it up.
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const UPLOAD_DIR = process.env.TRELLIS_UPLOAD_DIR || path.join(__dirname, '..', 'data', 'trellis-uploads');
// Matches nginx's client_max_body_size 15M (see README); anything bigger never
// reaches us anyway. The frontend checks the same number before uploading.
const MAX_BYTES = 15 * 1024 * 1024;
const ID_RE = /^[a-f0-9]{24}$/;

// Types a browser may render in place. Everything else is served as a download,
// and every response is sandboxed + nosniff, so an uploaded .html or .svg can't
// run script on the Trellis origin.
const INLINE_TYPES = new Set([
  'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'image/heic', 'image/bmp',
  'application/pdf', 'text/plain', 'text/csv', 'text/markdown',
  'video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm',
]);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const filePath = id => path.join(UPLOAD_DIR, id);
const metaPath = id => path.join(UPLOAD_DIR, id + '.json');

function cleanName(raw) {
  let name = '';
  try { name = decodeURIComponent(raw || ''); } catch { name = raw || ''; }
  name = path.basename(name).replace(/[\u0000-\u001f\u007f/\\]/g, '').trim();
  return (name || 'file').slice(0, 200);
}

// The URL goes into markdown as ![name](url) / [name](url), so also encode the
// characters encodeURIComponent leaves alone that would end the link early
// (parens) or trip the emphasis rules (* _ ~).
function urlName(name) {
  return encodeURIComponent(name).replace(/[!'()*_~]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function cleanMime(raw) {
  const mime = String(raw || '').toLowerCase().split(';')[0].trim();
  return /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/.test(mime) ? mime : 'application/octet-stream';
}

// POST / — raw file bytes in the body. The client always sends
// application/octet-stream so the global express.json() never grabs a .json
// upload; the real type and name travel in X-File-Type / X-Filename.
router.post('/', express.raw({ type: () => true, limit: MAX_BYTES }), async (req, res) => {
  try {
    const body = req.body;
    if (!Buffer.isBuffer(body) || !body.length) return res.status(400).json({ error: 'Empty file' });
    const id = crypto.randomBytes(12).toString('hex');
    const meta = {
      id,
      name: cleanName(req.get('X-Filename')),
      mime: cleanMime(req.get('X-File-Type')),
      size: body.length,
      uploadedAt: Date.now(),
    };
    await fs.promises.writeFile(filePath(id), body);
    await fs.promises.writeFile(metaPath(id), JSON.stringify(meta));
    res.status(201).json({ ...meta, url: `/api/trellis/attachments/${id}/${urlName(meta.name)}` });
  } catch (err) {
    console.error('POST /api/trellis/attachments error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /:id/:name? — the trailing name is cosmetic (nicer URLs and default save
// name); the id alone picks the file.
router.get('/:id/:name?', async (req, res) => {
  const { id } = req.params;
  if (!ID_RE.test(id)) return res.status(404).end();
  let meta;
  try { meta = JSON.parse(await fs.promises.readFile(metaPath(id), 'utf8')); }
  catch { return res.status(404).end(); }

  const inline = INLINE_TYPES.has(meta.mime);
  const encoded = encodeURIComponent(meta.name);
  res.set({
    'Content-Type': meta.mime,
    'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${encoded}"; filename*=UTF-8''${encoded}`,
    'X-Content-Type-Options': 'nosniff',
    // Ids are random and files never change, so browsers can keep them forever.
    'Cache-Control': 'private, max-age=31536000, immutable',
  });
  // Chrome refuses to open its PDF viewer in a sandboxed document, and PDFs
  // can't script the page anyway — everything else gets the sandbox.
  if (meta.mime !== 'application/pdf') {
    res.set('Content-Security-Policy', "sandbox; default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'");
  }
  res.sendFile(filePath(id), err => {
    if (err && !res.headersSent) res.status(404).end();
  });
});

// Upload errors (oversized body from express.raw, mostly) as JSON, not HTML.
router.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') return res.status(413).json({ error: 'File too large (max 15 MB)' });
  next(err);
});

module.exports = router;
module.exports.UPLOAD_DIR = UPLOAD_DIR;
