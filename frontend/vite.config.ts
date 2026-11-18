import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Lokales Dashboard (Quellsysteme) über denselben Origin wie die Demo ausliefern: Der Dashboard-Server
 * erlaubt per CSP `frame-ancestors 'self'` nur Same-Origin-Einbettung. `autoRewrite` hält Weiterleitungen
 * des Dashboards auf dem Demo-Origin, statt direkt auf Port 8080 zu springen.
 */
const proxy: Record<string, ProxyOptions> = {
  '/dashboard': { target: 'http://127.0.0.1:8080', changeOrigin: true, autoRewrite: true, ws: true },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
});
