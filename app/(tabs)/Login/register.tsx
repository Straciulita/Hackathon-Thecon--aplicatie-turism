import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  // 1️⃣ IMPORTĂM componentele necesare pentru responsivitate
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { COLORS, styles } from "./styles";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    // 2️⃣ WRAPPER PRINCIPAL: KeyboardAvoidingView
    // Acesta ridică ecranul când apare tastatura pe iOS
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* 3️⃣ SCROLLVIEW: Permite derularea pe ecrane mici */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Icon header */}
        <View style={styles.iconWrapper}>
          {/* 4️⃣ MODIFICAT: Am schimbat size de la 70 la 50 */}
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
          />
        </View>

        {/* Buton Creează Cont */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Creează cont</Text>
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