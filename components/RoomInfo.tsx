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
    <div className="mb-6 p-4 bg-slate-50 rounded border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-slate-600 mb-1 font-medium">
            Raumcode
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-800 tracking-wider">
              {playerInfo.roomId}
            </span>
            <button
              onClick={copyRoomId}
              className="px-2.5 py-1 bg-slate-700 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors"
            >
              {copied ? '✓ Kopiert' : 'Kopieren'}
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-600 mb-1 font-medium">
            Du bist
          </div>
          <div className="text-lg font-bold text-slate-800">
            Spieler {playerInfo.playerNumber}
          </div>
        </div>
      </div>

      {waitingForPlayer && (
        <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded text-center">
          <div className="text-amber-800 font-medium text-sm">
            Warte auf Spieler 2...
          </div>
          <div className="text-xs text-amber-700 mt-0.5">
            Teile den Raumcode mit einem Freund
          </div>
        </div>
      )}

      <button
        onClick={onLeaveRoom}
        className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors text-sm"
      >
        Raum verlassen
      </button>
    </div>
  );
};

