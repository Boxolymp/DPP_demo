import { useDrawer } from '../../app/providers/DrawerProvider';
import { Badge } from '../../components/ui/DataValue';
import { Icon } from '../../components/ui/Icon';
import { FieldMetric, PageHero, SectionCard, SectionTitle } from '../../components/ui/SectionCard';
import { Tile } from '../../components/ui/Tile';
import { customerBenefitIds, customerPublicIds } from '../../content/customer';
import { useField } from '../../hooks/useContent';

/** Deterministisches Platzhalter-Muster, kein gültiger QR-Code. */
function QrPlaceholder() {
  const n = 21;
  const cells: boolean[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
      if (inFinder) {
        const lx = x >= n - 7 ? x - (n - 7) : x;
        const ly = y >= n - 7 ? y - (n - 7) : y;
        cells.push(lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4));
      } else {
        cells.push(((x * 7 + y * 13 + x * y) % 5) < 2);
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="qr" role="img" aria-label="Platzhalter für den QR-Code">
      {cells.map((on, i) => (on ? <rect key={i} x={i % n} y={Math.floor(i / n)} width="1" height="1" /> : null))}
    </svg>
  );
}

export function CustomerPage() {
  const { openSection } = useDrawer();
  const name = useField('customer.productName');
  return (
    <div className="page">
      <PageHero
        title="Endkunde"
        strong="Batterie-Pass auf einen Blick"
        subtitle="Transparenz schafft Vertrauen: alle wichtigen Produktinformationen, einfach und verständlich."
      />

      <div className="grid-customer">
        <div className="customer-left">
          <div className="phone" aria-label="Vorschau des Batterie-Passes auf dem Smartphone">
            <div className="phone__screen">
              <div className="phone__head">
                <strong>Batterie-Pass</strong>
                <Badge tone="ok">Öffentlich sichtbar</Badge>
              </div>
              <p className="phone__sub">Dies ist die öffentliche Ansicht des Batterie-Passes.</p>
              <div className="phone__visual" aria-hidden="true"><Icon name="battery" size={64} /></div>
              <h2>{name.value}</h2>
              <p className="muted">Für eine saubere und elektrische Zukunft.</p>
              <button type="button" className="btn btn--primary" onClick={() => openSection('customer.qr')}>
                <Icon name="qr" size={18} /> QR scannen
              </button>
              <button type="button" className="btn" onClick={() => openSection('customer.passport')}>
                <Icon name="link" size={18} /> DPP öffnen
              </button>
              <div className="phone__grid">
                <FieldMetric fieldKey="customer.productId" />
                <FieldMetric fieldKey="customer.co2" />
                <FieldMetric fieldKey="customer.recycled" />
                <FieldMetric fieldKey="customer.warranty" />
                <FieldMetric fieldKey="customer.type" />
                <FieldMetric fieldKey="customer.origin" />
              </div>
            </div>
          </div>
          <SectionCard id="customer.qr" className="qr-card">
            <QrPlaceholder />
            <p><strong>QR scannen</strong> und Batterie-Pass anzeigen</p>
            <p className="muted small">Platzhalter-Grafik</p>
          </SectionCard>
        </div>

        <div className="customer-right">
          <SectionTitle>Was Sie als Endkunde erleben</SectionTitle>
          <div className="grid-tiles grid-tiles--4">
            {customerBenefitIds.map((id) => (
              <Tile key={id} id={id} fieldKey={`${id}.text`} className="tile--vertical" />
            ))}
          </div>

          <div className="card__head">
            <SectionTitle sub="Als Endkunde sehen Sie die wichtigsten, öffentlich verfügbaren Informationen.">
              Öffentlich sichtbare DPP-Informationen
            </SectionTitle>
            <Badge>Nur ausgewählte Informationen</Badge>
          </div>
          <div className="grid-tiles grid-tiles--5">
            {customerPublicIds.map((id) => (
              <Tile key={id} id={id} fieldKey={`${id}.data`} className="tile--vertical" />
            ))}
          </div>

          <SectionCard id="customer.message" className="message">
            <Icon name="leaf" size={28} />
            <div>
              <strong>Mehr Transparenz für eine nachhaltige Mobilität</strong>
              <p className="muted">
                Der Batterie-Pass macht wichtige Produktinformationen für alle zugänglich, für mehr Vertrauen, eine längere Nutzung und eine saubere Zukunft.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
