const CACHE = 'reading-margin-recall-v3';
const SHELL = ['/', '/demo', '/library', '/review', '/privacy', '/terms', '/manifest.webmanifest', '/assets/field-guide-hero.webp', '/assets/field-guide-hero-mobile.webp', '/assets/leaf-mark.svg'];
self.addEventListener('install', (event) => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  const page = await fetch(new Request('/', { cache: 'reload' }));
  await cache.put('/', page.clone());
  const html = await page.text();
  const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
  await Promise.all([...new Set([...SHELL.filter((url) => url !== '/'), ...builtAssets])].map(async (url) => {
    const response = await fetch(new Request(url, { cache: 'reload' }));
    if (response.ok) await cache.put(url, response);
  }));
  await self.skipWaiting();
})()));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreVary: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      const cache = await caches.open(CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch {
      return event.request.mode === 'navigate' ? (await caches.match('/', { ignoreVary: true })) || Response.error() : Response.error();
    }
  })());
});
