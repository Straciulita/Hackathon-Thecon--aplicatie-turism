import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';

interface AnimatedIconProps {
  color: string;
  size: number;
}

// Creăm un component animat din Ionicons
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const AnimatedThemeIcon: React.FC<AnimatedIconProps> = ({ color, size }) => {
  const { theme } = useTheme();
  
  // Valori partajate pentru animație
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const getThemeIconName = () => {
    if (theme === 'light') return 'sunny';
    if (theme === 'dark') return 'moon';
    return 'desktop'; // sau 'contrast' pentru system
  };

  // Declanșăm animația la schimbarea temei
  useEffect(() => {
    // 1. Efect de "Pop" (micșorare rapidă -> revenire elastică)
    scale.value = withSequence(
      withTiming(0.5, { duration: 100, easing: Easing.ease }),
      withSpring(1, { damping: 12, stiffness: 100 })
    );
    
    // 2. Efect de rotație
    // Dacă e dark mode, rotim la 360, altfel înapoi la 0
    rotation.value = withSpring(theme === 'dark' ? 180 : 0, { damping: 15 });

  }, [theme]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  return (
    <AnimatedIonicons
      name={getThemeIconName() as any}
      size={size}
      color={color}
      style={animatedStyle}
    />
  );
};

export default AnimatedThemeIcon;