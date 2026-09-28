import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Real Firebase Project credentials configured from user's account
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAmUOZ8VZhJgnGpAVi13Dx8BhGLXgI4or0",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "family-night-game.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "family-night-game",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "family-night-game.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "886116021127",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:886116021127:web:89dc7f1f75652fb00b9922"
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Executes Google Sign In via Firebase Authentication.
 * Returns normalized user data: { uid, email, displayName, photoURL }
 */
export const signInWithGoogleFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Google User',
        photoURL: user.photoURL || undefined,
      }
    };
  } catch (error: any) {
    console.warn('[Firebase Auth] signInWithPopup error:', error);
    return {
      success: false,
      error: error.message || 'Google Sign-in failed'
    };
  }
};
