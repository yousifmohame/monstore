import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAh4F4GJHzgslgFlYZXaJ49IaOc50owigc",
  authDomain: "filmy-6bd1a.firebaseapp.com",
  projectId: "filmy-6bd1a",
  storageBucket: "filmy-6bd1a.appspot.com",
  messagingSenderId: "409354230199",
  appId: "1:409354230199:web:87c1cedc8d272fa697b032"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
