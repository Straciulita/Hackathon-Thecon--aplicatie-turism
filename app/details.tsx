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

import { useTheme, COLORS_BASE } from './contexts/ThemeContext';
import { useLocations } from './contexts/LocationContext';

// ✅ IMPORTĂM DATELE LOCALE (Descrierile Vibe)
// Asigură-te că ai creat fișierul app/data/ai_descriptions.js cu conținutul furnizat anterior
import { VIBE_DESCRIPTIONS } from '../assets/data/ai_descriptions'; 

export default function DetailsScreen() {
  const { COLORS, isDark } = useTheme();
  const router = useRouter();
  const { locationId } = useLocalSearchParams();
  const { locations } = useLocations();

  // Găsim locația curentă pe baza ID-ului
  const selectedLocation = locations.find(loc => loc.id.toString() === locationId);

  const [currentDescription, setCurrentDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVibeGenerated, setIsVibeGenerated] = useState(false);

  // Setăm descrierea inițială (cea scurtă din JSON-ul original)
  useEffect(() => {
    if (selectedLocation) {
      setCurrentDescription(selectedLocation.short_description || "Descriere indisponibilă.");
    }
  }, [selectedLocation]);

  // 🧠 LOGICA "AI" SIMULATĂ (PREIA DIN FIȘIER LOCAL)
  const generateVibeDescription = useCallback(async () => {
    if (isLoading || !selectedLocation) return;

    setIsLoading(true);

    // Simulăm o mică întârziere (1.5s) pentru a păstra efectul de "loading" (UX bun)
    // Acest lucru face să pară că aplicația "gândește" sau interoghează un server.
    setTimeout(() => {
      const locationName = selectedLocation.name;
      
      // Căutăm descrierea în fișierul nostru local folosind numele locației ca cheie
      // @ts-ignore (ignorăm eroarea de tipare strictă pentru cheile obiectului, e safe aici)
      const vibeText = VIBE_DESCRIPTIONS[locationName] || VIBE_DESCRIPTIONS["DEFAULT"];

      setCurrentDescription(vibeText);
      setIsVibeGenerated(true); // Ascundem butonul după generare și arătăm titlul nou
      setIsLoading(false);
    }, 1500); 

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

  // 📞 Rezervare (WhatsApp)
  const handleReserve = () => {
    if (!selectedLocation) return;
    const url = `whatsapp://send?text=Salut! Aș vrea să fac o rezervare la ${selectedLocation.name}.`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Eroare", "Nu pot deschide WhatsApp.");
    });
  };

  // Header Customizat
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
          {/* Titlu și Rating */}
          <View style={styles.titleRow}>
            <Text style={[styles.locationTitle, { color: COLORS.textPrimary }]}>
              {selectedLocation.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFB800" />
              <Text style={styles.ratingText}>{selectedLocation.rating}</Text>
            </View>
          </View>

          {/* Adresă */}
          <Text style={[styles.addressText, { color: COLORS_BASE.textLight }]}>
            <Ionicons name="location-outline" size={14} color={COLORS_BASE.textLight} /> {selectedLocation.address}
          </Text>

          {/* Descriere (care se va schimba la apăsarea butonului) */}
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
                style={[styles.actionButton, { borderColor: COLORS.primary, backgroundColor: COLORS.white }]}
                onPress={handleNavigation}
              >
                <Ionicons name="navigate-circle" size={24} color={COLORS.primary} />
                <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>
                  Navighează
                </Text>
              </TouchableOpacity>

              {/* Buton Rezervare (WhatsApp) */}
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: '#25D366', backgroundColor: '#25D366' }]}
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
    marginTop: 20,
    marginBottom: 20,
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