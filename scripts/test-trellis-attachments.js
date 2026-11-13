// Tests routes/trellis-attachments.js (upload + serve) against a temp dir.
//   run: node scripts/test-trellis-attachments.js
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const express = require('express');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'trellis-att-'));
process.env.TRELLIS_UPLOAD_DIR = dir;
const router = require('../routes/trellis-attachments');

const app = express();
app.use(express.json({ limit: '10mb' })); // same global parser server.js runs first
app.use('/api/trellis/attachments', router);

let pass = 0;
const ok = (n) => { console.log(`  ✓ ${n}`); pass++; };

const upload = (base, body, name, type) => fetch(`${base}/api/trellis/attachments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/octet-stream', 'X-Filename': encodeURIComponent(name), 'X-File-Type': type },
  body,
});

const server = app.listen(0, async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    // PNG round-trip: served inline, sandboxed, nosniff.
    const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
    let res = await upload(base, png, 'Screenshot (2) my_file.png', 'image/png');
    assert.equal(res.status, 201);
    const meta = await res.json();
    assert.match(meta.id, /^[a-f0-9]{24}$/);
    assert.equal(meta.name, 'Screenshot (2) my_file.png');
    assert.equal(meta.size, png.length);
    assert.ok(!/[()_ ]/.test(meta.url.split('/').pop()), 'url name has no markdown-breaking chars');
    ok('upload returns id/name/size and a markdown-safe url');

    res = await fetch(base + meta.url);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'image/png');
    assert.match(res.headers.get('content-disposition'), /^inline;/);
    assert.match(res.headers.get('content-security-policy'), /sandbox/);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.deepEqual(Buffer.from(await res.arrayBuffer()), png);
    ok('image served inline + sandboxed, bytes intact');

    // A .json upload must not be eaten by the global express.json() parser.
    const json = Buffer.from('{"a":1}');
    res = await upload(base, json, 'data.json', 'application/json');
    const jmeta = await res.json();
    assert.equal(jmeta.size, json.length);
    res = await fetch(base + jmeta.url);
    assert.equal(await res.text(), '{"a":1}');
    ok('.json file stored verbatim');

    // HTML is a download, never rendered on our origin.
    res = await upload(base, Buffer.from('<script>alert(1)</script>'), 'x.html', 'text/html');
    const hmeta = await res.json();
    res = await fetch(base + hmeta.url);
    assert.match(res.headers.get('content-disposition'), /^attachment;/);
    assert.match(res.headers.get('content-security-policy'), /sandbox/);
    ok('html served as a sandboxed download');

    // PDFs skip the sandbox (Chrome won't open its viewer in one).
    res = await upload(base, Buffer.from('%PDF-1.4'), 'doc.pdf', 'application/pdf');
    const pmeta = await res.json();
    res = await fetch(base + pmeta.url);
    assert.equal(res.headers.get('content-security-policy'), null);
    assert.match(res.headers.get('content-disposition'), /^inline;/);
    ok('pdf inline without sandbox');

    // Path tricks in the name are flattened; junk types fall back.
    res = await upload(base, Buffer.from('x'), '../../etc/passwd', 'not a mime');
    const tmeta = await res.json();
    assert.equal(tmeta.name, 'passwd');
    assert.equal(tmeta.mime, 'application/octet-stream');
    assert.deepEqual(fs.readdirSync(dir).filter(f => !/^[a-f0-9]{24}(\.json)?$/.test(f)), []);
    ok('filename traversal flattened, bad mime defaulted');

    res = await upload(base, Buffer.alloc(0), 'empty.txt', 'text/plain');
    assert.equal(res.status, 400);
    res = await upload(base, Buffer.alloc(15 * 1024 * 1024 + 1), 'big.bin', 'application/octet-stream');
    assert.equal(res.status, 413);
    ok('empty → 400, over 15 MB → 413');

    res = await fetch(`${base}/api/trellis/attachments/../../server.js`);
    assert.equal(res.status, 404);
    res = await fetch(`${base}/api/trellis/attachments/${'0'.repeat(24)}/nope`);
    assert.equal(res.status, 404);
    ok('bad / unknown ids → 404');

    console.log(`\n${pass} passed`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
