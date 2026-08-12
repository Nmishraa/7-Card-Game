import { ref, push, set, get } from 'firebase/database';
import { db } from '../firebase';

export type EventType = 'login' | 'guest_login' | 'auth_failure' | 'create_room' | 'join_room' | 'start_game' | 'play_turn' | 'call_least' | 'complete_game' | 'leave_room' | 'system_error';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  userName: string;
  eventType: EventType;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface CohortRetention {
  cohortDate: string; // YYYY-MM-DD
  totalUsers: number;
  d1Rate: number; // percentage (0-100)
  d3Rate: number;
  d7Rate: number;
}

export interface AnalyticsSummary {
  totalUniqueUsers: number;
  dailyActiveUsers: number;
  eventCounts: Record<EventType, number>;
  cohorts: CohortRetention[];
  recentEvents: AnalyticsEvent[];
}

const sanitizeMetadata = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(sanitizeMetadata);
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        res[key] = sanitizeMetadata(val);
      }
    }
    return res;
  }
  return obj;
};

export const trackUserEvent = async (
  userId: string,
  userName: string,
  eventType: EventType,
  metadata?: Record<string, any>
): Promise<void> => {
  const resolvedUserId = userId || 'anonymous_user';
  try {
    const eventRef = push(ref(db, 'user_events'));
    if (!eventRef.key) return;

    const sanitizedMetadata = metadata !== undefined ? sanitizeMetadata(metadata) : undefined;

    const event: AnalyticsEvent = {
      id: eventRef.key,
      userId: resolvedUserId,
      userName: userName || (resolvedUserId === 'anonymous_user' ? 'Guest Player' : 'Player'),
      eventType,
      timestamp: Date.now(),
      ...(sanitizedMetadata !== undefined && { metadata: sanitizedMetadata }),
    };

    await set(eventRef, event);
  } catch (err) {
    console.error('Error tracking analytics event:', err);
  }
};

export const fetchAllUserEvents = async (): Promise<AnalyticsSummary> => {
  const defaultSummary: AnalyticsSummary = {
    totalUniqueUsers: 0,
    dailyActiveUsers: 0,
    eventCounts: {
      login: 0, guest_login: 0, auth_failure: 0, create_room: 0, join_room: 0, start_game: 0,
      play_turn: 0, call_least: 0, complete_game: 0, leave_room: 0, system_error: 0,
    },
    cohorts: [],
    recentEvents: [],
  };

  try {
    const snapshot = await get(ref(db, 'user_events'));
    if (!snapshot.exists()) return defaultSummary;

    const data = snapshot.val() as Record<string, AnalyticsEvent>;
    const events = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);

    const uniqueUsers = new Set<string>();
    const dauUsers = new Set<string>();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();

    const eventCounts: Record<EventType, number> = {
      login: 0, guest_login: 0, auth_failure: 0, create_room: 0, join_room: 0, start_game: 0,
      play_turn: 0, call_least: 0, complete_game: 0, leave_room: 0, system_error: 0,
    };

    // For cohort retention analysis: map userId -> first seen timestamp
    const firstSeen: Record<string, number> = {};
    const userActiveDays: Record<string, Set<string>> = {};

    events.forEach(ev => {
      if (!ev?.userId) return;
      uniqueUsers.add(ev.userId);

      if (now - ev.timestamp <= oneDayMs) {
        dauUsers.add(ev.userId);
      }

      if (ev.eventType && eventCounts[ev.eventType] !== undefined) {
        eventCounts[ev.eventType]++;
      }

      if (!firstSeen[ev.userId] || ev.timestamp < firstSeen[ev.userId]) {
        firstSeen[ev.userId] = ev.timestamp;
      }

      const dayStr = new Date(ev.timestamp).toISOString().split('T')[0];
      if (!userActiveDays[ev.userId]) userActiveDays[ev.userId] = new Set();
      userActiveDays[ev.userId].add(dayStr);
    });

    // Group users by cohort (first seen date YYYY-MM-DD)
    const cohortMap: Record<string, string[]> = {};
    Object.entries(firstSeen).forEach(([uId, ts]) => {
      const cDate = new Date(ts).toISOString().split('T')[0];
      if (!cohortMap[cDate]) cohortMap[cDate] = [];
      cohortMap[cDate].push(uId);
    });

    const cohorts: CohortRetention[] = Object.entries(cohortMap).map(([cDate, uIds]) => {
      const cohortStartMs = new Date(cDate).getTime();
      let d1Count = 0;
      let d3Count = 0;
      let d7Count = 0;

      uIds.forEach(uId => {
        const activeDates = userActiveDays[uId] || new Set();
        const d1Date = new Date(cohortStartMs + oneDayMs).toISOString().split('T')[0];
        const d3Date = new Date(cohortStartMs + 3 * oneDayMs).toISOString().split('T')[0];
        const d7Date = new Date(cohortStartMs + 7 * oneDayMs).toISOString().split('T')[0];

        if (activeDates.has(d1Date)) d1Count++;
        if (activeDates.has(d3Date)) d3Count++;
        if (activeDates.has(d7Date)) d7Count++;
      });

      const total = uIds.length;
      return {
        cohortDate: cDate,
        totalUsers: total,
        d1Rate: Math.round((d1Count / total) * 100),
        d3Rate: Math.round((d3Count / total) * 100),
        d7Rate: Math.round((d7Count / total) * 100),
      };
    }).sort((a, b) => b.cohortDate.localeCompare(a.cohortDate));

    return {
      totalUniqueUsers: uniqueUsers.size,
      dailyActiveUsers: dauUsers.size,
      eventCounts,
      cohorts,
      recentEvents: events.slice(0, 50),
    };
  } catch (err) {
    console.error('Error fetching analytics summary:', err);
    return defaultSummary;
  }
};
