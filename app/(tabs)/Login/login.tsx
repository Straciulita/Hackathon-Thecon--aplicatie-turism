import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  // 1️⃣ IMPORTĂM componentele necesare
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Asigură-te că fișierul styles.js este cel actualizat la pasul anterior
import { COLORS, styles } from "./styles";

export default function LoginScreen() {
  const router = useRouter();

  return (
    // 2️⃣ WRAPPER PRINCIPAL: KeyboardAvoidingView
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* 3️⃣ SCROLLVIEW: Permite derularea și centrarea conținutului */}
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

        {/* Button Login */}
        <TouchableOpacity style={styles.loginButton}>
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