'use client';

import React, { useState } from 'react';
import { GameState, Piece as PieceType } from '@/types/game';
import { createInitialGameState, placePiece, selectPiece } from '@/utils/gameLogic';
import { Board } from '@/components/Board';
import { PieceSelector } from '@/components/PieceSelector';
import { GameInfo } from '@/components/GameInfo';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  
  const handleCellClick = (row: number, col: number) => {
    if (gameState.winner !== null) return;
    
    const newState = placePiece(gameState, row, col);
    if (newState) {
      setGameState(newState);
    }
  };
  
  const handlePieceSelect = (piece: PieceType) => {
    if (gameState.winner !== null) return;
    
    const newState = selectPiece(gameState, piece);
    if (newState) {
      setGameState(newState);
    }
  };
  
  const handleRestart = () => {
    setGameState(createInitialGameState());
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
          🎲 Quarto
        </h1>
        
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <GameInfo gameState={gameState} onRestart={handleRestart} />
          
          <div className="flex justify-center mb-6">
            <Board
              board={gameState.board}
              onCellClick={handleCellClick}
              canPlacePiece={gameState.gamePhase === 'placePiece' && gameState.winner === null}
            />
          </div>
          
          <PieceSelector
            pieces={gameState.availablePieces}
            onPieceSelect={handlePieceSelect}
            disabled={gameState.gamePhase !== 'selectPiece' || gameState.winner !== null}
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
