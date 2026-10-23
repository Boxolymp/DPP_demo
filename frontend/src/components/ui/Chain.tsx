import type { ReactNode } from 'react';
import { useSection } from '../../hooks/useContent';
import { Icon } from './Icon';
import { SectionCard } from './SectionCard';

/** Station einer Kette: Icon und Titel der Sektion `id`, öffnet deren Drawer. */
export function ChainNode({ id }: { id: string }) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className="chain__node">
      <span className="chain__icon">
        <Icon name={s.icon ?? 'box'} size={22} />
      </span>
      <span className="chain__label">{s.title}</span>
    </SectionCard>
  );
}

interface ArrowChainProps {
  ids: string[];
  /** Klassen des Containers, z. B. `chain chain--linear`. */
  className: string;
  /** Pfeile zeigen zurück (zirkulärer Fluss). */
  back?: boolean;
  children: (id: string) => ReactNode;
}

/** Reiht die Sektionen `ids` mit Pfeilen dazwischen auf. */
export function ArrowChain({ ids, className, back = false, children }: ArrowChainProps) {
  return (
    <div className={className}>
      {ids.map((id, i) => (
        <div className="chain__step" key={id}>
          {children(id)}
          {i < ids.length - 1 ? (
            <span className={`chain__arrow ${back ? 'chain__arrow--back' : ''}`}>
              <Icon name="arrow" size={18} />
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
