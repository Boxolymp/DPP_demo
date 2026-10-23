import { createContent, fld, link, PAGES } from './builder';

const c = createContent();

const stages: [string, string, string, string, [number, number, number]?][] = [
  ['raw', 'Rohstoffe & Vorverarbeitung', 'Abbau und Aufbereitung der Rohstoffe. Aus OEM-Sicht gehören diese Emissionen zu den vorgelagerten Scope-3-Emissionen.', 'Gewinnung und Aufbereitung von Lithium, Nickel, Kobalt und Graphit.'],
  ['material', 'Materialherstellung', 'Herstellung der Aktivmaterialien, z. B. Kathoden- und Anodenmaterial.', 'Chemische Verarbeitung der Rohstoffe zu Batteriematerialien.'],
  ['cell', 'Zellfertigung', 'Herstellung von Batteriezellen. Aus OEM-Sicht sind die Emissionen der Zellfertigung Teil der vorgelagerten Scope-3-Emissionen.', 'Herstellung von Batteriezellen', [12, 34, 54]],
  ['module', 'Modulfertigung', 'Zusammenbau der Zellen zu Modulen.', 'Montage von Zellen zu Modulen.'],
  ['pack', 'Pack Assembly', 'Zusammenbau der Module zum fertigen Batteriepack.', 'Montage von Modulen zum Pack inklusive Gehäuse und Elektronik.'],
  ['distribution', 'Distribution', 'Transporte zwischen Werken und zum Fahrzeughersteller.', 'Transport und Lagerung.'],
  ['use', 'Nutzung', 'Betrieb im Fahrzeug. Die Emissionen hängen vor allem vom Strommix beim Laden ab.', 'Laden und Betrieb im Fahrzeug.'],
  ['eol', 'End-of-Life & Recycling', 'Demontage, Recycling und Rückgewinnung von Materialien.', 'Demontage und Stoffrückgewinnung.'],
];
for (const [id, title, summary, what, scopes] of stages) {
  c.add(
    `footprint.stage.${id}`,
    title,
    summary,
    [
      fld(`footprint.stage.${id}.what`, 'Was passiert hier', what),
      fld(`footprint.stage.${id}.scope1`, 'Scope 1 (direkte Emissionen)', scopes?.[0], {
        unit: '%',
        src: 'ERP / MES',
        desc: 'Anteil direkter Emissionen der betrachteten Organisation. Ohne angebundene Daten nicht verfügbar.',
      }),
      fld(`footprint.stage.${id}.scope2`, 'Scope 2 (eingekaufte Energie)', scopes?.[1], { unit: '%', src: 'ERP / MES' }),
      fld(`footprint.stage.${id}.scope3`, 'Scope 3 (vor- und nachgelagert)', scopes?.[2], { unit: '%', src: 'ERP / LCA' }),
    ],
    [link('Beitrag der Zulieferer', PAGES.supplier), link('OEM-Wertschöpfung', PAGES.oem)],
  );
}

c.add(
  'footprint.rules',
  'Relevanz für den Batteriepass (PCF)',
  'Welche Lebenszyklusphasen im Produkt-CO₂-Fußabdruck enthalten sind und ab wann welche Daten verpflichtend sind, folgt einem versionierten Regelwerk. Die Demo trifft dazu keine eigenen Aussagen.',
  [
    fld('footprint.rules.phase', 'Enthaltene Lebenszyklusphase', 'Herstellung', { src: 'Regelwerk' }),
    fld('footprint.rules.pcf', 'Zeitpunkt für PCF-Daten', undefined, {
      src: 'Regelwerk',
      desc: 'Wird aus dem versionierten Regelwerk geladen. Rechtsstatus wird nicht aus Bildbeschriftungen abgeleitet.',
    }),
    fld('footprint.rules.dpp', 'Weitere DPP-Daten', undefined, { src: 'Regelwerk' }),
  ],
);

const sources: [string, string, string][] = [
  ['erp', 'ERP', 'Energieverbrauch, Mengen, Kosten'],
  ['mes', 'MES', 'Prozessdaten, Ausschuss, Auslastung'],
  ['lca', 'LCA-Datenbank', 'Emissionsfaktoren, z. B. ecoinvent, GaBi'],
  ['plm', 'PLM', 'Materialdaten, Stückliste, Gewichte, Chemie'],
  ['logistics', 'Logistik', 'Transportdaten, Strecken, Verkehrsträger'],
];
for (const [id, title, data] of sources) {
  c.add(
    `footprint.source.${id}`,
    title,
    'Quellsystem für die ausgewählte Lebenszyklusphase. Jede Datenleitung ist später eine auflösbare Beziehung von Quelldatensatz über das kanonische Produktmodell bis zur berechneten Kennzahl.',
    [
      fld(`footprint.source.${id}.data`, 'Gelieferte Daten', data),
      fld(`footprint.source.${id}.status`, 'Verbindung', undefined, {
        src: title,
        desc: 'Ohne Connector bleibt „nicht angebunden“ stehen, es wird keine Integration vorgetäuscht.',
      }),
    ],
  );
}

const semantic: [string, string, string, string][] = [
  ['harmonize', 'Datenharmonisierung', 'Einheiten, Bezeichner, Definitionen', 'Vereinheitlicht Einheiten, Begriffe, Zeit- und Ortsbezug, damit Daten aus verschiedenen Systemen vergleichbar sind.'],
  ['refs', 'Produkt- und Prozessreferenzen', 'Zuordnung zu Zelle, Werk, Zeitraum', 'Verknüpft jede Messung mit Produkt, Werk, Charge und Zeitraum.'],
  ['calc', 'Emissionsberechnung', 'Methodik, Allokation, Qualitätsregeln', 'Aktivitätsdaten mal Emissionsfaktor mal Allokation, mit dokumentierter Methode und Version.'],
  ['quality', 'Datenqualität', 'Vollständigkeit, Plausibilität, Nachweise', 'Prüft Vollständigkeit und Plausibilität und weist Lücken aus statt sie zu füllen.'],
];
for (const [id, title, data, summary] of semantic) {
  c.add(`footprint.semantic.${id}`, title, summary, [fld(`footprint.semantic.${id}.data`, 'Aufgabe', data)]);
}

c.add(
  'footprint.result',
  'Ergebnis für den Batteriepass (PCF)',
  'CO₂-Fußabdruck der ausgewählten Phase pro kWh Zellkapazität, aufgeteilt nach Scope-Anteilen. Unternehmens-Scopes und Produkt-PCF sind verschiedene Bilanzierungen und werden nicht doppelt gezählt.',
  [
    fld('footprint.result.total', 'CO₂-Fußabdruck Zellfertigung', '28,4', { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('footprint.result.s1', 'davon Scope 1', '3,4', { unit: 'kg', src: 'Berechnungsdienst' }),
    fld('footprint.result.s2', 'davon Scope 2', '9,7', { unit: 'kg', src: 'Berechnungsdienst' }),
    fld('footprint.result.s3', 'davon Scope 3', '15,3', { unit: 'kg', src: 'Berechnungsdienst' }),
  ],
  [link('Lifecycle Impact (OEM)', PAGES.oem)],
);

c.add(
  'footprint.output',
  'Einfluss auf den Digitalen Batteriepass',
  'Das berechnete Ergebnis wird als kuratiertes Feld in den Produktpass übernommen, nach Lebenszyklusphasen gegliedert.',
  [
    fld('footprint.output.co2', 'CO₂-Fußabdruck nach Lebenszyklusphase', 'Rohstoffe, Herstellung, Distribution, End-of-Life', { src: 'DPP' }),
  ],
  [link('Öffentliche Sicht (Endkunde)', PAGES.customer)],
);

export const footprintContent = { fields: c.fields, sections: c.sections };
export const footprintStages = stages.map(([id, title]) => ({ id: `footprint.stage.${id}`, title, key: id }));
export const footprintSourceIds = sources.map(([id]) => `footprint.source.${id}`);
export const footprintSemanticIds = semantic.map(([id]) => `footprint.semantic.${id}`);

export const scopeLegend = [
  { id: 1, title: 'Scope 1', text: 'Direkte Emissionen' },
  { id: 2, title: 'Scope 2', text: 'Eingekaufte Energie' },
  { id: 3, title: 'Scope 3', text: 'Vor- und nachgelagerte Emissionen' },
];
