import { useState } from 'react';
import { Icon, type IconName } from '../../components/ui/Icon';
import { FieldMetric, PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { Tile } from '../../components/ui/Tile';
import {
  footprintSemanticIds,
  footprintSourceIds,
  footprintStages,
  scopeLegend,
} from '../../content/footprint';
import { useField, useSection } from '../../hooks/useContent';

type Mode = 'scopes' | 'pcf';
type Tab = 'flow' | 'semantic' | 'impact';

const STAGE_ICONS: IconName[] = ['box', 'factory', 'battery', 'gear', 'box', 'truck', 'car', 'recycle'];
const SOURCE_ICONS: IconName[] = ['doc', 'gear', 'leaf', 'box', 'truck'];
const SEMANTIC_ICONS: IconName[] = ['link', 'doc', 'chart', 'shield'];

function StageCard({ stageId, mode, onXray }: { stageId: string; mode: Mode; onXray: () => void }) {
  const s = useSection(stageId);
  const isCell = stageId === 'footprint.stage.cell';
  return (
    <SectionCard id={stageId} stretch={false} className="stage-card">
      <h2>{s.title}</h2>
      <p className="muted">{s.summary}</p>
      {mode === 'scopes' ? (
        <div className="metrics metrics--3">
          <FieldMetric fieldKey={`${stageId}.scope1`} />
          <FieldMetric fieldKey={`${stageId}.scope2`} />
          <FieldMetric fieldKey={`${stageId}.scope3`} />
        </div>
      ) : isCell ? (
        <div className="metrics metrics--1">
          <FieldMetric fieldKey="footprint.result.total" />
        </div>
      ) : (
        <p className="empty">Für diese Phase liegen noch keine Beispieldaten für den Produkt-CO₂-Fußabdruck vor.</p>
      )}
      <button type="button" className="btn btn--primary" onClick={onXray}>
        Daten-Röntgenblick öffnen <Icon name="arrow" size={16} />
      </button>
    </SectionCard>
  );
}

export function FootprintPage() {
  const [mode, setMode] = useState<Mode>('scopes');
  const [stage, setStage] = useState(footprintStages[2].id);
  const [tab, setTab] = useState<Tab>('flow');
  const stageTitle = useSection(stage).title;
  const hasResult = stage === 'footprint.stage.cell';
  const total = useField('footprint.result.total');

  const openXray = () => {
    setTab('flow');
    document.getElementById('xray')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page">
      <div className="hero hero--split">
        <PageHero
          title="CO₂ & Scopes"
          strong="entlang der Wertschöpfungskette"
          subtitle="Wo entstehen Emissionen, welche Unternehmens-Scopes sind betroffen und welche Daten fließen in den Batteriepass?"
        />
        <div className="seg" role="group" aria-label="Betrachtung">
          <button type="button" aria-pressed={mode === 'scopes'} onClick={() => setMode('scopes')}>Unternehmens-Scopes (1–3)</button>
          <button type="button" aria-pressed={mode === 'pcf'} onClick={() => setMode('pcf')}>Produkt-CO₂ (PCF)</button>
        </div>
      </div>

      <div className="stage-band" role="group" aria-label="Lebenszyklusphase wählen">
        {footprintStages.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className="stage-band__item"
            aria-pressed={stage === s.id}
            onClick={() => setStage(s.id)}
          >
            <Icon name={STAGE_ICONS[i]} size={22} />
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      <div className="grid-footprint-mid">
        <div className="card">
          <SectionTitle>Unternehmens-Scopes</SectionTitle>
          <ul className="scope-legend">
            {scopeLegend.map((s) => (
              <li key={s.id}>
                <span className={`dot dot--s${s.id}`} />
                <strong>{s.title}</strong> {s.text}
              </li>
            ))}
          </ul>
          <p className="muted small">
            Scopes gelten für eine Organisation und einen Berichtszeitraum. Ein Scope 1 beim Zulieferer ist beim OEM nicht automatisch Scope 1.
          </p>
        </div>
        <StageCard stageId={stage} mode={mode} onXray={openXray} />
        <SectionCard id="footprint.rules" stretch={false}>
          <SectionTitle>Relevanz für den Batteriepass (PCF)</SectionTitle>
          <ul className="fieldlist">
            {['footprint.rules.phase', 'footprint.rules.pcf', 'footprint.rules.dpp'].map((k) => (
              <RuleRow key={k} fieldKey={k} />
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="card" id="xray">
        <div className="card__head">
          <SectionTitle sub="Welche Daten sind erforderlich, woher kommen sie und wie werden sie für den Batteriepass aufbereitet?">
            Daten-Röntgenblick: {stageTitle}
          </SectionTitle>
          <div className="seg" role="group" aria-label="Ansicht">
            <button type="button" aria-pressed={tab === 'flow'} onClick={() => setTab('flow')}>Datenfluss</button>
            <button type="button" aria-pressed={tab === 'semantic'} onClick={() => setTab('semantic')}>Semantik & Mapping</button>
            <button type="button" aria-pressed={tab === 'impact'} onClick={() => setTab('impact')}>Auswirkungen</button>
          </div>
        </div>

        {tab === 'flow' ? (
          <div className="xray">
            <div>
              <h3>Quellsysteme & Daten</h3>
              <div className="stack">
                {footprintSourceIds.map((id, i) => (
                  <Tile key={id} id={id} icon={SOURCE_ICONS[i]} fieldKey={`${id}.data`} />
                ))}
              </div>
            </div>
            <div className="xray__arrow" aria-hidden="true"><Icon name="arrow" size={28} /></div>
            <div>
              <h3>Semantik- und Integrationsschicht</h3>
              <div className="stack">
                {footprintSemanticIds.map((id, i) => (
                  <Tile key={id} id={id} icon={SEMANTIC_ICONS[i]} fieldKey={`${id}.data`} />
                ))}
              </div>
            </div>
            <div className="xray__arrow" aria-hidden="true"><Icon name="arrow" size={28} /></div>
            <div>
              <h3>Ergebnis für den Batteriepass</h3>
              {hasResult ? (
                <SectionCard id="footprint.result" stretch={false}>
                  <p className="muted small">CO₂-Fußabdruck pro kWh Zellkapazität</p>
                  <p className="big-number">{total.value} <span>{total.unit}</span></p>
                  <div className="metrics metrics--3">
                    <FieldMetric fieldKey="footprint.result.s1" />
                    <FieldMetric fieldKey="footprint.result.s2" />
                    <FieldMetric fieldKey="footprint.result.s3" />
                  </div>
                </SectionCard>
              ) : (
                <p className="empty">Für diese Phase liegen noch keine Beispieldaten vor. Der Ablauf ist derselbe wie bei der Zellfertigung.</p>
              )}
            </div>
          </div>
        ) : null}

        {tab === 'semantic' ? (
          <div className="grid-tiles grid-tiles--4">
            {footprintSemanticIds.map((id, i) => (
              <Tile key={id} id={id} icon={SEMANTIC_ICONS[i]} fieldKey={`${id}.data`} className="tile--vertical" />
            ))}
          </div>
        ) : null}

        {tab === 'impact' ? (
          <div className="grid-tiles grid-tiles--2">
            <Tile id="footprint.output" icon="doc" fieldKey="footprint.output.co2" />
            <Tile id="oem.lifecycle" icon="chart" fieldKey="oem.lifecycle.total" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RuleRow({ fieldKey }: { fieldKey: string }) {
  const f = useField(fieldKey);
  return (
    <li className="fieldlist__static">
      <span className="fieldlist__label">{f.label}</span>
      <span className="fieldlist__value">{f.value === undefined ? 'nicht verfügbar' : String(f.value)}</span>
    </li>
  );
}
