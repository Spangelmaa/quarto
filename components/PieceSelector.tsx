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
    <div className="mt-6">
      <h3 className="text-lg sm:text-xl font-bold mb-3 text-center text-indigo-900">
        Verfügbare Spielsteine
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 p-5 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-indigo-100 shadow-inner max-w-4xl mx-auto">
        {pieces.map(piece => (
          <div 
            key={piece.id} 
            className={`transition-transform ${
              disabled 
                ? 'opacity-40 cursor-not-allowed' 
                : 'cursor-pointer hover:scale-110'
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
