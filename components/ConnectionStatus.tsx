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
      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="animate-spin">⟳</div>
          <span>Verbinde mit Server...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-2.5 bg-red-50 border border-red-200 rounded text-sm">
        <div className="text-red-800">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <span>⚠</span>
            <span>Verbindung instabil</span>
          </div>
          <div className="text-xs">
            {error || 'Versuche automatisch wiederherzustellen...'} Das Spiel läuft im Fallback-Modus weiter.
          </div>
        </div>
      </div>
    );
  }

  if (status === 'connected' && waitingForPlayer) {
    return (
      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <span>⏳</span>
          <span>Warte auf zweiten Spieler...</span>
        </div>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs">
        <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
          <span>✓</span>
          <span>Verbunden</span>
        </div>
      </div>
    );
  }

  return null;
};
