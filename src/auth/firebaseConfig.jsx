// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfgZVHrJXShqj7RGbDTzlG8nJJzGE6nAo",
  authDomain: "agentify-4e0f9.firebaseapp.com",
  databaseURL: "https://agentify-4e0f9-default-rtdb.firebaseio.com",
  projectId: "agentify-4e0f9",
  storageBucket: "agentify-4e0f9.appspot.com",
  messagingSenderId: "733211006798",
  appId: "1:733211006798:web:85f441af5852193079b01f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
