import { useDrawer } from '../../app/providers/DrawerProvider';
import { BarChart } from '../../components/charts/BarChart';
import { ArrowChain } from '../../components/ui/Chain';
import { Badge, DataValue, FieldBadge } from '../../components/ui/DataValue';
import { Icon, type IconName } from '../../components/ui/Icon';
import { PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { FieldList } from '../../components/ui/Tile';
import {
  supplierChainIds,
  supplierComplianceIds,
  supplierEvidenceIds,
  supplierShipmentIds,
} from '../../content/supplier';
import { useField, useSection } from '../../hooks/useContent';
import type { Tone } from '../../types/content';

/** Bildebenen liegen unter public/images/supplier/<letztes Segment der Sektions-ID>.webp. */
const imageOf = (id: string) => `/images/supplier/${id.split('.').pop()}.webp`;

function HeroVisual() {
  return (
    <div className="supplier-hero">
      <img src="/images/supplier/hero.webp" alt="" width="592" height="112" />
      <p>Gemeinsam für eine nachhaltige Batteriezukunft.</p>
    </div>
  );
}

function ChainPhotoNode({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="photo-node">
      <img className="photo-node__img" src={imageOf(id)} alt="" loading="lazy" />
      <span className="photo-node__label">{s.title}</span>
    </SectionCard>
  );
}

function Neighbor({ label, image }: { label: string; image: string }) {
  return (
    <div className="neighbor" aria-hidden="true">
      <span>{label}</span>
      <img src={`/images/supplier/${image}.webp`} alt="" loading="lazy" />
    </div>
  );
}

function ComplianceCard({ id }: { id: string }) {
  const s = useSection(id);
  const cov = useField(`${id}.coverage`);
  const pct = typeof cov.value === 'number' ? cov.value : 0;
  return (
    <SectionCard id={id} className="compliance">
      <div className="compliance__head">
        <span className={`compliance__icon compliance__icon--${id.split('.').pop()}`}>
          <Icon name={s.icon ?? 'doc'} size={18} />
        </span>
        <span className="compliance__title">
          <strong>{s.title}</strong>
          <span>{s.subtitle}</span>
        </span>
        <FieldBadge fieldKey={`${id}.status`} />
      </div>
      <div className="compliance__bar">
        <span className="progress" aria-hidden="true">
          <span className={`progress__fill progress__fill--${cov.tone ?? 'neutral'}`} style={{ width: `${pct}%` }} />
        </span>
        <strong className="small"><DataValue fieldKey={`${id}.coverage`} /></strong>
      </div>
      <p className="compliance__updated">
        Letztes Update: <DataValue fieldKey={`${id}.updated`} />
      </p>
    </SectionCard>
  );
}

function EvidenceRow({ id }: { id: string }) {
  const s = useSection(id);
  const { openSection } = useDrawer();
  return (
    <tr>
      <td>
        <span className="evidence__doc">
          <Icon name="doc" size={16} />
          <DataValue fieldKey={`${id}.doc`} />
        </span>
      </td>
      <td className="muted"><DataValue fieldKey={`${id}.type`} /></td>
      <td><FieldBadge fieldKey={`${id}.status`} withIcon /></td>
      <td><DataValue fieldKey={`${id}.date`} /></td>
      <td>
        <button type="button" className="icon-btn" onClick={() => openSection(id)} aria-label={`Details zu ${s.title}`} title="Details">
          <Icon name="eye" size={18} />
        </button>
      </td>
    </tr>
  );
}

const STEP_ICON: Record<Tone, IconName | null> = { ok: 'check', warn: 'truck', open: 'close', neutral: null };

function ShipmentStep({ id }: { id: string }) {
  const s = useSection(id);
  const tone = useField(`${id}.status`).tone ?? 'neutral';
  const icon = STEP_ICON[tone];
  return (
    <li>
      <SectionCard id={id} className="timeline__item">
        <span className={`timeline__dot timeline__dot--${tone}`}>{icon ? <Icon name={icon} size={14} /> : null}</span>
        <span className="timeline__body">
          <strong>{s.title}</strong>
          <span className="muted small"><DataValue fieldKey={`${id}.location`} /></span>
        </span>
        <span className="timeline__meta">
          <span className="muted small"><DataValue fieldKey={`${id}.time`} /></span>
          <FieldBadge fieldKey={`${id}.status`} />
        </span>
      </SectionCard>
    </li>
  );
}

function ImpactDelta({ fieldKey }: { fieldKey: string }) {
  const f = useField(fieldKey);
  const { openField } = useDrawer();
  return (
    <button type="button" className="impact-delta" onClick={() => openField(fieldKey)}>
      <Icon name="leaf" size={26} />
      <span className="impact-delta__body">
        <span className="impact-delta__value"><DataValue fieldKey={fieldKey} /></span>
        <span className="small">CO₂e · {f.label}</span>
      </span>
      <Icon name="chevron" size={18} />
    </button>
  );
}

export function SupplierPage() {
  const { openSection } = useDrawer();
  return (
    <div className="page">
      <PageHero
        title="Zulieferer"
        strong="Mein Beitrag zum Batterie-DPP"
        subtitle="Bereitstellung von Fertigungs-, Transport- und Konformitätsdaten für eine transparente und nachhaltige Batteriewertschöpfung."
        visual={<HeroVisual />}
      />

      <div className="card">
        <SectionTitle>Mein Verantwortungsbereich in der Wertschöpfungskette</SectionTitle>
        <div className="supplier-chain">
          <Neighbor label="Rohstofflieferanten" image="raw" />
          <span className="supplier-chain__arrow" aria-hidden="true"><Icon name="arrow" size={18} /></span>
          <div className="responsibility">
            <Badge tone="ok" icon="check">Mein Verantwortungsbereich (Zulieferer)</Badge>
            <ArrowChain ids={supplierChainIds} className="photo-chain">
              {(id) => <ChainPhotoNode id={id} />}
            </ArrowChain>
          </div>
          <span className="supplier-chain__arrow" aria-hidden="true"><Icon name="arrow" size={18} /></span>
          <Neighbor label="OEM Integration" image="oem" />
        </div>
      </div>

      <div className="grid-supplier-mid">
        <SectionCard id="supplier.contribution" stretch={false} className="contribution">
          <div className="card__head">
            <SectionTitle>Mein Produktbeitrag</SectionTitle>
            <Badge tone="ok" icon="leaf">Aktiver Beitrag</Badge>
          </div>
          <div className="contribution__title">
            <strong><DataValue fieldKey="supplier.material.name" /></strong>
            <span className="muted"><DataValue fieldKey="supplier.material.description" /></span>
          </div>
          <div className="contribution__body">
            <img className="contribution__img" src={imageOf('material')} alt="" loading="lazy" width="280" height="165" />
            <FieldList
              keys={[
                'supplier.material.type',
                'supplier.material.form',
                'supplier.material.cas',
                'supplier.material.internalId',
                'supplier.material.dppRef',
              ]}
              icons={{
                'supplier.material.type': 'gear',
                'supplier.material.form': 'pen',
                'supplier.material.cas': 'atom',
                'supplier.material.internalId': 'doc',
                'supplier.material.dppRef': 'link',
              }}
            />
          </div>
        </SectionCard>

        <div className="card">
          <div className="card__head">
            <SectionTitle>Compliance & Nachhaltigkeit</SectionTitle>
            <button type="button" className="link-btn card__link" onClick={() => openSection('supplier.compliance')}>
              Details anzeigen <Icon name="arrow" size={14} />
            </button>
          </div>
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
                <tr><th>Dokument</th><th>Typ</th><th>Status</th><th>Datum</th><th><span className="sr-only">Aktionen</span></th></tr>
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
          <div className="shipment">
            <ol className="timeline">
              {supplierShipmentIds.map((id) => (
                <ShipmentStep key={id} id={id} />
              ))}
            </ol>
            <SectionCard id="supplier.shipment.info" stretch={false} className="shipment__info">
              <img className="shipment__img" src={imageOf('shipment')} alt="" loading="lazy" width="260" height="68" />
              <FieldList
                keys={['supplier.shipment.id', 'supplier.shipment.mass', 'supplier.shipment.mode', 'supplier.shipment.emissions']}
                icons={{
                  'supplier.shipment.id': 'link',
                  'supplier.shipment.mass': 'box',
                  'supplier.shipment.mode': 'truck',
                  'supplier.shipment.emissions': 'leaf',
                }}
              />
            </SectionCard>
          </div>
        </div>

        <SectionCard id="supplier.impact" stretch={false} className="impact">
          <SectionTitle sub="t CO₂e">Impact meines Beitrags</SectionTitle>
          <BarChart
            max={30}
            bars={[
              { fieldKey: 'supplier.impact.material', label: 'Material' },
              { fieldKey: 'supplier.impact.production', label: 'Fertigung' },
              { fieldKey: 'supplier.impact.transport', label: 'Transport' },
            ]}
          />
          <ImpactDelta fieldKey="supplier.impact.delta" />
        </SectionCard>
      </div>
    </div>
  );
}
