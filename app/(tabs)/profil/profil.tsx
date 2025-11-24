import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // 1️⃣ Importăm ImagePicker
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { auth } from '../firebaseConfig';
import { COLORS } from '../Login/styles'; // Păstrăm culorile, dar refacem stilurile locale

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  // State-uri
  const [name, setName] = useState("Coffee Explorer");
  const [bio, setBio] = useState("Caut cea mai bună cafea din oraș. ☕️");
  
  // 2️⃣ State pentru imaginea de profil (Default vs Aleasă)
  const [image, setImage] = useState('https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg');

  const [drinkPref, setDrinkPref] = useState('coffee');
  const [favColor, setFavColor] = useState('#6F4E37');

  // 3️⃣ Funcția pentru a alege poza din telefon
  const pickImage = async () => {
    // Cerem permisiunea (nu e mereu necesar pe ultimele versiuni, dar e best practice)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Scuze!', 'Avem nevoie de permisiuni pentru a accesa galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Pătrat
      quality: 0.5, // Calitate medie pentru a nu îngreuna app
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/Login/login');
    } catch (error) {
      Alert.alert("Eroare", "Nu am putut să te deconectăm.");
    }
  };

  return (
    <View style={localStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* === HEADER CU DESIGN NOU (COVER) === */}
        <View style={[localStyles.headerCover, { backgroundColor: favColor }]}>
            {/* Buton de setări sau logout sus în dreapta */}
            <TouchableOpacity style={localStyles.topRightBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>

        {/* === ZONA PROFILULUI (Suprapusă) === */}
        <View style={localStyles.profileContent}>
            
            {/* Avatar cu buton de upload */}
            <View style={localStyles.avatarWrapper}>
                <Image source={{ uri: image }} style={localStyles.avatar} />
                <TouchableOpacity style={localStyles.cameraBtn} onPress={pickImage}>
                    <Ionicons name="camera" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Nume și Email */}
            <Text style={localStyles.nameText}>{name}</Text>
            <Text style={localStyles.emailText}>{user?.email || "guest@app.com"}</Text>

            {/* === STATISTICI / BADGES (Visual Candy) === */}
            <View style={localStyles.statsRow}>
                <View style={localStyles.statBadge}>
                    <Text style={localStyles.statNumber}>12</Text>
                    <Text style={localStyles.statLabel}>Locuri</Text>
                </View>
                <View style={[localStyles.statBadge, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#eee' }]}>
                    <Text style={localStyles.statNumber}>5</Text>
                    <Text style={localStyles.statLabel}>Recenzii</Text>
                </View>
                <View style={localStyles.statBadge}>
                    <Text style={localStyles.statNumber}>🔥</Text>
                    <Text style={localStyles.statLabel}>Streak</Text>
                </View>
            </View>

            {/* === FORMULARUL (Mai curat) === */}
            <View style={localStyles.formSection}>
                <Text style={localStyles.label}>Display Name</Text>
                <TextInput 
                    style={localStyles.input} 
                    value={name} 
                    onChangeText={setName} 
                />

                <Text style={localStyles.label}>My Vibe (Bio)</Text>
                <TextInput 
                    style={[localStyles.input, { height: 80, textAlignVertical: 'top' }]} 
                    value={bio} 
                    onChangeText={setBio} 
                    multiline
                />
            </View>

            {/* === PREFERINȚE (GRID LAYOUT) === */}
            <Text style={localStyles.sectionHeader}>Preferințele mele</Text>
            
            <View style={localStyles.preferencesGrid}>
                {/* Card 1: Drink */}
                <TouchableOpacity 
                    style={[localStyles.prefCard, drinkPref === 'coffee' ? localStyles.cardActive : null]}
                    onPress={() => setDrinkPref(drinkPref === 'coffee' ? 'tea' : 'coffee')}
                >
                    <MaterialCommunityIcons 
                        name={drinkPref === 'coffee' ? "coffee" : "tea"} 
                        size={32} 
                        color={drinkPref === 'coffee' ? COLORS.white : COLORS.primary} 
                    />
                    <Text style={[localStyles.prefText, drinkPref === 'coffee' ? {color:'white'} : null]}>
                        {drinkPref === 'coffee' ? "Team Coffee" : "Team Tea"}
                    </Text>
                </TouchableOpacity>

                {/* Card 2: Color Picker (Simplificat) */}
                <View style={localStyles.prefCard}>
                    <Text style={[localStyles.prefText, {marginBottom: 10}]}>Theme Color</Text>
                    <View style={{flexDirection: 'row', gap: 5}}>
                        {['#6F4E37', '#2E8B57', '#C71585'].map(c => (
                            <TouchableOpacity 
                                key={c}
                                style={[localStyles.miniColorDot, {backgroundColor: c}, favColor === c && {borderWidth: 2, borderColor: 'black'}]}
                                onPress={() => setFavColor(c)}
                            />
                        ))}
                    </View>
                </View>
            </View>

        </View>
      </ScrollView>
    </View>
  );
}

// 4️⃣ STILURI NOI (Specifice acestui design diferit)
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Fundal foarte deschis
  },
  headerCover: {
    height: 180, // Header înalt colorat
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  topRightBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 15,
  },
  profileContent: {
    alignItems: 'center',
    marginTop: -60, // Tragem conținutul peste header
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#F9F9F9', // Aceeași culoare ca fundalul paginii
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  nameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 20,
    justifyContent: 'space-around',
    marginBottom: 25,
    elevation: 3,
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
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  formSection: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    color: '#333',
  },
  sectionHeader: {
    width: '100%',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    paddingLeft: 5,
  },
  preferencesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 50,
  },
  prefCard: {
    backgroundColor: '#FFF',
    width: '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    minHeight: 120,
  },
  cardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  prefText: {
    marginTop: 8,
    fontWeight: '600',
    color: COLORS.primary,
  },
  miniColorDot: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  }
});