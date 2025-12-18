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

// Performance Dashboard wird als separate Komponente exportiert
// Siehe components/PerformanceDashboard.tsx
