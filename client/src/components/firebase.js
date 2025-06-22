// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvTKajp5GOZHMmTxbKxBh1aC8U7d6yIlw",
  authDomain: "techvision-673c9.firebaseapp.com",
  projectId: "techvision-673c9",
  storageBucket: "techvision-673c9.firebasestorage.app",
  messagingSenderId: "444783923192",
  appId: "1:444783923192:web:b079a8a9dda9a63d3fd00d",
  measurementId: "G-F5QYCEGJRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db=getFirestore(app);
export default app;