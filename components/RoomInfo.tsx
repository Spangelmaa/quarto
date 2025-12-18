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
    <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-indigo-600 mb-1 font-semibold uppercase tracking-wide">
            Raumcode
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-indigo-900 tracking-wider">
              {playerInfo.roomId}
            </span>
            <button
              onClick={copyRoomId}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
              {copied ? '✓ Kopiert' : 'Kopieren'}
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-purple-600 mb-1 font-semibold uppercase tracking-wide">
            Du bist
          </div>
          <div className="text-xl font-bold text-purple-900">
            Spieler {playerInfo.playerNumber}
          </div>
        </div>
      </div>

      {waitingForPlayer && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-lg text-center">
          <div className="text-amber-900 font-semibold text-sm">
            ⏳ Warte auf Spieler 2...
          </div>
          <div className="text-xs text-amber-700 mt-1">
            Teile den Raumcode mit einem Freund
          </div>
        </div>
      )}

      <button
        onClick={onLeaveRoom}
        className="w-full px-4 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all text-sm shadow-sm"
      >
        Raum verlassen
      </button>
    </div>
  );
};

