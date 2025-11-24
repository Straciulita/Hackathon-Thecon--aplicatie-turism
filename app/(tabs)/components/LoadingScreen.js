import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../Login/styles';

const LOADING_MESSAGES = [
  "Încălzim espressorul... ☕",
  "Descoperim locuri noi... 📍",
  "Pregătim recomandările... ✨",
  "Se macină boabele... 🌱",
  "Aproape gata..."
];

export default function LoadingScreen() {
  const scale = useRef(new Animated.Value(1)).current;
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Puls simplu
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Schimbare mesaje
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="coffee" size={60} color={COLORS.white} />
        </View>
      </Animated.View>

      <Text style={styles.loadingText}>
        {LOADING_MESSAGES[messageIndex]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  loadingText: {
    color: COLORS.white,
    fontSize: 18,
    marginTop: 30,
    opacity: 0.9,
    letterSpacing: 1,
    fontWeight: '600',
    textAlign: 'center',
  },
});
