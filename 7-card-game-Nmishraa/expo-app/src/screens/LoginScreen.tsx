import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, useWindowDimensions, Image, SafeAreaView } from 'react-native';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../firebase';
import { trackUserEvent } from '../history/analyticsService';
import { syncUserProfile } from '../history/adminService';

export const LoginScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasAttemptedRef = useRef(false);

  React.useEffect(() => {
    // Component mounted; wait for user interaction to sign in.
  }, []);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Guest Login Error', error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, provider);
      await syncUserProfile(cred.user.uid, cred.user.email || '', cred.user.displayName || 'Google Player', false);
    } catch (error: any) {
      console.error("Google auth error:", error);
      trackUserEvent('guest_fallback', 'Guest', 'auth_failure', { error: error?.message || 'Google auth failed', code: error?.code });
      Alert.alert(
        'Google Sign-In Notice',
        `Google authentication could not complete (${error?.message || 'popup closed or third-party cookies restricted'}). Would you like to play as a Guest instead?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Play as Guest', onPress: () => handleGuestLogin() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (isSignUp && !displayName) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        await syncUserProfile(userCredential.user.uid, email, displayName, false);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(userCredential.user.uid, userCredential.user.email || email, userCredential.user.displayName || displayName || email.split('@')[0], false);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => (
    <View style={styles.contentWrapper}>
      <View style={styles.brandContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logoLarge}
          resizeMode="contain"
        />
        <Text style={styles.welcomeTagline}>The Ultimate 7-cards Experience</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.instructions}>
          Sign in to keep track of your scores and play with friends.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {isSignUp && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="#888"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleEmailAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.googleButton, loading && styles.buttonDisabled]} 
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.guestButton, loading && styles.buttonDisabled]} 
            onPress={handleGuestLogin}
            disabled={loading}
          >
            <Text style={styles.guestButtonText}>Play as Guest</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollOverlay} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {renderContent()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (width: number, height: number) => {
  const isSmall = width < 400;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0b5e28',
    },
    scrollOverlay: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    contentWrapper: {
      width: '100%',
      maxWidth: 450,
      alignItems: 'center',
    },
    brandContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logoLarge: {
      width: isSmall ? 180 : 220,
      height: isSmall ? 80 : 100,
      marginBottom: 5,
    },
    welcomeTagline: {
      color: '#cbd5e1',
      fontSize: isSmall ? 14 : 16,
      fontStyle: 'italic',
      fontWeight: '300',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    contentBox: {
      width: '100%',
      backgroundColor: 'rgba(30, 41, 59, 0.85)',
      padding: isSmall ? 20 : 30,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
    },
    instructions: {
      fontSize: isSmall ? 14 : 16,
      color: '#94a3b8',
      textAlign: 'center',
      marginBottom: 20,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#cbd5e1',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#334155',
      color: '#ffffff',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 8,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#475569',
    },
    button: {
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    },
    primaryButton: {
      backgroundColor: '#0275d8',
    },
    googleButton: {
      backgroundColor: '#2563eb',
    },
    googleButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 18,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#334155',
    },
    dividerText: {
      marginHorizontal: 12,
      color: '#94a3b8',
      fontSize: 12,
      fontWeight: 'bold',
    },
    switchButton: {
      marginTop: 20,
      alignItems: 'center',
      paddingVertical: 8,
    },
    switchButtonText: {
      color: '#38bdf8',
      fontSize: isSmall ? 13 : 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    guestButton: {
      backgroundColor: '#475569',
    },
    guestButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
};
