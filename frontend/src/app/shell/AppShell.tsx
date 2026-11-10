import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { EntityDrawer } from '../../components/drawers/EntityDrawer';
import { Icon } from '../../components/ui/Icon';
import { useProductId } from '../../hooks/useContent';
import { PAGES, productPath } from '../../lib/pages';
import { DrawerProvider } from '../providers/DrawerProvider';

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Dataciders, zum Showroom">
      {/* Offizielle Wortmarke von dataciders.com (dunkle Variante fuer helle Flaechen). */}
      <img className="logo__img" src="/images/brand/dataciders-logo.png" alt="" width="600" height="54" />
    </Link>
  );
}

function GlobalHeader({ inProduct }: { inProduct: boolean }) {
  const productId = useProductId();
  return (
    <header className="topbar">
      <div className="topbar__left">
        <Logo />
        <span className="topbar__title">Digital Product Passport Demonstrator</span>
      </div>
      {inProduct ? (
        <div className="topbar__nav">
          <nav className="switcher" aria-label="Showroom">
            <NavLink to="/" end className="switcher__item">
              <Icon name="home" size={16} />
              Showroom
            </NavLink>
          </nav>
          <nav className="switcher" aria-label="Perspektive">
            {PAGES.filter((p) => p.group === 'role').map((p) => (
              <NavLink key={p.id} to={productPath(productId, p.id)} className="switcher__item">
                <Icon name={p.icon} size={16} />
                {p.label}
              </NavLink>
            ))}
          </nav>
          <nav className="switcher" aria-label="Ansichten">
            {PAGES.filter((p) => p.group === 'view').map((p) => (
              <NavLink key={p.id} to={productPath(productId, p.id)} className="switcher__item">
                <Icon name={p.icon} size={16} />
                {p.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : (
        <span />
      )}
    </header>
  );
}

export function AppShell({ variant }: { variant: 'showroom' | 'product' }) {
  const { pathname } = useLocation();
  const inProduct = variant === 'product';
  return (
    <DrawerProvider>
      <div className={`shell shell--${variant}`}>
        <a href="#main" className="skip-link">Zum Inhalt springen</a>
        <GlobalHeader inProduct={inProduct} />
        <main id="main" className="shell__main" key={pathname}>
          <Outlet />
        </main>
      </div>
      <EntityDrawer />
    </DrawerProvider>
  );
}
