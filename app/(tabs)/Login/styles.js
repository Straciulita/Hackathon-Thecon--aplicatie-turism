import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#6F4E37",
  background: "#F7EFE5",
  white: "#FFFFFF",
  textSecondary: "#7a6c65",
  inputBorder: "rgba(255,255,255,0.6)",
  inputBackground: "rgba(255,255,255,0.35)",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  iconWrapper: {
    marginBottom: 25,
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 15, // Padding mai mic pentru iconița de 50-70px
    borderRadius: 100,
    borderColor: "rgba(0,0,0,0.05)",
    borderWidth: 1,
  },

  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },

  subTitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 35,
  },

  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
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

  // 👇 ACESTA LIPSEA și cauza eroarea
  forgotPassword: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  registerRow: {
    flexDirection: "row",
    marginTop: 35,
    marginBottom: 20,
  },

  registerText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },

  registerLink: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});