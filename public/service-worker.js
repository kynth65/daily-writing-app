// Service Worker for Daily Writing App
const CACHE_NAME = 'daily-writing-v2';
const RUNTIME_CACHE = 'runtime-cache-v2';
const API_CACHE = 'api-cache-v2';

// Assets to cache on install (only cache actual static assets)
const PRECACHE_ASSETS = [
  '/manifest.json',
  '/icon.svg',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log('[Service Worker] Skip waiting');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== API_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip Next.js internal requests - let Next.js handle these directly
  // This includes chunks, hot-reload, error frames, and other development tools
  if (url.pathname.includes('/_next/') ||
      url.pathname.includes('/__nextjs') ||
      url.pathname.includes('/webpack') ||
      url.searchParams.has('__nextjs')) {
    // Don't intercept - let Next.js handle these requests
    return;
  }

  // API requests - Network First strategy with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Static assets - Cache First strategy
  if (request.destination === 'image' ||
      request.destination === 'font' ||
      request.destination === 'style') {
    event.respondWith(cacheFirstStrategy(request, RUNTIME_CACHE));
    return;
  }

  // Pages - Network First with cache fallback
  if (request.destination === 'document') {
    event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
  }
});

// Cache First Strategy - for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);

    // Return offline page for navigation requests
    if (request.destination === 'document') {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/');
    }

    throw error;
  }
}

// Network First Strategy - for API calls and pages
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // For API requests that fail, return a special offline response
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({
          error: 'Offline',
          message: 'You are currently offline. Changes will sync when you reconnect.'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    throw error;
  }
}

// Background Sync event - for syncing offline changes
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'sync-entries') {
    event.waitUntil(syncEntries());
  }
});

// Sync pending entries with the server
async function syncEntries() {
  console.log('[Service Worker] Syncing entries...');

  try {
    // Get pending entries from IndexedDB (via message to clients)
    const clients = await self.clients.matchAll();

    for (const client of clients) {
      client.postMessage({
        type: 'SYNC_ENTRIES',
        message: 'Starting background sync'
      });
    }

    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    return Promise.reject(error);
  }
}

// Message event - communication with app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
