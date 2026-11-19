import { describe, expect, it } from 'vitest';
import { externalLinkProps } from './pages';

describe('externalLinkProps', () => {
  it('liefert für interne Einträge nichts', () => {
    expect(externalLinkProps({ id: 'erp', label: 'ERP' })).toBeUndefined();
  });

  it('öffnet externe Seiten im neuen Tab', () => {
    expect(externalLinkProps({ id: 'x', label: 'X', href: 'https://example.org' })).toEqual({
      href: 'https://example.org',
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  });
});
