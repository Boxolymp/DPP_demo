import type { ReactNode } from 'react';
import { useDrawer } from '../../app/providers/DrawerProvider';
import { useField, useSection } from '../../hooks/useContent';
import { DataValue } from './DataValue';

interface SectionCardProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** true: ganze Karte ist klickbar. false: Inhalt enthält eigene klickbare Elemente. */
  stretch?: boolean;
}

/** Klickbarer Bereich. Die Karte öffnet den Detail-Drawer zur Sektion `id`. */
export function SectionCard({ id, children, className = '', stretch = true }: SectionCardProps) {
  const section = useSection(id);
  const { openSection } = useDrawer();
  return (
    <div role="group" className={`card ${stretch ? 'card--click' : ''} ${className}`} aria-label={section.title}>
      {children}
      {stretch ? (
        <button type="button" className="card__hit" onClick={() => openSection(id)}>
          <span className="sr-only">Details zu {section.title} öffnen</span>
        </button>
      ) : (
        <button type="button" className="card__more" onClick={() => openSection(id)}>
          Details
        </button>
      )}
    </div>
  );
}

/** Kennzahl, die den Drawer für genau ein Feld öffnet. */
export function FieldMetric({ fieldKey, className = '' }: { fieldKey: string; className?: string }) {
  const f = useField(fieldKey);
  const { openField } = useDrawer();
  return (
    <button type="button" className={`metric ${className}`} onClick={() => openField(fieldKey)}>
      <span className="metric__label">{f.label}</span>
      <span className="metric__value">
        <DataValue fieldKey={fieldKey} />
      </span>
    </button>
  );
}

/** Einfache Überschrift mit Unterzeile für eine Seite; `visual` erscheint rechts daneben. */
export function PageHero({
  title,
  strong,
  subtitle,
  badge,
  visual,
}: {
  title: string;
  strong?: string;
  subtitle: string;
  badge?: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <header className={`hero ${visual ? 'hero--visual' : ''}`}>
      <div className="hero__text">
        <h1>
          {title}
          {strong ? <> – <span>{strong}</span></> : null}
        </h1>
        <p>{subtitle}</p>
        {badge}
      </div>
      {visual}
    </header>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {sub ? <p>{sub}</p> : null}
    </div>
  );
}
