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
      <h3 className="text-xl font-bold mb-3 text-center">Verfügbare Spielsteine</h3>
      <div className="grid grid-cols-8 gap-3 p-4 bg-gray-100 rounded-lg shadow-inner max-w-4xl">
        {pieces.map(piece => (
          <div key={piece.id} className={disabled ? 'opacity-50 cursor-not-allowed' : ''}>
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
