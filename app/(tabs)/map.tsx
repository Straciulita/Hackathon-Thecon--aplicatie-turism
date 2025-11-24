import React from 'react';
import { View, StyleSheet, TextInput, Image, ActivityIndicator, Platform, StatusBar } from 'react-native';
import MapView, { Marker, MapUrlTile } from 'react-native-maps'; 
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme, COLORS_BASE } from '../contexts/ThemeContext'; 
import { useLocations } from '../contexts/LocationContext'; 

const customCoffeePinImage = require('../../assets/images/coffee_pin.png');

export default function MapScreen() {
  const { isDark, COLORS } = useTheme();
  const { filteredLocations, loading, searchText, setSearchText } = useLocations();
  const router = useRouter();

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
          borderBottomColor: isDark ? '#333' : '#eee'
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
      >
        <MapUrlTile urlTemplate={mapTileUrl} maximumZ={16} tileSize={256} />

        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.coordinates.lat,
              longitude: location.coordinates.long,
            }}
            onPress={() => handleLocationPress(location)}
            // IMPORTANT: Pentru pini rotunzi, ancora este centrul exact (0.5, 0.5)
            anchor={{ x: 0.5, y: 0.5 }}
          >
            {/* Containerul rotund în stilul cerut */}
            <View style={[styles.roundMarkerContainer, { backgroundColor: COLORS.primary, borderColor: COLORS.white }]}>
              <Image
                source={customCoffeePinImage}
                style={styles.markerImageInside}
                resizeMode="contain" 
              />
            </View>
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 30) + 10 : 50,
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
  
  // --- STILURI NOI PENTRU PIN ROTUND ---
  roundMarkerContainer: {
    width: 30,  // Dimensiune fixă
    height: 30, // Dimensiune fixă
    borderRadius: 30, // Jumătate din lățime pentru a fi cerc perfect
    borderWidth: 1, // Bordură albă groasă
    justifyContent: 'center',
    alignItems: 'center',
    // Umbră pentru efectul de "pop-out"
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden', // Asigură că imaginea din interior nu depășește cercul
  },
  markerImageInside: {
    width: '95%', // Imaginea ocupă 85% din containerul rotund
    height: '95%',
    resizeMode: 'contain',
  },
});