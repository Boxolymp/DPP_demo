import { useField } from '../../hooks/useContent';
import type { DataField, FieldStatus, Tone } from '../../types/content';

export const STATUS_LABEL: Record<FieldStatus, string> = {
  illustrative: 'Illustrativ',
  unavailable: 'Nicht verfügbar',
  live: 'Live',
};

export function formatValue(f: DataField): string {
  if (f.value === undefined) return 'nicht verfügbar';
  return f.unit ? `${f.value} ${f.unit}` : String(f.value);
}

/** Zeigt den Wert eines Felds; illustrative Werte sind gestrichelt unterstrichen. */
export function DataValue({ fieldKey, withUnit = true }: { fieldKey: string; withUnit?: boolean }) {
  const f = useField(fieldKey);
  const text = withUnit ? formatValue(f) : f.value === undefined ? 'nicht verfügbar' : String(f.value);
  return (
    <span
      className={`dv dv--${f.status}`}
      title={f.status === 'illustrative' ? 'Illustrativer Beispielwert, noch nicht aus einer Datenquelle' : undefined}
    >
      {text}
    </span>
  );
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function FieldBadge({ fieldKey }: { fieldKey: string }) {
  const f = useField(fieldKey);
  return <Badge tone={f.tone ?? 'neutral'}>{formatValue(f)}</Badge>;
}
