import React, { useEffect, useState } from 'react';

type WinnerModalProps = {
  winner: number; // 1, 2, oder 0 für Unentschieden
  onRestart: () => void;
  onBackToLobby?: () => void;
};

export const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onRestart, onBackToLobby }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Kleine Verzögerung für Animation
    setTimeout(() => setShow(true), 100);
  }, []);

  const isDraw = winner === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Feuerwerk Animation */}
      {!isDraw && (
        <>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
        </>
      )}

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${
          show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        {/* Konfetti Emoji für Gewinner */}
        {!isDraw && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">
            🎉
          </div>
        )}

        {/* Titel */}
        <div className="text-center mb-6">
          {isDraw ? (
            <>
              <h2 className="text-4xl font-bold text-gray-700 mb-2">
                Unentschieden!
              </h2>
              <p className="text-lg text-gray-600">
                Das Spiel endet unentschieden
              </p>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2 animate-pulse">
                Spieler {winner} gewinnt!
              </h2>
              <p className="text-xl text-gray-600">
                🏆 Herzlichen Glückwunsch! 🏆
              </p>
            </>
          )}
        </div>

        {/* Trophäe Animation */}
        {!isDraw && (
          <div className="flex justify-center mb-8 w-full pl-32">
            <div className="text-9xl animate-bounce">
              🏆
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
          >
            🔄 Neues Spiel
          </button>
          
          {onBackToLobby && (
            <button
              onClick={onBackToLobby}
              className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all"
            >
              🏠 Zurück zur Lobby
            </button>
          )}
        </div>
      </div>

      {/* CSS für Feuerwerk */}
      <style jsx>{`
        @keyframes firework {
          0% {
            transform: translate(0, 100vh) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(1);
            opacity: 0;
          }
        }

        .firework {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          animation: firework 1.5s ease-out infinite;
        }

        .firework:nth-child(1) {
          left: 20%;
          --x: -50px;
          --y: -400px;
          background: radial-gradient(circle, #ff0080, #ff8c00, #ffd700);
          animation-delay: 0s;
          box-shadow: 0 0 50px 20px #ff0080,
                      20px 20px 50px 20px #ff8c00,
                      -20px 20px 50px 20px #ffd700,
                      20px -20px 50px 20px #00ff80,
                      -20px -20px 50px 20px #0080ff;
        }

        .firework:nth-child(2) {
          left: 50%;
          --x: 30px;
          --y: -450px;
          background: radial-gradient(circle, #0080ff, #00ff80, #ffd700);
          animation-delay: 0.5s;
          box-shadow: 0 0 50px 20px #0080ff,
                      20px 20px 50px 20px #00ff80,
                      -20px 20px 50px 20px #ffd700,
                      20px -20px 50px 20px #ff0080,
                      -20px -20px 50px 20px #ff8c00;
        }

        .firework:nth-child(3) {
          left: 80%;
          --x: 20px;
          --y: -420px;
          background: radial-gradient(circle, #ffd700, #ff0080, #0080ff);
          animation-delay: 1s;
          box-shadow: 0 0 50px 20px #ffd700,
                      20px 20px 50px 20px #ff0080,
                      -20px 20px 50px 20px #0080ff,
                      20px -20px 50px 20px #00ff80,
                      -20px -20px 50px 20px #ff8c00;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          50% {
            transform: translateY(-20px) translateX(-50%);
          }
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
