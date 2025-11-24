import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const COLORS = {
  primary: "#6F4E37", // Coffee Brown
  lightCoffee: "#DCC7B9",
  background: "#F7EFE5",
  white: "#FFFFFF",
};

export default function LoginScreen() {
  return (
    <View style={styles.container}>

      {/* 🔥 Icon principal – stil Tinder, dar cu cafea */}
      <View style={styles.iconWrapper}>
        <Ionicons name="cafe-outline" size={90} color={COLORS.primary} />
      </View>

      <Text style={styles.mainTitle}>Explorează</Text>
      <Text style={styles.subTitle}>Găsește locuri pe gustul tău ☕️</Text>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={22} color={COLORS.primary} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#7a6c65"
          style={styles.input}
        />
      </View>

      {/* Parola */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />
        <TextInput
          placeholder="Parolă"
          placeholderTextColor="#7a6c65"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Intră în aplicație</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Ai uitat parola?</Text>
      </TouchableOpacity>

      {/* Register */}
      <View style={styles.registerRow}>
        <Text style={styles.registerText}>Nu ai cont?</Text>
        <TouchableOpacity>
          <Text style={styles.registerLink}>Creează unul</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  iconWrapper: {
    marginBottom: 30,
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 20,
    borderRadius: 100,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },

  mainTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },

  subTitle: {
    fontSize: 16,
    color: "#7a6c65",
    marginBottom: 40,
  },

  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(12px)",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.primary,
    fontSize: 16,
  },

  loginButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  loginText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },

  forgotPassword: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 14,
  },

  registerRow: {
    flexDirection: "row",
    marginTop: 35,
  },

  registerText: {
    fontSize: 16,
    color: "#7a6c65",
  },

  registerLink: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});
