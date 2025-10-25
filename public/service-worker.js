// const CACHE_NAME = "my-cache-v1";

// async function cacheCoreAsset() {
//   const cache = await caches.open(CACHE_NAME);
//   // cache.addAll([
//   //   // "/",
//   //   // "/about",
//   //   // "/contact",
//   //   // "/privacy",
//   //   // "//connect",
//   //   // "/settings",
//   //   // "/connect",
//   //   // "/manifest.json",
//   //   // "/service-worker.js",
//   //   "/offline",
//   // ]);
// }

// self.addEventListener("install", (event) => {
//   console.log("Service Worker installing...");
//   event.waitUntil(cacheCoreAsset());
//   self.skipWaiting();
//   console.log("Service Worker installed.");
// });

// self.addEventListener("activate", (event) => {
//   console.log("Service Worker activating.");
//   event.waitUntil(clearOldCaches());
//   self.clients.claim();
// });

// //  This install files as they are requested
// async function dynamicCaching(request) {
//   const cache = await caches.open(CACHE_NAME);
//   try {
//     const response = await fetch(request);
//     const responseClone = response.clone();
//     await cache.put(request, responseClone);
//     return response;
//   } catch (error) {
//     console.error("Failed to cache core assets:", error);
//     return cache.match(request);
//   }
// }
// //  This clears the cache before new ones are installed
// async function clearOldCaches() {
//   const cacheNames = await caches.keys();
//   return Promise.all(
//     cacheNames
//       .filter((name) => name !== CACHE_NAME)
//       .map((name) => caches.delete(name))
//   );
// }

// //  This get the cached file by checking the cache name first then check online if not found
// async function cacheFirstStrategy(request) {
//   try {
//     const cache = await caches.open(CACHE_NAME);
//     const cachedResponse = await cache.match(request);

//     if (cachedResponse) {
//       return cachedResponse;
//     }

//     const networkResponse = await fetch(request);
//     const responseClone = networkResponse.clone();
//     await cache.put(request, responseClone);
//     return networkResponse;
//   } catch (error) {
//     console.error("Cache first strategy failed:", error);
//     return caches.match("/offline");
//   }
// }

// // self.addEventListener("fetch", (event) => {
// //   const { request } = event;
// //   if (event.request.mode === "navigate") {
// //     event.respondWith(dynamicCaching(request));
// //   } else {
// //     event.respondWith(cacheFirstStrategy(request));
// //   }
// //   console.log("Fetching:", event.request.url);
// // });
