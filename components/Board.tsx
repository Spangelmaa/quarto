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
    <div className="inline-block bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 p-4 sm:p-5 rounded-lg shadow-2xl border-4 border-emerald-700">
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-md flex items-center justify-center border-2 border-emerald-700/30 shadow-md transition-all ${
                canPlacePiece && cell === null 
                  ? 'hover:from-amber-200 hover:to-amber-300 cursor-pointer hover:border-emerald-600 hover:shadow-lg hover:scale-105' 
                  : ''
              }`}
              onClick={() => canPlacePiece && cell === null && onCellClick(rowIndex, colIndex)}
            >
              {cell && <Piece piece={cell} size="medium" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
