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
  Alert,
  Platform
} from 'react-native';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from './contexts/ThemeContext';
import { useLocations } from './contexts/LocationContext';

// ✅ IMPORT NOU: Serviciul de AI real/simulat
// Asigură-te că ai creat app/services/aiService.ts!
import { generateVibe } from './services/aiService'; 

export default function DetailsScreen() {
  const { COLORS } = useTheme();
  const router = useRouter();
  const { locationId } = useLocalSearchParams();
  const { locations } = useLocations();

  const selectedLocation = locations.find(loc => loc.id.toString() === locationId);

  const [currentDescription, setCurrentDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVibeGenerated, setIsVibeGenerated] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      // Setează descrierea inițială din JSON [cite: 13]
      setCurrentDescription(selectedLocation.short_description || "Descriere indisponibilă.");
    }
  }, [selectedLocation]);

  // 🧠 LOGICA "AI" REALĂ (pentru Vibe Generator - 40 de puncte)
  const generateVibeDescription = useCallback(async () => {
    if (isLoading || !selectedLocation) return;

    setIsLoading(true); // ✅ Loading Indicator ON 

    try {
        if (typeof generateVibe !== 'function') {
             // Dacă ai uitat să pui cheia API, se va folosi descrierea inițială
             throw new Error("AI Service not fully integrated (Missing API key or function).");
        }
        
        const locationName = selectedLocation.name;
        const originalDescription = selectedLocation.short_description;

        // Apel către serviciul extern
        const newVibe = await generateVibe(locationName, originalDescription);

        setCurrentDescription(newVibe); 
        setIsVibeGenerated(true); // Ascundem butonul
    } catch (error) {
        Alert.alert("Eroare AI", "Nu am putut genera descrierea Vibe. Verifică cheia API și conexiunea la internet.");
    } finally {
        setIsLoading(false); // ✅ Loading Indicator OFF
    }
  }, [selectedLocation, isLoading]);

  // 🗺️ Navigare (Google Maps / Apple Maps)
  const handleNavigation = () => {
    if (!selectedLocation) return;
    
    const { lat, long } = selectedLocation.coordinates;
    const label = selectedLocation.name;

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${long}`,
      android: `geo:0,0?q=${lat},${long}(${label})`
    });

    if (url) {
        Linking.openURL(url).catch(() => {
            Alert.alert("Eroare", "Nu am putut deschide aplicația de hărți.");
        });
    }
  };

  // 📞 Rezervare (WhatsApp) [cite: 27]
  const handleReserve = () => {
    if (!selectedLocation) return;
    const url = `whatsapp://send?text=Salut! Aș vrea să fac o rezervare la ${selectedLocation.name}.`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Eroare", "Nu pot deschide WhatsApp.");
    });
  };

  // Header Customizat (Folosit pentru a închide modalul)
  const headerStyle = {
    headerShown: true,
    title: selectedLocation?.name || "Detalii",
    headerStyle: { backgroundColor: COLORS.card },
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
          style={[styles.mainImage, {backgroundColor: COLORS.secondary}]}
          resizeMode="cover"
        />

        <View style={[styles.contentPadding, {backgroundColor: COLORS.background}]}>
          {/* Titlu și Rating */}
          <View style={styles.titleRow}>
            <Text style={[styles.locationTitle, { color: COLORS.textPrimary }]}>
              {selectedLocation.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color={COLORS.primary} />
              <Text style={[styles.ratingText, { color: COLORS.primary }]}>{selectedLocation.rating}</Text>
            </View>
          </View>

          {/* Adresă */}
          <Text style={[styles.addressText, { color: COLORS.textSecondary }]}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} /> {selectedLocation.address}
          </Text>

          {/* Descriere (Actualizată de AI) */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.descriptionHeader, { color: COLORS.primary }]}>
              {isVibeGenerated ? "✨ Vibe Check (Generat)" : "Descriere"}
            </Text>
            <Text style={[styles.descriptionText, { color: COLORS.textPrimary }]}>
              {currentDescription}
            </Text>
          </View>

          {/* Buton AI (Dispare după generare) */}
          {!isVibeGenerated && (
            <TouchableOpacity
              style={[styles.aiButton, { backgroundColor: isLoading ? COLORS.secondary : COLORS.primary }]}
              onPress={generateVibeDescription}
              disabled={isLoading}
            >
              {isLoading ? (
                // Loading Indicator
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                  <Text style={styles.aiButtonText}>Generează Vibe Check ✨</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Grup Butoane Acțiune (Navigare & Rezervare) */}
          <View style={styles.actionButtonsContainer}>
              
              {/* Buton Navigare (Hărți) */}
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: COLORS.primary, backgroundColor: COLORS.card }]}
                onPress={handleNavigation}
              >
                <Ionicons name="navigate-circle" size={24} color={COLORS.primary} />
                <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>
                  Navighează
                </Text>
              </TouchableOpacity>

              {/* Buton Rezervare (WhatsApp) */}
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: COLORS.success, backgroundColor: COLORS.success }]}
                onPress={handleReserve}
              >
                <Ionicons name="logo-whatsapp" size={22} color="white" />
                <Text style={[styles.actionButtonText, { color: 'white' }]}>
                  Rezervă
                </Text>
              </TouchableOpacity>

          </View>

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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  ratingText: { marginLeft: 5, fontWeight: "700" },
  addressText: { fontSize: 15, marginBottom: 25 },
  descriptionSection: { marginBottom: 10 },
  descriptionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  descriptionText: { fontSize: 16, lineHeight: 26, opacity: 0.9 },

  aiButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  aiButtonText: { color: 'white', fontSize: 16, fontWeight: "700" },

  actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  actionButtonText: { fontSize: 16, fontWeight: "700" },
});