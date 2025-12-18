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
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-900">
        {getStatusMessage()}
      </h2>
      
      {gameState.selectedPiece && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 shadow-sm">
          <span className="font-semibold text-base text-indigo-900">
            Ausgewählter Stein:
          </span>
          <Piece piece={gameState.selectedPiece} size="medium" selected={true} />
        </div>
      )}
      
      {gameState.winner !== null && (
        <button
          onClick={onRestart}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md"
        >
          Neues Spiel
        </button>
      )}
    </div>
  );
};
