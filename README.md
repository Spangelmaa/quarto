# 🎲 Quarto - Strategiespiel

Ein interaktives Quarto-Spiel, gebaut mit Next.js, React und TypeScript.

## 🎮 Über Quarto

Quarto ist ein abstraktes Strategiespiel für zwei Spieler. Das Ziel ist es, vier Spielsteine mit mindestens einer gemeinsamen Eigenschaft in einer Reihe zu platzieren.

### Spielregeln

- Jeder Spielstein hat 4 verschiedene Eigenschaften:
  - **Farbe**: Hell oder Dunkel
  - **Höhe**: Groß oder Klein
  - **Form**: Quadratisch oder Rund
  - **Oberseite**: Hohl oder Gefüllt

- **Spielablauf**:
  1. Spieler 1 wählt einen Stein aus, den Spieler 2 platzieren muss
  2. Spieler 2 platziert den Stein auf dem Brett
  3. Spieler 2 wählt einen Stein für Spieler 1
  4. Dies wiederholt sich, bis ein Spieler gewinnt

- **Gewinnbedingung**: 
  - Vier Steine in einer Reihe (horizontal, vertikal oder diagonal)
  - Mit mindestens einer gemeinsamen Eigenschaft

## 🚀 Installation und Start

### Lokal entwickeln

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Production Build

```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start
```

## 📦 Deployment auf Vercel

### Option 1: Mit Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Im Projektverzeichnis deployen
vercel
```

### Option 2: Mit GitHub

1. Pushe den Code zu GitHub
2. Gehe zu [vercel.com](https://vercel.com)
3. Importiere dein GitHub Repository
4. Vercel erkennt automatisch Next.js und konfiguriert alles
5. Klicke auf "Deploy"

## 🛠️ Technologie-Stack

- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: React Komponenten
- **Deployment**: Vercel

## 📁 Projektstruktur

```
quarto/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes für Multiplayer
│   │   └── room/               # Raum-Management
│   │       ├── create/         # Raum erstellen
│   │       ├── join/           # Raum beitreten
│   │       ├── state/          # Spielzustand
│   │       └── subscribe/      # SSE-Verbindung (NEU!)
│   ├── page.tsx                # Hauptseite
│   ├── layout.tsx              # Root Layout
│   └── globals.css             # Globale Styles
├── components/                 # React Komponenten
│   ├── Board.tsx              # Spielbrett
│   ├── Piece.tsx              # Einzelner Spielstein
│   ├── PieceSelector.tsx      # Steinauswahl
│   ├── GameInfo.tsx           # Spielinformationen
│   ├── MultiplayerLobby.tsx   # Multiplayer-Lobby
│   ├── RoomInfo.tsx           # Raum-Informationen
│   ├── ConnectionStatus.tsx   # Verbindungsstatus (NEU!)
│   └── ConnectionQualityIndicator.tsx  # Signalstärke (NEU!)
├── hooks/                     # Custom React Hooks
│   └── useMultiplayerSSE.ts   # SSE-Multiplayer-Logik (NEU!)
├── types/                     # TypeScript Typen
│   ├── game.ts               # Spiel-Typen
│   └── multiplayer.ts        # Multiplayer-Typen
├── utils/                     # Hilfsfunktionen
│   ├── gameLogic.ts          # Spiellogik
│   └── connectionUtils.ts    # Verbindungs-Utilities (NEU!)
├── config/                    # Konfiguration
│   └── connection.ts         # Verbindungsparameter (NEU!)
├── lib/                       # Server-seitige Bibliotheken
│   ├── roomStorage.ts        # Raum-Speicher
│   └── sseConnections.ts     # SSE-Verbindungsverwaltung (NEU!)
├── docs/                      # Dokumentation (NEU!)
│   ├── VERBINDUNGSSTABILITAET.md  # Technische Docs
│   └── DEPLOYMENT_GUIDE.md        # Deployment-Anleitung
└── package.json               # Dependencies
```

## 🎯 Features

### Spielfunktionen
- ✅ Vollständige Quarto-Spiellogik
- ✅ **Online-Multiplayer**: Spiele mit Freunden auf verschiedenen Geräten
- ✅ **Lokaler Multiplayer**: Spiele zu zweit auf einem Gerät
- ✅ Interaktive Benutzeroberfläche
- ✅ Responsive Design für Mobile & Desktop
- ✅ Gewinn-Erkennung (alle Richtungen)
- ✅ Visuelle Darstellung der Spielsteine
- ✅ Raum-System mit 4-stelligen Codes
- ✅ Spielzustandsverwaltung
- ✅ Neustart-Funktion

### 🔌 Verbindungsstabilität (NEU!)
- ✅ **Echtzeit-Kommunikation** via Server-Sent Events (SSE)
- ✅ **Mehrschichtiges Fallback-System** (SSE → Polling → Manuelle Sync)
- ✅ **Automatische Wiederherstellung** bei Verbindungsproblemen
- ✅ **Unbegrenzte Reconnect-Versuche** mit Exponential Backoff
- ✅ **Aktive Verbindungsüberwachung** alle 5 Sekunden
- ✅ **Tab-Visibility-Integration** (Reconnect bei Tab-Aktivierung)
- ✅ **Online/Offline-Detection** (Sofortiger Reconnect bei Netzwerk-Rückkehr)
- ✅ **Verbindungsqualitäts-Anzeige** mit visueller Signalstärke
- ✅ **Optimistisches Update** (UI reagiert sofort, Sync im Hintergrund)
- ✅ **State-Synchronisation** nach jedem Reconnect

## 🌐 Online-Multiplayer

### So spielst du mit Freunden:

1. **Spieler 1**: Klicke auf "Raum erstellen"
2. **Spieler 1**: Teile den 4-stelligen Raumcode mit deinem Freund
3. **Spieler 2**: Gib den Raumcode ein und klicke auf "Beitreten"
4. **Beide**: Spielt zusammen in Echtzeit!

### Technische Details:

- **Primär**: Server-Sent Events (SSE) für Echtzeit-Updates (0ms Latenz)
- **Fallback**: Automatisches Polling bei SSE-Problemen (3s Intervall)
- **Storage**: In-Memory (Server-seitig)
- **Reconnect**: Automatisch mit Exponential Backoff (1s - 30s)
- **Stabilität**: Funktioniert auch bei instabilen Verbindungen
- **Kompatibilität**: Alle Geräte mit Internetverbindung

### Verbindungsstabilität:

Das Spiel ist **hochgradig resilient** gegen:
- ✅ Netzwerkunterbrechungen
- ✅ Server-Neustarts
- ✅ Proxy/Load-Balancer-Timeouts
- ✅ Browser-Tab-Wechsel
- ✅ Mobile Netzwerk-Wechsel (WiFi ↔ 4G)
- ✅ Temporäre Verbindungsprobleme

**→ Das Spiel läuft praktisch immer, auch bei schlechter Verbindung! 🎮**

## 📚 Dokumentation

- **[VERBINDUNGSVERBESSERUNGEN.md](VERBINDUNGSVERBESSERUNGEN.md)** - Übersicht der Stabilitätsverbesserungen
- **[CHANGELOG_VERBINDUNG.md](CHANGELOG_VERBINDUNG.md)** - Detaillierte Änderungsliste
- **[docs/VERBINDUNGSSTABILITAET.md](docs/VERBINDUNGSSTABILITAET.md)** - Technische Dokumentation
- **[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - Deployment-Anleitung

## 🔧 Konfiguration

Alle Verbindungsparameter können in `config/connection.ts` angepasst werden:

```typescript
export const CONNECTION_CONFIG = {
  HEARTBEAT_INTERVAL: 15000,           // Server-Heartbeat
  FALLBACK_POLL_INTERVAL: 3000,        // Fallback-Polling
  FALLBACK_TIMEOUT: 25000,             // Timeout für SSE
  MAX_RECONNECT_ATTEMPTS: Infinity,    // Unbegrenzte Versuche
  INITIAL_RECONNECT_DELAY: 1000,       // Erste Wartezeit
  MAX_RECONNECT_DELAY: 30000,          // Max Wartezeit
  // ... weitere Parameter
}
```

## 🐛 Troubleshooting

### Verbindung bricht ab
- ✅ **Automatisch gelöst**: Fallback-System übernimmt
- ✅ **Reconnect**: Läuft automatisch im Hintergrund
- ✅ **Spiel läuft weiter**: Auch bei Verbindungsproblemen

### Spiel hängt
- Prüfe Console-Logs (F12 → Console)
- Suche nach `[SSE]`, `[FALLBACK]`, `[CONNECTION CHECK]`
- Siehe `docs/VERBINDUNGSSTABILITAET.md` für Details

### Deployment-Probleme
- Siehe `docs/DEPLOYMENT_GUIDE.md`
- Wichtig: Node.js Runtime (nicht Edge!)
- Nginx: Buffering deaktivieren

## 📝 Lizenz

MIT

---

Viel Spaß beim Spielen! 🎉

**Das Spiel läuft jetzt auch bei instabilen Verbindungen stabil! 🚀**
