import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDrawer } from '../../app/providers/DrawerProvider';
import { fieldRegistry } from '../../content';
import { useField, useProductId, useSection } from '../../hooks/useContent';
import { resolvePath } from '../../lib/paths';
import type { DataField, RelatedLink } from '../../types/content';
import { Badge, formatValue, STATUS_LABEL } from '../ui/DataValue';
import { Icon } from '../ui/Icon';

function FieldRow({ f }: { f: DataField }) {
  return (
    <li className="drawer__field">
      <div className="drawer__field-head">
        <span className="drawer__field-label">{f.label}</span>
        <Badge tone={f.status === 'unavailable' ? 'open' : f.status === 'live' ? 'ok' : 'neutral'}>
          {STATUS_LABEL[f.status]}
        </Badge>
      </div>
      <div className="drawer__field-value">{formatValue(f)}</div>
      <dl className="drawer__meta">
        <div>
          <dt>Schlüssel</dt>
          <dd><code>{f.key}</code></dd>
        </div>
        {f.sourceHint ? (
          <div>
            <dt>Führende Quelle</dt>
            <dd>{f.sourceHint}</dd>
          </div>
        ) : null}
      </dl>
      {f.description ? <p className="drawer__desc">{f.description}</p> : null}
    </li>
  );
}

function SectionBody({ id }: { id: string }) {
  const s = useSection(id);
  const fields = s.fieldKeys.map((k) => fieldRegistry.get(k)).filter((f): f is DataField => Boolean(f));
  return (
    <>
      <h2 id="drawer-title">{s.title}</h2>
      <p className="drawer__summary">{s.summary}</p>
      {fields.length > 0 ? (
        <>
          <h3>Datenfelder</h3>
          <ul className="drawer__fields">
            {fields.map((f) => (
              <FieldRow key={f.key} f={f} />
            ))}
          </ul>
        </>
      ) : null}
      <Related links={s.related} />
    </>
  );
}

function FieldBody({ fieldKey }: { fieldKey: string }) {
  const f = useField(fieldKey);
  return (
    <>
      <h2 id="drawer-title">{f.label}</h2>
      <ul className="drawer__fields">
        <FieldRow f={f} />
      </ul>
      <Related links={f.related ?? []} />
    </>
  );
}

function Related({ links }: { links: RelatedLink[] }) {
  const productId = useProductId();
  const { close } = useDrawer();
  if (links.length === 0) return null;
  return (
    <>
      <h3>Verwandte Ansichten</h3>
      <ul className="drawer__links">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link to={resolvePath(l.to, productId)} onClick={close}>
              {l.label} <Icon name="arrow" size={16} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function EntityDrawer() {
  const { target, close } = useDrawer();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!target) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      returnFocus.current?.focus?.();
    };
  }, [target, close]);

  if (!target) return null;

  return (
    <div className="drawer-root">
      <div className="drawer-backdrop" onClick={close} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer__top">
          <span className="drawer__kicker">Details</span>
          <button ref={closeRef} type="button" className="icon-btn" onClick={close} aria-label="Schließen">
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer__body">
          {target.type === 'section' ? <SectionBody id={target.id} /> : <FieldBody fieldKey={target.key} />}
        </div>
        <p className="drawer__note">
          Demonstrator: Werte sind illustrativ. Die Datenanbindung folgt in Phase 2.
        </p>
      </aside>
    </div>
  );
}
