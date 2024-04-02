// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getAuth, TwitterAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
    apiKey: "my-api-key",
    authDomain: "my-auth-domain",
    projectId: "my-project-id",
    storageBucket: "my-storage-bucket",
    messagingSenderId: "my-messaging-",
    appId: "my-app-id",
    measurementId: "my-measure"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const analytics = getAnalytics(app);
const authentication = getAuth(app);
const provider = new TwitterAuthProvider();

export { authentication, db, provider, app };
