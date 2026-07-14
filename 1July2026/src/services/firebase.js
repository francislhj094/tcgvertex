import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWD4GMcO8YkfT8izcPssbkGUob_-tIi2o",
  authDomain: "tcgvertex.firebaseapp.com",
  projectId: "tcgvertex",
  storageBucket: "tcgvertex.firebasestorage.app",
  messagingSenderId: "262645645555",
  appId: "1:262645645555:web:ca9a665d227cbd9ae57786",
  measurementId: "G-JMCL45TRZP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
