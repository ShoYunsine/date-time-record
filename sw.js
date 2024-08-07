const CACHE_NAME = 'dtr-v1.1';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/js/script.js',
        '/classes.html',
        '/css/classes.css',
        '/js/classes.js',
        '/dashboard.html',
        '/css/dashboard.css',
        '/js/dashboard.js',
        '/css/login-signup-style.css',
        '/css/calendar.css',
        '/js/login.js'
      ]);
    })()
  );
});

self.addEventListener('fetch', event => {
  // Handle only GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        
        // Check the cache for the requested resource
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse; // Return cached response if found
        }
        
        try {
          // If not cached, fetch from the network
          const fetchResponse = await fetch(event.request);
          
          // Cache the response if it is valid
          if (fetchResponse && fetchResponse.status === 200) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        } catch (e) {
          // Handle network errors here, potentially serve fallback content
          console.error('Fetch failed:', e);
          // Optionally serve offline page or fallback content
          return caches.match('/offline.html');
        }
      })()
    );
  } else {
    // For non-GET requests, perform network fetch without caching
    event.respondWith(fetch(event.request));
  }
});
