const CACHE_NAME = 'site-cache-v1';
const urlsToCache = [
    '/tugasDesainWebFikhri/index.html',
    '/tugasDesainWebFikhri/about.html',
    '/tugasDesainWebFikhri/app.js',
    '/tugasDesainWebFikhri/confirmation.html',
    '/tugasDesainWebFikhri/contact.html',
    '/tugasDesainWebFikhri/foto.jpg',
    '/tugasDesainWebFikhri/image.jpg',
    '/tugasDesainWebFikhri/Logo128.png',
    '/tugasDesainWebFikhri/Logo144.png',
    '/tugasDesainWebFikhri/Logo192.png',
    '/tugasDesainWebFikhri/Logo512.png',
    '/tugasDesainWebFikhri/manifest.json',
    '/tugasDesainWebFikhri/style.css',
    '/tugasDesainWebFikhri/offline.html'
];

// Install service worker dan cache file
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Cache terbuka');
            return cache.addAll(urlsToCache)
                .then(() => self.skipWaiting())
                .catch(error => console.error('Gagal melakukan caching: ', error));
        })
    );
});

// Aktifkan service worker dan hapus cache lama
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Menghapus cache lama:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});

// Fetch aset dari cache
self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/tugasDesainWebFikhri/offline.html');
                }
            });
        })
    );
});
