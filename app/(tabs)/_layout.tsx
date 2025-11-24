import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform } from 'react-native';
// 1. Ne asigurăm că avem importul pentru Safe Area
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext'; 
import AnimatedThemeIcon from '../../components/AnimatedThemeIcon';

export default function TabLayout() {
  const { COLORS, isDark, theme, setTheme } = useTheme();
  // 2. Obținem dimensiunile sigure
  const insets = useSafeAreaInsets();

  const handleThemeToggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // CONSTANTE PENTRU SPAȚIERE
  const BASE_TAB_HEIGHT = 75; // Mai înaltă decât înainte (era ~60)
  const EXTRA_PADDING_BOTTOM = Platform.OS === 'ios' ? 15 : 20; // Spațiu extra jos

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? COLORS.darkBackground : COLORS.white,
          borderTopColor: isDark ? COLORS.secondary : COLORS.light,
          
          // ✅ 3. Calculăm înălțimea totală dinamic (Bază + Safe Area Bottom)
          height: BASE_TAB_HEIGHT + insets.bottom,

          // ✅ 4. Adăugăm padding generos jos (Safe Area + Extra spațiu)
          paddingBottom: insets.bottom + EXTRA_PADDING_BOTTOM,
          
          paddingTop: 15, // Puțin mai mult spațiu și sus
          elevation: 0, // Fără umbră standard pe Android (folosim borderTop)
          borderTopWidth: 1, // Linie subtilă sus
        },
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarActiveTintColor: COLORS.primary, 
        headerShown: false, 
        tabBarLabelStyle: {
            fontSize: 12, // Font puțin mai mare la etichete
            fontWeight: '600',
            marginTop: 5,
        }
      }}
    >
      {/* 1. Hartă */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hartă',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "map" : "map-outline"} size={26} color={color} />,
        }}
      />
      
      {/* 2. Lista */}
      <Tabs.Screen
        name="list"
        options={{
          title: 'Locații',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "list" : "list-outline"} size={28} color={color} />,
        }}
      />

      {/* 3. Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />,
        }}
      />
      
      {/* 4. Temă (Buton Animat) */}
      <Tabs.Screen
        name="toggle-theme" 
        options={{
          title: 'Temă',
          tabBarIcon: ({ color }) => <AnimatedThemeIcon color={color} size={26} />,
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            handleThemeToggle();
          },
        })}
      />

      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="theme-settings" options={{ href: null }} />
    </Tabs>
  );
}