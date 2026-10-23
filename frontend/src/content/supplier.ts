import { createContent, fld, link, PAGES } from './builder';

const c = createContent();

const chain: [string, string, string][] = [
  ['incoming', 'Materialeingang', 'Eingang der Rohmaterialien beim Zulieferer. Chargen und Herkunft werden hier erfasst.'],
  ['production', 'Fertigung', 'Herstellung des gelieferten Materials oder Bauteils. Energie- und Prozessdaten fließen in die Emissionsallokation.'],
  ['quality', 'Qualitätsprüfung', 'Prüfungen und Zertifikate. Nachweise werden mit Charge und Gültigkeit verknüpft.'],
  ['transport', 'Transport', 'Beförderung zum OEM. Sendungsmasse, Strecke und Verkehrsträger bestimmen die Transportemissionen.'],
  ['handover', 'Übergabe an OEM', 'Übergabe der Lieferung. Ab hier gehört das Material zur OEM-Stückliste.'],
];
for (const [id, title, summary] of chain) {
  c.add(`supplier.chain.${id}`, title, summary, [
    fld(`supplier.chain.${id}.facility`, 'Werk / Standort', undefined, { src: 'ERP / SCM' }),
  ]);
}

c.add(
  'supplier.contribution',
  'Mein Produktbeitrag: Kathodenmaterial NMC622',
  'Der Beitrag des Zulieferers ist über die Stückliste (BOM) mit dem OEM-Produkt verknüpft. Dieselbe Beziehung nutzt der OEM, daher ändert sich ein Wert nur an einer Stelle.',
  [
    fld('supplier.material.name', 'Material', 'Kathodenmaterial NMC622', { src: 'PLM / Lieferant' }),
    fld('supplier.material.type', 'Materialtyp', 'Kathodenmaterial (NMC622)', { src: 'PLM / Lieferant' }),
    fld('supplier.material.form', 'Lieferform', 'Pulver', { src: 'Lieferant' }),
    fld('supplier.material.cas', 'CAS-Nr.', 'nicht zutreffend', { src: 'Lieferant' }),
    fld('supplier.material.internalId', 'Interne Produkt-ID', 'SUP-NMC622-001', { src: 'Lieferant' }),
    fld('supplier.material.dppRef', 'DPP-Referenz', 'DPP-MAT-2024-00123', { src: 'DPP-Plattform' }),
  ],
  [link('Verwendung im OEM-Produkt', PAGES.oem)],
);

const comp: [string, string, string, string, number, 'ok' | 'warn' | 'open', string][] = [
  ['ccf', 'CCF', 'Corporate Carbon Footprint', 'Der organisationsbezogene CO₂-Fußabdruck des Lieferanten. Er wird nicht mit dem Produkt-Fußabdruck addiert.', 100, 'ok', 'Vollständig'],
  ['pcf', 'PCF', 'Product Carbon Footprint', 'Der produktbezogene, allokierte Emissionsbeitrag des Lieferanten.', 75, 'warn', 'In Prüfung'],
  ['ppwr', 'PPWR', 'Verpackung & Recycling', 'Verpackungsanforderungen. Geltung und Umfang folgen einem versionierten Regelwerk.', 100, 'ok', 'Vollständig'],
  ['material', 'Materialdaten', 'Zusammensetzung & Herkunft', 'Stoffliche Zusammensetzung und Herkunft des gelieferten Materials.', 100, 'ok', 'Vollständig'],
  ['transport', 'Transportdaten', 'Logistik & Emissionen', 'Sendungen und zugehörige Emissionen.', 80, 'warn', 'In Prüfung'],
  ['qualityproof', 'Qualitätsnachweise', 'Prüfungen & Zertifikate', 'Zertifikate und Prüfberichte mit Gültigkeitszeitraum.', 40, 'open', 'Offen'],
];
for (const [id, title, sub, summary, pct, tone, label] of comp) {
  c.add(
    `supplier.compliance.${id}`,
    `${title}: ${sub}`,
    `${summary} 100 % bedeutet nur: Alle für diese Pflicht konfigurierten Prüfungen sind erfüllt, nicht automatisch gesetzliche Konformität.`,
    [
      fld(`supplier.compliance.${id}.status`, 'Status', label, { src: 'Prüfregeln', tone }),
      fld(`supplier.compliance.${id}.coverage`, 'Erfüllungsgrad', pct, { unit: '%', src: 'Prüfregeln', tone }),
    ],
  );
}

const evid: [string, string, string, string, 'ok' | 'warn' | 'open', string][] = [
  ['material', 'Materialzertifikat NMC622', 'Materialnachweis', 'Vollständig', 'ok', '12.03.2024'],
  ['coa', 'Qualitätszertifikat (CoA)', 'Qualitätsnachweis', 'In Prüfung', 'warn', '08.03.2024'],
  ['reach', 'REACH-Konformität', 'Compliance', 'Vollständig', 'ok', '10.03.2024'],
  ['ppwr', 'PPWR-Verpackungsnachweis', 'Compliance', 'Vollständig', 'ok', '10.03.2024'],
  ['iso', 'ISO 9001 Zertifikat', 'Qualitätsnachweis', 'Offen', 'open', '07.03.2024'],
];
for (const [id, doc, type, status, tone, date] of evid) {
  c.add(
    `supplier.evidence.${id}`,
    doc,
    'Nachweise verweisen auf das Originaldokument im Dokumentenmanagement und tragen Gültigkeit, Prüfer, Status und Version. Abgelaufene Nachweise werden nie als gültig angezeigt.',
    [
      fld(`supplier.evidence.${id}.doc`, 'Dokument', doc, { src: 'DMS / QMS' }),
      fld(`supplier.evidence.${id}.type`, 'Typ', type, { src: 'DMS / QMS' }),
      fld(`supplier.evidence.${id}.status`, 'Status', status, { src: 'DMS / QMS', tone }),
      fld(`supplier.evidence.${id}.date`, 'Datum', date, { src: 'DMS / QMS' }),
    ],
  );
}

const ship: [string, string, string, string, 'ok' | 'warn' | 'neutral'][] = [
  ['pickup', 'Abholung Werk', 'Leipzig, Deutschland · 12.03.2024, 08:00', 'Erledigt', 'ok'],
  ['transit', 'Transport zu OEM', 'München, Deutschland · vsl. 13.03.2024, 14:00', 'In Transit', 'warn'],
  ['handover', 'Übergabe an OEM', 'München, Deutschland · vsl. 13.03.2024, 16:00', 'Geplant', 'neutral'],
];
for (const [id, title, detail, status, tone] of ship) {
  c.add(
    `supplier.shipment.${id}`,
    title,
    'Etappe einer Sendung aus dem Transportmanagementsystem. Etappen ohne zugrunde liegende Sendung werden nie als reale Lieferung gezeigt.',
    [
      fld(`supplier.shipment.${id}.detail`, 'Ort und Zeit', detail, { src: 'TMS' }),
      fld(`supplier.shipment.${id}.status`, 'Status', status, { src: 'TMS', tone }),
    ],
  );
}

c.add(
  'supplier.shipment.info',
  'Sendungsdetails',
  'Kennwerte der Sendung. Transportemissionen ändern sich bei einer Gewichtsänderung nur, wenn die Zuordnung auf der tatsächlichen Gütermasse beruht.',
  [
    fld('supplier.shipment.id', 'Sendungs-ID', 'SHP-2024-00342', { src: 'TMS' }),
    fld('supplier.shipment.mass', 'Menge', '12.000', { unit: 'kg', src: 'TMS' }),
    fld('supplier.shipment.mode', 'Transportmittel', 'LKW (Euro 6)', { src: 'TMS' }),
    fld('supplier.shipment.emissions', 'Transportemissionen', '1,2', { unit: 't CO₂e', src: 'TMS / Berechnungsdienst' }),
  ],
  [link('CO₂ & Scopes', PAGES.footprint)],
);

c.add(
  'supplier.impact',
  'Impact meines Beitrags',
  'Beitrag des Zulieferers zum Produkt-CO₂-Fußabdruck, getrennt nach Material, Fertigung und Transport. Die Zuordnung zum Produkt folgt einer dokumentierten Allokation.',
  [
    fld('supplier.impact.material', 'Material', 24, { unit: 't CO₂e', src: 'Berechnungsdienst' }),
    fld('supplier.impact.production', 'Fertigung', 12, { unit: 't CO₂e', src: 'Berechnungsdienst' }),
    fld('supplier.impact.transport', 'Transport', 4, { unit: 't CO₂e', src: 'Berechnungsdienst' }),
    fld('supplier.impact.delta', 'Veränderung ggü. Vergleichsjahr', '-28', {
      unit: '%',
      src: 'Berechnungsdienst',
      tone: 'ok',
      desc: 'Prozentwerte gibt es nur bei vorhandenem, vergleichbarem Basisdatensatz.',
    }),
  ],
  [link('CO₂ & Scopes', PAGES.footprint)],
);

export const supplierContent = { fields: c.fields, sections: c.sections };
export const supplierChainIds = chain.map(([id]) => `supplier.chain.${id}`);
export const supplierComplianceIds = comp.map(([id]) => `supplier.compliance.${id}`);
export const supplierEvidenceIds = evid.map(([id]) => `supplier.evidence.${id}`);
export const supplierShipmentIds = ship.map(([id]) => `supplier.shipment.${id}`);
