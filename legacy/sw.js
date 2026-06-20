/* Algorithm Interview Service Worker v2 (adds diagrams + extra-solutions) */
var CACHE_NAME = 'algo-hub-v2';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './robots.txt',
  './sitemap.xml',
  './css/main.css',
  './css/algorithm.css',
  './css/solutions-v2.css',
  './css/interactive.css',
  './css/viz-modal.css',
  './js/safe-ls.js',
  './js/problems-data.js',
  './js/solutions-v2.js',
  './js/sol-v2-01.js',
  './js/sol-v2-02.js',
  './js/sol-v2-03a.js',
  './js/sol-v2-03b.js',
  './js/sol-v2-04a.js',
  './js/sol-v2-04b.js',
  './js/sol-v2-05.js',
  './js/sol-v2-06a.js',
  './js/sol-v2-06b.js',
  './js/sol-v2-07a.js',
  './js/sol-v2-07b.js',
  './js/sol-v2-07c.js',
  './js/extra-solutions.js',
  './js/diagrams.js',
  './js/app.js',
  './js/algorithm-visualizer.js',
  './js/visualizer-extended.js',
  './js/viz-engine.js',
  './js/viz-traces-01.js',
  './js/viz-traces-02.js',
  './js/viz-traces-03.js',
  './js/viz-traces-04.js',
  './js/viz-traces-05.js',
  './js/viz-traces-06.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS).catch(function() {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.filter(function(n) {
        return n !== CACHE_NAME;
      }).map(function(n) {
        return caches.delete(n);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(resp) {
        if (resp.ok && e.request.url.startsWith(self.location.origin)) {
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone).catch(function() {});
          });
        }
        return resp;
      }).catch(function() {
        if (e.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
