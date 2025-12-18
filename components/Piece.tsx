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
    small: 'w-12 h-12 sm:w-14 sm:h-14',
    medium: 'w-14 h-14 sm:w-18 sm:h-18',
    large: 'w-18 h-18 sm:w-22 sm:h-22'
  };
  
  // Kombinierte Lösung: Höhe + Schatten mit 3D-Effekt
  const heightClasses = height === 'tall' 
    ? 'h-14 sm:h-18 shadow-2xl' 
    : 'h-10 sm:h-14 shadow-lg';
  
  // Breite = Höhe für perfekte Quadrate/Kreise
  const widthClasses = height === 'tall'
    ? 'w-14 sm:w-18'
    : 'w-10 sm:w-14';
  
  // Moderne Farbverläufe mit Glassmorphismus
  const colorClasses = color === 'light' 
    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-amber-700' 
    : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-gray-950';
  
  // Eckige Steine: leichte Abrundung, Runde: volle Abrundung
  const shapeClasses = shape === 'round' ? 'rounded-full' : 'rounded-lg';
  
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center cursor-pointer transition-all active:scale-95 hover:scale-110 ${
        selected ? 'ring-4 ring-blue-500 ring-offset-2 ring-offset-white/50' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`${widthClasses} ${heightClasses} ${colorClasses} ${shapeClasses} border-3 flex items-center justify-center transition-all hover:brightness-110 relative`}
        style={{
          boxShadow: color === 'light' 
            ? '0 4px 14px rgba(251, 191, 36, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.2)'
            : '0 4px 14px rgba(0, 0, 0, 0.6), inset 0 -2px 8px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Glanz-Effekt oben */}
        <div className={`absolute top-1 left-1/4 right-1/4 h-2 bg-white/30 ${shape === 'round' ? 'rounded-full' : 'rounded-sm'} blur-sm`}></div>
        
        {top === 'hollow' && (
          <div 
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              color === 'light' ? 'bg-white shadow-inner' : 'bg-gray-950 shadow-inner'
            } ${shape === 'round' ? 'rounded-full' : 'rounded-md'} border ${
              color === 'light' ? 'border-amber-700' : 'border-gray-700'
            }`} 
          />
        )}
      </div>
    </div>
  );
};
