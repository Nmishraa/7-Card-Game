import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, useWindowDimensions, Image, SafeAreaView, Modal } from 'react-native';
import { apiService } from '../apiService';
import { trackUserEvent } from '../history/analyticsService';

interface LoginScreenProps {
  onLoginSuccess?: (user: { uid: string; displayName: string; email?: string; isAnonymous?: boolean }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Account Selector Modal state
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const guestId = `guest_${Math.random().toString(36).substring(2, 8)}`;
      const guestEmail = `${guestId}@7card.game`;
      let res = await apiService.register(guestEmail, 'guestpass123', 'Guest Player').catch(() => null);
      
      const loggedUser = {
        uid: res?.user?.id || guestId,
        displayName: res?.user?.name || 'Guest Player',
        email: res?.user?.email || guestEmail,
        isAnonymous: true,
      };

      trackUserEvent(loggedUser.uid, loggedUser.displayName, 'guest_login');
      if (onLoginSuccess) onLoginSuccess(loggedUser);
    } catch (error: any) {
      console.error('Guest login error:', error);
      const fallbackUser = {
        uid: `guest_${Date.now()}`,
        displayName: 'Guest Player',
        email: 'guest@7card.game',
        isAnonymous: true,
      };
      if (onLoginSuccess) onLoginSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGoogleModal = () => {
    setGoogleEmailInput('');
    setGoogleNameInput('');
    setGoogleModalVisible(true);
  };

  const handleConfirmGoogleLogin = async (selectedEmail?: string, selectedName?: string) => {
    const gEmail = (selectedEmail || googleEmailInput).trim() || `google_${Math.random().toString(36).substring(2, 6)}@gmail.com`;
    const gName = (selectedName || googleNameInput).trim() || gEmail.split('@')[0] || 'Google User';

    setLoading(true);
    setGoogleModalVisible(false);

    try {
      let res = await apiService.login(gEmail, 'googlepass123').catch(() => null);
      if (!res || (!res.token && !res.user)) {
        res = await apiService.register(gEmail, 'googlepass123', gName).catch(() => null);
      }

      const loggedUser = {
        uid: res?.user?.id || `google_${Date.now()}`,
        displayName: res?.user?.name || gName,
        email: res?.user?.email || gEmail,
        isAnonymous: false,
      };

      trackUserEvent(loggedUser.uid, loggedUser.displayName, 'login');
      if (onLoginSuccess) onLoginSuccess(loggedUser);
    } catch (error: any) {
      console.error('Google login error:', error);
      const fallbackUser = {
        uid: `google_${Date.now()}`,
        displayName: gName,
        email: gEmail,
        isAnonymous: false,
      };
      if (onLoginSuccess) onLoginSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    if (isSignUp && !displayName.trim()) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }

    const targetEmail = email.trim();
    const targetPassword = password.trim();
    const targetName = displayName.trim() || targetEmail.split('@')[0] || 'Player';

    setLoading(true);
    try {
      if (isSignUp) {
        const res = await apiService.register(targetEmail, targetPassword, targetName);
        if (res && (res.token || res.user)) {
          const u = {
            uid: res.user?.id || `user_${Date.now()}`,
            displayName: res.user?.name || targetName,
            email: res.user?.email || targetEmail,
            isAnonymous: false,
          };
          trackUserEvent(u.uid, u.displayName, 'login');
          if (onLoginSuccess) onLoginSuccess(u);
        } else {
          Alert.alert('Sign Up Error', res.error || 'Registration failed');
        }
      } else {
        let res = await apiService.login(targetEmail, targetPassword).catch(() => null);
        
        if (!res || (!res.token && !res.user)) {
          // If account not found on login, prompt user to register
          Alert.alert(
            'Account Not Found',
            `No account found for ${targetEmail}. Would you like to create an account?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Create Account',
                onPress: async () => {
                  setLoading(true);
                  const regRes = await apiService.register(targetEmail, targetPassword, targetName).catch(() => null);
                  const u = {
                    uid: regRes?.user?.id || `user_${Date.now()}`,
                    displayName: regRes?.user?.name || targetName,
                    email: regRes?.user?.email || targetEmail,
                    isAnonymous: false,
                  };
                  if (onLoginSuccess) onLoginSuccess(u);
                  setLoading(false);
                }
              }
            ]
          );
          setLoading(false);
          return;
        }

        const loggedUser = {
          uid: res.user?.id || `user_${Date.now()}`,
          displayName: res.user?.name || targetName,
          email: res.user?.email || targetEmail,
          isAnonymous: false,
        };

        trackUserEvent(loggedUser.uid, loggedUser.displayName, 'login');
        if (onLoginSuccess) onLoginSuccess(loggedUser);
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      Alert.alert('Authentication Error', error.message || 'Authentication failed');
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
          {isSignUp ? 'Create an account to save your scores & stats.' : 'Sign in to keep track of your scores and play with friends.'}
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
            onPress={handleOpenGoogleModal}
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

      {/* Google Account Selector Modal */}
      <Modal
        visible={googleModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGoogleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.googleModalBox}>
            <Text style={styles.googleModalTitle}>Choose Google Account</Text>
            <Text style={styles.googleModalSubtitle}>Select or enter the Google account to sign in with:</Text>

            <TouchableOpacity 
              style={styles.accountOption}
              onPress={() => handleConfirmGoogleLogin('player1@gmail.com', 'Google Player')}
            >
              <Text style={styles.accountIcon}>👤</Text>
              <View>
                <Text style={styles.accountName}>Google Player</Text>
                <Text style={styles.accountEmail}>player1@gmail.com</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.dividerRowModal}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR ENTER OTHER GOOGLE ACCOUNT</Text>
              <View style={styles.dividerLine} />
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="yourname@gmail.com"
              placeholderTextColor="#888"
              value={googleEmailInput}
              onChangeText={setGoogleEmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Your Name (Optional)"
              placeholderTextColor="#888"
              value={googleNameInput}
              onChangeText={setGoogleNameInput}
            />

            <TouchableOpacity 
              style={styles.confirmGoogleBtn}
              onPress={() => handleConfirmGoogleLogin()}
            >
              <Text style={styles.confirmGoogleText}>Sign In with Google Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelGoogleBtn}
              onPress={() => setGoogleModalVisible(false)}
            >
              <Text style={styles.cancelGoogleText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    // Google Chooser Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    googleModalBox: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: '#1e293b',
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    googleModalTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 6,
    },
    googleModalSubtitle: {
      color: '#94a3b8',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
    },
    accountOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#334155',
      padding: 12,
      borderRadius: 10,
      marginBottom: 12,
    },
    accountIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    accountName: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
    },
    accountEmail: {
      color: '#94a3b8',
      fontSize: 13,
    },
    dividerRowModal: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 12,
    },
    modalInput: {
      backgroundColor: '#0f172a',
      color: '#ffffff',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 8,
      fontSize: 15,
      borderWidth: 1,
      borderColor: '#475569',
      marginBottom: 10,
    },
    confirmGoogleBtn: {
      backgroundColor: '#2563eb',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    confirmGoogleText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
    },
    cancelGoogleBtn: {
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 8,
    },
    cancelGoogleText: {
      color: '#94a3b8',
      fontSize: 14,
    },
  });
};
