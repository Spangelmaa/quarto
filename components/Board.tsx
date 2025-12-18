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
    <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-gradient-to-br from-amber-800 to-amber-900 p-4 sm:p-5 rounded-xl shadow-xl">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center border-2 border-amber-700/30 shadow-sm transition-all ${
              canPlacePiece && cell === null 
                ? 'hover:from-amber-100 hover:to-amber-200 cursor-pointer hover:border-amber-600 hover:shadow-md' 
                : ''
            }`}
            onClick={() => canPlacePiece && cell === null && onCellClick(rowIndex, colIndex)}
          >
            {cell && <Piece piece={cell} size="medium" />}
          </div>
        ))
      )}
    </div>
  );
};
