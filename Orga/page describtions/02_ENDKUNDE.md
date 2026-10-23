# Fachseite 2 — Endkunde: Batterie-Pass auf einen Blick

**Route:** `/products/:productId/customer` (eingeloggter Perspektivenwechsel)  
**Öffentlicher Einstieg:** `/p/:publicToken` → **dieselbe Endkunden-Content-Komponente** mit Public-Policy, keine sechste Fachseite  
**Bildreferenz:** [`../assets/03_endkunde.png`](../assets/03_endkunde.png)  
**Layout:** gemeinsamer OEM-Header/Sidebar aus [`../README.md`](../README.md), nicht die eigenständige Shell des Endkunden-Screenshots.

## 1. Zweck

Der Produktpass beantwortet für eine konkrete Batterie bzw. — wo erforderlich — **konkrete Seriennummer/Charge** leicht verständlich: Was ist das Produkt? Woher kommen freigegebene Daten? Wie ist seine Umweltwirkung? Welche Reparatur-/Serviceangebote sind relevant? Die öffentliche Sicht ist eine **gefilterte Projektion derselben Live-Daten** wie OEM, Lieferant, CO₂ und Aftersales.

**Wichtig:** „öffentlich“ bedeutet nicht „sämtliche internen Daten“. Offenlegung erfolgt pro Feld aufgrund geprüfter Disclosure-Policy, ggf. Produkt-/Batterietyp, Akteur und gültigem Regelstand. Ein Endkunde kann als gewählte Perspektive angesehen werden; ein anonymer QR-Aufruf hat strikt weniger oder dieselben Rechte, nicht mehr.

## 2. Inhaltsbereiche nach Bild

| Position | Komponente | Fachlicher Inhalt | Interaktion |
| --- | --- | --- | --- |
| A. Headline | `PageHero` | „Endkunde — Batterie-Pass auf einen Blick“, ausgewähltes Produkt | Zurück zur Produktauswahl |
| B. Geräte-/Pass-Vorschau | `BatteryPassportPreview` | Produktbezeichnung/-typ, freigegebene Kennwerte, öffentlicher DPP-Status, Produkt-/Serienidentifikator, ggf. Umwelt-KPI, Recyclinganteil, Herkunft und nutzerrelevante Hinweise | KPI-Detail, „DPP öffnen“ in dieser Seite, QR teilen/scannen |
| C. QR-Baustein | `PassportQrCard` | **Echt auflösbare** Adresse zur Public-Projektion eines Produkts/einer Instanz | öffnet dieselbe Endkundenansicht mit geeignetem Public-Token |
| D. Nutzenkacheln | `BenefitCards` | Einfach verstehen, Vertrauen, Reparatur & Garantie, Nachhaltige Entscheidung | Sprung zu jeweiligem Inhalt; Marketingtexte statisch erlaubt, fachliche Aussagen datenbelegt |
| E. Öffentliche DPP-Kategorien | `PublicDppGrid` | Produktinformationen, Umwelt & CO₂-Fußabdruck, Materialien & Rezyklate, Nutzung/Garantie/Reparatur, Herkunft/Lieferkette | Kategorie öffnet gefilterte Daten, Nachweise und Begriffsdefinitionen |
| F. Schlussbereich | `SustainabilityMessage` | allgemeine Einordnung und ggf. belegbarer Nutzen | keine erfundenen Produktspezifika |

**Achtung:** Die Referenz zeigt u. a. beispielhafte IDs, CO₂-Werte, Recyclinganteile und Garantiezeiten. Sie **dürfen nicht** aus dem Bild oder Frontend als Produktwerte übernommen werden. Ohne freigegebene Quelle die betroffene Kachel gezielt mit „Information noch nicht verfügbar“ versehen oder ausblenden.

## 3. Public-DPP-Projektion / benötigte Daten

Die Seite lädt **keine OEM-Rohdaten** und filtert nicht ausschließlich im Browser. Backend baut eine freigegebene `CustomerDppProjection` aus gemeinsamem Graph und gültiger Disclosure-Policy.

| Datenklasse | Herkunft | Freigabebedingung |
| --- | --- | --- |
| Produkt-ID, Typ, Modell, Revision | PLM / Serialisierung | öffentliche Kennung / öffentliche Version |
| Batteriechemie/Material | BOM / Lieferantenbeiträge | zugelassene Aggregation, keine geschützten Rezepturen/Preise |
| Produktgewicht und Kapazität | PLM / BOM | validierte Einheit, aktueller Revisionsstand, freigegeben |
| PCF, Materialanteil, Recyclinganteil | Footprint/Recyclingmodell | Methode, funktionelle Einheit, Abdeckung und Qualitätsstatus erfüllt |
| Herkunft, Lieferkette | Party/Facility/Shipment | Offenlegungs- und Geschäftsgeheimnisregeln, ggf. aggregiert |
| Garantiedaten, Sicherheits-/Reparaturhinweise | Service / PLM / Rechtstexte | Serien-/Marktbezug und Gültigkeit geklärt |
| Produkt-/Chargenstatus | Qualität / DPP-Prüfung | Veröffentlichung nach Policy, nicht ungeprüft aus Screenshot |

**DPP-Feldmodell:** `dppFieldId`, `semanticKey`, `value`, `unit?`, `productId`, `revisionId`, `publicClassification`, `ruleSetVersion`, `sourceRefs`, `dataAsOf`, `quality`. Für Instanzen zusätzlich `serialId` / `batchId`; Änderung nur auf betroffene Produktvarianten bzw. Serien übertragen.

## 4. Interaktionen und UX

### 4.1 QR und Public Access

- QR wird **serverseitig** aus einem gültigen, revokierbaren Public-Identifier/Token oder persistenten öffentlichen Identifier erzeugt; verweist wirklich auf dieselbe Produkt-/Instanz-Projektion.
- Ein QR aus Batterie `P` darf nicht auf Batterie `Q` führen; Token erlaubt keine Änderung oder Zugriff auf interne Rohdaten.
- Bei abgelaufenen/gesperrten Tokens verständliche Fehlerseite **im Endkunden-Content**, keine internen Metadaten verraten.
- Mobile Darstellung muss auch ohne OEM-Desktop-Layout sinnvoll bleiben (gemeinsame Shell als responsives, reduzierbares Element; Öffentlicher Aufruf darf nur autorisierte Header-/Sidebar-Aktionen bieten).

### 4.2 DPP-Kategorien

- Jede Kategorie enthält wenige verständliche Werte und eine optionale **„Mehr erfahren“**-Ebene mit Methodik, Quellenart, Datum und Definition.
- Bei CO₂-Werten einheitliche *funktionelle Einheit* (z. B. pro kWh, sofern methodisch korrekt); niemals stillschweigend Gesamt-PCF und spezifischen PCF verwechseln.
- Bei Materialien und Recyclingquote Definition/Grundgesamtheit erklären, etwa Recyclinganteil vs. Rezyklierbarkeit vs. tatsächliche Rückgewinnungsquote — nicht austauschbar.
- Herkunft und Lieferkette nur in erlaubter Granularität; geheime Lieferantendaten bleiben auf API-Ebene entfernt.
- „Reparatur & Garantie“ zeigt zutreffende und aktuelle Produkt-/Serienhinweise; führt in die **zulässige** Aftersales-Funktion oder autorisierte Servicekontaktstrecke.

### 4.3 Live-Aktualität

- Die Public-Projektion wird nach bestätigter relevanter Änderung (z. B. BOM-Gewicht) **erneut publiziert**, wenn Offenlegungsregeln das Feld gestatten und die Datenqualität ausreicht.
- Bei einer laufenden Neuberechnung alter Wert **sichtbar als in Aktualisierung** oder temporär ohne Zahl, nie unbemerkt als frisch ausgeben.
- `dataAsOf`, `publicationRevision` und `dataQuality` stehen in den Detailinformationen zur Verfügung.
- Eine neue Produktrevision kann andere geltende Werte haben; für eine einzelne Batterieinstanz dürfen Revisionen nicht fälschlich rückwirkend gemischt werden.

## 5. Rechte und Datenschutz

- **Öffentlicher Zugriff:** nur Public-Projektion, kein `Evidence`-Original mit Geschäftsgeheimnissen, kein ungeschützter OEM-/Lieferantenendpunkt, keine Schreibzugriffe.
- **OEM-/Lieferantenperspektive → Endkunde:** frei wechselbar, aber Endkunden-Ansicht stellt die tatsächlich öffentlich freigegebene Information dar, nicht interne Zusatzfelder.
- **Serienbezogene Daten:** Telemetrie, Kundendaten, Standorte, Garantiefälle oder Servicehistorie nur nach gesonderter Berechtigung/Einwilligung und notwendigem Zweck sichtbar; standardmäßig nicht öffentlich.
- **Berechtigungsnachweise** serverseitig prüfen; negative Tests gegen direkte API-Aufrufe und Token-Manipulation.

## 6. Akzeptanzkriterien (Endkunde)

- [ ] Seite entspricht in ihren Content-Bausteinen dem Endkunden-Bild, aber rendert in **derselben OEM-basierten AppShell**.
- [ ] Ein erzeugter QR-Code führt zu der **richtigen realen Produkt-/Instanzansicht**, nicht zu einer Demo-URL ohne Datenbezug.
- [ ] Produktdetails, CO₂ und öffentliches Gewicht sind mit OEM/CO₂ für die **gleiche Revision, Methode, Einheit und Berechtigungsprojektion** konsistent.
- [ ] Eine bestätigte relevante Massendifferenz im PLM bewirkt die Aktualisierung des **freigegebenen** Gewichts und ggf. des neu berechneten PCF ohne manuelles Nachtragen.
- [ ] Fehlende/gesperrte Informationen werden sauber ausgelassen bzw. als fehlend angezeigt; keine frei erfundenen Produktwerte.
- [ ] Interne Lieferantenpreise, Dokumente und BMS-Rohdaten sind weder über UI noch über API oder QR zugänglich.
- [ ] Kategorien und Reparaturinformationen führen zu funktionierenden Detaildaten bzw. autorisierten Serviceaktionen.
- [ ] Für CO₂-/Recyclingwerte sind Definition, Einheit, Datenstand und belegbare Methode einsehbar.
- [ ] Mobile QR-Nutzung und barrierearme Bedienung (Kontrast, Fokus, Tastatur, sinnvolle Alternativtexte) sind getestet.
