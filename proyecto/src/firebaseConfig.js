import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAO77KezNnh7Ln7h_Md8HFk15oQTlnJlJ8",
  authDomain: "digiapi-cb2e5.firebaseapp.com",
  projectId: "digiapi-cb2e5",
  storageBucket: "digiapi-cb2e5.firebasestorage.app",
  messagingSenderId: "582455450106",
  appId: "1:582455450106:web:8ae7c267b6acf049086c43"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db };