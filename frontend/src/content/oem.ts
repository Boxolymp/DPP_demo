import type { IconName } from '../components/ui/Icon';
import type { PageId } from '../lib/pages';
import { createContent, fld, link } from './builder';

const c = createContent();

c.add('oem.product', {
  title: 'Traktionsbatterie M3',
  summary: 'Die Produktkarte fasst die wichtigsten Kennwerte der Batterie zusammen. Im Echtbetrieb stammen sie aus dem PLM und werden mit der BOM abgeglichen.',
  fields: [
    fld('oem.product.name', 'Produktname', 'Traktionsbatterie M3', { src: 'PLM' }),
    fld('oem.product.capacity', 'Nennkapazität', 82, { unit: 'kWh', src: 'PLM' }),
    fld('oem.product.voltage', 'Nennspannung', 800, { unit: 'V', src: 'PLM' }),
    fld('oem.product.mass', 'Gewicht', 540, {
      unit: 'kg',
      src: 'PLM / BOM',
      desc: 'Gesamtmasse. Sie wird aus den Komponentenmassen der BOM abgeleitet oder mit einem führenden Gesamtgewicht abgeglichen; Abweichungen werden angezeigt, nicht überschrieben.',
      related: [link('CO₂ & Scopes', 'footprint')],
    }),
    fld('oem.product.cycles', 'Zyklenziel', '> 4.000', { unit: 'Zyklen', src: 'PLM' }),
    fld('oem.product.dppStatus', 'DPP-Status', 'DPP Ready', {
      src: 'Regelwerk',
      tone: 'ok',
      desc: 'Ergebnis nachvollziehbarer Regeln aus einem versionierten Regelwerk, keine feste Kennzeichnung.',
    }),
  ],
  related: [link('Öffentliche Sicht (Endkunde)', 'customer')],
});

interface ChainRow { id: string; title: string; icon: IconName; summary: string; data: string; page?: PageId }
const chain: ChainRow[] = [
  { id: 'raw', title: 'Rohstofflieferant', icon: 'box', summary: 'Gewinnung und Aufbereitung von Lithium, Nickel, Kobalt, Graphit und weiteren Rohstoffen. Hier beginnt die Datenkette: Herkunft und Abbaubedingungen.', data: 'Herkunft, Materialien, Lieferkette' },
  { id: 'cell', title: 'Zellhersteller', icon: 'battery', summary: 'Herstellung der Batteriezellen. Hier entsteht ein großer Teil der Emissionen; Energie- und Prozessdaten fließen in den Produkt-CO₂-Fußabdruck.', data: 'Prozessdaten, Energie, Qualitätsnachweise', page: 'footprint' },
  { id: 'module', title: 'Modul-/Packhersteller', icon: 'box', summary: 'Zellen werden zu Modulen und Packs zusammengebaut. Die Stückliste (BOM) verbindet alle Komponenten mit ihren Lieferanten.', data: 'Stückliste, Massen, Chargen', page: 'supplier' },
  { id: 'oem', title: 'OEM Fahrzeugintegration', icon: 'car', summary: 'Einbau der Batterie ins Fahrzeug. Der OEM verknüpft Produktrevision und Fahrzeug- bzw. Seriennummer.', data: 'Produktrevision, Seriennummer' },
  { id: 'logistics', title: 'Logistik & Distribution', icon: 'truck', summary: 'Transporte zwischen den Stationen. Sendungsmassen, Strecken und Verkehrsträger bestimmen die Transportemissionen.', data: 'Sendungen, Strecken, Emissionen', page: 'supplier' },
  { id: 'use', title: 'Nutzung im Fahrzeug', icon: 'bolt', summary: 'Betrieb der Batterie. Nutzungs- und Zustandsdaten aus dem Batteriemanagementsystem ermöglichen Service und Rückmeldung an die Entwicklung.', data: 'Zustand, Zyklen, Servicefälle', page: 'aftersales' },
  { id: 'secondlife', title: 'Second Life / Remanufacturing', icon: 'gear', summary: 'Weiterverwendung nach dem Fahrzeugleben, z. B. als stationärer Speicher, oder Wiederaufarbeitung.', data: 'Zustand, Restwert, Eignung', page: 'aftersales' },
  { id: 'recycling', title: 'Recycling & Kreislaufwirtschaft', icon: 'recycle', summary: 'Demontage und Rückgewinnung der Rohstoffe, die wieder in die Kette zurückfließen (zirkulärer Fluss).', data: 'Demontage, Stoffströme, Rezyklate', page: 'aftersales' },
];
export const oemChainIds = c.group('oem.chain', chain, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: r.summary,
  fields: [
    fld(`${id}.actor`, 'Akteur / Standort', undefined, {
      src: 'ERP / SCM',
      desc: 'Wird nach der Datenanbindung aus dem Lieferantennetzwerk geladen.',
    }),
    fld(`${id}.data`, 'Beteiligte Daten', r.data, { src: 'DPP' }),
  ],
  related: r.page ? [link('Zur Fachseite', r.page)] : [],
}));

interface EngRow { id: string; title: string; icon: IconName; summary: string; value: string; src: string; desc?: string }
const eng: EngRow[] = [
  { id: 'chemistry', title: 'Zellchemie', icon: 'battery', summary: 'Zellchemie des Produkts. Eine Änderung wirkt auf Materialliste, Lieferanten, Prozessenergie und CO₂-Faktoren.', value: 'NMC811', src: 'PLM', desc: 'Im Szenario-Bild wird eine Umstellung von NMC811 auf NMC622 gezeigt. Maßgeblich ist später immer die aktuelle, versionierte Revision.' },
  { id: 'materials', title: 'Materialien', icon: 'box', summary: 'Hauptmaterialien des Packs mit Masse und Herkunft.', value: 'Aluminium, Stahl, Graphit, …', src: 'PLM / BOM' },
  { id: 'architecture', title: 'Produktarchitektur', icon: 'gear', summary: 'Aufbau des Packs aus Modulen. Die modulare Bauweise erleichtert Reparatur und Austausch.', value: 'Modularer Aufbau', src: 'PLM' },
  { id: 'repair', title: 'Demontage & Reparatur', icon: 'wrench', summary: 'Verbindungstechnik und Reparierbarkeit. Wichtig für Ersatzteile und Recycling.', value: 'Schraub- statt Klebeverbindungen', src: 'PLM' },
  { id: 'dppdata', title: 'DPP-relevante Daten', icon: 'doc', summary: 'Daten, die für den Produktpass automatisch aus der Entwicklung übernommen werden.', value: 'Automatisch aus der Entwicklung', src: 'Semantic Layer' },
];
export const oemEngIds = c.group('oem.eng', eng, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: r.summary,
  fields: [fld(`${id}.value`, r.title, r.value, { src: r.src, desc: r.desc })],
  related: [link('Beitrag der Zulieferer', 'supplier')],
}));

c.add('oem.impact', {
  title: 'Auswirkung einer Design-Änderung (Vorschau)',
  summary: 'Zeigt, wie eine Änderung (Beispiel: Zellchemie) auf CO₂, Kosten, Recycling, Compliance und Datenpunkte wirkt. Eine Vorschau ist keine bestätigte Änderung und wird nie in den Produktpass übernommen.',
  fields: [
    fld('oem.impact.co2', 'CO₂-Fußabdruck', '-18', { unit: '%', src: 'Berechnungsdienst', tone: 'ok' }),
    fld('oem.impact.cost', 'Kosten (Zellmaterial)', '-6', { unit: '%', src: 'ERP / Controlling', tone: 'ok', desc: 'Nur bei berechtigter Controlling-Anbindung verfügbar.' }),
    fld('oem.impact.recycling', 'Recyclingfähigkeit', '+24', { unit: '%', src: 'Recyclingmodell', tone: 'ok' }),
    fld('oem.impact.compliance', 'Compliance', 'Risiko gesenkt', { src: 'Regelwerk', tone: 'ok' }),
    fld('oem.impact.dpp', 'DPP-Daten', '+3 neue Datenpunkte', { src: 'Semantic Layer' }),
  ],
  related: [link('CO₂ & Scopes', 'footprint')],
});

c.add('oem.lifecycle', {
  title: 'Lifecycle Impact',
  icon: 'chart',
  summary: 'Der Produkt-CO₂-Fußabdruck (PCF) je Lebenszyklusphase, bezogen auf eine kWh Kapazität. Die Summe ist dieselbe Zahl wie auf der Seite CO₂ & Scopes.',
  fields: [
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
  related: [link('CO₂ & Scopes', 'footprint')],
});

interface DppRow { id: string; title: string; icon: IconName; data: string; summary: string; page: PageId }
const dpp: DppRow[] = [
  { id: 'materials', title: 'Materialien & Lieferanten', icon: 'box', data: 'Herkunft, Materialien, Lieferkette', summary: 'Welche Materialien stecken im Produkt und woher kommen sie?', page: 'supplier' },
  { id: 'quality', title: 'Fertigung & Qualität', icon: 'factory', data: 'Prozessdaten, Qualitätsnachweise', summary: 'Nachweise zur Fertigung und Qualität einzelner Chargen.', page: 'supplier' },
  { id: 'dpp', title: 'DPP-relevante Informationen', icon: 'doc', data: 'Produktdaten, Nachweise, Compliance', summary: 'Die freigegebenen Felder des Produktpasses mit Nachweisen.', page: 'customer' },
  { id: 'logistics', title: 'Logistik & Distribution', icon: 'truck', data: 'Transporte, Standorte, Emissionen', summary: 'Sendungen und Transportemissionen entlang der Kette.', page: 'supplier' },
  { id: 'use', title: 'Nutzung & Performance', icon: 'car', data: 'Echtzeitdaten, Alterung, Reichweite, Zyklen', summary: 'Zustand und Leistung im Betrieb.', page: 'aftersales' },
  { id: 'secondlife', title: 'Second Life / Remanufacturing', icon: 'gear', data: 'Zustand, Wiederverwendung, Reparatur', summary: 'Eignung für eine zweite Nutzung.', page: 'aftersales' },
  { id: 'recycling', title: 'Recycling & Kreislaufwirtschaft', icon: 'recycle', data: 'Demontage, Stoffströme, Rezyklate', summary: 'Rückgewinnung von Rohstoffen.', page: 'aftersales' },
];
export const oemDppIds = c.group('oem.dpp', dpp, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: r.summary,
  fields: [fld(`${id}.data`, 'Enthaltene Informationen', r.data, { src: 'DPP' })],
  related: [link('Zur Fachseite', r.page)],
}));

export const oemContent = { fields: c.fields, sections: c.sections };
