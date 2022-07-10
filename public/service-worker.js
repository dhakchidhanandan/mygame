self.addEventListener('push', (event) => {
  let data = event.data.json();
  console.log('Push', data);
  const { title, options } = data;
  event.waitUntil(self.registration.showNotification(title, options));
});
