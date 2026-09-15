// حفظ ملفات التطبيق محليًا لتشغيله بدون إنترنت

const CACHE_NAME = "quran-app-v2";

const FILES_TO_CACHE = [
    "./quran.html",
    "./quran.css",
    "./quran.js",
    "./quran-data.js",
    "./juz-data.js",
    "./manifest.json"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});