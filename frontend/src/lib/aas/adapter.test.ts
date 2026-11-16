import { describe, expect, it } from 'vitest';
import official from '../../content/aas/idta-inspired-partial-aas.json';
import { flattenElements, indexEnvironment, referenceIds, toEnvironment, toViewModel, type AasEnvironment } from './adapter';
import expected from './expected-view-model.json';

const env = official as AasEnvironment;
const clone = (): AasEnvironment => structuredClone(env);

describe('AAS-Adapter (übernommen aus dem Übergabepaket)', () => {
  it('liefert dasselbe ViewModel wie die Referenzimplementierung des Pakets', () => {
    expect(toViewModel(env)).toEqual(expected);
  });

  it('erkennt genau sieben IDTA-Domänen über verifizierte semanticIds', () => {
    const i = indexEnvironment(env);
    expect(i.recognizedCount).toBe(7);
    for (const s of Object.values(i.sections)) expect(s.match).toBe('semanticId');
    expect(referenceIds(i.shell)).toHaveLength(7);
    expect(i.diagnostics.filter((d) => d.code === 'UNRESOLVED_SUBMODEL_REFERENCE')).toHaveLength(0);
  });

  it('liest StateOfCharge verschachtelt und mit dem eigenen LastUpdate', () => {
    const v = toViewModel(env);
    expect(v.condition.stateOfCharge?.value).toBe(68);
    expect(v.condition.stateOfChargeUpdated?.value).toBe('2026-11-15T12:00:00Z');
    expect(v.condition.stateOfChargeUpdated?.provenance.path).toBe('StateOfCharge.LastUpdate');
    expect(v.condition.cycles?.value).toBe(420);
    expect(v.condition.stateOfHealthDemoOnly).toBeNull();
  });

  it('bewahrt die PCF-Bezugsgröße, keine versteckte Tonnen-Umrechnung', () => {
    const v = toViewModel(env);
    expect(v.carbon.pcf?.value).toBe(6400);
    expect(v.carbon.pcf?.referenceUnit).toBe('piece');
    expect(v.carbon.pcf?.unit).toMatch(/piece/);

    const edited = clone();
    const pcf = ((edited.submodels[2].submodelElements![0].value as { value: { idShort: string; value: string }[] }[])[0]).value;
    pcf.find((x) => x.idShort === 'ReferenceImpactUnitForCalculation')!.value = 'kWh';
    const x = toViewModel(edited);
    expect(x.carbon.pcf?.value).toBe(6400);
    expect(x.carbon.pcf?.referenceUnit).toBe('kWh');
    expect(x.carbon.pcf?.validForSummarization).toBe(false);
  });

  it('fehlende Teilmodelle ergeben null statt Ersatzwerten', () => {
    const edited = clone();
    edited.submodels = edited.submodels.filter((s) => s.idShort !== 'ProductCondition');
    const x = toViewModel(edited);
    expect(x.condition.stateOfCharge).toBeNull();
    expect(x.idtaDomains.find((d) => d.idta === '02035-5')?.present).toBe(false);
    expect(x.diagnostics.some((d) => d.code === 'UNRESOLVED_SUBMODEL_REFERENCE')).toBe(true);
  });

  it('erkennt Legacy-Aliase nur als Fallback, nicht als semantische Validierung', () => {
    const legacy = {
      assetAdministrationShells: [],
      submodels: [
        {
          modelType: 'Submodel',
          id: 'urn:test:legacy-condition',
          idShort: 'ProductCondition',
          submodelElements: [{ modelType: 'Property', idShort: 'StateOfHealthPercent', valueType: 'xs:float', value: '94' }],
        },
      ],
    };
    const v = toViewModel(legacy);
    expect(v.condition.stateOfHealthDemoOnly?.value).toBe(94);
    expect(v.idtaDomains.find((d) => d.idta === '02035-5')?.recognition).toBe('idShort-fallback');
    expect(v.diagnostics.some((d) => d.code === 'FALLBACK_MATCH')).toBe(true);
  });

  it('flacht Listen und Collections ab und behält Pfad und Wert', () => {
    const x = flattenElements(env.submodels[2]);
    expect(x.find((f) => f.idShort === 'PcfCO2eq')?.value).toBe('6400');
    expect(x.find((f) => f.idShort === 'ReferenceImpactUnitForCalculation')?.value).toBe('piece');
  });

  it('weist nicht unterstützte Strukturen ab', () => {
    expect(() => toEnvironment({ foo: 1 })).toThrow(/Unsupported/);
  });
});
