'use client';

// Client Component wegen onClick und ConnectionQualityIndicator

import { ConnectionQualityIndicator } from './ConnectionQualityIndicator';

interface GameHeaderProps {
  gameMode?: 'local' | 'online' | 'lobby';
  connectionStatus?: 'disconnected' | 'connecting' | 'connected' | 'error';
  onBackToLobby?: () => void;
}

export function GameHeader({ gameMode, connectionStatus, onBackToLobby }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-900">
          🎲 Quarto
        </h1>
        {gameMode === 'online' && connectionStatus && (
          <ConnectionQualityIndicator status={connectionStatus} compact />
        )}
      </div>
      
      {gameMode === 'local' && onBackToLobby && (
        <button
          onClick={onBackToLobby}
          className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          ← Zurück zur Lobby
        </button>
      )}
    </div>
  );
}
