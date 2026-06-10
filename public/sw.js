const CACHE_NAME = 'solotodo-shell-v3';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function canCache(response) {
  return response && response.status === 200 && response.type !== 'opaque';
}

function networkFirst(request, fallbackUrl) {
  return fetch(request)
    .then((response) => {
      if (canCache(response)) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
      }
      return response;
    })
    .catch(() => caches.match(request).then((cached) => cached || caches.match(fallbackUrl).then((fallback) => fallback || Response.error())));
}

function cacheFirstWithRefresh(request) {
  return caches.match(request).then((cached) => {
    const fresh = fetch(request)
      .then((response) => {
        if (canCache(response)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => cached || Response.error());

    return cached || fresh;
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html';
  if (isNavigation || APP_SHELL.includes(url.pathname)) {
    event.respondWith(networkFirst(event.request, '/index.html'));
    return;
  }

  event.respondWith(cacheFirstWithRefresh(event.request));
});
