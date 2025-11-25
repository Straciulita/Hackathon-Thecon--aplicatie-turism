import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';

import { auth } from '../firebaseConfig';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { COLORS, isDark, theme, setTheme } = useTheme();
  const user = auth.currentUser;

  // --- STATE-URI ---
  const [name, setName] = useState("Coffee Explorer");
  const [bio, setBio] = useState("Caut cea mai bună cafea din oraș. ☕️");
  const [image, setImage] = useState('https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg');
  
  // State pentru preferința Coffee/Tea
  const [drinkPref, setDrinkPref] = useState<'coffee' | 'tea'>('coffee');

  // 🎨 State pentru Culoarea Profilului (Default: Maro-ul temei)
  const [favColor, setFavColor] = useState('#8B5A3C');

  // State pentru Modul de Editare
  const [isEditing, setIsEditing] = useState(false);

  // Culori disponibile pentru selectare
  const PROFILE_COLORS = [
    '#8B5A3C', // Maro (Default)
    '#2E8B57', // Verde Pădure
    '#1E90FF', // Albastru
    '#E91E63', // Roz
    '#FF9800', // Portocaliu
    '#607D8B', // Gri Albăstrui
  ];

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      Alert.alert("Eroare", "Nu am putut să te deconectăm.");
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      Alert.alert("Salvat", "Profilul tău a fost actualizat!");
    }
    setIsEditing(!isEditing);
  };

  const toggleDrinkPref = () => {
    if (!isEditing) return;
    setDrinkPref(prev => prev === 'coffee' ? 'tea' : 'coffee');
  };

  const renderThemeOption = (mode: 'light' | 'dark' | 'system', icon: string, label: string) => {
    const isActive = theme === mode;
    return (
      <TouchableOpacity 
        style={[
          styles.themeButton, 
          { 
            backgroundColor: isActive ? COLORS.primary : (isDark ? '#444' : '#EEE'),
            borderColor: isActive ? COLORS.primary : 'transparent'
          }
        ]}
        onPress={() => setTheme(mode)}
      >
        <Ionicons 
          name={icon as any} 
          size={20} 
          color={isActive ? '#FFF' : (isDark ? '#DDD' : '#555')} 
        />
        <Text style={[
          styles.themeButtonText, 
          { color: isActive ? '#FFF' : (isDark ? '#DDD' : '#555') }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* === HEADER DINAMIC === */}
        {/* Folosim favColor pentru fundal */}
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

            {/* Buton Principal Editare / Salvare */}
            <TouchableOpacity 
              style={[styles.editMainBtn, { backgroundColor: isEditing ? '#4CAF50' : favColor }]} 
              onPress={toggleEdit}
            >
              <Ionicons name={isEditing ? "checkmark" : "pencil"} size={18} color="white" />
              <Text style={styles.editMainBtnText}>{isEditing ? "Salvează" : "Editează Profilul"}</Text>
            </TouchableOpacity>

            <Text style={[styles.emailText, { color: COLORS.textLight }]}>{user?.email || "guest@app.com"}</Text>

            {/* === SELECTOR CULOARE (Doar în Edit Mode) === */}
            {isEditing && (
              <View style={styles.colorPickerContainer}>
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
                        favColor === color && styles.activeColorCircle // Highlight selecție
                      ]}
                      onPress={() => setFavColor(color)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* === SECTIUNE: MY VIBE === */}
            <View style={styles.sectionContainer}>
               <Text style={[styles.sectionHeader, { color: COLORS.textPrimary }]}>My Vibe</Text>
               
               <TouchableOpacity 
                  style={[
                    styles.drinkCard, 
                    { 
                      // Folosim favColor pentru fundalul cardului
                      backgroundColor: drinkPref === 'coffee' ? favColor : (isDark ? '#333' : '#8BC34A'),
                      opacity: isEditing ? 1 : 0.9 
                    }
                  ]}
                  onPress={toggleDrinkPref}
                  activeOpacity={isEditing ? 0.7 : 1}
               >
                  <MaterialCommunityIcons 
                      name={drinkPref === 'coffee' ? "coffee" : "tea"} 
                      size={32} 
                      color="#FFF" 
                  />
                  <Text style={styles.drinkText}>
                      {drinkPref === 'coffee' ? "Team Coffee Lover ☕" : "Team Tea Lover 🍵"}
                  </Text>
                  
                  {isEditing && (
                    <View style={styles.editBadge}>
                      <Ionicons name="swap-horizontal" size={12} color={favColor} />
                    </View>
                  )}
               </TouchableOpacity>
            </View>

            {/* === FORMULAR === */}
            <View style={styles.formSection}>
                <Text style={[styles.label, { color: COLORS.textPrimary }]}>Nume Afișat</Text>
                <TextInput 
                    style={[
                      styles.input, 
                      { 
                        color: COLORS.textPrimary, 
                        backgroundColor: isDark ? '#333' : '#FFF',
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
                        backgroundColor: isDark ? '#333' : '#FFF',
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

            {/* === SETĂRI TEMĂ === */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionHeader, { color: COLORS.textPrimary }]}>Temă Aplicație</Text>
              <View style={styles.themeRow}>
                {renderThemeOption('light', 'sunny', 'Light')}
                {renderThemeOption('dark', 'moon', 'Dark')}
                {renderThemeOption('system', 'desktop-outline', 'Auto')}
              </View>
            </View>

            {/* === STATISTICI === */}
            <View style={[styles.statsRow, { backgroundColor: isDark ? '#333' : '#FFF' }]}>
                <View style={styles.statBadge}>
                    <Text style={[styles.statNumber, { color: favColor }]}>12</Text>
                    <Text style={styles.statLabel}>Locuri</Text>
                </View>
                <View style={[styles.statBadge, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: isDark ? '#555' : '#eee' }]}>
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
  container: {
    flex: 1,
  },
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
  
  // Styles pentru Color Picker
  colorPickerContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
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
    borderColor: 'white', // Border default
    elevation: 2,
  },
  activeColorCircle: {
    borderWidth: 3,
    borderColor: '#333', // Border când e selectat
    transform: [{ scale: 1.1 }],
  },

  // Drink Card
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
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  editBadge: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#FFF',
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