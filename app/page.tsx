'use client';

import React, { useState, useEffect } from 'react';
import { GameState, Piece as PieceType } from '@/types/game';
import { createInitialGameState, placePiece, selectPiece } from '@/utils/gameLogic';
import { Board } from '@/components/Board';
import { PieceSelector } from '@/components/PieceSelector';
import { GameInfo } from '@/components/GameInfo';
import { MultiplayerLobby } from '@/components/MultiplayerLobby';
import { RoomInfo } from '@/components/RoomInfo';
import { useMultiplayer } from '@/hooks/useMultiplayer';

type GameMode = 'lobby' | 'local' | 'online';

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>('lobby');
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [isCreating, setIsCreating] = useState(false);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);

  const {
    playerInfo,
    isConnected,
    error,
    createRoom,
    joinRoom,
    updateGameState,
    fetchGameState,
    leaveRoom,
    setError,
  } = useMultiplayer();

  // Polling für Online-Spiele - NUR wenn nicht am Zug
  useEffect(() => {
    if (gameMode !== 'online' || !playerInfo) {
      return;
    }

    console.log('[POLLING] Starte Polling für Raum:', playerInfo.roomId);

    let isActive = true;
    let lastUpdate = Date.now();

    const interval = setInterval(async () => {
      if (!isActive) return;
      
      // NUR pollen wenn wir NICHT am Zug sind
      const isMyTurn = gameState.currentPlayer === playerInfo.playerNumber;
      if (isMyTurn && !waitingForPlayer) {
        console.log('[POLLING] Überspringe - ich bin am Zug');
        return;
      }
      
      const data = await fetchGameState();
      if (data && isActive) {
        const now = Date.now();
        // Nur updaten wenn sich was geändert hat
        if (JSON.stringify(data.gameState) !== JSON.stringify(gameState)) {
          console.log('[POLLING] Zustand geändert, aktualisiere...', {
            currentPlayer: data.gameState.currentPlayer,
            phase: data.gameState.gamePhase,
            selectedPiece: data.gameState.selectedPiece?.id
          });
          setGameState(data.gameState);
          lastUpdate = now;
        }
        
        // Prüfe ob Spieler 2 beigetreten ist
        if (waitingForPlayer && data.players.player2) {
          console.log('[POLLING] Spieler 2 ist beigetreten!');
          setWaitingForPlayer(false);
        }
      }
    }, 1500); // Alle 1.5 Sekunden aktualisieren (weniger aggressiv)

    return () => {
      console.log('[POLLING] Stoppe Polling');
      isActive = false;
      clearInterval(interval);
    };
  }, [gameMode, playerInfo, gameState, waitingForPlayer, fetchGameState]);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError(null);
    const result = await createRoom();
    setIsCreating(false);

    if (result) {
      setGameState(result.gameState);
      setGameMode('online');
      setWaitingForPlayer(true);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    setError(null);
    const result = await joinRoom(roomId);

    if (result) {
      setGameState(result.gameState);
      setGameMode('online');
      setWaitingForPlayer(false);
    }
  };

  const handlePlayLocal = () => {
    setGameState(createInitialGameState());
    setGameMode('local');
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setGameMode('lobby');
    setGameState(createInitialGameState());
    setWaitingForPlayer(false);
  };

  const handleCellClick = async (row: number, col: number) => {
    if (gameState.winner !== null) return;

    // Online-Modus: Prüfe ob Spieler an der Reihe ist
    if (gameMode === 'online' && playerInfo) {
      if (gameState.currentPlayer !== playerInfo.playerNumber) {
        console.log('[CLICK] Nicht dein Zug! Du bist Spieler', playerInfo.playerNumber, 'aber Spieler', gameState.currentPlayer, 'ist dran');
        return; // Nicht dein Zug
      }
      if (waitingForPlayer) {
        return; // Warte noch auf zweiten Spieler
      }
    }

    const newState = placePiece(gameState, row, col);
    if (newState) {
      console.log('[CLICK] Stein platziert bei', row, col);
      setGameState(newState);
      
      // Synchronisiere bei Online-Spiel
      if (gameMode === 'online') {
        console.log('[CLICK] Synchronisiere neuen Zustand...');
        const success = await updateGameState(newState);
        console.log('[CLICK] Synchronisation erfolgreich:', success);
      }
    }
  };

  const handlePieceSelect = async (piece: PieceType) => {
    if (gameState.winner !== null) return;

    // Online-Modus: Prüfe ob Spieler an der Reihe ist
    if (gameMode === 'online' && playerInfo) {
      if (gameState.currentPlayer !== playerInfo.playerNumber) {
        console.log('[SELECT] Nicht dein Zug! Du bist Spieler', playerInfo.playerNumber, 'aber Spieler', gameState.currentPlayer, 'ist dran');
        return; // Nicht dein Zug
      }
      if (waitingForPlayer) {
        return; // Warte noch auf zweiten Spieler
      }
    }

    const newState = selectPiece(gameState, piece);
    if (newState) {
      console.log('[SELECT] Stein ausgewählt:', piece.id, 'Nächster Spieler:', newState.currentPlayer);
      setGameState(newState);
      
      // Synchronisiere bei Online-Spiel
      if (gameMode === 'online') {
        console.log('[SELECT] Synchronisiere neuen Zustand mit ausgewähltem Stein...');
        const success = await updateGameState(newState);
        console.log('[SELECT] Synchronisation erfolgreich:', success);
      }
    }
  };

  const handleRestart = async () => {
    const newState = createInitialGameState();
    setGameState(newState);
    
    // Synchronisiere bei Online-Spiel
    if (gameMode === 'online') {
      await updateGameState(newState);
    }
  };

  const handleBackToLobby = () => {
    setGameMode('lobby');
    setGameState(createInitialGameState());
  };

  // Zeige Lobby
  if (gameMode === 'lobby') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 flex items-center justify-center">
        <MultiplayerLobby
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onPlayLocal={handlePlayLocal}
          error={error}
          isCreating={isCreating}
        />
      </main>
    );
  }

  // Bestimme ob Spieler an der Reihe ist (für Online-Modus)
  const isMyTurn = gameMode === 'local' || 
    (playerInfo !== null && gameState.currentPlayer === playerInfo.playerNumber);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            🎲 Quarto
          </h1>
          {gameMode === 'local' && (
            <button
              onClick={handleBackToLobby}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Zurück zur Lobby
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8">
          {/* Room Info für Online-Spiele */}
          {gameMode === 'online' && playerInfo && (
            <RoomInfo
              playerInfo={playerInfo}
              waitingForPlayer={waitingForPlayer}
              onLeaveRoom={handleLeaveRoom}
            />
          )}

          {/* Zeige Hinweis wenn nicht am Zug */}
          {gameMode === 'online' && !waitingForPlayer && !isMyTurn && gameState.winner === null && (
            <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center">
              <div className="text-blue-800 font-semibold">
                ⏳ Warte auf Spieler {gameState.currentPlayer}
              </div>
            </div>
          )}

          <GameInfo gameState={gameState} onRestart={handleRestart} />

          <div className="flex justify-center mb-6">
            <Board
              board={gameState.board}
              onCellClick={handleCellClick}
              canPlacePiece={
                gameState.gamePhase === 'placePiece' && 
                gameState.winner === null && 
                !waitingForPlayer &&
                isMyTurn
              }
            />
          </div>

          <PieceSelector
            pieces={gameState.availablePieces}
            onPieceSelect={handlePieceSelect}
            disabled={
              gameState.gamePhase !== 'selectPiece' || 
              gameState.winner !== null || 
              waitingForPlayer ||
              !isMyTurn
            }
          />

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2">📖 Spielregeln:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Jeder Spielstein hat 4 Eigenschaften: Farbe, Höhe, Form, Oberseite</li>
              <li>Spieler 1 wählt einen Stein, den Spieler 2 platzieren muss</li>
              <li>Dann wählt Spieler 2 einen Stein für Spieler 1</li>
              <li>Gewinner: Wer als Erster 4 Steine mit einer gemeinsamen Eigenschaft in einer Reihe hat</li>
              <li>Dies kann horizontal, vertikal oder diagonal sein</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
