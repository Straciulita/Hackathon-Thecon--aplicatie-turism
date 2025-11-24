import React, { useState, useCallback } from 'react';
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
} from 'react-native';
// Tipul RouteProp este necesar doar dacă tipăm opțiunile direct, dar e bine să îl importăm
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';

// CORECȚIE 1: Calea de import
// app/details.tsx (un nivel în sus) -> contexts/ThemeContext.tsx
import { useTheme, COLORS_BASE } from './contexts/ThemeContext'; 

// Funcție simpulată pentru apelul API AI (pentru a avea Loading Indicator)
const simulateAIApiCall = (name: string, description: string) => {
  return new Promise<string>((resolve) => {
    // Simulează o întârziere de 2 secunde (pentru a testa Loading Indicator)
    setTimeout(() => {
      resolve(`**Vibe Generat de AI**: ${name} nu este doar un loc, este o experiență boemă. Locația îmbină farmecul tradițional cu o estetică modernă. Perfect pentru o evadare relaxantă, oferind experiențe culinare unice. (Descriere originală: "${description}")`);
    }, 2000);
  });
};

export default function DetailsScreen() {
  const { COLORS, isDark } = useTheme();
  const router = useRouter();
  
  // Preluare parametri
  const params = useLocalSearchParams();
  
  // CORECȚIE 2: Asigură-te că valoarea este un string (chiar dacă este trimisă ca string)
  // Dacă Expo Router detectează că valoarea ar putea fi o matrice, trebuie să forțezi tipul string.
  const locationName = Array.isArray(params.name) ? params.name[0] : (params.name || 'Detalii');
  const locationAddress = Array.isArray(params.address) ? params.address[0] : (params.address || '');
  const locationImageUrl = Array.isArray(params.imageUrl) ? params.imageUrl[0] : (params.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image');
  const initialDescription = Array.isArray(params.description) ? params.description[0] : (params.description || 'Descriere lipsă.');
  const locationRating = Array.isArray(params.rating) ? params.rating[0] : (params.rating || 'N/A');

  const [currentDescription, setCurrentDescription] = useState(initialDescription as string);
  const [isLoading, setIsLoading] = useState(false);

  // Funcţia "Al Magic"
  const generateVibeDescription = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true); // Cerința 1: Loading Indicator

    try {
      // AICI AR VENI APELUL REAL LA API AI
      const vibeText = await simulateAIApiCall(locationName as string, initialDescription as string);
      
      setCurrentDescription(vibeText); // Cerința 2: Update-ul descrierii
    } catch (error) {
      console.error("AI Generation Error:", error);
      setCurrentDescription("Ne pare rău, AI-ul nu a putut genera o descriere. E posibil să nu fie configurat.");
    } finally {
      setIsLoading(false);
    }
  }, [locationName, initialDescription, isLoading]);

  // Funcția "Rezervă" (link personalizat către WhatsApp)
  const handleReserve = () => {
    const whatsappUrl = `whatsapp://send?text=Aș dori să fac o rezervare la ${locationName} la adresa ${locationAddress}.`;
    Linking.openURL(whatsappUrl).catch(() => {
      alert('Vă rugăm să instalați WhatsApp pentru a continua.');
    });
  };

  // Configurare Header adaptată la temă
  const headerStyle = {
    headerShown: true,
    // CORECȚIE 2: Ne asigurăm că titlul este un string
    title: locationName, 
    headerStyle: { backgroundColor: isDark ? COLORS.darkBackground : COLORS.white },
    headerTintColor: COLORS.primary,
    headerShadowVisible: false,
    headerLeft: () => (
      // Buton de închidere pentru modal
      <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
        <Ionicons name="close" size={28} color={COLORS.primary} />
      </TouchableOpacity>
    ),
  };

  if (!locationName) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
        <Stack.Screen options={headerStyle} />
        <Text style={{ color: COLORS.textPrimary, textAlign: 'center', marginTop: 50 }}>Locație negăsită.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Stack.Screen options={headerStyle as any} /> 
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Poză mare */}
        <Image 
          source={{ uri: locationImageUrl }} 
          style={styles.mainImage} 
          resizeMode="cover"
        />

        <View style={styles.contentPadding}>
          
          {/* Titlu și Rating */}
          <View style={styles.titleRatingRow}>
            <Text style={[styles.locationTitle, { color: COLORS.textPrimary }]}>{locationName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFB800" />
              <Text style={[styles.ratingText, { color: COLORS.textPrimary }]}>{locationRating}</Text>
            </View>
          </View>

          {/* Adresă */}
          <Text style={styles.locationAddress}>{locationAddress}</Text>

          {/* Descriere Inițială/Actualizată */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.descriptionHeader, { color: COLORS.primary }]}>
              Descriere
            </Text>
            <Text style={[styles.descriptionText, { color: COLORS.textPrimary }]}>
              {currentDescription}
            </Text>
          </View>

          {/* Funcţia Al Generative (Baza Notei) */}
          <TouchableOpacity
            style={[styles.aiButton, { backgroundColor: isLoading ? COLORS.secondary : COLORS.primary }]}
            onPress={generateVibeDescription}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.aiButtonText}>
                Generează Descriere Vibe ✨
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Buton "Rezervă" (WhatsApp) */}
          <TouchableOpacity
            style={[styles.reserveButton, { borderColor: COLORS.primary }]}
            onPress={handleReserve}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={[styles.reserveButtonText, { color: COLORS.primary }]}>
              Rezervă (WhatsApp)
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainImage: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS_BASE.secondary,
  },
  contentPadding: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  titleRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: '600',
  },
  locationAddress: {
    fontSize: 16,
    color: COLORS_BASE.textLight,
    marginBottom: 20,
  },
  descriptionSection: {
    marginTop: 10,
  },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  aiButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  aiButtonText: {
    color: COLORS_BASE.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  reserveButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS_BASE.white,
  },
  reserveButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
  },
});