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
    <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-amber-800 p-3 sm:p-4 rounded-lg shadow-xl">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 rounded-md flex items-center justify-center border-2 border-amber-600 transition-all ${
              canPlacePiece && cell === null 
                ? 'hover:bg-amber-100 cursor-pointer hover:border-amber-700' 
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
