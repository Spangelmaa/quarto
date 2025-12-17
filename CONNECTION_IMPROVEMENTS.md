# Verbesserungen der Serververbindung

## Zusammenfassung

Diese Änderungen verbessern die Stabilität der SSE (Server-Sent Events) Verbindung erheblich, besonders bei instabilen Netzwerken oder beim Deployment auf Vercel.

## Implementierte Verbesserungen

### 1. **Aggressiveres Heartbeat (3s statt 5s)**
- **Datei**: `app/api/room/subscribe/route.ts`
- **Was**: Heartbeat-Intervall von 5 auf 3 Sekunden reduziert
- **Warum**: Vercel und andere Hosting-Plattformen haben aggressive Timeouts. Häufigere Heartbeats verhindern, dass die Verbindung als "idle" geschlossen wird.

### 2. **Schnellerer Fallback (8s statt 12s)**
- **Datei**: `hooks/useMultiplayerSSE.ts`
- **Was**: Fallback-Timeout von 12 auf 8 Sekunden reduziert
- **Warum**: Wenn SSE nicht funktioniert, wird schneller auf HTTP-Polling umgeschaltet, sodass das Spiel weiterläuft.

### 3. **Netzwerk-Event-Listener**
- **Datei**: `hooks/useMultiplayerSSE.ts`
- **Was**: Reagiert auf `online`/`offline` Browser-Events
- **Warum**: Wenn die Internetverbindung verloren geht und wiederkommt, wird automatisch reconnected.

### 4. **Tab-Sichtbarkeits-Erkennung**
- **Datei**: `hooks/useMultiplayerSSE.ts`
- **Was**: Erkennt, wenn der Browser-Tab wieder aktiv wird
- **Warum**: Browser drosseln inaktive Tabs. Wenn der Tab wieder aktiv wird, prüfen wir die Verbindung und reconnecten bei Bedarf.

### 5. **Verbesserte Tote-Verbindungen-Bereinigung**
- **Datei**: `lib/sseConnections.ts`
- **Was**: Besseres Logging und automatisches Aufräumen toter Verbindungen
- **Warum**: Verhindert Memory Leaks und stellt sicher, dass nur aktive Verbindungen in der Map bleiben.

### 6. **Zusätzlicher Response-Header**
- **Datei**: `app/api/room/subscribe/route.ts`
- **Was**: `X-Content-Type-Options: nosniff` Header hinzugefügt
- **Warum**: Verhindert Buffering durch Proxies und Load Balancer, die SSE-Streams behindern können.

### 7. **Zentrale Konfiguration**
- **Datei**: `config/connection.ts` (NEU)
- **Was**: Alle Timeout- und Intervall-Werte an einem Ort
- **Warum**: Einfache Anpassung aller Connection-Parameter ohne Code-Änderungen in mehreren Dateien.

## Konfigurationsoptionen

In `config/connection.ts` kannst du folgende Werte anpassen:

```typescript
HEARTBEAT_INTERVAL: 3000          // Wie oft sendet Server Heartbeats
FALLBACK_POLL_INTERVAL: 2000      // Wie oft prüft Client ob State aktuell ist
FALLBACK_TIMEOUT: 8000            // Nach wie vielen ms greift Fallback
MAX_RECONNECT_ATTEMPTS: 50        // Maximale Reconnect-Versuche
INITIAL_RECONNECT_DELAY: 500      // Initiales Reconnect-Delay
MAX_RECONNECT_DELAY: 3000         // Maximales Reconnect-Delay
BACKOFF_FACTOR: 1.5               // Exponential Backoff Faktor
MIN_UPDATE_INTERVAL: 100          // Minimale Zeit zwischen Updates
VISIBILITY_RECONNECT_THRESHOLD: 10000  // Reconnect-Schwelle bei Tab-Aktivierung
```

## Wie die Verbindung jetzt funktioniert

### Normal-Betrieb (SSE funktioniert)
1. Server sendet alle 3s einen Heartbeat
2. Client empfängt State-Updates in Echtzeit via SSE
3. Fallback-Polling läuft im Hintergrund, greift aber nicht ein

### Degraded-Betrieb (SSE instabil)
1. Wenn 8s keine SSE-Nachricht: Fallback holt State per HTTP (alle 2s)
2. Client zeigt weiter "connected" Status (Spiel läuft normal)
3. SSE versucht automatisch zu reconnecten (bis zu 50 Versuche)
4. Wenn SSE wieder funktioniert: Fallback stoppt automatisch

### Offline → Online
1. Browser erkennt Netzwerk-Wiederherstellung
2. Automatischer SSE-Reconnect
3. Fallback läuft als Sicherheitsnetz

### Tab inaktiv → aktiv
1. Wenn Tab wieder sichtbar: Prüfe Verbindung
2. Falls tot (>10s keine Nachricht): Erzwinge Reconnect
3. Hole aktuellen State

## Weitere Optimierungsmöglichkeiten

Wenn die Verbindung immer noch instabil ist, kannst du:

1. **Heartbeat noch aggressiver machen** (z.B. 2s statt 3s)
   - In `config/connection.ts`: `HEARTBEAT_INTERVAL: 2000`

2. **Fallback schneller aktivieren** (z.B. 5s statt 8s)
   - In `config/connection.ts`: `FALLBACK_TIMEOUT: 5000`

3. **Vercel-spezifische Einstellungen** (wenn du Vercel nutzt)
   - Erwäge Vercel Pro für längere Function-Timeouts
   - Oder nutze eine separate WebSocket-Lösung (z.B. Pusher, Ably)

4. **Alternative: WebSockets**
   - SSE ist unidirektional (Server → Client)
   - WebSockets sind bidirektional und oft stabiler
   - Aber: Komplexer zu implementieren

## Testing

Teste die Verbesserungen mit:

1. **Schlechte Verbindung simulieren**
   - Chrome DevTools → Network → Slow 3G
   
2. **Tab-Wechsel**
   - Wechsle zu anderem Tab für 30+ Sekunden
   - Zurück zum Spiel-Tab → sollte reconnecten

3. **Flugmodus**
   - Aktiviere Flugmodus
   - Deaktiviere Flugmodus → sollte automatisch reconnecten

4. **Vercel-Deployment**
   - Teste auf echter Vercel-Instanz
   - Achte auf Console-Logs für SSE-Status

## Monitoring

Wichtige Console-Logs:

- `[SSE] 🔌 Verbunden` - SSE erfolgreich verbunden
- `[SSE] 💓 Heartbeat gesendet` - Server sendet Keepalive
- `[SSE] 📥 Update erhalten` - State-Update empfangen
- `[FALLBACK] ⚠️ Keine SSE-Nachricht seit Xs` - Fallback aktiv
- `[SSE] 🔄 Reconnect in Xms` - Reconnect-Versuch
- `[NETWORK] Wieder online` - Netzwerk wiederhergestellt
- `[VISIBILITY] Tab wieder sichtbar` - Tab aktiviert

## Bekannte Limitierungen

- **Vercel Free Tier**: Functions haben 10s Timeout (dann stirbt SSE)
  - Lösung: Vercel Pro oder alternative Hosting-Lösung
  
- **Safari auf iOS**: Kann SSE bei schwacher Verbindung schließen
  - Lösung: Fallback-Polling fängt das ab

- **Mobile Browser**: Aggressive Power-Saving
  - Lösung: Tab-Visibility-Detection reconnected automatisch
