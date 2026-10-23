import { useDrawer } from '../../app/providers/DrawerProvider';
import { useField } from '../../hooks/useContent';
import { DataValue } from '../ui/DataValue';

export interface BarDef {
  fieldKey: string;
  /** Kurzbezeichnung für die Achse. */
  label: string;
  accent?: boolean;
}

function Bar({ fieldKey, label, accent = false, max }: BarDef & { max: number }) {
  const f = useField(fieldKey);
  const { openField } = useDrawer();
  const n = typeof f.value === 'number' ? f.value : 0;
  return (
    <button type="button" className="bar" onClick={() => openField(fieldKey)} aria-label={`${label}: Details`}>
      <span className="bar__value">
        <DataValue fieldKey={fieldKey} withUnit={false} />
      </span>
      <span className="bar__track">
        <span className={`bar__fill ${accent ? 'bar__fill--accent' : ''}`} style={{ height: `${Math.min(100, (n / max) * 100)}%` }} />
      </span>
      <span className="bar__label">{label}</span>
    </button>
  );
}

/** Balkendiagramm aus Feldern; jeder Balken öffnet das zugehörige Feld. Felder ohne Zahlenwert erscheinen leer. */
export function BarChart({ bars, max }: { bars: BarDef[]; max: number }) {
  return (
    <div className="bars">
      {bars.map((b) => (
        <Bar key={b.fieldKey} {...b} max={max} />
      ))}
    </div>
  );
}
