import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  TextInput,
} from 'react-native';
import MapView, { Marker, MapUrlTile } from 'react-native-maps'; 
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme, COLORS_BASE } from '../contexts/ThemeContext'; 

// Interfața adaptată structurii tale JSON
interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    long: number;
  };
  image_url: string;
  short_description: string;
  rating: number;
  id?: string | number; 
}

// Import local data as fallback
const locationsData: Location[] = require('../../assets/data/locations.json') as Location[];

const { width, height } = Dimensions.get('window');

// 🛑 IMPORTĂM IMAGINEA PERSONALIZATĂ A PIN-ULUI
const customCoffeePinImage = require('../../assets/images/coffee_pin.png');


export default function ExploreScreen() {
  const { isDark, COLORS } = useTheme();

  const [locations, setLocations] = useState<Location[]>([]); 
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map');
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadLocations();
  }, []);

  const processLocations = (data: any[]): Location[] => {
    return data.map((item, index) => ({
      ...item,
      id: index.toString(), 
    })) as Location[];
  };

  const loadLocations = async () => {
    try {
      const response = await fetch('https://thecon.ro/hackathon/locations.json');
      let data: Location[];
      if (response.ok) {
        data = await response.json();
      } else {
        throw new Error('Server response not OK, using local data.');
      }
      setLocations(processLocations(data));
    } catch (error: any) {
      console.log('Error loading server data. Using local fallback:', error.message);
      setLocations(processLocations(locationsData));
    } finally {
      setLoading(false);
    }
  };
  
  // LOGICĂ FILTRARE & CĂUTARE CONDIȚIONATĂ
  const filteredLocations = useMemo(() => {
    if (!searchText) {
      return []; 
    }
    const lowercasedSearch = searchText.toLowerCase();
    
    return locations.filter(location => 
      location.name.toLowerCase().includes(lowercasedSearch) ||
      location.address.toLowerCase().includes(lowercasedSearch)
    );
  }, [locations, searchText]); 
  
  const shouldShowResults = searchText.length > 0;

  const handleLocationPress = (location: Location) => {
    router.push({
      pathname: '/details',
      params: { 
        locationId: location.id ? location.id.toString() : location.name,
        name: location.name,
        address: location.address,
        imageUrl: location.image_url,
        description: location.short_description,
        rating: location.rating.toString(),
        latitude: location.coordinates.lat.toString(),
        longitude: location.coordinates.long.toString(),
      }
    });
  };

  const renderLocationCard = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.white, shadowColor: isDark ? COLORS.primary : COLORS.text }]}
      onPress={() => handleLocationPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: COLORS.textPrimary }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardAddress} numberOfLines={1}>
          {item.address}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFB800" /> 
          <Text style={[styles.ratingText, { color: COLORS.textPrimary }]}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[styles.loadingText, { color: COLORS.textPrimary }]}>Loading locations...</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: locations[0]?.coordinates.lat || 45.799,
    longitude: locations[0]?.coordinates.long || 26.200,
    latitudeDelta: 3.5,
    longitudeDelta: 3.5,
  };
  
  const mapTileUrl = isDark
    ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
    : "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      
      {/* BARA DE CĂUTARE */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.white }]}>
        <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: COLORS.textPrimary, backgroundColor: isDark ? COLORS.text : COLORS.light }]}
          placeholder="Caută locații..."
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      {/* VIEW TOGGLE ȘI REZULTATE */}
      <View style={[styles.viewToggleContainer, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.white, borderBottomColor: COLORS.secondary }]}>
        <Text style={[styles.resultsCount, { color: COLORS.textPrimary }]}>
          {shouldShowResults ? `${filteredLocations.length} ${filteredLocations.length === 1 ? 'rezultat' : 'rezultate'}` : 'Introdu text de căutare'}
        </Text>
        <View style={[styles.viewToggle, { backgroundColor: isDark ? COLORS.text : COLORS.light }]}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'map' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('map')}
            // Dezactivăm butonul Map dacă nu sunt rezultate pentru a nu deruta utilizatorul
            disabled={!shouldShowResults && viewMode === 'list'}
          >
            <Ionicons
              name="map"
              size={20}
              color={viewMode === 'map' ? COLORS.white : COLORS.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'list' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('list')}
            disabled={!shouldShowResults && viewMode === 'map'}
          >
            <Ionicons
              name="list"
              size={20}
              color={viewMode === 'list' ? COLORS.white : COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* AFIȘARE HARTA (permanentă când este selectat) */}
      {viewMode === 'map' && (
        <MapView
          style={styles.map}
          provider={undefined}
          initialRegion={initialRegion}
          mapType="standard"
        >
          <MapUrlTile
            urlTemplate={mapTileUrl}
            maximumZ={16}
            tileSize={256}
          />

          {/* Markerii se afișează DOAR dacă există rezultate */}
          {shouldShowResults && filteredLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.coordinates.lat,
                longitude: location.coordinates.long,
              }}
              onPress={() => handleLocationPress(location)}
              anchor={{ x: 0.5, y: 1 }} 
            >
              <Image
                source={customCoffeePinImage}
                style={styles.customPinImage}
                resizeMode="contain" 
              />
            </Marker>
          ))}
        </MapView>
      )}

      {/* AFIȘARE LISTA (condiționată) */}
      {viewMode === 'list' && (
        shouldShowResults ? (
          <FlatList
            data={filteredLocations}
            renderItem={renderLocationCard}
            keyExtractor={(item) => item.id!.toString()} 
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={[styles.noResults, { backgroundColor: COLORS.background }]}>
            <Ionicons name="search-circle-outline" size={80} color={COLORS.textLight} />
            <Text style={[styles.noResultsText, { color: COLORS.textLight }]}>
              Începe să cauți pentru a vedea locațiile în listă.
            </Text>
          </View>
        )
      )}
    </SafeAreaView>
  );
}


// Stilurile
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS_BASE.textLight },
  
  searchContainer: {
    paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS_BASE.light,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, },
  
  viewToggleContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: COLORS_BASE.light,
  },
  resultsCount: { fontSize: 14, fontWeight: '600' },
  viewToggle: { flexDirection: 'row', borderRadius: 8, padding: 4 },
  toggleButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  toggleButtonActive: { backgroundColor: COLORS_BASE.primary },
  
  map: { flex: 1 },
  
  customPinImage: {
    width: 80, 
    height: 80, 
    resizeMode: 'contain', 
    margin: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  
  listContainer: { padding: 16 },
  card: {
    borderRadius: 16, marginBottom: 16, overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  cardImage: { width: '100%', height: 200, backgroundColor: COLORS_BASE.secondary },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  cardAddress: { fontSize: 14, color: COLORS_BASE.textLight, marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 4, fontSize: 16, fontWeight: '600' },
  
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noResultsText: {
    fontSize: 18,
    marginTop: 15,
    textAlign: 'center',
  }
});