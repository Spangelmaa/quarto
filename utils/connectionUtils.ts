/**
 * Utility-Funktionen für Verbindungsstabilität
 */

/**
 * Prüft ob der Browser online ist
 */
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

/**
 * Prüft ob der Tab/Window sichtbar ist
 */
export const isTabVisible = (): boolean => {
  return typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;
};

/**
 * Wartet eine bestimmte Zeit (Promise-basiert)
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry-Logik mit exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    onRetry?: (attempt: number, error: any) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 5,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    onRetry,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts - 1) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffFactor, attempt),
          maxDelay
        );
        
        onRetry?.(attempt + 1, error);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Fetch mit Timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Prüft ob eine URL erreichbar ist
 */
export async function isUrlReachable(url: string, timeout = 5000): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(url, { 
      method: 'HEAD',
      timeout,
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Formatiert eine Zeitdauer in menschenlesbares Format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Debounce-Funktion
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle-Funktion
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Prüft die Verbindungsqualität basierend auf Latenz
 */
export async function checkConnectionQuality(url: string): Promise<{
  latency: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'offline';
}> {
  try {
    const start = Date.now();
    await fetchWithTimeout(url, { method: 'HEAD', timeout: 5000 });
    const latency = Date.now() - start;

    let quality: 'excellent' | 'good' | 'fair' | 'poor' | 'offline';
    if (latency < 100) {
      quality = 'excellent';
    } else if (latency < 300) {
      quality = 'good';
    } else if (latency < 1000) {
      quality = 'fair';
    } else {
      quality = 'poor';
    }

    return { latency, quality };
  } catch {
    return { latency: -1, quality: 'offline' };
  }
}

/**
 * Erstellt einen eindeutigen Client-Identifier
 */
export function generateClientId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Speichert Daten in localStorage mit Fehlerbehandlung
 */
export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('LocalStorage set error:', error);
    return false;
  }
}

/**
 * Liest Daten aus localStorage mit Fehlerbehandlung
 */
export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('LocalStorage get error:', error);
    return defaultValue;
  }
}

/**
 * Entfernt Daten aus localStorage mit Fehlerbehandlung
 */
export function safeLocalStorageRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('LocalStorage remove error:', error);
    return false;
  }
}
