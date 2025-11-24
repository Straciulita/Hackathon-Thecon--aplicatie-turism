import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

// Import local data as fallback
import locationsData from '../../assets/data/locations.json';

const { width, height } = Dimensions.get('window');

// Color palette from your design
const COLORS = {
  primary: '#8B5A3C',
  secondary: '#C4956C',
  light: '#F5E6D3',
  accent: '#88B5C5',
  white: '#FFFFFF',
  text: '#2C2C2C',
  textLight: '#6B6B6B',
};

const ExploreScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      // Try to fetch from the hackathon server
      const response = await fetch('https://thecon.ro/hackathon/locations.json');
      
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
        console.log('Loaded locations from server');
      } else {
        throw new Error('Server response not OK');
      }
    } catch (error) {
      console.log('Using local data as fallback:', error.message);
      // Use local JSON file as fallback
      setLocations(locationsData);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    // Navigate to details screen
    navigation.navigate('Details', { location });
  };

  const renderLocationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleLocationPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardAddress} numberOfLines={1}>
          {item.address}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFB800" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading locations...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with View Toggle */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'map' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('map')}
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
          >
            <Ionicons
              name="list"
              size={20}
              color={viewMode === 'list' ? COLORS.white : COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map View */}
      {viewMode === 'map' && (
        <MapView
          style={styles.map}
          provider={null} // Use default provider (OpenStreetMap)
          initialRegion={{
            latitude: locations[0]?.latitude || 45.799,
            longitude: locations[0]?.longitude || 26.200,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          mapType="standard"
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              onPress={() => handleLocationPress(location)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.marker}>
                  <Ionicons name="location" size={24} color={COLORS.white} />
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <FlatList
          data={locations}
          renderItem={renderLocationCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.secondary,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardAddress: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default ExploreScreen;