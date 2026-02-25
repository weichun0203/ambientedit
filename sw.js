// 定義快取的名稱與版本，未來如果網站有大更新，可以更改版本號 (例如改為 v2)
const CACHE_NAME = 'ambient-toolbox-v1';

// 告訴管家有哪些檔案是必須要「記住」的 (離線時需要用到的資源)
// 這裡使用相對路徑 './'，以確保在 GitHub Pages 上能順利運作
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// 1. 安裝階段 (Install)：當使用者第一次開啟網頁時，管家會把上述檔案存進手機快取中
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('常溫快取已開啟');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 攔截請求階段 (Fetch)：當使用者瀏覽網頁時，管家會先檢查有沒有快取過
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在快取中找到了，就直接給使用者看 (實現離線存取與秒開)
        if (response) {
          return response;
        }
        // 如果沒找到，就透過網路正常抓取
        return fetch(event.request);
      })
  );
});

// 3. 啟動與清理階段 (Activate)：如果我們更新了 CACHE_NAME 版本，管家會把舊的記憶清掉，釋放空間
self.addEventListener('activate', event => {
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
