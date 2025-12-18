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
      <div className="p-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 text-yellow-900">
          <div className="animate-spin text-2xl">🔄</div>
          <span className="font-bold text-lg">Verbinde mit Server...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-4 bg-gradient-to-r from-orange-400/20 to-red-400/20 backdrop-blur-sm border-2 border-orange-400/50 rounded-xl shadow-lg">
        <div className="text-orange-900">
          <div className="flex items-center gap-3 font-bold text-lg mb-2">
            <div className="animate-pulse text-2xl">⚠️</div>
            <span>Verbindung instabil</span>
          </div>
          <div className="text-sm font-medium">
            {error || 'Versuche automatisch wiederherzustellen...'} Das Spiel läuft im Fallback-Modus weiter.
          </div>
        </div>
      </div>
    );
  }

  if (status === 'connected' && waitingForPlayer) {
    return (
      <div className="p-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-sm border-2 border-blue-400/50 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 text-blue-900">
          <div className="animate-pulse text-2xl">⏳</div>
          <span className="font-bold text-lg">Warte auf zweiten Spieler...</span>
        </div>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="p-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm border-2 border-green-400/50 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 text-green-900 font-bold">
          <span className="text-xl">✅</span>
          <span>Echtzeit-Verbindung aktiv</span>
        </div>
      </div>
    );
  }

  return null;
};
