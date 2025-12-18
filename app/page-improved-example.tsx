'use client';

/**
 * BEISPIEL: Verbesserte Version von page.tsx mit allen neuen Features
 * 
 * Diese Datei zeigt wie du die neuen Features integrieren kannst.
 * Um sie zu aktivieren, benenne sie um zu 'page.tsx' (und sichere die alte)
 */

import React, { useState, useEffect } from 'react';
import { GameState, Piece as PieceType } from '@/types/game';
import { createInitialGameState, placePiece, selectPiece } from '@/utils/gameLogic';
import { Board } from '@/components/Board';
import { PieceSelector } from '@/components/PieceSelector';
import { GameInfo } from '@/components/GameInfo';
import { MultiplayerLobby } from '@/components/MultiplayerLobby';
import { RoomInfo } from '@/components/RoomInfo';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { WinnerModal } from '@/components/WinnerModal';
import { useMultiplayerSSE } from '@/hooks/useMultiplayerSSE';

// Neue Komponenten
import { GameRules } from '@/components/GameRules';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Neue Hooks
import { usePerformanceMonitor } from '@/hooks/usePerformance';

// Zustand Store (optional - kannst du schrittweise migrieren)
import { useGameStore } from '@/store/gameStore';

// Server Actions (optional - kannst du statt fetch verwenden)
import { createRoomAction, joinRoomAction } from '@/app/actions/gameActions';

type GameMode = 'lobby' | 'local' | 'online';

export default function Home() {
  // Performance Monitoring (nur in Development aktiv)
  usePerformanceMonitor('HomePage');

  const [gameMode, setGameMode] = useState<GameMode>('lobby');
  const [localGameState, setLocalGameState] = useState<GameState>(createInitialGameState());
  const [isCreating, setIsCreating] = useState(false);

  const {
    playerInfo,
    gameState: onlineGameState,
    connectionStatus,
    waitingForPlayer,
    error,
    createRoom,
    joinRoom,
    updateGameState,
    leaveRoom,
    setError,
  } = useMultiplayerSSE();

  // Optional: Zustand Store verwenden
  // const { setGameState, setPlayerInfo } = useGameStore();

  const gameState = gameMode === 'online' ? (onlineGameState || createInitialGameState()) : localGameState;

  // OPTION 1: Original fetch verwenden (wie bisher)
  const handleCreateRoomOriginal = async () => {
    setIsCreating(true);
    setError(null);
    const result = await createRoom();
    setIsCreating(false);

    if (result) {
      setGameMode('online');
    }
  };

  // OPTION 2: Server Action verwenden (NEU - empfohlen)
  const handleCreateRoomWithAction = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const playerId = localStorage.getItem('playerId') || Math.random().toString(36).substring(2, 15);
      localStorage.setItem('playerId', playerId);

      const result = await createRoomAction(playerId);

      if (result.success) {
        console.log('✅ Raum erstellt:', result.data.roomId);
        setGameMode('online');
        // Verbinde SSE manuell oder integriere in useMultiplayerSSE
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Fehler beim Erstellen des Raums');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    setError(null);
    const result = await joinRoom(roomId);

    if (result) {
      setGameMode('online');
    }
  };

  const handlePlayLocal = () => {
    setLocalGameState(createInitialGameState());
    setGameMode('local');
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setGameMode('lobby');
    setLocalGameState(createInitialGameState());
  };

  const handleCellClick = async (row: number, col: number) => {
    if (gameState.winner !== null) return;

    // Online-Modus: Prüfe ob Spieler an der Reihe ist
    if (gameMode === 'online' && playerInfo) {
      if (gameState.currentPlayer !== playerInfo.playerNumber) return;
      if (waitingForPlayer) return;
    }

    const newState = placePiece(gameState, row, col);
    if (newState) {
      if (gameMode === 'online') {
        await updateGameState(newState);
      } else {
        setLocalGameState(newState);
      }
    }
  };

  const handlePieceSelect = async (piece: PieceType) => {
    if (gameState.winner !== null) return;

    if (gameMode === 'online' && playerInfo) {
      if (gameState.currentPlayer !== playerInfo.playerNumber) return;
      if (waitingForPlayer) return;
    }

    const newState = selectPiece(gameState, piece);
    if (newState) {
      if (gameMode === 'online') {
        await updateGameState(newState);
      } else {
        setLocalGameState(newState);
      }
    }
  };

  const handleRestart = async () => {
    const newState = createInitialGameState();

    if (gameMode === 'online') {
      await updateGameState(newState);
    } else {
      setLocalGameState(newState);
    }
  };

  const handleBackToLobby = () => {
    setGameMode('lobby');
    setLocalGameState(createInitialGameState());
  };

  // Zeige Lobby
  if (gameMode === 'lobby') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 flex items-center justify-center">
        <MultiplayerLobby
          onCreateRoom={handleCreateRoomOriginal} // oder handleCreateRoomWithAction
          onJoinRoom={handleJoinRoom}
          onPlayLocal={handlePlayLocal}
          error={error}
          isCreating={isCreating}
        />
      </main>
    );
  }

  // Zeige Loading während Verbindung aufgebaut wird
  if (gameMode === 'online' && connectionStatus === 'connecting' && !gameState) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Verbinde mit Server..." />
      </main>
    );
  }

  const isMyTurn = gameMode === 'local' || (playerInfo !== null && gameState.currentPlayer === playerInfo.playerNumber);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Gewinner Modal */}
      {gameState.winner !== null && (
        <WinnerModal
          winner={gameState.winner}
          onRestart={handleRestart}
          onBackToLobby={gameMode === 'local' ? handleBackToLobby : undefined}
          currentPlayerNumber={gameMode === 'online' ? playerInfo?.playerNumber : undefined}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header mit Connection Status */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900">🎲 Quarto</h1>
          {gameMode === 'local' && (
            <button
              onClick={handleBackToLobby}
              className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              ← Zurück zur Lobby
            </button>
          )}
        </div>

        <div className="glass rounded-2xl shadow-xl p-6 md:p-10">
          {/* Room Info */}
          {gameMode === 'online' && playerInfo && (
            <RoomInfo playerInfo={playerInfo} waitingForPlayer={waitingForPlayer} onLeaveRoom={handleLeaveRoom} />
          )}

          {/* Connection Status */}
          {gameMode === 'online' && (
            <div className="mb-4">
              <ConnectionStatus status={connectionStatus} error={error} waitingForPlayer={waitingForPlayer} />
            </div>
          )}

          {/* Warte-Hinweis */}
          {gameMode === 'online' && !waitingForPlayer && !isMyTurn && gameState.winner === null && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-blue-800 font-semibold flex items-center justify-center gap-2">
                <span>⏳</span>
                <span>Warte auf Spieler {gameState.currentPlayer}</span>
              </div>
            </div>
          )}

          <GameInfo gameState={gameState} onRestart={handleRestart} />

          <div className="flex justify-center mb-6">
            <Board
              board={gameState.board}
              onCellClick={handleCellClick}
              canPlacePiece={gameState.gamePhase === 'placePiece' && gameState.winner === null && !waitingForPlayer && isMyTurn}
            />
          </div>

          <PieceSelector
            pieces={gameState.availablePieces}
            onPieceSelect={handlePieceSelect}
            disabled={gameState.gamePhase !== 'selectPiece' || gameState.winner !== null || waitingForPlayer || !isMyTurn}
          />

          {/* Neue Server Component für Regeln */}
          <GameRules />
        </div>
      </div>
    </main>
  );
}
