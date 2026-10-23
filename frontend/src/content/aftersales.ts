import { createContent, fld, link, PAGES } from './builder';

const c = createContent();

const flow: [string, string, string, string][] = [
  ['field', 'Fahrzeug im Feld', 'Nutzungsdaten & Feedback', 'Das Batteriemanagementsystem (BMS) im Fahrzeug liefert Nutzungs- und Zustandsdaten, Kunden und Werkstätten liefern Rückmeldungen.'],
  ['analysis', 'Datenanalyse', 'Muster erkennen, Qualität sichern', 'Daten werden analysiert, um Muster, Auffälligkeiten und Qualitätsrisiken früh zu erkennen.'],
  ['engineering', 'Engineering / PLM', 'Verbesserungen in die Produktentwicklung', 'Erkenntnisse fließen als Änderungsanforderung in die Entwicklung zurück und führen zu einer neuen Produktrevision.'],
];
for (const [id, title, sub, summary] of flow) {
  c.add(`aftersales.flow.${id}`, title, summary, [fld(`aftersales.flow.${id}.sub`, 'Rolle im Kreislauf', sub)]);
}

c.add(
  'aftersales.featured',
  'Ausgewählter Use Case: Field Feedback',
  'Nutzungsdaten und Kundenfeedback aus dem Feld erfassen, analysieren und für Produktverbesserungen nutzen.',
  [
    fld('aftersales.event.temp', 'Unerwarteter Temperaturanstieg', 'Fahrzeug · vor 2 Tagen', { src: 'BMS / IoT', tone: 'open' }),
    fld('aftersales.event.range', 'Hinweis auf reduzierte Reichweite', 'Werkstatt · vor 5 Tagen', { src: 'Service / CRM', tone: 'warn' }),
    fld('aftersales.event.feedback', 'Kundenfeedback: Ladeverhalten', 'App · vor 1 Woche', { src: 'Service / CRM' }),
  ],
);

type UC = [string, string, string, string, string, string?];
const recognize: UC[] = [
  ['feedback', 'Field Feedback', 'Nutzungsdaten & Kundenfeedback', 'Rückmeldungen aus dem Feld werden gesammelt und klassifiziert.', 'BMS / CRM'],
  ['soh', 'Batteriegesundheit (SoH)', 'Zustand & Alterungsverhalten', 'Der State of Health beschreibt den Alterungszustand. Er braucht eine reale Serien- und Telemetrieanbindung.', 'BMS / IoT'],
  ['fake', 'Fälschungsprüfung', 'Originalität & Plagiatserkennung', 'Über den Produktpass lässt sich die Echtheit einer Batterie prüfen.', 'DPP'],
  ['predictive', 'Predictive Maintenance', 'Ausfälle vorhersagen und vermeiden', 'Aus Telemetrie werden Ausfälle prognostiziert, bevor sie auftreten.', 'BMS / IoT'],
  ['recall', 'Rückruf- & Risikoerkennung', 'Sicherheitsrisiken erkennen', 'Betroffene Chargen und Seriennummern lassen sich gezielt eingrenzen.', 'Qualität / DPP'],
];
const act: UC[] = [
  ['order', 'Ersatzteilbestellung', 'Passende Teile schnell identifizieren', 'Über die Stückliste werden passende Ersatzteile gefunden.', 'PLM / Servicekatalog'],
  ['compat', 'Kompatibilitätsprüfung', 'Teile, Software & Fahrzeuge prüfen', 'Prüft, ob ein Teil zu Produktrevision und Seriennummer passt.', 'PLM'],
  ['repair', 'Digitale Reparaturanleitungen', 'Schritt für Schritt zur sicheren Reparatur', 'Freigegebene Anleitungen je Produktrevision und Sprache.', 'PLM / DMS'],
  ['warranty', 'Garantie & Service', 'Ansprüche prüfen und Serviceprozesse', 'Garantiebedingungen und Serviceprozesse je Seriennummer und Markt.', 'Service / CRM'],
  ['history', 'Servicehistorie', 'Alle Eingriffe und Ereignisse im Lebenslauf', 'Lückenlose Historie von Reparaturen und Ereignissen.', 'Service / CRM'],
];
const improve: UC[] = [
  ['f2d', 'Field-to-Design Feedback', 'Feldwissen in Produktentwicklung', 'Feldbeobachtungen führen zu Änderungsanforderungen im Engineering.', 'PLM', PAGES.oem],
  ['secondlife', 'Second Life / Remanufacturing', 'Zweiten Lebenszyklus ermöglichen', 'Bewertet, ob eine Batterie weiterverwendet oder aufgearbeitet werden kann.', 'BMS / PLM'],
  ['residual', 'Restwertbewertung', 'Transparente Bewertung für neue Geschäftsmodelle', 'Der Restwert ergibt sich aus Zustand, Materialien und Nachfrage.', 'BMS / DPP'],
  ['recycling', 'Recycling-Optimierung', 'Rückführung effizient und nachhaltig gestalten', 'Verbessert Demontage und Rückgewinnung mit Materialdaten aus dem Pass.', 'DPP / Logistik'],
];
const groups: [string, UC[]][] = [['recognize', recognize], ['act', act], ['improve', improve]];
for (const [g, list] of groups) {
  for (const [id, title, sub, summary, src, to] of list) {
    c.add(
      `aftersales.${g}.${id}`,
      title,
      summary,
      [
        fld(`aftersales.${g}.${id}.sub`, 'Worum es geht', sub),
        fld(`aftersales.${g}.${id}.status`, 'Anbindung', undefined, {
          src,
          desc: 'Ohne reale Serien- und Quellenanbindung bleibt dieser Use Case ein Einstieg ohne Daten („nicht angebunden“).',
        }),
      ],
      [link('Produkt in der OEM-Sicht', to ?? PAGES.oem)],
    );
  }
}

const sources: [string, string][] = [
  ['dpp', 'DPP'],
  ['bms', 'BMS'],
  ['plm', 'PLM'],
  ['quality', 'Qualität'],
  ['logistics', 'Logistik'],
];
for (const [id, title] of sources) {
  c.add(
    `aftersales.source.${id}`,
    title,
    'Die Use Cases kombinieren DPP-Daten mit Service-, BMS-, PLM-, Qualitäts- und Logistikdaten. Hier erscheint später der echte Verbindungsstatus mit letztem Synchronisierungszeitpunkt.',
    [fld(`aftersales.source.${id}.status`, 'Verbindung', undefined, { src: title })],
    [link('CO₂ & Scopes (Datenfluss)', PAGES.footprint)],
  );
}

export const aftersalesContent = { fields: c.fields, sections: c.sections };
export const aftersalesFlowIds = flow.map(([id]) => `aftersales.flow.${id}`);
export const aftersalesEventKeys = ['aftersales.event.temp', 'aftersales.event.range', 'aftersales.event.feedback'];
export const aftersalesGroups = {
  recognize: recognize.map(([id]) => `aftersales.recognize.${id}`),
  act: act.map(([id]) => `aftersales.act.${id}`),
  improve: improve.map(([id]) => `aftersales.improve.${id}`),
};
export const aftersalesSourceIds = sources.map(([id]) => `aftersales.source.${id}`);
