self.addEventListener('push', function (event) {
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    image: data.image,
    vibrate: data.vibrate,
    sound: data.sound,
    data: data.data,
    actions: data.actions,
    dir: data.dir || 'auto',
    tag: data.tag,
    renotify: data.renotify,
    silent: data.silent,
    requireInteraction: data.requireInteraction,
    sticky: data.sticky,
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
})
