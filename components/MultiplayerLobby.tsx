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
    <div className="max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-indigo-200">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
        <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
          <h3 className="font-bold text-lg mb-2 text-indigo-900">🎮 Neues Spiel erstellen</h3>
          <p className="text-sm text-indigo-700 mb-3">
            Erstelle einen Raum und teile den Code mit einem Freund
          </p>
          <button
            onClick={onCreateRoom}
            disabled={isCreating}
            className="w-full px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Erstelle Raum...' : 'Raum erstellen'}
          </button>
        </div>

        {/* Spiel beitreten */}
        <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <h3 className="font-bold text-lg mb-2 text-purple-900">🔗 Einem Spiel beitreten</h3>
          <p className="text-sm text-purple-700 mb-3">
            Gib den 4-stelligen Raumcode ein
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 uppercase text-center text-xl font-bold text-purple-900"
            />
            <button
              onClick={handleJoinRoom}
              disabled={roomId.length !== 4}
              className="w-full px-5 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Beitreten
            </button>
          </div>
        </div>

        {/* Lokal spielen */}
        <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h3 className="font-bold text-lg mb-2 text-blue-900">🏠 Lokal spielen</h3>
          <p className="text-sm text-blue-700 mb-3">
            Spiele zu zweit auf diesem Gerät
          </p>
          <button
            onClick={onPlayLocal}
            className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Lokal spielen
          </button>
        </div>
      </div>

      {/* Spielregeln */}
      <div className="mt-6 p-3 bg-slate-50 rounded border border-slate-200">
        <h3 className="font-semibold mb-2 text-xs text-slate-700">Spielregeln</h3>
        <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600">
          <li>Jeder Stein hat 4 Eigenschaften: Farbe, Höhe, Form, Oberseite</li>
          <li>Spieler wählen abwechselnd Steine für den Gegner</li>
          <li>Gewinner: 4 Steine mit gemeinsamer Eigenschaft in einer Reihe</li>
        </ul>
      </div>
    </div>
  );
};

