import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface LocationCardProps {
  item: any;
  onPress: (item: any) => void;
}

export default function LocationCard({ item, onPress }: LocationCardProps) {
  const { COLORS, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { 
          // ✅ Folosim COLORS.card (care e alb pe Light, gri închis pe Dark)
          backgroundColor: COLORS.card, 
          // Umbră subtilă
          shadowColor: isDark ? '#000' : '#000' 
        }
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      {/* Imaginea */}
      <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
      
      {/* Conținut */}
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
            <Text style={[styles.cardTitle, { color: COLORS.textPrimary }]} numberOfLines={1}>
              {item.name}
            </Text>
            
            {/* Rating Badge - Folosim Secondary (Bleu) pentru accent */}
            <View style={[styles.ratingContainer, { backgroundColor: COLORS.secondary }]}>
                <Ionicons name="star" size={12} color="#FFF" /> 
                <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
        </View>

        <Text style={[styles.cardAddress, { color: COLORS.textSecondary }]} numberOfLines={1}>
          <Ionicons name="location-outline" size={14} /> {item.address}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16, 
    marginBottom: 16, 
    overflow: 'hidden',
    // Umbre pentru Android
    elevation: 4, 
    // Umbre pentru iOS
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
  },
  cardImage: { 
    width: '100%', 
    height: 180, 
    backgroundColor: '#EEE', // Placeholder culoare până se încarcă
  },
  cardContent: { 
    padding: 16 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    flex: 1,
    marginRight: 10,
  },
  cardAddress: { 
    fontSize: 13, 
    marginTop: 4 
  },
  ratingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4
  },
  ratingText: { 
    color: '#FFF', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
});