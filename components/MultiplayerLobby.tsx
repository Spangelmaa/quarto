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
    <div className="max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-200">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
        Quarto
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="flex items-start gap-2">
            <span className="text-red-600">⚠</span>
            <div>
              <div className="font-semibold text-red-800 text-sm mb-1">Fehler</div>
              <div className="text-red-700 text-xs">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Spiel erstellen */}
        <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
          <h3 className="font-bold text-lg mb-2 text-emerald-900">🎮 Neues Spiel erstellen</h3>
          <p className="text-sm text-emerald-700 mb-3">
            Erstelle einen Raum und teile den Code mit einem Freund
          </p>
          <button
            onClick={onCreateRoom}
            disabled={isCreating}
            className="w-full px-5 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Erstelle Raum...' : 'Raum erstellen'}
          </button>
        </div>

        {/* Spiel beitreten */}
        <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
          <h3 className="font-bold text-lg mb-2 text-teal-900">🔗 Einem Spiel beitreten</h3>
          <p className="text-sm text-teal-700 mb-3">
            Gib den 4-stelligen Raumcode ein
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              className="w-full px-4 py-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 uppercase text-center text-xl font-bold text-teal-900"
            />
            <button
              onClick={handleJoinRoom}
              disabled={roomId.length !== 4}
              className="w-full px-5 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Beitreten
            </button>
          </div>
        </div>

        {/* Lokal spielen */}
        <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <h3 className="font-bold text-lg mb-2 text-green-900">🏠 Lokal spielen</h3>
          <p className="text-sm text-green-700 mb-3">
            Spiele zu zweit auf diesem Gerät
          </p>
          <button
            onClick={onPlayLocal}
            className="w-full px-5 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md"
          >
            Lokal spielen
          </button>
        </div>
      </div>

      {/* Spielregeln */}
      <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm">
        <h3 className="font-bold mb-2 text-sm text-amber-900 flex items-center gap-1">
          <span>📖</span>
          <span>Spielregeln</span>
        </h3>
        <ul className="space-y-1.5 text-xs text-amber-800">
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

