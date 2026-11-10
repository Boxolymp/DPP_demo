import type { IconName } from '../components/ui/Icon';

interface PageDef {
  id: string;
  label: string;
  icon: IconName;
  /** Gruppe in der Kopfzeile: Rollenperspektive oder übergreifende Ansicht. */
  group: 'role' | 'view';
}

/** Einzige Quelle für die Fachseiten eines Produkts: Routen, Navigation und Verknüpfungen leiten sich hieraus ab. */
export const PAGES = [
  { id: 'supplier', label: 'Zulieferer', icon: 'truck', group: 'role' },
  { id: 'oem', label: 'OEM', icon: 'car', group: 'role' },
  { id: 'customer', label: 'Endkunde', icon: 'user', group: 'role' },
  { id: 'footprint', label: 'CO₂ & Scopes', icon: 'leaf', group: 'view' },
  { id: 'aftersales', label: 'Aftersales', icon: 'wrench', group: 'view' },
] as const satisfies readonly PageDef[];

export type PageId = (typeof PAGES)[number]['id'];

export const productPath = (productId: string, page: PageId) => `/products/${productId}/${page}`;
