import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; 

export default function TabLayout() {
  const { COLORS, isDark, theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return 'sunny';
    if (theme === 'dark') return 'moon';
    return 'desktop';
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
        },
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarActiveTintColor: COLORS.primary, 
        headerShown: false, 
      }}
    >
      {/* 1. MODIFICAT: Harta se încarcă acum din 'map.tsx' */}
      <Tabs.Screen
        name="map" 
        options={{
          title: 'Hartă',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
        }}
      />
      
      {/* 2. Lista */}
      <Tabs.Screen
        name="list"
        options={{
          title: 'Locații',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={28} color={color} />,
        }}
      />
      
      {/* 3. Temă */}
      <Tabs.Screen
        name="toggle-theme" 
        options={{
          title: 'Temă',
          tabBarIcon: ({ color }) => <Ionicons name={getThemeIcon() as any} size={24} color={color} />,
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
      
      {/* IMPORTANT: Ascundem și 'index' dacă a rămas vreun fișier rezidual */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}