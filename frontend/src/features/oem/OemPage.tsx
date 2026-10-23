import { BarChart } from '../../components/charts/BarChart';
import { Badge, FieldBadge } from '../../components/ui/DataValue';
import { Icon, type IconName } from '../../components/ui/Icon';
import { FieldMetric, PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { Tile } from '../../components/ui/Tile';
import { oemChainIds, oemDppIds, oemEngIds } from '../../content/oem';
import { useField, useSection } from '../../hooks/useContent';

const CHAIN_ICONS: Record<string, IconName> = {
  raw: 'box',
  cell: 'battery',
  module: 'box',
  oem: 'car',
  logistics: 'truck',
  use: 'bolt',
  secondlife: 'gear',
  recycling: 'recycle',
};
const ENG_ICONS: IconName[] = ['battery', 'box', 'gear', 'wrench', 'doc'];
const DPP_ICONS: IconName[] = ['box', 'factory', 'doc', 'truck', 'car', 'gear', 'recycle'];

function ChainNode({ id }: { id: string }) {
  const s = useSection(id);
  const kind = id.split('.').pop() ?? '';
  return (
    <SectionCard id={id} className="chain__node">
      <span className="chain__icon">
        <Icon name={CHAIN_ICONS[kind] ?? 'box'} size={22} />
      </span>
      <span className="chain__label">{s.title}</span>
    </SectionCard>
  );
}

export function OemPage() {
  const product = useField('oem.product.name');
  const linear = oemChainIds.slice(0, 6);
  const loop = oemChainIds.slice(6).reverse();
  return (
    <div className="page">
      <PageHero
        title="OEM"
        strong="Batterie und ihre Wertschöpfung"
        subtitle="Transparente Daten. Bessere Entscheidungen. Für eine nachhaltige und zirkuläre Batteriezukunft."
      />

      <div className="grid-oem-top">
        <SectionCard id="oem.product" stretch={false}>
          <div className="card__head">
            <div>
              <h2>{product.value}</h2>
              <p className="muted">Modular. Leistungsstark. Zukunftsfähig.</p>
            </div>
            <FieldBadge fieldKey="oem.product.dppStatus" />
          </div>
          <div className="product-visual" aria-hidden="true">
            <Icon name="battery" size={72} />
          </div>
          <div className="metrics metrics--4">
            <FieldMetric fieldKey="oem.product.capacity" />
            <FieldMetric fieldKey="oem.product.voltage" />
            <FieldMetric fieldKey="oem.product.mass" />
            <FieldMetric fieldKey="oem.product.cycles" />
          </div>
        </SectionCard>

        <div className="card">
          <SectionTitle sub="Linear. Zirkulär. Transparent.">Wertschöpfungskette der Batterie</SectionTitle>
          <ul className="legend">
            <li><span className="legend__line legend__line--linear" /> Linearer Fluss</li>
            <li><span className="legend__line legend__line--loop" /> Zirkulärer Fluss</li>
          </ul>
          <div className="chain chain--linear">
            {linear.map((id, i) => (
              <div className="chain__step" key={id}>
                <ChainNode id={id} />
                {i < linear.length - 1 ? <span className="chain__arrow"><Icon name="arrow" size={18} /></span> : null}
              </div>
            ))}
          </div>
          <div className="chain chain--loop">
            {loop.map((id, i) => (
              <div className="chain__step" key={id}>
                <ChainNode id={id} />
                {i < loop.length - 1 ? <span className="chain__arrow chain__arrow--back"><Icon name="arrow" size={18} /></span> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <SectionTitle sub="Nachhaltig by Design, mit validen Daten aus der Wertschöpfung.">Design & Engineering</SectionTitle>
          <div className="stack">
            {oemEngIds.map((id, i) => (
              <Tile key={id} id={id} icon={ENG_ICONS[i]} fieldKey={`${id}.value`} />
            ))}
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
            <FieldMetric fieldKey="oem.impact.co2" className="metric--accent" />
            <FieldMetric fieldKey="oem.impact.cost" className="metric--accent" />
            <FieldMetric fieldKey="oem.impact.recycling" className="metric--accent" />
            <FieldMetric fieldKey="oem.impact.compliance" />
            <FieldMetric fieldKey="oem.impact.dpp" />
          </div>
        </SectionCard>

        <SectionCard id="oem.lifecycle" stretch={false}>
          <SectionTitle sub="kg CO₂e pro kWh">Lifecycle Impact</SectionTitle>
          <div className="lifecycle">
            <BarChart
              fieldKeys={['oem.lifecycle.raw', 'oem.lifecycle.cells', 'oem.lifecycle.modules', 'oem.lifecycle.use', 'oem.lifecycle.eol']}
              labels={['Rohstoffe', 'Zellen', 'Module/Packs', 'Nutzung', 'End-of-Life']}
              max={30}
              accent={[false, false, false, true, true]}
            />
            <FieldMetric fieldKey="oem.lifecycle.total" className="metric--big" />
          </div>
        </SectionCard>
      </div>

      <SectionTitle sub="Alle relevanten Informationen, durchgängig strukturiert.">DPP-Informationen entlang des Produktlebenszyklus</SectionTitle>
      <div className="grid-tiles grid-tiles--7">
        {oemDppIds.map((id, i) => (
          <Tile key={id} id={id} icon={DPP_ICONS[i]} fieldKey={`${id}.data`} />
        ))}
      </div>
    </div>
  );
}
