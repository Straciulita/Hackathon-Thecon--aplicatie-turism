import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Animated,
  Easing,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { auth } from '../firebaseConfig'; 
import { useTheme } from '../contexts/ThemeContext';

import FunFactCard from '../components/FunFactCard'; 
import WeatherWidget from '../components/WeatherWidget';

const WEATHER_API_KEY = "a9b72c6e273c9a565a6c71574ef3d4db";

const GALATI_COORDS = {
  latitude: 45.4353,
  longitude: 28.0080
};

export default function HomeScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const { COLORS, isDark } = useTheme();

  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const floatAnim = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(20)).current;

  // === 1. PORECLE ===
  const funnyNickname = useMemo(() => {
    const nicknames = [
      "Maestre", "Căpitane", "Șefu'", "Coffee Ninja", "Gurmandule",
      "Exploratorule", "Campioane", "Star", "Boss", "Vibe Hunter"
    ];
    return nicknames[Math.floor(Math.random() * nicknames.length)];
  }, [refreshing]);

  // === 2. FETCH VREME ===
  const fetchWeather = async () => {
    if (!refreshing) setLoading(true);

    try {
      const { latitude, longitude } = GALATI_COORDS;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            city: "Galați, RO" 
        });
      } else {
        throw new Error("API Error");
      }
    } catch (error) {
      console.log("Weather Error:", error);
      setWeather({ temp: 18, condition: 'Clouds', city: 'Galați, RO' });
    } finally {
      setLoading(false);
      animateCardEntry();
    }
  };

  // === 3. LOGICA RECOMANDARE ===
  const getSmartRecommendation = () => {
    // Default
    let rec = {
        drink: "Cappuccino Clasic",
        desc: "O zi echilibrată cere o cafea pe măsură. Perfect pentru Faleză! ☕",
        icon: "cafe",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d"
    };

    if (weather) {
        const temp = weather.temp;
        const cond = (weather.condition || "").toLowerCase();
        
        if (cond.includes('rain') || cond.includes('drizzle')) {
            return {
                drink: "Comfort Tea & Carte",
                desc: "Plouă la Galați? Stai la căldură cu un ceai aromat. 🌧️📖",
                icon: "umbrella",
                image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574"
            };
        }
        if (temp >= 25) {
            return {
                drink: "Iced Caramel Latte",
                desc: `E cald (${temp}°C)! Răcorește-te cu ceva rece și dulce. 🧊☀️`,
                icon: "sunny",
                image: "https://images.unsplash.com/photo-1517701604599-bb29b5c7fa69"
            };
        } 
        if (temp <= 10) {
            return {
                drink: "Vin Fiert",
                desc: `Brrr, ${temp}°C. Un vin fiert pe Domnească e tot ce trebuie. 🍷❄️`,
                icon: "snow",
                image: "https://images.unsplash.com/photo-1510041084273-6b7244b09757"
            };
        }
        if (cond.includes('clear') || cond.includes('sun')) {
             return {
                drink: "Espresso Tonic",
                desc: "Soare pe cer? Încearcă ceva fresh. Vibe perfect de oraș. ✨",
                icon: "glasses",
                image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"
            };
        }
    }
    return rec;
  };

  const rec = getSmartRecommendation();

  const animateCardEntry = () => {
    cardOpacity.setValue(0);
    cardTranslateY.setValue(20);
    Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(cardTranslateY, { toValue: 0, friction: 6, useNativeDriver: true })
    ]).start();
  };

  useEffect(() => {
    fetchWeather();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 10, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather().then(() => setRefreshing(false));
  };

  const displayName = user?.displayName 
    ? user.displayName.split(' ')[0] 
    : user?.email?.split('@')[0] || "User";

  // ✅ Culoarea fixă cerută (Bleu din paletă)
  const CARD_COLOR = COLORS.secondary; 

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Neatza,</Text> 
                <Text style={[styles.username, { color: COLORS.primary }]}>
                  {funnyNickname} {displayName}! 👋
                </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.profileBtn}>
                <Image 
                  source={{ uri: user?.photoURL || 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg' }} 
                  style={styles.avatarSmall} 
                />
            </TouchableOpacity>
        </View>

        {/* WIDGET VREME */}
        <WeatherWidget weather={weather} loading={loading} />

        {/* RECOMANDARE - ACUM PE ALBASTRU */}
        <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Recomandarea Zilei ✨</Text>
        <Animated.View style={[styles.promoCard, { backgroundColor: CARD_COLOR, opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }]}>
            <View style={styles.promoContent}>
                <View style={styles.promoBadge}>
                    <Ionicons name={rec.icon as any} size={16} color="white" />
                    <Text style={styles.promoBadgeText}>VIBE DE GALAȚI</Text>
                </View>
                <Text style={styles.promoTitle}>{rec.drink}</Text>
                <Text style={styles.promoDesc}>{rec.desc}</Text>
                <TouchableOpacity style={styles.promoBtn} onPress={() => router.push('/(tabs)/list')}>
                    {/* Iconita din buton este acum tot culoarea cardului pentru contrast */}
                    <Text style={[styles.promoBtnText, { color: CARD_COLOR }]}>Găsește acum</Text>
                    <Ionicons name="arrow-forward" size={16} color={CARD_COLOR} />
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.promoImageWrapper, { transform: [{ translateY: floatAnim }] }]}>
                <Image source={{ uri: rec.image }} style={styles.promoImage} />
            </Animated.View>
        </Animated.View>

        {/* QUICK ACTIONS */}
        <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Ce vrei să faci azi?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20, paddingBottom: 10 }}>
             <TouchableOpacity style={[styles.actionCard, { backgroundColor: COLORS.card }]} onPress={() => router.push('/')}>
                <View style={{backgroundColor: '#E3F2FD', padding: 15, borderRadius: 50, marginBottom: 10}}>
                    <Ionicons name="map" size={30} color="#2196F3" />
                </View>
                <Text style={[styles.actionText, { color: COLORS.textPrimary }]}>Vezi Harta</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.actionCard, { backgroundColor: COLORS.card }]} onPress={() => router.push('/(tabs)/list')}>
                <View style={{backgroundColor: '#F3E5F5', padding: 15, borderRadius: 50, marginBottom: 10}}>
                    <Ionicons name="list" size={30} color="#9C27B0" />
                </View>
                <Text style={[styles.actionText, { color: COLORS.textPrimary }]}>Vezi Lista</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.actionCard, { backgroundColor: COLORS.card }]} onPress={() => router.push('/(tabs)/MatchScreen')}>
                <View style={{backgroundColor: '#FFEBEE', padding: 15, borderRadius: 50, marginBottom: 10}}>
                    <Ionicons name="heart" size={30} color="#E91E63" />
                </View>
                <Text style={[styles.actionText, { color: COLORS.textPrimary }]}>Găsește Vibe</Text>
             </TouchableOpacity>
        </ScrollView>

        {/* FUN FACTS */}
        <FunFactCard refreshTrigger={refreshing} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 60, marginBottom: 20 },
  greeting: { fontSize: 16, color: '#888' },
  username: { fontSize: 20, fontWeight: 'bold', flexWrap: 'wrap', maxWidth: '80%' },
  profileBtn: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  avatarSmall: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: 'white' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 25, marginBottom: 15 },
  
  promoCard: { marginHorizontal: 25, borderRadius: 25, height: 220, padding: 20, flexDirection: 'row', overflow: 'hidden', marginBottom: 30, elevation: 8 },
  promoContent: { flex: 1, justifyContent: 'center', zIndex: 2 },
  promoBadge: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10, alignItems: 'center', gap: 5 },
  promoBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  promoTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  promoDesc: { fontSize: 12, color: 'rgba(255,255,255,0.95)', marginBottom: 15, width: '90%' },
  promoBtn: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5 },
  promoBtnText: { fontWeight: 'bold', fontSize: 12 },
  promoImageWrapper: { position: 'absolute', right: -20, bottom: -30, width: 170, height: 170, zIndex: 1 },
  promoImage: { width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 20, transform: [{rotate: '-10deg'}] },
  
  actionCard: { width: 140, height: 140, marginRight: 15, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 3, marginBottom: 20 },
  actionText: { fontWeight: 'bold', fontSize: 16 }
});