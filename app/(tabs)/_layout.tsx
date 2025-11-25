import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function TabLayout() {
  const { COLORS } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        
        tabBarActiveTintColor: COLORS.primary, 
        tabBarInactiveTintColor: COLORS.textSecondary,
        
        tabBarStyle: {
          backgroundColor: COLORS.card, 
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 90,
          paddingBottom: 15,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
      }}
    >
      {/* 1. HOME (EXPLORE) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
          // unmountOnBlur a fost eliminat pentru a rezolva eroarea 2322
        }}
      />

      {/* 2. LISTA (FEED) */}
      <Tabs.Screen
        name="list"
        options={{
          title: 'Listă',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          // unmountOnBlur a fost eliminat
        }}
      />
      
      {/* 3. HARTA (MAP) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hartă',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
          // unmountOnBlur a fost eliminat
        }}
      />

      {/* 4. VIBE MATCH */}
      <Tabs.Screen
        name="MatchScreen"
        options={{
          title: 'Vibe',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          // unmountOnBlur a fost eliminat
        }}
      />

      {/* 5. PROFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          // unmountOnBlur a fost eliminat
        }}
      />
    </Tabs>
  );
}