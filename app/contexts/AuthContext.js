import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig'; 

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsub(); 
  }, []);

  const value = {
    user,
    isAuthenticated: !!user, 
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ AICI ESTE CORECȚIA: Adăugăm 'export'
export function AuthStackRedirect({ children }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const inTabsGroup = segments[0] === '(tabs)';
  
  // Verificăm dacă suntem pe pagina de login sau register (index sau register)
  // Segmentul este gol pentru index sau 'register'
  const isAuthPage = segments.length === 0 || segments[0] === 'register';

  useEffect(() => {
    if (isLoading) return; 

    if (isAuthenticated) {
      // Dacă e logat și e pe pagina de auth, îl trimitem la hartă
      if (isAuthPage) { 
         router.replace('/(tabs)/'); // Navighează la rădăcina tab-urilor (care e map)
      }
    } else {
      // Dacă NU e logat și încearcă să intre în tabs
      if (inTabsGroup) {
         router.replace('/');
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  return children;
}