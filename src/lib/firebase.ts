import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCghxKwyVN2t_YH0t11sS8H_t7bibcjHqA",
  authDomain: "tiem-nho-nha-wyn.firebaseapp.com",
  projectId: "tiem-nho-nha-wyn",
  storageBucket: "tiem-nho-nha-wyn.firebasestorage.app",
  messagingSenderId: "1017128977590",
  appId: "1:1017128977590:web:c375e98c3e1360e8a01217"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
