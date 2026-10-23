import type { DataField, Section } from '../types/content';
import { aftersalesContent } from './aftersales';
import { customerContent } from './customer';
import { footprintContent } from './footprint';
import { oemContent } from './oem';
import { supplierContent } from './supplier';

const all = [oemContent, customerContent, supplierContent, footprintContent, aftersalesContent];

/**
 * Inhaltsschicht (Phase 1). Wird in Phase 2 durch API-Aufrufe ersetzt;
 * Komponenten greifen nur über die Hooks `useField` und `useSection` zu.
 */
export const fieldRegistry = new Map<string, DataField>();
export const sectionRegistry = new Map<string, Section>();

for (const part of all) {
  for (const f of part.fields) {
    if (fieldRegistry.has(f.key)) throw new Error(`Doppelter Feldschlüssel: ${f.key}`);
    fieldRegistry.set(f.key, f);
  }
  for (const s of part.sections) {
    if (sectionRegistry.has(s.id)) throw new Error(`Doppelte Sektions-ID: ${s.id}`);
    sectionRegistry.set(s.id, s);
  }
}
