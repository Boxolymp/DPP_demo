// Nur Entwicklung/Preview: lokaler Einbettungs-Proxy für das Dashboard der Quellsysteme (CONTACT, Port 8080).
// Plain JS, damit keine @types/node-Abhängigkeit nötig ist; Typen in dashboard-proxy.d.ts.
import http from 'node:http';
import net from 'node:net';

const HOST = '127.0.0.1';
const TARGET_PORT = 8080;
/** Muss zu `embedUrl` der Quellsysteme in `src/lib/pages.ts` passen. */
const PROXY_PORT = 8081;
/** Nur lokale Demo-Origins (dev 5173, preview 4173, Ausweichports) dürfen einbetten. */
const FRAME_ANCESTORS = "frame-ancestors 'self' http://127.0.0.1:* http://localhost:*";

/** Erlaubt die Einbettung durch die Demo; alle anderen CSP-Direktiven bleiben unverändert. */
function allowDemoFraming(headers) {
  delete headers['x-frame-options'];
  const csp = headers['content-security-policy'];
  if (csp) {
    const directives = String(csp)
      .split(';')
      .map((d) => d.trim())
      .filter((d) => d && !d.toLowerCase().startsWith('frame-ancestors'));
    headers['content-security-policy'] = [...directives, FRAME_ANCESTORS].join('; ');
  }
  // Absolute Weiterleitungen auf 8080 würden den Proxy verlassen.
  if (headers.location) {
    headers.location = headers.location.replace(
      new RegExp(`^http://(127\\.0\\.0\\.1|localhost):${TARGET_PORT}`),
      `http://${HOST}:${PROXY_PORT}`,
    );
  }
}

function startProxy(logger) {
  const server = http.createServer((req, res) => {
    const upstream = http.request(
      { host: HOST, port: TARGET_PORT, method: req.method, path: req.url, headers: req.headers },
      (up) => {
        const headers = { ...up.headers };
        allowDemoFraming(headers);
        res.writeHead(up.statusCode ?? 502, up.statusMessage, headers);
        up.pipe(res);
      },
    );
    upstream.on('error', () => {
      if (!res.headersSent) res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(`Dashboard nicht erreichbar: http://${HOST}:${TARGET_PORT} läuft nicht.`);
    });
    req.pipe(upstream);
  });

  // WebSockets unverändert durchreichen.
  server.on('upgrade', (req, socket, head) => {
    const upstream = net.connect(TARGET_PORT, HOST, () => {
      const lines = [`${req.method} ${req.url} HTTP/${req.httpVersion}`];
      for (let i = 0; i < req.rawHeaders.length; i += 2) lines.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}`);
      upstream.write(`${lines.join('\r\n')}\r\n\r\n`);
      if (head.length) upstream.write(head);
      upstream.pipe(socket).pipe(upstream);
    });
    upstream.on('error', () => socket.destroy());
    socket.on('error', () => upstream.destroy());
  });

  server.on('error', (err) =>
    logger.warn(`Dashboard-Proxy auf Port ${PROXY_PORT} nicht gestartet: ${err.message}`),
  );
  server.listen(PROXY_PORT, HOST, () =>
    logger.info(`Dashboard-Proxy: http://${HOST}:${PROXY_PORT} → http://${HOST}:${TARGET_PORT}`),
  );
  return server;
}

/** Startet den Proxy zusammen mit dem Vite-Server (dev und preview) und beendet ihn mit ihm. */
export function dashboardProxy() {
  const attach = ({ httpServer, config }) => {
    if (!httpServer) return;
    let proxy;
    // Erst nach dem Listen starten: Bei einem Vite-Neustart ist der alte Proxy dann schon geschlossen.
    httpServer.once('listening', () => {
      proxy = startProxy(config.logger);
    });
    httpServer.once('close', () => {
      proxy?.close();
      proxy?.closeAllConnections();
    });
  };
  return { name: 'dashboard-proxy', configureServer: attach, configurePreviewServer: attach };
}
