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
    <div className="relative inline-block">
      {/* Rundes Brett mit elegantem Design */}
      <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-full p-8 sm:p-10 shadow-2xl">
        {/* Innerer Kreis - Spielfläche */}
        <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-full p-6 sm:p-8">
          {/* Dekorativer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/30"></div>
          
          {/* Spielfeld Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 relative z-10">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-amber-400/40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg transition-all ${
                    canPlacePiece && cell === null 
                      ? 'hover:from-amber-100 hover:to-amber-200 hover:border-amber-500 cursor-pointer hover:scale-110 hover:shadow-xl' 
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
        
        {/* Äußerer dekorativer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-amber-600/50 pointer-events-none"></div>
      </div>
    </div>
  );
};
