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
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">
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

      <div className="space-y-3">
        {/* Spiel erstellen */}
        <div className="p-4 bg-slate-50 rounded border border-slate-200">
          <h3 className="font-semibold text-base mb-1 text-slate-800">Neues Spiel erstellen</h3>
          <p className="text-xs text-slate-600 mb-3">
            Erstelle einen Raum und teile den Code mit einem Freund
          </p>
          <button
            onClick={onCreateRoom}
            disabled={isCreating}
            className="w-full px-4 py-2.5 bg-slate-700 text-white font-medium rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Erstelle Raum...' : 'Raum erstellen'}
          </button>
        </div>

        {/* Spiel beitreten */}
        <div className="p-4 bg-slate-50 rounded border border-slate-200">
          <h3 className="font-semibold text-base mb-1 text-slate-800">Einem Spiel beitreten</h3>
          <p className="text-xs text-slate-600 mb-3">
            Gib den 4-stelligen Raumcode ein
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              className="w-full px-4 py-2.5 border-2 border-slate-300 rounded focus:outline-none focus:border-slate-500 uppercase text-center text-lg font-bold text-slate-800"
            />
            <button
              onClick={handleJoinRoom}
              disabled={roomId.length !== 4}
              className="w-full px-4 py-2.5 bg-slate-700 text-white font-medium rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Beitreten
            </button>
          </div>
        </div>

        {/* Lokal spielen */}
        <div className="p-4 bg-slate-50 rounded border border-slate-200">
          <h3 className="font-semibold text-base mb-1 text-slate-800">Lokal spielen</h3>
          <p className="text-xs text-slate-600 mb-3">
            Spiele zu zweit auf diesem Gerät
          </p>
          <button
            onClick={onPlayLocal}
            className="w-full px-4 py-2.5 bg-slate-700 text-white font-medium rounded hover:bg-slate-800 transition-colors"
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

