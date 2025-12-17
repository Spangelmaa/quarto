import { GameState } from './game';

export type Room = {
  id: string;
  gameState: GameState;
  players: {
    player1: string | null;
    player2: string | null;
  };
  createdAt: number;
};

export type PlayerInfo = {
  roomId: string;
  playerId: string;
  playerNumber: 1 | 2;
};

