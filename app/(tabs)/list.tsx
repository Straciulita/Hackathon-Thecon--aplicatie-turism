import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme, COLORS_BASE } from '../contexts/ThemeContext'; 
import { useLocations } from '../contexts/LocationContext'; 

export default function ListScreen() {
  const { isDark, COLORS } = useTheme();
  const { filteredLocations, searchText, setSearchText } = useLocations();
  const router = useRouter();

  const handleLocationPress = (location: any) => {
    router.push({
      pathname: '/details',
      params: { locationId: location.id, ...location, rating: location.rating.toString() }
    });
  };

  const renderLocationCard = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.white, shadowColor: isDark ? COLORS.primary : COLORS.text }]}
      onPress={() => handleLocationPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: COLORS.textPrimary }]} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFB800" /> 
          <Text style={[styles.ratingText, { color: COLORS.textPrimary }]}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      
      {/* BARA DE CĂUTARE (Identică cu cea de pe hartă) */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.white }]}>
        <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: COLORS.textPrimary, backgroundColor: isDark ? COLORS.text : '#F0F0F0' }]}
          placeholder="Caută locații..."
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredLocations}
        renderItem={renderLocationCard}
        keyExtractor={(item) => item.id!.toString()} 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{color: COLORS.textLight}}>Nu s-au găsit locații.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS_BASE.secondary,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
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
  emptyState: { alignItems: 'center', marginTop: 50 },
});