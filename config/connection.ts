// Konfiguration für SSE-Verbindungsparameter
// Hier können alle Timeouts und Intervalle zentral angepasst werden

export const CONNECTION_CONFIG = {
  // Heartbeat-Intervall (Server sendet alle X ms ein Keepalive-Signal)
  HEARTBEAT_INTERVAL: 3000, // 3 Sekunden
  
  // Fallback-Polling-Intervall (Client prüft alle X ms ob State aktuell ist)
  FALLBACK_POLL_INTERVAL: 2000, // 2 Sekunden
  
  // Timeout bevor Fallback greift (wenn länger als X ms keine SSE-Nachricht)
  FALLBACK_TIMEOUT: 8000, // 8 Sekunden
  
  // Maximale Reconnect-Versuche
  MAX_RECONNECT_ATTEMPTS: 50,
  
  // Initiales Reconnect-Delay (wird mit exponential backoff erhöht)
  INITIAL_RECONNECT_DELAY: 500, // 500ms
  
  // Maximales Reconnect-Delay
  MAX_RECONNECT_DELAY: 3000, // 3 Sekunden
  
  // Exponential Backoff Faktor
  BACKOFF_FACTOR: 1.5,
  
  // Minimale Zeit zwischen Updates (Debouncing)
  MIN_UPDATE_INTERVAL: 100, // 100ms
  
  // Tab-Visibility-Check: Zeit nach der eine Reconnect erzwungen wird wenn Tab wieder sichtbar
  VISIBILITY_RECONNECT_THRESHOLD: 10000, // 10 Sekunden
} as const;
