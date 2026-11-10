import { useState, type CSSProperties } from 'react';
import { useDrawer } from '../../app/providers/DrawerProvider';
import { DataValue, formatValue } from '../../components/ui/DataValue';
import { Icon } from '../../components/ui/Icon';
import { FieldMetric, PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { Tile } from '../../components/ui/Tile';
import {
  footprintDefaultStageId,
  footprintSemanticIds,
  footprintSourceIds,
  footprintStages,
  scopeLegend,
} from '../../content/footprint';
import { useField, useFields, useSection } from '../../hooks/useContent';

type Mode = 'scopes' | 'pcf';
type Tab = 'flow' | 'semantic' | 'impact';

const RULE_KEYS = ['footprint.rules.phase', 'footprint.rules.pcf', 'footprint.rules.dpp'];

/** Ausschnitt `index` aus dem Prozesspanorama (eine Spalte je Lebenszyklusphase). */
const slice = (index: number) => ({ '--i': index }) as CSSProperties;

function RuleRow({ fieldKey }: { fieldKey: string }) {
  const f = useField(fieldKey);
  const known = f.value !== undefined;
  return (
    <li className="rule">
      <span className="rule__label">{f.label}</span>
      <span className={`rule__value ${known ? 'rule__value--ok' : ''}`}>
        <Icon name={known ? 'check' : 'clock'} size={16} />
        {formatValue(f, false)}
      </span>
    </li>
  );
}

/** Scope-Anteil einer Phase als Zeile mit Balken; öffnet das Feld im Drawer. */
function ScopeShare({ fieldKey, scope }: { fieldKey: string; scope: number }) {
  const f = useField(fieldKey);
  const { openField } = useDrawer();
  const pct = typeof f.value === 'number' ? f.value : 0;
  return (
    <li>
      <button type="button" className="scope-share" onClick={() => openField(fieldKey)}>
        <span className={`dot dot--s${scope}`} />
        <span className="scope-share__label">Scope {scope}</span>
        <span className="scope-share__track" aria-hidden="true">
          <span className={`scope-share__fill scope-share__fill--s${scope}`} style={{ width: `${pct}%` }} />
        </span>
        <span className="scope-share__value"><DataValue fieldKey={fieldKey} /></span>
      </button>
    </li>
  );
}

function StageCard({ stageId, index, hasResult, mode, onXray }: { stageId: string; index: number; hasResult: boolean; mode: Mode; onXray: () => void }) {
  const s = useSection(stageId);
  return (
    <SectionCard id={stageId} stretch={false} className="stage-card">
      <div className="stage-card__main">
        <span className="stage-card__img stage-slice" style={slice(index)} aria-hidden="true" />
        <div className="stage-card__body">
          <h2>{s.title}</h2>
          <p className="muted small"><DataValue fieldKey={`${stageId}.what`} /></p>
          {mode === 'scopes' ? (
            <ul className="scope-shares">
              {scopeLegend.map((l) => (
                <ScopeShare key={l.id} fieldKey={`${stageId}.scope${l.id}`} scope={l.id} />
              ))}
            </ul>
          ) : hasResult ? (
            <div className="metrics metrics--1">
              <FieldMetric fieldKey="footprint.result.total" />
            </div>
          ) : (
            <p className="empty">Für diese Phase liegen noch keine Beispieldaten für den Produkt-CO₂-Fußabdruck vor.</p>
          )}
        </div>
        <div className="stage-card__aside">
          <p className="small">{s.summary}</p>
          <button type="button" className="btn btn--primary" onClick={onXray}>
            Daten-Röntgenblick öffnen <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

/** Ring aus den Scope-Anteilen der Phase; nur bei vollständigen Zahlenwerten mit Summe > 0. */
function ScopeDonut({ stageId }: { stageId: string }) {
  const fields = useFields(scopeLegend.map((l) => `${stageId}.scope${l.id}`));
  const values = fields.map((f) => (typeof f.value === 'number' ? f.value : NaN));
  const sum = values.reduce((a, b) => a + b, 0);
  if (!(sum > 0)) return null;
  const r = 15.915; // Umfang 100, damit Anteile direkt als Strichlänge dienen
  let offset = 0;
  return (
    <svg className="donut" viewBox="0 0 42 42" aria-hidden="true">
      {values.map((v, i) => {
        const len = (v / sum) * 100;
        const seg = (
          <circle
            key={fields[i].key}
            className={`donut__seg donut__seg--s${scopeLegend[i].id}`}
            cx="21" cy="21" r={r}
            strokeDasharray={`${Math.max(len - 1.2, 0)} ${100 - Math.max(len - 1.2, 0)}`}
            strokeDashoffset={25 - offset}
          >
            <title>{`${scopeLegend[i].title}: ${formatValue(fields[i])}`}</title>
          </circle>
        );
        offset += len;
        return seg;
      })}
    </svg>
  );
}

function ResultLegendRow({ stageId, scope }: { stageId: string; scope: number }) {
  const { openField } = useDrawer();
  return (
    <li>
      <button type="button" className="result-legend__row" onClick={() => openField(`footprint.result.s${scope}`)}>
        <span className={`dot dot--s${scope}`} />
        <span>Scope {scope}</span>
        <span className="muted"><DataValue fieldKey={`${stageId}.scope${scope}`} /></span>
        <strong><DataValue fieldKey={`footprint.result.s${scope}`} /></strong>
      </button>
    </li>
  );
}

/** Gestapelter Balken der Scope-Anteile einer Phase; ohne Zahlenwerte bleibt nur die leere Spur. */
function StageShareBar({ stageId }: { stageId: string }) {
  const fields = useFields(scopeLegend.map((l) => `${stageId}.scope${l.id}`));
  const known = fields.every((f) => typeof f.value === 'number');
  return (
    <span className="stage-band__bar" aria-hidden="true">
      {known
        ? fields.map((f, i) => (
            <span key={f.key} className={`stage-band__seg scope-share__fill--s${scopeLegend[i].id}`} style={{ flexGrow: f.value as number }} />
          ))
        : null}
    </span>
  );
}

function StageButton({ stageId, index, active, onSelect }: { stageId: string; index: number; active: boolean; onSelect: () => void }) {
  const s = useSection(stageId);
  return (
    <button type="button" className="stage-band__item" aria-pressed={active} onClick={onSelect}>
      <span className="stage-band__label">{s.title}</span>
      <span className="stage-band__img" style={slice(index)} aria-hidden="true" />
      <StageShareBar stageId={stageId} />
    </button>
  );
}

/** Schematische Leitungen von den Quellsystemen zur Semantikschicht. */
function SourceLines({ count }: { count: number }) {
  return (
    <svg className="xray__lines" viewBox="0 0 60 100" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const y = ((i + 0.5) / count) * 100;
        return <path key={i} d={`M0 ${y} C 32 ${y}, 28 50, 60 50`} />;
      })}
    </svg>
  );
}

export function FootprintPage() {
  const [mode, setMode] = useState<Mode>('scopes');
  const [stage, setStage] = useState(footprintDefaultStageId);
  const [tab, setTab] = useState<Tab>('flow');
  const stageTitle = useSection(stage).title;
  const stageIndex = Math.max(0, footprintStages.findIndex((s) => s.id === stage));
  const hasResult = footprintStages[stageIndex]?.hasResult ?? false;
  const total = useField('footprint.result.total');

  const openXray = () => {
    setTab('flow');
    document.getElementById('xray')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page">
      <section className="landscape" aria-label="Wertschöpfungskette">
        <div className="landscape__head">
          <PageHero
            title="CO₂ & Scopes"
            strong="entlang der Wertschöpfungskette"
            subtitle="Wo entstehen Emissionen, welche Unternehmens-Scopes sind betroffen und welche Daten fließen in den Batteriepass?"
          />
          <div className="seg seg--dark" role="group" aria-label="Betrachtung">
            <button type="button" aria-pressed={mode === 'scopes'} onClick={() => setMode('scopes')}>Unternehmens-Scopes (1–3)</button>
            <button type="button" aria-pressed={mode === 'pcf'} onClick={() => setMode('pcf')}>Produkt-CO₂ (PCF)</button>
          </div>
        </div>

        <div className="stage-band" role="group" aria-label="Lebenszyklusphase wählen">
          {footprintStages.map((s, i) => (
            <StageButton key={s.id} stageId={s.id} index={i} active={stage === s.id} onSelect={() => setStage(s.id)} />
          ))}
        </div>
      </section>

      <div className="grid-footprint-mid">
        <div className="card">
          <SectionTitle>Unternehmens-Scopes</SectionTitle>
          <ul className="scope-legend">
            {scopeLegend.map((s) => (
              <li key={s.id}>
                <span className={`dot dot--s${s.id}`} />
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </li>
            ))}
          </ul>
          <p className="muted small">
            Scopes gelten für eine Organisation und einen Berichtszeitraum. Ein Scope 1 beim Zulieferer ist beim OEM nicht automatisch Scope 1.
          </p>
        </div>
        <StageCard stageId={stage} index={stageIndex} hasResult={hasResult} mode={mode} onXray={openXray} />
        <SectionCard id="footprint.rules" stretch={false}>
          <SectionTitle>Relevanz für den Batteriepass (PCF)</SectionTitle>
          <ul className="rules">
            {RULE_KEYS.map((k) => (
              <RuleRow key={k} fieldKey={k} />
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="card xray-card" id="xray">
        <div className="card__head">
          <div className="xray-card__title">
            <span className="xray-card__icon"><Icon name="search" size={20} /></span>
            <SectionTitle sub="Welche Daten sind erforderlich, woher kommen sie und wie werden sie für den Batteriepass aufbereitet?">
              Daten-Röntgenblick – {stageTitle}
            </SectionTitle>
          </div>
          <div className="seg" role="group" aria-label="Ansicht">
            <button type="button" aria-pressed={tab === 'flow'} onClick={() => setTab('flow')}>Datenfluss</button>
            <button type="button" aria-pressed={tab === 'semantic'} onClick={() => setTab('semantic')}>Semantik & Mapping</button>
            <button type="button" aria-pressed={tab === 'impact'} onClick={() => setTab('impact')}>Auswirkungen</button>
          </div>
        </div>

        {tab === 'flow' ? (
          <div className="xray">
            <h3 className="xray__h xray__h--sources">
              Quellsysteme & Daten
              <span>Schematisch, keine Connectoren angebunden</span>
            </h3>
            <div className="xray__sources stack">
              {footprintSourceIds.map((id) => (
                <Tile key={id} id={id} fieldKey={`${id}.data`} />
              ))}
            </div>
            <SourceLines count={footprintSourceIds.length} />

            <div className="xray__semantic">
              <div className="semantic-layer__head">
                <span className="xray-card__icon"><Icon name="link" size={18} /></span>
                <span>
                  <strong>Semantik- und Integrationsschicht</strong>
                  <span className="muted small">Einheitliche Datenstrukturen, Bedeutungen und Beziehungen</span>
                </span>
              </div>
              <div className="stack">
                {footprintSemanticIds.map((id) => (
                  <Tile key={id} id={id} fieldKey={`${id}.data`} />
                ))}
              </div>
            </div>
            <div className="xray__arrow xray__arrow--1" aria-hidden="true"><Icon name="arrow" size={26} /></div>

            <div className="xray__result">
              {hasResult ? (
                <SectionCard id="footprint.result" stretch={false} className="result-card">
                  <h3>Ergebnis für den Batteriepass (PCF)</h3>
                  <p className="muted small">{total.label}</p>
                  <p className="big-number"><DataValue fieldKey="footprint.result.total" withUnit={false} /> <span className="big-number__unit">{total.unit}</span></p>
                  <div className="result-card__split">
                    <ScopeDonut stageId={stage} />
                    <ul className="result-legend">
                      {scopeLegend.map((l) => (
                        <ResultLegendRow key={l.id} stageId={stage} scope={l.id} />
                      ))}
                    </ul>
                  </div>
                  <div className="result-card__phase">
                    <strong className="small">Beitrag zur Lebenszyklusphase</strong>
                    <span><Icon name="check" size={16} /> <DataValue fieldKey="footprint.result.phase" /></span>
                  </div>
                </SectionCard>
              ) : (
                <p className="empty">Für diese Phase liegen noch keine Beispieldaten vor. Der Ablauf ist derselbe wie bei der Zellfertigung.</p>
              )}
            </div>
            <div className="xray__arrow xray__arrow--2" aria-hidden="true"><Icon name="arrow" size={22} /></div>

            <SectionCard id="footprint.output" stretch={false} className="xray__dpp">
              <h3>Einfluss auf den Digitalen Batteriepass</h3>
              <div className="dpp-mini">
                <span className="dpp-mini__head"><Icon name="battery" size={20} /> Battery Passport</span>
                <span className="small"><strong>CO₂-Fußabdruck</strong></span>
                <span className="muted small">nach Lebenszyklusphasen</span>
                <span className="small"><DataValue fieldKey="footprint.output.co2" /></span>
              </div>
            </SectionCard>
          </div>
        ) : null}

        {tab === 'semantic' ? (
          <div className="grid-tiles grid-tiles--4">
            {footprintSemanticIds.map((id) => (
              <Tile key={id} id={id} fieldKey={`${id}.data`} className="tile--vertical" />
            ))}
          </div>
        ) : null}

        {tab === 'impact' ? (
          <div className="grid-tiles grid-tiles--2">
            <Tile id="footprint.output" fieldKey="footprint.output.co2" />
            <Tile id="oem.lifecycle" fieldKey="oem.lifecycle.total" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
