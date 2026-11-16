import { describe, expect, it } from 'vitest';
import example from '../../content/aas/idta-inspired-partial-aas.json';
import { createAasSession, MAX_IMPORT_BYTES } from './session';

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

const conditionSubmodel = () => structuredClone(example.submodels.find((s) => s.idShort === 'ProductCondition')!);

describe('AAS-Tab-Speicher', () => {
  it('startet leer', () => {
    expect(createAasSession(memoryStorage()).getSnapshot()).toEqual({ shell: null, entries: [] });
  });

  it('übernimmt ein einzelnes IDTA-Teilmodell als Import und legt es im Tab-Speicher ab', () => {
    const storage = memoryStorage();
    const s = createAasSession(storage);
    const r = s.importText(JSON.stringify(conditionSubmodel()), 'zustand.json');
    expect(r.error).toBeUndefined();
    expect(r.accepted).toEqual([{ domain: '02035-5', name: 'Product Condition', match: 'semanticId', replaced: false }]);
    expect(s.getSnapshot().entries[0]).toMatchObject({ domain: '02035-5', origin: 'import', fileName: 'zustand.json' });
    expect(storage.data.size).toBe(1);
    // Neuer Tab-Zugriff auf denselben Speicher (z. B. nach Neuladen) sieht denselben Stand.
    expect(createAasSession(storage).getSnapshot().entries).toHaveLength(1);
  });

  it('ersetzt ein Teilmodell derselben Domäne statt es zu doppeln', () => {
    const s = createAasSession(memoryStorage());
    s.importEnvironment(example, 'Beispiel', 'example');
    const r = s.importText(JSON.stringify(conditionSubmodel()), 'neu.json');
    expect(r.accepted[0].replaced).toBe(true);
    const entries = s.getSnapshot().entries;
    expect(entries).toHaveLength(7);
    expect(entries.find((e) => e.domain === '02035-5')).toMatchObject({ origin: 'import', fileName: 'neu.json' });
    expect(entries.find((e) => e.domain === '02035-1')?.origin).toBe('example');
  });

  it('lehnt Teilmodelle außerhalb von IDTA 02035 mit Begründung ab', () => {
    const s = createAasSession(memoryStorage());
    const other = { modelType: 'Submodel', id: 'urn:x', idShort: 'DigitalProductPassport', submodelElements: [] };
    const r = s.importText(JSON.stringify(other), 'fremd.json');
    expect(r.accepted).toHaveLength(0);
    expect(r.rejected[0]).toMatchObject({ label: 'DigitalProductPassport' });
    expect(r.rejected[0].reason).toMatch(/kein IDTA-02035/);
    expect(s.getSnapshot().entries).toHaveLength(0);
  });

  it('übernimmt je Domäne nur das erste Teilmodell einer Datei', () => {
    const s = createAasSession(memoryStorage());
    const r = s.importText(JSON.stringify({ result: [conditionSubmodel(), conditionSubmodel()] }), 'doppelt.json');
    expect(r.accepted).toHaveLength(1);
    expect(r.rejected[0].reason).toMatch(/mehrfach/);
  });

  it('meldet ungültiges JSON, falsche Struktur und zu große Dateien, ohne etwas zu übernehmen', () => {
    const s = createAasSession(memoryStorage());
    expect(s.importText('{kaputt', 'a.json').error).toMatch(/kein gültiges JSON/);
    expect(s.importText('{"foo":1}', 'b.json').error).toMatch(/Kein unterstütztes AAS-JSON/);
    expect(s.importText(' '.repeat(MAX_IMPORT_BYTES + 1), 'c.json').error).toMatch(/zu groß/);
    expect(s.getSnapshot().entries).toHaveLength(0);
  });

  it('verwirft auf Wunsch alles und leert den Tab-Speicher', () => {
    const storage = memoryStorage();
    const s = createAasSession(storage);
    s.importEnvironment(example, 'Beispiel', 'example');
    s.clear();
    expect(s.getSnapshot()).toEqual({ shell: null, entries: [] });
    expect(storage.data.size).toBe(0);
  });

  it('arbeitet ohne Tab-Speicher weiter und meldet das', () => {
    const s = createAasSession(null);
    const r = s.importText(JSON.stringify(conditionSubmodel()), 'zustand.json');
    expect(r.accepted).toHaveLength(1);
    expect(r.stored).toBe(false);
  });

  it('ignoriert einen beschädigten Speicherinhalt', () => {
    const storage = memoryStorage();
    storage.setItem('dpp-demo.aas-session.v1', '{"entries":"x"}');
    expect(createAasSession(storage).getSnapshot()).toEqual({ shell: null, entries: [] });
  });

  it('benachrichtigt Abonnenten bei Änderungen', () => {
    const s = createAasSession(memoryStorage());
    let calls = 0;
    const off = s.subscribe(() => calls++);
    s.importEnvironment(example, 'Beispiel', 'example');
    off();
    s.clear();
    expect(calls).toBe(1);
  });
});
