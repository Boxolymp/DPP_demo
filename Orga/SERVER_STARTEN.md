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

Danach im Browser öffnen: **http://localhost:5173/**

## Täglicher Start

```bash
cd frontend
npm run dev
```

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
- Die Adresse muss `localhost:5173` lauten (Doppelpunkt), nicht `localhost/5173`.

**Port 5173 ist belegt**
- Vite weicht dann meist auf 5174 aus. Die tatsächliche Adresse steht in der Terminalausgabe (`Local: ...`).
- Alten Prozess finden und beenden: `lsof -iTCP:5173 -sTCP:LISTEN` und dann `kill <PID>`.

**`vite: command not found` oder fehlende Module**
- Abhängigkeiten fehlen. `npm install` im Ordner `frontend` ausführen.

**Server stoppt, wenn das Terminal oder VS Code geschlossen wird**
- Das ist normal. Einfach neu starten.
