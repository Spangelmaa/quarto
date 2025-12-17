import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '@/types/game';
import { PlayerInfo } from '@/types/multiplayer';
import { CONNECTION_CONFIG } from '@/config/connection';

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
  const fallbackPollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastSSEMessageRef = useRef<number>(Date.now());
  const visibilityCheckRef = useRef<NodeJS.Timeout | null>(null);

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
      lastSSEMessageRef.current = Date.now();
      setError(null);
      
      // Starte Fallback-Polling als Sicherheit (alle 5 Sekunden prüfen)
      if (fallbackPollingRef.current) {
        clearInterval(fallbackPollingRef.current);
      }
      
      fallbackPollingRef.current = setInterval(async () => {
        const timeSinceLastMessage = Date.now() - lastSSEMessageRef.current;
        
        // Wenn länger als konfiguriert keine SSE-Nachricht, hole State manuell
        if (timeSinceLastMessage > CONNECTION_CONFIG.FALLBACK_TIMEOUT) {
          console.log(`[FALLBACK] ⚠️ Keine SSE-Nachricht seit ${CONNECTION_CONFIG.FALLBACK_TIMEOUT}ms, hole State manuell`);
          try {
            const response = await fetch(`/api/room/state?roomId=${roomId}`);
            if (response.ok) {
              const data = await response.json();
              setGameState(data.gameState);
              if (data.players.player2) {
                setWaitingForPlayer(false);
              }
              lastSSEMessageRef.current = Date.now(); // Reset timer nach erfolgreichem Fallback
              console.log('[FALLBACK] ✅ State manuell aktualisiert');
              
              // Wenn SSE tot ist, versuche Reconnect
              if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
                console.log('[FALLBACK] SSE ist tot, starte Reconnect');
                connectSSE(roomId);
              }
            }
          } catch (e) {
            console.error('[FALLBACK] ❌ Fehler beim manuellen Abrufen:', e);
          }
        }
      }, CONNECTION_CONFIG.FALLBACK_POLL_INTERVAL);
    };

    eventSource.onmessage = (event) => {
      try {
        lastSSEMessageRef.current = Date.now(); // Aktualisiere letzte Nachricht
        
        // Ignoriere leere Events (Heartbeats werden über Kommentare gesendet)
        if (!event.data || event.data.trim() === '') {
          return;
        }
        
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
        } else if (data.type === 'ping') {
          // Heartbeat erhalten, keine Aktion nötig (lastSSEMessageRef wurde schon aktualisiert)
          console.log('[SSE] 💓 Ping erhalten');
        }
      } catch (e) {
        console.error('[SSE] Fehler beim Parsen:', e);
      }
    };

    eventSource.onerror = (e) => {
      console.error('[SSE] ❌ Verbindungsfehler:', e);
      
      // Prüfe ReadyState um zu sehen ob Verbindung wirklich tot ist
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('[SSE] Verbindung endgültig geschlossen, reconnecte...');
        
        // Setze Status NICHT sofort auf error, wir haben ja Fallback-Polling
        // Zeige weiter "connected" solange Fallback funktioniert
        
        // Automatischer Reconnect mit exponential backoff
        if (reconnectAttemptsRef.current < CONNECTION_CONFIG.MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(
            CONNECTION_CONFIG.INITIAL_RECONNECT_DELAY * Math.pow(CONNECTION_CONFIG.BACKOFF_FACTOR, reconnectAttemptsRef.current),
            CONNECTION_CONFIG.MAX_RECONNECT_DELAY
          );
          console.log(`[SSE] 🔄 Reconnect in ${delay}ms (Versuch ${reconnectAttemptsRef.current + 1}/${CONNECTION_CONFIG.MAX_RECONNECT_ATTEMPTS})`);
          
          // Zeige Fehler erst nach vielen Versuchen (Fallback läuft ja)
          if (reconnectAttemptsRef.current > 5) {
            setConnectionStatus('error');
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectSSE(roomId);
          }, delay);
        } else {
          setConnectionStatus('error');
          setError('SSE instabil. Spiel läuft im Fallback-Polling-Modus weiter.');
        }
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('[SSE] ⏳ Verbindung wird hergestellt...');
        // Zeige nur bei erstem Versuch "connecting"
        if (reconnectAttemptsRef.current === 0) {
          setConnectionStatus('connecting');
        }
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
    if (!playerInfo) {
      console.error('[UPDATE] ❌ Kein playerInfo vorhanden');
      return false;
    }

    // Verhindere doppelte Requests
    if (updateInProgressRef.current) {
      console.log('[UPDATE] ⏭️ Update bereits in Bearbeitung, überspringe');
      return false;
    }

    // Debouncing: Mindestens konfigurierte Zeit zwischen Updates
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
    if (timeSinceLastUpdate < CONNECTION_CONFIG.MIN_UPDATE_INTERVAL) {
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
        updateInProgressRef.current = false;
        
        // Versuche SSE-Verbindung wiederherzustellen
        if (connectionStatus !== 'connected') {
          console.log('[UPDATE] SSE nicht verbunden, versuche Reconnect');
          connectSSE(playerInfo.roomId);
        }
        
        throw new Error('Fehler beim Aktualisieren');
      }
      
      updateInProgressRef.current = false;
      return true;
    } catch (err) {
      updateInProgressRef.current = false;
      setError('Fehler beim Aktualisieren. Versuche Verbindung wiederherzustellen...');
      
      // Versuche SSE-Verbindung wiederherzustellen bei Netzwerkfehlern
      if (connectionStatus !== 'connected' && playerInfo) {
        console.log('[UPDATE] Netzwerkfehler, starte Reconnect');
        setTimeout(() => connectSSE(playerInfo.roomId), 1000);
      }
      
      return false;
    }
  }, [playerInfo, gameState, connectionStatus, connectSSE]);

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
    
    // Lösche Fallback Polling
    if (fallbackPollingRef.current) {
      clearInterval(fallbackPollingRef.current);
      fallbackPollingRef.current = null;
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

  // Überwache Sichtbarkeit des Tabs und Netzwerkstatus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && playerInfo) {
        console.log('[VISIBILITY] Tab wieder sichtbar, prüfe Verbindung');
        
        // Prüfe ob SSE noch lebt
        const timeSinceLastMessage = Date.now() - lastSSEMessageRef.current;
        if (timeSinceLastMessage > CONNECTION_CONFIG.VISIBILITY_RECONNECT_THRESHOLD || eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log('[VISIBILITY] SSE scheint tot, starte Reconnect');
          connectSSE(playerInfo.roomId);
        }
      }
    };

    const handleOnline = () => {
      if (playerInfo) {
        console.log('[NETWORK] Wieder online, reconnecte SSE');
        connectSSE(playerInfo.roomId);
      }
    };

    const handleOffline = () => {
      console.log('[NETWORK] Offline erkannt');
      setConnectionStatus('error');
      setError('Keine Internetverbindung');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [playerInfo, connectSSE]);

  // Cleanup beim Unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (fallbackPollingRef.current) {
        clearInterval(fallbackPollingRef.current);
      }
      if (visibilityCheckRef.current) {
        clearTimeout(visibilityCheckRef.current);
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
