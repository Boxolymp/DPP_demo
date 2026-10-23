import { createContent, fld, link, PAGES } from './builder';

const c = createContent();

c.add(
  'oem.product',
  'Traktionsbatterie M3',
  'Die Produktkarte fasst die wichtigsten Kennwerte der Batterie zusammen. Im Echtbetrieb stammen sie aus dem PLM und werden mit der BOM abgeglichen.',
  [
    fld('oem.product.name', 'Produktname', 'Traktionsbatterie M3', { src: 'PLM' }),
    fld('oem.product.capacity', 'Nennkapazität', 82, { unit: 'kWh', src: 'PLM' }),
    fld('oem.product.voltage', 'Nennspannung', 800, { unit: 'V', src: 'PLM' }),
    fld('oem.product.mass', 'Gewicht', 540, {
      unit: 'kg',
      src: 'PLM / BOM',
      desc: 'Gesamtmasse. Sie wird aus den Komponentenmassen der BOM abgeleitet oder mit einem führenden Gesamtgewicht abgeglichen; Abweichungen werden angezeigt, nicht überschrieben.',
      related: [link('CO₂ & Scopes', PAGES.footprint)],
    }),
    fld('oem.product.cycles', 'Zyklenziel', '> 4.000', { unit: 'Zyklen', src: 'PLM' }),
    fld('oem.product.dppStatus', 'DPP-Status', 'DPP Ready', {
      src: 'Regelwerk',
      tone: 'ok',
      desc: 'Ergebnis nachvollziehbarer Regeln aus einem versionierten Regelwerk, keine feste Kennzeichnung.',
    }),
  ],
  [link('Öffentliche Sicht (Endkunde)', PAGES.customer)],
);

const chain: [string, string, string, string, string?][] = [
  ['raw', 'Rohstofflieferant', 'Gewinnung und Aufbereitung von Lithium, Nickel, Kobalt, Graphit und weiteren Rohstoffen. Hier beginnt die Datenkette: Herkunft und Abbaubedingungen.', 'Herkunft, Materialien, Lieferkette'],
  ['cell', 'Zellhersteller', 'Herstellung der Batteriezellen. Hier entsteht ein großer Teil der Emissionen; Energie- und Prozessdaten fließen in den Produkt-CO₂-Fußabdruck.', 'Prozessdaten, Energie, Qualitätsnachweise', 'footprint'],
  ['module', 'Modul-/Packhersteller', 'Zellen werden zu Modulen und Packs zusammengebaut. Die Stückliste (BOM) verbindet alle Komponenten mit ihren Lieferanten.', 'Stückliste, Massen, Chargen', 'supplier'],
  ['oem', 'OEM Fahrzeugintegration', 'Einbau der Batterie ins Fahrzeug. Der OEM verknüpft Produktrevision und Fahrzeug- bzw. Seriennummer.', 'Produktrevision, Seriennummer'],
  ['logistics', 'Logistik & Distribution', 'Transporte zwischen den Stationen. Sendungsmassen, Strecken und Verkehrsträger bestimmen die Transportemissionen.', 'Sendungen, Strecken, Emissionen', 'supplier'],
  ['use', 'Nutzung im Fahrzeug', 'Betrieb der Batterie. Nutzungs- und Zustandsdaten aus dem Batteriemanagementsystem ermöglichen Service und Rückmeldung an die Entwicklung.', 'Zustand, Zyklen, Servicefälle', 'aftersales'],
  ['secondlife', 'Second Life / Remanufacturing', 'Weiterverwendung nach dem Fahrzeugleben, z. B. als stationärer Speicher, oder Wiederaufarbeitung.', 'Zustand, Restwert, Eignung', 'aftersales'],
  ['recycling', 'Recycling & Kreislaufwirtschaft', 'Demontage und Rückgewinnung der Rohstoffe, die wieder in die Kette zurückfließen (zirkulärer Fluss).', 'Demontage, Stoffströme, Rezyklate', 'aftersales'],
];

for (const [id, title, summary, data, page] of chain) {
  c.add(
    `oem.chain.${id}`,
    title,
    summary,
    [
      fld(`oem.chain.${id}.actor`, 'Akteur / Standort', undefined, {
        src: 'ERP / SCM',
        desc: 'Wird nach der Datenanbindung aus dem Lieferantennetzwerk geladen.',
      }),
      fld(`oem.chain.${id}.data`, 'Beteiligte Daten', data, { src: 'DPP' }),
    ],
    page ? [link('Zur Fachseite', PAGES[page as keyof typeof PAGES])] : [],
  );
}

const eng: [string, string, string, string, string][] = [
  ['chemistry', 'Zellchemie', 'Zellchemie des Produkts. Eine Änderung wirkt auf Materialliste, Lieferanten, Prozessenergie und CO₂-Faktoren.', 'NMC811', 'PLM'],
  ['materials', 'Materialien', 'Hauptmaterialien des Packs mit Masse und Herkunft.', 'Aluminium, Stahl, Graphit, …', 'PLM / BOM'],
  ['architecture', 'Produktarchitektur', 'Aufbau des Packs aus Modulen. Die modulare Bauweise erleichtert Reparatur und Austausch.', 'Modularer Aufbau', 'PLM'],
  ['repair', 'Demontage & Reparatur', 'Verbindungstechnik und Reparierbarkeit. Wichtig für Ersatzteile und Recycling.', 'Schraub- statt Klebeverbindungen', 'PLM'],
  ['dppdata', 'DPP-relevante Daten', 'Daten, die für den Produktpass automatisch aus der Entwicklung übernommen werden.', 'Automatisch aus der Entwicklung', 'Semantic Layer'],
];
for (const [id, title, summary, value, src] of eng) {
  c.add(
    `oem.eng.${id}`,
    title,
    summary,
    [
      fld(`oem.eng.${id}.value`, title, value, {
        src,
        desc:
          id === 'chemistry'
            ? 'Im Szenario-Bild wird eine Umstellung von NMC811 auf NMC622 gezeigt. Maßgeblich ist später immer die aktuelle, versionierte Revision.'
            : undefined,
      }),
    ],
    [link('Beitrag der Zulieferer', PAGES.supplier)],
  );
}

c.add(
  'oem.impact',
  'Auswirkung einer Design-Änderung (Vorschau)',
  'Zeigt, wie eine Änderung (Beispiel: Zellchemie) auf CO₂, Kosten, Recycling, Compliance und Datenpunkte wirkt. Eine Vorschau ist keine bestätigte Änderung und wird nie in den Produktpass übernommen.',
  [
    fld('oem.impact.co2', 'CO₂-Fußabdruck', '-18', { unit: '%', src: 'Berechnungsdienst', tone: 'ok' }),
    fld('oem.impact.cost', 'Kosten (Zellmaterial)', '-6', { unit: '%', src: 'ERP / Controlling', tone: 'ok', desc: 'Nur bei berechtigter Controlling-Anbindung verfügbar.' }),
    fld('oem.impact.recycling', 'Recyclingfähigkeit', '+24', { unit: '%', src: 'Recyclingmodell', tone: 'ok' }),
    fld('oem.impact.compliance', 'Compliance', 'Risiko gesenkt', { src: 'Regelwerk', tone: 'ok' }),
    fld('oem.impact.dpp', 'DPP-Daten', '+3 neue Datenpunkte', { src: 'Semantic Layer' }),
  ],
  [link('CO₂ & Scopes', PAGES.footprint)],
);

c.add(
  'oem.lifecycle',
  'Lifecycle Impact',
  'Der Produkt-CO₂-Fußabdruck (PCF) je Lebenszyklusphase, bezogen auf eine kWh Kapazität. Die Summe ist dieselbe Zahl wie auf der Seite CO₂ & Scopes.',
  [
    fld('oem.lifecycle.raw', 'Rohstoffe', 28, { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('oem.lifecycle.cells', 'Zellen', 16, { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('oem.lifecycle.modules', 'Module/Packs', 18, { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('oem.lifecycle.use', 'Nutzung', 14, { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('oem.lifecycle.eol', 'End-of-Life', 6, { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('oem.lifecycle.total', 'Gesamt', 82, {
      unit: 'kg CO₂e/kWh',
      src: 'Berechnungsdienst',
      desc: 'Summe der vergleichbaren, korrekt allokierten Phasenbeiträge. Funktionelle Einheit und Methodenversion werden später mit angezeigt.',
    }),
  ],
  [link('CO₂ & Scopes', PAGES.footprint)],
);

const dpp: [string, string, string, string, string][] = [
  ['materials', 'Materialien & Lieferanten', 'Herkunft, Materialien, Lieferkette', 'Welche Materialien stecken im Produkt und woher kommen sie?', 'supplier'],
  ['quality', 'Fertigung & Qualität', 'Prozessdaten, Qualitätsnachweise', 'Nachweise zur Fertigung und Qualität einzelner Chargen.', 'supplier'],
  ['dpp', 'DPP-relevante Informationen', 'Produktdaten, Nachweise, Compliance', 'Die freigegebenen Felder des Produktpasses mit Nachweisen.', 'customer'],
  ['logistics', 'Logistik & Distribution', 'Transporte, Standorte, Emissionen', 'Sendungen und Transportemissionen entlang der Kette.', 'supplier'],
  ['use', 'Nutzung & Performance', 'Echtzeitdaten, Alterung, Reichweite, Zyklen', 'Zustand und Leistung im Betrieb.', 'aftersales'],
  ['secondlife', 'Second Life / Remanufacturing', 'Zustand, Wiederverwendung, Reparatur', 'Eignung für eine zweite Nutzung.', 'aftersales'],
  ['recycling', 'Recycling & Kreislaufwirtschaft', 'Demontage, Stoffströme, Rezyklate', 'Rückgewinnung von Rohstoffen.', 'aftersales'],
];
for (const [id, title, data, summary, page] of dpp) {
  c.add(
    `oem.dpp.${id}`,
    title,
    summary,
    [fld(`oem.dpp.${id}.data`, 'Enthaltene Informationen', data, { src: 'DPP' })],
    [link('Zur Fachseite', PAGES[page as keyof typeof PAGES])],
  );
}

export const oemContent = { fields: c.fields, sections: c.sections };
export const oemChainIds = chain.map(([id]) => `oem.chain.${id}`);
export const oemEngIds = eng.map(([id]) => `oem.eng.${id}`);
export const oemDppIds = dpp.map(([id]) => `oem.dpp.${id}`);
