import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

// Importăm datele
import LOCATIONS from '../../assets/data/locations.json';
import { COLORS } from '../styles';

// 1️⃣ DIMENSIUNI CALCULATE (RESPONSIVE)
// Luăm dimensiunile ecranului curent
const { width, height } = Dimensions.get('window');

// Calculăm dimensiunea cardului să fie mai mică și centrată
const CARD_WIDTH = width * 0.9; // 90% din lățimea ecranului
const CARD_HEIGHT = height * 0.55; // 55% din înălțime (mai micuț)

// Simulăm preferințele
const MOCK_USER_PREFS = {
  drinkPref: 'coffee', 
};

export default function MatchScreen() {
  const swiperRef = useRef<any>(null);
  
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedPlace, setMatchedPlace] = useState<any>(null);
  const [cardsEnded, setCardsEnded] = useState(false);

  // === 2️⃣ ALGORITM SMART DE MATCHING ===
  const processedLocations = useMemo(() => {
    // Aici transformăm fiecare locație și îi calculăm un "Match Score"
    const dataWithScores = LOCATIONS.map((loc) => {
      let score = 60; // Pornim de la o bază de 60%

      const text = (loc.name + " " + loc.short_description).toLowerCase();

      // Bonus pentru cuvinte cheie
      if (MOCK_USER_PREFS.drinkPref === 'coffee') {
        const keywords = ['coffee', 'cafe', 'espresso', 'latte', 'cappuccino'];
        keywords.forEach(word => {
            if (text.includes(word)) score += 5;
        });
      }

      // Bonus pentru Rating (Rating * 4) -> ex: 4.8 * 4 = +19.2 puncte
      score += (loc.rating * 4);

      // Limităm la 100%
      if (score > 100) score = 100;

      // Returnăm obiectul locației + noul scor calculat
      return { ...loc, matchScore: Math.floor(score) };
    });

    // Sortăm descrescător după scorul calculat
    return dataWithScores.sort((a, b) => b.matchScore - a.matchScore);
  }, []);

  // === RANDAREA CARDULUI ===
  const renderCard = (card: any) => {
    if (!card) return null;

    // Culoarea badge-ului în funcție de scor
    let matchColor = COLORS.primary;
    if (card.matchScore >= 90) matchColor = '#4CAF50'; // Verde pt match puternic
    else if (card.matchScore >= 80) matchColor = '#FF9800'; // Portocaliu

    return (
      <View style={styles.card}>
        <Image source={{ uri: card.image_url }} style={styles.cardImage} />
        
        {/* 3️⃣ BADGE DE COMPATIBILITATE (Algoritm vizibil) */}
        <View style={[styles.matchBadge, { backgroundColor: matchColor }]}>
            <MaterialCommunityIcons name="percent" size={14} color="white" />
            <Text style={styles.matchBadgeText}>{card.matchScore}% Match</Text>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{card.name}</Text>
            <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{card.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.cardAddress} numberOfLines={1}>📍 {card.address}</Text>
          <Text style={styles.cardDescription} numberOfLines={3}>{card.short_description}</Text>
        </View>
      </View>
    );
  };

  const onSwipedRight = (cardIndex: number) => {
    const place = processedLocations[cardIndex];
    setMatchedPlace(place);
    setMatchModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Vibe ☕️</Text>
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
                // 4️⃣ Setări critice pentru poziționare
                cardVerticalMargin={20} 
                cardHorizontalMargin={(width - CARD_WIDTH) / 2} // Centrare orizontală
                animateCardOpacity
                swipeBackCard
                overlayLabels={{
                    left: {
                        title: 'NOPE',
                        style: { label: { borderColor: 'red', color: 'red', borderWidth: 3, fontSize: 24 } },
                        wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 20, marginLeft: -20 }
                    },
                    right: {
                        title: 'LIKE',
                        style: { label: { borderColor: '#4CAF50', color: '#4CAF50', borderWidth: 3, fontSize: 24 } },
                        wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 20, marginLeft: 20 }
                    }
                }}
            />
        ) : (
            <View style={styles.noCardsContainer}>
                <Ionicons name="checkmark-done-circle" size={80} color={COLORS.primary} />
                <Text style={styles.noCardsText}>Gata pe azi!</Text>
                <TouchableOpacity onPress={() => setCardsEnded(false)} style={styles.retryButton}>
                    <Text style={styles.retryText}>Reîncarcă</Text>
                </TouchableOpacity>
            </View>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.roundButton, styles.shadow, {backgroundColor: 'white'}]} onPress={() => swiperRef.current.swipeLeft()}>
          <Ionicons name="close" size={30} color="#FF5252" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.roundButton, styles.shadow, {backgroundColor: 'white', transform: [{scale: 0.8}]}]} onPress={() => swiperRef.current.swipeBack()}>
          <Ionicons name="refresh" size={24} color="#FFB74D" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.roundButton, styles.shadow, {backgroundColor: 'white'}]} onPress={() => swiperRef.current.swipeRight()}>
          <Ionicons name="heart" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Modal Match */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={matchModalVisible}
        onRequestClose={() => setMatchModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.matchTitle}>It's a Match! 🔥</Text>
            
            {matchedPlace && (
                <>
                    <View style={styles.matchScoreBubble}>
                        <Text style={styles.matchScoreText}>{matchedPlace.matchScore}% Compatibilitate</Text>
                    </View>

                    <View style={styles.matchPlaceContainer}>
                        <Image source={{ uri: matchedPlace.image_url }} style={styles.matchImage} />
                        <Text style={styles.matchPlaceName}>{matchedPlace.name}</Text>
                    </View>
                </>
            )}

            <TouchableOpacity style={styles.actionButton} onPress={() => setMatchModalVisible(false)}>
                <Text style={styles.actionButtonText}>Continuă</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    marginTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 80,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  swiperWrapper: {
    flex: 1,
    // Aici ne asigurăm că swiper-ul ocupă spațiul corect
    marginTop: -20,
  },
  // === CARD RESPONSIVE ===
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden', // Important pentru colțuri rotunjite
  },
  cardImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  matchBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 5,
  },
  matchBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  cardDetails: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#F57C00',
  },
  cardAddress: {
    color: '#999',
    fontSize: 13,
  },
  cardDescription: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  // Butoane
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 50,
  },
  roundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  // No Cards
  noCardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  noCardsText: {
    fontSize: 20,
    color: '#555',
    fontWeight: '600',
    marginTop: 15,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  retryText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#E91E63', // Roz aprins
    marginBottom: 15,
    transform: [{rotate: '-5deg'}]
  },
  matchScoreBubble: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 20,
  },
  matchScoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  matchPlaceContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  matchImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#F8F8F8',
    marginBottom: 15,
  },
  matchPlaceName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});