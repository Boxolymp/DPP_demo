import { useDrawer } from '../../app/providers/DrawerProvider';
import { BarChart } from '../../components/charts/BarChart';
import { ArrowChain, ChainNode } from '../../components/ui/Chain';
import { Badge, DataValue, FieldBadge } from '../../components/ui/DataValue';
import { FieldMetric, PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { FieldList, Tile } from '../../components/ui/Tile';
import {
  supplierChainIds,
  supplierComplianceIds,
  supplierEvidenceIds,
  supplierShipmentIds,
} from '../../content/supplier';
import { useField, useSection } from '../../hooks/useContent';

function ComplianceCard({ id }: { id: string }) {
  const s = useSection(id);
  const cov = useField(`${id}.coverage`);
  const pct = typeof cov.value === 'number' ? cov.value : 0;
  return (
    <SectionCard id={id} className="compliance">
      <div className="compliance__head">
        <strong>{s.title}</strong>
        <FieldBadge fieldKey={`${id}.status`} />
      </div>
      <p className="muted small">{s.subtitle}</p>
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
            <ArrowChain ids={supplierChainIds} className="chain chain--linear">
              {(id) => <ChainNode id={id} />}
            </ArrowChain>
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
          <Tile id="supplier.shipment.info" fieldKey="supplier.shipment.id" />
        </div>

        <SectionCard id="supplier.impact" stretch={false}>
          <SectionTitle sub="t CO₂e">Impact meines Beitrags</SectionTitle>
          <BarChart
            max={30}
            bars={[
              { fieldKey: 'supplier.impact.material', label: 'Material' },
              { fieldKey: 'supplier.impact.production', label: 'Fertigung' },
              { fieldKey: 'supplier.impact.transport', label: 'Transport' },
            ]}
          />
          <FieldMetric fieldKey="supplier.impact.delta" className="metric--accent" />
        </SectionCard>
      </div>
    </div>
  );
}
