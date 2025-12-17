# 🚀 Deployment Anleitung für Vercel

Diese Anleitung zeigt dir Schritt für Schritt, wie du dein Quarto-Spiel auf Vercel deployen kannst.

## Voraussetzungen

- Ein GitHub, GitLab oder Bitbucket Account
- Ein Vercel Account (kostenlos: [vercel.com/signup](https://vercel.com/signup))

## Methode 1: Deployment über GitHub (Empfohlen)

### Schritt 1: Git Repository erstellen

1. Initialisiere Git in deinem Projekt (falls noch nicht geschehen):
```bash
git init
git add .
git commit -m "Initial commit: Quarto game"
```

2. Erstelle ein neues Repository auf GitHub:
   - Gehe zu [github.com/new](https://github.com/new)
   - Erstelle ein neues Repository
   - Folge den Anweisungen, um dein lokales Repository zu pushen:

```bash
git remote add origin https://github.com/DEIN-USERNAME/DEIN-REPO-NAME.git
git branch -M main
git push -u origin main
```

### Schritt 2: Mit Vercel verbinden

1. Gehe zu [vercel.com](https://vercel.com) und logge dich ein
2. Klicke auf **"Add New..."** → **"Project"**
3. Wähle **"Import Git Repository"**
4. Autorisiere Vercel, auf dein GitHub zuzugreifen
5. Wähle dein Quarto Repository aus
6. Vercel erkennt automatisch, dass es ein Next.js Projekt ist
7. Klicke auf **"Deploy"**

Das war's! Vercel baut deine App und stellt sie bereit. Du bekommst eine URL wie `quarto-game.vercel.app`.

### Automatische Deployments

Jeder Push zu deinem GitHub Repository triggert automatisch ein neues Deployment auf Vercel.

## Methode 2: Deployment über Vercel CLI

### Schritt 1: Vercel CLI installieren

```bash
npm install -g vercel
```

### Schritt 2: Anmelden

```bash
vercel login
```

### Schritt 3: Deployen

Im Projektverzeichnis:

```bash
vercel
```

Folge den Anweisungen:
- **Set up and deploy?** → Yes
- **Which scope?** → Wähle deinen Account
- **Link to existing project?** → No
- **What's your project's name?** → quarto-game (oder eigener Name)
- **In which directory is your code located?** → ./ (Enter drücken)

Vercel deployt jetzt deine App und gibt dir eine URL.

### Production Deployment

Für ein Production Deployment:

```bash
vercel --prod
```

## Methode 3: Deployment über Vercel Dashboard (Drag & Drop)

1. Baue dein Projekt lokal:
```bash
npm install
npm run build
```

2. Gehe zu [vercel.com/new](https://vercel.com/new)
3. Wähle **"Deploy from a .zip file"**
4. Zippe deinen gesamten Projektordner
5. Lade die .zip-Datei hoch
6. Klicke auf **"Deploy"**

⚠️ **Hinweis**: Diese Methode ist nicht empfohlen, da keine automatischen Updates möglich sind.

## Umgebungsvariablen (falls benötigt)

Falls du später Umgebungsvariablen benötigst:

1. Gehe zu deinem Projekt auf Vercel
2. Klicke auf **"Settings"** → **"Environment Variables"**
3. Füge deine Variablen hinzu

## Custom Domain einrichten

1. Gehe zu deinem Projekt auf Vercel
2. Klicke auf **"Settings"** → **"Domains"**
3. Füge deine Domain hinzu
4. Folge den DNS-Konfigurationsanweisungen

## Troubleshooting

### Build-Fehler

Überprüfe, ob dein Projekt lokal läuft:
```bash
npm install
npm run build
npm start
```

### Dependencies fehlen

Stelle sicher, dass alle Dependencies in `package.json` aufgelistet sind.

### Port-Probleme

Next.js und Vercel handhaben Ports automatisch - keine Konfiguration nötig.

## Performance-Optimierung

Vercel optimiert automatisch:
- ✅ Edge Caching
- ✅ Automatische Bildoptimierung
- ✅ CDN-Distribution
- ✅ HTTPS
- ✅ Gzip/Brotli Kompression

## Monitoring

Auf dem Vercel Dashboard kannst du überwachen:
- Deployment-Status
- Build-Logs
- Analytics (mit Pro Plan)
- Error Tracking

## Nützliche Vercel CLI Befehle

```bash
vercel ls              # Liste alle Deployments
vercel inspect [URL]   # Deployment-Details anzeigen
vercel logs [URL]      # Logs anzeigen
vercel remove [NAME]   # Projekt löschen
vercel env ls          # Umgebungsvariablen auflisten
```

## Kosten

- **Hobby Plan**: Kostenlos
  - Unbegrenzte Deployments
  - Automatische HTTPS
  - 100 GB Bandwidth/Monat
  
- **Pro Plan**: $20/Monat (für kommerzielle Nutzung)

Für dieses Quarto-Spiel ist der kostenlose Hobby Plan völlig ausreichend!

## Support

Bei Problemen:
- [Vercel Dokumentation](https://vercel.com/docs)
- [Next.js Dokumentation](https://nextjs.org/docs)
- [Vercel Discord Community](https://vercel.com/discord)

---

Viel Erfolg beim Deployment! 🚀

