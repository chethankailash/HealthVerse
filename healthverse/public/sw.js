self.addEventListener("install", (event) => {
  console.log("[HealthVerse] Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[HealthVerse] Service Worker activated");
});

self.addEventListener("fetch", (event) => {
  // Basic pass-through fetch
});
