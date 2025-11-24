import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importăm getAuth

// ⚠️ Asigură-te că folosești configurația ta reală
const firebaseConfig = {
  apiKey: "AIzaSyBpKLiHGuovXT9vA7KDs2P_dQqZpXAcsmA",
  authDomain: "hackathon-76265.firebaseapp.com",
  projectId: "hackathon-76265",
  storageBucket: "hackathon-76265.firebasestorage.app",
  messagingSenderId: "1096728468238",
  appId: "1:1096728468238:web:316c6b47144b5e2a0f155f",
};

// Inițializăm Firebase
const app = initializeApp(firebaseConfig);

// Exportăm obiectul de autentificare
export const auth = getAuth(app);