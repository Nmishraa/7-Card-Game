import { GameRoom } from '../engine/types';
import { GameHistoryEntry, PlayerHistoryEntry } from './types';
import { apiService } from '../apiService';

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/api/v1`;
  }
  return 'http://2.24.200.44:8087/api/v1';
};

export const saveCompletedGameToHistory = async (room: GameRoom): Promise<void> => {
  if (!room || room.status !== 'game-over') return;

  try {
    let winnerName = 'Unknown';
    if (room.winnerId && room.players[room.winnerId]) {
      winnerName = room.players[room.winnerId].name;
    }

    const playerList: PlayerHistoryEntry[] = Object.values(room.players)
      .map(p => ({
        id: p.id,
        name: p.name || 'Player',
        totalScore: p.totalScore || 0,
        isBot: p.isBot || false,
        roundScores: p.roundScores || [],
      })).sort((a, b) => a.totalScore - b.totalScore);

    const entry: GameHistoryEntry = {
      id: room.id || `game_${Date.now()}`,
      roomId: room.id || 'ROOM',
      date: Date.now(),
      maxRounds: room.maxRounds || 5,
      winnerId: room.winnerId,
      winnerName,
      players: playerList,
    };

    await fetch(`${getBaseUrl()}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '7card_live_key',
      },
      body: JSON.stringify({
        userId: room.winnerId || 'winner_player',
        userName: winnerName,
        eventType: 'complete_game',
        metadata: entry,
      }),
    });
  } catch (err) {
    console.error('[PostgreSQL Neha_data] Error saving game history:', err);
  }
};

export const fetchAllGameHistories = async (): Promise<GameHistoryEntry[]> => {
  try {
    const response = await apiService.listRooms();
    if (response && response.rooms) {
      return response.rooms.map((r: any) => ({
        id: r.id,
        roomId: r.id,
        date: new Date(r.createdAt || Date.now()).getTime(),
        maxRounds: r.maxPlayers || 5,
        winnerId: r.hostId,
        winnerName: 'Player ' + r.hostId,
        players: [],
      }));
    }
    return [];
  } catch (err) {
    console.error('[PostgreSQL Neha_data] Error fetching game histories:', err);
    return [];
  }
};
