import React, { useState } from 'react';

type MultiplayerLobbyProps = {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  onPlayLocal: () => void;
  error: string | null;
  isCreating: boolean;
};

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
  onPlayLocal,
  error,
  isCreating,
}) => {
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (roomId.trim().length === 4) {
      onJoinRoom(roomId.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 glass rounded-3xl shadow-2xl border border-white/30">
      <h2 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent float-animation">
        🎲 Quarto
      </h2>

      {error && (
        <div className="mb-6 p-5 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-red-400/50 rounded-2xl shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-3xl animate-pulse">❌</span>
            <div>
              <div className="font-bold text-red-900 mb-1 text-lg">Fehler</div>
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Spiel erstellen */}
        <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30 shadow-lg hover:shadow-xl transition-all">
          <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            Neues Spiel erstellen
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Erstelle einen Raum und teile den Code mit einem Freund
          </p>
          <button
            onClick={onCreateRoom}
            disabled={isCreating}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {isCreating ? '✨ Erstelle Raum...' : '🚀 Raum erstellen'}
          </button>
        </div>

        {/* Spiel beitreten */}
        <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30 shadow-lg hover:shadow-xl transition-all">
          <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            Einem Spiel beitreten
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Gib den 4-stelligen Raumcode ein
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              className="w-full px-4 py-4 border-2 border-green-400/50 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 uppercase text-center text-2xl font-bold shadow-inner transition-all"
            />
            <button
              onClick={handleJoinRoom}
              disabled={roomId.length !== 4}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              ✅ Beitreten
            </button>
          </div>
        </div>

        {/* Lokal spielen */}
        <div className="p-6 bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-sm rounded-2xl border border-gray-400/30 shadow-lg hover:shadow-xl transition-all">
          <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            Lokal spielen
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Spiele zu zweit auf diesem Gerät
          </p>
          <button
            onClick={onPlayLocal}
            className="w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-slate-600 text-white font-bold rounded-xl hover:from-gray-700 hover:to-slate-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🎯 Lokal spielen
          </button>
        </div>
      </div>

      {/* Spielregeln */}
      <div className="mt-6 p-5 bg-gradient-to-br from-amber-400/20 to-orange-400/20 backdrop-blur-sm rounded-2xl border border-amber-400/30 shadow-lg">
        <h3 className="font-bold mb-3 text-base text-gray-800 flex items-center gap-2">
          <span className="text-xl">📖</span>
          Spielregeln
        </h3>
        <ul className="space-y-2 text-xs text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Jeder Stein hat 4 Eigenschaften: Farbe, Höhe, Form, Oberseite</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Spieler wählen abwechselnd Steine für den Gegner</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Gewinner: 4 Steine mit gemeinsamer Eigenschaft in einer Reihe</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

