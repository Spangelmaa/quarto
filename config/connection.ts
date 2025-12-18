// Konfiguration für SSE-Verbindungsparameter
// Hier können alle Timeouts und Intervalle zentral angepasst werden

export const CONNECTION_CONFIG = {
  // Heartbeat-Intervall (Server sendet alle X ms ein Keepalive-Signal)
  // Kürzeres Intervall für stabilere Verbindung
  HEARTBEAT_INTERVAL: 15000, // 15 Sekunden (Standard für SSE)
  
  // Fallback-Polling-Intervall (Client prüft alle X ms ob State aktuell ist)
  FALLBACK_POLL_INTERVAL: 3000, // 3 Sekunden
  
  // Timeout bevor Fallback greift (wenn länger als X ms keine SSE-Nachricht)
  FALLBACK_TIMEOUT: 25000, // 25 Sekunden (länger als Heartbeat)
  
  // Maximale Reconnect-Versuche (unbegrenzt für bessere Stabilität)
  MAX_RECONNECT_ATTEMPTS: Infinity,
  
  // Initiales Reconnect-Delay (wird mit exponential backoff erhöht)
  INITIAL_RECONNECT_DELAY: 1000, // 1 Sekunde
  
  // Maximales Reconnect-Delay
  MAX_RECONNECT_DELAY: 30000, // 30 Sekunden
  
  // Exponential Backoff Faktor
  BACKOFF_FACTOR: 1.5,
  
  // Minimale Zeit zwischen Updates (Debouncing)
  MIN_UPDATE_INTERVAL: 100, // 100ms
  
  // Tab-Visibility-Check: Zeit nach der eine Reconnect erzwungen wird wenn Tab wieder sichtbar
  VISIBILITY_RECONNECT_THRESHOLD: 5000, // 5 Sekunden
  
  // Maximale Zeit für SSE-Verbindungsaufbau
  CONNECTION_TIMEOUT: 10000, // 10 Sekunden
  
  // Intervall für aktive Verbindungsprüfung
  CONNECTION_CHECK_INTERVAL: 5000, // 5 Sekunden
} as const;
