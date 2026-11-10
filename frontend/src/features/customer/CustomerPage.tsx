import { useDrawer } from '../../app/providers/DrawerProvider';
import { Badge, DataValue } from '../../components/ui/DataValue';
import { Icon, type IconName } from '../../components/ui/Icon';
import { PageHero, SectionCard } from '../../components/ui/SectionCard';
import { customerBenefitIds, customerPublicIds } from '../../content/customer';
import { useField, useSection } from '../../hooks/useContent';

/** Bildebenen liegen unter public/images/customer/<letztes Segment der Sektions-ID>.webp. */
const imageOf = (id: string) => `/images/customer/${id.split('.').pop()}.webp`;

type Accent = 'blue' | 'green' | 'orange';
/** Farbakzent der Symbole wie in der Referenz: Umwelt grün, Garantie orange, sonst blau. */
const accentOf = (icon: IconName): Accent =>
  icon === 'leaf' || icon === 'recycle' || icon === 'shield' ? 'green' : 'blue';

/** Kennwerte in der Pass-Vorschau mit ihrem Symbol. */
const PASS_FIELDS: { key: string; icon: IconName; accent: Accent }[] = [
  { key: 'customer.productId', icon: 'doc', accent: 'blue' },
  { key: 'customer.co2', icon: 'leaf', accent: 'green' },
  { key: 'customer.recycled', icon: 'recycle', accent: 'green' },
  { key: 'customer.warranty', icon: 'shield', accent: 'orange' },
  { key: 'customer.type', icon: 'battery', accent: 'blue' },
  { key: 'customer.origin', icon: 'globe', accent: 'blue' },
];

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

function PassField({ fieldKey, icon, accent }: { fieldKey: string; icon: IconName; accent: Accent }) {
  const f = useField(fieldKey);
  const { openField } = useDrawer();
  return (
    <button type="button" className="pass-field" onClick={() => openField(fieldKey)}>
      <span className={`pass-field__icon accent--${accent}`}>
        <Icon name={icon} size={18} />
      </span>
      <span className="pass-field__body">
        <span className="pass-field__label">{f.label}</span>
        <span className="pass-field__value">
          <DataValue fieldKey={fieldKey} />
        </span>
      </span>
      <Icon name="chevron" size={14} />
    </button>
  );
}

function PassportPreview() {
  const { openSection } = useDrawer();
  return (
    <div className="phone" aria-label="Vorschau des Batterie-Passes auf dem Smartphone">
      <div className="phone__screen">
        <div className="phone__status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone__notch" />
          <span className="phone__signal" />
        </div>
        <div className="phone__head">
          <strong>Batterie-Pass</strong>
          <img src="/images/brand/dataciders-logo.png" alt="Dataciders" height="12" />
        </div>
        <Badge tone="ok" icon="globe">Öffentlich sichtbar</Badge>
        <p className="phone__sub">Dies ist die öffentliche Ansicht des Batterie-Passes.</p>
        <img className="phone__visual" src="/images/customer/pack.webp" alt="" width="290" height="124" />
        <h2 className="phone__name">
          <DataValue fieldKey="customer.productName" />
        </h2>
        <p className="phone__claim">Für eine saubere und elektrische Zukunft.</p>
        <button type="button" className="phone__btn phone__btn--primary" onClick={() => openSection('customer.qr')}>
          <Icon name="qr" size={20} /> QR scannen <Icon name="chevron" size={16} />
        </button>
        <button type="button" className="phone__btn" onClick={() => openSection('customer.passport')}>
          <Icon name="link" size={18} /> DPP öffnen <Icon name="chevron" size={16} />
        </button>
        <div className="phone__grid">
          {PASS_FIELDS.map((p) => (
            <PassField key={p.key} fieldKey={p.key} icon={p.icon} accent={p.accent} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ id }: { id: string }) {
  const s = useSection(id);
  const icon = s.icon ?? 'box';
  return (
    <SectionCard id={id} className="benefit">
      <span className={`benefit__icon accent--${accentOf(icon)}`}>
        <Icon name={icon} size={26} />
      </span>
      <span className="benefit__title">{s.title}</span>
      <span className="benefit__text">
        <DataValue fieldKey={`${id}.text`} />
      </span>
      <img className="benefit__img" src={imageOf(id)} alt="" loading="lazy" width="230" height="116" />
    </SectionCard>
  );
}

function PublicCategory({ id }: { id: string }) {
  const s = useSection(id);
  const icon = s.icon ?? 'box';
  return (
    <SectionCard id={id} className="dpp-cat">
      <img className="dpp-cat__img" src={imageOf(id)} alt="" loading="lazy" width="182" height="86" />
      <span className="dpp-cat__foot">
        <span className={`dpp-cat__icon accent--${accentOf(icon)}`}>
          <Icon name={icon} size={20} />
        </span>
        <span className="dpp-cat__title">{s.title}</span>
        <Icon name="chevron" size={16} />
      </span>
    </SectionCard>
  );
}

export function CustomerPage() {
  return (
    <div className="page">
      <PageHero
        title="Endkunde"
        strong="Batterie-Pass auf einen Blick"
        subtitle="Transparenz schafft Vertrauen: alle wichtigen Produktinformationen, einfach und verständlich."
        visual={<img className="customer-hero" src="/images/customer/hero.webp" alt="" width="712" height="140" />}
      />

      <div className="grid-customer">
        <div className="customer-left">
          <PassportPreview />
          <SectionCard id="customer.qr" className="qr-card">
            <span className="qr-frame">
              <QrPlaceholder />
            </span>
            <p><strong>QR scannen</strong><br />und Batterie-Pass anzeigen</p>
            <p className="muted small">Platzhalter-Grafik</p>
          </SectionCard>
        </div>

        <div className="customer-right">
          <section className="card customer-panel" aria-labelledby="customer-benefits">
            <h2 id="customer-benefits" className="customer-panel__title">Was Sie als Endkunde erleben</h2>
            <div className="grid-tiles grid-tiles--4">
              {customerBenefitIds.map((id) => (
                <BenefitCard key={id} id={id} />
              ))}
            </div>
          </section>

          <section className="card customer-panel" aria-labelledby="customer-public">
            <div className="card__head">
              <div className="section-title">
                <h2 id="customer-public" className="customer-panel__title">
                  <Icon name="globe" size={24} /> Öffentlich sichtbare DPP-Informationen
                </h2>
                <p>Als Endkunde sehen Sie die wichtigsten, öffentlich verfügbaren Informationen des Batterie-Passes.</p>
              </div>
              <Badge icon="info">Nur ausgewählte Informationen</Badge>
            </div>
            <div className="grid-tiles grid-tiles--5">
              {customerPublicIds.map((id) => (
                <PublicCategory key={id} id={id} />
              ))}
            </div>
          </section>

          <SectionCard id="customer.message" className="message">
            <span className="message__icon">
              <Icon name="leaf" size={26} />
            </span>
            <div className="message__text">
              <strong>Mehr Transparenz für eine nachhaltige Mobilität</strong>
              <p>
                Der Batterie-Pass macht wichtige Produktinformationen für alle zugänglich, für mehr Vertrauen, eine längere Nutzung und eine saubere Zukunft.
              </p>
            </div>
            <img className="message__img" src="/images/customer/message.webp" alt="" loading="lazy" width="400" height="92" />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
