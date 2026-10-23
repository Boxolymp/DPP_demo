import type { IconName } from '../components/ui/Icon';
import { createContent, fld, link } from './builder';

const c = createContent();

interface FlowRow { id: string; title: string; icon: IconName; sub: string; summary: string }
const flow: FlowRow[] = [
  { id: 'field', title: 'Fahrzeug im Feld', icon: 'car', sub: 'Nutzungsdaten & Feedback', summary: 'Das Batteriemanagementsystem (BMS) im Fahrzeug liefert Nutzungs- und Zustandsdaten, Kunden und Werkstätten liefern Rückmeldungen.' },
  { id: 'analysis', title: 'Datenanalyse', icon: 'chart', sub: 'Muster erkennen, Qualität sichern', summary: 'Daten werden analysiert, um Muster, Auffälligkeiten und Qualitätsrisiken früh zu erkennen.' },
  { id: 'engineering', title: 'Engineering / PLM', icon: 'gear', sub: 'Verbesserungen in die Produktentwicklung', summary: 'Erkenntnisse fließen als Änderungsanforderung in die Entwicklung zurück und führen zu einer neuen Produktrevision.' },
];
export const aftersalesFlowIds = c.group('aftersales.flow', flow, (r, id) => ({
  title: r.title,
  icon: r.icon,
  summary: r.summary,
  fields: [fld(`${id}.sub`, 'Rolle im Kreislauf', r.sub)],
}));

c.add('aftersales.featured', {
  title: 'Ausgewählter Use Case: Field Feedback',
  summary: 'Nutzungsdaten und Kundenfeedback aus dem Feld erfassen, analysieren und für Produktverbesserungen nutzen.',
  fields: [
    fld('aftersales.event.temp', 'Unerwarteter Temperaturanstieg', 'Fahrzeug · vor 2 Tagen', { src: 'BMS / IoT', tone: 'open' }),
    fld('aftersales.event.range', 'Hinweis auf reduzierte Reichweite', 'Werkstatt · vor 5 Tagen', { src: 'Service / CRM', tone: 'warn' }),
    fld('aftersales.event.feedback', 'Kundenfeedback: Ladeverhalten', 'App · vor 1 Woche', { src: 'Service / CRM' }),
  ],
});

interface UseCaseRow { id: string; title: string; icon: IconName; sub: string; summary: string; src: string }
const recognize: UseCaseRow[] = [
  { id: 'feedback', title: 'Field Feedback', icon: 'pulse', sub: 'Nutzungsdaten & Kundenfeedback', summary: 'Rückmeldungen aus dem Feld werden gesammelt und klassifiziert.', src: 'BMS / CRM' },
  { id: 'soh', title: 'Batteriegesundheit (SoH)', icon: 'battery', sub: 'Zustand & Alterungsverhalten', summary: 'Der State of Health beschreibt den Alterungszustand. Er braucht eine reale Serien- und Telemetrieanbindung.', src: 'BMS / IoT' },
  { id: 'fake', title: 'Fälschungsprüfung', icon: 'search', sub: 'Originalität & Plagiatserkennung', summary: 'Über den Produktpass lässt sich die Echtheit einer Batterie prüfen.', src: 'DPP' },
  { id: 'predictive', title: 'Predictive Maintenance', icon: 'chart', sub: 'Ausfälle vorhersagen und vermeiden', summary: 'Aus Telemetrie werden Ausfälle prognostiziert, bevor sie auftreten.', src: 'BMS / IoT' },
  { id: 'recall', title: 'Rückruf- & Risikoerkennung', icon: 'shield', sub: 'Sicherheitsrisiken erkennen', summary: 'Betroffene Chargen und Seriennummern lassen sich gezielt eingrenzen.', src: 'Qualität / DPP' },
];
const act: UseCaseRow[] = [
  { id: 'order', title: 'Ersatzteilbestellung', icon: 'box', sub: 'Passende Teile schnell identifizieren', summary: 'Über die Stückliste werden passende Ersatzteile gefunden.', src: 'PLM / Servicekatalog' },
  { id: 'compat', title: 'Kompatibilitätsprüfung', icon: 'link', sub: 'Teile, Software & Fahrzeuge prüfen', summary: 'Prüft, ob ein Teil zu Produktrevision und Seriennummer passt.', src: 'PLM' },
  { id: 'repair', title: 'Digitale Reparaturanleitungen', icon: 'doc', sub: 'Schritt für Schritt zur sicheren Reparatur', summary: 'Freigegebene Anleitungen je Produktrevision und Sprache.', src: 'PLM / DMS' },
  { id: 'warranty', title: 'Garantie & Service', icon: 'shield', sub: 'Ansprüche prüfen und Serviceprozesse', summary: 'Garantiebedingungen und Serviceprozesse je Seriennummer und Markt.', src: 'Service / CRM' },
  { id: 'history', title: 'Servicehistorie', icon: 'clock', sub: 'Alle Eingriffe und Ereignisse im Lebenslauf', summary: 'Lückenlose Historie von Reparaturen und Ereignissen.', src: 'Service / CRM' },
];
const improve: UseCaseRow[] = [
  { id: 'f2d', title: 'Field-to-Design Feedback', icon: 'gear', sub: 'Feldwissen in Produktentwicklung', summary: 'Feldbeobachtungen führen zu Änderungsanforderungen im Engineering.', src: 'PLM' },
  { id: 'secondlife', title: 'Second Life / Remanufacturing', icon: 'recycle', sub: 'Zweiten Lebenszyklus ermöglichen', summary: 'Bewertet, ob eine Batterie weiterverwendet oder aufgearbeitet werden kann.', src: 'BMS / PLM' },
  { id: 'residual', title: 'Restwertbewertung', icon: 'chart', sub: 'Transparente Bewertung für neue Geschäftsmodelle', summary: 'Der Restwert ergibt sich aus Zustand, Materialien und Nachfrage.', src: 'BMS / DPP' },
  { id: 'recycling', title: 'Recycling-Optimierung', icon: 'leaf', sub: 'Rückführung effizient und nachhaltig gestalten', summary: 'Verbessert Demontage und Rückgewinnung mit Materialdaten aus dem Pass.', src: 'DPP / Logistik' },
];
function useCaseGroup(name: string, rows: UseCaseRow[]) {
  return c.group(`aftersales.${name}`, rows, (r, id) => ({
    title: r.title,
    icon: r.icon,
    summary: r.summary,
    fields: [
      fld(`${id}.sub`, 'Worum es geht', r.sub),
      fld(`${id}.status`, 'Anbindung', undefined, {
        src: r.src,
        desc: 'Ohne reale Serien- und Quellenanbindung bleibt dieser Use Case ein Einstieg ohne Daten („nicht angebunden“).',
      }),
    ],
    related: [link('Produkt in der OEM-Sicht', 'oem')],
  }));
}
export const aftersalesGroups = {
  recognize: useCaseGroup('recognize', recognize),
  act: useCaseGroup('act', act),
  improve: useCaseGroup('improve', improve),
};

const sources = [
  { id: 'dpp', title: 'DPP' },
  { id: 'bms', title: 'BMS' },
  { id: 'plm', title: 'PLM' },
  { id: 'quality', title: 'Qualität' },
  { id: 'logistics', title: 'Logistik' },
];
export const aftersalesSourceIds = c.group('aftersales.source', sources, (r, id) => ({
  title: r.title,
  summary: 'Die Use Cases kombinieren DPP-Daten mit Service-, BMS-, PLM-, Qualitäts- und Logistikdaten. Hier erscheint später der echte Verbindungsstatus mit letztem Synchronisierungszeitpunkt.',
  fields: [fld(`${id}.status`, 'Verbindung', undefined, { src: r.title })],
  related: [link('CO₂ & Scopes (Datenfluss)', 'footprint')],
}));

export const aftersalesContent = { fields: c.fields, sections: c.sections };
export const aftersalesEventKeys = ['aftersales.event.temp', 'aftersales.event.range', 'aftersales.event.feedback'];
