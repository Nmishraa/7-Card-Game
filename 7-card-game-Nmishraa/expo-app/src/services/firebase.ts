import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';

// Firebase Project credentials (can be overridden via EXPO_PUBLIC_FIREBASE_* env vars)
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
    console.log('[Firebase Auth] Triggering signInWithPopup for domain:', auth.config.authDomain);
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('[Firebase Auth] signInWithPopup Success for user:', user.email);
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
    console.error('[Firebase Auth Error Details]', {
      code: error?.code,
      message: error?.message,
      customData: error?.customData
    });

    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      return {
        success: false,
        errorCode: error?.code,
        error: 'Google Sign-In popup was closed before completing.'
      };
    }

    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/operation-not-supported-in-this-environment') {
      console.log('[Firebase Auth] Popup blocked or unsupported, falling back to signInWithRedirect...');
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: false, pendingRedirect: true };
      } catch (redirectError: any) {
        console.error('[Firebase Auth Redirect Error]', redirectError);
        return {
          success: false,
          errorCode: redirectError?.code,
          error: redirectError?.message || 'Google Sign-In redirect failed.'
        };
      }
    }

    return {
      success: false,
      errorCode: error?.code,
      error: error?.message || 'Google Sign-In failed.'
    };
  }
};

export const logoutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('[Firebase Auth] signOut error:', err);
  }
};
