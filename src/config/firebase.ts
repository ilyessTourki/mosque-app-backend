import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import fs from 'node:fs';
import path from 'node:path';

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT_PATH is missing. Add it to your .env file.',
  );
}

const absolutePath = path.resolve(serviceAccountPath);
const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

export const firebaseMessaging = getMessaging(firebaseApp);