import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GameState } from '@/types/game';
import { PlayerInfo } from '@/types/multiplayer';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface GameStore {
  // Game State
  gameState: GameState | null;
  playerInfo: PlayerInfo | null;
  
  // Connection State
  connectionStatus: ConnectionStatus;
  waitingForPlayer: boolean;
  error: string | null;
  
  // UI State
  isCreatingRoom: boolean;
  showWinnerModal: boolean;
  
  // Actions
  setGameState: (state: GameState | null) => void;
  setPlayerInfo: (info: PlayerInfo | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setWaitingForPlayer: (waiting: boolean) => void;
  setError: (error: string | null) => void;
  setIsCreatingRoom: (creating: boolean) => void;
  setShowWinnerModal: (show: boolean) => void;
  
  // Reset
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        gameState: null,
        playerInfo: null,
        connectionStatus: 'disconnected',
        waitingForPlayer: false,
        error: null,
        isCreatingRoom: false,
        showWinnerModal: false,
        
        // Actions
        setGameState: (state) => set({ gameState: state }, false, 'setGameState'),
        setPlayerInfo: (info) => set({ playerInfo: info }, false, 'setPlayerInfo'),
        setConnectionStatus: (status) => set({ connectionStatus: status }, false, 'setConnectionStatus'),
        setWaitingForPlayer: (waiting) => set({ waitingForPlayer: waiting }, false, 'setWaitingForPlayer'),
        setError: (error) => set({ error }, false, 'setError'),
        setIsCreatingRoom: (creating) => set({ isCreatingRoom: creating }, false, 'setIsCreatingRoom'),
        setShowWinnerModal: (show) => set({ showWinnerModal: show }, false, 'setShowWinnerModal'),
        
        resetGame: () => set({
          gameState: null,
          playerInfo: null,
          connectionStatus: 'disconnected',
          waitingForPlayer: false,
          error: null,
          isCreatingRoom: false,
          showWinnerModal: false,
        }, false, 'resetGame'),
      }),
      {
        name: 'quarto-game-storage',
        // Nur bestimmte Felder persistieren
        partialize: (state) => ({
          playerInfo: state.playerInfo,
        }),
      }
    ),
    {
      name: 'QuartoGame',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Selektoren für optimierte Performance
export const useGameState = () => useGameStore((state) => state.gameState);
export const usePlayerInfo = () => useGameStore((state) => state.playerInfo);
export const useConnectionStatus = () => useGameStore((state) => state.connectionStatus);
export const useWaitingForPlayer = () => useGameStore((state) => state.waitingForPlayer);
export const useGameError = () => useGameStore((state) => state.error);
export const useIsCreatingRoom = () => useGameStore((state) => state.isCreatingRoom);
