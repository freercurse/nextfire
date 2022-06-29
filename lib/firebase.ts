
import {initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { collection, Firestore, getDocs, getFirestore, limit, query, where, Timestamp} from 'firebase/firestore'
import { getStorage } from'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt3qecfcRgt8sdNLe2dGLH5d8p-rIKMBM",
  authDomain: "bloggle-d625b.firebaseapp.com",
  projectId: "bloggle-d625b",
  storageBucket: "bloggle-d625b.appspot.com",
  messagingSenderId: "368220780686",
  appId: "1:368220780686:web:3b9e8acfb6c372fa1ef1df",
  measurementId: "G-HVHF97C1XL"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)

export async function getAccountWithUsername(username) {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('username', '==', username), limit(1))
  const userDoc = (await getDocs(q)).docs[0];  
  return userDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}

export const fromMillis = Timestamp.fromMillis;