import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface WeatherData {
  temp: number;
  condition: string;
  city: string;
}

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
}

export default function WeatherWidget({ weather, loading }: WeatherWidgetProps) {
  const { COLORS } = useTheme();

  // Funcție helper mutată aici pentru a curăța Home-ul
  const getWeatherIcon = (condition: string) => {
    if (!condition) return "partly-sunny";
    const c = condition.toLowerCase();
    if (c.includes("rain")) return "rainy";
    if (c.includes("cloud")) return "cloud";
    if (c.includes("clear") || c.includes("sun")) return "sunny";
    if (c.includes("snow")) return "snow";
    if (c.includes("thunder")) return "thunderstorm";
    return "partly-sunny";
  };

  return (
    <View style={[styles.weatherCard, { backgroundColor: COLORS.card }]}>
      <View>
        {loading && !weather ? (
           <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
              <Ionicons name="location-sharp" size={18} color={COLORS.primary} style={{marginRight: 4}} />
              <Text style={[styles.weatherCity, { color: COLORS.textPrimary }]}>
                {weather?.city || "Galați, RO"}
              </Text>
            </View>
            
            <Text style={[styles.weatherTemp, { color: COLORS.textPrimary }]}>
              {weather?.temp}°C
            </Text>
            <Text style={[styles.weatherDesc, { color: COLORS.textSecondary }]}>
              {weather?.condition || "Loading..."}
            </Text>
          </>
        )}
      </View>
      
      <Ionicons 
        name={getWeatherIcon(weather?.condition || "")} 
        size={60} 
        // Folosim culoarea "Caramel" (Primary) sau Galben pentru soare, 
        // dar pentru consistență cu tema ta, Primary e foarte elegant.
        color={COLORS.primary} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  weatherCard: { 
    marginHorizontal: 25, 
    borderRadius: 20, 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25, 
    // Umbre
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherCity: { fontSize: 18, fontWeight: 'bold' },
  weatherTemp: { fontSize: 36, fontWeight: '900' },
  weatherDesc: { fontSize: 14, textTransform: 'capitalize' },
});