import { createContent, fld, link, PAGES } from './builder';

const c = createContent();

c.add(
  'customer.passport',
  'Batterie-Pass (öffentliche Ansicht)',
  'So sieht ein Endkunde den Batteriepass nach dem Scannen des QR-Codes. Es werden nur Felder gezeigt, die laut Offenlegungsregeln öffentlich sein dürfen.',
  [
    fld('customer.productName', 'Produkt', 'Traktionsbatterie M3', { src: 'PLM' }),
    fld('customer.productId', 'Produkt-ID', 'M3-2024-7783', { src: 'PLM / Serialisierung' }),
    fld('customer.co2', 'CO₂-Fußabdruck', 82, { unit: 'kg CO₂e/kWh', src: 'Berechnungsdienst' }),
    fld('customer.recycled', 'Rezyklatanteil', 24, { unit: '%', src: 'Recyclingmodell' }),
    fld('customer.warranty', 'Garantie & Reparatur', 8, { unit: 'Jahre', src: 'Service / Rechtstexte' }),
    fld('customer.type', 'Batterietyp', 'Lithium-Ionen', { src: 'PLM' }),
    fld('customer.origin', 'Herkunft', 'EU / Deutschland', { src: 'Lieferkette' }),
  ],
  [link('OEM-Sicht auf dieselben Daten', PAGES.oem)],
);

c.add(
  'customer.qr',
  'QR-Code zum Batterie-Pass',
  'Der QR-Code führt zu einer öffentlich auflösbaren Adresse des Produkts. Er enthält keine privaten IDs oder Zugangsdaten.',
  [
    fld('customer.qr.url', 'Öffentliche Adresse', undefined, {
      src: 'DPP-Plattform',
      desc: 'Wird nach der Datenanbindung als signierte, kontrolliert auflösbare Adresse erzeugt. Die Grafik in der Demo ist ein Platzhalter.',
    }),
  ],
);

const benefits: [string, string, string, string][] = [
  ['understand', 'Einfach verstehen', 'Die wichtigsten Informationen klar und kompakt.', 'Der Pass übersetzt Fachdaten in verständliche Aussagen für Käufer und Nutzer.'],
  ['trust', 'Vertrauen', 'Transparente Daten für eine sichere Kaufentscheidung.', 'Jede Angabe lässt sich bis zur Quelle und zum Nachweis zurückverfolgen.'],
  ['repair', 'Reparatur & Garantie', 'Längere Nutzung dank klarer Hinweise zu Service und Reparatur.', 'Informationen zu Reparierbarkeit, Ersatzteilen und Garantie verlängern die Nutzungsdauer.'],
  ['sustain', 'Nachhaltige Entscheidung', 'Sehen Sie den Beitrag zur Kreislaufwirtschaft auf einen Blick.', 'CO₂-Fußabdruck und Rezyklatanteil machen Produkte vergleichbar.'],
];
for (const [id, title, short, summary] of benefits) {
  c.add(`customer.benefit.${id}`, title, summary, [fld(`customer.benefit.${id}.text`, 'Nutzen', short)]);
}

const pub: [string, string, string, string, string][] = [
  ['product', 'Produktinformationen', 'Typ, Modell, Revision, Kennwerte', 'Öffentliche Kennung und freigegebene Kennwerte des Produkts.', 'oem'],
  ['co2', 'Umwelt & CO₂-Fußabdruck', 'PCF mit Methode und funktioneller Einheit', 'Der Produkt-CO₂-Fußabdruck wird nur gezeigt, wenn Methode, Abdeckung und Qualität erfüllt sind.', 'footprint'],
  ['materials', 'Materialien & Rezyklate', 'Zusammensetzung (aggregiert), Rezyklatanteil', 'Aggregierte Materialinformationen ohne geschützte Rezepturen.', 'supplier'],
  ['use', 'Nutzung, Garantie & Reparatur', 'Garantie, Sicherheits- und Reparaturhinweise', 'Hinweise für Nutzung, Service und Reparatur.', 'aftersales'],
  ['origin', 'Herkunft & Lieferkette', 'Herkunftsregion, Lieferkette (ggf. aggregiert)', 'Herkunft der Batterie und zentraler Materialien, soweit offenlegbar.', 'supplier'],
];
for (const [id, title, data, summary, page] of pub) {
  c.add(
    `customer.public.${id}`,
    title,
    summary,
    [fld(`customer.public.${id}.data`, 'Öffentliche Informationen', data, { src: 'Disclosure-Policy' })],
    [link('Interne Sicht darauf', PAGES[page as keyof typeof PAGES])],
  );
}

c.add(
  'customer.message',
  'Mehr Transparenz für eine nachhaltige Mobilität',
  'Der Batterie-Pass macht wichtige Produktinformationen für alle zugänglich, für mehr Vertrauen, längere Nutzung und eine saubere Zukunft.',
  [],
);

export const customerContent = { fields: c.fields, sections: c.sections };
export const customerBenefitIds = benefits.map(([id]) => `customer.benefit.${id}`);
export const customerPublicIds = pub.map(([id]) => `customer.public.${id}`);
