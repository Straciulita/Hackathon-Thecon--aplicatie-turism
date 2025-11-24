import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { GoogleGenerativeAI } from "@google/generative-ai";

import { useTheme, COLORS_BASE } from './contexts/ThemeContext';
import { useLocations } from './contexts/LocationContext';

// 🔥 API KEY — IMPORTANT: pentru hackathon e OK să fie aici
const GEMINI_API_KEY = "AIzaSyBvo0FEo61D-J00T2bdFb6EmunkpU0Qt88";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function DetailsScreen() {
  const { COLORS, isDark } = useTheme();
  const router = useRouter();
  const { locationId } = useLocalSearchParams();
  const { locations } = useLocations();

  const selectedLocation = locations.find(loc => loc.id.toString() === locationId);

  const [currentDescription, setCurrentDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVibeGenerated, setIsVibeGenerated] = useState(false);

  // --------------------------------------------------
  // Load description
  // --------------------------------------------------
  useEffect(() => {
    if (selectedLocation) {
      setCurrentDescription(selectedLocation.short_description || "Descriere indisponibilă.");
    }
  }, [selectedLocation]);

  // --------------------------------------------------
  // AI / Gemini – Generate Vibe
  // --------------------------------------------------
  const generateVibeDescription = useCallback(async () => {
    if (isLoading || !selectedLocation) return;

    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const prompt = `
        Ești un ghid turistic local super friendly .
        Generează o descriere vibe-check scurtă pentru locul "${selectedLocation.name}".
        Descriere oficială: "${selectedLocation.short_description}".
        Adresă: "${selectedLocation.address}".
        În stil Gen Z/Millennials, 3-4 propoziții MAX, în română, cu emoji-uri.
      `;

      const result = await model.generateContent(prompt);
      const aiText = result.response.text();

      setCurrentDescription(aiText);
      setIsVibeGenerated(true);

    } catch (err) {
      console.error("AI Error:", err);
      Alert.alert("Eroare AI", "Nu am putut genera vibe-ul. Verifică conexiunea sau cheia API.");
    } finally {
      setIsLoading(false);
    }

  }, [selectedLocation, isLoading]);

  // --------------------------------------------------
  // WhatsApp Reservation
  // --------------------------------------------------
  const handleReserve = () => {
    if (!selectedLocation) return;

    const url = `whatsapp://send?text=Salut! Aș vrea să fac o rezervare la ${selectedLocation.name}.`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Eroare", "Nu pot deschide WhatsApp.");
    });
  };

  // --------------------------------------------------
  // Navigation Header
  // --------------------------------------------------
  const headerStyle = {
    headerShown: true,
    title: selectedLocation?.name || "Detalii",
    headerStyle: { backgroundColor: COLORS.background },
    headerTintColor: COLORS.primary,
    headerShadowVisible: false,
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
      </TouchableOpacity>
    )
  };

  // --------------------------------------------------
  // Loading State (location not ready)
  // --------------------------------------------------
  if (!selectedLocation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
        <Stack.Screen options={headerStyle} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Stack.Screen options={headerStyle} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* MAIN IMAGE */}
        <Image
          source={{ uri: selectedLocation.image_url }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View style={styles.contentPadding}>

          {/* Title + Rating */}
          <View style={styles.titleRow}>
            <Text style={[styles.locationTitle, { color: COLORS.textPrimary }]}>
              {selectedLocation.name}
            </Text>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFB800" />
              <Text style={styles.ratingText}>{selectedLocation.rating}</Text>
            </View>
          </View>

          {/* Address */}
          <Text style={[styles.addressText, { color: COLORS_BASE.textLight }]}>
            <Ionicons name="location-outline" size={14} color={COLORS_BASE.textLight} /> {selectedLocation.address}
          </Text>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.descriptionHeader, { color: COLORS.primary }]}>
              {isVibeGenerated ? "✨ Vibe Generat de AI" : "Descriere"}
            </Text>

            <Text style={[styles.descriptionText, { color: COLORS.textPrimary }]}>
              {currentDescription}
            </Text>
          </View>

          {/* AI Button */}
          {!isVibeGenerated && (
            <TouchableOpacity
              style={[styles.aiButton, { backgroundColor: COLORS.primary }]}
              onPress={generateVibeDescription}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                  <Text style={styles.aiButtonText}>Generează Vibe Check ✨</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* WhatsApp Button */}
          <TouchableOpacity
            style={[styles.reserveButton, { borderColor: COLORS.primary }]}
            onPress={handleReserve}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            <Text style={[styles.reserveButtonText, { color: COLORS.primary }]}>Rezervă pe WhatsApp</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  mainImage: {
    width: "100%",
    height: 280,
    backgroundColor: COLORS_BASE.secondary,
  },
  contentPadding: {
    paddingHorizontal: 20,
    marginTop: 25
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  locationTitle: { fontSize: 26, fontWeight: "800", flex: 1, paddingRight: 10 },
  ratingContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,184,0,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  ratingText: { marginLeft: 4, fontSize: 16, fontWeight: "700", color: "#D49500" },
  addressText: { fontSize: 15, marginBottom: 25 },
  descriptionSection: { marginBottom: 10 },
  descriptionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  descriptionText: { fontSize: 16, lineHeight: 26 },

  aiButton: {
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  aiButtonText: { color: COLORS_BASE.white, fontSize: 16, fontWeight: "700" },

  reserveButton: {
    marginTop: 15,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  reserveButtonText: { marginLeft: 10, fontSize: 16, fontWeight: "700" },
});
