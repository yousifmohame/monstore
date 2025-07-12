import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// استيراد ملف حساب الخدمة مباشرة
const serviceAccount = require('../../serviceAccount.json');

let app: App;

// هذا النمط يضمن تهيئة التطبيق مرة واحدة فقط في بيئة الخادم
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount),
    // قراءة رابط التخزين مباشرة من project_id الموجود في الملف
    storageBucket: `${serviceAccount.project_id}.appspot.com`,
  });
} else {
  app = getApps()[0];
}

// تهيئة خدمات Firebase وتصديرها
const adminDb = getFirestore(app);
const adminAuth = getAuth(app);
const adminStorage = getStorage(app);

// تصدير FieldValue لتسهيل استخدامه في ملفات API
export { adminDb, adminAuth, adminStorage, FieldValue };
