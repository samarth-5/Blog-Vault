// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,//as we are using vite we are not using process
  authDomain: "blog-vault-6bc6d.firebaseapp.com",
  projectId: "blog-vault-6bc6d",
  storageBucket: "blog-vault-6bc6d.appspot.com",
  messagingSenderId: "482155440400",
  appId: "1:482155440400:web:3dce2954223a9219ad1d95"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);