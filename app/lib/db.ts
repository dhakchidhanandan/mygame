import { LowSync, JSONFileSync } from 'lowdb';
const path = require('path');

type Data = {
  subscriptions: Subscription[];
};
interface Subscription {
  endpoint: string;
  expirationTime: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let db: LowSync<Data>;

declare global {
  var __db: LowSync<Data> | undefined;
}

if (process.env.NODE_ENV === 'production') {
  const adapter = new JSONFileSync<Data>(
    path.join(process.env.LOWDB_JSON, 'subscriptions.json')
  );
  db = new LowSync(adapter);
  db.read();
} else {
  if (!global.__db) {
    const adapter = new JSONFileSync<Data>(
      path.join(process.env.LOWDB_JSON, 'subscriptions.json')
    );
    global.__db = new LowSync(adapter);
    global.__db.read();
  }
  db = global.__db;
}

db.data ||= { subscriptions: [] };

export default db;
