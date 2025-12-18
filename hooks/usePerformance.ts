'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook für Performance-Monitoring
 * Misst Render-Zeiten und identifiziert Performance-Probleme
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} - Render #${renderCount.current} (${timeSinceLastRender}ms seit letztem Render)`);
    }

    // Warnung bei zu häufigen Renders
    if (renderCount.current > 10 && timeSinceLastRender < 100) {
      console.warn(`[Performance] ⚠️ ${componentName} rendert sehr häufig! Optimierung empfohlen.`);
    }
  });

  return {
    renderCount: renderCount.current,
  };
}

/**
 * Hook für Netzwerk-Performance-Monitoring
 */
export function useNetworkPerformance() {
  const [metrics, setMetrics] = useState({
    averageLatency: 0,
    requestCount: 0,
    failedRequests: 0,
  });

  const latencies = useRef<number[]>([]);

  const trackRequest = (startTime: number, success: boolean) => {
    const latency = Date.now() - startTime;
    latencies.current.push(latency);

    // Behalte nur die letzten 20 Requests
    if (latencies.current.length > 20) {
      latencies.current.shift();
    }

    const avgLatency = latencies.current.reduce((a, b) => a + b, 0) / latencies.current.length;

    setMetrics((prev) => ({
      averageLatency: Math.round(avgLatency),
      requestCount: prev.requestCount + 1,
      failedRequests: success ? prev.failedRequests : prev.failedRequests + 1,
    }));
  };

  return {
    metrics,
    trackRequest,
  };
}

/**
 * Hook für FPS-Monitoring (Frames per Second)
 */
export function useFPSMonitor() {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const measureFPS = (currentTime: number) => {
      frameCount.current++;
      
      const deltaTime = currentTime - lastTime.current;
      
      // Update FPS jede Sekunde
      if (deltaTime >= 1000) {
        const currentFPS = Math.round((frameCount.current * 1000) / deltaTime);
        setFps(currentFPS);
        
        if (currentFPS < 30) {
          console.warn('[Performance] ⚠️ Niedrige FPS erkannt:', currentFPS);
        }
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return fps;
}

/**
 * Hook für Memory-Monitoring
 * Funktioniert nur in Browsern die die Memory API unterstützen
 */
export function useMemoryMonitor() {
  const [memory, setMemory] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    // @ts-ignore - performance.memory ist nicht in allen Browsern verfügbar
    if (!performance.memory) {
      return;
    }

    const checkMemory = () => {
      // @ts-ignore
      const mem = performance.memory;
      setMemory({
        usedJSHeapSize: Math.round(mem.usedJSHeapSize / 1048576), // in MB
        totalJSHeapSize: Math.round(mem.totalJSHeapSize / 1048576),
        jsHeapSizeLimit: Math.round(mem.jsHeapSizeLimit / 1048576),
      });

      // Warnung bei hoher Memory-Nutzung
      if (mem.usedJSHeapSize / mem.jsHeapSizeLimit > 0.9) {
        console.warn('[Performance] ⚠️ Hohe Memory-Nutzung!', {
          used: Math.round(mem.usedJSHeapSize / 1048576) + 'MB',
          limit: Math.round(mem.jsHeapSizeLimit / 1048576) + 'MB',
        });
      }
    };

    // Check alle 5 Sekunden
    const interval = setInterval(checkMemory, 5000);
    checkMemory();

    return () => clearInterval(interval);
  }, []);

  return memory;
}

/**
 * Performance Dashboard Component
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
