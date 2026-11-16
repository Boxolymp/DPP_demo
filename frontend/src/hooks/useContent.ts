import { useSyncExternalStore } from 'react';
import { useParams } from 'react-router-dom';
import { fieldRegistry, sectionRegistry } from '../content';
import { datastructureRegistry, type AasRegistry } from '../content/datastructure';
import { aasSession, MAX_IMPORT_BYTES, type ImportResult } from '../lib/aas/session';
import type { DataField, Section } from '../types/content';

export const DEFAULT_PRODUCT_ID = 'm3';

const warned = new Set<string>();
/** Fehlende Schlüssel zeigen einen Platzhalter, fallen im Entwicklungsmodus aber einmalig auf. */
function warnMissing(kind: string, key: string) {
  if (!import.meta.env.DEV || warned.has(key)) return;
  warned.add(key);
  console.warn(`Inhaltsschicht: ${kind} „${key}“ ist nicht definiert.`);
}

/** Datastructure-Felder hängen am Tab-Speicher der geladenen AAS-Teilmodelle; alle übrigen sind statisch. */
function useAasRegistry(): AasRegistry {
  return datastructureRegistry(useSyncExternalStore(aasSession.subscribe, aasSession.getSnapshot));
}

function lookupField(key: string, aas: AasRegistry): DataField {
  const f = fieldRegistry.get(key) ?? aas.fields.get(key);
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
  return lookupField(key, useAasRegistry());
}

export function useFields(keys: string[]): DataField[] {
  const aas = useAasRegistry();
  return keys.map((k) => lookupField(k, aas));
}

export function useSection(id: string): Section {
  const aas = useAasRegistry();
  const s = sectionRegistry.get(id) ?? aas.sections.get(id);
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

async function importAasFiles(files: File[]): Promise<ImportResult[]> {
  const results: ImportResult[] = [];
  for (const file of files) {
    if (file.size > MAX_IMPORT_BYTES) {
      results.push({ fileName: file.name, accepted: [], rejected: [], shellLoaded: false, stored: true, error: 'Datei ist zu groß (maximal 2 MB).' });
      continue;
    }
    results.push(aasSession.importText(await file.text(), file.name));
  }
  return results;
}

/** Beispielinstanz aus dem Übergabepaket; erst bei Bedarf geladen und nur für diesen Tab übernommen. */
async function loadAasExample(): Promise<ImportResult> {
  const example = await import('../content/aas/idta-inspired-partial-aas.json');
  return aasSession.importEnvironment(example.default, 'Beispielinstanz (Übergabepaket)', 'example');
}

/** Geladene AAS-Teilmodelle dieses Tabs und die Aktionen dazu (Data Factory → Datastructure). */
export function useAasSession() {
  const state = useSyncExternalStore(aasSession.subscribe, aasSession.getSnapshot);
  return { entries: state.entries, shell: state.shell, importFiles: importAasFiles, loadExample: loadAasExample, clear: aasSession.clear };
}
