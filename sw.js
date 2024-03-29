var VERSION = 'v1';

// 缓存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => (
      cache.addAll([
        './index.html',
        './static/jquery.min.js',
        './static/banner.jpg'
      ])
    ))
  );
});

// 缓存更新
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => (
      Promise.all(
        cacheNames.map(cacheName => {
          // 如果当前版本和缓存版本不一致
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      )
    ))
  );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).catch(() => {
    return fetch(event.request);
  }).then(response => {
    caches.open(VERSION).then(function (cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(() => {
    return caches.match('./static/banner.jpg');
  }));
});