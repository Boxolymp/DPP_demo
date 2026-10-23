import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../shell/AppShell';

const ShowroomPage = lazy(() => import('../../features/showroom/ShowroomPage').then((m) => ({ default: m.ShowroomPage })));
const OemPage = lazy(() => import('../../features/oem/OemPage').then((m) => ({ default: m.OemPage })));
const CustomerPage = lazy(() => import('../../features/customer/CustomerPage').then((m) => ({ default: m.CustomerPage })));
const SupplierPage = lazy(() => import('../../features/supplier/SupplierPage').then((m) => ({ default: m.SupplierPage })));
const FootprintPage = lazy(() => import('../../features/footprint/FootprintPage').then((m) => ({ default: m.FootprintPage })));
const AftersalesPage = lazy(() => import('../../features/aftersales/AftersalesPage').then((m) => ({ default: m.AftersalesPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<p className="loading" role="status">Wird geladen …</p>}>
      <Routes>
        <Route element={<AppShell variant="showroom" />}>
          <Route path="/" element={<ShowroomPage />} />
        </Route>
        <Route path="/products/:productId" element={<AppShell variant="product" />}>
          <Route index element={<Navigate to="oem" replace />} />
          <Route path="oem" element={<OemPage />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="supplier" element={<SupplierPage />} />
          <Route path="footprint" element={<FootprintPage />} />
          <Route path="aftersales" element={<AftersalesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
