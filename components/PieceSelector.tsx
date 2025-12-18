import React from 'react';
import { Piece as PieceType } from '@/types/game';
import { Piece } from './Piece';

type PieceSelectorProps = {
  pieces: PieceType[];
  onPieceSelect: (piece: PieceType) => void;
  disabled: boolean;
};

export const PieceSelector: React.FC<PieceSelectorProps> = ({ pieces, onPieceSelect, disabled }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-5 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        ✨ Verfügbare Spielsteine
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 p-5 sm:p-6 bg-gradient-to-br from-gray-200/50 to-gray-300/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-300/30 max-w-4xl mx-auto">
        {pieces.map(piece => (
          <div 
            key={piece.id} 
            className={`transform transition-all duration-200 ${
              disabled 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:scale-110 hover:shadow-lg cursor-pointer'
            }`}
          >
            <Piece
              piece={piece}
              onClick={() => !disabled && onPieceSelect(piece)}
              size="small"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
