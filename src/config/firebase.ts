import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import fs from "node:fs";
import path from "node:path";

function getServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    return JSON.parse(serviceAccountJson);
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath) {
    const absolutePath = path.resolve(serviceAccountPath);
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  }

  throw new Error(
    "Firebase credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_JSON on Railway or FIREBASE_SERVICE_ACCOUNT_PATH locally.",
  );
}

const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(getServiceAccount()),
      })
    : getApps()[0];

export const firebaseMessaging = getMessaging(firebaseApp);