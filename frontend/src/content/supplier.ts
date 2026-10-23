import type { IconName } from '../components/ui/Icon';
import type { Tone } from '../types/content';
import { createContent, fld, link } from './builder';

const c = createContent();

interface ChainRow { id: string; title: string; icon: IconName; summary: string }
const chain: ChainRow[] = [
  { id: 'incoming', title: 'Materialeingang', icon: 'box', summary: 'Eingang der Rohmaterialien beim Zulieferer. Chargen und Herkunft werden hier erfasst.' },
  { id: 'production', title: 'Fertigung', icon: 'factory', summary: 'Herstellung des gelieferten Materials oder Bauteils. Energie- und Prozessdaten fließen in die Emissionsallokation.' },
  { id: 'quality', title: 'Qualitätsprüfung', icon: 'shield', summary: 'Prüfungen und Zertifikate. Nachweise werden mit Charge und Gültigkeit verknüpft.' },
  { id: 'transport', title: 'Transport', icon: 'truck', summary: 'Beförderung zum OEM. Sendungsmasse, Strecke und Verkehrsträger bestimmen die Transportemissionen.' },
  { id: 'handover', title: 'Übergabe an OEM', icon: 'box', summary: 'Übergabe der Lieferung. Ab hier gehört das Material zur OEM-Stückliste.' },
];
export const supplierChainIds = c.group('supplier.chain', chain, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: r.summary,
  fields: [fld(`${id}.facility`, 'Werk / Standort', undefined, { src: 'ERP / SCM' })],
}));

c.add('supplier.contribution', {
  title: 'Mein Produktbeitrag: Kathodenmaterial NMC622',
  summary: 'Der Beitrag des Zulieferers ist über die Stückliste (BOM) mit dem OEM-Produkt verknüpft. Dieselbe Beziehung nutzt der OEM, daher ändert sich ein Wert nur an einer Stelle.',
  fields: [
    fld('supplier.material.name', 'Material', 'Kathodenmaterial NMC622', { src: 'PLM / Lieferant' }),
    fld('supplier.material.type', 'Materialtyp', 'Kathodenmaterial (NMC622)', { src: 'PLM / Lieferant' }),
    fld('supplier.material.form', 'Lieferform', 'Pulver', { src: 'Lieferant' }),
    fld('supplier.material.cas', 'CAS-Nr.', 'nicht zutreffend', { src: 'Lieferant' }),
    fld('supplier.material.internalId', 'Interne Produkt-ID', 'SUP-NMC622-001', { src: 'Lieferant' }),
    fld('supplier.material.dppRef', 'DPP-Referenz', 'DPP-MAT-2024-00123', { src: 'DPP-Plattform' }),
  ],
  related: [link('Verwendung im OEM-Produkt', 'oem')],
});

interface ComplianceRow { id: string; title: string; subtitle: string; summary: string; pct: number; tone: Tone; label: string }
const compliance: ComplianceRow[] = [
  { id: 'ccf', title: 'CCF', subtitle: 'Corporate Carbon Footprint', summary: 'Der organisationsbezogene CO₂-Fußabdruck des Lieferanten. Er wird nicht mit dem Produkt-Fußabdruck addiert.', pct: 100, tone: 'ok', label: 'Vollständig' },
  { id: 'pcf', title: 'PCF', subtitle: 'Product Carbon Footprint', summary: 'Der produktbezogene, allokierte Emissionsbeitrag des Lieferanten.', pct: 75, tone: 'warn', label: 'In Prüfung' },
  { id: 'ppwr', title: 'PPWR', subtitle: 'Verpackung & Recycling', summary: 'Verpackungsanforderungen. Geltung und Umfang folgen einem versionierten Regelwerk.', pct: 100, tone: 'ok', label: 'Vollständig' },
  { id: 'material', title: 'Materialdaten', subtitle: 'Zusammensetzung & Herkunft', summary: 'Stoffliche Zusammensetzung und Herkunft des gelieferten Materials.', pct: 100, tone: 'ok', label: 'Vollständig' },
  { id: 'transport', title: 'Transportdaten', subtitle: 'Logistik & Emissionen', summary: 'Sendungen und zugehörige Emissionen.', pct: 80, tone: 'warn', label: 'In Prüfung' },
  { id: 'qualityproof', title: 'Qualitätsnachweise', subtitle: 'Prüfungen & Zertifikate', summary: 'Zertifikate und Prüfberichte mit Gültigkeitszeitraum.', pct: 40, tone: 'open', label: 'Offen' },
];
export const supplierComplianceIds = c.group('supplier.compliance', compliance, (r, id) => ({
  title: r.title,
  subtitle: r.subtitle,
  summary: `${r.summary} 100 % bedeutet nur: Alle für diese Pflicht konfigurierten Prüfungen sind erfüllt, nicht automatisch gesetzliche Konformität.`,
  fields: [
    fld(`${id}.status`, 'Status', r.label, { src: 'Prüfregeln', tone: r.tone }),
    fld(`${id}.coverage`, 'Erfüllungsgrad', r.pct, { unit: '%', src: 'Prüfregeln', tone: r.tone }),
  ],
}));

interface EvidenceRow { id: string; doc: string; type: string; status: string; tone: Tone; date: string }
const evidence: EvidenceRow[] = [
  { id: 'material', doc: 'Materialzertifikat NMC622', type: 'Materialnachweis', status: 'Vollständig', tone: 'ok', date: '12.03.2024' },
  { id: 'coa', doc: 'Qualitätszertifikat (CoA)', type: 'Qualitätsnachweis', status: 'In Prüfung', tone: 'warn', date: '08.03.2024' },
  { id: 'reach', doc: 'REACH-Konformität', type: 'Compliance', status: 'Vollständig', tone: 'ok', date: '10.03.2024' },
  { id: 'ppwr', doc: 'PPWR-Verpackungsnachweis', type: 'Compliance', status: 'Vollständig', tone: 'ok', date: '10.03.2024' },
  { id: 'iso', doc: 'ISO 9001 Zertifikat', type: 'Qualitätsnachweis', status: 'Offen', tone: 'open', date: '07.03.2024' },
];
export const supplierEvidenceIds = c.group('supplier.evidence', evidence, (r, id) => ({
  title: r.doc,
  summary: 'Nachweise verweisen auf das Originaldokument im Dokumentenmanagement und tragen Gültigkeit, Prüfer, Status und Version. Abgelaufene Nachweise werden nie als gültig angezeigt.',
  fields: [
    fld(`${id}.doc`, 'Dokument', r.doc, { src: 'DMS / QMS' }),
    fld(`${id}.type`, 'Typ', r.type, { src: 'DMS / QMS' }),
    fld(`${id}.status`, 'Status', r.status, { src: 'DMS / QMS', tone: r.tone }),
    fld(`${id}.date`, 'Datum', r.date, { src: 'DMS / QMS' }),
  ],
}));

interface ShipmentRow { id: string; title: string; detail: string; status: string; tone: Tone }
const shipment: ShipmentRow[] = [
  { id: 'pickup', title: 'Abholung Werk', detail: 'Leipzig, Deutschland · 12.03.2024, 08:00', status: 'Erledigt', tone: 'ok' },
  { id: 'transit', title: 'Transport zu OEM', detail: 'München, Deutschland · vsl. 13.03.2024, 14:00', status: 'In Transit', tone: 'warn' },
  { id: 'handover', title: 'Übergabe an OEM', detail: 'München, Deutschland · vsl. 13.03.2024, 16:00', status: 'Geplant', tone: 'neutral' },
];
export const supplierShipmentIds = c.group('supplier.shipment', shipment, (r, id) => ({
  title: r.title,
  summary: 'Etappe einer Sendung aus dem Transportmanagementsystem. Etappen ohne zugrunde liegende Sendung werden nie als reale Lieferung gezeigt.',
  fields: [
    fld(`${id}.detail`, 'Ort und Zeit', r.detail, { src: 'TMS' }),
    fld(`${id}.status`, 'Status', r.status, { src: 'TMS', tone: r.tone }),
  ],
}));

c.add('supplier.shipment.info', {
  title: 'Sendungsdetails',
  icon: 'truck',
  summary: 'Kennwerte der Sendung. Transportemissionen ändern sich bei einer Gewichtsänderung nur, wenn die Zuordnung auf der tatsächlichen Gütermasse beruht.',
  fields: [
    fld('supplier.shipment.id', 'Sendungs-ID', 'SHP-2024-00342', { src: 'TMS' }),
    fld('supplier.shipment.mass', 'Menge', '12.000', { unit: 'kg', src: 'TMS' }),
    fld('supplier.shipment.mode', 'Transportmittel', 'LKW (Euro 6)', { src: 'TMS' }),
    fld('supplier.shipment.emissions', 'Transportemissionen', '1,2', { unit: 't CO₂e', src: 'TMS / Berechnungsdienst' }),
  ],
  related: [link('CO₂ & Scopes', 'footprint')],
});

c.add('supplier.impact', {
  title: 'Impact meines Beitrags',
  summary: 'Beitrag des Zulieferers zum Produkt-CO₂-Fußabdruck, getrennt nach Material, Fertigung und Transport. Die Zuordnung zum Produkt folgt einer dokumentierten Allokation.',
  fields: [
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
  related: [link('CO₂ & Scopes', 'footprint')],
});

export const supplierContent = { fields: c.fields, sections: c.sections };
