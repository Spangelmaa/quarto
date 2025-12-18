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
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
        🎲 Quarto
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <div className="font-bold text-red-800 mb-1">Fehler</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Spiel erstellen */}
        <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-lg mb-2 text-gray-800">🎮 Neues Spiel erstellen</h3>
          <p className="text-sm text-gray-600 mb-3">
            Erstelle einen Raum und teile den Code mit einem Freund
          </p>
          <button
            onClick={onCreateRoom}
            disabled={isCreating}
            className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Erstelle Raum...' : 'Raum erstellen'}
          </button>
        </div>

        {/* Spiel beitreten */}
        <div className="p-5 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-bold text-lg mb-2 text-gray-800">🔗 Einem Spiel beitreten</h3>
          <p className="text-sm text-gray-600 mb-3">
            Gib den 4-stelligen Raumcode ein
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 uppercase text-center text-xl font-bold"
            />
            <button
              onClick={handleJoinRoom}
              disabled={roomId.length !== 4}
              className="w-full px-5 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Beitreten
            </button>
          </div>
        </div>

        {/* Lokal spielen */}
        <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-bold text-lg mb-2 text-gray-800">🏠 Lokal spielen</h3>
          <p className="text-sm text-gray-600 mb-3">
            Spiele zu zweit auf diesem Gerät
          </p>
          <button
            onClick={onPlayLocal}
            className="w-full px-5 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
          >
            Lokal spielen
          </button>
        </div>
      </div>

      {/* Spielregeln */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="font-bold mb-2 text-sm text-amber-900">📖 Spielregeln</h3>
        <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
          <li>Jeder Stein hat 4 Eigenschaften: Farbe, Höhe, Form, Oberseite</li>
          <li>Spieler wählen abwechselnd Steine für den Gegner</li>
          <li>Gewinner: 4 Steine mit gemeinsamer Eigenschaft in einer Reihe</li>
        </ul>
      </div>
    </div>
  );
};

