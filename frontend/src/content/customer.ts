import type { IconName } from '../components/ui/Icon';
import type { PageId } from '../lib/pages';
import { createContent, fld, link } from './builder';

const c = createContent();

c.add('customer.passport', {
  title: 'Batterie-Pass (öffentliche Ansicht)',
  summary: 'So sieht ein Endkunde den Batteriepass nach dem Scannen des QR-Codes. Es werden nur Felder gezeigt, die laut Offenlegungsregeln öffentlich sein dürfen.',
  fields: [
    fld('customer.productName', 'Produkt', 'Traktionsbatterie M3', { src: 'PLM' }),
    fld('customer.productId', 'Produkt-ID', 'M3-2024-7783', { src: 'PLM / Serialisierung' }),
    fld('customer.co2', 'CO₂-Fußabdruck', 82, { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('customer.recycled', 'Rezyklatanteil', 24, { unit: '%', src: 'Recyclingmodell' }),
    fld('customer.warranty', 'Garantie & Reparatur', 8, { unit: 'Jahre', src: 'Service / Rechtstexte' }),
    fld('customer.type', 'Batterietyp', 'Lithium-Ionen', { src: 'PLM' }),
    fld('customer.origin', 'Herkunft', 'EU / Deutschland', { src: 'Lieferkette' }),
  ],
  related: [link('OEM-Sicht auf dieselben Daten', 'oem')],
});

c.add('customer.qr', {
  title: 'QR-Code zum Batterie-Pass',
  summary: 'Der QR-Code führt zu einer öffentlich auflösbaren Adresse des Produkts. Er enthält keine privaten IDs oder Zugangsdaten.',
  fields: [
    fld('customer.qr.url', 'Öffentliche Adresse', undefined, {
      src: 'DPP-Plattform',
      desc: 'Wird nach der Datenanbindung als signierte, kontrolliert auflösbare Adresse erzeugt. Die Grafik in der Demo ist ein Platzhalter.',
    }),
  ],
});

interface BenefitRow { id: string; title: string; icon: IconName; text: string; summary: string }
const benefits: BenefitRow[] = [
  { id: 'understand', title: 'Einfach verstehen', icon: 'eye', text: 'Die wichtigsten Informationen klar und kompakt.', summary: 'Der Pass übersetzt Fachdaten in verständliche Aussagen für Käufer und Nutzer.' },
  { id: 'trust', title: 'Vertrauen', icon: 'shield', text: 'Transparente Daten für eine sichere Kaufentscheidung.', summary: 'Jede Angabe lässt sich bis zur Quelle und zum Nachweis zurückverfolgen.' },
  { id: 'repair', title: 'Reparatur & Garantie', icon: 'wrench', text: 'Längere Nutzung dank klarer Hinweise zu Service und Reparatur.', summary: 'Informationen zu Reparierbarkeit, Ersatzteilen und Garantie verlängern die Nutzungsdauer.' },
  { id: 'sustain', title: 'Nachhaltige Entscheidung', icon: 'leaf', text: 'Sehen Sie den Beitrag zur Kreislaufwirtschaft auf einen Blick.', summary: 'CO₂-Fußabdruck und Rezyklatanteil machen Produkte vergleichbar.' },
];
export const customerBenefitIds = c.group('customer.benefit', benefits, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: r.summary,
  fields: [fld(`${id}.text`, 'Nutzen', r.text)],
}));

interface PublicRow { id: string; title: string; icon: IconName; data: string; summary: string; page: PageId }
const publicInfo: PublicRow[] = [
  { id: 'product', title: 'Produktinformationen', icon: 'doc', data: 'Typ, Modell, Revision, Kennwerte', summary: 'Öffentliche Kennung und freigegebene Kennwerte des Produkts.', page: 'oem' },
  { id: 'co2', title: 'Umwelt & CO₂-Fußabdruck', icon: 'leaf', data: 'PCF mit Methode und funktioneller Einheit', summary: 'Der Produkt-CO₂-Fußabdruck wird nur gezeigt, wenn Methode, Abdeckung und Qualität erfüllt sind.', page: 'footprint' },
  { id: 'materials', title: 'Materialien & Rezyklate', icon: 'recycle', data: 'Zusammensetzung (aggregiert), Rezyklatanteil', summary: 'Aggregierte Materialinformationen ohne geschützte Rezepturen.', page: 'supplier' },
  { id: 'use', title: 'Nutzung, Garantie & Reparatur', icon: 'wrench', data: 'Garantie, Sicherheits- und Reparaturhinweise', summary: 'Hinweise für Nutzung, Service und Reparatur.', page: 'aftersales' },
  { id: 'origin', title: 'Herkunft & Lieferkette', icon: 'globe', data: 'Herkunftsregion, Lieferkette (ggf. aggregiert)', summary: 'Herkunft der Batterie und zentraler Materialien, soweit offenlegbar.', page: 'supplier' },
];
export const customerPublicIds = c.group('customer.public', publicInfo, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: r.summary,
  fields: [fld(`${id}.data`, 'Öffentliche Informationen', r.data, { src: 'Disclosure-Policy' })],
  related: [link('Interne Sicht darauf', r.page)],
}));

c.add('customer.message', {
  title: 'Mehr Transparenz für eine nachhaltige Mobilität',
  summary: 'Der Batterie-Pass macht wichtige Produktinformationen für alle zugänglich, für mehr Vertrauen, längere Nutzung und eine saubere Zukunft.',
  fields: [],
});

export const customerContent = { fields: c.fields, sections: c.sections };
