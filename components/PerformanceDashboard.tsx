'use client';

import { useState } from 'react';
import { useFPSMonitor, useMemoryMonitor } from '@/hooks/usePerformance';

/**
 * Performance Dashboard Component
 * Zeigt Live-Performance-Metriken während der Entwicklung
 */
export function PerformanceDashboard() {
  const fps = useFPSMonitor();
  const memory = useMemoryMonitor();
  const [show, setShow] = useState(false);

  // Nur in Development anzeigen
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-gray-700 z-50"
        aria-label="Performance Dashboard"
      >
        {show ? '📊 ✕' : '📊'}
      </button>

      {show && (
        <div className="fixed bottom-16 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-50 font-mono text-xs space-y-2">
          <div className="font-bold border-b border-gray-700 pb-2 mb-2">
            Performance Monitor
          </div>
          
          <div>
            <span className="text-gray-400">FPS:</span>{' '}
            <span className={fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
              {fps}
            </span>
          </div>

          {memory && (
            <>
              <div>
                <span className="text-gray-400">Memory:</span>{' '}
                <span className="text-blue-400">{memory.usedJSHeapSize} MB</span>
              </div>
              <div>
                <span className="text-gray-400">Limit:</span>{' '}
                <span className="text-gray-300">{memory.jsHeapSizeLimit} MB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
