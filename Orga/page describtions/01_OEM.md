# Fachseite 1 — OEM: Batterie und Wertschöpfung

**Route:** `/products/:productId/oem`  
**Bildreferenz:** [`../assets/02_oem.png`](../assets/02_oem.png)  
**Layout:** `<AppShell>` (Header + Sidebar **ausschließlich** aus der OEM-Referenz, siehe [`../README.md`](../README.md)). Die hier beschriebenen Komponenten ersetzen nur `<RouteOutlet>`.

## 1. Zweck und Nutzerwert

Die OEM-Perspektive verbindet **Produktdefinition, aktuelle BOM, Wertschöpfungsnetzwerk, Designentscheidungen, Compliance und Umweltauswirkungen**. Ziel ist kein loses Kennzahlen-Dashboard, sondern ein steuerbarer Einstieg in die unternehmensübergreifende Datenkette: **Welche Änderung am Produkt wirkt wo, warum und mit welchem Datenbeleg?**

**Kernakteur:** OEM-Engineering/Sustainability/Produktmanagement mit organisationsabhängigen Lese-/Schreibrechten. Jeder Nutzer kann die OEM-Perspektive auswählen; Rechte bestimmen den tatsächlich sichtbaren Umfang.

## 2. Seitenaufbau nach Screenshot

| Position | UI-Baustein | Pflichtinhalt aus Live-Daten | Aktion |
| --- | --- | --- | --- |
| A. Hero | `PageHero` | „OEM — Batterie und ihre Wertschöpfung“, produktbezogene Unterzeile, Produktrevision | Produkt-/Revisionskontext öffnen |
| B. Produktkarte links | `ProductSummaryCard` | Produktname, Batterie-/Produkteigenschaften, Kapazität, Nennspannung, **Gewicht**, Zyklenziel bzw. belegte Leistungsdaten, DPP-Status | KPI → Herkunft / PLM-Feld; Produkt → Detail-Drawer |
| C. Lebenszyklus Mitte | `ValueChainGraph` | reale Schritte/Akteure: Rohstoffe → Zellen → Modul/Pack → OEM-Integration → Logistik → Nutzung → Second Life → Recycling; Beziehungen linear/zirkulär | Knoten öffnet Akteur/Facility/Charge, verknüpfte Einträge und Quellen |
| D. Engineering rechts | `EngineeringPanel` | Zellchemie, Materialien, Produktarchitektur, Reparatur/Demontage, DPP-Datenbereitschaft | `ComponentDrawer`, zugehörige BOM, PLM-Dokumente, Nachweise |
| E. Änderungsimpact | `DesignChangeImpact` | ausgewählte bestätigte Änderung oder **explizite Vorschau** mit PCF-, Kosten-, Recycling-, Compliance- und DPP-Effekten (je nach verfügbaren Quellen) | Änderungs-Panel, Vorher/Nachher und Begründung |
| F. Lifecycle-KPI | `FootprintLifecycleChart` | Product Carbon Footprint mit Phasen, funktioneller Einheit und Summe; optional Baseline-Diff | CO₂/Scopes-Seite mit Filter auf Produkt und betroffene Phase |
| G. untere Kacheln | `LifecycleInformationGrid` | Material/Lieferanten, Fertigung/Qualität, DPP, Logistik, Nutzung, Second Life, Recycling | Fokus/Deep-Link auf korrespondierende Entitäten bzw. Seiten |

**Wichtig:** Die im Screenshot dargestellten Werte wie „82 kWh“, „800 V“, „540 kg“, „> 4.000 Zyklen“, „-18 %“ oder „82 g CO₂e/kWh“ sind **nur Gestaltungsmuster**. Alle Werte werden mit Quellen-, Revisions-, Einheiten- und Qualitätsangabe berechnet/geladen; ohne Quelle `nicht verfügbar`. KPIs, die nicht sinnvoll berechenbar sind (z. B. Recyclingquote ohne zuverlässige Material- und Prozessdaten), bleiben leer statt geschätzt.

## 3. Datenbedarf / gemeinsame Entities

- **Product / ProductRevision:** `productId`, `name`, `revisionId`, `lifecycleStatus`, `batteryType`, `nominalCapacity`, `nominalVoltage`, `assemblyMass`, `cycleLife` (jeweils `sourceRef`, `validity`, `unit`).
- **BOM / Material:** `bomRevisionId`, `BOMLine(parentId, componentId, quantity, unit)`, `componentMass`, `chemistry`, `recycledContent`, `recyclability`, `sourceRefs`. Gesamtgewicht folgt definierter BOM-Massenbilanz oder verifiziertem Mastergewicht; etwaige Abweichung sichtbar ausweisen.
- **Value Chain:** `Party`, `Facility`, `ProcessStep`, `Shipment`, `inputOutputRelationship`, `loopType`, `supplierContribution`, Evidenz-/Sichtbarkeitsbezug.
- **Engineering:** PLM-Konstruktions-/Materialzustand, Demontierbarkeit, Reparaturinformationen, Version und Änderungsauftrag.
- **Footprint:** `FootprintResult` mit `functionalUnit`, `lifecycleStage`, `methodVersion`, `factorVersion`, `dataCoverage`, `uncertainty`, berechneten Teilbeiträgen und prüfbarem Gesamtergebnis.
- **DPP/Compliance:** veröffentlichbare Felder, Nachweise, regulatorische Regelversion, Validierungsstatus; **„DPP Ready“ nur als Ergebnis nachvollziehbarer Regeln**, nicht als feste Kennzeichnung.
- **Kosten:** Kostenmodell/Basis nur bei realer berechtigter ERP-/Controlling-Anbindung; sonst Auswirkungskarte ausblenden/`nicht verfügbar`, niemals simulieren als Tatsache.

Daten werden über die in der Übersicht genannten Entitäten und Query-Services geladen. **OEM, Lieferant, CO₂ und Endkunde nutzen dieselben IDs**, keine abweichenden lokalen Produktobjekte.

## 4. Interaktionen und Navigation

### 4.1 Produktkarte und Engineering

- Klick auf Gewicht → `EntityDrawer` mit Quellgewicht, Komponenten-BOM, Masseeinheit, **Revisions-/Gültigkeitsstand**, Quelle und ggf. `Edit` für autorisierte PLM-Felder.
- **Bearbeiten** erstellt einen validierten Änderungsbefehl (`expectedSourceRevision`, `componentId`/`productId`, `newValue`, `unit`, `reason`); **kein lokales Überschreiben** der React-State-Kennzahl als dauerhafter Ersatz.
- Bei read-only PLM/MES bleibt die Kennzahl **nicht** direkt editierbar; stattdessen `Änderung im Quellsystem` / Änderungsantrag. Quellbestätigung und Update-Status sind im Drawer sichtbar.
- Material- und Zellchemie-Karten öffnen betroffene Komponenten und zugehörige Lieferantenbeiträge (nur bei Berechtigung). Revisionswechsel zeigt aktuelle Ist-Daten bzw. klar ausgewiesene historische Daten.

### 4.2 Wertschöpfungsnetzwerk

- Jeder Knoten trägt mindestens `entityId`, `type`, `label`, `source`, `status`; Linien sind echte gespeicherte Beziehungen.
- Ein Knoten selektiert denselben Akteur/Prozess und kann zu `SupplierPage` (eigener/zulässiger Beitrag) oder `FootprintPage` (gleiche Phase/Facility) führen.
- Kreislaufverbindungen dürfen nur angezeigt werden, wenn Second-Life-/Recycling-/Rücknahmebeziehungen oder dokumentierte allgemeine Prozessstruktur im Modell vorhanden sind; **keine fiktive physische Sendung** suggerieren.
- `Scope-/Actor-Filter` zeigt definierte Lieferkette und ggf. fehlende Datenabdeckung transparent.

### 4.3 Änderungswirkung und Szenarien

Zwei **visuell klar getrennte Modi**:

1. **„Bestätigte Änderung“**: verknüpftes `ChangeSet` aus echtem PLM-/ERP-/Lieferanten-Writeback; erst nach bestätigter Übernahme als aktuelle Revision sichtbar. Anzeigen: Trigger, Before/After, betroffene Komponenten, korrigierte Aggregationen, Status, Quellen und Audit-ID.
2. **„Was-wäre-wenn“** (optional als UX-Demonstration): isolierte, nicht persistierte Vorschau auf Basis **realer Ausgangsdaten und realer Berechnungsregeln**, `PREVIEW / nicht im Produktpass veröffentlicht` prominent markieren. `Verwerfen` setzt unveränderte Ist-Revision zurück; `Übernehmen` nur über autorisierten Änderungs-Workflow und Bestätigung der Masterquelle.

**Referenzmotiv Zellchemie:** Die Umstellung NMC811 → NMC622 im Bild illustriert einen möglichen Änderungsfall, **nicht** automatisch die aktuelle Chemie im Gesamtprodukt. Eine Chemieänderung ist nicht nur ein Grafik-Diff: Materialliste, Zuliefererdaten, Energie, Verarbeitung und Faktoren müssen an die neue gültige BOM-/Prozessrevision gebunden sein. Bei fehlenden Daten **keinen Prozent-Effekt erfinden**.

### 4.4 CO₂ und DPP

- Diagramm und Impact-Karten werden ausschließlich aus derselben `FootprintResult(productId, revisionId, methodVersion, functionalUnit)` gespeist wie die CO₂-Seite.
- Klick auf Balken einer Lebenszyklusphase → `/products/:productId/footprint?stage=...`; Erklärung der Bilanzgrenze und Quellbeiträge.
- Klick auf „DPP-Daten im Detail öffnen“ zeigt versionierte Daten-/Evidenzfelder und deren Freigabe; öffentlich sichtbare Teilmenge entspricht der Endkundenansicht.

## 5. Gewichtsänderung — konkreter OEM-Ablauf

1. Im Engineering-/BOM-Drawer ist für **eine reale Komponente** ein PLM-Massenwert mit Revision sichtbar.
2. Berechtigter Nutzer ändert ihn; Backend prüft Recht, Einheiten und Revisionskonflikt, schreibt ins führende Quellsystem und wartet auf dessen Rückmeldung.
3. Nach Bestätigung erzeugt das Backend `ChangeSet`, aggregiert Produktmasse über tatsächlich betroffene BOM-Linien und aktualisiert die davon abhängigen PCF-Beiträge/Transport-/Recyclingwerte **falls die erforderlichen Datenbeziehungen existieren**.
4. `ProductSummaryCard`, `DesignChangeImpact` und `FootprintLifecycleChart` erhalten die neue `productRevision`; die DPP-Informationen, CO₂-Seite und freigegebenen Endkunden-/Supplier-Werte folgen derselben Revision.
5. Nicht betroffene Werte (z. B. Nennspannung, ein unabhängiges Serviceevent) bleiben unverändert. Bei Datenlücken erscheint `Berechnung ausstehend / unvollständig` statt einer erfundenen Aktualisierung.

## 6. Akzeptanzkriterien (OEM)

- [ ] A–G sind entsprechend Bildhierarchie erkennbar, aber alle Datenwerte dynamisch; gleiche gemeinsame Shell wie auf den übrigen vier Seiten.
- [ ] Produktwechsel aktualisiert Produktkarte, Lifecycle-Knoten, Engineering-Panel und KPIs **auf dieselbe Produktrevision**.
- [ ] Klick auf Gewicht/Material/Phase bietet eine echte Detailansicht mit Quell-ID, Zeitpunkt und Berechnung; kein Platzhalter-Link.
- [ ] Eine autorisierte PLM-Massenänderung erscheint nach Bestätigung im OEM-Dashboard und aktualisiert abhängige Kennzahlen in den anderen Sichten ohne Seiten-Neuladen.
- [ ] `ChangeSet` weist Before/After und betroffene Werte aus; bei Rechen-/Syncausfall werden Status und Teilabdeckung sichtbar.
- [ ] Ein unberechtigter User sieht keinen aktivierten Edit-Button und kann den Command auch nicht über die API absetzen.
- [ ] Vorschauwerte werden niemals als „aktuell“ markiert oder in den öffentlichen DPP übernommen.
- [ ] PCF-Gesamtwert = Summe der **vergleichbaren und korrekt allokierten** Lebenszyklusbeiträge; gleiche Definition wie CO₂-Seite.
- [ ] Unbekannte oder fehlende reale Daten erzeugen explizite Empty-/Quality-States statt Bild-Beispielwerte.
