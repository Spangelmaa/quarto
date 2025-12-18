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
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-slate-600 mb-1">
            Raumcode:
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600 tracking-wider">
              {playerInfo.roomId}
            </span>
            <button
              onClick={copyRoomId}
              className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors"
            >
              {copied ? '✓ Kopiert' : 'Kopieren'}
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-600 mb-1">
            Du bist:
          </div>
          <div className="text-xl font-bold text-blue-600">
            Spieler {playerInfo.playerNumber}
          </div>
        </div>
      </div>

      {waitingForPlayer && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
          <div className="text-yellow-800 font-semibold">
            ⏳ Warte auf Spieler 2...
          </div>
          <div className="text-xs text-yellow-700 mt-1">
            Teile den Raumcode mit einem Freund
          </div>
        </div>
      )}

      <button
        onClick={onLeaveRoom}
        className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
      >
        Raum verlassen
      </button>
    </div>
  );
};

