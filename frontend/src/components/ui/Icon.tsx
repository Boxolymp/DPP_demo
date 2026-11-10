const PATHS = {
  home: ['M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'],
  car: ['M5 16l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 16', 'M3 16h18v3h-2.5a1.5 1.5 0 0 1-3 0h-7a1.5 1.5 0 0 1-3 0H3z'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21a8 8 0 0 1 16 0'],
  truck: ['M2 6h12v10H2z', 'M14 10h4l3 3v3h-7z', 'M4 18.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0', 'M15 18.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0'],
  leaf: ['M5 19c0-8 5-14 15-14 0 10-6 15-14 15z', 'M5 19l8-8'],
  wrench: ['M14.5 6.5a4 4 0 0 0 4.9 4.9L21 13l-3 3-7-7z', 'M10.5 11.5L3 19l2 2 7.5-7.5'],
  battery: ['M3 8h15v8H3z', 'M18 11h3v2h-3z', 'M6 10v4M9 10v4M12 10v4'],
  factory: ['M3 21V10l6 4v-4l6 4V6h3v15z', 'M3 21h18'],
  doc: ['M6 3h8l4 4v14H6z', 'M14 3v4h4M9 12h6M9 16h6'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'],
  recycle: ['M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3', 'M18 3v4h-4M6 21v-4h4'],
  box: ['M3 7l9-4 9 4v10l-9 4-9-4z', 'M3 7l9 4 9-4M12 11v10'],
  chart: ['M4 20V4M4 20h16', 'M8 16v-5M12 16V8M16 16v-3'],
  arrow: ['M4 12h14M13 6l6 6-6 6'],
  chevron: ['M9 6l6 6-6 6'],
  close: ['M6 6l12 12M18 6L6 18'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  gear: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19 12l2-1-1-3-2 .5-1.5-1.5.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6 8.5 4 8l-1 3 2 1v2l-2 1 1 3 2-.5L7.5 19 7 21l3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3-2-1z'],
  pulse: ['M3 12h4l2-6 4 12 2-6h6'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M20 20l-4-4'],
  link: ['M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'],
  check: ['M5 12l5 5 9-10'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
  globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18'],
  eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  database: ['M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z', 'M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6', 'M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'],
  pen: ['M4 20l4-1 11-11-3-3L5 16z', 'M14 7l3 3'],
  atom: ['M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', 'M12 21c2.2 0 4-4 4-9s-1.8-9-4-9-4 4-4 9 1.8 9 4 9z', 'M4.2 16.5c1.1 1.9 5.5 1.4 9.8-1.1s6.9-6 5.8-7.9-5.5-1.4-9.8 1.1-6.9 6-5.8 7.9z'],
  qr: ['M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z', 'M14 14h3v3h-3zM19 14v2M14 19h3M19 19v1'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v5M12 8h.01'],
  dots: ['M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01'],
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
