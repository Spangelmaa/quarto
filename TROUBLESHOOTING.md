# Troubleshooting - Verbindungsprobleme

## Häufige Probleme und Lösungen

### Problem: "Verbindung verloren" nach wenigen Sekunden

**Ursache**: Vercel Free Tier hat 10s Function Timeout

**Lösung**:
1. Upgrade zu Vercel Pro (längere Timeouts)
2. ODER: Die Fallback-Mechanik läuft automatisch weiter (Spiel funktioniert trotzdem)
3. ODER: Nutze separaten WebSocket-Service (Pusher, Ably, etc.)

### Problem: Verbindung bricht auf Mobile-Geräten ab

**Ursache**: Aggressive Power-Saving-Modi auf Smartphones

**Lösung**:
- Tab aktiv lassen (nicht in Hintergrund)
- Die Tab-Visibility-Detection reconnected automatisch
- Fallback-Polling läuft als Sicherheitsnetz

### Problem: Updates kommen verzögert an

**Ursache**: SSE-Verbindung instabil oder Fallback aktiv

**Prüfe**:
1. Öffne Browser Console (F12)
2. Suche nach `[FALLBACK]` Logs - wenn sichtbar, läuft Fallback
3. Suche nach `[SSE] 💓 Heartbeat` - sollte alle 3s erscheinen

**Lösung**:
- Wenn Fallback aktiv: Normal, Spiel läuft trotzdem
- Wenn keine Heartbeats: Netzwerk-Problem oder Server-Issue

### Problem: "Warte auf Spieler 2" obwohl Spieler beigetreten ist

**Ursache**: State-Synchronisation fehlgeschlagen

**Lösung**:
1. Beide Spieler: Seite neu laden (F5)
2. Room-Code erneut eingeben
3. Falls weiterhin Problem: Neuen Room erstellen

### Problem: Nach Tab-Wechsel reagiert Spiel nicht

**Ursache**: Browser hat Verbindung unterbrochen

**Lösung**:
- Warte 5-10 Sekunden - automatischer Reconnect
- Falls nicht: Seite neu laden (F5)
- PlayerInfo bleibt in localStorage erhalten

## Performance-Optimierungen

### Für langsame Verbindungen

In `config/connection.ts`:

```typescript
export const CONNECTION_CONFIG = {
  HEARTBEAT_INTERVAL: 2000,        // Häufiger (von 3000)
  FALLBACK_TIMEOUT: 5000,          // Schneller (von 8000)
  FALLBACK_POLL_INTERVAL: 3000,    // Weniger häufig (von 2000)
  // ... rest
}
```

### Für schnelle Verbindungen

In `config/connection.ts`:

```typescript
export const CONNECTION_CONFIG = {
  HEARTBEAT_INTERVAL: 5000,        // Weniger häufig (von 3000)
  FALLBACK_TIMEOUT: 12000,         // Geduldiger (von 8000)
  FALLBACK_POLL_INTERVAL: 5000,    // Weniger häufig (von 2000)
  // ... rest
}
```

## Debug-Modus aktivieren

Browser Console zeigt automatisch Debug-Logs:

- `[SSE]` - Server-Sent Events Status
- `[FALLBACK]` - Fallback-Polling Status
- `[NETWORK]` - Netzwerk-Events
- `[VISIBILITY]` - Tab-Sichtbarkeit
- `[UPDATE]` - State-Updates
- `[CLICK HANDLER]` - Benutzer-Aktionen

## Häufig gestellte Fragen

### Warum sehe ich manchmal "SSE instabil. Spiel läuft im Fallback-Polling-Modus"?

Das ist normal! Es bedeutet:
- SSE kann keine dauerhafte Verbindung halten
- Fallback-Polling übernimmt (alle 2 Sekunden)
- **Spiel funktioniert trotzdem normal**
- Nur minimal verzögerte Updates (2s statt Echtzeit)

### Funktioniert das Spiel auch komplett ohne SSE?

Ja! Die Fallback-Mechanik sorgt dafür, dass das Spiel immer funktioniert:
1. Primary: SSE für Echtzeit-Updates
2. Fallback: HTTP-Polling alle 2 Sekunden
3. Manual: Spieler kann jederzeit manuell aktualisieren

### Welche Browser werden unterstützt?

- ✅ Chrome/Edge (Chromium) - Vollständig
- ✅ Firefox - Vollständig
- ✅ Safari - Mit Einschränkungen (Fallback häufiger aktiv)
- ⚠️ IE/Old Edge - Nicht getestet

### Kann ich die Verbindung manuell testen?

Ja! Browser Console:

```javascript
// Prüfe SSE ReadyState
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
console.log(window.eventSource?.readyState)

// Force Reconnect (nur für Testing!)
localStorage.removeItem('playerInfo')
location.reload()
```

## Bekannte Bugs

Keine bekannten kritischen Bugs. Bei Problemen:

1. Prüfe Browser Console auf Error-Logs
2. Teste mit anderem Browser
3. Prüfe Netzwerk-Verbindung (z.B. `ping google.com`)
4. Bei Vercel: Prüfe Function-Logs im Dashboard

## Support

Bei weiteren Problemen:
- Öffne ein GitHub Issue mit Console-Logs
- Beschreibe Schritte zur Reproduktion
- Gib Browser + OS Version an
