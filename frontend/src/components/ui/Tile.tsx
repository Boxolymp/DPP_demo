import { useDrawer } from '../../app/providers/DrawerProvider';
import { useField, useSection } from '../../hooks/useContent';
import { DataValue } from './DataValue';
import { Icon, type IconName } from './Icon';
import { SectionCard } from './SectionCard';

interface TileProps {
  id: string;
  /** Überschreibt das Icon der Sektion. */
  icon?: IconName;
  /** Optionales Feld, dessen Wert als Untertitel erscheint. */
  fieldKey?: string;
  className?: string;
}

/** Kachel mit Icon, Titel und optionalem Feldwert; öffnet die Sektion `id`. */
export function Tile({ id, icon, fieldKey, className = '' }: TileProps) {
  const s = useSection(id);
  return (
    <SectionCard id={id} className={`tile ${className}`}>
      <span className="tile__icon">
        <Icon name={icon ?? s.icon ?? 'box'} />
      </span>
      <span className="tile__body">
        <span className="tile__title">{s.title}</span>
        {fieldKey ? (
          <span className="tile__text">
            <DataValue fieldKey={fieldKey} />
          </span>
        ) : null}
      </span>
      <span className="tile__chev">
        <Icon name="chevron" size={16} />
      </span>
    </SectionCard>
  );
}

/** Liste von Feldern als Zeilen; jede Zeile öffnet das Feld im Drawer. */
export function FieldList({ keys }: { keys: string[] }) {
  return (
    <ul className="fieldlist">
      {keys.map((k) => (
        <FieldRowButton key={k} fieldKey={k} />
      ))}
    </ul>
  );
}

function FieldRowButton({ fieldKey }: { fieldKey: string }) {
  const f = useField(fieldKey);
  const { openField } = useDrawer();
  return (
    <li>
      <button type="button" className="fieldlist__row" onClick={() => openField(fieldKey)}>
        <span className="fieldlist__label">{f.label}</span>
        <span className="fieldlist__value">
          <DataValue fieldKey={fieldKey} />
        </span>
      </button>
    </li>
  );
}
