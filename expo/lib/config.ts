import Constants from "expo-constants";

export const config = {
  googleMaps: {
    apiKey: Constants.expoConfig?.extra?.googleMapsApiKey || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    iosApiKey: Constants.expoConfig?.extra?.googleMapsIosApiKey || process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY || "",
    androidApiKey: Constants.expoConfig?.extra?.googleMapsAndroidApiKey || process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY || "",
  },
  
  stripe: {
    publishableKey: Constants.expoConfig?.extra?.stripePublishableKey || process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  },
  
  firebase: {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  },
  
  admob: {
    iosAdUnitId: Constants.expoConfig?.extra?.admobIosAdUnitId || process.env.EXPO_PUBLIC_ADMOB_IOS_AD_UNIT_ID || "",
    androidAdUnitId: Constants.expoConfig?.extra?.admobAndroidAdUnitId || process.env.EXPO_PUBLIC_ADMOB_ANDROID_AD_UNIT_ID || "",
  },
  
  api: {
    baseUrl: Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8081",
  },
  
  app: {
    name: "Aura",
    version: Constants.expoConfig?.version || "1.0.0",
    environment: process.env.EXPO_PUBLIC_ENV || "development",
  },
} as const;

export function validateConfig() {
  const errors: string[] = [];
  
  if (!config.googleMaps.apiKey) {
    errors.push("⚠️  Google Maps API key not configured");
  }
  
  if (!config.stripe.publishableKey) {
    errors.push("⚠️  Stripe publishable key not configured");
  }
  
  if (!config.firebase.apiKey) {
    errors.push("⚠️  Firebase not configured (push notifications won't work)");
  }
  
  if (errors.length > 0 && config.app.environment === "production") {
    console.error("❌ Configuration errors:");
    errors.forEach(error => console.error(error));
    throw new Error("Missing required configuration for production");
  } else if (errors.length > 0) {
    console.warn("⚠️  Configuration warnings:");
    errors.forEach(error => console.warn(error));
  }
}

export default config;
