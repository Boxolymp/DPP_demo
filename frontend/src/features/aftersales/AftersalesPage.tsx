import { ArrowChain } from '../../components/ui/Chain';
import { Badge, DataValue } from '../../components/ui/DataValue';
import { Icon, type IconName } from '../../components/ui/Icon';
import { PageHero, SectionCard } from '../../components/ui/SectionCard';
import { Tile } from '../../components/ui/Tile';
import {
  aftersalesEventKeys,
  aftersalesFlowIds,
  aftersalesGroups,
  aftersalesSourceIds,
} from '../../content/aftersales';
import { useField, useSection } from '../../hooks/useContent';

const GROUPS: { key: keyof typeof aftersalesGroups; title: string; sub: string; icon: IconName }[] = [
  { key: 'recognize', title: 'Erkennen', sub: 'Zustand, Nutzung und Risiken frühzeitig verstehen.', icon: 'pulse' },
  { key: 'act', title: 'Handeln', sub: 'Service, Ersatzteile und Sicherheit effizient umsetzen.', icon: 'wrench' },
  { key: 'improve', title: 'Weiterentwickeln', sub: 'Erkenntnisse in zukünftige Wertschöpfung integrieren.', icon: 'chart' },
];

function FlowNode({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="flow-node">
      <span className="chain__icon"><Icon name={s.icon ?? 'box'} size={22} /></span>
      <span>
        <strong>{s.title}</strong>
        <span className="muted small flow-node__sub"><DataValue fieldKey={`${id}.sub`} /></span>
      </span>
    </SectionCard>
  );
}

function EventRow({ fieldKey }: { fieldKey: string }) {
  const f = useField(fieldKey);
  return (
    <li className="event">
      <span className={`dot dot--${f.tone ?? 'neutral'}`} />
      <span>
        <strong>{f.label}</strong>
        <span className="muted small event__sub"><DataValue fieldKey={fieldKey} /></span>
      </span>
    </li>
  );
}

export function AftersalesPage() {
  return (
    <div className="page">
      <PageHero
        title="Aftersales Experience"
        strong="Erkennen. Handeln. Weiterentwickeln."
        subtitle="Daten aus Nutzung, Service und Rückführungen schaffen Mehrwert entlang des gesamten Batterie-Lebenszyklus."
      />

      <div className="grid-aftersales-top">
        <div className="card">
          <h2 className="h-sm">Vom Feld zurück in die Entwicklung</h2>
          <p className="muted">
            Ein Kreislauf aus Beobachten, Auswerten und Verbessern: Was im Betrieb auffällt, wird analysiert und fließt als
            Änderung in die nächste Produktrevision. Der Digitale Produktpass verknüpft alle Schritte mit demselben Produkt.
          </p>
          <ArrowChain ids={aftersalesFlowIds} className="flow">
            {(id) => <FlowNode id={id} />}
          </ArrowChain>
        </div>

        <SectionCard id="aftersales.featured" stretch={false}>
          <div className="card__head">
            <div>
              <p className="muted small">Ausgewählter Use Case</p>
              <h2>Field Feedback</h2>
            </div>
            <Badge tone="ok">OEM</Badge>
          </div>
          <p className="muted">Nutzungsdaten und Kundenfeedback aus dem Feld erfassen, analysieren und für Produktverbesserungen nutzen.</p>
          <p className="small"><strong>Beispielereignisse</strong> <Badge>Illustrativ</Badge></p>
          <ul className="events">
            {aftersalesEventKeys.map((k) => (
              <EventRow key={k} fieldKey={k} />
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid-aftersales-groups">
        {GROUPS.map((g) => (
          <div key={g.key} className={`card group group--${g.key}`}>
            <div className="group__head">
              <span className="tile__icon"><Icon name={g.icon} /></span>
              <div>
                <h2>{g.title}</h2>
                <p className="muted small">{g.sub}</p>
              </div>
            </div>
            <div className="stack">
              {aftersalesGroups[g.key].map((id) => (
                <Tile key={id} id={id} fieldKey={`${id}.sub`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="h-sm">DPP-Daten intelligent verknüpfen</h2>
        <p className="muted small">Die Use Cases kombinieren DPP-Daten mit Service-, BMS-, PLM-, Qualitäts- und Logistikdaten.</p>
        <div className="grid-tiles grid-tiles--5">
          {aftersalesSourceIds.map((id) => (
            <SourceTile key={id} id={id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SourceTile({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="source">
      <strong>{s.title}</strong>
      <Badge tone="open">nicht angebunden</Badge>
    </SectionCard>
  );
}
