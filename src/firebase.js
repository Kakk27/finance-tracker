import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCa15wDov6YIKi9YTLOhFmGmL89dz7Xfc0",
    authDomain: "finance-tracker-46a75.firebaseapp.com",
    projectId: "finance-tracker-46a75",
    storageBucket: "finance-tracker-46a75.firebasestorage.app",
    messagingSenderId: "555628422868",
    appId: "1:555628422868:web:39e09152b475c77557fd41",
    measurementId: "G-K9QDX8S6R8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
