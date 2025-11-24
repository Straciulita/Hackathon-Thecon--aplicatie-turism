import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';

interface Location {
  name: string;
  address: string;
  coordinates: { lat: number; long: number };
  image_url: string;
  short_description: string;
  rating: number;
  id: string;
}

interface LocationContextType {
  locations: Location[];
  filteredLocations: Location[];
  loading: boolean;
  searchText: string;
  setSearchText: (text: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const localData = require('../../assets/data/locations.json');
        const processed = localData.map((item: any, index: number) => ({
          ...item,
          id: index.toString(),
        }));
        setLocations(processed);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, []);

  // LOGICĂ: Dacă nu scrii nimic, returnăm TOATE locațiile (locations).
  // Astfel pinii nu dispar când ștergi textul.
  const filteredLocations = useMemo(() => {
    if (!searchText) return locations; 
    
    const lower = searchText.toLowerCase();
    return locations.filter(loc => 
      loc.name.toLowerCase().includes(lower) || 
      loc.address.toLowerCase().includes(lower)
    );
  }, [locations, searchText]);

  return (
    <LocationContext.Provider value={{ locations, filteredLocations, loading, searchText, setSearchText }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocations must be used within LocationProvider');
  return context;
};