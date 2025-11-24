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
  Image
} from "react-native";

// ✅ CORECȚIE CĂI IMPORT (relative la rădăcina app/)
import LoadingScreen from "./components/LoadingScreen"; 
import { COLORS, styles } from "./styles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig"; 

const logoImage = require('../assets/images/coffee_pin.png');

export default function LoginScreen() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Eroare", "Te rugăm să completezi toate câmpurile.");
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Nu mai e nevoie de navigare manuală, AuthContext o va face automat.
      // Dar dacă vrei, calea corectă este doar '/(tabs)/'
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Ceva nu a mers bine.";
      
      if (error.code === 'auth/invalid-email') errorMessage = "Formatul email-ului este invalid.";
      if (error.code === 'auth/user-not-found') errorMessage = "Nu există un cont cu acest email.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') errorMessage = "Email sau parolă incorecte.";
      
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
        <View style={styles.iconWrapper}>
          <Image source={logoImage} style={{width: 60, height: 60, resizeMode: 'contain'}} />
        </View>

        <Text style={styles.mainTitle}>Explorează</Text>
        <Text style={styles.subTitle}>Găsește locuri pe gustul tău ☕️</Text>

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

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />
          <TextInput
            placeholder="Parolă"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry={!isPasswordVisible} 
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons 
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
              size={22} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Intră în aplicație</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Ai uitat parola?</Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Nu ai cont?</Text>
          {/* ✅ Navigare corectă către register */}
          <TouchableOpacity onPress={() => router.push("../register")}>
            <Text style={styles.registerLink}>Creează unul!</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}