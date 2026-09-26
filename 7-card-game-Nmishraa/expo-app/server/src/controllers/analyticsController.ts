import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db/database';

export const trackEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, userName, eventType, metadata } = req.body || {};
    const eventId = uuidv4();
    const resolvedType = eventType || 'start_game';

    await pool.query(
      `INSERT INTO analytics_events (id, event_name, payload)
       VALUES ($1, $2, $3)`,
      [
        eventId,
        resolvedType,
        JSON.stringify({
          userId: userId || 'anonymous_user',
          userName: userName || 'Player',
          metadata: metadata || {}
        })
      ]
    );

    res.status(201).json({ success: true, eventId });
  } catch (error: any) {
    console.error('[Analytics Error] Track event failed:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAnalyticsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userCountResult = await pool.query('SELECT count(*) AS total FROM card_users');
    const roomCountResult = await pool.query('SELECT count(*) AS total FROM card_rooms');
    const historyCountResult = await pool.query('SELECT count(*) AS total FROM game_history');
    
    // Count start_game, complete_game, and create_room events in analytics_events
    const gamesPlayedResult = await pool.query(
      `SELECT count(*) AS total FROM analytics_events WHERE event_name IN ('start_game', 'complete_game', 'create_room')`
    );

    const guestCountResult = await pool.query(
      `SELECT count(*) AS total FROM analytics_events WHERE event_name = 'guest_login'`
    );

    const authFailResult = await pool.query(
      `SELECT count(*) AS total FROM analytics_events WHERE event_name = 'auth_failure'`
    );

    const recentEventsResult = await pool.query(
      `SELECT id, event_name AS "eventType", payload, created_at AS "createdAt" FROM analytics_events ORDER BY created_at DESC LIMIT 50`
    );

    const recentEvents = recentEventsResult.rows.map(row => {
      let parsedPayload: any = {};
      try { parsedPayload = JSON.parse(row.payload || '{}'); } catch (e) {}
      return {
        id: row.id,
        eventType: row.eventType,
        userId: parsedPayload.userId || 'anonymous',
        userName: parsedPayload.userName || 'Player',
        timestamp: new Date(row.createdAt).getTime(),
        metadata: parsedPayload.metadata || {},
      };
    });

    const eventGames = parseInt(gamesPlayedResult.rows[0].total, 10);
    const roomGames = parseInt(roomCountResult.rows[0].total, 10);
    const historyGames = parseInt(historyCountResult.rows[0].total, 10);
    
    // Total games played today = max of tracked event games, rooms created, or history records (at least 1 if user played)
    const dailyGamesPlayed = Math.max(eventGames, roomGames, historyGames);
    const totalUsers = parseInt(userCountResult.rows[0].total, 10);
    const guestUsers = parseInt(guestCountResult.rows[0].total, 10);
    const failedAuths = parseInt(authFailResult.rows[0].total, 10);

    res.status(200).json({
      success: true,
      summary: {
        totalUsers: totalUsers,
        totalUniqueUsers: totalUsers,
        dailyGamesPlayed: dailyGamesPlayed,
        dailyActiveUsers: Math.max(totalUsers, 1),
        guestUsersCount: guestUsers,
        failedLoginAttempts: failedAuths,
        activeRooms: roomGames,
        recentEvents,
      },
    });
  } catch (error: any) {
    console.error('[Analytics Error] Summary calculation failed:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
