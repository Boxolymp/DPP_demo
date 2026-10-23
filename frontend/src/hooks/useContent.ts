import { useParams } from 'react-router-dom';
import { fieldRegistry, sectionRegistry } from '../content';
import type { DataField, Section } from '../types/content';

export const DEFAULT_PRODUCT_ID = 'm3';

/** Einziger Zugriffspunkt auf Feldwerte. In Phase 2 wird hier die API angebunden. */
export function useField(key: string): DataField {
  return (
    fieldRegistry.get(key) ?? {
      key,
      label: key,
      status: 'unavailable',
      description: 'Dieses Feld ist in der Inhaltsschicht nicht definiert.',
    }
  );
}

export function useSection(id: string): Section {
  return (
    sectionRegistry.get(id) ?? {
      id,
      title: id,
      summary: 'Dieser Bereich ist in der Inhaltsschicht nicht definiert.',
      fieldKeys: [],
      related: [],
    }
  );
}

export function useProductId(): string {
  return useParams().productId ?? DEFAULT_PRODUCT_ID;
}
