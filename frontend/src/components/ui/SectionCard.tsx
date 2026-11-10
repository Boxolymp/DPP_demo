import type { ReactNode } from 'react';
import { useDrawer } from '../../app/providers/DrawerProvider';
import { useField, useSection } from '../../hooks/useContent';
import { DataValue } from './DataValue';
import { Icon, type IconName } from './Icon';

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

interface FieldMetricProps {
  fieldKey: string;
  className?: string;
  icon?: IconName;
  /** Ergänzende Darstellung unter dem Wert, z. B. ein Mini-Diagramm. */
  children?: ReactNode;
}

/** Kennzahl, die den Drawer für genau ein Feld öffnet. */
export function FieldMetric({ fieldKey, className = '', icon, children }: FieldMetricProps) {
  const f = useField(fieldKey);
  const { openField } = useDrawer();
  return (
    <button type="button" className={`metric ${icon ? 'metric--icon' : ''} ${className}`} onClick={() => openField(fieldKey)}>
      {icon ? (
        <span className="metric__icon">
          <Icon name={icon} size={18} />
        </span>
      ) : null}
      <span className="metric__label">{f.label}</span>
      <span className="metric__value">
        <DataValue fieldKey={fieldKey} />
      </span>
      {children}
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
