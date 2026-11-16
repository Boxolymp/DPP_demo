import { DataValue } from '../../components/ui/DataValue';
import { FieldMetric, SectionCard } from '../../components/ui/SectionCard';
import { FieldList, Tile } from '../../components/ui/Tile';
import { aasDomainSectionIds } from '../../content/datastructure';
import { useSection } from '../../hooks/useContent';
import { AasImportPanel } from './AasImportPanel';

function CardTitle({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <div className="card__head">
      <h2>{s.title}</h2>
    </div>
  );
}

/** Data Factory → Datastructure: Overview der im Tab geladenen AAS-Teilmodelle (IDTA 02035), nach dem Übergabepaket. */
export function DatastructureOverview() {
  return (
    <>
      <p className="ds-notice" role="note">
        <strong>Lokale AAS-Daten:</strong> Angezeigt wird nur, was in diesem Tab geladen wurde: eigene Dateien
        („Importiert · ungeprüft“) oder die Beispielinstanz mit erfundenen Demowerten („Illustrativ“). Das ist nicht das
        Produkt M3, keine Validierung gegen die IDTA-Templates und keine Compliance-Aussage.{' '}
        <span className="ds-notice__id">
          Instanz: <DataValue fieldKey="aas.instance.id" />
        </span>
      </p>

      <AasImportPanel />

      <div className="metrics metrics--4">
        <FieldMetric fieldKey="aas.technical.certifiedUsableEnergy" icon="bolt" />
        <FieldMetric fieldKey="aas.condition.stateOfHealth" icon="pulse" />
        <FieldMetric fieldKey="aas.carbon.pcf" icon="leaf" />
        <FieldMetric fieldKey="aas.kpi.submodels" icon="database" />
      </div>

      <div className="ds-grid">
        <SectionCard id="aas.instance" stretch={false}>
          <CardTitle id="aas.instance" />
          <FieldList
            keys={[
              'aas.nameplate.manufacturer',
              'aas.nameplate.serialNumber',
              'aas.nameplate.manufactured',
              'aas.nameplate.lifecycleStage',
              'aas.material.chemistry',
              'aas.technical.nominalVoltage',
              'aas.technical.ratedCapacity',
            ]}
          />
        </SectionCard>
        <SectionCard id="aas.condition" stretch={false}>
          <CardTitle id="aas.condition" />
          <FieldList
            keys={['aas.condition.stateOfCharge', 'aas.condition.stateOfChargeUpdated', 'aas.condition.cycles', 'aas.condition.stateOfHealth']}
          />
        </SectionCard>
        <SectionCard id="aas.carbon" stretch={false}>
          <CardTitle id="aas.carbon" />
          <FieldList keys={['aas.carbon.pcf', 'aas.carbon.phases']} />
        </SectionCard>
        <SectionCard id="aas.material" stretch={false}>
          <CardTitle id="aas.material" />
          <FieldList
            keys={[
              'aas.material.batteryMaterials',
              'aas.material.hazardousSubstances',
              'aas.circularity.recycledContent',
              'aas.circularity.dismantling',
              'aas.documents',
            ]}
          />
        </SectionCard>
      </div>

      <section className="ds-coverage" aria-labelledby="ds-coverage-title">
        <div className="section-title">
          <h2 id="ds-coverage-title">Teilmodellabdeckung</h2>
          <p>Die sieben IDTA-02035-Teilmodelle der Batterie als eigenständige AAS-Submodelle.</p>
        </div>
        <div className="grid-tiles grid-tiles--4">
          {aasDomainSectionIds.map((id) => (
            <Tile key={id} id={id} icon="doc" fieldKey={`${id}.status`} />
          ))}
        </div>
      </section>

      <p className="small muted">
        Grenzen: kein IDTA- oder AAS-Konformitätsvalidator, keine pauschale Rechtsprüfung, Provenienz unverifiziert,
        SoH nicht aus Product Condition gemappt. Keine Live-Anbindung an ein AAS-Repository; geladene Dateien bleiben im Browser-Tab.
      </p>
    </>
  );
}
