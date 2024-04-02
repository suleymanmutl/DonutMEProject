// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getAuth, TwitterAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDR1HmJgzE8rZ2OJ-uSU-NebszJf0eDGNQ",
    authDomain: "donutme-0.firebaseapp.com",
    projectId: "donutme-0",
    storageBucket: "donutme-0.appspot.com",
    messagingSenderId: "592825824839",
    appId: "1:592825824839:web:2d2d0c0dbeafcb3d396362",
    measurementId: "G-Y1RV5135KY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const analytics = getAnalytics(app);
const authentication = getAuth(app);
const provider = new TwitterAuthProvider();

export { authentication, db, provider, app };
