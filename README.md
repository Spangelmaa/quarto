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
├── app/                       # Next.js App Router
│   ├── api/                  # API Routes für Multiplayer
│   │   └── room/            # Raum-Management
│   │       ├── create/      # Raum erstellen
│   │       ├── join/        # Raum beitreten
│   │       └── state/       # Spielzustand
│   ├── page.tsx             # Hauptseite
│   ├── layout.tsx           # Root Layout
│   └── globals.css          # Globale Styles
├── components/              # React Komponenten
│   ├── Board.tsx           # Spielbrett
│   ├── Piece.tsx           # Einzelner Spielstein
│   ├── PieceSelector.tsx   # Steinauswahl
│   ├── GameInfo.tsx        # Spielinformationen
│   ├── MultiplayerLobby.tsx # Multiplayer-Lobby
│   └── RoomInfo.tsx        # Raum-Informationen
├── hooks/                  # Custom React Hooks
│   └── useMultiplayer.ts   # Multiplayer-Logik
├── types/                  # TypeScript Typen
│   ├── game.ts            # Spiel-Typen
│   └── multiplayer.ts     # Multiplayer-Typen
├── utils/                  # Hilfsfunktionen
│   └── gameLogic.ts        # Spiellogik
└── package.json            # Dependencies
```

## 🎯 Features

- ✅ Vollständige Quarto-Spiellogik
- ✅ **Online-Multiplayer**: Spiele mit Freunden auf verschiedenen Geräten
- ✅ **Lokaler Multiplayer**: Spiele zu zweit auf einem Gerät
- ✅ Interaktive Benutzeroberfläche
- ✅ Responsive Design für Mobile & Desktop
- ✅ Gewinn-Erkennung (alle Richtungen)
- ✅ Visuelle Darstellung der Spielsteine
- ✅ Raum-System mit 4-stelligen Codes
- ✅ Echtzeit-Synchronisation
- ✅ Spielzustandsverwaltung
- ✅ Neustart-Funktion

## 🌐 Online-Multiplayer

### So spielst du mit Freunden:

1. **Spieler 1**: Klicke auf "Raum erstellen"
2. **Spieler 1**: Teile den 4-stelligen Raumcode mit deinem Freund
3. **Spieler 2**: Gib den Raumcode ein und klicke auf "Beitreten"
4. **Beide**: Spielt zusammen in Echtzeit!

### Technische Details:

- Automatische Synchronisation über API Routes
- In-Memory Storage (Server-seitig)
- Polling-basierte Updates (1 Sekunde Intervall)
- Funktioniert auf allen Geräten mit Internetverbindung

## 📝 Lizenz

MIT

---

Viel Spaß beim Spielen! 🎉
