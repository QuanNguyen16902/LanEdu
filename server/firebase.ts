import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

// Path to your service account key file
const serviceAccountPath = join(process.cwd(), 'lanedu-54f2c-firebase-adminsdk-fbsvc-283ed03411.json');

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  process.exit(1);
}

export const db = getFirestore();
export const auth = getAuth();
export default admin;
