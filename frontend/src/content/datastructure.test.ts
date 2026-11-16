import { describe, expect, it } from 'vitest';
import { createAasSession } from '../lib/aas/session';
import example from './aas/idta-inspired-partial-aas.json';
import { aasDomainSectionIds, datastructureRegistry } from './datastructure';
import { fieldRegistry } from './index';

function registryFor(load?: (s: ReturnType<typeof createAasSession>) => void) {
  const s = createAasSession(null);
  load?.(s);
  const r = datastructureRegistry(s.getSnapshot());
  return (key: string) => {
    const f = r.fields.get(key);
    if (!f) throw new Error(`Feld fehlt: ${key}`);
    return f;
  };
}

const condition = () => structuredClone(example.submodels.find((s) => s.idShort === 'ProductCondition')!);

describe('Datastructure-Inhalte aus dem Tab-Speicher', () => {
  it('zeigt ohne geladene Teilmodelle alles als nicht verfügbar', () => {
    const field = registryFor();
    for (const key of ['aas.instance.id', 'aas.condition.stateOfCharge', 'aas.carbon.pcf', 'aas.material.batteryMaterials']) {
      expect(field(key).status).toBe('unavailable');
    }
    for (const id of aasDomainSectionIds) expect(field(`${id}.status`).status).toBe('unavailable');
    expect(field('aas.kpi.submodels').value).toBe('0 / 7');
    expect(field('aas.condition.stateOfCharge').description).toContain('nicht geladen');
  });

  it('kennzeichnet Werte aus der Beispielinstanz als illustrativ, mit Herkunft', () => {
    const field = registryFor((s) => s.importEnvironment(example, 'Beispiel', 'example'));
    const soc = field('aas.condition.stateOfCharge');
    expect(soc).toMatchObject({ value: '68', unit: '%', status: 'illustrative', sourceHint: 'AAS · IDTA 02035-5' });
    expect(soc.description).toContain('StateOfCharge.StateOfChargeValue');
    expect(soc.description).toContain('verified = false');
    expect(field('aas.kpi.submodels')).toMatchObject({ value: '7 / 7', status: 'illustrative' });
  });

  it('kennzeichnet Werte aus einem eigenen Import als importiert und nennt die Datei', () => {
    const field = registryFor((s) => s.importText(JSON.stringify(condition()), 'zustand.json'));
    const soc = field('aas.condition.stateOfCharge');
    expect(soc.status).toBe('imported');
    expect(soc.description).toContain('zustand.json');
    expect(field('aas.domain.02035-5.status')).toMatchObject({ value: 'vorhanden', status: 'imported' });
    expect(field('aas.domain.02035-1.status').status).toBe('unavailable');
    expect(field('aas.kpi.submodels')).toMatchObject({ value: '1 / 7', status: 'imported' });
  });

  it('leitet SoH nicht ab, sondern meldet es als nicht verfügbar', () => {
    const soh = registryFor((s) => s.importEnvironment(example, 'Beispiel', 'example'))('aas.condition.stateOfHealth');
    expect(soh.status).toBe('unavailable');
    expect(soh.value).toBeUndefined();
  });

  it('zeigt den PCF mit seiner Bezugsgröße und ohne Umrechnung', () => {
    const field = registryFor((s) => s.importEnvironment(example, 'Beispiel', 'example'));
    expect(field('aas.carbon.pcf')).toMatchObject({ value: '6.400', unit: 'kg CO₂e je Stück', status: 'illustrative' });
  });

  it('behält 0 als Wert (leeres Teilmodell hat 0 befüllte Elemente)', () => {
    const field = registryFor((s) => s.importEnvironment(example, 'Beispiel', 'example'));
    expect(field('aas.domain.02035-2.elements')).toMatchObject({ value: 0, status: 'illustrative' });
  });

  it('berechnet je Sitzungsstand nur einmal', () => {
    const s = createAasSession(null);
    expect(datastructureRegistry(s.getSnapshot())).toBe(datastructureRegistry(s.getSnapshot()));
  });

  it('enthält in Phase 1 kein Feld mit Status live', () => {
    const r = datastructureRegistry((() => {
      const s = createAasSession(null);
      s.importEnvironment(example, 'Beispiel', 'example');
      return s.getSnapshot();
    })());
    const all = [...fieldRegistry.values(), ...r.fields.values()];
    expect(all.filter((f) => f.status === 'live')).toHaveLength(0);
  });
});
