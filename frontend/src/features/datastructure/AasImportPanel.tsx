import { useState, type ChangeEvent } from 'react';
import { Badge } from '../../components/ui/DataValue';
import { useAasSession } from '../../hooks/useContent';
import type { ImportResult } from '../../lib/aas/session';

function ResultItem({ r }: { r: ImportResult }) {
  return (
    <li>
      <strong>{r.fileName}:</strong>{' '}
      {r.error ? (
        <span className="ds-import__error">{r.error}</span>
      ) : (
        <>
          {r.accepted.length > 0
            ? `${r.accepted.length} übernommen (${r.accepted
                .map((a) => `${a.name}${a.replaced ? ', ersetzt' : ''}${a.match === 'idShort-fallback' ? ', nur idShort-Fallback' : ''}`)
                .join('; ')})`
            : 'kein Teilmodell übernommen'}
          {r.shellLoaded ? ' · AAS-Shell übernommen' : ''}
          {r.rejected.length > 0 ? (
            <ul className="ds-import__rejected">
              {r.rejected.map((x, i) => (
                <li key={i}>
                  Abgelehnt: {x.label}, {x.reason}
                </li>
              ))}
            </ul>
          ) : null}
          {!r.stored ? <span className="ds-import__error"> Tab-Speicher nicht verfügbar: Daten gelten nur bis zum Neuladen.</span> : null}
        </>
      )}
    </li>
  );
}

/** Lädt AAS-Teilmodelle (JSON) nur in diesen Browser-Tab; Schließen des Tabs löscht alles. */
export function AasImportPanel() {
  const { entries, shell, importFiles, loadExample, clear } = useAasSession();
  const [results, setResults] = useState<ImportResult[]>([]);
  const [busy, setBusy] = useState(false);
  const hasData = entries.length > 0 || shell !== null;

  async function run(task: () => Promise<ImportResult[]>) {
    setBusy(true);
    try {
      setResults(await task());
    } catch {
      setResults([{ fileName: 'Laden', accepted: [], rejected: [], shellLoaded: false, stored: true, error: 'Die Daten konnten nicht gelesen werden.' }]);
    } finally {
      setBusy(false);
    }
  }

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length > 0) void run(() => importFiles(files));
  }

  return (
    <section className="card ds-import" aria-labelledby="ds-import-title">
      <div className="card__head">
        <h2 id="ds-import-title">AAS-Teilmodelle laden</h2>
      </div>
      <p className="muted small">
        JSON nach AAS 3.x: Umgebung, einzelnes Teilmodell oder Shell. Angenommen werden nur die sieben IDTA-02035-Batterie-Teilmodelle; ein
        erneut geladenes Teilmodell ersetzt das vorhandene derselben Domäne. Die Daten bleiben nur in diesem Browser-Tab, werden nicht an einen
        Server übertragen und beim Schließen des Tabs gelöscht.
      </p>
      <div className="ds-import__actions">
        <label className={`btn btn--primary ds-import__file${busy ? ' is-busy' : ''}`}>
          <input type="file" accept=".json,application/json" multiple className="sr-only" onChange={onFiles} disabled={busy} />
          JSON-Datei auswählen
        </label>
        <button type="button" className="btn" onClick={() => void run(async () => [await loadExample()])} disabled={busy}>
          Beispiel laden
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            clear();
            setResults([]);
          }}
          disabled={busy || !hasData}
        >
          Import verwerfen
        </button>
      </div>

      <div aria-live="polite">
        {busy ? <p className="small muted">Wird gelesen …</p> : null}
        {results.length > 0 ? (
          <ul className="ds-import__results small">
            {results.map((r, i) => (
              <ResultItem key={i} r={r} />
            ))}
          </ul>
        ) : null}
      </div>

      {hasData ? (
        <div>
          <h3>In diesem Tab geladen</h3>
          <ul className="ds-import__loaded small">
            {shell ? (
              <li>
                <span>AAS-Shell · {shell.fileName}</span>
                <Badge tone={shell.origin === 'import' ? 'warn' : 'neutral'}>{shell.origin === 'import' ? 'Importiert' : 'Beispiel'}</Badge>
              </li>
            ) : null}
            {entries.map((e) => (
              <li key={e.domain}>
                <span>
                  {e.name} ({e.domain}) · {e.fileName}
                </span>
                <Badge tone={e.origin === 'import' ? 'warn' : 'neutral'}>{e.origin === 'import' ? 'Importiert' : 'Beispiel'}</Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="small muted">Noch nichts geladen: Alle Werte sind „nicht verfügbar“.</p>
      )}
    </section>
  );
}
