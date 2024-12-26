// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  //apiKey: "AIzaSyDXwTyHy5MmjYwIz-U3OzaSUV3ACUy9Fq8",
  authDomain: "docease-f96e4.firebaseapp.com",
  projectId: "docease-f96e4",
  storageBucket: "docease-f96e4.firebasestorage.app",
  messagingSenderId: "253030624442",
  appId: "1:253030624442:web:150691b71a12f0e205a683"
};

// Initialize Firebase
export const app: any = initializeApp(firebaseConfig);