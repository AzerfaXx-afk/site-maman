const CACHE_NAME = 'reflexo-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  'assets/img/logo.png',
  'assets/img/landing.webp',
  'assets/img/profile.webp',
  'assets/img/imgscroll1.webp',
  'assets/img/imgscroll2.webp',
  'assets/img/imgscroll3.webp',
  'assets/img/savoir-plus.webp'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force active takeover
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Network first: always try to fetch newest content and save to cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline mode)
        return caches.match(event.request);
      })
  );
});

// Update service worker logic
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // Take control of all pages instantly
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
