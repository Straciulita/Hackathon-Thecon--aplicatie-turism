import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext'; 
import AnimatedThemeIcon from '../../components/AnimatedThemeIcon';

export default function TabLayout() {
  const { COLORS, isDark, theme, setTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleThemeToggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // ✅ AM MĂRIT ÎNĂLȚIMEA PENTRU A NU TĂIA ICONIȚELE
  const BASE_TAB_HEIGHT = 90; 
  const EXTRA_PADDING_BOTTOM = Platform.OS === 'ios' ? 20 : 15;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? COLORS.darkBackground : COLORS.white,
          borderTopColor: isDark ? COLORS.secondary : COLORS.light,
          height: BASE_TAB_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom + EXTRA_PADDING_BOTTOM,
          paddingTop: 15, // Spațiu mai mare sus
          elevation: 0,
          borderTopWidth: 1, 
        },
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarActiveTintColor: COLORS.primary, 
        headerShown: false, 
        tabBarLabelStyle: {
            fontSize: 11, 
            fontWeight: '600',
            marginTop: 5,
        }
      }}
    >
      {/* 1. HOME */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Acasă',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />,
        }}
      />

      {/* 2. HARTĂ (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hartă',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "map" : "map-outline"} size={26} color={color} />,
        }}
      />
      
      {/* 3. MATCH (Tinder Style) */}
      <Tabs.Screen
        name="MatchScreen" 
        options={{
          title: 'Match',
          // ✅ Iconiță mărită și vizibilă
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
                name={focused ? "fire" : "fire-off"} 
                size={32} // Puțin mai mare
                color={focused ? "#E91E63" : color} 
            />
          ),
        }}
      />

      {/* 4. LISTĂ */}
      <Tabs.Screen
        name="list"
        options={{
          title: 'Locații',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "list" : "list-outline"} size={28} color={color} />,
        }}
      />

      {/* 5. PROFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />,
        }}
      />
      
      {/* 6. TEMĂ (Buton) */}
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

      {/* Rute Ascunse */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="theme-settings" options={{ href: null }} />
    </Tabs>
  );
}