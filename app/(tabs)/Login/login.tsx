import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react"; // 1️⃣ Importăm useState
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { COLORS, styles } from "./styles";

// 2️⃣ Importăm componenta LoadingScreen
// ⚠️ Asigură-te că calea este corectă (unde ai salvat fișierul LoadingScreen.js)
import LoadingScreen from "../components/LoadingScreen";

export default function LoginScreen() {
  const router = useRouter();
  
  // 3️⃣ Definim starea pentru încărcare
  const [isLoading, setIsLoading] = useState(false);

  // 4️⃣ Funcția care se activează la apăsarea butonului
  const handleLogin = () => {
    setIsLoading(true); // Pornim animația

    // Simulăm o cerere către server (3 secunde)
    setTimeout(() => {
      setIsLoading(false); // Oprim animația
      
      // Aici ai naviga în mod normal către Home
      // router.replace("/(tabs)"); 
      console.log("Logare reușită!");
    }, 3000);
  };

  // 5️⃣ Randare Condiționată: Dacă se încarcă, arătăm DOAR LoadingScreen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Altfel, arătăm ecranul normal de Login
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Icon */}
        <View style={styles.iconWrapper}>
          <Ionicons name="cafe-outline" size={70} color={COLORS.primary} />
        </View>

        <Text style={styles.mainTitle}>Explorează</Text>
        <Text style={styles.subTitle}>Găsește locuri pe gustul tău ☕️</Text>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={22} color={COLORS.primary} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={COLORS.textSecondary}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Parolă */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />
          <TextInput
            placeholder="Parolă"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Button Login - 6️⃣ Aici am adăugat onPress={handleLogin} */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Intră în aplicație</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Ai uitat parola?</Text>
        </TouchableOpacity>

        {/* Register */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Nu ai cont?</Text>
          <TouchableOpacity onPress={() => router.push("/Login/register")}>
            <Text style={styles.registerLink}>Creează unul</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}