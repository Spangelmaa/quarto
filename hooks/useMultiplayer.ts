import { useState, useEffect, useCallback } from 'react';
import { GameState } from '@/types/game';
import { PlayerInfo } from '@/types/multiplayer';

export const useMultiplayer = () => {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generiere eindeutige Player ID
  const getPlayerId = useCallback(() => {
    let playerId = localStorage.getItem('playerId');
    if (!playerId) {
      playerId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('playerId', playerId);
    }
    return playerId;
  }, []);

  // Erstelle einen neuen Raum
  const createRoom = useCallback(async () => {
    try {
      const playerId = getPlayerId();
      const response = await fetch('/api/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });

      if (!response.ok) throw new Error('Fehler beim Erstellen des Raums');

      const data = await response.json();
      const info: PlayerInfo = {
        roomId: data.roomId,
        playerId,
        playerNumber: data.playerNumber,
      };
      
      setPlayerInfo(info);
      setIsConnected(true);
      localStorage.setItem('playerInfo', JSON.stringify(info));
      
      return { roomId: data.roomId, gameState: data.gameState };
    } catch (err) {
      setError('Fehler beim Erstellen des Raums');
      return null;
    }
  }, [getPlayerId]);

  // Trete einem Raum bei
  const joinRoom = useCallback(async (roomId: string) => {
    try {
      const playerId = getPlayerId();
      const response = await fetch('/api/room/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, playerId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Beitreten');
      }

      const data = await response.json();
      const info: PlayerInfo = {
        roomId: data.roomId,
        playerId,
        playerNumber: data.playerNumber,
      };
      
      setPlayerInfo(info);
      setIsConnected(true);
      localStorage.setItem('playerInfo', JSON.stringify(info));
      
      return { gameState: data.gameState };
    } catch (err: any) {
      setError(err.message || 'Fehler beim Beitreten');
      return null;
    }
  }, [getPlayerId]);

  // Aktualisiere Spielzustand
  const updateGameState = useCallback(async (gameState: GameState) => {
    if (!playerInfo) return false;

    try {
      const response = await fetch('/api/room/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: playerInfo.roomId,
          playerId: playerInfo.playerId,
          gameState,
        }),
      });

      if (!response.ok) throw new Error('Fehler beim Aktualisieren');
      return true;
    } catch (err) {
      setError('Fehler beim Aktualisieren des Spielstands');
      return false;
    }
  }, [playerInfo]);

  // Hole Spielzustand
  const fetchGameState = useCallback(async (): Promise<{ gameState: GameState; players: any } | null> => {
    if (!playerInfo) {
      console.log('[FETCH] Kein playerInfo vorhanden, überspringe fetch');
      return null;
    }

    try {
      const response = await fetch(`/api/room/state?roomId=${playerInfo.roomId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[FETCH] Fehler beim Abrufen:', errorData);
        throw new Error(errorData.error || 'Fehler beim Abrufen');
      }
      
      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('[FETCH] Exception beim Abrufen:', err.message);
      // Setze Fehler nur wenn playerInfo noch existiert (sonst verlassen wir gerade die Lobby)
      if (playerInfo) {
        setError('Fehler beim Abrufen des Spielstands');
      }
      return null;
    }
  }, [playerInfo]);

  // Verlasse Raum
  const leaveRoom = useCallback(() => {
    console.log('[LEAVE] Verlasse Raum');
    setPlayerInfo(null);
    setIsConnected(false);
    setError(null); // Lösche auch Fehler beim Verlassen
    localStorage.removeItem('playerInfo');
  }, []);

  // Beim Laden: Prüfe ob Spieler in einem Raum ist
  useEffect(() => {
    const savedInfo = localStorage.getItem('playerInfo');
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo) as PlayerInfo;
        setPlayerInfo(info);
        setIsConnected(true);
      } catch (err) {
        localStorage.removeItem('playerInfo');
      }
    }
  }, []);

  return {
    playerInfo,
    isConnected,
    error,
    createRoom,
    joinRoom,
    updateGameState,
    fetchGameState,
    leaveRoom,
    setError,
  };
};

