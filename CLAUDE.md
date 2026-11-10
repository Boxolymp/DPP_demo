# DPP-Demonstrator (Dataciders) — Projektsteuerung

Presales-Demonstrator für den Digitalen Produktpass (Batterie). Story: **Betroffenheit → verknüpfte Komplexität → Dataciders-Lösungskompetenz / Product Intelligence**. Consultant-geführt, mit freier Navigation; komplexe Zusammenhänge per Progressive Disclosure.

**Leitprinzip:** Ein Produkt, ein verknüpfter Datenbestand, fünf Sichten. Perspektiven sind Projektionen derselben `productId`, keine fünf getrennt gepflegten Datensätze.

## Phasen und Status

| Phase | Inhalt | Daten |
| --- | --- | --- |
| **1 – aktuell** | Showroom + fünf Fachseiten, alles klickbar, Detail-Drawer je Bereich. Nur Frontend, kein Backend. | Typisierte `DataField`s in `frontend/src/content/`, in der UI als „Illustrativ“ gekennzeichnet. |
| **2 – später, nicht ohne Freigabe beginnen** | Backend, Contracts, Integrationen, Rechte, Änderungsablauf. | Echte Quellen bzw. gekennzeichneter Referenzdatensatz (offen). Die Inhaltsschicht wird ersetzt, Komponenten bleiben. |

Phase 1 erklärt, sie gibt keine echten Produkt-/Batteriepassdaten frei. Illustrative Ereignisse und QR-Szenarien müssen klar als illustrativ erscheinen.

## Tech-Stack

**Phase 1 (vorhanden):** React 18, TypeScript, Vite 5, react-router-dom 7, reines HTML/CSS. Keine UI-, State-, Animations- oder Chart-Bibliothek; Diagramme in SVG/CSS selbst bauen. Neue Dependencies nur mit Begründung (Nutzen, Größe, Wartung) und vorheriger Rückfrage.

**Phase 2 (beschlossene Richtung, noch nicht umsetzen):**
- ASP.NET Core Web API (aktuelle LTS), PostgreSQL, EF Core, **modularer Monolith** mit den Projekten `Api`, `Application`, `Domain`, `Infrastructure` unter einer `.sln`; Tests unter `backend/tests/`.
- Relationales Produktmodell mit rekursiven Abfragen. Keine Graph-DB, keine Microservices, kein Message-Broker, REST statt GraphQL.
- **OpenAPI-first:** Quelle der Wahrheit ist die OpenAPI-Beschreibung bzw. JSON Schema in `shared/schemas/`. Der TypeScript-Client wird generiert, nicht von Hand gepflegt. Frontend-Datenzugriff dann über TanStack Query.
- OIDC; Rechte (Rolle, Organisation, Partner, Eigentum, Feldklasse, Produkt/Instanz) werden **serverseitig** geprüft. Echtzeit-Invalidierung per **SSE**.

**Offene Entscheidungen, nicht vorwegnehmen, sondern fragen:** Keycloak vs. Entra ID und Hosting; echte Quellsysteme vs. Referenzdatensatz in Phase 2; Rollen-/Disclosure-Modell; Feldkatalog, Revisions- und Berechnungsregeln; Performance-Budgets für Phase 2. Dauerhafte Entscheidungen nach Freigabe als ADR in `docs/decisions/adr/`.

### Warum so

- **2.5D statt echtem 3D:** Der Showroom ist eine CSS-Szene (`perspective`, Ebenen, Schatten, Parallax). Das spart Rechenlast und Energie, läuft besser auf Mobilgeräten, ist besser zugänglich und wartbar. Die Inhalte sind datenorientiert, kein Raumerlebnis. Karten, Texte und Badges sind echtes HTML; Raum und Produkte sind Bildebenen.
- **React + TypeScript + Vite:** wiederverwendbare Komponenten, typisierte Zustände, schlanke Bundles.
- **ASP.NET Core + PostgreSQL:** industrielle Produkt-/Lieferkettendaten mit Rollen, Revisionen, strengem Modell; stark verknüpfte BOM-, Lieferanten-, Emissions- und Nachweisdaten.
- **Modularer Monolith:** geringste Komplexität und Idle-Last; die Compiler-Projektgrenzen erzwingen die Abhängigkeitsrichtung.
- **OpenAPI-first:** vermeidet zwei Typwelten (C# und TypeScript).

## Prioritäten bei Widersprüchen

1. Ausdrückliche Anweisung des Users.
2. Diese Datei.
3. `Orga/pages/*.md` für Inhalt und UI-Hierarchie je Fachseite.
4. `Orga/assets/*.png` als visuelle/funktionale Referenz. Zahlen, Status, Zeitpunkte und Stoffnamen in den Bildern sind **keine Stammdaten** und werden nicht übernommen.

Zielkonflikt zwischen zwei verbindlichen Zielen: vor einer Grundsatzabweichung Optionen, Folgen und Empfehlung vorlegen. Kleine reversible Trade-offs selbst entscheiden und begründen.

## Seiten und Routen

| URL | Seite | Spezifikation / Bild |
| --- | --- | --- |
| `/` | Showroom: 2.5D-Produktwahl, ohne Sidebar. Fünf Produktgruppen; nur Batterie führt weiter, die vier anderen sind „in Vorbereitung“ und nicht navigierbar. | `assets/01_showroom.png` |
| `/products/:productId/oem` | Produktcockpit: BOM, Engineering, Wertschöpfung, Änderung, PCF, DPP | `pages/01_OEM.md`, `assets/02_oem.png` |
| `/products/:productId/customer` | Öffentlich zulässige Batteriepass-Sicht, mobil gedacht | `pages/02_ENDKUNDE.md`, `assets/03_endkunde.png` |
| `/products/:productId/supplier` | Eigener Beitrag, Nachweise, Status, Transport | `pages/03_ZULIEFERER.md`, `assets/04_zulieferer.png` |
| `/products/:productId/footprint` | Corporate Scopes, CCF/PCF, Daten-Röntgenblick, Herkunft | `pages/04_CO2_SCOPES_DATENFLUSS.md`, `assets/05_co2_scopes.png` |
| `/products/:productId/aftersales` | Erkennen, Handeln, Weiterentwickeln: Feedback, Service, Zirkularität | `pages/05_AFTERSALES.md`, `assets/06_aftersales.png` |

Der Showroom ist ein Einstiegszustand, keine sechste Fachseite. Die Routen in `frontend/src/lib/pages.ts` sind die einzige Quelle für Routen, Navigation und Verknüpfungen.

### Shell

- **Header und Sidebar existieren genau einmal** und folgen `02_oem.png`; sie gelten für alle fünf Fachseiten. Header/Navigation aus anderen Screenshots nicht nachbauen; deren Besonderheiten (z. B. dunkle CO₂-Grafik, Aftersales-Szene, lieferantenspezifische Navigation) leben nur im Content-Bereich, Navigationsanker statt zweiter Sidebar. Der Showroom nutzt denselben Header ohne Sidebar.
- Header: Logo und Titel (Klick öffnet den Showroom), Produktwechsel, Perspektivenumschalter OEM / Endkunde / Zulieferer, Suche, Benachrichtigungen, Benutzermenü. Der Umschalter erhält `productId`. CO₂ & Scopes und Aftersales sind über die Sidebar („Ansichten“) direkt erreichbar. Alle fünf Fachseiten sind jederzeit erreichbar und im aktiven Zustand erkennbar, ohne Sackgassen.
- **Perspektive ≠ Berechtigung.** Der Wechsel ändert Darstellung, nie die Produktidentität; Rechte prüft ab Phase 2 der Server.
- Aktive Ansicht, Produkt und Filter liegen in URL/Query (`stage`, `partyId`, `serialId` nur wenn tatsächlich genutzt), damit Reload und Deep Links funktionieren. Beim Produktwechsel bleibt kein Wert des alten Produkts (Drawer, Filter, Felder) sichtbar.
- **Ein globaler `EntityDrawer`:** Jeder klickbare Bereich (Material, Werk, Lifecycle-Knoten, PCF-Beitrag, Serviceevent) öffnet denselben Drawer mit Erklärung, Feldern samt Status und Quellhinweis sowie Links zu verwandten Seiten. Rücknavigation behält den Filter.
- Desktop-first; Sidebar auf schmalen Displays einklappbar, Header und Perspektivenwechsel bleiben erreichbar.

## Frontend-Struktur (Ist-Stand)

```text
frontend/src/
├─ app/            shell/AppShell, routes/AppRoutes, providers/DrawerProvider
├─ features/       showroom, oem, customer, supplier, footprint, aftersales (je Page + Sektionen)
├─ components/     ui/ (SectionCard, Tile, DataValue, Chain, Icon), charts/, drawers/EntityDrawer
├─ content/        typisierte Beispieldaten je Seite (index.ts, builder.ts)
├─ hooks/          useContent.ts (einzige Lesegrenze für Fachdaten)
├─ lib/            pages.ts (Routen, Navigation), reine Utilities
├─ types/          content.ts (DataField, FieldStatus, Section)
└─ styles/         tokens.css, base.css, pages.css, showroom.css
```

Struktur vor dem Anlegen neuer Ordner prüfen; keine leeren Gerüste für Phase 2 anlegen (`backend/`, `shared/`, `docs/`, `scripts/` erst bei Bedarf).

## Datenarchitektur (Phase 1)

```ts
type FieldStatus = 'illustrative' | 'unavailable' | 'live';
interface DataField {
  key: string;            // stabiler semantischer Schlüssel, z. B. "product.nominalCapacity"
  label: string;
  value?: string | number;
  unit?: string;
  status: FieldStatus;
  sourceHint?: string;    // führendes System, z. B. "PLM"
  description?: string;   // Erklärung für den Drawer
}
```

```text
Phase 1: content/*.ts → Adapter → useField/useSection → Komponenten + EntityDrawer
Phase 2: API + generierter TS-Client → ApiAdapter → useField/useSection → dieselben Komponenten
```

- **Fachwerte stehen nie hartkodiert in Komponenten.** Sie werden nur über die Hooks gelesen (`useField(key)`, `useSection`). Statische Texte im JSX sind erlaubt, Beispielwerte und KPIs nicht. `0` ist kein „fehlt“.
- Eine Feldidentität pro semantischem Schlüssel und Produktkontext; Produktname, Gewicht, PCF u. a. dürfen sich zwischen Seiten nicht unterscheiden. Einheiten und Feldbezeichnungen bleiben konsistent.
- `illustrative` wird als „Illustrativ“ gekennzeichnet, `unavailable` als „nicht verfügbar“. **`live` kommt in Phase 1 nicht vor.** Phase 2 hebt die Markierung pro Feld auf, sobald es live gebunden ist.
- Darstellungskomponenten greifen nie direkt auf `content/*.ts` zu.
- `FieldStatus`, fachlicher Prüfstatus (z. B. `complete`, `in_review`, `open`, `invalid`, `unknown`) und Berechtigung sind getrennte Konzepte.
- Den Adapter in Phase 2 kompatibel um Lade-, Fehler-, Rechte-, Frische- und Herkunftszustände erweitern. Keine Abstraktion für eine noch nicht vorhandene API bauen.

## Fachliche Leitplanken

- **Regulatorik:** EU-Batterieverordnung (EU) 2023/1542 (Art. 77, Anhang XIII) und ESPR. Vor verbindlicher Feldklassifikation die aktuellen Vorgaben prüfen: https://eur-lex.europa.eu/eli/reg/2023/1542/oj. Ein DPP-Datenfeld ist nicht jeder beliebige Nachhaltigkeitsindikator; Pflicht, optional und illustrativ unterscheiden. Rechtsstatus nie aus Screenshot-Labels ableiten. AAS/IDTA sind mögliche Austausch-/Semantikstandards; eine eigene AAS-Laufzeit ist nicht Teil von Phase 1.
- **Emissionen:** CCF ist die organisationsbezogene Bilanz, PCF die produktbezogene, Scopes 1–3 eine unternehmensperspektivische Klassifikation. Nicht blind addieren: PCF nur mit funktioneller Einheit, Systemgrenze, Methode, Allokation, Faktor-/Rechenversion und Datenqualität. Ein Zulieferer-„Scope 1“ ist aus OEM-Sicht nicht automatisch dessen Scope 1. Keine erfundenen Einsparquoten; Prozentänderungen nur gegen eine vergleichbare Baseline. Beispiel: `PCF = Σ(Aktivitätsdaten × verifizierter Emissionsfaktor × gültige Allokation)`.
- **Öffentliche Sicht:** zeigt nur zulässige Felder. Lieferantenpreise, geschützte Rezepturen, BMS-Telemetrie und personenbezogene Serviceinformationen werden nie allein durch die Perspektivenwahl sichtbar. Ein QR-Szenario zeigt keine echten URLs, privaten IDs oder Zugänge.
- **KPI-Transparenz:** Jede Kennzahl erklärt auf Klick Definition, Einheit, Zeitraum, Bilanzgrenze, Quelle und Aktualität (in Phase 1 als illustrativ).
- **Was-wäre-wenn (OEM-Änderungspanel):** Eine Vorschau ist klar als vorläufig/nicht persistent markiert und wird nie als aktuelle DPP-Zahl verbreitet. Eine Änderung wirkt nur auf belegbar abhängige Werte, z. B. Komponentengewicht → Produktmasse, PCF-Materialbeitrag, Transport, DPP-Felder. Nicht betroffen sind gemessener SoH, historische Serviceevents, Nennspannung, Garantie und Unternehmens-Scopes.

### Zielbild Phase 2 (Orientierung, kein Auftrag)

- **Eine Masterquelle je Attribut** (z. B. PLM für Produkt/BOM/Material, ERP/MES für Chargen, TMS für Transporte, LCA für Faktoren, QMS/DMS für Nachweise, CRM/BMS für Service). Quellsysteme nur bei bestätigter Notwendigkeit anbinden. Die UI ist nie Quelle der Wahrheit. Der Produktpass ist eine kuratierte, autorisierte Projektion des Produktmodells, keine Parallel-Datenbank.
- **Kernbeziehungen:** `Product → ProductRevision → BOMLine → Component/Material → Party/Facility`; `ProductRevision → ProcessStep → Measurement/Shipment`; `Measurement + EmissionFactor + Allokation → FootprintResult → DPPField`; `ProductRevision → ProductInstance/Batch → ServiceEvent/Telemetry/SparePartCompatibility`; `ChangeSet → betroffene Entitäten → neu berechnete Ergebnisse`. Lieferantenbeitrag und OEM-Produkt hängen an derselben BOM-/Chargenrelation. Massen werden auf Komponenten-/Revisionsebene geführt und Gesamtmassen abgeleitet oder abgeglichen; Konflikte kennzeichnen, nicht überschreiben.
- **Jedes Objekt:** `id`, `sourceSystem`, `sourceRecordId`, `revision`, Gültigkeit, `observedAt`/`lastSyncedAt`, Klassifikation/Zugriffsrichtlinie, Datenqualität, Herkunft. Numerische Attribute zusätzlich mit Einheit, Bezugsgröße, Methode, ggf. Unsicherheit (eindeutiges Einheitenmodell, z. B. UCUM).
- **Änderungsablauf:** Eingang (Quell-Event oder autorisierter Command mit erwarteter Revision / Optimistic Locking) → Validierung und Quellbestätigung → Diff und Abhängigkeitsberechnung → atomare Veröffentlichung der betroffenen Projektionen → SSE-Invalidierung nur der abhängigen Elemente → Audit. Alle offenen Seiten zeigen dieselbe Revision.
- **Zustände:** `ausstehend`, `übernommen`, `fehlgeschlagen`, `Konflikt`, `stale`, `wird aktualisiert`, `vorläufig` sichtbar führen. Erfolg erst nach Bestätigung durch das führende System anzeigen, nie veraltete Werte unmarkiert stehen lassen, keine Phantomänderung bei Writeback-Fehler, keine Fallback-Fantasiewerte. Direkt editierbar sind nur Felder mit abgesichertem Command-/Writeback-Pfad; bei read-only-Quellen gibt es einen Änderungsantrag bzw. den Sprung ins führende System. Nicht berechenbare Abhängigkeiten werden als `unvollständig` / `Prüfung erforderlich` markiert.
- **API:** versioniert unter `/api/v1/`, je Fachseite eine serverseitig gefilterte Projektion plus Lineage- und Change-Status-Endpunkte. Jede Antwort trägt `productRevision`, `calculatedAt`, `dataAsOf`, Qualität/Status und `sourceRefs`. Credentials bleiben im Backend.
- **Sicherheit und Betrieb:** TLS, Secrets im Vault, unveränderliches Audit, PII-Minimierung, sichere Nachweis-URLs, Rate Limits, keine sensiblen Daten in Browser-Logs; idempotente Events mit Retry/Backoff, Connector-Health sichtbar, Projektionen aus Quell-/Eventstand rekonstruierbar. Caches nur mit TTL/Revision/ETag/Invalidierung; geschützte Daten nicht in unkontrollierte Browser-Caches.
- **Hosting:** erst nach dokumentiertem Strommix, PUE, Auslastung, Datenregion, Security und Kosten entscheiden. Serverless, Autoscaling und Queues nur bei messbarem Bedarf und mit Freigabe, nie stillschweigend als Ausnahme vom Monolithen.

## Green Coding

Entscheidungsreihenfolge: Brauchen wir es? → Gibt es das schon? → Können wir weniger laden/berechnen/rendern? → Ist der Mehraufwand nachweislich sinnvoll? → Können wir es messen? Die einfachste fachlich korrekte und sichere Lösung gewinnt. Eine Einsparung darf weder Rechte, Datenqualität, Barrierefreiheit noch Wartbarkeit beschädigen.

- **YAGNI/KISS/DRY:** nur der aktuelle Use Case; keine Rule-Engine, kein Event-Bus und keine Komponenten für hypothetische Anforderungen; Feld-/Statusformatierung und Produktidentität einmal definieren. Ersetzte Implementierung nach erfolgreicher Prüfung **im selben Change** löschen (keine `OldX`/`X2`-Dateien, kein auskommentierter Code). Vorher Referenzen prüfen und keinen benötigten Code nur wegen „Dead Code“ löschen.
- **Browser:** Datenstruktur nach tatsächlichem Zugriffsmuster wählen (`Map`/`Set` für häufige ID-Lookups); keine quadratischen Suchen über große BOM-/Lieferantenlisten. `useMemo`/`useCallback`/`React.memo` nur bei verständlichem oder gemessenem Nutzen; Zustand lokal und klein. Requests mit `AbortController` abbrechen; Listener, Observer und `requestAnimationFrame` im Effect-Cleanup entfernen. Keine dauerhaften Timer, Poller oder Animationsloops ohne sichtbare Aufgabe. Listen erst filtern/paginieren, virtualisieren nur bei echtem DOM-Problem.
- **Rendering und Assets:** semantisches HTML und SVG; Bildebenen als responsives WebP/AVIF nur wo visuell wertvoll. Fachseiten per `React.lazy`/Router-Code-Splitting laden. Nicht sichtbare Bilder mit `loading="lazy"` (außer dem sichtbaren Hero). Animationen nur über `transform` und `opacity`. Bei `prefers-reduced-motion` und auf schmalen Displays gibt es **keinen Parallax**, stattdessen einen ruhigen Raster-Fallback mit identischer Funktion. Keine Funktion darf von GPU-Effekten abhängen. Zoom 200 %, Tastatur und langsame Netze mitdenken.
- **Daten und APIs (Phase 2):** Payload minimieren (Feldprojektion, Pagination, Filter) und fachliche Queries gezielt zuschneiden; Brotli/Gzip nutzen; SSE nur für aktive Produkte, mit Backoff und Cleanup, kein Dauerpolling; Batch-Jobs idempotent mit Lastbegrenzung, keine Worker im Leerlauf.
- **Messung mit minimalem Overhead:** keine schwere Monitoring-Pipeline auf Verdacht und kein Benchmark pro Commit. CPU/Heap nur bei Auffälligkeit profilieren. **Keine CO₂-/SCI-Zahl für die Software ohne reproduzierbare Energie-/Hardware-/Strommixdaten** (SCI nach ISO/IEC 21031:2024); der Batterie-PCF ist etwas anderes als der Software-Fußabdruck.

## Quality Gates

Härtegrade: **BLOCKER** muss für die betroffene Änderung bestehen, sonst nicht „fertig“. **RELEASE** muss vor der Phase-1-Abnahme bestehen (im Alltag gezielter Smoke statt voller E2E-Suite). **BASELINE** misst und dokumentiert, ohne belastbare Baseline keinen erfundenen Grenzwert erzwingen.

**Ist-Stand der Scripts:** `frontend/package.json` kennt nur `dev`, `build` (= `tsc --noEmit && vite build`), `typecheck` und `preview`. **Lint und Tests sind noch nicht eingerichtet.** Gates, die sie brauchen, gelten erst nach minimaler Einrichtung (ESLint; Vitest/Testing Library; Playwright für E2E). Fehlt ein Script, wird es minimal eingerichtet und das dokumentiert, mit Rückfrage bei neuen Dependencies. Nicht durchführbare Prüfungen werden als **NICHT GEPRÜFT** mit Grund gemeldet, nie stillschweigend als bestanden gezählt. Keine `--if-present`/`|| true` bei Pflichtgates. „Läuft im `npm run dev`“ ist kein Build-/Testnachweis.

| Gate | Härte | Regel | Wann |
| --- | --- | --- | --- |
| G0 | Blocker | Änderung gehört zum Phase-1-Scope; keine ungefragte Backend-/Auth-/Service-Infrastruktur. | jeder Change |
| G1 | Blocker | `npm run typecheck` und `npm run build` in `frontend/` fehlerfrei. | jeder Codechange |
| G2 | Blocker | Lint ohne Errors, keine ungenutzten Imports/Variablen/Dateien (sobald Lint eingerichtet ist). | jeder Codechange |
| G3 | Blocker | Tests für betroffene Logik grün; neue Regeln und Fehlerfälle bekommen Tests (sobald Vitest eingerichtet ist). | Feld-/Hook-/State-/Routing-/Formatierungsänderung |
| G4 | Blocker | Keine hartkodierten Fachwerte in Pages/Karten/Charts; Zugriff nur über `useField`/`useSection`. | Daten-/UI-Change |
| G5 | Blocker | `illustrative` sichtbar, `unavailable` → „nicht verfügbar“, kein `live`; keine implizit echte Compliance-/PCF-/SoH-/Servicebehauptung. | Daten-/UI-Change |
| G6 | Blocker | Aktive Elemente per Maus **und** Tastatur bedienbar, sichtbarer Fokus; Drawer mit Escape, Fokus-Rückgabe und verständlicher Beschriftung; keine Klickattrappen. | interaktive UI |
| G7 | Release | `/` und fünf Fachrouten laden; eine Header-/Sidebar-Implementierung; Batterie → OEM; vier Gruppen „in Vorbereitung“; `productId` bleibt beim Perspektivenwechsel erhalten. | Routing/Shell, Release |
| G8 | Release | Showroom bei `prefers-reduced-motion` und mobil (z. B. 390×844) ohne Parallax nutzbar und ohne unbenutzbare horizontale UI; Kontraste, Alt-Texte, Fokus geprüft. | Showroom, Release |
| G9 | Release | **Initial geladene Showroom-Bilder < 500.000 Bytes** je Profil (Messung siehe unten). Bei Überschreitung vorher den Trade-off klären. | Assetänderung, Release |
| G10 | Baseline | Initiales JS (übertragen), Route-Chunks, LCP und CLS messen; Regressionen untersuchen. | Bundle-/UI-Change, Release |
| G11 | Blocker | Keine unbegründete Dependency, keine unnötigen Requests/Timer, keine doppelten Datenmodelle, kein toter Code. | jeder Change |
| G12 | Blocker | Knapper Abschlussbericht (Format unten). | jeder Change |

**Bildbudget messen:** `npm run build`, dann `npm run preview`. Cold Load ohne Cache, Netzwerklog aufzeichnen, Profile **390×844 DPR 2** (mobil) und **1440×900 DPR 1** (Desktop), Browser-Version und URL festhalten. Summiert werden nur die komprimierten Response-Bodies (`encodedBodySize`) der initial vom Showroom angeforderten `image`-Requests, kein CSS/JS und nicht alle Dateien auf der Platte. Vor Release manuell, bis ein automatisiertes Playwright-Setup existiert; dafür kein eigener schwerer Runner.

**Bundle und Web Vitals:** Zielwerte als Orientierung, noch keine harten Gates: initiales JS ≤ 200 kB komprimiert, LCP ≤ 2,5 s, CLS ≤ 0,1 auf reproduzierbarem Testprofil. Nach abgestimmter Baseline löst eine JS-Transfer-Regression > 10 % oder eine relevante LCP-/CLS-Verschlechterung Warnung und Untersuchung aus. Eine harte Build-Blockade erst nach Abstimmung zu Messstabilität und Baseline. INP ≤ 200 ms nur als Feldmetrik mit realen Daten, nicht aus einem synthetischen Klick.

**Messhäufigkeit:** pro Codeänderung betroffene Tests, Typecheck/Build und statische Checks; pro UI-/Asset-Änderung die betroffene Lade-/Accessibility-Prüfung; vor Release E2E-Smoke und Budget-Check. E2E nicht bei jedem CSS-Edit voll ausführen, aber vollständig bei Shell-/Routing-Änderungen und vor Release.

**Kernfälle für Tests (bei Einrichtung der Testumgebung):**
- Unit/Komponente: `useField` liefert Wert, Einheit, Status, Quelle; fehlender Key → „nicht verfügbar“ (nie leeres Feld); `0` bleibt ein Wert; Statusbadge zeigt `illustrative` korrekt und `live` kommt in Phase 1 nicht vor; Drawer öffnet, schließt mit Escape und gibt den Fokus zurück; Darstellungskomponenten greifen nicht direkt auf `content/*.ts` zu; ein Produktwechsel hinterlässt keinen alten Drawer-/Filter-/Feldkontext.
- E2E-Smoke (Playwright): Showroom zeigt fünf Gruppen und Batterie führt zu OEM; alle fünf Fachseiten erreichbar mit erhaltener `productId` und ohne zweite Shell; jedes aktive Kernelement öffnet den Drawer oder navigiert sinnvoll (Tab → Enter/Space → Escape → Fokus zurück); Mobil- und Reduced-Motion-Ansicht bedienbar; keine „Live“-Behauptung und keine Simulation echter Lieferantenzugriffe.

**Abschlussbericht** (im Chat oder PR-Text, keine neue Log-Datei; kein Eintrag für reine Format-/CSS-Fixes):

```text
Änderung: <eine kurze Aussage>
Entfernt/vereinfacht: <Altcode/Duplikate oder „keine“>
Gates: G1 ✓, G4 ✓ … / NICHT GEPRÜFT (Grund)
Green-Budget: <gemessene Zahl + Profil> oder „nicht betroffen/nicht gemessen“
Offen: <nur echte Risiken/Entscheidungen>
```

README/Komponenten-Doku nur bei tatsächlicher Schnittstellenänderung aktualisieren.

### Phase-2-Gates (erst nach ausdrücklicher Aktivierung)

- `dotnet build` und `dotnet test`; EF-Migrationen und OpenAPI-/generierter TS-Vertrag ohne Drift.
- Positive **und negative** Zugriffstests (OIDC, Feld, Organisation, Objekt); Perspektive ≠ Berechtigung; die öffentliche DPP-/QR-Projektion leakt keine vertraulichen Felder.
- Quell-/Writeback-Bestätigung, Revision/Konflikte/Audit, idempotente Events und SSE-Invalidierung sind testbar; kein `live` ohne Quellbestätigung. Mindestens ein End-to-End-Test über einen echten Test- oder freigegebenen Connector (Quellmasse → Produktmodell → PCF → alle betroffenen Projektionen → Audit/Event); Fixtures nur in isolierten Tests.
- PCF-Formeln und Scope-/CCF-Abgrenzung mit fixierten methodischen Testdaten (Bilanzgrenze, Allokation, Einheiten); keine Doppelzählung über Unternehmensgrenzen.
- API-Latenz, Payload, CPU/RAM und Queryplan erst mit repräsentativem Lastprofil messen. Grenzwerte (z. B. p95) vorab freigeben, nicht ohne Messkontext versprechen.
- Keine Freigabe, solange KPI-Werte in Komponenten hartkodiert sind, unmarkierte Mockdaten angezeigt werden oder eine Änderung nur eine Seite aktualisiert.

## Entwicklung

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173/
npm run typecheck
npm run build      # Typprüfung + Produktions-Build
```

Details zum Serverstart: `Orga/SERVER_STARTEN.md`.
