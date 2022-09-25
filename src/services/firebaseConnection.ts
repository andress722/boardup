import { initializeApp } from "firebase/app";
import 'firebase/firestore'

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA14r2dKevHlouKxZBdNoPPvFkAJ3j6K0w",
  authDomain: "boardapp-88f19.firebaseapp.com",
  projectId: "boardapp-88f19",
  storageBucket: "boardapp-88f19.appspot.com",
  messagingSenderId: "485245406357",
  appId: "1:485245406357:web:8bb13e7da578fab5679f9c",
  measurementId: "G-WH6ZH9EWWG"
};


if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;