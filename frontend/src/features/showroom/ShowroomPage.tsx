import { useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/DataValue';
import { Icon } from '../../components/ui/Icon';
import { PRODUCT_GROUPS, SHOWROOM_INFO, type ProductGroup } from '../../content/showroom';
import { productPath } from '../../lib/paths';
import { Illustration } from './Illustrations';

function Shelf({ group, dimmed }: { group: ProductGroup; dimmed: boolean }) {
  const inner = (
    <>
      <div className="shelf__top">
        <span className="shelf__icon"><Icon name={group.icon} size={24} /></span>
        <div>
          <h2>{group.title}</h2>
          <Badge tone={group.tone}>{group.status}</Badge>
        </div>
        <Icon name="chevron" size={18} />
      </div>
      <div className="shelf__scene"><Illustration id={group.id} /></div>
      <p className="shelf__text">{group.text}</p>
    </>
  );
  const cls = `shelf shelf--${group.id} ${dimmed ? 'shelf--dim' : ''}`;
  if (group.productId) {
    return (
      <Link to={productPath(group.productId, 'oem')} className={`${cls} shelf--active`}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={`${cls} shelf--disabled`} aria-disabled="true" title="Noch keine Fachseiten für diese Produktgruppe">
      {inner}
    </div>
  );
}

export function ShowroomPage() {
  const roomRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = roomRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty('--py', String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const onLeave = () => {
    roomRef.current?.style.setProperty('--px', '0');
    roomRef.current?.style.setProperty('--py', '0');
  };

  const q = query.trim().toLowerCase();
  const matches = (g: ProductGroup) => q === '' || g.title.toLowerCase().includes(q) || g.text.toLowerCase().includes(q);

  return (
    <div className="room" ref={roomRef} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="room__wall" aria-hidden="true" />
      <div className="room__slats" aria-hidden="true" />
      <div className="room__floor" aria-hidden="true" />
      <div className="room__glow" aria-hidden="true" />

      <div className="room__content">
        <div className="room__head">
          <div>
            <h1>DPP-relevante Produktgruppen</h1>
            <p>
              Entdecken Sie ausgewählte Produktgruppen und erfahren Sie, wie der Digitale Produktpass entlang der
              Wertschöpfungskette Transparenz schafft.
            </p>
          </div>
          <label className="search">
            <Icon name="search" size={18} />
            <span className="sr-only">Produktgruppen durchsuchen</span>
            <input
              type="search"
              placeholder="Produktgruppen durchsuchen …"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <div className="shelves">
          {PRODUCT_GROUPS.map((g) => (
            <Shelf key={g.id} group={g} dimmed={!matches(g)} />
          ))}
        </div>

        <div className="info-bar">
          {SHOWROOM_INFO.map((i) => (
            <div key={i.title} className="info-bar__item">
              <span className="tile__icon"><Icon name={i.icon} /></span>
              <div>
                <strong>{i.title}</strong>
                <p>{i.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
