// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnY7_1L0ujwgONAvi6fV6ZCCJD8mBAoGI",
  authDomain: "smartdct-c05af.firebaseapp.com",
  projectId: "smartdct-c05af",
  storageBucket: "smartdct-c05af.firebasestorage.app",
  messagingSenderId: "262602214961",
  appId: "1:262602214961:web:de619abd823a81152c0f10",
  measurementId: "G-KRRFQ73LJS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

setPersistence(auth, browserLocalPersistence);
export { auth };

//! i0i8Q~jtx7MYOiNQXJHA5wrEJ~zIRzEKcBFA1cFR
