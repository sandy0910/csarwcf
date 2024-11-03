// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAmFuWZueUxYUvcXdCyTSxR0Q6fQJcGDFU",
  authDomain: "csarwcf-92685.firebaseapp.com",
  projectId: "csarwcf-92685",
  storageBucket: "csarwcf-92685.firebasestorage.app",
  messagingSenderId: "498635544064",
  appId: "1:498635544064:web:95fde1ac4a30650ed72ae5",
  measurementId: "G-Q8QPV8PXNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireauth = getAuth(app);

export {app, fireauth};