import React from 'react';
import { BoardCell } from '@/types/game';
import { Piece } from './Piece';

type BoardProps = {
  board: BoardCell[][];
  onCellClick: (row: number, col: number) => void;
  canPlacePiece: boolean;
};

export const Board: React.FC<BoardProps> = ({ board, onCellClick, canPlacePiece }) => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 p-4 sm:p-6 rounded-2xl shadow-2xl border-4 border-amber-700/50 relative">
      {/* Dekorative Ecken */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-600 rounded-full shadow-lg"></div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-600 rounded-full shadow-lg"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-600 rounded-full shadow-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-600 rounded-full shadow-lg"></div>
      
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl flex items-center justify-center border-2 border-amber-600/30 shadow-inner transition-all duration-200 ${
              canPlacePiece && cell === null 
                ? 'hover:bg-gradient-to-br hover:from-amber-200 hover:to-amber-300 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-amber-500 pulse-glow' 
                : ''
            } ${cell ? 'bg-gradient-to-br from-amber-100 to-amber-200' : ''}`}
            onClick={() => canPlacePiece && cell === null && onCellClick(rowIndex, colIndex)}
          >
            {cell && <Piece piece={cell} size="medium" />}
          </div>
        ))
      )}
    </div>
  );
};
