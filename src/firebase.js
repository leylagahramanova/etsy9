// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoYkrN12kMUKjUVu41zuVWZ1_zq9LZzUs",
  authDomain: "etsy-6869c.firebaseapp.com",
  projectId: "etsy-6869c",
  storageBucket: "etsy-6869c.appspot.com",
  messagingSenderId: "151411796416",
  appId: "1:151411796416:web:7c6235a059c5fde7b98025",
  measurementId: "G-MKF809T59H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export { auth, provider };
