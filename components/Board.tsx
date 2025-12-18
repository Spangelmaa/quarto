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
      {/* Rundes Spielbrett - Original-Design nachempfunden */}
      <div className="relative rounded-full p-4 sm:p-6 shadow-2xl" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)'
      }}>
        {/* Innerer Spielbereich mit schönem Gradient */}
        <div className="relative rounded-full p-6 sm:p-8" style={{
          background: 'linear-gradient(135deg, #312e81 0%, #4c1d95 50%, #5b21b6 100%)',
          boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.3)'
        }}>
          
          {/* Dekorativer goldener Ring */}
          <div className="absolute inset-0 rounded-full" style={{
            border: '3px solid rgba(217, 119, 6, 0.3)',
            boxShadow: '0 0 20px rgba(217, 119, 6, 0.2)'
          }}></div>
          
          {/* 4x4 Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 relative z-10">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                    canPlacePiece && cell === null 
                      ? 'cursor-pointer hover:scale-105' 
                      : ''
                  }`}
                  style={{
                    background: cell === null 
                      ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
                      : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    boxShadow: canPlacePiece && cell === null
                      ? '0 4px 15px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)'
                      : '0 2px 8px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.4)',
                    border: '2px solid rgba(148, 163, 184, 0.3)'
                  }}
                  onClick={() => canPlacePiece && cell === null && onCellClick(rowIndex, colIndex)}
                >
                  {cell && <Piece piece={cell} size="medium" />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
