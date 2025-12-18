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
    <div className="mb-8 text-center">
      <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
        {getStatusMessage()}
      </h2>
      
      {gameState.selectedPiece && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-6 p-5 sm:p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30 shadow-lg">
          <span className="font-bold text-base sm:text-lg text-gray-800 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            Ausgewählter Stein:
          </span>
          <div className="transform hover:scale-110 transition-transform">
            <Piece piece={gameState.selectedPiece} size="medium" selected={true} />
          </div>
        </div>
      )}
      
      {gameState.winner !== null && (
        <button
          onClick={onRestart}
          className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          🔄 Neues Spiel
        </button>
      )}
    </div>
  );
};
