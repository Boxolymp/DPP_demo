# Fachseite 5 — Aftersales Experience: Erkennen. Handeln. Weiterentwickeln.

**Route:** `/products/:productId/aftersales` · optional `?serialId=...&useCase=...`  
**Bildreferenz:** [`../assets/06_aftersales.png`](../assets/06_aftersales.png)  
**Layout:** gemeinsamer OEM-Header/Sidebar, siehe [`CLAUDE.md`](../../CLAUDE.md). Die Showroom-Gestaltung mit Fahrzeug, Batterie und Engineering-Station ist **Seitencanvas**, nicht eine eigene App-Navigation.

## 1. Zweck und Leitidee

Der Aftersales-Showroom macht aus dem **DPP als verknüpfter Produktidentität** konkrete Services über Nutzung, Wartung, Reparatur, Wiederverwendung und Rückführung. Dabei sind zwei technische Ebenen auseinanderzuhalten:

1. **DPP-/PLM-Produktdaten:** Produktmodell, BOM, Komponentenrevision, Materialien, zulässige Ersatzteile und Reparaturanleitungen.
2. **Instanz- und Ereignisdaten:** serien-/chargenspezifische Telemetrie (BMS/IoT), tatsächliche Servicefälle, Reparaturen, Garantien, Rückrufe und Eigentümer-/Nutzungsberechtigungen.

Beide Ebenen werden **über `ProductInstance(productRevisionId, serialId)` verknüpft**. Ohne reale Serien-/Telemetrieanbindung **kein** erfundener SoH-Wert, Fehlerfall, Fahrzeugstandort oder prädiktives Risiko. Wo nur ein Modell bekannt ist, sind generische freigegebene Anleitungen/Ersatzteiloptionen möglich, aber kein vorgetäuschter Instanzstatus.

## 2. Inhaltsaufbau nach Bild

| Bereich | UI-Baustein | Inhalt | Interaktion |
| --- | --- | --- | --- |
| A. Hero | `AftersalesHero` | „Erkennen. Handeln. Weiterentwickeln.“, kurz erklärter Lifecycle-Loop | Produkt-/Instanzwahl |
| B. Verbindungsgrafik | `FieldToEngineeringFlow` | reale Verbindung Fahrzeug/BMS → Analyse/Qualität → Engineering/PLM → Service-/Produktanpassung, Datenrichtungen | auf Knoten klicken → zugrunde liegende Systeme und Events |
| C. Use-Case-Panel | `FeaturedUseCasePanel` | ausgewählter Use Case, z. B. Field Feedback; **reale** relevante Events, verknüpfte Maßnahmen, Status | Ereignis-/Fall-Detail, „Zum Use Case“ |
| D. „Erkennen“ | `RecognizeUseCases` | Field Feedback, Batteriegesundheit (SoH), Fälschungsprüfung, Predictive Maintenance, Rückruf-/Risikoerkennung | Use-Case-Drawer bzw. Workflow |
| E. „Handeln“ | `ActUseCases` | Ersatzteilbestellung, Kompatibilitätsprüfung, digitale Reparaturanleitung, Garantie/Service, Servicehistorie | Fall, Artikel, Anleitung oder Bestellung öffnen |
| F. „Weiterentwickeln“ | `ImproveUseCases` | Field-to-Design-Feedback, Second Life/Remanufacturing, Restwertbewertung, Recycling-Optimierung | Change Request / Bewertungsnachweis / Recovery Case öffnen |
| G. Quellenzeile | `ConnectedDataSources` | DPP, BMS, PLM, Qualitäts-/Service-/Logistikquellen mit echtem Verbindungsstatus | Quelle und Synchronisierungsstand öffnen |

**Showroomprinzip:** Die Karten sind **Einstiege in echte, verknüpfte Daten und Aktionen**. Eine schöne leere Karte kann als Feature-Discovery erhalten bleiben, muss dann **„nicht angebunden / nicht verfügbar“** anzeigen. Keine Fallback-Beispielereignisse wie „Temperaturanstieg vor 2 Tagen“, wenn es dieses Ereignis nicht gibt.

## 3. Verknüpftes Aftersales-Datenmodell

```text
ProductRevision / BOM
 ├─ SparePartCompatibility (Teil ↔ Produktrevision ↔ Serien-/Chargenbereich)
 ├─ RepairInstruction (Dokument, Sprach-/Versionsbezug, Freigabe)
 ├─ Material/Recycling/PCF (für Restwert und EoL, falls Daten existieren)
 └─ ProductInstance (serialId, batchId, manufacturedAt)
     ├─ Telemetry / BMSMeasurement (Zeit, Signal, Messgröße, Quelle)
     ├─ ServiceEvent / RepairOrder (Fehler, Maßnahme, ausgeführtes Ersatzteil)
     ├─ Warranty / Recall / QualityCase (Status, Region, Gültigkeit)
     ├─ FieldFeedback (Quelle, Klassifizierung, Einwilligung)
     └─ SecondLifeCase / EoLEvent (Zustand, Übergang, Verwertung)
                  ↓ verknüpfter Änderungsprozess
            EngineeringChangeRequest → PLM ChangeSet → neue ProductRevision
```

**Minimal-IDs:** `productId`, `productRevisionId`, ggf. `serialId`, `caseId`, `partId`, `compatibilityRuleId`, `serviceEventId`, `workOrderId`, `telemetrySourceId`, `changeRequestId`. Instanz und Produktrevision müssen korrekt miteinander verbunden sein. Jede Kennzahl und Entscheidung hat **Quelle, Zeitpunkt, Algorithmus/Regel, Qualität**.

## 4. Fachliche Use Cases und Funktionslogik

### 4.1 Erkennen

| Use Case | Live-Quellen und Logik | Ergebnis/Interaktion |
| --- | --- | --- |
| **Field Feedback** | freigegebene Telematik-/BMS-Ereignisse, Service-/CRM-Tickets, Kundenrückmeldungen über echte Schnittstellen | reale Ereignisliste, Häufigkeit/Cluster, Problem pro Revision/Charge, Detail → Maßnahme / Engineering-Feedback |
| **Batteriegesundheit (SoH)** | Serienbezug, BMS-Messungen, zulässige SoH-Methode inkl. Kalibrierung und Zeitpunkt | aktueller SoH **nur** bei gültiger Berechnung, Trend und Datenqualität |
| **Fälschungs-/Plagiatsprüfung** | realer DPP-/Serialisierungsnachweis, signierte Kennung, Hersteller-/Partnerregister und geeignete Prüfregeln | Status `verifiziert`, `verdächtig`, `nicht prüfbar`; nie absolute Echtheit ohne belastbare Grundlage |
| **Predictive Maintenance** | ausreichende Zeitreihen, validiertes Regel-/Prognosemodell inkl. Versionsstand und Unsicherheit | Risikoindikator/Maßnahme; ohne geeignetes Modell `nicht verfügbar` statt generischer KI-Prognose |
| **Rückruf-/Risikoerkennung** | QMS-/Recall-System, Serien-/Chargen-Gültigkeitsfenster, Service-/Qualitätsmeldungen | nur tatsächlich betroffene Instanzen; priorisierte Sicherheits-/Servicehinweise |

### 4.2 Handeln

| Use Case | Daten & Regeln | Ergebnis/Interaktion |
| --- | --- | --- |
| **Ersatzteilbestellung** | PLM/BOM + echter Ersatzteilkatalog/ERP, Artikelverfügbarkeit, Pricing nur bei Berechtigung | passendes Teil auswählen, **echten Bestell-/Anfrageprozess** starten oder klar „Anbindung fehlt“ zeigen |
| **Kompatibilitätsprüfung** | Hardware-/Firmwarestand, Revision, Serien-/Chargenrange, Kompatibilitätsregeln und Freigaben | `kompatibel`, `nicht kompatibel`, `ungeklärt` mit Begründung und Referenz |
| **Digitale Reparaturanleitungen** | freigegebene, versions-/seriengebundene DMS-/PLM-Anleitungen, Land/Sprache/Sicherheitsstufe | richtige Anleitung öffnen, Warnungen und Befähigung/Berechtigung prüfen |
| **Garantie & Service** | tatsächliche Garantie-/Vertragsbedingungen, Servicefälle, berechtigter Akteur | Anspruchs-/Statusprüfung, Ticket/Arbeitsauftrag anlegen; kein pauschales Garantieversprechen |
| **Servicehistorie** | CRM/FSM/Werkstatt-/Service-Aufträge mit Zeit, Teil und Arbeit, ggf. Eigentümerfreigabe | chronologische, auditierbare Instanzhistorie inkl. realer Belege |

### 4.3 Weiterentwickeln

| Use Case | Daten & Wirkung | Ergebnis/Interaktion |
| --- | --- | --- |
| **Field-to-Design-Feedback** | aggregierte, freigegebene Fehler-/Service-Muster → echte PLM-/Engineering-Änderungsanfragen | `EngineeringChangeRequest` mit betroffenen Revisionen, Fällen, Verantwortung, Status |
| **Second Life / Remanufacturing** | Batterie-SoH, Sicherheitsprüfungen, Material-/Komponentenstatus und anwendbare Prozessregeln | belegte Eignung/Beurteilung, nächster Prozessschritt; ohne Prüfgrundlage `nicht bewertbar` |
| **Restwertbewertung** | zulässige SoH-/Service-/Marktdaten, Kosten- und Restnutzungsmodell mit Datum/Methode | **nachvollziehbare** Bewertung mit Prämissen und Bandbreite; kein pauschaler Fantasiepreis |
| **Recycling-Optimierung** | Materialzusammensetzung/Massen, Demontagefähigkeit, dokumentierte Recovery-/EoL-Prozesse | Material-/Massenpotenziale und Rückführungsoptionen, nur bei validen Prozessbeziehungen |

## 5. Zentrale Interaktionen

### 5.1 Kontext: Produkt versus konkrete Batterie

- Grundauswahl über Header `productId`. Jede instanzbezogene Karte verlangt `serialId` oder `batchId` und prüft deren Berechtigung.
- Wenn nur Produkttyp/Revision vorliegt: modellbezogene Reparatur-/Material-/Kompatibilitätsdaten zeigen; SoH, Vorfälle, Garantieeinzelfall und tatsächliche Servicehistorie **nicht** vortäuschen.
- Bei Klick auf Karte `useCase=` in URL setzen, globalen `EntityDrawer` oder fachlichen Workflow öffnen. Event-Detail mit Quelle, Datum, Serien-/Chargenbezug und erlaubter Aktion.

### 5.2 Field Feedback → Engineering → aktualisierte Produktdaten

1. Ein **reales** Field-/Service-Ereignis wird unter berechtigter Produktinstanz erfasst/importiert und einem Fehlerbild zugeordnet.
2. Qualitäts-/Engineering-Prozess erstellt nachvollziehbar `EngineeringChangeRequest` mit Verweisen auf Ereignisse, betroffene Chargen/Produktrevisionen und Entscheidung.
3. Nur ein **genehmigter, in PLM bestätigter** Design-/BOM-Wechsel erzeugt eine neue Produktrevision. Feedback allein verändert **keine** technischen Spezifikationen.
4. Auf bestätigter Revision fließen betroffene BOM-/Material-/Massen-Änderungen über denselben `ChangeSet`- und Berechnungsgraph in OEM, Lieferant, CO₂, DPP und relevante Aftersales-Informationen.
5. Alte, ausgelieferte Produktinstanzen behalten ihren historischen Revisionsstand; Service-/Retrofit-Workflow muss ausdrücklich dokumentieren, falls eine Instanz tatsächlich aufgerüstet wurde.

### 5.3 Gewichtsänderung — Wirkung im Aftersales

**Kein automatischer Sprung von „Gewicht neu“ zu „Batteriegesundheit neu“**. Nur nachvollziehbar betroffene Aftersales-Aspekte aktualisieren:

- Teile-/Materialmasse in Reparatur-/Demontageinformationen, Transport-/Versandgewicht, recyclingrelevante Stoffströme und ggf. Restwert-Berechnungen **wenn das jeweilige Modell diese Attribute nutzt**.
- Kompatibilität oder Sicherheitsgrenzen **nur** wenn die konkrete Freigaberegel Masse/Revision referenziert.
- **Nicht** automatisch: gemessene SoH, reale Feldereignisse, bestehende Servicehistorie, Garantiefristen oder Rückrufstatus.
- Anzeigen: Ergebnisstand, Ursache, Änderungskette, betroffene Produktrevision; fehlende Integrationen/Faktoren sichtbar.

## 6. Zugriff, Datenschutz und Fehlerfälle

- OEM: berechtigte Sicht auf Produkt-/Flottenaggregation, technische Änderungsprozesse, Qualitätsfälle.
- Endkunde: ausschließlich eigene/öffentlich zugängliche Instanz- und Servicefunktionen; keine Flottentelematik oder fremde personenbezogene Daten.
- Zulieferer: nur eigene relevante Komponenten-/Rückruf-/Qualitätsfälle sowie explizit freigegebene Event-Ausschnitte.
- `Public`/QR-Aufruf: nicht automatisch ungekürzte Servicehistorie/Telemetrie. Sensible Zugriffe erfordern eindeutige Autorisierung und, wo nötig, Einwilligung.
- Ausfall BMS/CRM/DMS/ERP: pro Use Case `Quelle nicht verfügbar`, `letzter Datenstand`, ggf. `Aktion derzeit nicht möglich`; kein stilles Dummy-Ergebnis.
- Sicherheitskritische Reparatur-/Rückrufhinweise benötigen Validierung, Version und angemessene Autorisierung; die Demo ersetzt keine technische Freigabe.

## 7. Akzeptanzkriterien (Aftersales)

- [ ] Showroom zeigt die drei Gruppen **Erkennen / Handeln / Weiterentwickeln** mit allen aufgeführten Use Cases, gemeinsame AppShell unverändert.
- [ ] Karten öffnen sinnvolle Detail-/Workflow-Ansichten; **nicht integrierte** Funktionen kennzeichnen ihren echten Verfügbarkeitsstatus klar.
- [ ] Reale Telemetrie/Servicefälle sind an autorisierte `serialId`/`batchId` und die richtige Produktrevision gebunden; kein beliebiger „Beispielfall“ wird als real gezeigt.
- [ ] Ohne Seriendaten erscheinen **keine** SoH-, Event- oder Servicehistorie-Fantasiewerte.
- [ ] Kompatibilitätsprüfung verwendet verifizierte BOM-/Revisions-/Serienregeln; `ungeklärt` ist ein zulässiges Ergebnis.
- [ ] Digitale Reparaturanleitungen und Nachweise werden aus der richtigen aktuellen Originalquelle inkl. Freigabe geladen.
- [ ] Ein genehmigter EngineeringChangeRequest mit PLM-Writeback aktualisiert abhängige Produkt-/DPP-Werte in den anderen vier Ansichten.
- [ ] Eine Material-/Gewichtsänderung ändert **nur fachlich begründete** Aftersales-Daten, nicht historische Serviceevents/SoH.
- [ ] Endkunden-/Lieferantenrechte werden serverseitig erzwungen und erlauben keinen Zugriff auf fremde Telemetrie oder Servicefälle.
- [ ] Für jedes gezeigte Ergebnis ist der Quellstatus und (falls Berechnung) die verwendete Regel/Version verfügbar.
