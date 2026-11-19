import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dashboardProxy } from './dashboard-proxy.js';

/**
 * Host 127.0.0.1, damit Demo und Dashboard-Proxy (127.0.0.1:8081) dieselbe Site sind: Sonst sendet der
 * Browser im eingebetteten Dashboard das Login-Cookie nicht mit.
 */
export default defineConfig({
  plugins: [react(), dashboardProxy()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
});
