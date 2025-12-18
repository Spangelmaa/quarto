'use client';

import React, { useState, useEffect } from 'react';
import { GameState, Piece as PieceType } from '@/types/game';
import { createInitialGameState, placePiece, selectPiece } from '@/utils/gameLogic';
import { Board } from '@/components/Board';
import { PieceSelector } from '@/components/PieceSelector';
import { GameInfo } from '@/components/GameInfo';
import { MultiplayerLobby } from '@/components/MultiplayerLobby';
import { RoomInfo } from '@/components/RoomInfo';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { ConnectionQualityIndicator } from '@/components/ConnectionQualityIndicator';
import { WinnerModal } from '@/components/WinnerModal';
import { useMultiplayerSSE } from '@/hooks/useMultiplayerSSE';

type GameMode = 'lobby' | 'local' | 'online';

export default function Home() {
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
    setGameState: setOnlineGameState,
  } = useMultiplayerSSE();
  
  // Verwende lokalen oder Online-State je nach Modus
  const gameState = gameMode === 'online' ? (onlineGameState || createInitialGameState()) : localGameState;

  // Kein Polling mehr nötig - SSE handhabt Updates in Echtzeit!

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError(null);
    const result = await createRoom();
    setIsCreating(false);

    if (result) {
      setGameMode('online');
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
    console.log('[CLICK HANDLER] Gestartet:', {
      position: [row, col],
      currentState: {
        player: gameState.currentPlayer,
        phase: gameState.gamePhase,
        selectedPiece: gameState.selectedPiece?.id,
        myNumber: playerInfo?.playerNumber
      }
    });

    if (gameState.winner !== null) {
      console.log('[CLICK HANDLER] Abbruch: Spiel beendet');
      return;
    }

    // Online-Modus: Prüfe ob Spieler an der Reihe ist
    if (gameMode === 'online' && playerInfo) {
      if (gameState.currentPlayer !== playerInfo.playerNumber) {
        console.log('[CLICK HANDLER] ❌ Nicht dein Zug! Du bist Spieler', playerInfo.playerNumber, 'aber Spieler', gameState.currentPlayer, 'ist dran');
        return;
      }
      if (waitingForPlayer) {
        console.log('[CLICK HANDLER] Warte auf Spieler 2');
        return;
      }
    }

    const newState = placePiece(gameState, row, col);
    if (newState) {
      console.log('[CLICK HANDLER] ✅ Neuer State:', {
        currentPlayer: newState.currentPlayer,
        phase: newState.gamePhase,
        selectedPiece: newState.selectedPiece
      });
      
      if (gameMode === 'online') {
        // Online: Optimistisches Update via SSE Hook
        console.log('[CLICK HANDLER] Synchronisiere...');
        const success = await updateGameState(newState);
        console.log('[CLICK HANDLER] Synchronisation:', success ? '✅' : '❌');
      } else {
        // Lokal: Direktes Update
        setLocalGameState(newState);
      }
    } else {
      console.log('[CLICK HANDLER] ❌ placePiece returned null');
    }
  };

  const handlePieceSelect = async (piece: PieceType) => {
    console.log('[SELECT HANDLER] Gestartet:', {
      piece: piece.id,
      currentState: {
        player: gameState.currentPlayer,
        phase: gameState.gamePhase,
        myNumber: playerInfo?.playerNumber
      }
    });

    if (gameState.winner !== null) {
      console.log('[SELECT HANDLER] Abbruch: Spiel beendet');
      return;
    }

    // Online-Modus: Prüfe ob Spieler an der Reihe ist
    if (gameMode === 'online' && playerInfo) {
      if (gameState.currentPlayer !== playerInfo.playerNumber) {
        console.log('[SELECT HANDLER] ❌ Nicht dein Zug! Du bist Spieler', playerInfo.playerNumber, 'aber Spieler', gameState.currentPlayer, 'ist dran');
        return;
      }
      if (waitingForPlayer) {
        console.log('[SELECT HANDLER] Warte auf Spieler 2');
        return;
      }
    }

    const newState = selectPiece(gameState, piece);
    if (newState) {
      console.log('[SELECT HANDLER] ✅ Neuer State:', {
        currentPlayer: newState.currentPlayer,
        phase: newState.gamePhase,
        selectedPiece: newState.selectedPiece?.id
      });
      
      if (gameMode === 'online') {
        // Online: Optimistisches Update via SSE Hook
        console.log('[SELECT HANDLER] Synchronisiere...');
        const success = await updateGameState(newState);
        console.log('[SELECT HANDLER] Synchronisation:', success ? '✅' : '❌');
      } else {
        // Lokal: Direktes Update
        setLocalGameState(newState);
      }
    } else {
      console.log('[SELECT HANDLER] ❌ selectPiece returned null');
    }
  };

  const handleRestart = async () => {
    const newState = createInitialGameState();
    
    if (gameMode === 'online') {
      // Online: Optimistisches Update via SSE Hook
      await updateGameState(newState);
    } else {
      // Lokal: Direktes Update
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
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 py-8 px-4 flex items-center justify-center">
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
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 py-8 px-4">
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
              🎲 Quarto
            </h1>
            {gameMode === 'online' && (
              <ConnectionQualityIndicator status={connectionStatus} compact />
            )}
          </div>
          {gameMode === 'local' && (
            <button
              onClick={handleBackToLobby}
              className="px-5 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
            >
              ← Zurück zur Lobby
            </button>
          )}
        </div>

        <div className="glass rounded-2xl shadow-2xl p-6 md:p-10 border border-white/20">
          {/* Room Info für Online-Spiele */}
          {gameMode === 'online' && playerInfo && (
            <RoomInfo
              playerInfo={playerInfo}
              waitingForPlayer={waitingForPlayer}
              onLeaveRoom={handleLeaveRoom}
            />
          )}

          {/* Verbindungsstatus */}
          {gameMode === 'online' && (
            <div className="mb-4">
              <ConnectionStatus 
                status={connectionStatus} 
                error={error}
                waitingForPlayer={waitingForPlayer}
              />
            </div>
          )}

          {/* Zeige Hinweis wenn nicht am Zug */}
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

          <div className="mt-8 p-5 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-bold mb-2 text-amber-900">📖 Spielregeln</h3>
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
