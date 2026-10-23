import type { IconName } from '../components/ui/Icon';
import type { PageId } from '../lib/pages';
import type { DataField, RelatedLink, Section, Tone } from '../types/content';

interface FieldOptions {
  unit?: string;
  src?: string;
  desc?: string;
  tone?: Tone;
  related?: RelatedLink[];
}

/** Ohne Wert ist das Feld `unavailable`, sonst `illustrative`. */
export function fld(
  key: string,
  label: string,
  value?: string | number,
  o: FieldOptions = {},
): DataField {
  return {
    key,
    label,
    value,
    unit: o.unit,
    status: value === undefined ? 'unavailable' : 'illustrative',
    sourceHint: o.src,
    description: o.desc,
    tone: o.tone,
    related: o.related,
  };
}

export const link = (label: string, page: PageId): RelatedLink => ({ label, page });

export interface SectionDef {
  title: string;
  subtitle?: string;
  summary: string;
  icon?: IconName;
  fields: DataField[];
  related?: RelatedLink[];
}

export function createContent() {
  const fields: DataField[] = [];
  const sections: Section[] = [];

  function add(id: string, def: SectionDef) {
    const { fields: defs, related = [], ...rest } = def;
    fields.push(...defs);
    sections.push({ id, ...rest, fieldKeys: defs.map((d) => d.key), related });
  }

  return {
    fields,
    sections,
    add,
    /** Legt je Zeile eine Sektion `prefix.id` an und gibt deren IDs in Zeilenreihenfolge zurück. */
    group<R extends { id: string }>(prefix: string, rows: R[], make: (row: R, id: string) => SectionDef): string[] {
      return rows.map((row) => {
        const id = `${prefix}.${row.id}`;
        add(id, make(row, id));
        return id;
      });
    },
  };
}
