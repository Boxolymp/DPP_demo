import { BarChart } from '../../components/charts/BarChart';
import { ArrowChain, ChainNode } from '../../components/ui/Chain';
import { Badge, FieldBadge } from '../../components/ui/DataValue';
import { Icon } from '../../components/ui/Icon';
import { FieldMetric, PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { Tile } from '../../components/ui/Tile';
import { oemChainIds, oemDppIds, oemEngIds } from '../../content/oem';
import { useField } from '../../hooks/useContent';

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
          <ArrowChain ids={linear} className="chain chain--linear">
            {(id) => <ChainNode id={id} />}
          </ArrowChain>
          <ArrowChain ids={loop} className="chain chain--loop" back>
            {(id) => <ChainNode id={id} />}
          </ArrowChain>
        </div>

        <div className="card">
          <SectionTitle sub="Nachhaltig by Design, mit validen Daten aus der Wertschöpfung.">Design & Engineering</SectionTitle>
          <div className="stack">
            {oemEngIds.map((id) => (
              <Tile key={id} id={id} fieldKey={`${id}.value`} />
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
              max={30}
              bars={[
                { fieldKey: 'oem.lifecycle.raw', label: 'Rohstoffe' },
                { fieldKey: 'oem.lifecycle.cells', label: 'Zellen' },
                { fieldKey: 'oem.lifecycle.modules', label: 'Module/Packs' },
                { fieldKey: 'oem.lifecycle.use', label: 'Nutzung', accent: true },
                { fieldKey: 'oem.lifecycle.eol', label: 'End-of-Life', accent: true },
              ]}
            />
            <FieldMetric fieldKey="oem.lifecycle.total" className="metric--big" />
          </div>
        </SectionCard>
      </div>

      <SectionTitle sub="Alle relevanten Informationen, durchgängig strukturiert.">DPP-Informationen entlang des Produktlebenszyklus</SectionTitle>
      <div className="grid-tiles grid-tiles--7">
        {oemDppIds.map((id) => (
          <Tile key={id} id={id} fieldKey={`${id}.data`} />
        ))}
      </div>
    </div>
  );
}
