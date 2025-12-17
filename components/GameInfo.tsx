import React from 'react';
import { GameState } from '@/types/game';
import { Piece } from './Piece';

type GameInfoProps = {
  gameState: GameState;
  onRestart: () => void;
};

export const GameInfo: React.FC<GameInfoProps> = ({ gameState, onRestart }) => {
  const getStatusMessage = () => {
    if (gameState.winner !== null) {
      if (gameState.winner === 0) {
        return '🤝 Unentschieden!';
      }
      return `🎉 Spieler ${gameState.winner} hat gewonnen!`;
    }
    
    if (gameState.gamePhase === 'selectPiece') {
      return `Spieler ${gameState.currentPlayer}: Wähle einen Stein für deinen Gegner`;
    } else {
      return `Spieler ${gameState.currentPlayer}: Platziere den Stein`;
    }
  };
  
  return (
    <div className="mb-6 text-center">
      <h2 className="text-xl sm:text-3xl font-bold mb-4 text-gray-800">{getStatusMessage()}</h2>
      
      {gameState.selectedPiece && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
          <span className="font-semibold text-sm sm:text-base">Ausgewählter Stein:</span>
          <Piece piece={gameState.selectedPiece} size="medium" selected={true} />
        </div>
      )}
      
      {gameState.winner !== null && (
        <button
          onClick={onRestart}
          className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg"
        >
          Neues Spiel
        </button>
      )}
    </div>
  );
};
