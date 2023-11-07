import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvBBa0qCqfrTtECku9kpJrtrCgrjXP9xs",
  authDomain: "react-chess-c99aa.firebaseapp.com",
  projectId: "react-chess-c99aa",
  storageBucket: "react-chess-c99aa.appspot.com",
  messagingSenderId: "646832927802",
  appId: "1:646832927802:web:816d35d708b6a82137b103"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };