'use client';

import React, { useState, useEffect } from 'react';

type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'offline';

interface ConnectionQualityIndicatorProps {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  compact?: boolean;
}

export const ConnectionQualityIndicator: React.FC<ConnectionQualityIndicatorProps> = ({ 
  status,
  compact = false 
}) => {
  const [quality, setQuality] = useState<ConnectionQuality>('good');
  const [lastPingTime, setLastPingTime] = useState<number>(0);

  useEffect(() => {
    // Simuliere Verbindungsqualität basierend auf Status
    if (status === 'connected') {
      setQuality('excellent');
    } else if (status === 'connecting') {
      setQuality('fair');
    } else if (status === 'error') {
      setQuality('poor');
    } else {
      setQuality('offline');
    }
  }, [status]);

  const getQualityColor = (q: ConnectionQuality): string => {
    switch (q) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-green-400';
      case 'fair': return 'bg-yellow-400';
      case 'poor': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
    }
  };

  const getQualityText = (q: ConnectionQuality): string => {
    switch (q) {
      case 'excellent': return 'Ausgezeichnet';
      case 'good': return 'Gut';
      case 'fair': return 'Mittel';
      case 'poor': return 'Schlecht';
      case 'offline': return 'Offline';
    }
  };

  const getQualityIcon = (q: ConnectionQuality): string => {
    switch (q) {
      case 'excellent': return '📶';
      case 'good': return '📶';
      case 'fair': return '📡';
      case 'poor': return '⚠️';
      case 'offline': return '❌';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-white/30 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg" title={`Verbindung: ${getQualityText(quality)}`}>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1.5 rounded-full transition-all ${
                bar === 1 ? 'h-2' : bar === 2 ? 'h-3' : bar === 3 ? 'h-4' : 'h-5'
              } ${
                (quality === 'excellent' && bar <= 4) ||
                (quality === 'good' && bar <= 3) ||
                (quality === 'fair' && bar <= 2) ||
                (quality === 'poor' && bar <= 1)
                  ? getQualityColor(quality)
                  : 'bg-gray-400/50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40">
      <span className="text-lg">{getQualityIcon(quality)}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-2 rounded-full transition-all ${
              bar === 1 ? 'h-3' : bar === 2 ? 'h-4' : bar === 3 ? 'h-5' : 'h-6'
            } ${
              (quality === 'excellent' && bar <= 4) ||
              (quality === 'good' && bar <= 3) ||
              (quality === 'fair' && bar <= 2) ||
              (quality === 'poor' && bar <= 1)
                ? getQualityColor(quality)
                : 'bg-gray-400/50'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-gray-800">
        {getQualityText(quality)}
      </span>
    </div>
  );
};
