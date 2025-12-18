import React from 'react';

type ConnectionStatusProps = {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  error?: string | null;
  waitingForPlayer?: boolean;
};

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  status, 
  error,
  waitingForPlayer 
}) => {
  if (status === 'connecting') {
    return (
      <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg text-sm shadow-sm">
        <div className="flex items-center gap-2 text-amber-800 font-medium">
          <div className="animate-spin">⟳</div>
          <span>Verbinde mit Server...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-300 rounded-lg text-sm shadow-sm">
        <div className="text-red-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <span>⚠️</span>
            <span>Verbindung instabil</span>
          </div>
          <div className="text-xs text-red-800">
            {error || 'Versuche automatisch wiederherzustellen...'} Das Spiel läuft im Fallback-Modus weiter.
          </div>
        </div>
      </div>
    );
  }

  if (status === 'connected' && waitingForPlayer) {
    return (
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-sm shadow-sm">
        <div className="flex items-center gap-2 text-indigo-800 font-medium">
          <span>⏳</span>
          <span>Warte auf zweiten Spieler...</span>
        </div>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg text-xs shadow-sm">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold">
          <span>✓</span>
          <span>Verbunden</span>
        </div>
      </div>
    );
  }

  return null;
};
