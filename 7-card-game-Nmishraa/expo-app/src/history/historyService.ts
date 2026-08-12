import { ref, set, get, push } from 'firebase/database';
import { db } from '../firebase';
import { GameRoom } from '../engine/types';
import { GameHistoryEntry, PlayerHistoryEntry } from './types';

export const saveCompletedGameToHistory = async (room: GameRoom): Promise<void> => {
  if (!room || room.status !== 'game-over') return;

  try {
    const historyRef = push(ref(db, 'game_history'));
    const entryId = historyRef.key;
    if (!entryId) return;

    let winnerName = 'Unknown';
    if (room.winnerId && room.players[room.winnerId]) {
      winnerName = room.players[room.winnerId].name;
    }

    // Include ALL players (human and bot) for accurate player count and scores
    const playerList: PlayerHistoryEntry[] = Object.values(room.players)
      .map(p => ({
        id: p.id,
        name: p.name || 'Player',
        totalScore: p.totalScore || 0,
        isBot: p.isBot || false,
        roundScores: p.roundScores || [],
      })).sort((a, b) => a.totalScore - b.totalScore);

    const entry: GameHistoryEntry = {
      id: entryId,
      roomId: room.id || 'ROOM',
      date: Date.now(),
      maxRounds: room.maxRounds || 5,
      winnerId: room.winnerId,
      winnerName,
      players: playerList,
    };

    await set(historyRef, entry);
  } catch (err) {
    console.error('Error saving game history:', err);
  }
};

export const fetchAllGameHistories = async (): Promise<GameHistoryEntry[]> => {
  try {
    const historyRef = ref(db, 'game_history');
    const snapshot = await get(historyRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val() as Record<string, GameHistoryEntry>;
    return Object.values(data).sort((a, b) => b.date - a.date);
  } catch (err) {
    console.error('Error fetching game histories:', err);
    return [];
  }
};
