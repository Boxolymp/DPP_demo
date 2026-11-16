# AAS How-to: Teilmodelle in „Datastructure“ laden

**Stand:** 16.11.2026 · **Ort in der App:** Sidebar → *Data Factory* → *Datastructure* (`/data-factory?item=datastructure`)

Datastructure zeigt AAS-3.x-Teilmodelle einer Batterie nach den sieben IDTA-02035-Batteriepass-Teilmodellen. Die Seite startet leer. Angezeigt wird nur, was in diesem Browser-Tab geladen wurde. Grundlage ist das Übergabepaket „Battery AAS Demonstrator Dev Handoff“ (16.11.2026), umgesetzt nur im Frontend: Es gibt keinen Server und keine Live-Anbindung an ein AAS-Repository.

> Die Anzeige ist **keine** Validierung gegen die IDTA-Templates und **keine** Compliance-Aussage. Die Daten gehören nicht zum Produkt M3 der übrigen Seiten.

---

## 1. Bedienung

| Aktion | Wirkung |
|---|---|
| **JSON-Datei auswählen** | Lädt eine oder mehrere `.json`-Dateien (max. 2 MB je Datei). Das Ergebnis erscheint direkt unter den Buttons. |
| **Beispiel laden** | Lädt die Referenzinstanz aus dem Übergabepaket (Batterie `BAT-2026-0042`, erfundene Demowerte). |
| **Import verwerfen** | Leert den Stand sofort. Danach ist wieder alles „nicht verfügbar“. |

Unter „In diesem Tab geladen“ steht, welche Teilmodelle aktuell geladen sind, aus welcher Datei sie stammen und ob es ein Import oder das Beispiel ist.

Jeder Wert und jede Kachel ist klickbar. Der Detail-Drawer zeigt Datei, Teilmodell-ID, Pfad im Teilmodell, Erkennungsart und Hinweise zur Einheit.

## 2. Wie lange bleiben die Daten?

Die Daten liegen nur im **sessionStorage** des Browser-Tabs (Schlüssel `dpp-demo.aas-session.v1`). Sie werden nicht an einen Server übertragen.

| Situation | Stand |
|---|---|
| Seite neu laden (F5), andere Seite öffnen und zurück | bleibt erhalten |
| Neuer Tab oder neues Fenster | leer |
| Tab oder Browser schließen | gelöscht |
| Nur `npm run dev` beenden, Tab bleibt offen | bleibt erhalten, solange der Tab offen ist |
| „Import verwerfen“ | sofort gelöscht |

In einem privaten Fenster oder bei vollem Speicher funktioniert der Import trotzdem. Die Daten gelten dann aber nur bis zum Neuladen; die Ergebnismeldung weist darauf hin.

## 3. Welche Dateien werden angenommen?

### Formate (AAS 3.x JSON)

1. **AAS-Umgebung:** Objekt mit `assetAdministrationShells` und `submodels` (beides Arrays)
2. **Einzelnes Teilmodell:** Objekt mit `"modelType": "Submodel"`
3. **Einzelne Shell:** Objekt mit `"modelType": "AssetAdministrationShell"`; sie liefert nur die Instanz-ID
4. **Ergebnisliste** einer AAS-API: Objekt mit `result` (Array von Teilmodellen)

AASX-Pakete (ZIP) und XML werden **nicht** unterstützt. Gegebenenfalls vorher als JSON exportieren.

### Nur die sieben IDTA-02035-Teilmodelle

Ein Teilmodell wird zuerst über seine `semanticId` erkannt, ersatzweise über den `idShort`. Die idShort-Erkennung ist nur ein Namensabgleich und wird in der Ergebnismeldung als „nur idShort-Fallback“ ausgewiesen.

| IDTA | Teilmodell | idShort | semanticId (Top-Level) |
|---|---|---|---|
| 02035-1 | Digital Nameplate | `BatteryNameplate` | `https://admin-shell.io/idta/digitalbatterypassport/nameplate/1/0/Nameplate` |
| 02035-2 | Handover Documentation | `HandoverDocumentation` | `0173-1#01-AHF578#003` |
| 02035-3 | Product Carbon Footprint | `CarbonFootprint` | `https://admin-shell.io/idta/CarbonFootprint/CarbonFootprint/1/0` |
| 02035-4 | Technical Data | `TechnicalData` | `https://admin-shell.io/idta/digitalbatterypassport/TechnicalData/1/0` |
| 02035-5 | Product Condition | `ProductCondition` | `urn:samm:io.admin-shell.idta.batterypass.product_condition:1.0.2#ProductCondition` |
| 02035-6 | Material Composition | `MaterialComposition` | `urn:samm:io.admin-shell.idta.batterypass.material_composition:1.0.1#MaterialComposition` |
| 02035-7 | Circularity | `Circularity` | `urn:samm:io.admin-shell.idta.batterypass.circularity:1.0.0#Circularity` |

Zusätzlich gelten die Legacy-Namen `DigitalNameplate` (→ 02035-1) und `ProductCarbonFootprint` (→ 02035-3) als idShort-Fallback.

Alle anderen Teilmodelle werden abgelehnt, zum Beispiel ein DPP-Metadaten-Teilmodell nach IDTA 02099.

### Regeln beim Laden

- **Ersetzen statt doppeln:** Ein neu geladenes Teilmodell ersetzt das vorhandene derselben IDTA-Domäne, egal ob es aus dem Beispiel oder einem früheren Import stammt.
- **Doppelte Domänen in einer Datei:** Nur das erste Teilmodell wird übernommen, die weiteren werden abgelehnt.
- **Shell:** Enthält die Datei eine Shell, ersetzt sie die bisherige. Ohne Shell bleibt die Instanz-ID „nicht verfügbar“.
- Was abgelehnt wurde, steht samt Begründung in der Ergebnismeldung.

### Minimalbeispiel (ein Teilmodell)

```json
{
  "modelType": "Submodel",
  "id": "urn:example:battery:4711:product-condition",
  "idShort": "ProductCondition",
  "semanticId": {
    "type": "ExternalReference",
    "keys": [{ "type": "GlobalReference", "value": "urn:samm:io.admin-shell.idta.batterypass.product_condition:1.0.2#ProductCondition" }]
  },
  "submodelElements": [
    {
      "modelType": "SubmodelElementCollection",
      "idShort": "StateOfCharge",
      "value": [
        { "modelType": "Property", "idShort": "StateOfChargeValue", "valueType": "xs:float", "value": "55" },
        { "modelType": "Property", "idShort": "LastUpdate", "valueType": "xs:dateTime", "value": "2026-11-15T12:00:00Z" }
      ]
    }
  ]
}
```

Eine vollständige Beispielumgebung mit allen sieben Teilmodellen liegt unter [frontend/src/content/aas/idta-inspired-partial-aas.json](frontend/src/content/aas/idta-inspired-partial-aas.json). Das ist dieselbe Datei wie bei „Beispiel laden“.

## 4. Was wird angezeigt?

Die Overview zeigt nur Felder, die der Adapter kennt. Weitere Elemente eines Teilmodells zählen nur bei „Befüllte Elemente“ in dessen Kachel mit.

Gesucht wird zuerst nach dem vollen Pfad, dann nach dem letzten Pfadsegment, jeweils ohne Groß-/Kleinschreibung. Die Spalte „Weitere Pfade“ enthält nicht offizielle Demo-Aliase.

| Anzeige | IDTA | Offizieller Pfad | Weitere Pfade | Einheit |
|---|---|---|---|---|
| Hersteller | 02035-1 | `ManufacturerName` (bevorzugt englische Sprachfassung) | – | – |
| Seriennummer | 02035-1 | `SerialNumber` | `BatteryIdentifier` | – |
| Herstellungsdatum | 02035-1 | `DateOfManufacture` | `ManufactureDate` | – |
| Lebenszyklusstatus | 02035-1 | `LifeCycleStage` | – | – |
| Zertifizierte nutzbare Energie | 02035-4 | `TechnicalPropertyAreas.CapacityEnergyVoltage.CertifiedUsableBatteryEnergy` | – | kWh* |
| Nennspannung | 02035-4 | `TechnicalPropertyAreas.CapacityEnergyVoltage.NominalVoltage` | `NominalVoltageV` | V* |
| Bemessungskapazität | 02035-4 | `TechnicalPropertyAreas.CapacityEnergyVoltage.RatedCapacity` | `NominalCapacityAh` | Ah* |
| Ladezustand (SoC) | 02035-5 | `StateOfCharge.StateOfChargeValue` | `StateOfChargePercent` | % |
| SoC zuletzt aktualisiert | 02035-5 | `StateOfCharge.LastUpdate` | – | – |
| Vollzyklen | 02035-5 | `NumberOfFullCycles.NumberOfFullCyclesValue` | `EquivalentFullCycles` | Zyklen |
| Gesundheitszustand (SoH) | 02035-5 | **kein offizielles Feld** | `StateOfHealthPercent` (nur Demo) | % |
| Zellchemie | 02035-6 | `BatteryChemistry.ShortName` | `BatteryChemistry.ClearName` | – |
| Product Carbon Footprint | 02035-3 | `ProductCarbonFootprints[].ProductCarbonFootprint.PcfCO2eq` + `ReferenceImpactUnitForCalculation` | `TotalCarbonFootprintKgCO2e` | kg CO₂e je Bezugsgröße |
| Lebenszyklusphasen, Batteriematerialien, Gefährliche Stoffe, Rezyklatanteil, Demontage, Übergabedokumente | 02035-3/-6/-7/-2 | jeweilige Liste | – | Anzahl „N Elemente“ |

\* Die Einheit legt der Adapter fest; sie wird nicht aus der Datei gelesen.

**Bewusst nicht abgeleitet:**
- **SoH:** wird nicht aus SoC oder StateOfCertifiedEnergy berechnet.
- **PCF:** wird nicht in Tonnen oder zwischen „je Stück“ und „je kWh“ umgerechnet.
- **Listen:** Inhalte wie Materialmengen werden erst nach einem geprüften Mapping dargestellt. Bis dahin erscheint nur die Anzahl.

## 5. Kennzeichnung

| Status | Darstellung | Bedeutung |
|---|---|---|
| `imported` | „Importiert · ungeprüft“, orange gestrichelt unterstrichen | aus einer eigenen Datei geladen |
| `illustrative` | „Illustrativ“, gepunktet unterstrichen | aus der Beispielinstanz (erfundene Demowerte) |
| `unavailable` | „nicht verfügbar“, kursiv | Teilmodell nicht geladen, Feld nicht befüllt oder kein offizielles Mapping |

`live` gibt es in Phase 1 nicht, auch nicht für importierte Daten. Die Herkunft jedes Werts ist als *nicht verifiziert* markiert.

Die Kachel eines Teilmodells zeigt „vorhanden“, sobald es geladen und erkannt ist. Das sagt nichts über Vollständigkeit oder Rechtskonformität aus.

## 6. Meldungen und was sie bedeuten

| Meldung | Ursache / Abhilfe |
|---|---|
| „Die Datei ist kein gültiges JSON.“ | Syntaxfehler, oder es ist eine AASX- bzw. XML-Datei. Als AAS-JSON exportieren. |
| „Kein unterstütztes AAS-JSON …“ | Keine der vier Formen aus Abschnitt 3 erkannt. |
| „Datei ist zu groß (maximal 2 MB).“ | Datei aufteilen, z. B. einzelne Teilmodelle laden. |
| „Die Datei enthält keine Teilmodelle.“ | Leere Umgebung ohne Teilmodelle und ohne Shell. |
| „Abgelehnt: … kein IDTA-02035-Batterie-Teilmodell …“ | Weder semanticId noch idShort passen zu Abschnitt 3. |
| „Abgelehnt: … kommt in der Datei mehrfach vor …“ | Mehrere Teilmodelle derselben Domäne in einer Datei. |
| „Tab-Speicher nicht verfügbar: Daten gelten nur bis zum Neuladen.“ | Privates Fenster, blockierter Speicher oder volles Kontingent. |
| „nur idShort-Fallback“ | Erkannt nur über den Namen, ohne passende semanticId. Die Teilmodell-Kachel zeigt das im Drawer unter „Erkannt über“. |

## 7. Technik (für Entwickler)

| Datei | Aufgabe |
|---|---|
| [frontend/src/lib/aas/adapter.ts](frontend/src/lib/aas/adapter.ts) | Portierung von `src/aas-adapter.mjs` aus dem Paket: Erkennung, Traversierung, ViewModel. Ohne `base64url`, ohne Node-APIs. |
| [frontend/src/lib/aas/submodels.json](frontend/src/lib/aas/submodels.json) | IDTA-02035-Katalog aus dem Paket (`config/submodels.json`) |
| [frontend/src/lib/aas/session.ts](frontend/src/lib/aas/session.ts) | Tab-Speicher: Import, Ersetzen je Domäne, Ablehnen, sessionStorage, Verwerfen |
| [frontend/src/content/datastructure.ts](frontend/src/content/datastructure.ts) | Übersetzt den Sitzungsstand in `DataField`s und Sektionen, je Stand einmal berechnet |
| [frontend/src/hooks/useContent.ts](frontend/src/hooks/useContent.ts) | `useField`/`useSection` lesen auch die Datastructure-Felder; `useAasSession` für Laden, Beispiel und Verwerfen |
| [frontend/src/features/datastructure/](frontend/src/features/datastructure/) | Overview und Lade-Panel |
| [frontend/src/content/aas/idta-inspired-partial-aas.json](frontend/src/content/aas/idta-inspired-partial-aas.json) | Beispielinstanz, wird erst bei „Beispiel laden“ nachgeladen |

**Datenfluss:** JSON-Datei → `session.importText` → sessionStorage → `useSyncExternalStore` → `datastructureRegistry` (Adapter → ViewModel → `DataField`) → `useField`/`useSection` → Komponenten und Detail-Drawer.

**Neues Feld anzeigen:**
1. Pfad im Adapter (`toViewModel`) ergänzen.
2. In `content/datastructure.ts` als `aasField(...)` aufnehmen.
3. Den Schlüssel in `DatastructureOverview.tsx` einbinden.
4. Einen Test ergänzen.

Offizielle Pfade vorher gegen die IDTA-Spezifikation prüfen und keine Demo-Aliase als offiziell ausgeben.

**Tests:** `cd frontend && npm test`

| Testdatei | Prüft |
|---|---|
| `lib/aas/adapter.test.ts` | identisches ViewModel wie die Paket-Referenz |
| `lib/aas/session.test.ts` | Import, Ersetzen, Ablehnen, Fehlerfälle, Speicher, Verwerfen |
| `content/datastructure.test.ts` | leerer Start, Status `imported`/`illustrative`, SoH, PCF-Bezugsgröße, kein `live` |

## 8. Grenzen

- Kein IDTA- oder AAS-Konformitätsvalidator, keine Rechtsprüfung nach EU 2023/1542.
- Keine Live-Anbindung, kein AASX/XML, keine Rollen oder Feldfreigaben. Das ist erst Phase 2 und dort serverseitig geplant (siehe [CLAUDE.md](CLAUDE.md)).
- Nur eine Batterie-Instanz je Tab; geladene Teilmodelle verschiedener Batterien werden nicht auseinandergehalten.
- Einheiten von Energie, Spannung und Kapazität stammen aus dem Adapter, nicht aus der Datei.
