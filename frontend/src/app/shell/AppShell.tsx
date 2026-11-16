import { useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { EntityDrawer } from '../../components/drawers/EntityDrawer';
import { Icon } from '../../components/ui/Icon';
import { useProductId } from '../../hooks/useContent';
import { PAGES, productPath } from '../../lib/pages';
import { DrawerProvider } from '../providers/DrawerProvider';
import { Sidebar } from './Sidebar';

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Dataciders, zum Showroom">
      {/* Offizielle Wortmarke von dataciders.com (dunkle Variante fuer helle Flaechen). */}
      <img className="logo__img" src="/images/brand/dataciders-logo.png" alt="" width="600" height="54" />
    </Link>
  );
}

function GlobalHeader({
  showNav,
  sidebarToggle,
}: {
  showNav: boolean;
  sidebarToggle?: { collapsed: boolean; onToggle: () => void };
}) {
  const productId = useProductId();
  return (
    <header className="topbar">
      <div className="topbar__left">
        {sidebarToggle && (
          <button
            type="button"
            className="topbar__sidebar-toggle"
            aria-expanded={!sidebarToggle.collapsed}
            aria-controls="sidebar"
            aria-label={sidebarToggle.collapsed ? 'Seitenleiste einblenden' : 'Seitenleiste ausblenden'}
            onClick={sidebarToggle.onToggle}
          >
            <Icon name="sidebar" size={18} />
          </button>
        )}
        <Logo />
        <span className="topbar__title">Digital Product Passport Demonstrator</span>
      </div>
      {showNav ? (
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

const SIDEBAR_COLLAPSED_KEY = 'dpp-demo.sidebar-collapsed';

/**
 * Gemeinsame Hülle für alle Routen. Außerhalb des Showrooms (`/`) zeigt der Header die vollen
 * Umschalter und die Sidebar erscheint; im Showroom nur Logo und Titel.
 */
export function AppShell() {
  const { pathname } = useLocation();
  // Header-Optionen und Sidebar erst ab Auswahl einer Produktgruppe, nicht im Showroom.
  const sidebarAvailable = pathname !== '/';
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });
  const toggleSidebar = () =>
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');
      } catch {
        /* Speichern optional; Zustand bleibt für diese Sitzung erhalten. */
      }
      return next;
    });
  const showSidebar = sidebarAvailable && !collapsed;
  return (
    <DrawerProvider>
      <div className={`shell${showSidebar ? '' : ' shell--no-sidebar'}`}>
        <a href="#main" className="skip-link">Zum Inhalt springen</a>
        <GlobalHeader
          showNav={sidebarAvailable}
          sidebarToggle={sidebarAvailable ? { collapsed, onToggle: toggleSidebar } : undefined}
        />
        {showSidebar && <Sidebar />}
        <main id="main" className="shell__main" key={pathname}>
          <Outlet />
        </main>
      </div>
      <EntityDrawer />
    </DrawerProvider>
  );
}
