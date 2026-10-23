import { useDrawer } from '../../app/providers/DrawerProvider';
import { BarChart } from '../../components/charts/BarChart';
import { Badge, DataValue, FieldBadge } from '../../components/ui/DataValue';
import { Icon, type IconName } from '../../components/ui/Icon';
import { FieldMetric, PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { FieldList, Tile } from '../../components/ui/Tile';
import {
  supplierChainIds,
  supplierComplianceIds,
  supplierEvidenceIds,
  supplierShipmentIds,
} from '../../content/supplier';
import { useField, useSection } from '../../hooks/useContent';

const CHAIN_ICONS: IconName[] = ['box', 'factory', 'shield', 'truck', 'box'];

function ChainNode({ id, icon }: { id: string; icon: IconName }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="chain__node">
      <span className="chain__icon"><Icon name={icon} size={22} /></span>
      <span className="chain__label">{s.title}</span>
    </SectionCard>
  );
}

function ComplianceCard({ id }: { id: string }) {
  const s = useSection(id);
  const cov = useField(`${id}.coverage`);
  const pct = typeof cov.value === 'number' ? cov.value : 0;
  return (
    <SectionCard id={id} className="compliance">
      <div className="compliance__head">
        <strong>{s.title.split(':')[0]}</strong>
        <FieldBadge fieldKey={`${id}.status`} />
      </div>
      <p className="muted small">{s.title.split(':')[1]?.trim()}</p>
      <div className="progress" aria-hidden="true">
        <span className={`progress__fill progress__fill--${cov.tone ?? 'neutral'}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="small"><DataValue fieldKey={`${id}.coverage`} /></p>
    </SectionCard>
  );
}

function EvidenceRow({ id }: { id: string }) {
  const { openSection } = useDrawer();
  return (
    <tr>
      <td>
        <button type="button" className="link-btn" onClick={() => openSection(id)}>
          <DataValue fieldKey={`${id}.doc`} />
        </button>
      </td>
      <td><DataValue fieldKey={`${id}.type`} /></td>
      <td><FieldBadge fieldKey={`${id}.status`} /></td>
      <td><DataValue fieldKey={`${id}.date`} /></td>
    </tr>
  );
}

function ShipmentStep({ id }: { id: string }) {
  const s = useSection(id);
  const status = useField(`${id}.status`);
  return (
    <SectionCard id={id} className="step">
      <span className={`step__dot step__dot--${status.tone ?? 'neutral'}`} />
      <div>
        <strong>{s.title}</strong>
        <p className="muted small"><DataValue fieldKey={`${id}.detail`} /></p>
        <FieldBadge fieldKey={`${id}.status`} />
      </div>
    </SectionCard>
  );
}

export function SupplierPage() {
  return (
    <div className="page">
      <PageHero
        title="Zulieferer"
        strong="Mein Beitrag zum Batterie-DPP"
        subtitle="Bereitstellung von Fertigungs-, Transport- und Konformitätsdaten für eine transparente und nachhaltige Batteriewertschöpfung."
      />

      <div className="card">
        <SectionTitle>Mein Verantwortungsbereich in der Wertschöpfungskette</SectionTitle>
        <div className="supplier-chain">
          <div className="neighbor" aria-hidden="true">Rohstofflieferanten</div>
          <div className="responsibility">
            <Badge tone="ok">Mein Verantwortungsbereich (Zulieferer)</Badge>
            <div className="chain chain--linear">
              {supplierChainIds.map((id, i) => (
                <div className="chain__step" key={id}>
                  <ChainNode id={id} icon={CHAIN_ICONS[i]} />
                  {i < supplierChainIds.length - 1 ? <span className="chain__arrow"><Icon name="arrow" size={18} /></span> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="neighbor" aria-hidden="true">OEM Integration</div>
        </div>
      </div>

      <div className="grid-supplier-mid">
        <SectionCard id="supplier.contribution" stretch={false}>
          <div className="card__head">
            <SectionTitle sub="Aktives Kathodenmaterial für Lithium-Ionen-Batterien">Mein Produktbeitrag</SectionTitle>
            <Badge tone="ok">Aktiver Beitrag</Badge>
          </div>
          <FieldList
            keys={[
              'supplier.material.name',
              'supplier.material.type',
              'supplier.material.form',
              'supplier.material.cas',
              'supplier.material.internalId',
              'supplier.material.dppRef',
            ]}
          />
        </SectionCard>

        <div className="card">
          <SectionTitle sub="CCF und PCF sind verschiedene Bilanzen und werden nicht addiert.">Compliance & Nachhaltigkeit</SectionTitle>
          <div className="grid-tiles grid-tiles--3">
            {supplierComplianceIds.map((id) => (
              <ComplianceCard key={id} id={id} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid-supplier-bottom">
        <div className="card">
          <SectionTitle>Nachweise & Freigaben</SectionTitle>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Dokument</th><th>Typ</th><th>Status</th><th>Datum</th></tr>
              </thead>
              <tbody>
                {supplierEvidenceIds.map((id) => (
                  <EvidenceRow key={id} id={id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <SectionTitle>Transport & Logistik</SectionTitle>
          <div className="steps">
            {supplierShipmentIds.map((id) => (
              <ShipmentStep key={id} id={id} />
            ))}
          </div>
          <Tile id="supplier.shipment.info" icon="truck" fieldKey="supplier.shipment.id" />
        </div>

        <SectionCard id="supplier.impact" stretch={false}>
          <SectionTitle sub="t CO₂e">Impact meines Beitrags</SectionTitle>
          <BarChart
            fieldKeys={['supplier.impact.material', 'supplier.impact.production', 'supplier.impact.transport']}
            labels={['Material', 'Fertigung', 'Transport']}
            max={30}
          />
          <FieldMetric fieldKey="supplier.impact.delta" className="metric--accent" />
        </SectionCard>
      </div>
    </div>
  );
}
