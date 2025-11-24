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
import { useTheme } from '../app/contexts/ThemeContext';

interface AnimatedIconProps {
  color: string;
  size: number;
}

const AnimatedThemeIcon: React.FC<AnimatedIconProps> = ({ color, size }) => {
  const { theme } = useTheme();
  // Valoare partajată pentru scalare (începe la 1 = 100%)
  const scale = useSharedValue(1);
  // Valoare partajată pentru rotație
  const rotation = useSharedValue(0);

  const getThemeIconName = () => {
    if (theme === 'light') return 'sunny';
    if (theme === 'dark') return 'moon';
    return 'desktop';
  };

  // Declanșăm animația de fiecare dată când se schimbă tema
  useEffect(() => {
    // Secvență de animație:
    // 1. Micșorează rapid la 0.5
    // 2. Rotește puțin
    // 3. Revino elastic la mărimea originală (spring)
    scale.value = withSequence(
      withTiming(0.5, { duration: 100, easing: Easing.ease }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );
    
    // Adăugăm și o mică rotație pentru dinamism
    rotation.value = withSequence(
        withTiming( theme === 'dark' ? 360 : 0, { duration: 500 })
    );

  }, [theme]); // Se execută când 'theme' se schimbă

  // Stilul animat aplicat iconiței
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        // Rotație condiționată (doar pentru soare/lună arată bine)
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  // Folosim Animated.createAnimatedComponent pentru a putea anima Ionicons
  const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

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