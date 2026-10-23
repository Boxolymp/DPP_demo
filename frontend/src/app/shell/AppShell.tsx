import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { EntityDrawer } from '../../components/drawers/EntityDrawer';
import { Icon } from '../../components/ui/Icon';
import { useProductId } from '../../hooks/useContent';
import { PAGES, productPath } from '../../lib/pages';
import { DrawerProvider } from '../providers/DrawerProvider';

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Dataciders, zum Showroom">
      <span className="logo__mark" aria-hidden="true" />
      <span className="logo__word">dataciders</span>
    </Link>
  );
}

function GlobalHeader({ inProduct }: { inProduct: boolean }) {
  const productId = useProductId();
  return (
    <header className="topbar">
      <div className="topbar__left">
        <Logo />
        <span className="topbar__title">Batterie-DPP Demonstrator</span>
      </div>
      {inProduct ? (
        <nav className="switcher" aria-label="Perspektive">
          {PAGES.filter((p) => p.perspective).map((p) => (
            <NavLink key={p.id} to={productPath(productId, p.id)} className="switcher__item">
              <Icon name={p.icon} size={16} />
              {p.label}
            </NavLink>
          ))}
        </nav>
      ) : (
        <span />
      )}
      <div className="topbar__right">
        <span className="demo-pill" title="Alle Werte sind illustrativ; die Datenanbindung folgt in Phase 2.">
          Demo · illustrative Werte
        </span>
      </div>
    </header>
  );
}

function GlobalSidebar() {
  const productId = useProductId();
  return (
    <nav className="sidebar" aria-label="Ansichten">
      <Link to="/" className="sidebar__item">
        <Icon name="home" />
        <span>Showroom</span>
      </Link>
      <p className="sidebar__group">Ansichten</p>
      {PAGES.map((v) => (
        <NavLink key={v.id} to={productPath(productId, v.id)} className="sidebar__item">
          <Icon name={v.icon} />
          <span>{v.label}</span>
        </NavLink>
      ))}
    </nav>
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
        {inProduct ? <GlobalSidebar /> : null}
        <main id="main" className="shell__main" key={pathname}>
          <Outlet />
        </main>
      </div>
      <EntityDrawer />
    </DrawerProvider>
  );
}
