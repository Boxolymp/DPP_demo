/**
 * Data Factory → Datastructure: Felder und Sektionen aus den im Tab geladenen AAS-Teilmodellen (IDTA 02035).
 * Ohne geladene Teilmodelle ist alles „nicht verfügbar“. Quelle sind Nutzer-Importe (Status `imported`) oder die
 * Beispielinstanz aus dem Übergabepaket „Battery AAS Demonstrator Dev Handoff“ (erfundene Demowerte, `illustrative`).
 * Die Werte entstehen über den Adapter (lib/aas) und werden hier nur in DataFields übersetzt, ohne Ergänzungen.
 */
import type { DataField, Section } from '../types/content';
import { catalog, indexEnvironment, toViewModel, type ViewValue } from '../lib/aas/adapter';
import { sessionEnvironment, type SessionEntry, type SessionState } from '../lib/aas/session';
import { createContent, fld } from './builder';

export interface AasRegistry {
  fields: Map<string, DataField>;
  sections: Map<string, Section>;
}

/** Je IDTA-02035-Teilmodell eine Sektion; Reihenfolge wie im Katalog. */
export const aasDomainSectionIds = catalog.map((d) => `aas.domain.${d.idta}`);

const NUM = new Intl.NumberFormat('de-DE');
const show = (v: ViewValue['value'] | undefined): string | number | undefined =>
  v === null || v === undefined ? undefined : typeof v === 'number' ? NUM.format(v) : String(v);

const UNVERIFIED = 'Provenienz nicht verifiziert (verified = false); keine Compliance-Aussage.';

const originText = (e: SessionEntry | { origin: SessionEntry['origin']; fileName: string }) =>
  e.origin === 'import' ? `Geladen aus „${e.fileName}“ (lokaler Import, ungeprüft).` : 'Beispielinstanz aus dem Übergabepaket (erfundene Demowerte).';

function build(state: SessionState): AasRegistry {
  const env = sessionEnvironment(state);
  const index = indexEnvironment(env);
  const vm = toViewModel(env);
  const byDomain = new Map(state.entries.map((e) => [e.domain, e]));
  const isImported = (idta: string) => byDomain.get(idta)?.origin === 'import';
  const notLoaded = (idta: string) => `Teilmodell IDTA ${idta} ist nicht geladen.`;

  /** Feld aus einem ViewModel-Wert; Herkunft (Datei, Teilmodell, Pfad, Erkennung) landet in Quelle und Beschreibung. */
  function aasField(
    key: string,
    label: string,
    idta: string,
    /** null: es gibt keinen offiziellen Pfad für dieses Feld. */
    expectedPath: string | null,
    v: ViewValue | null,
    o: { unit?: string; note?: string } = {},
  ) {
    const entry = byDomain.get(idta);
    const where = v
      ? `Pfad ${v.provenance.path} im Teilmodell ${v.provenance.submodelId ?? 'ohne ID'}, erkannt über ${v.provenance.match}.`
      : !expectedPath
        ? 'Kein offizielles Mapping vorhanden.'
        : entry
          ? `Im Teilmodell nicht befüllt (erwarteter Pfad: ${expectedPath}).`
          : notLoaded(idta);
    return fld(key, label, show(v?.value), {
      unit: v ? o.unit : undefined,
      src: `AAS · IDTA ${idta}`,
      imported: isImported(idta),
      desc: [entry && v ? originText(entry) : undefined, where, o.note, v ? UNVERIFIED : undefined].filter(Boolean).join(' '),
    });
  }

  /** Listen ohne Mapping im ViewModel: nur die Anzahl befüllter Elemente wird gezeigt, keine Inhalte abgeleitet. */
  function listField(key: string, label: string, idta: string, listPath: string) {
    const entry = byDomain.get(idta);
    const count = (index.sections[idta]?.fields ?? []).filter((f) => f.path.startsWith(listPath)).length;
    return fld(key, label, count > 0 ? `${count} Elemente` : undefined, {
      src: `AAS · IDTA ${idta}`,
      imported: isImported(idta),
      desc: !entry
        ? notLoaded(idta)
        : count > 0
          ? `${originText(entry)} ${count} Elemente unter ${listPath}. Inhalte sind noch nicht maschinenprüfbar gemappt und werden daher nicht als Werte dargestellt.`
          : `Die Liste ${listPath} ist im geladenen Teilmodell leer oder fehlt. Es werden keine Werte geschätzt.`,
    });
  }

  const pcf = vm.carbon.pcf;
  const pcfUnit = pcf ? (pcf.referenceUnit === 'piece' ? 'kg CO₂e je Stück' : `kg CO₂e je ${pcf.referenceUnit ?? 'unbekannter Bezugsgröße'}`) : undefined;
  const pcfEntry = byDomain.get('02035-3');
  const anyImport = state.entries.some((e) => e.origin === 'import') || state.shell?.origin === 'import';
  const presentDomains = vm.idtaDomains.filter((d) => d.present).length;

  const c = createContent();

  c.add('aas.instance', {
    title: 'Batterie-Instanz',
    summary:
      'Identität und statische Eigenschaften aus den Teilmodellen Digital Nameplate (02035-1), Technical Data (02035-4) und Material Composition (02035-6), soweit geladen.',
    icon: 'battery',
    fields: [
      fld('aas.instance.id', 'AAS-Instanz (globalAssetId)', vm.instanceId ?? undefined, {
        src: 'AAS-Shell',
        imported: state.shell?.origin === 'import',
        desc: [
          state.shell ? originText(state.shell) : 'Keine AAS-Shell geladen; einzelne Teilmodelle tragen keine Instanz-ID.',
          'AAS-ID, globalAssetId, Seriennummer und Passport-ID sind verschiedene Informationsfelder und nicht gleichzusetzen.',
        ].join(' '),
      }),
      aasField('aas.nameplate.manufacturer', 'Hersteller', '02035-1', 'ManufacturerName', vm.nameplate.manufacturer),
      aasField('aas.nameplate.serialNumber', 'Seriennummer', '02035-1', 'SerialNumber', vm.nameplate.serialNumber),
      aasField('aas.nameplate.manufactured', 'Herstellungsdatum', '02035-1', 'DateOfManufacture', vm.nameplate.manufactured),
      aasField('aas.nameplate.lifecycleStage', 'Lebenszyklusstatus', '02035-1', 'LifeCycleStage', vm.nameplate.lifecycleStage),
      aasField('aas.material.chemistry', 'Zellchemie', '02035-6', 'BatteryChemistry.ShortName', vm.material.chemistry),
      aasField('aas.technical.nominalVoltage', 'Nennspannung', '02035-4', 'TechnicalPropertyAreas.CapacityEnergyVoltage.NominalVoltage', vm.technical.nominalVoltage, {
        unit: 'V',
        note: 'Einheit vom Adapter festgelegt, nicht aus der Instanz gelesen.',
      }),
      aasField('aas.technical.ratedCapacity', 'Bemessungskapazität', '02035-4', 'TechnicalPropertyAreas.CapacityEnergyVoltage.RatedCapacity', vm.technical.ratedCapacity, {
        unit: 'Ah',
        note: 'Kapazität (Ah), nicht mit Energie (kWh) gleichsetzen. Einheit vom Adapter festgelegt.',
      }),
      aasField(
        'aas.technical.certifiedUsableEnergy',
        'Zertifizierte nutzbare Energie',
        '02035-4',
        'TechnicalPropertyAreas.CapacityEnergyVoltage.CertifiedUsableBatteryEnergy',
        vm.technical.certifiedUsableEnergy,
        {
          unit: 'kWh',
          note: 'Zertifizierte nutzbare Energie, nicht automatisch Nenn- oder Bemessungsenergie. Einheit vom Adapter angenommen und noch zu prüfen.',
        },
      ),
    ],
  });

  c.add('aas.condition', {
    title: 'Zustand & Nutzung',
    summary:
      'Instanzbezogene Zustandswerte aus Product Condition (02035-5). Jeder Wert gehört zu seinem eigenen LastUpdate; es ist eine Momentaufnahme der geladenen Datei, keine Live-Messung.',
    icon: 'pulse',
    fields: [
      aasField('aas.condition.stateOfCharge', 'Ladezustand (SoC)', '02035-5', 'StateOfCharge.StateOfChargeValue', vm.condition.stateOfCharge, { unit: '%' }),
      aasField('aas.condition.stateOfChargeUpdated', 'SoC zuletzt aktualisiert', '02035-5', 'StateOfCharge.LastUpdate', vm.condition.stateOfChargeUpdated, {
        note: 'Zeitstempel aus derselben StateOfCharge-Collection, unverändert übernommen (keine Zeitzonenumrechnung).',
      }),
      aasField('aas.condition.cycles', 'Vollzyklen', '02035-5', 'NumberOfFullCycles.NumberOfFullCyclesValue', vm.condition.cycles, { unit: 'Zyklen' }),
      aasField('aas.condition.stateOfHealth', 'Gesundheitszustand (SoH)', '02035-5', null, vm.condition.stateOfHealthDemoOnly, {
        unit: '%',
        note:
          'Für SoH ist kein Feld in der offiziellen 02035-5-Struktur bestätigt. Ein Wert erscheint nur über den nicht offiziellen Demo-Alias StateOfHealthPercent; SoH wird nicht aus SoC oder StateOfCertifiedEnergy abgeleitet.',
      }),
    ],
  });

  c.add('aas.carbon', {
    title: 'CO₂-Fußabdruck',
    subtitle: 'Product Carbon Footprint (02035-3)',
    summary:
      'PCF mit seiner Bezugsgröße (ReferenceImpactUnitForCalculation). Werte werden nicht zwischen kg CO₂e je Stück, je kWh oder Tonnen umgerechnet und nicht aufsummiert, wenn die Bezugsgröße nicht eindeutig ist.',
    icon: 'leaf',
    fields: [
      fld('aas.carbon.pcf', 'Product Carbon Footprint', pcf?.value == null ? undefined : NUM.format(pcf.value), {
        unit: pcfUnit,
        src: 'AAS · IDTA 02035-3',
        imported: isImported('02035-3'),
        desc:
          pcf && pcfEntry
            ? `${originText(pcfEntry)} Pfad ${pcf.provenance?.path ?? '–'}, Bezugsgröße „${pcf.referenceUnit ?? 'nicht angegeben'}“. ${
                pcf.validForSummarization ? 'Bezugsgröße je Stück.' : 'Bezugsgröße nicht je Stück: nicht als Gesamtwert je Batterie lesen.'
              } Methode, Systemgrenze und Lebenszyklusphasen sind nicht belegt. ${UNVERIFIED}`
            : pcfEntry
              ? 'Im Teilmodell nicht befüllt (erwarteter Pfad: ProductCarbonFootprints[].ProductCarbonFootprint.PcfCO2eq).'
              : notLoaded('02035-3'),
      }),
      listField('aas.carbon.phases', 'Aufteilung nach Lebenszyklusphasen', '02035-3', 'ProductCarbonFootprints.ProductCarbonFootprint.LifeCyclePhases'),
    ],
  });

  c.add('aas.material', {
    title: 'Material & Kreislauf',
    summary:
      'Materialzusammensetzung (02035-6), Kreislaufwirtschaft (02035-7) und Übergabedokumente (02035-2). Diagramme entstehen erst nach einem maschinenprüfbaren Mapping mit bestätigten Einheiten.',
    icon: 'recycle',
    fields: [
      listField('aas.material.batteryMaterials', 'Batteriematerialien', '02035-6', 'BatteryMaterials'),
      listField('aas.material.hazardousSubstances', 'Gefährliche Stoffe', '02035-6', 'HazardousSubstances'),
      listField('aas.circularity.recycledContent', 'Rezyklatanteil', '02035-7', 'RecycledContentInformation'),
      listField('aas.circularity.dismantling', 'Demontage- und Ausbauinformationen', '02035-7', 'DismantlingAndRemovalInformation'),
      listField('aas.documents', 'Übergabedokumente', '02035-2', 'Documents'),
    ],
  });

  c.add('aas.coverage', {
    title: 'Teilmodellabdeckung',
    summary:
      'Anzahl der geladenen und erkannten IDTA-02035-Teilmodelle. Das Vorhandensein eines Teilmodells sagt nichts über Vollständigkeit oder Rechtskonformität aus.',
    icon: 'database',
    fields: [
      fld('aas.kpi.submodels', 'AAS-Teilmodelle geladen', `${presentDomains} / ${vm.idtaDomains.length}`, {
        src: 'AAS-Adapter',
        imported: anyImport,
        desc: 'Erkennung über die verifizierten Top-Level-semanticIds des IDTA-Katalogs; ein idShort-Fallback wird je Teilmodell ausgewiesen.',
      }),
    ],
  });

  catalog.forEach((d, i) => {
    const id = aasDomainSectionIds[i];
    const section = index.sections[d.idta];
    const entry = byDomain.get(d.idta);
    const imported = entry?.origin === 'import';
    c.add(id, {
      title: d.name,
      subtitle: `IDTA ${d.idta}`,
      summary: `Top-Level idShort „${d.idShort}“, Template-Version ${d.templateVersion}. Quelle der Erkennung: ${d.source}`,
      fields: [
        fld(`${id}.status`, 'Verfügbarkeit', section ? 'vorhanden' : undefined, {
          src: 'AAS-Adapter',
          imported,
          desc: entry
            ? `${originText(entry)} Vorhanden heißt nur: Teilmodell geladen und erkannt. Kein Nachweis über Vollständigkeit oder Compliance.`
            : notLoaded(d.idta),
        }),
        fld(`${id}.recognition`, 'Erkannt über', section?.match, {
          src: 'AAS-Adapter',
          imported,
          desc: 'semanticId = verifizierte Top-Level-Semantik; idShort-fallback = nur Namensabgleich, keine semantische Validierung.',
        }),
        fld(`${id}.elements`, 'Befüllte Elemente', section ? section.fields.length : undefined, {
          src: 'AAS-Adapter',
          imported,
          desc: 'Anzahl befüllter Blattelemente (Property, MultiLanguageProperty u. a.) nach rekursiver Traversierung.',
        }),
        fld(`${id}.semanticId`, 'semanticId (Top-Level)', d.semanticIds[0], { src: 'IDTA-Katalog' }),
      ],
    });
  });

  return { fields: new Map(c.fields.map((f) => [f.key, f])), sections: new Map(c.sections.map((s) => [s.id, s])) };
}

const cache = new WeakMap<SessionState, AasRegistry>();

/** Felder/Sektionen zum aktuellen Sitzungsstand; je Stand nur einmal berechnet. */
export function datastructureRegistry(state: SessionState): AasRegistry {
  let r = cache.get(state);
  if (!r) {
    r = build(state);
    cache.set(state, r);
  }
  return r;
}
