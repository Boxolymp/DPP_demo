import { useDrawer } from '../../app/providers/DrawerProvider';
import { ArrowChain } from '../../components/ui/Chain';
import { Badge, DataValue } from '../../components/ui/DataValue';
import { Icon, type IconName } from '../../components/ui/Icon';
import { PageHero, SectionCard } from '../../components/ui/SectionCard';
import { aftersalesFlowIds, aftersalesGroups, aftersalesSourceIds } from '../../content/aftersales';
import { useSection } from '../../hooks/useContent';

const GROUPS: { key: keyof typeof aftersalesGroups; title: string; sub: string; icon: IconName }[] = [
  { key: 'recognize', title: 'Erkennen', sub: 'Zustand, Nutzung und Risiken frühzeitig verstehen.', icon: 'pulse' },
  { key: 'act', title: 'Handeln', sub: 'Service, Ersatzteile und Sicherheit effizient umsetzen.', icon: 'wrench' },
  { key: 'improve', title: 'Weiterentwickeln', sub: 'Erkenntnisse in zukünftige Wertschöpfung integrieren.', icon: 'chart' },
];

/** Je Gruppe erscheinen so viele Use Cases als Kachel, weitere als Zeile „Weitere Option“ darunter. */
const TILES_PER_GROUP = 4;
const FEATURED_USE_CASE_ID = 'aftersales.recognize.feedback';

function FlowNode({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="flow-node">
      <span className="chain__icon"><Icon name={s.icon ?? 'box'} size={20} /></span>
      <span>
        <strong>{s.title}</strong>
        <span className="muted small flow-node__sub"><DataValue fieldKey={`${id}.sub`} /></span>
      </span>
    </SectionCard>
  );
}

function FeaturedUseCase() {
  const { openSection } = useDrawer();
  const useCase = useSection(FEATURED_USE_CASE_ID);
  return (
    <div className="card featured">
      <div className="featured__head">
        <span className="featured__icon"><Icon name="pulse" size={26} /></span>
        <div>
          <p className="muted small">Ausgewählter Use Case</p>
          <h2>{useCase.title}</h2>
        </div>
        <Badge tone="ok">OEM</Badge>
      </div>
      <p className="muted">{useCase.summary}</p>
      <button type="button" className="featured__row" onClick={() => openSection('aftersales.featured')}>
        <Icon name="doc" />
        <span>Beispielereignisse ansehen</span>
        <Badge>Illustrativ</Badge>
        <Icon name="chevron" size={16} />
      </button>
      <button type="button" className="btn btn--primary featured__cta" onClick={() => openSection(FEATURED_USE_CASE_ID)}>
        Zum Use Case <Icon name="arrow" size={18} />
      </button>
    </div>
  );
}

function UseCaseTile({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="usecase">
      <span className="usecase__icon"><Icon name={s.icon ?? 'box'} size={28} /></span>
      <span className="usecase__title">{s.title}</span>
    </SectionCard>
  );
}

function MoreOption({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="more-option">
      <Icon name="dots" size={26} />
      <span className="more-option__body">
        <span className="muted small">Weitere Option</span>
        <strong>{s.title}</strong>
      </span>
      <Icon name="chevron" size={16} />
    </SectionCard>
  );
}

export function AftersalesPage() {
  return (
    <div className="page">
      <section className="aftersales-stage">
        <div className="aftersales-stage__main">
          <PageHero
            title="Aftersales Experience"
            strong="Erkennen. Handeln. Weiterentwickeln."
            subtitle="Daten aus Nutzung, Service und Rückführungen schaffen Mehrwert entlang des gesamten Batterie-Lebenszyklus."
          />
          <div className="aftersales-scene">
            <ArrowChain ids={aftersalesFlowIds} className="flow">
              {(id) => <FlowNode id={id} />}
            </ArrowChain>
            <img src="/images/aftersales/hero.webp" alt="" width="1000" height="160" />
          </div>
          <p className="muted small">
            Vom Feld zurück in die Entwicklung: Was im Betrieb auffällt, wird analysiert und fließt als Änderung in die nächste
            Produktrevision. Der Digitale Produktpass verknüpft alle Schritte mit demselben Produkt.
          </p>
        </div>
        <FeaturedUseCase />
      </section>

      <div className="grid-aftersales-groups">
        {GROUPS.map((g) => {
          const ids = aftersalesGroups[g.key];
          return (
            <section key={g.key} className="card group" aria-labelledby={`group-${g.key}`}>
              <div className="group__head">
                <Icon name={g.icon} size={34} />
                <div>
                  <h2 id={`group-${g.key}`}>{g.title}</h2>
                  <p className="muted small">{g.sub}</p>
                </div>
              </div>
              <div className="usecases">
                {ids.slice(0, TILES_PER_GROUP).map((id) => (
                  <UseCaseTile key={id} id={id} />
                ))}
              </div>
              {ids.slice(TILES_PER_GROUP).map((id) => (
                <MoreOption key={id} id={id} />
              ))}
            </section>
          );
        })}
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
