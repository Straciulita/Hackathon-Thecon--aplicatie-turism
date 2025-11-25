import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; 
import { useLocations } from '../contexts/LocationContext'; 

import LocationCard from '../components/LocationCard';
import SearchBar from '../components/SearchBar';

export default function ListScreen() {
  const { COLORS } = useTheme();
  const { filteredLocations } = useLocations();
  const router = useRouter();

  const handleLocationPress = (location: any) => {
    router.push({
      pathname: '/details',
      params: { locationId: location.id, ...location, rating: location.rating.toString() }
    });
  };

  const SearchBarWrapper = ({ children }: { children: React.ReactNode }) => (
    <View style={[styles.searchWrapper, { backgroundColor: COLORS.background }]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      
      {/* Search Bar în wrapper pentru spațiere verticală */}
      <SearchBarWrapper>
        <SearchBar isMapMode={false} />
      </SearchBarWrapper>

      <FlatList
        data={filteredLocations}
        renderItem={({ item }) => (
          <LocationCard item={item} onPress={handleLocationPress} />
        )}
        keyExtractor={(item) => item.id!.toString()} 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={50} color={COLORS.textLight} style={{marginBottom: 10}} />
            <Text style={{color: COLORS.textSecondary, fontSize: 16}}>Nu s-au găsit locații.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrapper: {
    // ✅ Mărit de la 10 la 25
    paddingTop: 25, 
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  listContainer: { padding: 16, paddingBottom: 110 },
  emptyState: { alignItems: 'center', marginTop: 80 },
});