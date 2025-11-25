import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLocations } from '../contexts/LocationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SearchBarProps {
    isMapMode: boolean;
}

export default function SearchBar({ isMapMode }: SearchBarProps) {
    const { isDark, COLORS } = useTheme();
    const { searchText, setSearchText } = useLocations();
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.searchContainer, 
            { 
                backgroundColor: COLORS.card,
                borderBottomColor: COLORS.border,
                // Aplicăm un padding vertical mai generos (18)
                paddingTop: isMapMode ? insets.top + 18 : 18, 
                paddingBottom: 18,
            }
        ]}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
                style={[
                    styles.searchInput, 
                    { 
                        color: COLORS.textPrimary, 
                        backgroundColor: isDark ? COLORS.background : '#F0F0F0',
                    }
                ]}
                placeholder={isMapMode ? "Caută pe hartă..." : "Caută locații..."}
                placeholderTextColor={COLORS.textSecondary}
                value={searchText}
                onChangeText={setSearchText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});