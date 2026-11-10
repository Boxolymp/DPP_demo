import { useDrawer } from '../../app/providers/DrawerProvider';
import { BarChart } from '../../components/charts/BarChart';
import { ArrowChain } from '../../components/ui/Chain';
import { Badge, DataValue, FieldBadge } from '../../components/ui/DataValue';
import { Icon, type IconName } from '../../components/ui/Icon';
import { FieldMetric, PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { Tile } from '../../components/ui/Tile';
import { oemChainIds, oemDppIds, oemEngIds } from '../../content/oem';
import { useField, useFields, useSection } from '../../hooks/useContent';

/** Bildebenen liegen unter public/images/oem/<prefix>-<letztes Segment der Sektions-ID>.webp. */
const imageOf = (prefix: string, id: string) => `/images/oem/${prefix}-${id.split('.').pop()}.webp`;

const LIFECYCLE: { fieldKey: string; label: string; icon: IconName; accent?: boolean }[] = [
  { fieldKey: 'oem.lifecycle.raw', label: 'Rohstoffe', icon: 'box' },
  { fieldKey: 'oem.lifecycle.cells', label: 'Zellen', icon: 'battery' },
  { fieldKey: 'oem.lifecycle.modules', label: 'Module/Packs', icon: 'gear' },
  { fieldKey: 'oem.lifecycle.use', label: 'Nutzung', icon: 'car', accent: true },
  { fieldKey: 'oem.lifecycle.eol', label: 'End-of-Life', icon: 'recycle', accent: true },
];
/** Farben der Ringsegmente in Reihenfolge von LIFECYCLE: Herstellung blau, Nutzung und End-of-Life grün. */
const DONUT_COLORS = ['#2f5fd0', '#5f86e0', '#9db6ec', '#6fcf9c', '#2fae6e'];

function HeroVisual() {
  return (
    <div className="oem-hero">
      <p>
        Heute entwickeln.
        <br />
        Morgen weiter denken.
      </p>
      <img src="/images/oem/hero.webp" alt="" width="347" height="114" />
    </div>
  );
}

function ChainPhoto({ id, wide = false }: { id: string; wide?: boolean }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className={`chain-photo ${wide ? 'chain-photo--wide' : ''}`}>
      <img className="chain-photo__img" src={imageOf('chain', id)} alt="" loading="lazy" />
      <span className="chain-photo__label">{s.title}</span>
    </SectionCard>
  );
}

/** Vorher/Nachher-Balken aus einer relativen Änderung in Prozent; ohne Zahlenwert entfällt die Grafik. */
function ChangeBars({ fieldKey }: { fieldKey: string }) {
  const change = Number(useField(fieldKey).value);
  if (!Number.isFinite(change)) return null;
  const after = 100 + change;
  const scale = 100 / Math.max(100, after);
  return (
    <span className="change-bars" aria-hidden="true">
      <span className="change-bars__bar" style={{ height: `${100 * scale}%` }} />
      <span className="change-bars__bar change-bars__bar--after" style={{ height: `${after * scale}%` }} />
      <span className="change-bars__caption">vorher</span>
      <span className="change-bars__caption">nachher</span>
    </span>
  );
}

/** Ring aus den Phasenbeiträgen; die Mitte zeigt das Gesamtfeld und öffnet es. */
function LifecycleDonut() {
  const { openField } = useDrawer();
  const phases = useFields(LIFECYCLE.map((p) => p.fieldKey));
  const values = phases.map((f) => (typeof f.value === 'number' ? f.value : 0));
  const sum = values.reduce((a, b) => a + b, 0);
  const total = useField('oem.lifecycle.total');
  const r = 42;
  const len = 2 * Math.PI * r;
  let offset = 0;
  return (
    <button type="button" className="lc-ring" onClick={() => openField(total.key)}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={r} className="lc-ring__track" />
        {sum > 0
          ? values.map((v, i) => {
              const seg = (v / sum) * len;
              const el = (
                <circle
                  key={LIFECYCLE[i].fieldKey}
                  cx="50"
                  cy="50"
                  r={r}
                  stroke={DONUT_COLORS[i]}
                  strokeDasharray={`${Math.max(0, seg - 1)} ${len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += seg;
              return el;
            })
          : null}
      </svg>
      <span className="lc-ring__center">
        <span className="lc-ring__label">{total.label}</span>
        <span className="lc-ring__value">
          <DataValue fieldKey={total.key} withUnit={false} />
        </span>
        <span className="lc-ring__unit">{total.unit}</span>
      </span>
    </button>
  );
}

function DppCard({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="dpp-card">
      <img className="dpp-card__img" src={imageOf('dpp', id)} alt="" loading="lazy" />
      <span className="dpp-card__head">
        <span className="dpp-card__icon">
          <Icon name={s.icon ?? 'box'} size={18} />
        </span>
        <span className="dpp-card__title">{s.title}</span>
      </span>
      <span className="dpp-card__foot">
        <span className="dpp-card__text">
          <DataValue fieldKey={`${id}.data`} />
        </span>
        <Icon name="chevron" size={16} />
      </span>
    </SectionCard>
  );
}

export function OemPage() {
  const { openSection } = useDrawer();
  const product = useField('oem.product.name');
  const linear = oemChainIds.slice(0, 6);
  const [secondLife, recycling] = oemChainIds.slice(6);
  return (
    <div className="page">
      <PageHero
        title="OEM"
        strong="Batterie und ihre Wertschöpfung"
        subtitle="Transparente Daten. Bessere Entscheidungen. Für eine nachhaltige und zirkuläre Batteriezukunft."
        visual={<HeroVisual />}
      />

      <div className="grid-oem-top">
        <SectionCard id="oem.product" stretch={false} className="product-card">
          <div className="card__head">
            <div>
              <h2>{product.value}</h2>
              <p className="muted">Modular. Leistungsstark. Zukunftsfähig.</p>
            </div>
            <FieldBadge fieldKey="oem.product.dppStatus" withIcon />
          </div>
          <img className="product-card__img" src="/images/oem/pack.webp" alt="" width="368" height="182" />
          <div className="spec-row">
            <FieldMetric fieldKey="oem.product.capacity" icon="battery" className="metric--spec" />
            <FieldMetric fieldKey="oem.product.voltage" icon="bolt" className="metric--spec" />
            <FieldMetric fieldKey="oem.product.mass" icon="box" className="metric--spec" />
            <FieldMetric fieldKey="oem.product.cycles" icon="recycle" className="metric--spec" />
          </div>
        </SectionCard>

        <div className="card">
          <div className="card__head">
            <SectionTitle sub="Linear. Zirkulär. Transparent.">Wertschöpfungskette der Batterie</SectionTitle>
            <ul className="legend">
              <li><span className="legend__line legend__line--linear" /> Linearer Fluss</li>
              <li><span className="legend__line legend__line--loop" /> Zirkulärer Fluss</li>
            </ul>
          </div>
          <div className="vchain">
            <ArrowChain ids={linear} className="vchain__linear">
              {(id) => <ChainPhoto id={id} />}
            </ArrowChain>
            <div className="vchain__loop">
              <span className="vchain__curve vchain__curve--up" aria-hidden="true">
                <Icon name="arrow" size={16} />
              </span>
              <ChainPhoto id={recycling} wide />
              <span className="vchain__back" aria-hidden="true">
                <Icon name="arrow" size={18} />
              </span>
              <ChainPhoto id={secondLife} wide />
              <span className="vchain__curve vchain__curve--down" aria-hidden="true">
                <Icon name="arrow" size={16} />
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <SectionTitle sub="Nachhaltig by Design, mit validen Daten aus der Wertschöpfung.">Design & Engineering</SectionTitle>
          <div className="eng">
            <img className="eng__img" src="/images/oem/exploded.webp" alt="" width="202" height="232" />
            <div className="stack eng__list">
              {oemEngIds.map((id) => (
                <Tile key={id} id={id} fieldKey={`${id}.value`} className="tile--compact" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-oem-mid">
        <SectionCard id="oem.impact" stretch={false}>
          <div className="card__head">
            <SectionTitle sub="Beispiel: Umstellung der Zellchemie">Auswirkung einer Design-Änderung</SectionTitle>
            <Badge tone="warn">Vorschau · nicht im Produktpass</Badge>
          </div>
          <div className="metrics metrics--5">
            <FieldMetric fieldKey="oem.impact.co2" icon="leaf" className="metric--accent metric--impact">
              <ChangeBars fieldKey="oem.impact.co2" />
            </FieldMetric>
            <FieldMetric fieldKey="oem.impact.cost" icon="chart" className="metric--accent metric--impact">
              <ChangeBars fieldKey="oem.impact.cost" />
            </FieldMetric>
            <FieldMetric fieldKey="oem.impact.recycling" icon="recycle" className="metric--accent metric--impact">
              <ChangeBars fieldKey="oem.impact.recycling" />
            </FieldMetric>
            <FieldMetric fieldKey="oem.impact.compliance" icon="shield" className="metric--accent metric--impact" />
            <FieldMetric fieldKey="oem.impact.dpp" icon="database" className="metric--impact" />
          </div>
        </SectionCard>

        <SectionCard id="oem.lifecycle" stretch={false}>
          <SectionTitle sub="kg CO₂e pro kWh">Lifecycle Impact</SectionTitle>
          <div className="lifecycle">
            <BarChart max={30} bars={LIFECYCLE} />
            <LifecycleDonut />
          </div>
        </SectionCard>
      </div>

      <section className="card" aria-labelledby="oem-dpp-title">
        <div className="card__head">
          <div className="section-title">
            <h2 id="oem-dpp-title">DPP-Informationen entlang des Produktlebenszyklus</h2>
            <p>Alle relevanten Informationen, durchgängig strukturiert.</p>
          </div>
          <button type="button" className="btn btn--small" onClick={() => openSection('oem.dpp.dpp')}>
            DPP-Daten im Detail öffnen <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="grid-tiles grid-tiles--7">
          {oemDppIds.map((id) => (
            <DppCard key={id} id={id} />
          ))}
        </div>
      </section>
    </div>
  );
}
