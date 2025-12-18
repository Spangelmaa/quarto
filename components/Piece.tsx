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
    small: 'w-10 h-10 sm:w-12 sm:h-12',
    medium: 'w-12 h-12 sm:w-16 sm:h-16',
    large: 'w-16 h-16 sm:w-20 sm:h-20'
  };
  
  // Höhe bestimmt die tatsächliche Größe des Steins
  const heightClasses = height === 'tall' 
    ? 'h-12 sm:h-16 shadow-lg' 
    : 'h-9 sm:h-12 shadow-md';
  
  // Breite = Höhe für perfekte Quadrate/Kreise
  const widthClasses = height === 'tall'
    ? 'w-12 sm:w-16'
    : 'w-9 sm:w-12';
  
  // Einfache Farben ohne Gradienten
  const colorClasses = color === 'light' 
    ? 'bg-amber-600 border-amber-800' 
    : 'bg-gray-700 border-gray-900';
  
  // Form: Runde sind perfekt rund, eckige haben keine Abrundung
  const shapeClasses = shape === 'round' ? 'rounded-full' : 'rounded-none';
  
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center cursor-pointer transition-all active:scale-95 sm:hover:scale-105 ${
        selected ? 'ring-2 sm:ring-4 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`${widthClasses} ${heightClasses} ${colorClasses} ${shapeClasses} border-2 sm:border-4 flex items-center justify-center transition-transform`}
      >
        {top === 'hollow' && (
          <div 
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              color === 'light' ? 'bg-white' : 'bg-gray-900'
            } ${shape === 'round' ? 'rounded-full' : 'rounded-sm'}`} 
          />
        )}
      </div>
    </div>
  );
};
