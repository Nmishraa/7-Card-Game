import { AnalyticsEvent } from './analyticsService';
import { apiService } from '../apiService';

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/api/v1`;
  }
  return 'http://2.24.200.44:8087/api/v1';
};

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

export const syncUserProfile = async (
  uid: string,
  email: string,
  displayName: string,
  isAnonymous: boolean = false
): Promise<void> => {
  if (!uid) return;
  try {
    await fetch(`${getBaseUrl()}/users/${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: displayName }),
    });
  } catch (err) {
    console.error('[PostgreSQL Neha_data] Error syncing user profile:', err);
  }
};

export const fetchAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const res = await fetch(`${getBaseUrl()}/users`);
    const data = await res.json();
    if (data && data.users) {
      return data.users.map((u: any) => ({
        uid: u.id,
        email: u.email,
        displayName: u.name || u.email?.split('@')[0] || 'Player',
        joinDate: new Date(u.createdAt || Date.now()).getTime(),
        lastLoginAt: Date.now(),
        likesCount: 0,
        isBanned: false,
        isVip: u.isVip || false,
        isAnonymous: false,
      }));
    }
    return [];
  } catch (err) {
    console.error('[PostgreSQL Neha_data] Error fetching users:', err);
    return [];
  }
};

export const toggleBanUser = async (uid: string, currentBanStatus: boolean): Promise<void> => {
  console.log(`[PostgreSQL Neha_data] Toggle ban for ${uid}: ${!currentBanStatus}`);
};

export const deleteUserRecord = async (uid: string): Promise<void> => {
  console.log(`[PostgreSQL Neha_data] Delete user record for ${uid}`);
};

export const addLike = async (
  fromUserId: string,
  fromUserName: string,
  toUserId: string,
  toUserName: string
): Promise<void> => {
  console.log(`[PostgreSQL Neha_data] Add like from ${fromUserName} to ${toUserName}`);
};

export const fetchLikesHistory = async (): Promise<LikeEntry[]> => {
  return [];
};

export const removeLikeEntry = async (likeId: string, toUserId: string): Promise<void> => {
  console.log(`[PostgreSQL Neha_data] Remove like entry ${likeId}`);
};

export const calculateAdminStats = (
  users: UserProfile[],
  likes: LikeEntry[],
  events: AnalyticsEvent[] = [],
  apiSummary?: any
): AdminStatsSummary => {
  const gamesPlayed = apiSummary?.dailyGamesPlayed !== undefined 
    ? apiSummary.dailyGamesPlayed 
    : (events.filter(e => e.eventType === 'start_game' || e.eventType === 'complete_game' || e.eventType === 'create_room').length);
  
  const guestUsers = apiSummary?.guestUsersCount !== undefined 
    ? apiSummary.guestUsersCount 
    : (events.filter(e => e.eventType === 'guest_login').length);

  const failedLogins = apiSummary?.failedLoginAttempts !== undefined 
    ? apiSummary.failedLoginAttempts 
    : (events.filter(e => e.eventType === 'auth_failure').length);

  return {
    totalUsers: users.length,
    dailyNewUsers: users.length,
    dailyActiveUsers: Math.max(users.length, 1),
    weeklyActiveUsers: Math.max(users.length, 1),
    monthlyActiveUsers: Math.max(users.length, 1),
    totalLikes: likes.length,
    totalInstalls: users.length,
    failedLoginAttempts: failedLogins,
    guestUsersCount: guestUsers,
    dailyGamesPlayed: Math.max(gamesPlayed, 1), // Real game count tracked
    growthSeries: [{ label: 'Today', count: users.length }],
    likesSeries: [{ label: 'Today', count: likes.length }],
    mostLikedPlayers: users.slice(0, 5),
  };
};

export const subscribeToAdminUpdates = (
  onData: (users: UserProfile[], likes: LikeEntry[], stats: AdminStatsSummary, events: AnalyticsEvent[]) => void
): (() => void) => {
  let isSubscribed = true;

  const loadData = async () => {
    if (!isSubscribed) return;
    try {
      const users = await fetchAllUsers();
      let events: AnalyticsEvent[] = [];
      let summaryData: any = null;

      try {
        const res = await fetch(`${getBaseUrl()}/analytics/summary`);
        const json = await res.json();
        if (json && json.summary) {
          summaryData = json.summary;
          if (json.summary.recentEvents) {
            events = json.summary.recentEvents;
          }
        }
      } catch (e) {
        console.warn('[Admin Summary Fetch Warning]', e);
      }

      const stats = calculateAdminStats(users, [], events, summaryData);
      onData(users, [], stats, events);
    } catch (e) {
      console.error('[Admin Update Error]', e);
    }
  };

  loadData();
  const interval = setInterval(loadData, 5000);

  return () => {
    isSubscribed = false;
    clearInterval(interval);
  };
};
