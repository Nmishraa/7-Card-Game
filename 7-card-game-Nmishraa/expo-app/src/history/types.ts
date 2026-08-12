export interface PlayerHistoryEntry {
  id: string;
  name: string;
  totalScore: number;
  isBot: boolean;
  roundScores?: number[];
}


export interface GameHistoryEntry {
  id: string; // Firebase push key
  roomId: string; // 4-character room code
  date: number; // Timestamp
  maxRounds: number; // Total rounds played
  winnerId?: string | null;
  winnerName: string; // Display name of winner
  players: PlayerHistoryEntry[];
}
