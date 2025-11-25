import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🎨 PALETA DE CULORI CENTRALIZATĂ (Coffee & Travel Vibe)
export const COLORS_PALETTE = {
  // Culori principale din imagine
  darkBrown: '#4A3B32',   // Maro închis (Text, Titluri, Elemente tari)
  caramel: '#C08552',     // Caramel/Bronz (Brand Color, Butoane, Iconițe active)
  cream: '#FDF5E6',       // Crem deschis / "Old Lace" (Fundal Light Mode)
  blue: '#90C8D6',        // Bleu (Accente, Link-uri, Nice to Have)
  
  // Culori utilitare
  white: '#FFFFFF',
  black: '#1A1A1A',
  darkGray: '#333333',
  lightGray: '#E0E0E0',
  error: '#FF5252',
  success: '#4CAF50',
};

// Maparea culorilor pe teme (Light vs Dark)
export const COLORS_BASE = {
  light: {
    primary: COLORS_PALETTE.caramel,
    secondary: COLORS_PALETTE.blue,
    background: COLORS_PALETTE.cream,
    card: COLORS_PALETTE.white,
    textPrimary: COLORS_PALETTE.darkBrown,
    textSecondary: '#8D6E63',
    textLight: '#A1887F',
    border: '#D7CCC8',
    white: COLORS_PALETTE.white,
    error: COLORS_PALETTE.error,
    success: COLORS_PALETTE.success,
    
    tabBarActive: COLORS_PALETTE.caramel,
    tabBarInactive: '#A1887F',
  },
  dark: {
    primary: COLORS_PALETTE.caramel,
    // FIX: Secondary (Blue) mai vizibil
    secondary: '#B3E5FC',                 
    // FIX: Fundal foarte închis (nu negru, dar aproape)
    background: '#121212',            
    // FIX: Card (elemente plutitoare) gri mediu/închis pentru contrast maxim
    card: '#222222',                  
    textPrimary: COLORS_PALETTE.white, // Text alb pur
    textSecondary: '#BBBBBB',          // Text gri deschis
    textLight: '#666666',              // Text mai șters
    border: '#333333',
    white: COLORS_PALETTE.white,
    error: '#FF8A80',
    success: '#81C784',

    tabBarActive: COLORS_PALETTE.caramel,
    tabBarInactive: '#A1A1A1', // Iconițe inactive mai vizibile
  }
};

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  COLORS: typeof COLORS_BASE.light;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [isReady, setIsReady] = useState(false);

  // 1. Încărcăm tema salvată la pornire
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (e) {
        console.log('Eroare la încărcarea temei:', e);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  // 2. Funcție pentru salvarea și schimbarea temei
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('app_theme', newTheme);
    } catch (e) {
      console.log('Eroare la salvarea temei:', e);
    }
  };

  // Calculăm dacă e Dark Mode efectiv
  const isDark = theme === 'system' ? systemScheme === 'dark' : theme === 'dark';
  
  // Alegem setul de culori potrivit
  const COLORS = isDark ? COLORS_BASE.dark : COLORS_BASE.light;

  if (!isReady) {
    return null; // Sau un LoadingScreen simplu
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, COLORS, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};