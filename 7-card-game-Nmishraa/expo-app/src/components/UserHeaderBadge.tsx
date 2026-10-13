import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { auth, logoutFirebase } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface UserHeaderBadgeUser {
  uid: string;
  email?: string;
  displayName: string;
  photoURL?: string;
  isAnonymous?: boolean;
}

interface Props {
  user?: UserHeaderBadgeUser | null;
  userName?: string;
  userEmail?: string;
  userPhoto?: string;
  onLogout?: () => void;
  onNavigate?: (route: string) => void;
}

export const UserHeaderBadge: React.FC<Props> = ({
  user: propUser,
  userName: propUserName,
  userEmail: propUserEmail,
  userPhoto: propUserPhoto,
  onLogout,
  onNavigate,
}) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  // Local state fallback in case props are not passed from parent
  const [currentUser, setCurrentUser] = useState<UserHeaderBadgeUser | null>(() => {
    if (propUser !== undefined) return propUser;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('7card_game_user');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  // Keep local user in sync if prop changes
  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser);
    }
  }, [propUser]);

  // Listen to Firebase Auth state if propUser is not explicitly supplied
  useEffect(() => {
    if (propUser !== undefined) return;
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const u: UserHeaderBadgeUser = {
          uid: fbUser.uid,
          email: fbUser.email || undefined,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Player',
          photoURL: fbUser.photoURL || undefined,
          isAnonymous: fbUser.isAnonymous,
        };
        setCurrentUser(u);
      } else {
        // check localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const saved = window.localStorage.getItem('7card_game_user');
            if (saved) {
              setCurrentUser(JSON.parse(saved));
              return;
            }
          } catch (e) {
            // ignore
          }
        }
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, [propUser]);

  const displayName = propUserName || currentUser?.displayName || 'Player';
  const displayEmail = propUserEmail || currentUser?.email;
  const photo = propUserPhoto || currentUser?.photoURL;
  const isLoggedIn = !!currentUser && (!currentUser.isAnonymous || !!currentUser.displayName);

  const handleSignOutPress = async () => {
    if (onLogout) {
      onLogout();
      return;
    }

    // Default logout flow
    try {
      await logoutFirebase();
    } catch (e) {
      console.warn('[UserHeaderBadge] logout error:', e);
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('7card_game_user');
    }
    setCurrentUser(null);

    if (onNavigate) {
      onNavigate('/');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <View style={styles.badgeContainer}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>{(displayName || 'U').charAt(0).toUpperCase()}</Text>
        </View>
      )}

      {width >= 560 && (
        <View style={styles.detailsContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {displayName}
          </Text>
          {isWide && displayEmail ? (
            <Text style={styles.emailText} numberOfLines={1}>
              {displayEmail}
            </Text>
          ) : null}
        </View>
      )}

      <TouchableOpacity
        style={[styles.actionBtn, isLoggedIn ? styles.logoutBtn : styles.loginBtn]}
        onPress={handleSignOutPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={isLoggedIn ? 'Sign Out' : 'Sign In'}
      >
        <Text style={styles.actionBtnText}>{isLoggedIn ? 'Sign Out' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 8,
    flexShrink: 0,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  avatarFallback: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  detailsContainer: {
    justifyContent: 'center',
    maxWidth: 110,
  },
  nameText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emailText: {
    color: '#94a3b8',
    fontSize: 10,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
  },
  loginBtn: {
    backgroundColor: '#0284c7',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
