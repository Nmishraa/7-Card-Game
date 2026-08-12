import { ref, get, set, update, remove, push, onValue, off } from 'firebase/database';
import { db } from '../firebase';
import { AnalyticsEvent } from './analyticsService';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  joinDate: number;
  lastLoginAt: number;
  likesCount: number;
  isBanned: boolean;
  isVip?: boolean;
  isAnonymous?: boolean;
}

export interface LikeEntry {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  timestamp: number;
}

export interface AdminStatsSummary {
  totalUsers: number;
  dailyNewUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  totalLikes: number;
  totalInstalls: number;
  failedLoginAttempts: number;
  guestUsersCount: number;
  dailyGamesPlayed: number;
  growthSeries: { label: string; count: number }[];
  likesSeries: { label: string; count: number }[];
  mostLikedPlayers: UserProfile[];
}

// ── User Management & Profile Sync ──

export const syncUserProfile = async (
  uid: string,
  email: string,
  displayName: string,
  isAnonymous: boolean = false
): Promise<void> => {
  if (!uid) return;
  const userRef = ref(db, `users/${uid}`);
  try {
    const snap = await get(userRef);
    const now = Date.now();
    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid,
        email: email || (isAnonymous ? 'guest@7card.game' : 'anonymous@7card.game'),
        displayName: displayName || (isAnonymous ? 'Guest Player' : email?.split('@')[0] || 'Player'),
        joinDate: now,
        lastLoginAt: now,
        likesCount: 0,
        isBanned: false,
        isVip: false,
        isAnonymous,
      };
      await set(userRef, newProfile);
    } else {
      await update(userRef, {
        lastLoginAt: now,
        email: email || snap.val().email,
        displayName: displayName || snap.val().displayName,
        isAnonymous: isAnonymous ?? snap.val().isAnonymous,
      });
    }
  } catch (err) {
    console.error('Error syncing user profile:', err);
  }
};

export const fetchAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const snap = await get(ref(db, 'users'));
    if (!snap.exists()) return [];
    const data = snap.val() as Record<string, UserProfile>;
    return Object.values(data).sort((a, b) => b.lastLoginAt - a.lastLoginAt);
  } catch (err) {
    console.error('Error fetching all users:', err);
    return [];
  }
};

export const toggleBanUser = async (uid: string, currentBanStatus: boolean): Promise<void> => {
  try {
    await update(ref(db, `users/${uid}`), { isBanned: !currentBanStatus });
  } catch (err) {
    console.error('Error toggling ban status:', err);
  }
};

export const deleteUserRecord = async (uid: string): Promise<void> => {
  try {
    await remove(ref(db, `users/${uid}`));
  } catch (err) {
    console.error('Error deleting user record:', err);
  }
};

// ── Likes Management ──

export const addLike = async (
  fromUserId: string,
  fromUserName: string,
  toUserId: string,
  toUserName: string
): Promise<void> => {
  if (!fromUserId || !toUserId || fromUserId === toUserId) return;
  try {
    const likeRef = push(ref(db, 'likes_history'));
    if (!likeRef.key) return;

    const entry: LikeEntry = {
      id: likeRef.key,
      fromUserId,
      fromUserName: fromUserName || 'Player',
      toUserId,
      toUserName: toUserName || 'Player',
      timestamp: Date.now(),
    };

    await set(likeRef, entry);

    // Increment recipient like count
    const recipientRef = ref(db, `users/${toUserId}`);
    const rSnap = await get(recipientRef);
    if (rSnap.exists()) {
      const currentCount = rSnap.val().likesCount || 0;
      await update(recipientRef, { likesCount: currentCount + 1 });
    }
  } catch (err) {
    console.error('Error adding like:', err);
  }
};

export const fetchLikesHistory = async (): Promise<LikeEntry[]> => {
  try {
    const snap = await get(ref(db, 'likes_history'));
    if (!snap.exists()) return [];
    const data = snap.val() as Record<string, LikeEntry>;
    return Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error('Error fetching likes history:', err);
    return [];
  }
};

export const removeLikeEntry = async (likeId: string, toUserId: string): Promise<void> => {
  try {
    await remove(ref(db, `likes_history/${likeId}`));
    // Decrement count
    const recipientRef = ref(db, `users/${toUserId}`);
    const rSnap = await get(recipientRef);
    if (rSnap.exists()) {
      const currentCount = Math.max(0, (rSnap.val().likesCount || 0) - 1);
      await update(recipientRef, { likesCount: currentCount });
    }
  } catch (err) {
    console.error('Error removing like entry:', err);
  }
};

// ── Aggregated Stats & Realtime Subscriptions ──

export const calculateAdminStats = (
  users: UserProfile[],
  likes: LikeEntry[],
  events: AnalyticsEvent[] = []
): AdminStatsSummary => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;
  const monthMs = 30 * dayMs;

  let dailyNewUsers = 0;
  let dau = 0;
  let wau = 0;
  let mau = 0;
  let totalLikes = 0;
  let guestUsersCount = 0;

  users.forEach((u) => {
    if (now - u.joinDate <= dayMs) dailyNewUsers++;
    if (now - u.lastLoginAt <= dayMs) dau++;
    if (now - u.lastLoginAt <= weekMs) wau++;
    if (now - u.lastLoginAt <= monthMs) mau++;
    if (u.isAnonymous) guestUsersCount++;
    totalLikes += u.likesCount || 0;
  });

  let failedLoginAttempts = 0;
  let dailyGamesPlayed = 0;

  events.forEach((ev) => {
    if (ev.eventType === 'auth_failure') {
      failedLoginAttempts++;
    }
    if ((ev.eventType === 'start_game' || ev.eventType === 'complete_game') && now - ev.timestamp <= dayMs) {
      dailyGamesPlayed++;
    }
  });

  // Most Liked Players
  const mostLikedPlayers = [...users].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)).slice(0, 5);

  // Growth & Like Series (last 7 days mock/real trend)
  const growthSeries: { label: string; count: number }[] = [];
  const likesSeries: { label: string; count: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * dayMs);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const endOfDay = startOfDay + dayMs;

    const uCount = users.filter((u) => u.joinDate >= startOfDay && u.joinDate < endOfDay).length;
    const lCount = likes.filter((l) => l.timestamp >= startOfDay && l.timestamp < endOfDay).length;

    growthSeries.push({ label, count: uCount });
    likesSeries.push({ label, count: lCount });
  }

  const totalInstalls = users.length;

  return {
    totalUsers: users.length,
    dailyNewUsers,
    dailyActiveUsers: dau,
    weeklyActiveUsers: wau,
    monthlyActiveUsers: mau,
    totalLikes,
    totalInstalls,
    failedLoginAttempts,
    guestUsersCount,
    dailyGamesPlayed,
    growthSeries,
    likesSeries,
    mostLikedPlayers,
  };
};

export const subscribeToAdminUpdates = (
  onData: (users: UserProfile[], likes: LikeEntry[], stats: AdminStatsSummary, events: AnalyticsEvent[]) => void
): (() => void) => {
  const usersRef = ref(db, 'users');
  const likesRef = ref(db, 'likes_history');
  const eventsRef = ref(db, 'user_events');

  let cachedUsers: UserProfile[] = [];
  let cachedLikes: LikeEntry[] = [];
  let cachedEvents: AnalyticsEvent[] = [];

  const updateCallback = () => {
    const stats = calculateAdminStats(cachedUsers, cachedLikes, cachedEvents);
    onData(cachedUsers, cachedLikes, stats, cachedEvents);
  };

  const onU = onValue(usersRef, (snap) => {
    if (snap.exists()) {
      cachedUsers = Object.values(snap.val() as Record<string, UserProfile>).sort((a, b) => b.lastLoginAt - a.lastLoginAt);
    } else {
      cachedUsers = [];
    }
    updateCallback();
  });

  const onL = onValue(likesRef, (snap) => {
    if (snap.exists()) {
      cachedLikes = Object.values(snap.val() as Record<string, LikeEntry>).sort((a, b) => b.timestamp - a.timestamp);
    } else {
      cachedLikes = [];
    }
    updateCallback();
  });

  const onE = onValue(eventsRef, (snap) => {
    if (snap.exists()) {
      cachedEvents = Object.values(snap.val() as Record<string, AnalyticsEvent>).sort((a, b) => b.timestamp - a.timestamp);
    } else {
      cachedEvents = [];
    }
    updateCallback();
  });

  return () => {
    off(usersRef);
    off(likesRef);
    off(eventsRef);
  };
};
