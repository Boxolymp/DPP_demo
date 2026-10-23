import { useDrawer } from '../../app/providers/DrawerProvider';
import { useField } from '../../hooks/useContent';
import { DataValue } from '../ui/DataValue';

interface Props {
  fieldKeys: string[];
  /** Kurzbezeichnungen für die Achse, gleiche Reihenfolge wie fieldKeys. */
  labels: string[];
  max: number;
  accent?: boolean[];
}

function Bar({ fieldKey, label, max, accent }: { fieldKey: string; label: string; max: number; accent: boolean }) {
  const f = useField(fieldKey);
  const { openField } = useDrawer();
  const n = typeof f.value === 'number' ? f.value : 0;
  return (
    <button type="button" className="bar" onClick={() => openField(fieldKey)} aria-label={`${label}: Details`}>
      <span className="bar__value">
        <DataValue fieldKey={fieldKey} withUnit={false} />
      </span>
      <span className="bar__track">
        <span className={`bar__fill ${accent ? 'bar__fill--accent' : ''}`} style={{ height: `${(n / max) * 100}%` }} />
      </span>
      <span className="bar__label">{label}</span>
    </button>
  );
}

/** Balkendiagramm aus Feldern; jeder Balken öffnet das zugehörige Feld. */
export function BarChart({ fieldKeys, labels, max, accent = [] }: Props) {
  return (
    <div className="bars">
      {fieldKeys.map((k, i) => (
        <Bar key={k} fieldKey={k} label={labels[i]} max={max} accent={accent[i] ?? false} />
      ))}
    </div>
  );
}
