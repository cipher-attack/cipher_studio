// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXMiMCkivDSI6bol0EtBafEI3McGNmdkA",
  authDomain: "cipher-studio.firebaseapp.com",
  projectId: "cipher-studio",
  storageBucket: "cipher-studio.firebasestorage.app",
  messagingSenderId: "103353734824",
  appId: "1:103353734824:web:ae89961928ed5453d5949d",
  measurementId: "G-DLNXXKH641"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
