import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface ArrowChainProps {
  ids: string[];
  /** Klassen des Containers, z. B. `photo-chain`. */
  className: string;
  children: (id: string) => ReactNode;
}

/** Reiht die Sektionen `ids` mit Pfeilen dazwischen auf. */
export function ArrowChain({ ids, className, children }: ArrowChainProps) {
  return (
    <div className={className}>
      {ids.map((id, i) => (
        <div className="chain__step" key={id}>
          {children(id)}
          {i < ids.length - 1 ? (
            <span className="chain__arrow">
              <Icon name="arrow" size={18} />
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
