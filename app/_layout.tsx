import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AuthProvider, AuthStackRedirect } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocationProvider>
          <StatusBar style="auto" />
          <AuthStackRedirect>
            <Stack>
              {/* 1. Login Screen (Rădăcina) */}
              <Stack.Screen 
                name="index" 
                options={{ headerShown: false }} 
              />
              
              {/* 2. Register Screen */}
              <Stack.Screen 
                name="register" 
                options={{ headerShown: false }} 
              />

              {/* 3. Tab-urile Principale (Home, Map, etc.) */}
              <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
              />
              
              {/* 4. Detalii (Modal) */}
              <Stack.Screen 
                name="details" 
                options={{ 
                  presentation: 'modal', 
                  headerShown: false 
                }} 
              />
            </Stack>
          </AuthStackRedirect>
        </LocationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}