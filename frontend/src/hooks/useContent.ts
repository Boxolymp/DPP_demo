import { useParams } from 'react-router-dom';
import { fieldRegistry, sectionRegistry } from '../content';
import type { DataField, Section } from '../types/content';

export const DEFAULT_PRODUCT_ID = 'm3';

const warned = new Set<string>();
/** Fehlende Schlüssel zeigen einen Platzhalter, fallen im Entwicklungsmodus aber einmalig auf. */
function warnMissing(kind: string, key: string) {
  if (!import.meta.env.DEV || warned.has(key)) return;
  warned.add(key);
  console.warn(`Inhaltsschicht: ${kind} „${key}“ ist nicht definiert.`);
}

function lookupField(key: string): DataField {
  const f = fieldRegistry.get(key);
  if (f) return f;
  warnMissing('Feld', key);
  return {
    key,
    label: key,
    status: 'unavailable',
    description: 'Dieses Feld ist in der Inhaltsschicht nicht definiert.',
  };
}

/** Einziger Zugriffspunkt auf Feldwerte. In Phase 2 wird hier die API angebunden. */
export function useField(key: string): DataField {
  return lookupField(key);
}

export function useFields(keys: string[]): DataField[] {
  return keys.map(lookupField);
}

export function useSection(id: string): Section {
  const s = sectionRegistry.get(id);
  if (s) return s;
  warnMissing('Sektion', id);
  return {
    id,
    title: id,
    summary: 'Dieser Bereich ist in der Inhaltsschicht nicht definiert.',
    fieldKeys: [],
    related: [],
  };
}

export function useProductId(): string {
  return useParams().productId ?? DEFAULT_PRODUCT_ID;
}
