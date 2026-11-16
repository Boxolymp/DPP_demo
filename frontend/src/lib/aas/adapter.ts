/**
 * Minimaler AAS-3.x-Leser und ViewModel-Abbildung, übernommen aus dem Übergabepaket
 * „Battery AAS Demonstrator Dev Handoff“ (src/aas-adapter.mjs, Stand 2026-11-16), ohne Node-APIs.
 * Kein IDTA-Template-Validator und keine AAS-Konformitätsprüfung.
 * Weggelassen: `base64url` (nur für den Live-Abruf eines AAS-Repositorys nötig, der in Phase 1 entfällt).
 */
import catalogJson from './submodels.json';

export interface CatalogEntry {
  idta: string;
  name: string;
  templateVersion: string;
  idShort: string;
  semanticIds: string[];
  source: string;
  examplePaths: string[];
}

/** Verifizierte Top-Level-Erkennung der sieben IDTA-02035-Teilmodelle (config/submodels.json des Pakets). */
export const catalog: readonly CatalogEntry[] = catalogJson.submodels;

type Json = Record<string, unknown>;
interface Reference {
  keys?: { value?: string }[];
}
export interface AasElement extends Json {
  idShort?: string;
  modelType?: string | { name?: string };
  semanticId?: Reference;
  supplementalSemanticIds?: Reference[];
  valueType?: string;
  category?: string;
  value?: unknown;
  statements?: AasElement[];
  annotations?: AasElement[];
}
export interface AasSubmodel extends Json {
  id?: string;
  idShort?: string;
  modelType?: string;
  semanticId?: Reference;
  submodelElements?: AasElement[];
}
export interface AasShell extends Json {
  id?: string;
  modelType?: string;
  assetInformation?: { globalAssetId?: string };
  submodels?: Reference[];
}
export interface AasEnvironment {
  assetAdministrationShells: AasShell[];
  submodels: AasSubmodel[];
}

export type Match = 'semanticId' | 'idShort-fallback';

export interface FlatElement {
  path: string;
  idShort: string | null;
  modelType: string;
  value: string | number | boolean | null;
  semanticIds: string[];
  valueType: string | null;
  category: string | null;
}

export interface Diagnostic {
  severity: 'info' | 'warning';
  code: 'UNKNOWN_SUBMODEL' | 'DUPLICATE_DOMAIN' | 'FALLBACK_MATCH' | 'UNRESOLVED_SUBMODEL_REFERENCE';
  id?: string | null;
  domain?: string;
  submodelId?: string;
}

export interface IndexedSection {
  id: string | null;
  idShort: string | null;
  semanticIds: string[];
  match: Match;
  fields: FlatElement[];
  source: 'AAS';
}

export interface AasIndex {
  shell: AasShell | null;
  sections: Record<string, IndexedSection>;
  diagnostics: Diagnostic[];
  submodelCount: number;
  recognizedCount: number;
}

export interface Provenance {
  submodelId: string | null;
  path: string;
  match: Match;
  semanticIds: string[];
  /** Immer false, bis eine Quellenbestätigung vorgesehen ist. */
  verified: false;
}

export interface ViewValue<T = FlatElement['value']> {
  value: T;
  unit: string | null;
  provenance: Provenance;
}

export interface PcfValue {
  value: number | null;
  unit: string;
  referenceUnit: string | null;
  validForSummarization: boolean;
  provenance: Provenance | undefined;
}

export interface ViewModel {
  schemaVersion: '1.0';
  mode: 'demo' | 'live';
  instanceId: string | null;
  idtaDomains: { idta: string; name: string; version: string; present: boolean; recognition: Match | null }[];
  nameplate: Record<'manufacturer' | 'serialNumber' | 'manufactured' | 'lifecycleStage', ViewValue | null>;
  technical: Record<'nominalVoltage' | 'certifiedUsableEnergy' | 'demoNominalEnergy' | 'ratedCapacity', ViewValue<number> | null>;
  condition: {
    stateOfCharge: ViewValue<number> | null;
    stateOfChargeUpdated: ViewValue | null;
    cycles: ViewValue<number> | null;
    stateOfHealthDemoOnly: ViewValue<number> | null;
  };
  material: { chemistry: ViewValue | null };
  carbon: { pcf: PcfValue | null };
  diagnostics: Diagnostic[];
  limitations: string[];
}

export const refValues = (ref?: Reference): string[] =>
  Array.isArray(ref?.keys) ? ref.keys.map((k) => k.value).filter((v): v is string => Boolean(v)) : [];

export function referenceIds(shell: AasShell | null): string[] {
  return (shell?.submodels ?? []).flatMap((r) => refValues(r));
}

export function toEnvironment(payload: unknown): AasEnvironment {
  const p = payload as Json | null;
  if (p && Array.isArray(p.assetAdministrationShells) && Array.isArray(p.submodels)) return p as unknown as AasEnvironment;
  if (p && p.modelType === 'AssetAdministrationShell') return { assetAdministrationShells: [p as AasShell], submodels: [] };
  if (p && p.modelType === 'Submodel') return { assetAdministrationShells: [], submodels: [p as AasSubmodel] };
  if (p && Array.isArray(p.result)) return { assetAdministrationShells: [], submodels: p.result as AasSubmodel[] };
  throw new Error('Unsupported AAS JSON input: expected Environment, Submodel, Shell, or result list.');
}

function typeOf(element: AasElement): string {
  const t = element?.modelType;
  return typeof t === 'string' ? t : t?.name ?? '';
}

function displayValue(node: AasElement): FlatElement['value'] {
  if (typeOf(node) === 'MultiLanguageProperty' && Array.isArray(node.value)) {
    const texts = node.value as { language?: string; text?: string }[];
    const english = texts.find((x) => x.language === 'en');
    return english?.text ?? texts[0]?.text ?? null;
  }
  if (node.value == null) return null;
  return typeof node.value === 'object' ? JSON.stringify(node.value) : (node.value as string | number | boolean);
}

/** Traversiert SML/SMC/Entity rekursiv und liefert die Blattelemente mit Pfad. */
export function flattenElements(submodel: AasSubmodel | undefined): FlatElement[] {
  const out: FlatElement[] = [];
  function visit(nodes: unknown, prefix = '') {
    if (!Array.isArray(nodes)) return;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i] as AasElement;
      if (!n || typeof n !== 'object') continue;
      const t = typeOf(n);
      const segment = n.idShort || (prefix.includes('[') ? `[${i}]` : `item${i}`);
      const location = prefix ? (segment.startsWith('[') ? `${prefix}${segment}` : `${prefix}.${segment}`) : segment;
      const semanticIds = [...refValues(n.semanticId), ...(n.supplementalSemanticIds ?? []).flatMap(refValues)];
      if (t === 'SubmodelElementList' && Array.isArray(n.value)) {
        (n.value as AasElement[]).forEach((item, index) => visit([{ ...item, idShort: item.idShort || `[${index}]` }], location));
      } else if (['SubmodelElementCollection', 'Entity', 'AnnotatedRelationshipElement'].includes(t)) {
        visit(n.value || n.statements || n.annotations || [], location);
      } else if (Array.isArray(n.value) && t !== 'MultiLanguageProperty') {
        visit(n.value, location);
      } else {
        out.push({
          path: location,
          idShort: n.idShort || null,
          modelType: t,
          value: displayValue(n),
          semanticIds,
          valueType: n.valueType || null,
          category: n.category || null,
        });
      }
    }
  }
  visit(submodel?.submodelElements ?? []);
  return out;
}

/** Zuerst semanticId, dann exakter idShort; Legacy-Aliase gelten ausdrücklich als nicht konform. */
export function classifySubmodel(s: AasSubmodel): { def: CatalogEntry; match: Match } | null {
  const sem = refValues(s?.semanticId);
  for (const def of catalog) if (sem.some((id) => def.semanticIds.includes(id))) return { def, match: 'semanticId' };
  const legacy: Record<string, string> = { DigitalNameplate: '02035-1', ProductCarbonFootprint: '02035-3' };
  const byName = catalog.find((d) => d.idShort === s?.idShort || d.idta === legacy[s?.idShort ?? '']);
  return byName ? { def: byName, match: 'idShort-fallback' } : null;
}

export function indexEnvironment(environment: unknown): AasIndex {
  const env = toEnvironment(environment);
  const sections: Record<string, IndexedSection> = {};
  const diagnostics: Diagnostic[] = [];
  for (const sm of env.submodels) {
    const m = classifySubmodel(sm);
    if (!m) {
      diagnostics.push({ severity: 'info', code: 'UNKNOWN_SUBMODEL', id: sm.id || null });
      continue;
    }
    if (sections[m.def.idta]) {
      diagnostics.push({ severity: 'warning', code: 'DUPLICATE_DOMAIN', domain: m.def.idta });
      continue;
    }
    sections[m.def.idta] = {
      id: sm.id || null,
      idShort: sm.idShort || null,
      semanticIds: refValues(sm.semanticId),
      match: m.match,
      fields: flattenElements(sm),
      source: 'AAS',
    };
    if (m.match === 'idShort-fallback') diagnostics.push({ severity: 'warning', code: 'FALLBACK_MATCH', domain: m.def.idta });
  }
  const shell = env.assetAdministrationShells[0] || null;
  const refs = shell ? referenceIds(shell) : [];
  const ids = new Set(env.submodels.map((s) => s.id));
  for (const id of refs) if (!ids.has(id)) diagnostics.push({ severity: 'warning', code: 'UNRESOLVED_SUBMODEL_REFERENCE', submodelId: id });
  return { shell, sections, diagnostics, submodelCount: env.submodels.length, recognizedCount: Object.keys(sections).length };
}

const normalizedNumeric = (v: unknown): number | null => {
  if (v === null || v === undefined || String(v).trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

interface Found {
  value: NonNullable<FlatElement['value']>;
  path: string;
  submodelId: string | null;
  match: Match;
  semanticIds: string[];
}

function findField(index: AasIndex, code: string, paths: string[]): Found | null {
  const section = index.sections[code];
  if (!section) return null;
  for (const wanted of paths) {
    const w = wanted.toLowerCase();
    const f =
      section.fields.find((x) => x.path.toLowerCase() === w) ??
      section.fields.find((x) => x.path.split('.').pop()!.toLowerCase() === w);
    if (f && f.value !== null) return { value: f.value, path: f.path, submodelId: section.id, match: section.match, semanticIds: f.semanticIds };
  }
  return null;
}

const expose = (f: Found | null, unit: string | null = null): ViewValue | null =>
  f
    ? { value: f.value, unit, provenance: { submodelId: f.submodelId, path: f.path, match: f.match, semanticIds: f.semanticIds, verified: false } }
    : null;

export function toViewModel(environment: unknown, { mode = 'demo' }: { mode?: 'demo' | 'live' } = {}): ViewModel {
  const i = indexEnvironment(environment);
  const pick = (code: string, paths: string[], unit?: string) => expose(findField(i, code, paths), unit);
  const numeric = (code: string, paths: string[], unit: string): ViewValue<number> | null => {
    const result = pick(code, paths, unit);
    if (!result) return null;
    const n = normalizedNumeric(result.value);
    return n === null ? null : { ...result, value: n };
  };
  const pcfValue = findField(i, '02035-3', ['ProductCarbonFootprints[0].PcfCO2eq', 'PcfCO2eq', 'TotalCarbonFootprintKgCO2e']);
  const pcfUnit = findField(i, '02035-3', ['ReferenceImpactUnitForCalculation']);
  const isLegacy = pcfValue?.path === 'TotalCarbonFootprintKgCO2e';
  // Keine stille Umrechnung zwischen kg CO2e/Stück, kg CO2e/kWh oder t CO2e.
  const pcf: PcfValue | null = pcfValue
    ? {
        value: normalizedNumeric(pcfValue.value),
        unit: isLegacy ? 'kg CO2e (unverified demo)' : 'kg CO2e per ' + (pcfUnit?.value || 'UNSPECIFIED REFERENCE UNIT'),
        referenceUnit: pcfUnit ? String(pcfUnit.value) : null,
        validForSummarization: !!isLegacy || ['piece', 'pieces'].includes(String(pcfUnit?.value || '').toLowerCase()),
        provenance: expose(pcfValue)?.provenance,
      }
    : null;
  return {
    schemaVersion: '1.0',
    mode,
    instanceId: i.shell?.assetInformation?.globalAssetId || i.shell?.id || null,
    idtaDomains: catalog.map((s) => ({
      idta: s.idta,
      name: s.name,
      version: s.templateVersion,
      present: !!i.sections[s.idta],
      recognition: i.sections[s.idta]?.match || null,
    })),
    nameplate: {
      manufacturer: pick('02035-1', ['ManufacturerName']),
      serialNumber: pick('02035-1', ['SerialNumber', 'BatteryIdentifier']),
      manufactured: pick('02035-1', ['DateOfManufacture', 'ManufactureDate']),
      lifecycleStage: pick('02035-1', ['LifeCycleStage']),
    },
    technical: {
      nominalVoltage: numeric('02035-4', ['TechnicalPropertyAreas.CapacityEnergyVoltage.NominalVoltage', 'NominalVoltageV', 'NominalVoltage'], 'V'),
      certifiedUsableEnergy: numeric(
        '02035-4',
        ['TechnicalPropertyAreas.CapacityEnergyVoltage.CertifiedUsableBatteryEnergy', 'CertifiedUsableBatteryEnergy'],
        'kWh (check unit)',
      ),
      demoNominalEnergy: numeric('02035-4', ['NominalEnergyKWh'], 'kWh'),
      ratedCapacity: numeric('02035-4', ['RatedCapacity', 'NominalCapacityAh'], 'Ah'),
    },
    condition: {
      stateOfCharge: numeric('02035-5', ['StateOfCharge.StateOfChargeValue', 'StateOfChargePercent'], '%'),
      stateOfChargeUpdated: pick('02035-5', ['StateOfCharge.LastUpdate']),
      cycles: numeric('02035-5', ['NumberOfFullCycles.NumberOfFullCyclesValue', 'EquivalentFullCycles'], 'cycles'),
      stateOfHealthDemoOnly: numeric('02035-5', ['StateOfHealthPercent'], '%'),
    },
    material: { chemistry: pick('02035-6', ['BatteryChemistry.ShortName', 'BatteryChemistry.ClearName']) },
    carbon: { pcf },
    diagnostics: i.diagnostics,
    limitations: [
      'Not an IDTA validator',
      'No blanket legal compliance check',
      'Provenance.verified=false until source attestation',
      'SoH demo KPI is not automatically mapped from IDTA ProductCondition',
    ],
  };
}
