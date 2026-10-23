import type { IconName } from '../components/ui/Icon';
import type { PageId } from '../lib/pages';

/** Status eines Datenfelds. `live` kommt erst mit der Datenanbindung (Phase 2). */
export type FieldStatus = 'illustrative' | 'unavailable' | 'live';

/** Farbton für Statusanzeigen (Badges, Fortschrittsbalken). */
export type Tone = 'ok' | 'warn' | 'open' | 'neutral';

export interface RelatedLink {
  label: string;
  /** Zielseite; der Pfad wird beim Öffnen mit dem aktiven Produkt gebildet. */
  page: PageId;
}

export interface DataField {
  /** Stabiler semantischer Schlüssel, z. B. "oem.product.mass". */
  key: string;
  label: string;
  value?: string | number;
  unit?: string;
  status: FieldStatus;
  /** Führendes System, aus dem das Feld später kommt (PLM, ERP, ...). */
  sourceHint?: string;
  /** Erklärung für den Detail-Drawer. */
  description?: string;
  tone?: Tone;
  related?: RelatedLink[];
}

/** Ein klickbarer Bereich einer Seite. */
export interface Section {
  id: string;
  title: string;
  /** Zusatz zum Titel, z. B. die ausgeschriebene Abkürzung. */
  subtitle?: string;
  summary: string;
  icon?: IconName;
  fieldKeys: string[];
  related: RelatedLink[];
}
