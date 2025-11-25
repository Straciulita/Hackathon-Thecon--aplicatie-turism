import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import LOCATIONS from '../../assets/data/locations.json';
// ✅ Importăm tema dinamică
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.55;

const MOCK_USER_PREFS = { drinkPref: 'coffee' };

export default function MatchScreen() {
  // ✅ Preluăm culorile
  const { COLORS, isDark } = useTheme();
  
  const swiperRef = useRef<any>(null);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedPlace, setMatchedPlace] = useState<any>(null);
  const [cardsEnded, setCardsEnded] = useState(false);

  const processedLocations = useMemo(() => {
    const dataWithScores = LOCATIONS.map((loc) => {
      let score = 60;
      score += (loc.rating * 4);
      if (score > 100) score = 100;
      return { ...loc, matchScore: Math.floor(score) };
    });
    return dataWithScores.sort((a, b) => b.matchScore - a.matchScore);
  }, []);

  const renderCard = (card: any) => {
    if (!card) return null;
    let matchColor = COLORS.primary;
    if (card.matchScore >= 90) matchColor = '#4CAF50';

    return (
      <View style={[styles.card, { backgroundColor: isDark ? '#333' : 'white' }]}>
        <Image source={{ uri: card.image_url }} style={styles.cardImage} />
        <View style={[styles.matchBadge, { backgroundColor: matchColor }]}>
            <Text style={styles.matchBadgeText}>{card.matchScore}% Match</Text>
        </View>
        <View style={styles.cardDetails}>
          <Text style={[styles.cardTitle, { color: isDark ? 'white' : '#333' }]} numberOfLines={1}>{card.name}</Text>
          <Text style={styles.cardAddress} numberOfLines={1}>📍 {card.address}</Text>
        </View>
      </View>
    );
  };

  const onSwipedRight = (cardIndex: number) => {
    setMatchedPlace(processedLocations[cardIndex]);
    setMatchModalVisible(true);
  };

  // ✅ Stil dinamic pentru container
  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: COLORS.primary }]}>Discover Vibe ☕️</Text>
        <Text style={styles.headerSubtitle}>Algoritmul a găsit locurile tale:</Text>
      </View>

      <View style={styles.swiperWrapper}>
        {!cardsEnded ? (
            <Swiper
                ref={swiperRef}
                cards={processedLocations}
                renderCard={renderCard}
                onSwipedRight={onSwipedRight}
                onSwipedAll={() => setCardsEnded(true)}
                cardIndex={0}
                backgroundColor={'transparent'}
                stackSize={3}
                cardVerticalMargin={20} 
                cardHorizontalMargin={(width - CARD_WIDTH) / 2}
                animateCardOpacity
            />
        ) : (
            <View style={styles.noCardsContainer}>
                <Text style={[styles.noCardsText, { color: COLORS.textPrimary }]}>Gata pe azi!</Text>
            </View>
        )}
      </View>

      {/* Butoane */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.roundButton, styles.shadow, {backgroundColor: 'white'}]} onPress={() => swiperRef.current.swipeLeft()}>
          <Ionicons name="close" size={30} color="#FF5252" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roundButton, styles.shadow, {backgroundColor: 'white'}]} onPress={() => swiperRef.current.swipeRight()}>
          <Ionicons name="heart" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={matchModalVisible} transparent={true} onRequestClose={() => setMatchModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#333' : 'white' }]}>
            <Text style={styles.matchTitle}>It's a Match! 🔥</Text>
            {matchedPlace && <Text style={{color: isDark?'white':'black', fontSize: 18}}>{matchedPlace.name}</Text>}
            <TouchableOpacity style={[styles.actionButton, {backgroundColor: COLORS.primary}]} onPress={() => setMatchModalVisible(false)}>
                <Text style={styles.actionButtonText}>Super!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginTop: 60, paddingHorizontal: 20, alignItems: 'center', height: 80 },
  headerTitle: { fontSize: 26, fontWeight: '800' },
  headerSubtitle: { fontSize: 14, color: '#888', marginTop: 5 },
  swiperWrapper: { flex: 1, marginTop: -20 },
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 8 },
  cardImage: { width: '100%', height: '60%', resizeMode: 'cover' },
  matchBadge: { position: 'absolute', top: 20, right: 20, flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, elevation: 5 },
  matchBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  cardDetails: { padding: 20, flex: 1, justifyContent: 'space-between' },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  cardAddress: { color: '#999', fontSize: 13 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 50 },
  roundButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  noCardsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  noCardsText: { fontSize: 20, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 10 },
  matchTitle: { fontSize: 32, fontWeight: '900', color: '#E91E63', marginBottom: 15, transform: [{rotate: '-5deg'}] },
  actionButton: { paddingVertical: 16, width: '100%', borderRadius: 16, alignItems: 'center', marginTop: 20 },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});