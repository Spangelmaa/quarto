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
      <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-sm" title={`Verbindung: ${getQualityText(quality)}`}>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1 rounded-sm transition-all ${
                bar === 1 ? 'h-2' : bar === 2 ? 'h-3' : bar === 3 ? 'h-4' : 'h-5'
              } ${
                (quality === 'excellent' && bar <= 4) ||
                (quality === 'good' && bar <= 3) ||
                (quality === 'fair' && bar <= 2) ||
                (quality === 'poor' && bar <= 1)
                  ? getQualityColor(quality)
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
      <span className="text-sm">{getQualityIcon(quality)}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1.5 rounded-sm transition-all ${
              bar === 1 ? 'h-2' : bar === 2 ? 'h-3' : bar === 3 ? 'h-4' : 'h-5'
            } ${
              (quality === 'excellent' && bar <= 4) ||
              (quality === 'good' && bar <= 3) ||
              (quality === 'fair' && bar <= 2) ||
              (quality === 'poor' && bar <= 1)
                ? getQualityColor(quality)
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-slate-700">
        {getQualityText(quality)}
      </span>
    </div>
  );
};
