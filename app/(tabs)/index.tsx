import React from 'react';
import { View, StyleSheet, TextInput, Image, ActivityIndicator, Platform, StatusBar } from 'react-native';
import MapView, { Marker, MapUrlTile } from 'react-native-maps'; 
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import pentru Safe Area

import { useTheme, COLORS_BASE } from '../contexts/ThemeContext'; 
import { useLocations } from '../contexts/LocationContext'; 

// Asigură-te că imaginea există la această cale
const customCoffeePinImage = require('../../assets/images/coffee_pin.png');

export default function MapScreen() {
  const { isDark, COLORS } = useTheme();
  const { filteredLocations, loading, searchText, setSearchText } = useLocations();
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
    ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
    : "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png";

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      
      {/* BARA DE CĂUTARE */}
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: isDark ? COLORS.darkBackground : COLORS.white,
          borderBottomColor: isDark ? '#333' : '#eee',
          paddingTop: insets.top + 10, // Spațiere corectă sus
        }
      ]}>
        <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={[
            styles.searchInput, 
            { 
              color: COLORS.textPrimary, 
              backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0' 
            }
          ]}
          placeholder="Caută pe hartă..."
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* HARTA */}
      <MapView
        style={styles.map}
        provider={undefined}
        initialRegion={initialRegion}
        mapType="standard"
        // Optimizări pentru a preveni dispariția
        moveOnMarkerPress={false}
      >
        <MapUrlTile urlTemplate={mapTileUrl} maximumZ={16} tileSize={256} />

        {filteredLocations.map((location) => (
          <Marker
            key={location.id} // Cheia unică este critică
            coordinate={{
              latitude: location.coordinates.lat,
              longitude: location.coordinates.long,
            }}
            onPress={() => handleLocationPress(location)}
            // Ancorăm imaginea cu vârful jos (0.5 orizontal, 1.0 vertical)
            anchor={{ x: 0.5, y: 1.0 }}
            // Această proprietate forțează randarea continuă, rezolvând problema dispariției pe Android
            tracksViewChanges={true} 
          >
            {/* Imaginea Pin-ului SIMPLIFICATĂ */}
            <Image
              source={customCoffeePinImage}
              style={styles.markerImage}
              resizeMode="contain" 
              // onLoadEnd poate ajuta la debugging, dar lăsăm simplu pentru stabilitate
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
  
  searchContainer: {
    // paddingTop se setează dinamic în componentă
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  map: { flex: 1 },
  
  // STILURI PIN: Dimensiuni fixe, fără containere suplimentare
  markerImage: {
    width: 45, 
    height: 40,
    // Nu adăuga backgroundColor aici pentru a păstra transparența PNG-ului
  },
});