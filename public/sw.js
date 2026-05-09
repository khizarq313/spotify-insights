// This service worker immediately unregisters itself.
// It exists only to clear any stale service worker that browsers may have cached.
self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", () => {
  self.registration.unregister().then(() => {
    return self.clients.matchAll()
  }).then(clients => {
    clients.forEach(client => client.navigate(client.url))
  })
})
