import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import { AREAS, AREA_ITEM_PARAM, areaPath, externalLinkProps, type AreaItem } from '../../lib/pages';

/**
 * Dauerhaft sichtbare Bereichsnavigation im Stil der Header-Umschalter.
 * Je Bereich ein Dropdown mit den Einträgen; der Bereich der aktuellen Seite ist aufgeklappt.
 */
export function Sidebar() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const selected = params.get(AREA_ITEM_PARAM);
  const current = AREAS.find((a) => pathname === areaPath(a.id))?.id;
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(current ? [current] : []));

  useEffect(() => {
    if (current) setOpen((s) => (s.has(current) ? s : new Set(s).add(current)));
  }, [current]);

  const toggle = (id: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <aside id="sidebar" className="sidebar">
      <nav aria-label="Bereiche">
        <ul className="sidebar__groups">
          {AREAS.map((area) => {
            const isOpen = open.has(area.id);
            const listId = `sidebar-${area.id}`;
            return (
              <li key={area.id} className="switcher switcher--stack">
                <button
                  type="button"
                  className={`switcher__item sidebar__toggle${area.id === current ? ' current' : ''}`}
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  onClick={() => toggle(area.id)}
                >
                  <Icon name={area.icon} size={16} />
                  {area.label}
                  <span className="sidebar__chevron">
                    <Icon name="chevron" size={14} />
                  </span>
                </button>
                <ul id={listId} className="sidebar__items" hidden={!isOpen}>
                  {(area.items as readonly AreaItem[]).map((item) => {
                    const active = area.id === current && selected === item.id;
                    const external = externalLinkProps(item);
                    return (
                      <li key={item.id}>
                        {external ? (
                          <a {...external} className="switcher__item sidebar__item">
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            to={areaPath(area.id, item.id)}
                            className={`switcher__item sidebar__item${active ? ' active' : ''}`}
                            aria-current={active ? 'page' : undefined}
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
