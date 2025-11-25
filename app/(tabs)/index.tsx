import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Platform } from 'react-native'; 
import MapView, { Marker, MapUrlTile } from 'react-native-maps'; 
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../contexts/ThemeContext'; 
import { useLocations } from '../contexts/LocationContext'; 

import SearchBar from '../components/SearchBar';

// ✅ FOLOSIM CALEA COMPLETĂ ȘI ROBUSTĂ pentru imagini
const customCoffeePinImage = require('../../assets/images/coffee_pin.png'); 

export default function MapScreen() {
  const { isDark, COLORS } = useTheme();
  const { filteredLocations, loading } = useLocations(); 
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLocationPress = (location: any) => {
    router.push({
      pathname: '/details',
      params: { 
        locationId: location.id,
        name: location.name,
        address: location.address,
        imageUrl: location.image_url,
        description: location.short_description,
        rating: location.rating.toString(),
      }
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const initialRegion = {
    latitude: 45.9432,
    longitude: 24.9668,
    latitudeDelta: 4.5,
    longitudeDelta: 4.5,
  };
  
  const mapTileUrl = isDark
    ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}@2x.png"
    : "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}@2x.png";

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      
      <SearchBar isMapMode={true} />

      {/* HARTA */}
      <MapView
        style={styles.map}
        provider={undefined} 
        initialRegion={initialRegion}
        mapType="standard"
        moveOnMarkerPress={false}
      >
        <MapUrlTile urlTemplate={mapTileUrl} maximumZ={16} tileSize={512} />

        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.coordinates.lat,
              longitude: location.coordinates.long,
            }}
            onPress={() => handleLocationPress(location)}
            anchor={{ x: 0.5, y: 1.0 }}
            // ✅ FIX: Nu folosim tracksViewChanges={true} ci îl omitem pentru iOS, și îl punem pe false
            // pentru Android dacă nu merge. Lăsăm pe true doar dacă avem nevoie
            tracksViewChanges={Platform.OS === 'android'} 
          >
            {/* PIN SIMPLIFICAT - Folosim imaginea ca sursă pentru Marker */}
            <Image
              source={customCoffeePinImage}
              style={styles.markerImage}
              resizeMode="contain" 
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
  
  markerImage: {
    width: 45, 
    height: 40,
  },
});