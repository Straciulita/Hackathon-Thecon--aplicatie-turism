import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

// EXPORTĂM COLORS_BASE pentru a fi folosit în StyleSheet.create din alte fișiere (fără a folosi hook-ul)
export const COLORS_BASE = {
  primary: '#8B5A3C', // Maro închis
  secondary: '#C4956C', // Maro deschis/Bej
  light: '#F5E6D3', // Fundal Light Mode
  accent: '#88B5C5', // Albastru
  white: '#FFFFFF',
  text: '#2C2C2C', // Text Light Mode
  textDark: '#F5F5F5', // Text Dark Mode
  textLight: '#6B6B6B', // Text secundar
  darkBackground: '#1E1E1E', // Fundal Dark Mode
};

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (mode: ThemeMode) => void;
  COLORS: typeof COLORS_BASE & {
    background: string;
    textPrimary: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState<ThemeMode>('system');

  const resolvedTheme = useMemo(() => {
    return userTheme === 'system' ? (systemScheme || 'light') : userTheme;
  }, [userTheme, systemScheme]);

  const isDark = resolvedTheme === 'dark';

  const contextValue = useMemo(() => {
    const background = isDark ? COLORS_BASE.darkBackground : COLORS_BASE.light;
    const textPrimary = isDark ? COLORS_BASE.textDark : COLORS_BASE.text;

    const COLORS_THEMED = {
      ...COLORS_BASE,
      background,
      textPrimary,
    };

    return {
      theme: userTheme,
      isDark,
      setTheme: setUserTheme,
      COLORS: COLORS_THEMED,
    };
  }, [userTheme, isDark]);

  return (
    <ThemeContext.Provider value={contextValue}>
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