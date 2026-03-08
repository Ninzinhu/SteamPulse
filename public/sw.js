self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SteamPulse';
  const options = {
    body: data.body,
    data: data.data,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
