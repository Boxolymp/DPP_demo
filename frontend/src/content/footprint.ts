import type { IconName } from '../components/ui/Icon';
import { createContent, fld, link } from './builder';

const c = createContent();

interface StageRow {
  id: string;
  title: string;
  summary: string;
  what: string;
  /** Beispielanteile Scope 1–3 in %; nur Phasen mit Beispieldaten haben sie (und ein PCF-Ergebnis). */
  scopes?: [number, number, number];
}
const stages: StageRow[] = [
  { id: 'raw', title: 'Rohstoffe & Vorverarbeitung', summary: 'Abbau und Aufbereitung der Rohstoffe. Aus OEM-Sicht gehören diese Emissionen zu den vorgelagerten Scope-3-Emissionen.', what: 'Gewinnung und Aufbereitung von Lithium, Nickel, Kobalt und Graphit.' },
  { id: 'material', title: 'Materialherstellung', summary: 'Herstellung der Aktivmaterialien, z. B. Kathoden- und Anodenmaterial.', what: 'Chemische Verarbeitung der Rohstoffe zu Batteriematerialien.' },
  { id: 'cell', title: 'Zellfertigung', summary: 'Herstellung von Batteriezellen. Aus OEM-Sicht sind die Emissionen der Zellfertigung Teil der vorgelagerten Scope-3-Emissionen.', what: 'Herstellung von Batteriezellen', scopes: [12, 34, 54] },
  { id: 'module', title: 'Modulfertigung', summary: 'Zusammenbau der Zellen zu Modulen.', what: 'Montage von Zellen zu Modulen.' },
  { id: 'pack', title: 'Pack Assembly', summary: 'Zusammenbau der Module zum fertigen Batteriepack.', what: 'Montage von Modulen zum Pack inklusive Gehäuse und Elektronik.' },
  { id: 'distribution', title: 'Distribution', summary: 'Transporte zwischen Werken und zum Fahrzeughersteller.', what: 'Transport und Lagerung.' },
  { id: 'use', title: 'Nutzung', summary: 'Betrieb im Fahrzeug. Die Emissionen hängen vor allem vom Strommix beim Laden ab.', what: 'Laden und Betrieb im Fahrzeug.' },
  { id: 'eol', title: 'End-of-Life & Recycling', summary: 'Demontage, Recycling und Rückgewinnung von Materialien.', what: 'Demontage und Stoffrückgewinnung.' },
];
const stageIds = c.group('footprint.stage', stages, (r, id) => ({
  title: r.title,
  summary: r.summary,
  fields: [
    fld(`${id}.what`, 'Was passiert hier', r.what),
    fld(`${id}.scope1`, 'Scope 1 (direkte Emissionen)', r.scopes?.[0], {
      unit: '%',
      src: 'ERP / MES',
      desc: 'Anteil direkter Emissionen der betrachteten Organisation. Ohne angebundene Daten nicht verfügbar.',
    }),
    fld(`${id}.scope2`, 'Scope 2 (eingekaufte Energie)', r.scopes?.[1], { unit: '%', src: 'ERP / MES' }),
    fld(`${id}.scope3`, 'Scope 3 (vor- und nachgelagert)', r.scopes?.[2], { unit: '%', src: 'ERP / LCA' }),
  ],
  related: [link('Beitrag der Zulieferer', 'supplier'), link('OEM-Wertschöpfung', 'oem')],
}));

c.add('footprint.rules', {
  title: 'Relevanz für den Batteriepass (PCF)',
  summary: 'Welche Lebenszyklusphasen im Produkt-CO₂-Fußabdruck enthalten sind und ab wann welche Daten verpflichtend sind, folgt einem versionierten Regelwerk. Die Demo trifft dazu keine eigenen Aussagen.',
  fields: [
    fld('footprint.rules.phase', 'Enthaltene Lebenszyklusphase', 'Herstellung', { src: 'Regelwerk' }),
    fld('footprint.rules.pcf', 'Zeitpunkt für PCF-Daten', undefined, {
      src: 'Regelwerk',
      desc: 'Wird aus dem versionierten Regelwerk geladen. Rechtsstatus wird nicht aus Bildbeschriftungen abgeleitet.',
    }),
    fld('footprint.rules.dpp', 'Weitere DPP-Daten', undefined, { src: 'Regelwerk' }),
  ],
});

interface SourceRow { id: string; title: string; icon: IconName; data: string }
const sources: SourceRow[] = [
  { id: 'erp', title: 'ERP', icon: 'doc', data: 'Energieverbrauch, Mengen, Kosten' },
  { id: 'mes', title: 'MES', icon: 'gear', data: 'Prozessdaten, Ausschuss, Auslastung' },
  { id: 'lca', title: 'LCA-Datenbank', icon: 'leaf', data: 'Emissionsfaktoren, z. B. ecoinvent, GaBi' },
  { id: 'plm', title: 'PLM', icon: 'box', data: 'Materialdaten, Stückliste, Gewichte, Chemie' },
  { id: 'logistics', title: 'Logistik', icon: 'truck', data: 'Transportdaten, Strecken, Verkehrsträger' },
];
export const footprintSourceIds = c.group('footprint.source', sources, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: 'Quellsystem für die ausgewählte Lebenszyklusphase. Jede Datenleitung ist später eine auflösbare Beziehung von Quelldatensatz über das kanonische Produktmodell bis zur berechneten Kennzahl.',
  fields: [
    fld(`${id}.data`, 'Gelieferte Daten', r.data),
    fld(`${id}.status`, 'Verbindung', undefined, {
      src: r.title,
      desc: 'Ohne Connector bleibt „nicht angebunden“ stehen, es wird keine Integration vorgetäuscht.',
    }),
  ],
}));

interface SemanticRow { id: string; title: string; icon: IconName; data: string; summary: string }
const semantic: SemanticRow[] = [
  { id: 'harmonize', title: 'Datenharmonisierung', icon: 'link', data: 'Einheiten, Bezeichner, Definitionen', summary: 'Vereinheitlicht Einheiten, Begriffe, Zeit- und Ortsbezug, damit Daten aus verschiedenen Systemen vergleichbar sind.' },
  { id: 'refs', title: 'Produkt- und Prozessreferenzen', icon: 'doc', data: 'Zuordnung zu Zelle, Werk, Zeitraum', summary: 'Verknüpft jede Messung mit Produkt, Werk, Charge und Zeitraum.' },
  { id: 'calc', title: 'Emissionsberechnung', icon: 'chart', data: 'Methodik, Allokation, Qualitätsregeln', summary: 'Aktivitätsdaten mal Emissionsfaktor mal Allokation, mit dokumentierter Methode und Version.' },
  { id: 'quality', title: 'Datenqualität', icon: 'shield', data: 'Vollständigkeit, Plausibilität, Nachweise', summary: 'Prüft Vollständigkeit und Plausibilität und weist Lücken aus statt sie zu füllen.' },
];
export const footprintSemanticIds = c.group('footprint.semantic', semantic, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: r.summary,
  fields: [fld(`${id}.data`, 'Aufgabe', r.data)],
}));

c.add('footprint.result', {
  title: 'Ergebnis für den Batteriepass (PCF)',
  summary: 'CO₂-Fußabdruck der ausgewählten Phase pro kWh Zellkapazität, aufgeteilt nach Scope-Anteilen. Unternehmens-Scopes und Produkt-PCF sind verschiedene Bilanzierungen und werden nicht doppelt gezählt.',
  fields: [
    fld('footprint.result.total', 'CO₂-Fußabdruck Zellfertigung', '28,4', { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('footprint.result.s1', 'davon Scope 1', '3,4', { unit: 'kg', src: 'Berechnungsdienst' }),
    fld('footprint.result.s2', 'davon Scope 2', '9,7', { unit: 'kg', src: 'Berechnungsdienst' }),
    fld('footprint.result.s3', 'davon Scope 3', '15,3', { unit: 'kg', src: 'Berechnungsdienst' }),
    fld('footprint.result.phase', 'Beitrag zur Lebenszyklusphase', 'Herstellung (Zelle)', { src: 'Regelwerk' }),
  ],
  related: [link('Lifecycle Impact (OEM)', 'oem')],
});

c.add('footprint.output', {
  title: 'Einfluss auf den Digitalen Batteriepass',
  icon: 'doc',
  summary: 'Das berechnete Ergebnis wird als kuratiertes Feld in den Produktpass übernommen, nach Lebenszyklusphasen gegliedert.',
  fields: [
    fld('footprint.output.co2', 'CO₂-Fußabdruck nach Lebenszyklusphase', 'Rohstoffe, Herstellung, Distribution, End-of-Life', { src: 'DPP' }),
  ],
  related: [link('Öffentliche Sicht (Endkunde)', 'customer')],
});

export const footprintContent = { fields: c.fields, sections: c.sections };
export const footprintStages = stages.map((r, i) => ({
  id: stageIds[i],
  title: r.title,
  /** Nur Phasen mit Beispieldaten haben ein PCF-Ergebnis. */
  hasResult: r.scopes !== undefined,
}));
export const footprintDefaultStageId = footprintStages.find((s) => s.hasResult)?.id ?? footprintStages[0].id;

export const scopeLegend = [
  { id: 1, title: 'Scope 1', text: 'Direkte Emissionen' },
  { id: 2, title: 'Scope 2', text: 'Eingekaufte Energie' },
  { id: 3, title: 'Scope 3', text: 'Vor- und nachgelagerte Emissionen' },
];
