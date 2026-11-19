# Server starten (Anleitung)

Die Demo ist ein reines Frontend (React + Vite). Es gibt kein Backend, nur den Vite-Entwicklungsserver.

## Voraussetzungen

- Node.js (Version 18 oder neuer) und npm
- Prüfen mit: `node -v` und `npm -v`

## Erststart


```bash
cd /Users/frauzander/Desktop/DPP_Demo/frontend
npm install        # nur beim ersten Mal bzw. nach Änderungen an package.json
npm run dev
```

Danach im Browser öffnen: **http://127.0.0.1:5173/**

## Täglicher Start

```bash
cd frontend
npm run dev
```

## Dashboard „Quellsysteme“

Der Bereich *Quellsysteme* bettet das lokale Dashboard (CONTACT, `http://127.0.0.1:8080/dashboard`) ein. Es muss auf demselben Rechner laufen.

- `npm run dev` bzw. `npm run preview` starten automatisch einen lokalen Proxy auf **http://127.0.0.1:8081** (`frontend/dashboard-proxy.js`). Er reicht alle Pfade unverändert an Port 8080 durch und erlaubt nur lokalen Demo-Adressen das Einbetten (`frame-ancestors`); alle anderen Sicherheitsregeln des Dashboards bleiben unverändert.
- Die Demo läuft deshalb unter **http://127.0.0.1:5173/** (nicht `localhost`): Nur so gilt das Login-Cookie des Dashboards auch im eingebetteten Fenster.
- Läuft das Dashboard nicht, zeigt die Fläche „Dashboard nicht erreichbar“.
- Ist Port 8081 belegt, meldet das Terminal eine Warnung, und die Fläche bleibt leer.

## Server beenden

Im Terminal, in dem der Server läuft: `Ctrl + C`.

## Weitere Befehle

| Befehl              | Zweck                                          |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Entwicklungsserver mit Hot Reload              |
| `npm run build`     | Typprüfung und Produktions-Build nach `dist/`  |
| `npm run preview`   | Gebauten Stand lokal ansehen (Port 4173)       |
| `npm run typecheck` | Nur TypeScript-Prüfung                         |

## Fehlersuche

**„localhost ist nicht erreichbar"**
- Der Server läuft nicht. `npm run dev` im Ordner `frontend` starten und das Terminal offen lassen.
- Die Adresse muss `127.0.0.1:5173` lauten (Doppelpunkt), nicht `127.0.0.1/5173`.

**Port 5173 ist belegt**
- Vite weicht dann meist auf 5174 aus. Die tatsächliche Adresse steht in der Terminalausgabe (`Local: ...`).
- Alten Prozess finden und beenden: `lsof -iTCP:5173 -sTCP:LISTEN` und dann `kill <PID>`.

**`vite: command not found` oder fehlende Module**
- Abhängigkeiten fehlen. `npm install` im Ordner `frontend` ausführen.

**Server stoppt, wenn das Terminal oder VS Code geschlossen wird**
- Das ist normal. Einfach neu starten.
