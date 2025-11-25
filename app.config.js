import 'dotenv/config'; // doar pentru EAS Build local

export default ({ config }) => ({
  expo: {
    name: "Thecon Coffee Vibe",
    slug: "your-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
    },

    android: {
      package: "com.thecon.galativibe",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "INTERNET",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_NETWORK_STATE",
      ],
      config: {
        googleMaps: {
          apiKey: "", // obligatoriu pentru Maps, chiar dacă lăsăm gol
        },
      },
    },

    // Extra fields accesibile la runtime în aplicație
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || "", // Expo va citi cheia aici
      eas: {
        projectId: "ad295f7c-9871-4d4c-b1e1-e9fbb4b9c417",
      },
    },
  },
});
