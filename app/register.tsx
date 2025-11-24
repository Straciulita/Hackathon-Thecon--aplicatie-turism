import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator // Adăugat pentru loading
} from "react-native";

// Importuri Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

import { COLORS, styles } from "./styles";

export default function RegisterScreen() {
  const router = useRouter();

  // 1. State-uri pentru formular
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. Funcția de înregistrare
  const handleRegister = async () => {
    // Validări simple
    if (!email || !password || !confirmPassword) {
      Alert.alert("Eroare", "Te rugăm să completezi toate câmpurile.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Eroare", "Parolele nu coincid.");
      return;
    }

    setIsLoading(true);

    try {
      // Creare cont în Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      
      Alert.alert("Succes", "Cont creat cu succes!", [
        { text: "OK", onPress: () => router.replace("../(tabs)/index") } // Navighează direct în aplicație
      ]);
      
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Ceva nu a mers bine.";

      if (error.code === 'auth/email-already-in-use') errorMessage = "Acest email este deja folosit.";
      if (error.code === 'auth/invalid-email') errorMessage = "Formatul email-ului este invalid.";
      if (error.code === 'auth/weak-password') errorMessage = "Parola este prea slabă (minim 6 caractere).";

      Alert.alert("Eșec la înregistrare", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Icon header */}
        <View style={styles.iconWrapper}>
          <Ionicons name="person-add-outline" size={50} color={COLORS.primary} />
        </View>

        <Text style={styles.mainTitle}>Cont Nou</Text>
        <Text style={styles.subTitle}>Alătură-te comunității noastre ☕️</Text>

        {/* Input: Nume Complet */}
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={22} color={COLORS.primary} />
          <TextInput 
            placeholder="Nume complet" 
            placeholderTextColor={COLORS.textSecondary} 
            style={styles.input} 
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Input: Email */}
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={22} color={COLORS.primary} />
          <TextInput 
            placeholder="Email" 
            placeholderTextColor={COLORS.textSecondary} 
            style={styles.input} 
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input: Parolă */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />
          <TextInput 
            placeholder="Parolă" 
            placeholderTextColor={COLORS.textSecondary} 
            secureTextEntry 
            style={styles.input} 
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Input: Confirmă Parola */}
        <View style={styles.inputWrapper}>
          <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
          <TextInput 
            placeholder="Confirmă parola" 
            placeholderTextColor={COLORS.textSecondary} 
            secureTextEntry 
            style={styles.input} 
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Buton Creează Cont */}
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.loginText}>Creează cont</Text>
          )}
        </TouchableOpacity>

        {/* Link către Login */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Ai deja cont?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.registerLink}>Autentifică-te</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}