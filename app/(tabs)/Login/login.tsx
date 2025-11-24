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
  View
} from "react-native";

import LoadingScreen from "../components/LoadingScreen";
import { COLORS, styles } from "./styles";

// Firebase Imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🆕 1. Stare pentru vizibilitatea parolei (False = ascunsă implicit)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Eroare", "Te rugăm să completezi toate câmpurile.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logare reușită:", userCredential.user.email);
      router.replace("/(tabs)"); 

    } catch (error) {
      console.error(error);
      const err = error as any; 
      let errorMessage = "Ceva nu a mers bine.";
      
      if (err.code === 'auth/invalid-email') errorMessage = "Formatul email-ului este invalid.";
      if (err.code === 'auth/user-not-found') errorMessage = "Nu există un cont cu acest email.";
      if (err.code === 'auth/wrong-password') errorMessage = "Parola este incorectă.";
      if (err.code === 'auth/invalid-credential') errorMessage = "Email sau parolă incorecte.";
      if (err.code === 'auth/missing-password') errorMessage = "Te rugăm să introduci parola.";

      Alert.alert("Eșec la autentificare", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

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

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={22} color={COLORS.primary} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={COLORS.textSecondary}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* 🆕 Password Input Modificat */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />
          
          <TextInput
            placeholder="Parolă"
            placeholderTextColor={COLORS.textSecondary}
            // 🆕 Aici schimbăm logica: dacă isPasswordVisible e true, secureTextEntry e false
            secureTextEntry={!isPasswordVisible} 
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          {/* 🆕 Butonul de ochișor */}
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons 
              // Schimbăm iconița în funcție de stare
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
              size={22} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Button Login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Intră în aplicație</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Ai uitat parola?</Text>
        </TouchableOpacity>

        {/* Register Link */}
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