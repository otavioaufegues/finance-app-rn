import { initializeApp } from "firebase/app";

const getEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const firebaseConfig = {
  apiKey: getEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
