import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
// Importăm noua componentă animată (asigură-te că calea e corectă)
import AnimatedThemeIcon from '../../components/AnimatedThemeIcon';

export default function TabLayout() {
  const { COLORS, isDark, theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    // Logica ciclică: Light -> Dark -> System -> Light
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? COLORS.darkBackground : COLORS.white,
          borderTopColor: isDark ? COLORS.secondary : COLORS.light,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 10, // Adăugăm puțină umbră pentru estetică
        },
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarActiveTintColor: COLORS.primary, 
        headerShown: false,
        // Ascundem etichetele text pentru un aspect mai curat
        tabBarShowLabel: false, 
      }}
    >
      {/* 1. Hartă (Stânga) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hartă',
          tabBarIcon: ({ color, focused }) => (
            // Folosim iconița normală, poate puțin mai mare când e focusată
            <Ionicons name={focused ? "map" : "map-outline"} size={28} color={color} />
          ),
        }}
      />
      
      {/* 2. Lista (Mijloc) */}
      <Tabs.Screen
        name="list"
        options={{
          title: 'Locații',
          tabBarIcon: ({ color, focused }) => (
             <Ionicons name={focused ? "list" : "list-outline"} size={30} color={color} />
          ),
        }}
      />
      
      {/* 3. Temă (Dreapta - Buton Activ Animat) */}
      <Tabs.Screen
        name="toggle-theme" 
        options={{
          title: 'Temă',
          // AICI FOLOSIM COMPONENTA ANIMATĂ
          tabBarIcon: ({ color }) => (
            <AnimatedThemeIcon color={color} size={28} />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            handleThemeToggle();
          },
        })}
      />

      {/* Ascundem restul rutelor */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="theme-settings" options={{ href: null }} />
    </Tabs>
  );
}