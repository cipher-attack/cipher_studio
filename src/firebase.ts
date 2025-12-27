
// አስፈላጊ የሆኑትን ላይብረሪዎች ማስገባት
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// ያንተ ልዩ የ Firebase መለያዎች (ከ Firebase Console የተገኘ)
const firebaseConfig = {
  apiKey: "AIzaSyAXMiMCkivDSI6bol0EtBafEI3McGNmdkA", // ይህ ቁልፍ አሁን ኮዱ ውስጥ ስላለ "API Key Not Valid" ስህተት አይመጣም
  authDomain: "cipher-studio.firebaseapp.com",
  projectId: "cipher-studio",
  storageBucket: "cipher-studio.firebasestorage.app",
  messagingSenderId: "103353734824",
  appId: "1:103353734824:web:ae89961928ed5453d5949d",
  measurementId: "G-DLNXXKH641"
};

// Firebase-ን ማስጀመር
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ለሌሎች ፋይሎች (እንደ EliteAuth.tsx) የሚጋሩ መረጃዎች
// እነዚህ መስመሮች የግድ 'export' መባል አለባቸው!
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// አማራጭ፡ የ Google Provider ኮንፊገሬሽን
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
