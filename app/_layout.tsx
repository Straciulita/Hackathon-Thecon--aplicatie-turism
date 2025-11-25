import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext';

// === ECRANUL DE RĂMAS BUN (Cu Animație) ===
const GoodbyeScreen = ({ onLoginPress }: { onLoginPress: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Pornim de la invizibil (0)

  useEffect(() => {
    // Animație de Fade In (durată 1 secundă)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.goodbyeContainer, { opacity: fadeAnim }]}>
      <View style={styles.iconCircle}>
        <Ionicons name="cafe" size={50} color="#FFF" />
      </View>
      
      <Text style={styles.goodbyeTitle}>Ne pare rău că pleci!</Text>
      <Text style={styles.goodbyeSubTitle}>
        Sperăm că ai savurat cafeaua. ☕{"\n"}Te așteptăm înapoi oricând pentru un nou vibe!
      </Text>

      <TouchableOpacity style={styles.reloginBtn} onPress={onLoginPress}>
        <Text style={styles.reloginText}>Intră în cont</Text>
        <Ionicons name="log-in-outline" size={20} color="#FFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsNavigationReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isNavigationReady || isLoading) return;

    const inAuthGroup = segments[0] === undefined || segments[0] === 'register';

    // Dacă ești logat și încerci să intri pe Login -> Redirect la Home
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
    
    // NOTĂ: NU facem redirect automat la Logout. 
    // Lăsăm "GoodbyeScreen" să se ocupe de asta vizual.
  }, [isAuthenticated, segments, isLoading, isNavigationReady]);

  // Loading
  if (isLoading || !isNavigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#8B5A3C" />
      </View>
    );
  }

  // === AICI ESTE LOGICA PENTRU LOGOUT ===
  // Dacă utilizatorul nu e logat, dar e încă pe o pagină internă (tabs/details),
  // afișăm ecranul Goodbye. Acesta va sta pe ecran până apeși butonul.
  const inProtectedArea = segments[0] === '(tabs)' || segments[0] === 'details';
  
  if (!isAuthenticated && inProtectedArea) {
    return <GoodbyeScreen onLoginPress={() => router.replace('/')} />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocationProvider>
          <StatusBar style="dark" />
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="register" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="details" options={{ presentation: 'modal' }} />
            </Stack>
          </AuthGuard>
        </LocationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  goodbyeContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8B5A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#8B5A3C',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  goodbyeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  goodbyeSubTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  reloginBtn: {
    flexDirection: 'row',
    backgroundColor: '#8B5A3C',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    gap: 10,
    elevation: 3,
  },
  reloginText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});