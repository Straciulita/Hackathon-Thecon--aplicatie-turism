import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Lista de curiozități a fost mutată aici
const FUN_FACTS = [
  "Știai că? 🐐 Cafeaua a fost descoperită în Etiopia de niște capre care au devenit energice după ce au mâncat boabe de cafea!",
  "Știai că? 🇫🇮 Finlanda este țara cu cel mai mare consum de cafea pe cap de locuitor din lume.",
  "Știai că? ✈️ Cel mai scurt zbor comercial din lume durează doar 57 de secunde (între două insule din Scoția).",
  "Știai că? 🍵 Toate tipurile de ceai (negru, verde, alb) provin din aceeași plantă: Camellia Sinensis.",
  "Știai că? 📸 Numele 'Cappuccino' vine de la asemănarea culorii cu robele călugărilor Capucini.",
  "Știai că? 🧠 Doar mirosul de cafea poate reduce stresul și oboseala, chiar înainte să o bei.",
  "Știai că? 🗼 Turnul Eiffel crește cu aproximativ 15 cm vara din cauza dilatării termice a fierului.",
  "Știai că? ☕ 'Espresso' înseamnă 'presat' în italiană, referindu-se la modul de preparare.",
  "Știai că? 🌍 Suntem mai creativi când călătorim, deoarece creierul trebuie să se adapteze la situații noi."
];

interface FunFactCardProps {
  refreshTrigger: boolean; // Folosim asta ca să știm când să schimbăm mesajul
}

export default function FunFactCard({ refreshTrigger }: FunFactCardProps) {
  const { COLORS, isDark } = useTheme();

  // Alegem un fapt aleatoriu doar când se schimbă refreshTrigger
  const randomFact = useMemo(() => {
    return FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
  }, [refreshTrigger]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: COLORS.textPrimary }]}>Știai că... ? 💡</Text>
      
      <View style={[styles.card, { backgroundColor: isDark ? '#333' : '#FFF3E0' }]}>
        <Ionicons 
            name="bulb-outline" 
            size={28} 
            color={isDark ? '#FFD700' : '#FF9800'} 
        />
        <Text style={[styles.text, { color: COLORS.textPrimary }]}>
            {randomFact}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 40,
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 25, 
    marginBottom: 10 
  },
  card: {
    marginHorizontal: 25,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  }
});