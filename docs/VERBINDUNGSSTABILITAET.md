# Verbindungsstabilität - Implementierte Verbesserungen

## Übersicht

Das Quarto-Multiplayer-Spiel nutzt Server-Sent Events (SSE) für Echtzeit-Kommunikation. Um maximale Stabilität zu gewährleisten, wurden mehrere Mechanismen implementiert.

## Implementierte Stabilitätsfeatures

### 1. **Mehrschichtiges Fallback-System**

- **Primär**: SSE-Verbindung für Echtzeit-Updates
- **Sekundär**: Automatisches Polling wenn SSE ausfällt (alle 3 Sekunden)
- **Tertiär**: Manuelle State-Synchronisation bei Reconnect

### 2. **Intelligentes Reconnect-Management**

- **Exponential Backoff**: Wartezeit zwischen Reconnects erhöht sich graduell (1s → 1.5s → 2.25s → ... → max 30s)
- **Unbegrenzte Versuche**: System gibt niemals auf, versucht immer wieder zu verbinden
- **Doppel-Reconnect-Schutz**: Verhindert mehrfache gleichzeitige Reconnect-Versuche

### 3. **Aktive Verbindungsüberwachung**

- **Heartbeat**: Server sendet alle 15 Sekunden ein Keepalive-Signal
- **Connection Check**: Client prüft alle 5 Sekunden den Verbindungsstatus
- **Timeout Detection**: Erkennt tote Verbindungen nach 25 Sekunden ohne Signal

### 4. **Browser-Event-Handling**

- **Tab Visibility**: Reconnect wenn Tab wieder aktiv wird (nach 5s Inaktivität)
- **Online/Offline Events**: Sofortiger Reconnect wenn Internetverbindung zurückkehrt
- **Page Visibility API**: Optimiert Ressourcennutzung bei inaktiven Tabs

### 5. **State-Synchronisation**

- **Optimistic Updates**: UI aktualisiert sofort, Server-Sync läuft im Hintergrund
- **Automatic Rollback**: Bei Fehlern wird zum vorherigen State zurückgekehrt
- **Post-Reconnect Sync**: Nach jedem Reconnect wird der State neu geladen

### 6. **Server-Optimierungen**

- **Lange Timeouts**: Keep-Alive für 600 Sekunden (10 Minuten)
- **No-Buffering Headers**: Verhindert Proxy/Load-Balancer-Buffering
- **Chunked Transfer**: Ermöglicht kontinuierliche Datenübertragung

## Konfigurierbare Parameter

Alle Timing-Parameter können in `config/connection.ts` angepasst werden:

```typescript
export const CONNECTION_CONFIG = {
  HEARTBEAT_INTERVAL: 15000,           // Server-Heartbeat
  FALLBACK_POLL_INTERVAL: 3000,        // Fallback-Polling
  FALLBACK_TIMEOUT: 25000,             // Timeout für SSE
  MAX_RECONNECT_ATTEMPTS: Infinity,    // Unbegrenzte Versuche
  INITIAL_RECONNECT_DELAY: 1000,       // Erste Wartezeit
  MAX_RECONNECT_DELAY: 30000,          // Maximale Wartezeit
  BACKOFF_FACTOR: 1.5,                 // Exponentieller Faktor
  MIN_UPDATE_INTERVAL: 100,            // Debouncing
  VISIBILITY_RECONNECT_THRESHOLD: 5000,// Tab-Visibility
  CONNECTION_TIMEOUT: 10000,           // Verbindungsaufbau
  CONNECTION_CHECK_INTERVAL: 5000,     // Aktive Prüfung
}
```

## Debugging

### Console-Logs

Das System gibt detaillierte Logs aus:

- `[SSE]` - SSE-Verbindungsstatus
- `[FALLBACK]` - Fallback-Polling-Aktivitäten
- `[CONNECTION CHECK]` - Aktive Verbindungsprüfungen
- `[UPDATE]` - State-Updates
- `[VISIBILITY]` - Tab-Visibility-Events
- `[NETWORK]` - Online/Offline-Events

### Typische Log-Sequenz bei Verbindungsproblemen:

```
[SSE] ❌ Verbindungsfehler
[SSE] 🔄 Reconnect in 1s (Versuch 1/∞)
[FALLBACK] ⚠️ Keine SSE-Nachricht seit 25s, hole State manuell
[FALLBACK] ✅ State manuell aktualisiert
[SSE] ✅ Verbunden
[SSE] 🔄 State nach Verbindung synchronisiert
```

## Best Practices für Deployment

### 1. **Reverse Proxy (Nginx)**

```nginx
location /api/room/subscribe {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Connection '';
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 600s;
    chunked_transfer_encoding on;
}
```

### 2. **Vercel/Serverless**

⚠️ **Wichtig**: SSE funktioniert nur mit Node.js Runtime, nicht mit Edge Runtime!

```typescript
// In route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

### 3. **Load Balancer**

- Aktiviere "Sticky Sessions" für konsistente Verbindungen
- Erhöhe Timeout-Werte auf mindestens 600 Sekunden
- Deaktiviere Response-Buffering für SSE-Endpoints

### 4. **Firewall/CDN**

- Cloudflare: Deaktiviere "Rocket Loader" für SSE-Endpoints
- Whitelist `/api/room/subscribe` von aggressivem Caching
- Erlaube lange HTTP-Verbindungen

## Troubleshooting

### Problem: Verbindung bricht nach 60 Sekunden ab

**Lösung**: Proxy/Load Balancer hat zu kurze Timeouts
- Erhöhe `proxy_read_timeout` in Nginx
- Prüfe Cloud-Provider-Limits (z.B. Vercel: 60s für Hobby-Plan)

### Problem: Keine Updates nach Tab-Wechsel

**Lösung**: Browser drosselt inaktive Tabs
- System erkennt dies automatisch und reconnected
- Fallback-Polling läuft auch bei inaktiven Tabs

### Problem: Verbindung instabil auf Mobilgeräten

**Lösung**: Mobile Browser haben aggressive Power-Management
- Fallback-Polling fängt dies ab
- System reconnected automatisch bei App-Aktivierung

### Problem: "Too many reconnect attempts"

**Lösung**: Server ist nicht erreichbar
- Prüfe Server-Logs
- Prüfe Netzwerk-Konnektivität
- System versucht weiter im Hintergrund

## Performance-Überlegungen

### Netzwerk-Traffic

- **Heartbeat**: ~10 Bytes alle 15 Sekunden = ~2.4 KB/Stunde
- **Fallback-Polling**: Nur aktiv wenn SSE ausfällt
- **State-Updates**: Nur bei tatsächlichen Spielzügen

### Ressourcennutzung

- **Client**: Minimal, nur Event-Listener
- **Server**: Eine offene Verbindung pro Spieler
- **Memory**: ~1-2 KB pro Verbindung

## Zukünftige Verbesserungen

Mögliche weitere Optimierungen:

1. **WebSocket-Fallback**: Bei SSE-Problemen auf WebSockets wechseln
2. **Service Worker**: Offline-Fähigkeit mit Background Sync
3. **IndexedDB**: Lokales Caching des Game States
4. **WebRTC**: Peer-to-Peer für ultra-niedrige Latenz
5. **Compression**: Gzip/Brotli für State-Updates

## Zusammenfassung

Das System ist jetzt hochgradig resilient gegen:

✅ Netzwerkunterbrechungen
✅ Server-Neustarts
✅ Proxy/Load-Balancer-Timeouts
✅ Browser-Tab-Wechsel
✅ Mobile Netzwerk-Wechsel (WiFi ↔ 4G)
✅ Temporäre Verbindungsprobleme

Das Spiel sollte praktisch immer spielbar bleiben, auch bei instabilen Verbindungen!
