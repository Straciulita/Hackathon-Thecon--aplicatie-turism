import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 🆕 Importăm Context-ul de Autentificare și Funcțiile de Rutare
import { AuthProvider, AuthStackRedirect, useAuth } from './contexts/AuthContext';

// Importă Context-ul tău de Harta/Temă
import { ThemeProvider } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext';
import React from 'react';


// Componenta care afișează stiva de navigare
function RootLayoutContent() {
  const { isLoading } = useAuth(); // Folosim useAuth pentru a verifica starea de încărcare

  if (isLoading) {
    // Afișăm un loading indicator la pornire
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return (
    <Stack>
      {/* Login Screen (app/index.tsx) - Fără header, Punct de intrare */}
      <Stack.Screen name="index" options={{ headerShown: false }} /> 
      
      {/* Register Screen (app/register.tsx) - Fără header */}
      <Stack.Screen name="register" options={{ headerShown: false }} /> 

      {/* Grup de Tabs (Harta și Profil) - Protejat de AuthStackRedirect */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Detalii (Modal) */}
      <Stack.Screen name="details" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}


// Provider-ii încapsulează întreaga aplicație
export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocationProvider>
          <StatusBar style="dark" />
          {/* Componenta care face redirect-ul Login/Tabs */}
          <AuthStackRedirect>
             <RootLayoutContent />
          </AuthStackRedirect>
        </LocationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}