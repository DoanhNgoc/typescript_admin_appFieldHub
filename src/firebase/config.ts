import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyCf24iLI8u6sWdyJMNw-Q5_ueJo6Jl38fU",
    authDomain: "sportfields-ff16a.firebaseapp.com",
    databaseURL: "https://sportfields-ff16a-default-rtdb.firebaseio.com",
    projectId: "sportfields-ff16a",
    storageBucket: "sportfields-ff16a.appspot.com",
    messagingSenderId: "442693512571",
    appId: "1:442693512571:web:521cf73c2d61bea12da1de",
    measurementId: "G-1C8J8VTLGH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);