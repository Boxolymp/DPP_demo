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

export function createContent() {
  const fields: DataField[] = [];
  const sections: Section[] = [];
  return {
    fields,
    sections,
    add(
      id: string,
      title: string,
      summary: string,
      defs: DataField[],
      related: RelatedLink[] = [],
    ) {
      fields.push(...defs);
      sections.push({ id, title, summary, fieldKeys: defs.map((d) => d.key), related });
    },
  };
}

export const link = (label: string, to: string): RelatedLink => ({ label, to });

export const PAGES = {
  oem: '/products/:productId/oem',
  customer: '/products/:productId/customer',
  supplier: '/products/:productId/supplier',
  footprint: '/products/:productId/footprint',
  aftersales: '/products/:productId/aftersales',
} as const;
