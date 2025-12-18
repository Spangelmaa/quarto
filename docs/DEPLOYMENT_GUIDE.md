# Deployment-Guide für Quarto Multiplayer

## 🚀 Deployment-Optionen

### Option 1: Vercel (Empfohlen für Hobby-Projekte)

#### Voraussetzungen
- Node.js Runtime (NICHT Edge Runtime!)
- Hobby Plan: 60s Timeout-Limit
- Pro Plan: 300s Timeout-Limit

#### Konfiguration

**vercel.json:**
```json
{
  "functions": {
    "app/api/room/subscribe/route.ts": {
      "maxDuration": 300
    }
  }
}
```

#### Wichtig
⚠️ **SSE-Verbindungen werden nach 60s (Hobby) bzw. 300s (Pro) getrennt!**

**Lösung:** Das Fallback-System fängt dies automatisch ab:
- Fallback-Polling übernimmt nach 25s ohne SSE-Nachricht
- Automatischer Reconnect alle 1-30s
- Spiel läuft ohne Unterbrechung weiter

#### Deployment
```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

---

### Option 2: Eigener VPS (Beste Stabilität)

#### Voraussetzungen
- Node.js 18+ installiert
- Nginx als Reverse Proxy
- PM2 für Process Management

#### 1. Node.js App starten

```bash
# Installation
npm install
npm run build

# PM2 starten
npm install -g pm2
pm2 start npm --name "quarto" -- start
pm2 save
pm2 startup
```

#### 2. Nginx Konfiguration

```nginx
server {
    listen 80;
    server_name deine-domain.de;

    # Normale Requests
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSE-Endpoint (WICHTIG!)
    location /api/room/subscribe {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # KEINE Verbindungs-Header überschreiben!
        proxy_set_header Connection '';
        
        # Buffering MUSS deaktiviert sein!
        proxy_buffering off;
        proxy_cache off;
        
        # Lange Timeouts
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
        
        # Chunked Transfer
        chunked_transfer_encoding on;
        
        # Headers durchreichen
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3. SSL mit Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de
```

---

### Option 3: Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# App
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  quarto:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - quarto
    restart: unless-stopped
```

#### Starten

```bash
docker-compose up -d
docker-compose logs -f
```

---

### Option 4: Railway

#### Voraussetzungen
- Railway Account
- GitHub Repository

#### Deployment

1. **Railway CLI installieren:**
```bash
npm install -g @railway/cli
railway login
```

2. **Projekt erstellen:**
```bash
railway init
railway up
```

3. **Environment Variables:**
```bash
railway variables set NODE_ENV=production
```

#### Wichtig
⚠️ Railway hat standardmäßig 5-Minuten-Timeout für HTTP-Requests.

**Lösung:** Gleich wie bei Vercel - Fallback-System übernimmt automatisch.

---

### Option 5: Heroku

#### Voraussetzungen
- Heroku Account
- Heroku CLI

#### Procfile

```
web: npm start
```

#### Deployment

```bash
heroku login
heroku create quarto-game
git push heroku main
heroku open
```

#### Wichtig
⚠️ Heroku hat 30-Sekunden-Request-Timeout!

**Lösung:** Fallback-System ist speziell für solche Limits optimiert.

---

## 🔧 Konfiguration für verschiedene Umgebungen

### Entwicklung (localhost)

```typescript
// config/connection.ts
export const CONNECTION_CONFIG = {
  HEARTBEAT_INTERVAL: 15000,
  FALLBACK_POLL_INTERVAL: 3000,
  // ... Standard-Werte
}
```

### Production mit langen Timeouts (VPS)

```typescript
export const CONNECTION_CONFIG = {
  HEARTBEAT_INTERVAL: 30000,      // Weniger Traffic
  FALLBACK_POLL_INTERVAL: 5000,   // Weniger aggressive
  FALLBACK_TIMEOUT: 45000,        // Mehr Zeit für SSE
  // ... Rest Standard
}
```

### Production mit kurzen Timeouts (Vercel/Heroku)

```typescript
export const CONNECTION_CONFIG = {
  HEARTBEAT_INTERVAL: 15000,      // Standard
  FALLBACK_POLL_INTERVAL: 2000,   // Aggressiver
  FALLBACK_TIMEOUT: 20000,        // Schneller Fallback
  // ... Rest Standard
}
```

---

## 🧪 Testing nach Deployment

### 1. Basis-Funktionalität

```bash
# Health Check
curl https://deine-domain.de/api/health

# SSE-Verbindung (sollte offen bleiben)
curl -N https://deine-domain.de/api/room/subscribe?roomId=TEST
```

### 2. Verbindungsstabilität

**Test-Szenario:**
1. Erstelle einen Raum
2. Öffne DevTools → Network Tab
3. Prüfe `/api/room/subscribe` - sollte "pending" sein
4. Mache einen Zug
5. Prüfe Console-Logs für `[SSE]` Messages

**Erwartete Logs:**
```
[SSE] 🔌 Verbinde zu Raum: XXXX
[SSE] ✅ Verbunden
[SSE] 💓 Heartbeat gesendet
[CONNECTION CHECK] { readyState: 'OPEN', ... }
```

### 3. Fallback-Test

**Test-Szenario:**
1. Spiel starten
2. DevTools → Network → Throttling auf "Slow 3G"
3. Mache einen Zug
4. Prüfe ob Fallback-Polling startet

**Erwartete Logs:**
```
[FALLBACK] ⚠️ Keine SSE-Nachricht seit 25s
[FALLBACK] ✅ State manuell aktualisiert
```

### 4. Reconnect-Test

**Test-Szenario:**
1. Spiel starten
2. DevTools → Network → "Offline"
3. Warte 5 Sekunden
4. DevTools → Network → "Online"

**Erwartete Logs:**
```
[NETWORK] Offline erkannt
[SSE] ❌ Verbindungsfehler
[NETWORK] Wieder online, reconnecte SSE
[SSE] 🔌 Verbinde zu Raum: XXXX
[SSE] ✅ Verbunden
```

---

## 🐛 Troubleshooting

### Problem: SSE-Verbindung bricht nach 60s ab

**Symptome:**
- Verbindung funktioniert initial
- Nach genau 60s: Verbindung tot
- Fallback-Polling übernimmt

**Ursache:** Serverless-Platform-Timeout (Vercel Hobby, Heroku, etc.)

**Lösung:**
- ✅ Fallback-System funktioniert automatisch
- Upgrade auf Pro-Plan (wenn möglich)
- Oder: VPS mit eigener Kontrolle

### Problem: Nginx 502 Bad Gateway

**Symptome:**
- SSE-Verbindung schlägt sofort fehl
- 502 Error in Network Tab

**Ursache:** Nginx-Konfiguration falsch

**Lösung:**
```nginx
# Diese Zeilen sind KRITISCH:
proxy_buffering off;
proxy_cache off;
proxy_http_version 1.1;
proxy_set_header Connection '';
```

### Problem: Keine Updates nach Tab-Wechsel

**Symptome:**
- Tab inaktiv → keine Updates
- Tab aktiv → Updates kommen wieder

**Ursache:** Browser drosselt inaktive Tabs

**Lösung:**
- ✅ System erkennt dies automatisch
- Reconnect bei Tab-Aktivierung
- Fallback-Polling läuft auch bei inaktiven Tabs

### Problem: "CORS error" bei SSE

**Symptome:**
- SSE-Verbindung wird blockiert
- CORS-Fehler in Console

**Lösung:**
```typescript
// In route.ts
return new Response(stream, {
  headers: {
    // ... andere Headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
  },
});
```

### Problem: Zu viele Reconnects

**Symptome:**
- Console voll mit Reconnect-Logs
- Verbindung instabil

**Ursache:** Server nicht erreichbar oder überlastet

**Lösung:**
1. Prüfe Server-Logs
2. Prüfe Server-Ressourcen (CPU, RAM)
3. Erhöhe `MAX_RECONNECT_DELAY` in config
4. System gibt niemals auf - versucht weiter

---

## 📊 Monitoring

### Wichtige Metriken

1. **SSE-Verbindungsdauer**
   - Durchschnitt: >300s = gut
   - <60s = Timeout-Probleme

2. **Fallback-Aktivierungen**
   - Häufigkeit: Wie oft springt Fallback an?
   - Niedrig = stabile SSE

3. **Reconnect-Versuche**
   - Anzahl: Wie viele Versuche bis Erfolg?
   - 1-3 = normal, >10 = Probleme

4. **State-Sync-Latenz**
   - Zeit zwischen Zug und Update
   - <500ms = ausgezeichnet

### Logging

**Production-Logs filtern:**
```bash
# Nur SSE-Logs
pm2 logs | grep "\[SSE\]"

# Nur Fehler
pm2 logs | grep "❌"

# Nur Fallback
pm2 logs | grep "\[FALLBACK\]"
```

---

## 🎯 Best Practices

### ✅ DO

- Verwende Node.js Runtime (nicht Edge)
- Aktiviere Buffering-Deaktivierung in Nginx
- Setze lange Timeouts (>300s)
- Teste Fallback-System vor Production
- Monitore SSE-Verbindungsdauer
- Verwende SSL/TLS (HTTPS)

### ❌ DON'T

- Edge Runtime für SSE verwenden
- Aggressive Caching für SSE-Endpoints
- Zu kurze Timeouts (<60s)
- Buffering in Proxies aktiviert lassen
- Sticky Sessions vergessen (bei Load Balancern)

---

## 🚀 Performance-Optimierung

### 1. CDN für statische Assets

```javascript
// next.config.js
module.exports = {
  assetPrefix: process.env.CDN_URL || '',
}
```

### 2. Compression

```javascript
// next.config.js
module.exports = {
  compress: true,
}
```

### 3. Caching (außer SSE!)

```nginx
# Statische Assets cachen
location /_next/static/ {
    proxy_cache my_cache;
    proxy_cache_valid 200 365d;
}

# SSE NICHT cachen!
location /api/room/subscribe {
    proxy_cache off;
}
```

---

## 📚 Weitere Ressourcen

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel SSE Limits](https://vercel.com/docs/functions/serverless-functions/runtimes#streaming)
- [Nginx SSE Configuration](https://www.nginx.com/blog/event-driven-data-management-nginx/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## ✅ Deployment-Checkliste

- [ ] Node.js Runtime aktiviert (nicht Edge)
- [ ] Timeouts erhöht (>300s wenn möglich)
- [ ] Nginx-Konfiguration geprüft (buffering off)
- [ ] SSL/TLS aktiviert
- [ ] Environment Variables gesetzt
- [ ] Health Check funktioniert
- [ ] SSE-Verbindung getestet
- [ ] Fallback-System getestet
- [ ] Reconnect-Logik getestet
- [ ] Tab-Wechsel getestet
- [ ] Mobile Geräte getestet
- [ ] Monitoring eingerichtet
- [ ] Logs überprüft

---

**Viel Erfolg beim Deployment! 🚀**

Bei Fragen: Siehe `docs/VERBINDUNGSSTABILITAET.md` für technische Details.
