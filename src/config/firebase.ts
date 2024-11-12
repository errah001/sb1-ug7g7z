import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBiY8RqHf6UgaGz6KIJ_KG_zbgHxRCJj5Q",
  authDomain: "taskmaster-bolt.firebaseapp.com",
  projectId: "taskmaster-bolt",
  storageBucket: "taskmaster-bolt.appspot.com",
  messagingSenderId: "450121548797",
  appId: "1:450121548797:web:8b9b9b0b0b0b0b0b0b0b0b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);