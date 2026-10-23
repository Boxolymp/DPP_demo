import type { IconName } from '../components/ui/Icon';

interface PageDef {
  id: string;
  label: string;
  icon: IconName;
  /** true: erscheint auch im Perspektivenwechsler der Kopfzeile. */
  perspective: boolean;
}

/** Einzige Quelle für die Fachseiten eines Produkts: Routen, Navigation und Verknüpfungen leiten sich hieraus ab. */
export const PAGES = [
  { id: 'oem', label: 'OEM', icon: 'car', perspective: true },
  { id: 'customer', label: 'Endkunde', icon: 'user', perspective: true },
  { id: 'supplier', label: 'Zulieferer', icon: 'truck', perspective: true },
  { id: 'footprint', label: 'CO₂ & Scopes', icon: 'leaf', perspective: false },
  { id: 'aftersales', label: 'Aftersales', icon: 'wrench', perspective: false },
] as const satisfies readonly PageDef[];

export type PageId = (typeof PAGES)[number]['id'];

export const productPath = (productId: string, page: PageId) => `/products/${productId}/${page}`;
