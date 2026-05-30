import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA41vwqEnPN8YeEhOZgsM69hUONQ7bxvWI",
  authDomain: "sipesat-b51a5.firebaseapp.com",
  databaseURL: "https://sipesat-b51a5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sipesat-b51a5",
  storageBucket: "sipesat-b51a5.firebasestorage.app",
  messagingSenderId: "321065737845",
  appId: "1:321065737845:web:f98000ab5e70cd668da23c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Auth
export const db = getDatabase(app);
export const auth = getAuth(app);

export default app;
