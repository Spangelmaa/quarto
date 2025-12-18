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
    <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-indigo-700 mb-1 font-medium">
            Raumcode:
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600 tracking-wider">
              {playerInfo.roomId}
            </span>
            <button
              onClick={copyRoomId}
              className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
              {copied ? '✓ Kopiert' : 'Kopieren'}
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-purple-700 mb-1 font-medium">
            Du bist:
          </div>
          <div className="text-xl font-bold text-purple-600">
            Spieler {playerInfo.playerNumber}
          </div>
        </div>
      </div>

      {waitingForPlayer && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <div className="text-amber-800 font-semibold">
            ⏳ Warte auf Spieler 2...
          </div>
          <div className="text-xs text-amber-700 mt-1">
            Teile den Raumcode mit einem Freund
          </div>
        </div>
      )}

      <button
        onClick={onLeaveRoom}
        className="w-full px-4 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-all shadow-sm"
      >
        Raum verlassen
      </button>
    </div>
  );
};

