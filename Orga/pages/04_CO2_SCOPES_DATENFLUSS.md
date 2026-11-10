# Fachseite 4 — CO₂ & Scopes: Wertschöpfung und Daten-Röntgenblick

**Route:** `/products/:productId/footprint` · Filter optional `?stage=...&nodeId=...&mode=scopes|pcf`  
**Bildreferenz:** [`../assets/05_co2_scopes.png`](../assets/05_co2_scopes.png)  
**Layout:** Das dunkle, immersive Prozessbild ist **nur Seitengestaltung innerhalb** der gemeinsamen OEM-basierten Shell. Der eigenständige dunkle Header und die Sidebar der Referenz **werden nicht als zweite AppShell nachgebaut**. Siehe [`CLAUDE.md`](../../CLAUDE.md).

## 1. Zweck und fachliche Leitplanken

Die Seite erklärt die **Entstehung und Aggregation emissionsrelevanter Daten**: Wo in der Wertschöpfung entstehen Emissionen, welche Unternehmens-Scopes 1–3 werden betrachtet, was davon trägt **unter klarer Allokation** zum Product Carbon Footprint (PCF) der Batterie bei und aus welchen realen Quellsystemen stammen die Werte?

**Methodischer Kern:**

- **Scope 1/2/3** sind Kategorien von **Unternehmensemissionen innerhalb einer definierten organisationalen Bilanzgrenze**. Dass eine Zellfertigung vor Ort Scope 1 ausweist, macht sie beim OEM nicht automatisch zu Scope 1; sie kann im OEM-Kontext Teil vorgelagerter Scope-3-Emissionen sein.
- **PCF** ist eine **produktbezogene Lebenszyklusbilanz** mit funktioneller Einheit, Produkt-/BOM-Version, definierten Systemgrenzen, Faktoren, Allokationen und Methodik.
- Die Seite darf die zwei Betrachtungen parallel erklären und verknüpfen, **nicht rechnerisch vermischen oder doppelt zählen**. „Unternehmens-Scopes“ braucht eine **ausgewählte `organizationId` und `reportingPeriod`**; PCF braucht Produkt-/Revisions-ID und Funktionsbasis.

## 2. Inhaltsbereiche nach Bild

| Bereich | UI-Komponente | Live-Daten / Funktion |
| --- | --- | --- |
| A. Titel + Modus | `FootprintHero`, `FootprintModeSwitch` | „CO₂ & Scopes entlang der Wertschöpfung“, Modi `Unternehmens-Scopes (1–3)` und `Produkt-CO₂ (PCF)`; sichtbare Bilanzgrenze |
| B. Prozesslandschaft | `LifecycleStageGraph` | Rohstoffe, Material-, Zell-, Modul-/Packfertigung, Distribution, Nutzung, End-of-Life/Recycling; `stageId`, `facilityId`, `partyId` aus Wertschöpfungsgraph |
| C. Scope-Legende | `ScopeLegend` | Scope 1 direkt, Scope 2 bezogene Energie, Scope 3 vor-/nachgelagert, **bezogen auf gewählte Organisation** |
| D. Selektionskarte | `StageContributionCard` | selektierte Stufe mit Werk-/Akteur-ID, Emissionen/Anteilen, Qualität, Quellen, organisationsspezifischer Scope-Klassifikation |
| E. Info/Regulatorik | `MethodologyAndRulePanel` | methodische Grenzen, verwendete Bilanzierungsregeln, Versionsstand von DPP-/PCF-Anforderungen; kein eingebranntes Datum |
| F. untere Sicht | `DataXRayPanel` | **Tabs: Datenfluss / Semantik & Mapping / Auswirkungen** und Drill-down zur aktiven Stufe |
| G. Datenfluss | `SourceSystemsPanel` → `SemanticIntegrationLayer` → `FootprintCalculationPanel` → `DppOutputPanel` | echte Inputs, Harmonisierung, Formeln, Qualitätschecks, aggregierter PCF und veröffentlichte Felder |

Das Referenzbild setzt exemplarisch „Zellfertigung“ in den Fokus und zeigt ERP/MES/LCA/PLM/Logistik. Es ist ein **Muster für die Datenpipeline**, kein Beweis, dass jedes dieser Systeme heute bei jedem Kunden angebunden ist.

## 3. Daten-Röntgenblick: verbindliche vierteilige Pipeline

### 3.1 Quellsysteme & Daten — links

Zeige für die **konkret ausgewählte** Lifecycle-Stufe nur tatsächliche Quellen, z. B.:

- `ERP`: bezogene Energie, Material- und Produktionsmengen, Standorte, Kosten (Kosten nur berechtigt).
- `MES`: Produktionsmengen, Ausschuss, Durchlauf-/Prozessdaten, Anlagen, Chargen.
- `LCA / EF-Datenbank`: spezifische Emissionsfaktoren, Herkunft, Gültigkeit, Methodik, Geografie.
- `PLM`: BOM, Material, Gewicht, Chemie, Revisionsstände und Verarbeitungsprozesse.
- `Logistik/TMS`: Materialtransporte, Sendungsmassen, Distanzen, Verkehrsträger.
- `BMS/IoT`: reale Nutzungs-/Batteriezustandsdaten, soweit für methodische Bilanz relevant und erlaubt.

**Jede Datenleitung** repräsentiert eine auflösbare Beziehung `sourceRecord → canonicalEntity → calculatedMetric`. Kein Logo oder Pfeil als scheinbare Integration, wenn kein Connector besteht; in diesem Fall **„nicht angebunden“** mit offener Datenanforderung.

### 3.2 Semantik- und Integrationsschicht — Mitte

Die Mitte zeigt als **eigene fachliche Sicht**, wie Daten zusammengeführt werden (nicht als Kopie einer Systemsicht in fünf Dashboards):

1. **Datenharmonisierung:** Schematypen, Einheiten, Begriffe, Zeitzonen, Geografie, Gültigkeit, semantische Keys und Quality Gates.
2. **Produkt- und Prozessreferenzen:** `ProductRevision ↔ BOMLine ↔ Component ↔ Facility ↔ ProcessStep ↔ reportingPeriod` als nachvollziehbarer Graph.
3. **Berechnung & Allokation:** emissionsrelevante Mengen × valide Faktoren × passende Allokation; konfigurierbare Methodik und Versionsstand.
4. **Datenqualität:** Vollständigkeit, Plausibilität, veraltete Werte, fehlende Faktoren, Herkunftsnachweise und (wo verfügbar) Unsicherheit.
5. **AAS / Semantische Strukturen:** Bei vorhandener Asset Administration Shell werden AAS-IDs und Submodelle semantisch gemappt; die UI **visualisiert** Herkunft/Transformation, erstellt keine parallelen AAS-Datensätze je Seite.

Jeder Schritt klickbar: Eingabe-IDs, Mapping-Regel, transformierter Wert, Rechenversion, Zeitpunkt und Datenstatus. Die Semantik darf **keine impliziten Annahmen** verbergen (z. B. kg vs. t oder funktionelle Einheiten pro Pack vs. pro kWh).

### 3.3 Ergebnis für den Batteriepass — rechts Mitte

- `FootprintResult` mit `productRevisionId`, `stageId`, `value`, `unit`, `functionalUnit`, `methodVersion`, `calculatedAt`, `dataCoverage`, `sourceRefs`, Status.
- Scope-Aufschlüsselung in einer Unternehmensansicht gehört zum gewählten `organizationId`-Kontext. Dieselben Emissionen können im **PCF-Modus** als anteiliger Produktbeitrag auftauchen, werden aber **nicht** additiv über Scope-Dashboards summiert.
- Phasenbeiträge kumulieren nur bei kompatiblen Faktoren/Grenzen/Basiseinheiten zu `PCF_total`. Recyclinggutschriften/Allokationsregel für End-of-Life explizit ausweisen, nicht unkommentiert abziehen.
- Prozentanteile nur, wenn Nenner definiert und > 0 sowie Summe prüfbar. **Keine Beispielzahl wie 28,4 kg CO₂e aus dem Screenshot übernehmen.**

### 3.4 Einfluss auf DPP — rechts

- Zeige exakt, welche veröffentlichten `DPPField`-Werte sich aus dem aktuell berechneten `FootprintResult` ableiten.
- **Data lineage:** DPP-Feld → PCF-Ergebnis → Berechnungsregel → Aktivitätsmessungen → Faktoren → Quellen. Fehlende Freigabe/Qualität verhindert irreführende Publikation.
- Klick öffnet denselben gemeinsamen `EntityDrawer` und ggf. Endkundenprojektion (nur öffentlich freigegebene Felder).

## 4. Drei Daten-Röntgenblick-Tabs

| Tab | Funktion | Konkrete Interaktion |
| --- | --- | --- |
| **Datenfluss** | Quelle → Transformation → Ergebnis → Veröffentlichung mit Einheiten und Zeitständen | Klick auf Kante/Knoten zeigt Quelle und Feldmapping |
| **Semantik & Mapping** | semantische Schlüssel, AAS-Submodelle (sofern vorhanden), Relationsgraph, Mappingkonflikte, Quell-/Master-Ownership | Mappingregel öffnen, fehlerhafte Einheit und Konflikt markieren |
| **Auswirkungen** | ChangeSet, Before/After, inkrementell neu berechnete Kennzahlen und Qualitätsfolgen | betroffene Felder hervorheben, OEM-/Zulieferer-/Endkunden-Deep-Link |

Die Tabs verändern **nur** den Inhalt des Röntgenblicks, nicht die Shell oder globalen Produkt-/Revisionskontext.

## 5. Interaktionen und konsistente Berechnung

### 5.1 Stage- und Moduswahl

- Ausgewählte Lifecycle-Stufe ist zentraler UI-State und per URL `stage=` teilbar; alle unteren Panels filtern auf denselben `stageId`.
- Umschalten `scopes ↔ pcf` ändert **Bilanzgrenze, Klassifikation, Aggregation und Labels**; zeigt keine einfach farblich umetikettierten identischen Zahlen.
- Scopes-Modus verlangt eine wirksame Organisation, einen Berichtszeitraum und passende Scope-Daten. Fehlt einer der Parameter: Eingabe-/Hinweiszustand, **keine Scope-Behauptung**.

### 5.2 Gewichtsänderung aus PLM / Lieferantenbeitrag

1. Eine relevante `Component.mass`-Revision wird bestätigt und mit `ProductRevision`/BOM/ProcessStep verknüpft.
2. Der Impact-Graph markiert **betroffene** Massen-, Material-, Logistik- und EoL-Aktivitätsdaten. Neu berechnet wird nur, was nach dokumentierter Methode von Masse abhängt.
3. `FootprintResult` erhält eine neue Rechenversion/einen neuen Ergebnisstand; Pipeline markiert eventuell fehlende Faktoren/Allokationen; die OEM-KPI und erlaubte DPP-Daten verwenden denselben Ergebnisstand.
4. In **„Auswirkungen“** zeigt `SourceTrace` die Änderung `Quelle → normalisierte Masse → geänderte Aktivitätsmenge → PCF-Betrag → DPP-Feld`.
5. Scope 1/2 des Werks bleiben z. B. bei unveränderten gemessenen Standortemissionen **gleich**; nur produktbezogene Allokation kann sich ändern. Keine Doppelzählung.

### 5.3 Historie und Versionen

- Vergleiche nur Werte mit gleichen Bilanzgrenzen, Funktionsgrößen und Methoden; anderenfalls `nicht vergleichbar` statt einer irreführenden Prozentänderung.
- Fehlende Quellen, abgelaufene Faktoren oder noch nicht fertige Neuberechnungen sind in jeder Resultatkarte gekennzeichnet.
- Delta-/Vergleichsmodus zieht Daten aus echten historischen Revisionen, nicht aus händisch gesetzten alten Screenshot-Werten.

## 6. Akzeptanzkriterien (CO₂ & Scopes)

- [ ] Prozess-/Röntgenblick sind visuell am Bild orientiert, aber in die **OEM-GlobalShell** eingebettet.
- [ ] Scope-Modus setzt bzw. verlangt `organizationId` + `reportingPeriod` und zeigt organisationsbezogene Scope-Klassifikationen.
- [ ] PCF-Modus setzt `productRevisionId`, Funktionsbasis, Lebenszyklusphasen und Rechenmethode voraus.
- [ ] Für eine selektierte Stufe führen alle gezeigten Quellen-/Mapping-/Berechnungskanten zu **realen IDs**; fehlende Connectoren werden eindeutig als fehlend ausgewiesen.
- [ ] Die fünf Transformationsschritte (Harmonisierung, Referenzen, Berechnung, Qualität, Semantik/AAS) sind über den Röntgenblick nachvollziehbar, ohne duplicative Stammdatenspeicherung.
- [ ] Klick auf Fußabdruckwert liefert Faktoren, Aktivitätsdaten, Allokation, Bilanzgrenze, Revision, Rechenstand.
- [ ] Eine bestätigte Gewichtsänderung ändert nur abhängige Produkt-PCF-Teilergebnisse und ggf. freigegebene DPP-Felder; unbetroffene Organisationsemissionen bleiben stabil.
- [ ] Inkompatible Scope- und PCF-Werte werden **niemals** unbesehen addiert; Tests schützen vor doppelter Zählung.
- [ ] Wenn Faktor/Quelle fehlt, wird die betroffene Berechnung gesperrt oder als unvollständig ausgewiesen; keine Demo-Zahl ausgegeben.
- [ ] „Auswirkungen“ verweist auf dasselbe `ChangeSet` wie die OEM-Seite, inklusive Before/After und Herkunftskette.
