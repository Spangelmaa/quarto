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
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-800">
          <div className="animate-spin">🔄</div>
          <span className="font-medium">Verbinde mit Server...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-3 bg-orange-50 border border-orange-300 rounded-lg">
        <div className="text-orange-800">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <div className="animate-pulse">⚠️</div>
            <span>Verbindung instabil</span>
          </div>
          <div className="text-sm">
            {error || 'Versuche automatisch wiederherzustellen...'} Das Spiel läuft im Fallback-Modus weiter.
          </div>
        </div>
      </div>
    );
  }

  if (status === 'connected' && waitingForPlayer) {
    return (
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <div className="animate-pulse">⏳</div>
          <span className="font-medium">Warte auf zweiten Spieler...</span>
        </div>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800 text-sm">
          <span>✅</span>
          <span>Echtzeit-Verbindung aktiv</span>
        </div>
      </div>
    );
  }

  return null;
};
