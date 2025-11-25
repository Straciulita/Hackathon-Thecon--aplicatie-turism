export default ({ config }) => ({
  expo: {
    // Detalii Expo
    name: "Thecon Coffee Vibe", 
    slug: "your-app", 

    // Câmpul 'android' este OBLIGATORIU pentru EAS Build
    android: {
      package: "com.thecon.galativibe", 
      // ✅ PERMISIUNI COMPLETE PENTRU HARTĂ/LOCALIZARE/REȚEA
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "INTERNET",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_NETWORK_STATE", // Adăugat pentru Tiles
      ],
      // ✅ FIX CRASH NATIV: Adăugăm Google Maps Config
      config: {
          googleMaps: {
              // Lăsăm gol, dar prezența structurii forțează includerea dependințelor native esențiale.
              apiKey: "" 
          }
      }
    },

    // Câmpul 'extra' pentru EAS
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY, 
      eas: {
        projectId: "ad295f7c-9871-4d4c-b1e1-e9fbb4b9c417"
      }
    },
    
    // Configurații vizuale
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png", 
    splash: {
      image: "./assets/images/splash-icon.png", 
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    userInterfaceStyle: "automatic",
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    }
  }
});