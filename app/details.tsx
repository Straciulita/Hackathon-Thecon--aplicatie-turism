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

import { useTheme, COLORS_BASE } from './contexts/ThemeContext';
import { useLocations } from './contexts/LocationContext';

const HF_API_KEY = "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";

// ✅ MODEL NOU (VECHI & STABIL): Google Flan-T5 Large
// Acesta este mult mai probabil să fie disponibil pe API-ul gratuit.
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

export default function DetailsScreen() {
  const { COLORS, isDark } = useTheme();
  const router = useRouter();
  const { locationId } = useLocalSearchParams();
  const { locations } = useLocations();

  const selectedLocation = locations.find(loc => loc.id.toString() === locationId);

  const [currentDescription, setCurrentDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVibeGenerated, setIsVibeGenerated] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      setCurrentDescription(selectedLocation.short_description || "Descriere indisponibilă.");
    }
  }, [selectedLocation]);

  // 🛡️ FALLBACK: Generator Local (Plasă de siguranță)
  const generateLocalFallback = () => {
    const name = selectedLocation?.name || "";
    const rating = selectedLocation?.rating || 0;
    
    let vibe = "✨ Vibe Check (Mod Offline): ";
    
    if (rating >= 4.5) {
        vibe += `${name} este un loc absolut superb! Energia de aici este molipsitoare și merită vizitat neapărat. 🌟 Un must-visit în oraș!`;
    } else {
        vibe += `${name} este un loc chill și prietenos. Perfect pentru o ieșire relaxată fără prea multă agitație. ☕ Atmosferă plăcută garantată.`;
    }
    return vibe;
  };

  // 🧠 LOGICA AI (Flan-T5)
  const generateVibeDescription = useCallback(async () => {
    if (isLoading || !selectedLocation) return;

    setIsLoading(true);

    try {
      // Prompt simplificat pentru Flan-T5 (nu suportă chat complex)
      const prompt = `Scrie o recenzie scurtă și veselă în limba română pentru locul "${selectedLocation.name}". Descriere originală: ${selectedLocation.short_description}`;

      const response = await fetch(HF_MODEL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { 
            max_new_tokens: 100, // Scurt și la obiect
            temperature: 0.9,    // Mai creativ
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("HF Data:", data);

      let aiText = "";
      // Flan-T5 returnează de obicei [{ generated_text: "..." }]
      if (Array.isArray(data) && data[0]?.generated_text) {
        aiText = data[0].generated_text;
      } else if (data?.generated_text) {
        aiText = data.generated_text;
      } else {
        throw new Error("Format invalid");
      }

      setCurrentDescription("✨ " + aiText.trim());
      setIsVibeGenerated(true);

    } catch (error) {
      console.log("⚠️ API Failed, switching to local fallback:", error);
      
      // ACTIVARE FALLBACK AUTOMATĂ
      const fallbackText = generateLocalFallback();
      setCurrentDescription(fallbackText);
      setIsVibeGenerated(true);
      
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation, isLoading]);

  const handleReserve = () => {
    if (!selectedLocation) return;
    const url = `whatsapp://send?text=Salut! Aș vrea să fac o rezervare la ${selectedLocation.name}.`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Eroare", "Nu pot deschide WhatsApp.");
    });
  };

  const headerStyle = {
    headerShown: true,
    title: selectedLocation?.name || "Detalii",
    headerStyle: { backgroundColor: isDark ? COLORS.darkBackground : COLORS.white },
    headerTintColor: COLORS.primary,
    headerShadowVisible: false,
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
        <Ionicons name="close" size={28} color={COLORS.primary} />
      </TouchableOpacity>
    )
  };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Stack.Screen options={headerStyle as any} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: selectedLocation.image_url }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View style={styles.contentPadding}>
          <View style={styles.titleRow}>
            <Text style={[styles.locationTitle, { color: COLORS.textPrimary }]}>
              {selectedLocation.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFB800" />
              <Text style={styles.ratingText}>{selectedLocation.rating}</Text>
            </View>
          </View>

          <Text style={[styles.addressText, { color: COLORS_BASE.textLight }]}>
            <Ionicons name="location-outline" size={14} color={COLORS_BASE.textLight} /> {selectedLocation.address}
          </Text>

          <View style={styles.descriptionSection}>
            <Text style={[styles.descriptionHeader, { color: COLORS.primary }]}>
              {isVibeGenerated ? "✨ Vibe Check" : "Descriere"}
            </Text>
            <Text style={[styles.descriptionText, { color: COLORS.textPrimary }]}>
              {currentDescription}
            </Text>
          </View>

          {!isVibeGenerated && (
            <TouchableOpacity
              style={[styles.aiButton, { backgroundColor: isLoading ? COLORS.secondary : COLORS.primary }]}
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

          <TouchableOpacity
            style={[styles.reserveButton, { borderColor: COLORS.primary }]}
            onPress={handleReserve}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            <Text style={[styles.reserveButtonText, { color: COLORS.primary }]}>
              Rezervă pe WhatsApp
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    alignItems: 'center',
    backgroundColor: "rgba(255,184,0,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  ratingText: { marginLeft: 4, fontSize: 16, fontWeight: "700", color: "#D49500" },
  addressText: { fontSize: 15, marginBottom: 25 },
  descriptionSection: { marginBottom: 10 },
  descriptionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  descriptionText: { fontSize: 16, lineHeight: 26, opacity: 0.9 },

  aiButton: {
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS_BASE.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  aiButtonText: { color: COLORS_BASE.white, fontSize: 16, fontWeight: "700" },

  reserveButton: {
    marginTop: 15,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent',
  },
  reserveButtonText: { marginLeft: 10, fontSize: 16, fontWeight: "700" },
});