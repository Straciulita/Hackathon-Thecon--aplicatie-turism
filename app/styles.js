import { StyleSheet } from "react-native";

// 🎨 Paletă de Culori (Culori bazate pe maro din Login/Explore)
export const COLORS = {
  primary: "#6F4E37",
  background: "#F7EFE5",
  white: "#FFFFFF",
  textSecondary: "#7a6c65",
  inputBorder: "rgba(255,255,255,0.6)",
  inputBackground: "rgba(255,255,255,0.35)",
};

export const styles = StyleSheet.create({
  // Stilizare globală / container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Stilizare Login / Register
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
    padding: 15,
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
  
  // 🆕 STILURI PENTRU PROFIL (pentru profil.tsx)
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 15,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  bioInput: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    padding: 12,
    color: COLORS.primary,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  rowInput: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    padding: 12,
    color: COLORS.primary,
    fontSize: 15,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  activeChipText: {
    color: COLORS.white,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  colorCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeColorCircle: {
    borderColor: COLORS.primary,
    transform: [{ scale: 1.2 }],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 40,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});