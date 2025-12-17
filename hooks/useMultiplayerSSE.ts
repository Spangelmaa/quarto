import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '@/types/game';
import { PlayerInfo } from '@/types/multiplayer';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const useMultiplayerSSE = () => {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const pendingStateRef = useRef<GameState | null>(null);
  const updateInProgressRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);

  // Generiere eindeutige Player ID
  const getPlayerId = useCallback(() => {
    let playerId = localStorage.getItem('playerId');
    if (!playerId) {
      playerId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('playerId', playerId);
    }
    return playerId;
  }, []);

  // SSE Verbindung herstellen
  const connectSSE = useCallback((roomId: string) => {
    // Schließe bestehende Verbindung
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    console.log('[SSE] 🔌 Verbinde zu Raum:', roomId);
    setConnectionStatus('connecting');

    const eventSource = new EventSource(`/api/room/subscribe?roomId=${roomId}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[SSE] ✅ Verbunden');
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'state') {
          console.log('[SSE] 📥 Update erhalten:', {
            currentPlayer: data.gameState.currentPlayer,
            phase: data.gameState.gamePhase,
          });
          
          setGameState(data.gameState);
          
          // Prüfe ob Spieler 2 beigetreten ist
          if (data.players.player2) {
            setWaitingForPlayer(false);
          }
          
          // Lösche pending state wenn erfolgreich synchronisiert
          pendingStateRef.current = null;
        }
      } catch (e) {
        console.error('[SSE] Fehler beim Parsen:', e);
      }
    };

    eventSource.onerror = (e) => {
      console.error('[SSE] ❌ Verbindungsfehler:', e);
      setConnectionStatus('error');
      eventSource.close();
      
      // Automatischer Reconnect mit exponential backoff
      const maxAttempts = 5;
      if (reconnectAttemptsRef.current < maxAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
        console.log(`[SSE] 🔄 Reconnect in ${delay}ms (Versuch ${reconnectAttemptsRef.current + 1}/${maxAttempts})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connectSSE(roomId);
        }, delay);
      } else {
        setError('Verbindung verloren. Bitte neu laden.');
      }
    };
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
      setGameState(data.gameState);
      setWaitingForPlayer(true);
      localStorage.setItem('playerInfo', JSON.stringify(info));
      
      // SSE Verbindung starten
      connectSSE(data.roomId);
      
      return { roomId: data.roomId, gameState: data.gameState };
    } catch (err) {
      setError('Fehler beim Erstellen des Raums');
      return null;
    }
  }, [getPlayerId, connectSSE]);

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
      setGameState(data.gameState);
      setWaitingForPlayer(false);
      localStorage.setItem('playerInfo', JSON.stringify(info));
      
      // SSE Verbindung starten
      connectSSE(data.roomId);
      
      return { gameState: data.gameState };
    } catch (err: any) {
      setError(err.message || 'Fehler beim Beitreten');
      return null;
    }
  }, [getPlayerId, connectSSE]);

  // Aktualisiere Spielzustand (optimistisch + Request-Deduplizierung)
  const updateGameState = useCallback(async (newState: GameState) => {
    if (!playerInfo) return false;

    // Verhindere doppelte Requests
    if (updateInProgressRef.current) {
      console.log('[UPDATE] ⏭️ Update bereits in Bearbeitung, überspringe');
      return false;
    }

    // Debouncing: Mindestens 100ms zwischen Updates
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
    if (timeSinceLastUpdate < 100) {
      console.log('[UPDATE] ⏭️ Zu früh für Update, warte');
      return false;
    }

    updateInProgressRef.current = true;
    lastUpdateTimeRef.current = now;

    // Optimistisches Update: Sofort UI aktualisieren
    const previousState = gameState;
    setGameState(newState);
    pendingStateRef.current = newState;

    try {
      const response = await fetch('/api/room/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: playerInfo.roomId,
          playerId: playerInfo.playerId,
          gameState: newState,
        }),
      });

      if (!response.ok) {
        // Rollback bei Fehler
        console.error('[UPDATE] ❌ Fehler, Rollback zum vorherigen State');
        setGameState(previousState);
        pendingStateRef.current = null;
        throw new Error('Fehler beim Aktualisieren');
      }
      
      updateInProgressRef.current = false;
      return true;
    } catch (err) {
      updateInProgressRef.current = false;
      setError('Fehler beim Aktualisieren des Spielstands');
      return false;
    }
  }, [playerInfo, gameState]);

  // Verlasse Raum
  const leaveRoom = useCallback(() => {
    console.log('[LEAVE] Verlasse Raum');
    
    // Schließe SSE Verbindung
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    // Lösche Reconnect Timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setPlayerInfo(null);
    setGameState(null);
    setConnectionStatus('disconnected');
    setError(null);
    setWaitingForPlayer(false);
    reconnectAttemptsRef.current = 0;
    localStorage.removeItem('playerInfo');
  }, []);

  // Beim Laden: Prüfe ob Spieler in einem Raum ist
  useEffect(() => {
    const savedInfo = localStorage.getItem('playerInfo');
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo) as PlayerInfo;
        setPlayerInfo(info);
        
        // Lade aktuellen State und verbinde SSE
        fetch(`/api/room/state?roomId=${info.roomId}`)
          .then(res => res.json())
          .then(data => {
            setGameState(data.gameState);
            if (data.players.player2) {
              setWaitingForPlayer(false);
            } else if (info.playerNumber === 1) {
              setWaitingForPlayer(true);
            }
            connectSSE(info.roomId);
          })
          .catch(() => {
            localStorage.removeItem('playerInfo');
          });
      } catch (err) {
        localStorage.removeItem('playerInfo');
      }
    }
  }, [connectSSE]);

  // Cleanup beim Unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    playerInfo,
    gameState,
    connectionStatus,
    waitingForPlayer,
    error,
    createRoom,
    joinRoom,
    updateGameState,
    leaveRoom,
    setError,
    setGameState,
  };
};
