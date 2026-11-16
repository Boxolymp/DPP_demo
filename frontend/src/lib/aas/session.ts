/**
 * Tab-lokaler Speicher für geladene AAS-Teilmodelle (Data Factory → Datastructure).
 * Ablage in sessionStorage: übersteht Neuladen, wird beim Schließen des Tabs gelöscht. Keine Übertragung an Server.
 * Angenommen werden nur die sieben IDTA-02035-Teilmodelle; je Domäne gilt der zuletzt geladene Stand.
 */
import { classifySubmodel, toEnvironment, type AasEnvironment, type AasShell, type AasSubmodel, type Match } from './adapter';

export type Origin = 'example' | 'import';

export interface SessionEntry {
  /** IDTA-Domäne, z. B. "02035-5". */
  domain: string;
  name: string;
  origin: Origin;
  fileName: string;
  submodel: AasSubmodel;
}

export interface SessionState {
  shell: { origin: Origin; fileName: string; shell: AasShell } | null;
  entries: SessionEntry[];
}

export interface ImportResult {
  fileName: string;
  accepted: { domain: string; name: string; match: Match; replaced: boolean }[];
  rejected: { label: string; reason: string }[];
  shellLoaded: boolean;
  /** Fehler für die ganze Datei; dann wurde nichts übernommen. */
  error?: string;
  /** false: sessionStorage nicht beschreibbar, Daten nur bis zum Neuladen im Speicher. */
  stored: boolean;
}

type SessionStorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Obergrenze je Datei; sessionStorage fasst je Ursprung nur wenige MB. */
export const MAX_IMPORT_BYTES = 2_000_000;
const KEY = 'dpp-demo.aas-session.v1';
const EMPTY: SessionState = { shell: null, entries: [] };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function isState(v: unknown): v is SessionState {
  if (!isObject(v) || !Array.isArray(v.entries)) return false;
  const shellOk = v.shell === null || (isObject(v.shell) && isObject(v.shell.shell));
  return shellOk && v.entries.every((e) => isObject(e) && typeof e.domain === 'string' && isObject(e.submodel) && (e.origin === 'example' || e.origin === 'import'));
}

/** Zusammengesetzte AAS-Umgebung aus allen geladenen Teilen. */
export function sessionEnvironment(state: SessionState): AasEnvironment {
  return { assetAdministrationShells: state.shell ? [state.shell.shell] : [], submodels: state.entries.map((e) => e.submodel) };
}

export function createAasSession(storage: SessionStorageLike | null) {
  const listeners = new Set<() => void>();
  let persisted = storage !== null;
  let state = read();

  function read(): SessionState {
    try {
      const raw = storage?.getItem(KEY);
      if (!raw) return EMPTY;
      const parsed: unknown = JSON.parse(raw);
      return isState(parsed) ? parsed : EMPTY;
    } catch {
      return EMPTY;
    }
  }

  function commit(next: SessionState) {
    state = next;
    try {
      if (!storage) throw new Error('kein sessionStorage');
      if (next.entries.length === 0 && !next.shell) storage.removeItem(KEY);
      else storage.setItem(KEY, JSON.stringify(next));
      persisted = true;
    } catch {
      persisted = false;
    }
    listeners.forEach((l) => l());
  }

  function importEnvironment(payload: unknown, fileName: string, origin: Origin): ImportResult {
    const result: ImportResult = { fileName, accepted: [], rejected: [], shellLoaded: false, stored: persisted };
    let env: AasEnvironment;
    try {
      env = toEnvironment(payload);
    } catch {
      return {
        ...result,
        error: 'Kein unterstütztes AAS-JSON. Erwartet wird eine AAS-Umgebung, ein einzelnes Teilmodell, eine Shell oder eine result-Liste.',
      };
    }

    const entries = [...state.entries];
    const seen = new Set<string>();
    for (const sm of env.submodels as unknown[]) {
      if (!isObject(sm)) {
        result.rejected.push({ label: 'Eintrag ohne Objektstruktur', reason: 'kein AAS-Teilmodell' });
        continue;
      }
      const submodel = sm as AasSubmodel;
      const label = submodel.idShort || submodel.id || 'Teilmodell ohne idShort';
      const m = classifySubmodel(submodel);
      if (!m) {
        result.rejected.push({ label, reason: 'kein IDTA-02035-Batterie-Teilmodell (semanticId und idShort unbekannt)' });
        continue;
      }
      if (seen.has(m.def.idta)) {
        result.rejected.push({ label, reason: `Domäne ${m.def.idta} kommt in der Datei mehrfach vor; nur das erste Teilmodell wird übernommen` });
        continue;
      }
      seen.add(m.def.idta);
      const entry: SessionEntry = { domain: m.def.idta, name: m.def.name, origin, fileName, submodel };
      const i = entries.findIndex((e) => e.domain === m.def.idta);
      if (i >= 0) entries[i] = entry;
      else entries.push(entry);
      result.accepted.push({ domain: m.def.idta, name: m.def.name, match: m.match, replaced: i >= 0 });
    }

    const shell = (env.assetAdministrationShells as unknown[]).find(isObject) as AasShell | undefined;
    if (result.accepted.length === 0 && !shell) {
      return { ...result, error: result.rejected.length ? undefined : 'Die Datei enthält keine Teilmodelle.' };
    }
    result.shellLoaded = Boolean(shell);
    entries.sort((a, b) => a.domain.localeCompare(b.domain));
    commit({ shell: shell ? { origin, fileName, shell } : state.shell, entries });
    return { ...result, stored: persisted };
  }

  function importText(text: string, fileName: string): ImportResult {
    const empty: ImportResult = { fileName, accepted: [], rejected: [], shellLoaded: false, stored: persisted };
    if (text.length > MAX_IMPORT_BYTES) return { ...empty, error: 'Datei ist zu groß (maximal 2 MB).' };
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      return { ...empty, error: 'Die Datei ist kein gültiges JSON.' };
    }
    return importEnvironment(payload, fileName, 'import');
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => state,
    importText,
    importEnvironment,
    clear: () => commit(EMPTY),
  };
}

function tabStorage(): SessionStorageLike | null {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

/** Eine Sitzung je Browser-Tab. */
export const aasSession = createAasSession(tabStorage());
