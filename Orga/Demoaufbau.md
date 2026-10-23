# Demoaufbau und Repo-Struktur (v2)

**Stand:** 23.10.2026 · ersetzt die erste Fassung nach der Machbarkeitsanalyse.

## 1. Ziel und Phasen

Der Demonstrator **erklärt** den Digitalen Produktpass entlang der Wertschöpfungskette. Er ist in zwei Phasen angelegt:

| Phase | Inhalt | Daten |
| --- | --- | --- |
| **1 – Aufklärende UI (jetzt)** | Showroom + fünf Fachseiten, alle Bereiche klickbar, Detail-Drawer je Bereich | Jedes Datenfeld ist bereits ein **typisiertes Feld** (`DataField`) in einer zentralen Inhaltsschicht. Werte sind `illustrativ` und in der UI sichtbar so gekennzeichnet. |
| **2 – Datenanbindung (später)** | Backend, Contracts, Integrationen, Rechte, Änderungsablauf | Die Inhaltsschicht wird durch API-Aufrufe ersetzt. Komponenten ändern sich nicht. |

**Abweichung von der Gesamtspezifikation ([README.md](README.md)):** Dort gilt „keine Mock-Daten“. Für Phase 1 gilt stattdessen: Es gibt **keine versteckten Beispielwerte in Komponenten**. Jeder Wert liegt als `DataField` mit Status in der Inhaltsschicht und wird als „Illustrativ“ markiert. Felder ohne Inhalt zeigen „nicht verfügbar“. Phase 2 hebt die Markierung pro Feld auf, sobald es live gebunden ist. Die Regeln aus der Gesamtspezifikation (Revision, Herkunft, Einheit, Rechte) gelten ab Phase 2 unverändert.

## 2. Projektentscheidungen

### 2.1 2.5D statt echtem 3D
Der Showroom wird als 2.5D-Szene mit CSS `perspective`, Ebenen, Parallax und Schatten gebaut. Gründe: Performance, Mobilgeräte, Green IT, Wartbarkeit, Barrierefreiheit. Karten, Texte und Badges sind echtes HTML. Der Raum und die Produkte sind Bild-Ebenen. Bei `prefers-reduced-motion` und auf schmalen Displays gibt es einen ruhigen Fallback (Raster).

### 2.2 Frontend
React + TypeScript + Vite, React Router für die Routen. Datenzugriff in Phase 1 über eine Inhaltsschicht hinter einer Schnittstelle (`useField`, `useSection`), in Phase 2 über TanStack Query gegen die API. Diagramme werden leichtgewichtig in HTML/CSS bzw. SVG selbst gebaut, keine schwere Chart-Bibliothek.

### 2.3 Backend (Phase 2)
ASP.NET Core Web API (aktuelle LTS-Version), PostgreSQL, EF Core, OIDC/Keycloak. **Modularer Monolith**, kein Microservice-Schnitt, kein separater Message-Broker am Anfang. Echtzeit-Invalidierung per SSE. Das Produktmodell ist relational (Tabellen, rekursive Abfragen), keine Graph-Datenbank.

### 2.4 Contracts: OpenAPI-first (Korrektur zur Version 1)
Die erste Fassung sah TypeScript-Dateien in `shared/contracts/` vor. Ein C#-Backend kann diese nicht nutzen, es entstünden zwei Typwelten. Neu gilt:

- Quelle der Wahrheit ist die **OpenAPI-Beschreibung** (aus dem Backend erzeugt) bzw. JSON Schema in `shared/schemas/`.
- Der TypeScript-Client wird daraus **generiert**, nicht von Hand gepflegt.
- Bis das Backend existiert, liegt der Feldvertrag (`DataField`, Statusmodell) in `frontend/src/types/` und ist so geschnitten, dass er 1:1 in ein Schema übernommen werden kann.

### 2.5 Backend-Schichten als Projekte
`Api`, `Application`, `Domain`, `Infrastructure` sind getrennte `.csproj`-Projekte unter einer `.sln`, damit die Abhängigkeitsrichtung vom Compiler erzwungen wird. Tests liegen als Geschwister von `src/` unter `backend/tests/`.

### 2.6 UI zuerst
1. Showroom und App-Shell
2. Fünf Fachseiten als 2D-Kompositionen mit klickbaren Bereichen
3. Inhaltsschicht mit typisierten Feldern
4. Danach Datenmodell, Contracts, API
5. Live-Anbindung Feld für Feld

### 2.7 Green IT
Geringe Rendering-Last, nur `transform`/`opacity` für Animationen, Bildbudget für den Showroom unter ca. 500 KB (WebP/AVIF, responsive Größen), kleine Bundles, Lazy Loading je Route, nur benötigte Daten laden, keine redundanten Datenmodelle.

## 3. Offene Entscheidungen

| Thema | Frage | Vorläufige Annahme |
| --- | --- | --- |
| Header im Showroom | Das Showroom-Bild zeigt eine eigene Navigation (Shop, Batterie, DPP, Netzwerk; Perspektive OEM/Zulieferer). Die Spezifikation verlangt die OEM-Shell mit OEM/Endkunde/Zulieferer. | Eine Shell für alles; der Showroom nutzt dieselbe Topbar ohne Sidebar. |
| Showroom-Assets | Raum, Regale und Produkte müssen als einzelne Ebenen vorliegen. | Platzhalter-Ebenen per CSS/SVG, später durch Bilder ersetzt. |
| Datenumfang Phase 2 | Echte Systemanbindung oder gekennzeichneter Referenzdatensatz in der Datenbank? | Offen, bestimmt den Gesamtaufwand. |
| Hosting/Auth | Keycloak oder Azure AD? | Offen. |

## 4. Repository-Struktur

```text
DPP_Demonstrator_Komplettpaket/
├─ Orga/                          Referenzmaterial (bleibt unverändert)
│  ├─ README.md                   Gesamtspezifikation
│  ├─ Demoaufbau.md               dieses Dokument
│  ├─ assets/                     Referenzbilder 01–06
│  └─ pages/                      Seitenspezifikationen 01–05
├─ frontend/                      React + TypeScript + Vite
│  ├─ index.html
│  ├─ package.json · vite.config.ts · tsconfig*.json
│  └─ src/
│     ├─ app/
│     │  ├─ shell/                AppShell, GlobalHeader, GlobalSidebar
│     │  ├─ routes/               Router, Routen-Konstanten
│     │  └─ providers/            Kontext (aktives Produkt, Drawer)
│     ├─ features/
│     │  ├─ showroom/             2.5D-Produktwahl
│     │  ├─ oem/ · customer/ · supplier/ · footprint/ · aftersales/
│     │  │                        je Feature: Page, Sektionen
│     ├─ components/
│     │  ├─ ui/                   Badge, Button, Card, MetricCard, DataFieldValue
│     │  ├─ charts/               einfache SVG-Diagramme
│     │  └─ drawers/              EntityDrawer
│     ├─ content/                 Inhaltsschicht (Phase 1), je Seite eine Datei
│     ├─ hooks/                   useField, useSection, useDrawer
│     ├─ lib/                     Hilfsfunktionen, Formatierung
│     ├─ styles/                  tokens.css, base.css, showroom.css
│     ├─ types/                   DataField, Statusmodell, Section
│     └─ main.tsx
├─ backend/                       Phase 2
│  ├─ DppDemonstrator.sln
│  ├─ src/ Api · Application · Domain · Infrastructure   (je ein .csproj)
│  └─ tests/
├─ shared/
│  └─ schemas/                    OpenAPI / JSON Schema (Quelle der Contracts)
├─ docs/
│  ├─ architecture/               overview, data-model
│  └─ decisions/adr/              Architekturentscheidungen
├─ scripts/                       setup, dev, lint
└─ .gitignore
```

Änderungen gegenüber Version 1: `shared/contracts/*.ts` entfällt, `2d-showroom.css` heißt `showroom.css`, Backend-Tests liegen unter `backend/tests/`, neu ist `frontend/src/content/` als Inhaltsschicht. Nicht aufgenommen, aber in Phase 2 nötig: `docker-compose` (Postgres, Keycloak), CI, Vitest/Playwright, Backend-Integrationstests.

## 5. Das Feldmodell (Kern von Phase 1)

```ts
type FieldStatus = 'illustrative' | 'unavailable' | 'live';

interface DataField {
  key: string;            // stabiler semantischer Schlüssel, z. B. "product.nominalCapacity"
  label: string;
  value?: string | number;
  unit?: string;
  status: FieldStatus;    // steuert die Kennzeichnung in der UI
  sourceHint?: string;    // führendes System, z. B. "PLM"; später sourceRef
  description?: string;   // Erklärung für den Detail-Drawer
}
```

- Komponenten lesen Werte **nur** über `useField(key)`.
- Jeder klickbare Bereich öffnet den `EntityDrawer`: Erklärung, zugehörige Felder mit Status und Quellhinweis, Links auf verwandte Seiten.
- `illustrative` zeigt ein dezentes „Illustrativ“-Badge, `unavailable` den Text „nicht verfügbar“. `live` kommt erst in Phase 2.
- Der Wechsel auf echte Daten ist ein Austausch von `useField`, nicht der Komponenten.

## 6. Shell und Routen

Eine einzige Shell (Header + Sidebar nach `02_oem.png`) für alle Fachseiten.

| Route | Seite |
| --- | --- |
| `/` | Showroom (Produktwahl, ohne Sidebar) |
| `/products/:productId/oem` | OEM |
| `/products/:productId/customer` | Endkunde |
| `/products/:productId/supplier` | Zulieferer |
| `/products/:productId/footprint` | CO₂ & Scopes |
| `/products/:productId/aftersales` | Aftersales |

Der Perspektivenumschalter wechselt zwischen OEM, Endkunde und Zulieferer und erhält die `productId`. CO₂ & Scopes und Aftersales sind über die Sidebar („Ansichten“) direkt erreichbar. Perspektive ist keine Berechtigung; Rechte werden ab Phase 2 serverseitig geprüft.

## 7. Akzeptanzkriterien Phase 1

- [ ] Showroom: fünf Produktgruppen; Batterien führt in die OEM-Seite, die anderen sind sichtbar als „in Umsetzung/Vorbereitung“ und nicht navigierbar.
- [ ] Header und Sidebar sind einmal implementiert und auf allen fünf Fachseiten identisch.
- [ ] Jede Fachseite bildet die Bereiche ihres Referenzbildes ab; jeder Bereich ist per Maus und Tastatur klickbar und öffnet den Drawer.
- [ ] Kein Wert steht hartkodiert in einer Komponente; alle laufen über `DataField`.
- [ ] Illustrative Werte sind in der UI als solche erkennbar.
- [ ] Der Showroom funktioniert bei `prefers-reduced-motion` und mobil ohne Parallax.
- [ ] Barrierefreiheit: Fokusreihenfolge, sichtbarer Fokus, Alt-Texte, Kontraste.
- [ ] `npm run build` und Typprüfung laufen fehlerfrei.
