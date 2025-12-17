import React from 'react';
import { Piece as PieceType } from '@/types/game';

type PieceProps = {
  piece: PieceType;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
};

export const Piece: React.FC<PieceProps> = ({ piece, onClick, size = 'medium', selected = false }) => {
  const { color, height, shape, top } = piece.attributes;
  
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };
  
  const heightClasses = height === 'tall' ? 'h-16' : 'h-12';
  const colorClasses = color === 'light' ? 'bg-amber-200 border-amber-400' : 'bg-gray-700 border-gray-900';
  const shapeClasses = shape === 'round' ? 'rounded-full' : 'rounded-md';
  
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${selected ? 'ring-4 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <div
        className={`w-full ${heightClasses} ${colorClasses} ${shapeClasses} border-4 flex items-center justify-center transition-transform`}
      >
        {top === 'hollow' && (
          <div className={`w-4 h-4 ${color === 'light' ? 'bg-white' : 'bg-gray-900'} ${shape === 'round' ? 'rounded-full' : 'rounded-sm'}`} />
        )}
      </div>
    </div>
  );
};
