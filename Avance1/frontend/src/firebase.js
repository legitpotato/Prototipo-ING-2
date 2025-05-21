// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDpwYagIWzNxz_IhorqrYEd-6WaS1dQpE0",
    authDomain: "comunired-96f92.firebaseapp.com",
    projectId: "comunired-96f92",
    storageBucket: "comunired-96f92.firebasestorage.app",
    messagingSenderId: "378640608198",
    appId: "1:378640608198:web:104b6aaed5359968cd20c7"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
