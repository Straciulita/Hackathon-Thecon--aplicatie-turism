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
        // Permisiuni pentru localizare (necesare hărții)
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        
        // Permisiuni pentru hărți online și funcționare stabilă
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        
        // Permisiuni de fundal (dacă ar fi folosite, dar le lăsăm pentru siguranță)
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
      ],
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
    
    // Asigură-te că aceste căi sunt CORECTE (assets/images/icon.png)
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