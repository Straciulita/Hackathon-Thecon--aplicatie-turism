import { initializeApp } from "firebase/app";
// ✅ 1. Importăm getAuth (lipsea înainte)
import { getAuth } from "firebase/auth";

// ⚠️ Configurația ta Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBpKLiHGuovXT9vA7KDs2P_dQqZpXAcsmA",
  authDomain: "hackathon-76265.firebaseapp.com",
  projectId: "hackathon-76265",
  storageBucket: "hackathon-76265.firebasestorage.app",
  messagingSenderId: "1096728468238",
  appId: "1:1096728468238:web:316c6b47144b5e2a0f155f",
  // Am scos measurementId pentru că ține de Analytics
};

// Inițializăm Firebase
const app = initializeApp(firebaseConfig);


// ✅ 2. Exportăm auth corect
export const auth = getAuth(app);