import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import db from '~/lib/db';

export const action: ActionFunction = async ({ request }) => {
  try {
    const { method } = request;
    const { data } = db;
    const payload = await request.json();

    switch (method) {
      case 'POST': {
        data?.subscriptions.push(payload);
        db.write();
      }
    }

    return json({ success: true }, 200);
  } catch (error) {
    console.error('Subscriptions', error);
    return json({ success: false }, 500);
  }
};
