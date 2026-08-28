const VERSION = 'flex-meals-v2';
const CORE = ['/', '/app', '/demo', '/privacy', '/terms', '/offline.html', '/manifest.webmanifest', '/icons/favicon.svg', '/assets/meal-edition.webp', '/assets/meal-edition-768.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    const fetchFresh = async (path) => {
      const response = await fetch(new Request(path, { cache: 'reload' }));
      if (response.ok) await cache.put(path, response.clone());
      return response;
    };
    const response = await fetchFresh('/');
    await Promise.all(CORE.filter((path) => path !== '/').map(fetchFresh));
    const html = await response.clone().text();
    const paths = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((match) => match[1]).filter((path) => !path.startsWith('//'));
    await Promise.allSettled(paths.map(fetchFresh));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const cache = await caches.open(VERSION);
        await cache.put(event.request, response.clone());
        return response;
      } catch {
        return (await caches.match(event.request)) || (await caches.match('/')) || (await caches.match('/offline.html'));
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) (await caches.open(VERSION)).put(event.request, response.clone());
      return response;
    } catch {
      return new Response('', { status: 503, statusText: 'Offline' });
    }
  })());
});
