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
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🎲 Quarto
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Spiel erstellen */}
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Neues Spiel erstellen</h3>
          <p className="text-sm text-gray-600 mb-4">
            Erstelle einen Raum und teile den Code mit einem Freund
          </p>
          <button
            onClick={onCreateRoom}
            disabled={isCreating}
            className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Erstelle Raum...' : 'Raum erstellen'}
          </button>
        </div>

        {/* Spiel beitreten */}
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Einem Spiel beitreten</h3>
          <p className="text-sm text-gray-600 mb-4">
            Gib den 4-stelligen Raumcode ein
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 uppercase text-center text-xl font-bold"
            />
            <button
              onClick={handleJoinRoom}
              disabled={roomId.length !== 4}
              className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Beitreten
            </button>
          </div>
        </div>

        {/* Lokal spielen */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Lokal spielen</h3>
          <p className="text-sm text-gray-600 mb-4">
            Spiele zu zweit auf diesem Gerät
          </p>
          <button
            onClick={onPlayLocal}
            className="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Lokal spielen
          </button>
        </div>
      </div>

      {/* Spielregeln */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg">
        <h3 className="font-bold mb-2 text-sm">📖 Spielregeln:</h3>
        <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
          <li>Jeder Stein hat 4 Eigenschaften: Farbe, Höhe, Form, Oberseite</li>
          <li>Spieler wählen abwechselnd Steine für den Gegner</li>
          <li>Gewinner: 4 Steine mit gemeinsamer Eigenschaft in einer Reihe</li>
        </ul>
      </div>
    </div>
  );
};

