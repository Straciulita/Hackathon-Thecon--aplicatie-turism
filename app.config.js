export default ({ config }) => ({
  expo: {
    // Detalii Expo
    name: "Thecon Coffee Vibe", 
    slug: "your-app", 

    // Câmpul 'android' este OBLIGATORIU pentru EAS Build
    android: {
      package: "com.thecon.galativibe", 
    },

    // Câmpul 'extra' pentru EAS
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY, 
      eas: {
        projectId: "ad295f7c-9871-4d4c-b1e1-e9fbb4b9c417"
      }
    },
    
    // Adăugăm minimul necesar de configurație
    version: "1.0.0",
    orientation: "portrait",
    
    // ✅ FIX: Calea corectă este acum ./assets/images/icon.png
    icon: "./assets/images/icon.png", 
    
    splash: {
      // ✅ FIX: Calea corectă este acum ./assets/images/splash-icon.png (presupunând că doriți splash-icon.png)
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