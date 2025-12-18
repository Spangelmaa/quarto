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
    <div className="inline-block bg-slate-800 p-3 sm:p-4 rounded shadow-xl border-4 border-slate-700">
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 ${
                (rowIndex + colIndex) % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'
              } flex items-center justify-center transition-all ${
                canPlacePiece && cell === null 
                  ? 'hover:bg-slate-400 cursor-pointer' 
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
