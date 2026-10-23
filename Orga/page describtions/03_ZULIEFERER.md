# Fachseite 3 — Zulieferer: Mein Beitrag zum Batterie-DPP

**Route:** `/products/:productId/supplier` · optional `?partyId=<id>`  
**Bildreferenz:** [`../assets/04_zulieferer.png`](../assets/04_zulieferer.png)  
**Layout:** gemeinsamer OEM-Header/Sidebar aus [`../README.md`](../README.md); die lieferantenspezifische Navigation aus dem Referenzbild wird als **Seitenanker**, nicht als zweite Sidebar implementiert.

## 1. Zweck und Identitätslogik

Diese Sicht zeigt, **welche konkreten Komponenten, Fertigungsschritte, Emissionen, Transporte und Konformitätsnachweise ein Lieferant zur ausgewählten Batterie bzw. BOM-Revision beiträgt**. Sie bildet die **Datenlieferkette für den OEM** ab, statt Lieferantendaten separat als nicht verknüpfte Beispielkarten vorzuhalten.

**Sichtperspektive frei wechselbar, Dateneigentum nicht frei wählbar:** Der globale Perspektivenumschalter kann auf „Zulieferer“ gesetzt werden. Der `partyId`-Kontext bestimmt, für **welche Partei** Daten sichtbar/bearbeitbar sind; dieser wird aus der Authentifizierung oder einer ausdrücklich genehmigten OEM-Delegation serverseitig bestimmt. Ein manuell geänderter URL-Parameter verleiht **keine** Rechte auf fremde Lieferanten.

## 2. Inhaltsbereiche nach Screenshot

| Position | Baustein | Dateninhalt | Aktion |
| --- | --- | --- | --- |
| A. Headerbereich | `PageHero` | „Zulieferer — Mein Beitrag zum Batterie-DPP“ und Produktkontext | Produkt wechseln |
| B. Verantwortungsprozess | `SupplierValueChain` | vorgelagerter Materialeingang → Fertigung → Qualität → Transport → OEM-Übergabe, inkl. an-/abgrenzbarer Nachbarprozesse | Prozessknoten/Facility öffnen, eigene Prozessgrenzen sichtbar |
| C. Produktbeitrag | `SupplierContributionCard` | zugeordnete echte Artikel/Materialien (z. B. Kathodenmaterial), Menge/Masse, Spezifikation, Lieferform, interne IDs, DPP-Bezug | Material öffnen, bei Recht aktualisieren, BOM-Zuordnung sehen |
| D. Compliance | `SupplierComplianceGrid` | CCF, PCF, PPWR, Material-, Transport- und Qualitätsdaten jeweils mit realem Abdeckungs-/Prüfstatus | Qualitätsregeln/fehlende Belege öffnen |
| E. Nachweise | `EvidenceTable` | Dokumente, Typ, Status, gültiger Zeit-/Chargenbezug, Originalquelle, Hash/Version | berechtigt anzeigen, herunterladen, ersetzen/einreichen |
| F. Transport | `ShipmentTimeline` | reale Sendungen, Etappen, Carrier, Menge, Transportart, Ziel, Emissionen und Zeitpunkt | Sendungsdetail / Datenherkunft öffnen |
| G. Impact | `ContributionImpactChart` | Materials/Fertigung/Transport als abgegrenzte Beiträge und historische Vergleichsmethode | Datenbasis, Scope/PCF-Drill-down |

**Referenzhinweis:** Das im Screenshot sichtbare Beispiel „Kathodenmaterial NMC622“, IDs, Prozent-Status und datierte Nachweise sind **keine Standarddatensätze**. Die konkret angezeigten Beiträge kommen aus den vorhandenen `BOMLine ↔ Component ↔ SupplierContribution`-Beziehungen. Wenn kein relevanter Beitrag existiert: expliziter Empty State, **kein fiktiver NMC622-Beitrag**.

## 3. Datenbeziehungen und Scope

### 3.1 Lieferantenbeitrag → OEM-Produkt

Ein Beitrag ist nur gültig, wenn die Relation vollständig ist:

```text
OEM ProductRevision
 └─ BOMLine (Stückzahl, Gültigkeit, Version)
     └─ Component / Material (eigene ID, Masse, Qualität, Spezifikation)
         ├─ SupplierContribution (Lieferant, Werk, Charge, Zeitraum)
         ├─ ProcessStep / Measurements (Werk, Fertigung, Energie etc.)
         ├─ Shipment (Menge, Start/Ziel, Transportfaktoren)
         └─ Evidence (Material-/Konformitäts-/Qualitätsnachweise)
```

**Schlüssel:** `productId`, `productRevisionId`, `bomLineId`, `componentId`, `supplierPartyId`, optional `supplierSiteId`, `batchId`, `shipmentId`, `evidenceId`. IDs werden über Integrations-Mappings auf reale ERP/PLM/MES/TMS/QMS-Referenzen abgebildet. **Bei Änderung eines Lieferantenmaterials aktualisiert der Änderungsgraph alle betroffenen OEM-Produkte und BOM-Revisionen**, nicht nur eine Kachel.

### 3.2 Zustände und Compliance

- **Status je Datenpflicht** wird berechnet: `complete`, `in_review`, `open`, `invalid`, `unknown` auf Basis von Pflichtfeldern, Aktualität, Referenznachweisen und Prüfungen. Die Anzeige „100 %“ bedeutet ausschließlich **erfüllte, für diese Datenpflicht konfigurierte Checks**; niemals automatisch eine gesetzliche Gesamtkonformität.
- **CCF** steht für Corporate Carbon Footprint des Lieferanten (organisationsbezogen). **PCF** ist der allokierte Produktbeitrag (produktbezogen). Beide sind gesondert abrufbar und werden **nicht einfach addiert**.
- **PPWR** bezieht sich auf relevante Verpackungsanforderungen; Anforderungen und Geltung per Version des Rule Sets entscheiden, nicht das Label des Screenshots.
- `Evidence` verweist auf Original/DMS und enthält Gültigkeit, Freigabe und Berechtigung. Abgelaufene Zertifikate dürfen nicht als grün angezeigt werden.
- **Emissionsimpact:** Lieferantenemissionen müssen einer Charge/Anlage/Aktivität nach klarer Methode dem Material/Produkt zugeordnet werden, bevor sie in OEM-PCF eingehen.

## 4. Interaktionen

### 4.1 Verantwortungsbereich und Material

- Highlight des eigenen Abschnitts im Netzwerk; Upstream/Downstream-Knoten ggf. sichtbar, aber für fremde vertrauliche Felder nur abstrahiert.
- Klick auf Komponente zeigt genutzte BOM-Linien, zugehörige OEM-Produktrevision(en) **innerhalb der Berechtigung** und verpflichtende Datenfelder.
- Berechtigter Edit einer Materialmasse, Zusammensetzung oder Charge erfolgt **über die führende Lieferanten-/PLM-Quelle** per bestätigtem Command/Writeback; readonly bei fehlendem Schreibpfad.
- Änderungen dürfen keine ungeprüfte Überschreibung des OEM-Stammdatensatzes auslösen; Eigentum/Source-of-Truth-Konflikte als Workflow zur Klärung behandeln.

### 4.2 Nachweise einreichen / Qualität

- `EvidenceTable` unterstützt serverseitiges Sortieren/Filtern nach `status`, `type`, `batch`, `validUntil`, `source`.
- Einreichen/Ersetzen ist ein autorisierter API-Workflow in ein **echtes** DMS/SCM-System mit Hash, Dateitypprüfung, Prüferstatus, Audit und Versionierung. Kein bloß lokaler Browser-Upload ohne Speicherung.
- „In Prüfung“/„Abgelehnt“/„Gültig“ sind Realdaten; Statuswechsel werden per Event auf OEM-DPP und Datenvollständigkeits-Kennzahl fortgeführt.

### 4.3 Transport / PCF

- Sendungsliste aus TMS/ERP mit `origin`, `destination`, `mass`, `carrier`, `distance`, `mode`, `timestamp`, `shipmentId` und den zulässigen Emissionsdaten; keine optisch dargestellte Lkw-Etappe ohne zugrundeliegende Sendung als reale Lieferung verkaufen.
- Transportemissionen und Material-/Prozess-Emissionsanteile fließen **methodisch zugeordnet** in die FootprintPage. Organisationsemissionen bleiben davon unabhängig als Scopes im jeweiligen Reporting-Kontext.
- Ändert sich ein Materialgewicht und beruht die Transportallokation auf tatsächlicher Gütermasse, wird der Allokationswert neu berechnet; ist die Transportbelastung eine unabhängige tatsächliche Messung, ändert sie sich **nicht automatisch**.

## 5. End-to-End-Beispiel: Änderungsdurchstich

1. Lieferant aktualisiert Masse einer freigegebenen Komponente in seiner autoritativen Material-/PLM-Quelle.
2. Integrationsadapter identifiziert `componentId`, betroffene Chargen und BOM-Linien; validiert Eigentümerschaft und Quellrevision.
3. Plattform aktualisiert die Produkt-Massenaggregation und alle **erklärbar abhängigen** Emissions-/Transport-/DPP-Projektionen.
4. OEM sieht gewichteten Beitrag und Impact, CO₂-Seite die veränderte Komponenten-/Prozessallokation, Endkunde nur freigegebene Felder. Auf der Lieferantenseite sind neuer Wert, Quellstatus und betroffene Verknüpfungen sichtbar.
5. Bei fehlender PCF-/Materialdatenbasis zeigt der Lieferant die offene Datenanforderung; andere Seiten zeigen `PCF unvollständig` und keine angenommene Zahl.

## 6. Akzeptanzkriterien (Zulieferer)

- [ ] Nur an der gewählten Produktrevision **wirklich beteiligte** Lieferanten/Materialbeiträge erscheinen; fremde Beiträge sind korrekt verborgen/aggregiert.
- [ ] Zugeordnete `bomLineId`, `componentId` und `supplierPartyId` stimmen mit OEM-/CO₂-Ansicht überein und sind drill-down-fähig.
- [ ] Supplier-Perspektive ist für jeden auswählbar; **Änderungs- und Detailrechte** bleiben nach Authentifizierung/Partei serverseitig begrenzt.
- [ ] Nachweise lassen sich nur bei Berechtigung aus einer realen Dokumentquelle lesen/aktualisieren; Prüfstatus basiert auf gültigen Kriterien.
- [ ] `CCF` und `PCF` werden konzeptionell und rechnerisch unterschieden; die Herkunft der Allokationsdaten ist prüfbar.
- [ ] Ein bestätigter Material-/Massen-Writeback verändert seine abhängigen OEM-/CO₂-/DPP-Werte ohne manuelles Kopieren.
- [ ] Transportdaten beruhen auf echten Shipment-IDs; fehlende Strecken/Emissionen sind sichtbar als unvollständig.
- [ ] Status und Prozent-Kennzahlen werden aus konfigurierbaren Pflichtprüfungen generiert, nicht aus Screenshot-Texten.
