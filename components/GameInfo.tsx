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
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-800">
        {getStatusMessage()}
      </h2>
      
      {gameState.selectedPiece && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 p-3 bg-slate-50 rounded border border-slate-200">
          <span className="font-medium text-sm text-slate-700">
            Ausgewählter Stein:
          </span>
          <Piece piece={gameState.selectedPiece} size="medium" selected={true} />
        </div>
      )}
      
      {gameState.winner !== null && (
        <button
          onClick={onRestart}
          className="mt-4 px-5 py-2.5 bg-slate-700 text-white font-medium rounded hover:bg-slate-800 transition-colors"
        >
          Neues Spiel
        </button>
      )}
    </div>
  );
};
