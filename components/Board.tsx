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
    <div className="grid grid-cols-4 gap-1 sm:gap-2 bg-amber-800 p-2 sm:p-4 rounded-lg shadow-2xl">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-md flex items-center justify-center border-2 border-amber-600 transition-all ${
              canPlacePiece && cell === null ? 'hover:bg-amber-200 cursor-pointer active:scale-95 sm:hover:scale-105' : ''
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
