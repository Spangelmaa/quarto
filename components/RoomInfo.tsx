import React, { useState } from 'react';
import { PlayerInfo } from '@/types/multiplayer';

type RoomInfoProps = {
  playerInfo: PlayerInfo;
  waitingForPlayer: boolean;
  onLeaveRoom: () => void;
};

export const RoomInfo: React.FC<RoomInfoProps> = ({
  playerInfo,
  waitingForPlayer,
  onLeaveRoom,
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    navigator.clipboard.writeText(playerInfo.roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-400/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-700 font-medium mb-1 flex items-center gap-2">
            <span className="text-lg">🔑</span>
            Raumcode:
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wider">
              {playerInfo.roomId}
            </span>
            <button
              onClick={copyRoomId}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
            >
              {copied ? '✓ Kopiert!' : '📋 Kopieren'}
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-700 font-medium mb-1 flex items-center justify-end gap-2">
            <span className="text-lg">👤</span>
            Du bist:
          </div>
          <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Spieler {playerInfo.playerNumber}
          </div>
        </div>
      </div>

      {waitingForPlayer && (
        <div className="mb-4 p-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-xl text-center shadow-lg">
          <div className="animate-pulse text-yellow-900 font-bold text-lg flex items-center justify-center gap-2">
            <span className="text-2xl">⏳</span>
            Warte auf Spieler 2...
          </div>
          <div className="text-sm text-yellow-800 mt-2 font-medium">
            Teile den Raumcode mit einem Freund
          </div>
        </div>
      )}

      <button
        onClick={onLeaveRoom}
        className="w-full px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
      >
        🚪 Raum verlassen
      </button>
    </div>
  );
};

