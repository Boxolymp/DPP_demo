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

/** `href` öffnet direkt eine externe Seite (neuer Tab) statt einer Bereichsansicht. */
export interface AreaItem {
  id: string;
  label: string;
  href?: string;
}

interface AreaDef {
  id: string;
  label: string;
  icon: IconName;
  items: readonly AreaItem[];
  /** Eingebettete Anwendung statt des Seiteninhalts (für alle Einträge des Bereichs); Same-Origin-Pfad, per Proxy in `vite.config.ts`. */
  embedUrl?: string;
}

/**
 * Bereiche der Sidebar, ebenfalls einzige Quelle für deren Routen.
 * Je Bereich genau eine Seite (`/<id>`); ein Eintrag wird nur per Query (`?item=`) ausgewählt, ohne eigene Route.
 */
export const AREAS = [
  {
    id: 'sources',
    label: 'Quellsysteme',
    icon: 'database',
    embedUrl: '/dashboard',
    items: [
      { id: 'erp', label: 'ERP' },
      { id: 'pdm', label: 'PDM' },
      { id: 'bms', label: 'BMS' },
      { id: 'excel', label: 'Excel' },
      { id: 'lca', label: 'LCA' },
      { id: 'design', label: 'Design' },
      { id: 'service', label: 'Service' },
    ],
  },
  {
    id: 'data-factory',
    label: 'Data Factory',
    icon: 'factory',
    items: [
      { id: 'fabric', label: 'Microsoft Fabric', href: 'https://spicy-acorn-f7a0401d1b-germanywestcentral.webapp.fabricapps.net/' },
      { id: 'datastructure', label: 'Datastructure' },
    ],
  },
  {
    id: 'data-platforms',
    label: 'Data Platforms',
    icon: 'globe',
    items: [
      { id: 'catena-x', label: 'Catena-X' },
      { id: 'open-dpp', label: 'Open DPP' },
    ],
  },
  {
    id: 'use-cases',
    label: 'Use Cases',
    icon: 'dots',
    items: [
      { id: '1', label: 'Use Case 1' },
      { id: '2', label: 'Use Case 2' },
      { id: '3', label: 'Use Case 3' },
      { id: '4', label: 'Use Case 4' },
    ],
  },
] as const satisfies readonly AreaDef[];

export type Area = (typeof AREAS)[number];

export const AREA_ITEM_PARAM = 'item';
export const areaPath = (areaId: Area['id'], itemId?: string) =>
  itemId ? `/${areaId}?${AREA_ITEM_PARAM}=${encodeURIComponent(itemId)}` : `/${areaId}`;
