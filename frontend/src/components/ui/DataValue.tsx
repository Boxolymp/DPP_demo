import { useField } from '../../hooks/useContent';
import type { DataField, FieldStatus, Tone } from '../../types/content';
import { Icon, type IconName } from './Icon';

export const STATUS_LABEL: Record<FieldStatus, string> = {
  illustrative: 'Illustrativ',
  unavailable: 'Nicht verfügbar',
  live: 'Live',
};

export const STATUS_TONE: Record<FieldStatus, Tone> = {
  illustrative: 'neutral',
  unavailable: 'open',
  live: 'ok',
};

export function formatValue(f: DataField, withUnit = true): string {
  if (f.value === undefined) return 'nicht verfügbar';
  return withUnit && f.unit ? `${f.value} ${f.unit}` : String(f.value);
}

/** Zeigt den Wert eines Felds; illustrative Werte sind gestrichelt unterstrichen. */
export function DataValue({ fieldKey, withUnit = true }: { fieldKey: string; withUnit?: boolean }) {
  const f = useField(fieldKey);
  return (
    <span
      className={`dv dv--${f.status}`}
      title={f.status === 'illustrative' ? 'Illustrativer Beispielwert, noch nicht aus einer Datenquelle' : undefined}
    >
      {formatValue(f, withUnit)}
    </span>
  );
}

const TONE_ICON: Partial<Record<Tone, IconName>> = { ok: 'check', warn: 'clock', open: 'close' };

export function Badge({ tone = 'neutral', icon, children }: { tone?: Tone; icon?: IconName; children: React.ReactNode }) {
  return (
    <span className={`badge badge--${tone}`}>
      {icon ? <Icon name={icon} size={13} /> : null}
      {children}
    </span>
  );
}

/** Statusbadge aus einem Feld; `withIcon` ergänzt ein zum Ton passendes Symbol. */
export function FieldBadge({ fieldKey, withIcon = false }: { fieldKey: string; withIcon?: boolean }) {
  const f = useField(fieldKey);
  const tone = f.tone ?? 'neutral';
  return (
    <Badge tone={tone} icon={withIcon ? TONE_ICON[tone] : undefined}>
      {formatValue(f)}
    </Badge>
  );
}
