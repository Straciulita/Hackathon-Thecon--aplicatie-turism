import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from '../firebaseConfig';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileScreen() {
  const { COLORS, isDark, theme, setTheme } = useTheme();
  const user = auth.currentUser;

  // --- STATE-URI ---
  const [name, setName] = useState("Coffee Explorer");
  const [bio, setBio] = useState("Caut cea mai bună cafea din oraș. ☕️");
  const [image, setImage] = useState('https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg');
  const [drinkPref, setDrinkPref] = useState<'coffee' | 'tea'>('coffee');
  const [favColor, setFavColor] = useState('#8B5A3C');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const PROFILE_COLORS = [
    '#8B5A3C', '#2E8B57', '#1E90FF', '#E91E63', '#FF9800', '#607D8B',
  ];
  
  const STORAGE_KEYS = {
    NAME: `user_name_${user?.uid}`,
    BIO: `user_bio_${user?.uid}`,
    IMAGE: `user_image_${user?.uid}`,
    DRINK: `user_drink_${user?.uid}`,
    COLOR: `user_color_${user?.uid}`,
  };

  // ✅ 1. ÎNCĂRCARE DATE
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedName = await AsyncStorage.getItem(STORAGE_KEYS.NAME);
        const savedBio = await AsyncStorage.getItem(STORAGE_KEYS.BIO);
        const savedImage = await AsyncStorage.getItem(STORAGE_KEYS.IMAGE);
        const savedDrink = await AsyncStorage.getItem(STORAGE_KEYS.DRINK);
        const savedColor = await AsyncStorage.getItem(STORAGE_KEYS.COLOR);

        if (savedName) setName(savedName);
        if (savedBio) setBio(savedBio);
        if (savedImage) setImage(savedImage);
        if (savedDrink) setDrinkPref(savedDrink as 'coffee' | 'tea');
        if (savedColor) setFavColor(savedColor);
        
      } catch (error) {
        console.log("Eroare la încărcarea profilului", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user) {
        loadProfileData();
    }
  }, [user]);

  // ✅ 2. SALVARE DATE
  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NAME, name);
      await AsyncStorage.setItem(STORAGE_KEYS.BIO, bio);
      await AsyncStorage.setItem(STORAGE_KEYS.IMAGE, image);
      await AsyncStorage.setItem(STORAGE_KEYS.DRINK, drinkPref);
      await AsyncStorage.setItem(STORAGE_KEYS.COLOR, favColor);
    } catch (error) {
      Alert.alert("Eroare", "Nu am putut salva datele local.");
    }
  };

  // --- FUNCȚII ---

  const pickImage = async () => {
    if (!isEditing) return; 

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🔑 LOGOUT (Fără redirect manual)
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Eroare", "Nu am putut să te deconectăm.");
    }
  };

  const toggleEdit = async () => {
    if (isEditing) {
      await saveProfileData();
      Alert.alert("Salvat", "Profilul tău a fost actualizat!");
    }
    setIsEditing(!isEditing);
  };

  const toggleDrinkPref = () => {
    if (!isEditing) return;
    setDrinkPref(prev => prev === 'coffee' ? 'tea' : 'coffee');
  };

  // ✅ FUNCȚIE CORECTATĂ PENTRU ASPECT ȘI FUNCȚIONALITATE TEMATICĂ
  const renderThemeOption = (mode: 'light' | 'dark' | 'system', icon: string, label: string) => {
    const isActive = theme === mode;
    
    // Culoarea fundalului inactiv: Cardul (Alb/Gri închis)
    const inactiveBg = COLORS.card;
    // Culoarea textului inactiv: Textul principal (Maro închis/Alb)
    const inactiveText = COLORS.textPrimary;
    
    return (
      <TouchableOpacity 
        style={[
          styles.themeButton, 
          { 
            // Fundal: Primar (Activ) sau Card (Inactiv)
            backgroundColor: isActive ? COLORS.primary : inactiveBg, 
            // Bordură: Primar (Activ) sau Text Secondary (Inactiv)
            borderColor: isActive ? COLORS.primary : COLORS.border
          }
        ]}
        onPress={() => setTheme(mode)}
      >
        <Ionicons 
          name={icon as any} 
          size={20} 
          // Culoare icon: Alb (Activ) sau Text Primar (Inactiv)
          color={isActive ? COLORS.white : inactiveText} 
        />
        <Text style={[
          styles.themeButtonText, 
          { color: isActive ? COLORS.white : inactiveText }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoadingData) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }]}>
              <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
      );
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* === HEADER DINAMIC === */}
        <View style={[styles.headerCover, { backgroundColor: favColor }]}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>

        {/* === CONȚINUT PROFIL === */}
        <View style={styles.profileContent}>
            
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <Image source={{ uri: image }} style={[styles.avatar, { borderColor: COLORS.background }]} />
                {isEditing && (
                  <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
                      <Ionicons name="camera" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
            </View>

            {/* Buton Editare / Salvare */}
            <TouchableOpacity 
              style={[styles.editMainBtn, { backgroundColor: isEditing ? COLORS.success : favColor }]} 
              onPress={toggleEdit}
            >
              <Ionicons name={isEditing ? "checkmark" : "pencil"} size={18} color="white" />
              <Text style={styles.editMainBtnText}>{isEditing ? "Salvează" : "Editează Profilul"}</Text>
            </TouchableOpacity>

            <Text style={[styles.emailText, { color: COLORS.textLight }]}>{user?.email || "guest@app.com"}</Text>

            {/* Selector Culoare (Doar în Edit Mode) */}
            {isEditing && (
              <View style={[styles.colorPickerContainer, {backgroundColor: COLORS.card}]}>
                <Text style={[styles.sectionHeader, { color: COLORS.textPrimary, fontSize: 14, marginBottom: 8 }]}>
                  Alege culoarea profilului:
                </Text>
                <View style={styles.colorRow}>
                  {PROFILE_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorCircle, 
                        { backgroundColor: color },
                        favColor === color && styles.activeColorCircle 
                      ]}
                      onPress={() => setFavColor(color)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* My Vibe */}
            <View style={styles.sectionContainer}>
               <Text style={[styles.sectionHeader, { color: COLORS.textPrimary }]}>My Vibe</Text>
               
               <TouchableOpacity 
                  style={[
                    styles.drinkCard, 
                    { 
                      backgroundColor: drinkPref === 'coffee' ? favColor : COLORS.card,
                      opacity: isEditing ? 1 : 0.9,
                      // Culoarea borderului de contrast în dark mode
                      borderWidth: isDark && drinkPref !== 'coffee' ? 1 : 0, 
                      borderColor: COLORS.border
                    }
                  ]}
                  onPress={toggleDrinkPref}
                  activeOpacity={isEditing ? 0.7 : 1}
               >
                  <MaterialCommunityIcons 
                      name={drinkPref === 'coffee' ? "coffee" : "tea"} 
                      size={32} 
                      // Textul/Iconița are nevoie de culoare vizibilă pe fundalul ales
                      color={drinkPref === 'coffee' ? "#FFF" : COLORS.textPrimary} 
                  />
                  <Text style={[styles.drinkText, {color: drinkPref === 'coffee' ? "#FFF" : COLORS.textPrimary}]}>
                      {drinkPref === 'coffee' ? "Team Coffee Lover ☕" : "Team Tea Lover 🍵"}
                  </Text>
                  
                  {isEditing && (
                    <View style={[styles.editBadge, {backgroundColor: COLORS.white}]}>
                      <Ionicons name="swap-horizontal" size={12} color={favColor} />
                    </View>
                  )}
               </TouchableOpacity>
            </View>

            {/* Formular */}
            <View style={styles.formSection}>
                <Text style={[styles.label, { color: COLORS.textPrimary }]}>Nume Afișat</Text>
                <TextInput 
                    style={[
                      styles.input, 
                      { 
                        color: COLORS.textPrimary, 
                        backgroundColor: COLORS.card,
                        borderColor: isEditing ? favColor : 'transparent',
                        borderWidth: isEditing ? 1 : 0
                      }
                    ]} 
                    value={name} 
                    onChangeText={setName} 
                    editable={isEditing}
                />

                <Text style={[styles.label, { color: COLORS.textPrimary }]}>Bio</Text>
                <TextInput 
                    style={[
                      styles.input, 
                      { 
                        height: 80, 
                        textAlignVertical: 'top',
                        color: COLORS.textPrimary, 
                        backgroundColor: COLORS.card,
                        borderColor: isEditing ? favColor : 'transparent',
                        borderWidth: isEditing ? 1 : 0
                      }
                    ]} 
                    value={bio} 
                    onChangeText={setBio} 
                    multiline
                    editable={isEditing}
                />
            </View>

            {/* Setări Temă */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionHeader, { color: COLORS.textPrimary }]}>Temă Aplicație</Text>
              <View style={styles.themeRow}>
                {renderThemeOption('light', 'sunny', 'Light')}
                {renderThemeOption('dark', 'moon', 'Dark')}
                {renderThemeOption('system', 'desktop-outline', 'Auto')}
              </View>
            </View>

            {/* Statistici */}
            <View style={[styles.statsRow, { backgroundColor: COLORS.card }]}>
                <View style={styles.statBadge}>
                    <Text style={[styles.statNumber, { color: favColor }]}>12</Text>
                    <Text style={styles.statLabel}>Locuri</Text>
                </View>
                <View style={[styles.statBadge, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border }]}>
                    <Text style={[styles.statNumber, { color: favColor }]}>5</Text>
                    <Text style={styles.statLabel}>Recenzii</Text>
                </View>
                <View style={styles.statBadge}>
                    <Text style={[styles.statNumber, { color: favColor }]}>🔥</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                </View>
            </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerCover: {
    height: 150,
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingRight: 20,
  },
  logoutBtn: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 15,
  },
  profileContent: {
    alignItems: 'center',
    marginTop: -50,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },
  editMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  editMainBtnText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emailText: {
    fontSize: 14,
    marginBottom: 15,
  },
  colorPickerContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 2,
  },
  activeColorCircle: {
    borderWidth: 3,
    borderColor: '#333',
    transform: [{ scale: 1.1 }],
  },
  drinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 10,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  drinkText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  editBadge: {
    position: 'absolute',
    right: 15,
    padding: 4,
    borderRadius: 10,
  },
  formSection: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
    marginLeft: 5,
    marginTop: 10,
  },
  input: {
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
  },
  themeButtonText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 20,
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
  },
  statBadge: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
});