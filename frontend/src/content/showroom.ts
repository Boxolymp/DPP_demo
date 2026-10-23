import type { IconName } from '../components/ui/Icon';
import type { Tone } from '../types/content';

/** Produktgruppen im Katalog. Nur Gruppen mit `active` haben Fachseiten. */
export interface ProductGroup {
  id: 'batteries' | 'textiles' | 'electronics' | 'furniture' | 'tires';
  title: string;
  icon: IconName;
  status: string;
  tone: Tone;
  text: string;
  /** Produkt, auf das die Gruppe verweist (nur bei aktiven Gruppen). */
  productId?: string;
}

export const PRODUCT_GROUPS: ProductGroup[] = [
  { id: 'batteries', title: 'Batterien', icon: 'battery', status: 'DPP-Pflicht', tone: 'ok', text: 'Batterien und Akkumulatoren für Elektrofahrzeuge, Industrie- und Konsumanwendungen.', productId: 'm3' },
  { id: 'textiles', title: 'Textilien', icon: 'box', status: 'In Umsetzung', tone: 'warn', text: 'Bekleidung, Heimtextilien und weitere textile Produkte.' },
  { id: 'electronics', title: 'Elektronik', icon: 'gear', status: 'In Vorbereitung', tone: 'warn', text: 'Elektrische und elektronische Geräte und Komponenten.' },
  { id: 'furniture', title: 'Möbel', icon: 'home', status: 'In Vorbereitung', tone: 'warn', text: 'Sitzmöbel, Schränke, Matratzen und weitere Möbelprodukte.' },
  { id: 'tires', title: 'Reifen', icon: 'car', status: 'In Umsetzung', tone: 'warn', text: 'Reifen für Pkw, Lkw und weitere Fahrzeuge.' },
];

export const SHOWROOM_INFO = [
  { title: 'Der Digitale Produktpass', text: 'Für bestimmte Produktgruppen entstehen regulatorische Anforderungen an digitale Produktpässe. Der DPP schafft Transparenz über Herkunft, Materialien, Umweltauswirkungen und weitere Produktinformationen entlang der gesamten Wertschöpfungskette.', icon: 'leaf' as IconName },
  { title: 'Regulatorischer Hintergrund', text: 'Der DPP ist Teil der EU-Initiativen für eine zirkuläre und nachhaltige Wirtschaft, beginnend mit ausgewählten Produktgruppen.', icon: 'globe' as IconName },
  { title: 'Skalierbar', text: 'Weitere Produktgruppen werden schrittweise ergänzt.', icon: 'chart' as IconName },
];
