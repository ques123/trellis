const CACHE_NAME = 'trellis-v1';
// Everything Trellis needs to open with no network. Board data is kept by
// the app itself (IndexedDB, shared/offline.js).
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/config.js',
  '/shared/drawer-drag.js',
  '/shared/offline.js',
  '/shared/trellis-merge.js',
  '/icons/claude.svg',
  '/icons/codex.svg'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const NETWORK_TIMEOUT_MS = 6000;

// Only keep real pages. A signed-out fetch is redirected to the login page,
// and caching that would show the login form offline.
function cacheable(res) {
  return res && (res.ok || res.type === 'opaque') && !res.redirected;
}

// Install: precache one by one, so a single failure (or a signed-out
// install) never aborts the whole worker.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(STATIC_ASSETS.map(url =>
        fetch(url, { cache: 'no-cache' })
          .then(res => { if (cacheable(res)) return cache.put(url, res); })
          .catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

async function fromCache(req) {
  const url = new URL(req.url);
  const hit = await caches.match(req, { ignoreSearch: true });
  if (hit) return hit;
  // / and /index.html are the same page.
  if (url.origin === location.origin && url.pathname.endsWith('/')) {
    return caches.match(url.pathname + 'index.html');
  }
  return undefined;
}

// Fetch: network-first for everything (HTML, JS, CSS, assets), falling back to
// cache when offline. Assets are served unhashed (app.js, style.css), so
// cache-first would pin stale code after a deploy. A network that hangs
// rather than fails gets NETWORK_TIMEOUT_MS before the cached copy is shown
// (the fetch carries on and refreshes the cache).
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const sameOrigin = url.origin === location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return;

  // API calls: network only (the app keeps its own offline copy)
  if (sameOrigin && url.pathname.startsWith('/api/')) return;

  e.respondWith((async () => {
    const network = fetch(e.request).then(res => {
      if (cacheable(res)) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return res;
    });
    network.catch(() => {}); // handled below; avoid an unhandled rejection
    const timeout = new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS, 'timeout'));
    try {
      const first = await Promise.race([network, timeout]);
      if (first !== 'timeout') return first;
      const cached = await fromCache(e.request);
      return cached || network;
    } catch {
      const cached = await fromCache(e.request);
      if (cached) return cached;
      throw new Error('offline and not cached');
    }
  })());
});
