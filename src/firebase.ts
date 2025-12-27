import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXMiMckivDSi6bol0EtBafEI3McSNmdkA",
  authDomain: "cipher-studio.firebaseapp.com",
  projectId: "cipher-studio",
  storageBucket: "cipher-studio.firebasestorage.app",
  messagingSenderId: "103353734824",
  appId: "1:103353734824:web:ae89961928ed5453d5949d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
