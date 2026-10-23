import type { ProductGroup } from '../../content/showroom';

/** Platzhalter-Ebenen für die Regalprodukte; werden später durch freigestellte Bilder ersetzt. */
export function Illustration({ id }: { id: ProductGroup['id'] }) {
  switch (id) {
    case 'batteries':
      return (
        <svg viewBox="0 0 240 180" aria-hidden="true">
          <defs>
            <linearGradient id="metal" x1="0" x2="1">
              <stop offset="0" stopColor="#6b7480" />
              <stop offset="0.45" stopColor="#d9dee5" />
              <stop offset="1" stopColor="#7c8693" />
            </linearGradient>
          </defs>
          <rect x="130" y="14" width="70" height="120" rx="10" fill="url(#metal)" />
          <rect x="130" y="14" width="70" height="14" rx="7" fill="#454c56" />
          <rect x="34" y="62" width="30" height="72" rx="6" fill="#2b3038" />
          <rect x="68" y="50" width="30" height="84" rx="6" fill="#39404a" />
          <rect x="36" y="58" width="26" height="6" rx="3" fill="#aab4c0" />
          <rect x="70" y="46" width="26" height="6" rx="3" fill="#aab4c0" />
          <rect x="30" y="122" width="170" height="44" rx="6" fill="#b7c0cb" stroke="#8d97a4" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={48 + i * 19} y1="126" x2={48 + i * 19} y2="162" stroke="#8d97a4" />
          ))}
        </svg>
      );
    case 'textiles':
      return (
        <svg viewBox="0 0 240 180" aria-hidden="true">
          <line x1="20" y1="22" x2="220" y2="22" stroke="#6b5a45" strokeWidth="4" />
          <path d="M40 24 l22 14 l22 -14 l14 26 l-14 6 v50 h-44 v-50 l-14 -6 z" fill="#d8cdb9" />
          <path d="M112 24 h56 l8 130 h-24 l-4 -80 l-4 80 h-28 z" fill="#2f5d8a" />
          <rect x="30" y="140" width="70" height="14" rx="3" fill="#c9b99a" />
          <rect x="30" y="156" width="70" height="14" rx="3" fill="#3e6b4a" />
          <rect x="130" y="156" width="70" height="14" rx="3" fill="#d2c2a4" />
        </svg>
      );
    case 'electronics':
      return (
        <svg viewBox="0 0 240 180" aria-hidden="true">
          <rect x="30" y="40" width="110" height="68" rx="5" fill="#1e232b" />
          <rect x="36" y="46" width="98" height="56" rx="2" fill="#3b6ea5" opacity="0.55" />
          <path d="M18 112 h134 l-8 12 h-118 z" fill="#aab4c0" />
          <rect x="160" y="52" width="30" height="56" rx="5" fill="#1e232b" />
          <rect x="198" y="60" width="26" height="50" rx="4" fill="#2b3038" />
          <path d="M44 160 a26 26 0 0 1 52 0" fill="none" stroke="#1e232b" strokeWidth="8" />
          <rect x="38" y="152" width="14" height="22" rx="5" fill="#1e232b" />
          <rect x="88" y="152" width="14" height="22" rx="5" fill="#1e232b" />
          <rect x="150" y="146" width="44" height="28" rx="3" fill="#2f7d4f" />
        </svg>
      );
    case 'furniture':
      return (
        <svg viewBox="0 0 240 180" aria-hidden="true">
          <rect x="70" y="30" width="70" height="56" rx="16" fill="#2f6b4a" />
          <rect x="62" y="80" width="86" height="30" rx="12" fill="#357a54" />
          <rect x="76" y="108" width="6" height="52" rx="3" fill="#8a6a45" />
          <rect x="128" y="108" width="6" height="52" rx="3" fill="#8a6a45" />
          <rect x="160" y="70" width="50" height="6" rx="3" fill="#b88a55" />
          <rect x="166" y="76" width="5" height="82" rx="2" fill="#b88a55" />
          <rect x="200" y="76" width="5" height="82" rx="2" fill="#b88a55" />
          <rect x="20" y="136" width="36" height="30" rx="3" fill="#e9e4da" />
        </svg>
      );
    case 'tires':
      return (
        <svg viewBox="0 0 240 180" aria-hidden="true">
          <circle cx="130" cy="92" r="76" fill="#1c1f24" />
          <circle cx="130" cy="92" r="58" fill="#2b3038" />
          <circle cx="130" cy="92" r="42" fill="#aab4c0" />
          <circle cx="130" cy="92" r="12" fill="#5d6672" />
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={i}
              x1="130"
              y1="92"
              x2={130 + 40 * Math.cos((i * 2 * Math.PI) / 5)}
              y2={92 + 40 * Math.sin((i * 2 * Math.PI) / 5)}
              stroke="#5d6672"
              strokeWidth="7"
            />
          ))}
          <ellipse cx="46" cy="150" rx="40" ry="14" fill="#1c1f24" />
          <ellipse cx="46" cy="138" rx="40" ry="14" fill="#2b3038" />
        </svg>
      );
  }
}
