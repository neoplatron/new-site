// Simple illustrations showing customers what the odometer and mileage photos should look like.

const Frame = ({ children, caption }: { children: React.ReactNode; caption: string }) => (
  <figure className="mt-3">
    <svg
      viewBox="0 0 240 140"
      role="img"
      aria-label={caption}
      className="w-full max-w-[240px] rounded-lg border border-border dark:border-d-border bg-slate-900"
    >
      {children}
    </svg>
    <figcaption className="mt-1 text-xs text-text-muted">{caption}</figcaption>
  </figure>
);

// Dashboard cluster with the total kilometers (odometer) highlighted.
export const OdometerSample = () => (
  <Frame caption="Sample: odometer clearly showing total kilometers">
    <circle cx="70" cy="62" r="46" fill="#0f172a" stroke="#475569" strokeWidth="3" />
    <circle cx="170" cy="62" r="46" fill="#0f172a" stroke="#475569" strokeWidth="3" />
    <path d="M38 88 A46 46 0 1 1 102 88" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="2 6" />
    <path d="M138 88 A46 46 0 1 1 202 88" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="2 6" />
    <line x1="70" y1="62" x2="50" y2="82" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    <line x1="170" y1="62" x2="190" y2="44" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    <rect x="68" y="106" width="104" height="24" rx="4" fill="#020617" stroke="#22c55e" strokeWidth="2.5" />
    <text x="120" y="123" textAnchor="middle" fontSize="15" fontFamily="monospace" fontWeight="700" fill="#22c55e">
      45,230 km
    </text>
    <text x="120" y="102" textAnchor="middle" fontSize="8" fill="#94a3b8">ODO</text>
  </Frame>
);

// Instrument display showing the present mileage / average fuel economy.
export const MileageSample = () => (
  <Frame caption="Sample: display showing present mileage / fuel economy">
    <rect x="30" y="22" width="180" height="96" rx="10" fill="#020617" stroke="#475569" strokeWidth="3" />
    <text x="120" y="46" textAnchor="middle" fontSize="9" fill="#94a3b8" letterSpacing="2">AVG FUEL ECONOMY</text>
    <rect x="52" y="54" width="136" height="38" rx="5" fill="#0b1220" stroke="#22c55e" strokeWidth="2.5" />
    <text x="120" y="83" textAnchor="middle" fontSize="26" fontFamily="monospace" fontWeight="700" fill="#22c55e">
      12.5
    </text>
    <text x="196" y="104" textAnchor="end" fontSize="10" fill="#94a3b8">km/l</text>
    <text x="52" y="104" fontSize="9" fill="#94a3b8">TRIP A  128.4 km</text>
  </Frame>
);
