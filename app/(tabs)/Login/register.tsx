import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      {/* Icon mai mic */}
      <MaterialCommunityIcons name="coffee" size={64} color="#8B4513" style={styles.icon} />

      <Text style={styles.title}>Creează un cont nou</Text>

      {/* Input-uri */}
      <TextInput style={styles.input} placeholder="Nume complet" placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="Parolă" secureTextEntry placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="Confirmă parola" secureTextEntry placeholderTextColor="#999" />

      {/* Buton în stil Tinder */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Creează cont</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Ai deja cont? Autentifică-te</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF8F0",
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5A3825",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E6D5C3",
  },
  button: {
    backgroundColor: "#8B4513",
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  link: {
    color: "#8B4513",
    fontSize: 16,
    marginTop: 8,
  },
});
