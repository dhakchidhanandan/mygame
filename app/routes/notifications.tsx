import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import db from '~/lib/db';

const webpush = require('web-push');

export const action: ActionFunction = async ({ request }) => {
  try {
    const payload = await request.json();
    const { method } = request;
    const { data } = db;

    console.log('Notifications Payload:', payload);

    const vapidDetails = {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
      subject: process.env.VAPID_SUBJECT,
    };

    const options = {
      TTL: 10000,
      vapidDetails: vapidDetails,
    };

    const notification = {
      title: 'MyGame',
      options: {
        body: `ENOMEM Error`,
      },
    };

    switch (method) {
      case 'POST': {
        data?.subscriptions.forEach(async (subscription) => {
          try {
            await webpush.sendNotification(
              subscription,
              JSON.stringify(notification),
              options
            );
          } catch (error) {
            console.error('sendNotification', error, subscription);
          }
        });
      }
    }

    return json({ success: true }, 200);
  } catch (error) {
    console.error('Notifications', error);
    return json({ success: false }, 500);
  }
};
