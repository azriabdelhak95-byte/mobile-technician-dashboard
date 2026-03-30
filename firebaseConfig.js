import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tes codes Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDol5p80ZBjPJl0lAG1yz0r693wOvfpyE0",
  authDomain: "interventions-app-5d336.firebaseapp.com",
  projectId: "interventions-app-5d336",
  storageBucket: "interventions-app-5d336.firebasestorage.app", // <--- Important pour les photos
  messagingSenderId: "886051666646",
  appId: "1:886051666646:web:4b337f43536f3dada2e777"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export des outils (On les exporte une seule fois proprement)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);