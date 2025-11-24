import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Calea corectă din components la contexts
import { useTheme } from '../contexts/ThemeContext'; 

const ThemeToggleButton = () => {
  const { theme, setTheme, COLORS, isDark } = useTheme();

  const getNextTheme = () => {
    switch (theme) {
      case 'system':
        return 'light';
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      default:
        return 'system';
    }
  };

  const getIconName = () => {
    switch (theme) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
        // Arată iconița corespunzătoare stării rezolvate a sistemului
        return isDark ? 'moon' : 'sunny'; 
      default:
        return 'desktop-outline';
    }
  };

  const handlePress = () => {
    const nextTheme = getNextTheme();
    setTheme(nextTheme);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Ionicons 
          name={getIconName()} 
          size={24} 
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  button: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
});

export default ThemeToggleButton;