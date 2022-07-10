import { RemixBrowser } from '@remix-run/react';
import { hydrate } from 'react-dom';

hydrate(<RemixBrowser />, document);

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const subscribe = async () => {
  await navigator.serviceWorker.register('./service-worker.js');

  let permission = Notification.permission;
  if (permission !== 'granted') {
    permission = await Notification.requestPermission();
  }

  console.log('Notification:', permission);

  if (permission !== 'granted') {
    return new Error('permission not granted');
  }

  const registration = await navigator.serviceWorker.getRegistration();
  const subscribed = await registration?.pushManager.getSubscription();

  if (subscribed) {
    return;
  }

  const subscription = await registration?.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(window.ENV.VAPID_PUBLIC_KEY),
  });

  const response = await fetch('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(subscription),
  });

  console.log(response);
};

if ('serviceWorker' in navigator) {
  subscribe().catch((error) => console.error);
}
