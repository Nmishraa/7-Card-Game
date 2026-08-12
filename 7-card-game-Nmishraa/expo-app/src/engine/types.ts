export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string; // Unique identifier for React keys (e.g. 'Hearts-A')
  suit: Suit;
  rank: Rank;
  value: number; // point value
}

export interface Player {
  id: string; // socket/firebase id
  name: string;
  hand: Card[];
  roundScore: number;
  totalScore: number;
  hasCalledLeast: boolean;
  isBot?: boolean;
  isOut?: boolean;
  roundScores?: number[];
}


export type GameStatus = 'lobby' | 'playing' | 'round-end' | 'game-over';
export type TurnPhase = 'discarding' | 'picking';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface GameRoom {
  id: string;
  hostId: string;
  status: GameStatus;
  deck: Card[];
  discardPile: Card[];
  players: Record<string, Player>;
  turnIndex: number; // index of the player in turnOrder array
  turnOrder: string[]; // array of player IDs to maintain order
  turnPhase: TurnPhase;
  lastDiscardedCount: number; // number of cards dropped in last action
  currentRound: number;
  maxRounds: number;
  winnerId?: string | null;
  roundWinnerId?: string | null;
  jokerCard?: Card | null;
  pendingDiscard?: Card[];
  messages?: ChatMessage[];
  historySaved?: boolean;
}
