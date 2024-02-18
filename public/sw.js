const CACHE_NAME = 'cache-v1';
const PRECACHE_URLS = [
    '/wordpress-detector-favicon.svg',
    '/wordpress-detector-favicon.svg',
    '/eb-garamond.woff2',
    '/inter.woff2',
    '/wordpress-detector-icon-192x192.png',
    '/wordpress-detector-icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
