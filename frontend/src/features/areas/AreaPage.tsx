import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHero } from '../../components/ui/SectionCard';
import { AREAS, AREA_ITEM_PARAM, areaPath, type Area } from '../../lib/pages';

/** Einträge mit eigener Ansicht (`bereich/eintrag`); alle übrigen zeigen den Platzhalter. */
const ITEM_VIEWS: Partial<Record<string, LazyExoticComponent<ComponentType>>> = {
  'data-factory/datastructure': lazy(() =>
    import('../datastructure/DatastructureOverview').then((m) => ({ default: m.DatastructureOverview })),
  ),
};

/** Bereichsseite der Sidebar. Ohne eigene Ansicht bewusst nur Platzhalter, damit keine Inhalte erfunden werden. */
export function AreaPage({ areaId }: { areaId: Area['id'] }) {
  const area = AREAS.find((a) => a.id === areaId)!;
  const number = AREAS.indexOf(area) + 1;
  const [params] = useSearchParams();
  const items: readonly { id: string; label: string }[] = area.items;
  const item = items.find((i) => i.id === params.get(AREA_ITEM_PARAM));
  const View = item ? ITEM_VIEWS[`${area.id}/${item.id}`] : undefined;

  return (
    <div className="page">
      <PageHero
        title={`${number}. ${area.label}`}
        subtitle={item ? `Ausgewählt: ${item.label}` : 'Bitte einen Eintrag auswählen.'}
      />
      <nav className="area-select" aria-label={`${area.label}: Auswahl`}>
        {items.map((i) => (
          <Link
            key={i.id}
            to={areaPath(area.id, i.id)}
            className={`area-select__item${i.id === item?.id ? ' active' : ''}`}
            aria-current={i.id === item?.id ? 'page' : undefined}
          >
            {i.label}
          </Link>
        ))}
      </nav>
      {View ? (
        <Suspense fallback={<p className="loading" role="status">Wird geladen …</p>}>
          <View />
        </Suspense>
      ) : (
        <section className="card area-placeholder" aria-labelledby="area-placeholder-title">
          <h2 id="area-placeholder-title">{item ? item.label : area.label}</h2>
          <p className="muted">Inhalt in Vorbereitung.</p>
        </section>
      )}
    </div>
  );
}
