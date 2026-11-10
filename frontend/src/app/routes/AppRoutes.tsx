import { lazy, Suspense, type ComponentType } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { PRODUCT_GROUPS } from '../../content/showroom';
import { PAGES, type PageId } from '../../lib/pages';
import { AppShell } from '../shell/AppShell';

function lazyPage<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(() => load().then((m) => ({ default: m[name] })));
}

const ShowroomPage = lazyPage(() => import('../../features/showroom/ShowroomPage'), 'ShowroomPage');

/** Je Fachseite genau eine Komponente; eine neue Seite in `PAGES` ohne Eintrag hier ist ein Typfehler. */
const PAGE_COMPONENTS: Record<PageId, ComponentType> = {
  oem: lazyPage(() => import('../../features/oem/OemPage'), 'OemPage'),
  customer: lazyPage(() => import('../../features/customer/CustomerPage'), 'CustomerPage'),
  supplier: lazyPage(() => import('../../features/supplier/SupplierPage'), 'SupplierPage'),
  footprint: lazyPage(() => import('../../features/footprint/FootprintPage'), 'FootprintPage'),
  aftersales: lazyPage(() => import('../../features/aftersales/AftersalesPage'), 'AftersalesPage'),
};

const PRODUCT_IDS = PRODUCT_GROUPS.flatMap((g) => (g.productId ? [g.productId] : []));

function ProductShell() {
  const { productId = '' } = useParams();
  if (!PRODUCT_IDS.includes(productId)) return <Navigate to="/" replace />;
  return <AppShell variant="product" />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<p className="loading" role="status">Wird geladen …</p>}>
      <Routes>
        <Route element={<AppShell variant="showroom" />}>
          <Route path="/" element={<ShowroomPage />} />
        </Route>
        <Route path="/products/:productId" element={<ProductShell />}>
          <Route index element={<Navigate to="oem" replace />} />
          {PAGES.map(({ id }) => {
            const Page = PAGE_COMPONENTS[id];
            return <Route key={id} path={id} element={<Page />} />;
          })}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
