import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─────────────────────────────────────────────────────────────
// 5 organic blob regions, designed to gently overlap each other.
// Canvas: 1000 × 520. Each blob is a simple cubic-bezier ellipse
// with slight organic distortion. They share edges so the map
// feels like one cohesive shape, not 5 separate islands.
// ─────────────────────────────────────────────────────────────
const REGIONS = [
  {
    id: 'region-1',
    apiKey: 'West',
    label: 'WEST',
    cx: 205, cy: 268,      // label + ping center
    color: '#06b6d4',      // cyan
    // Large left blob — overlaps NORTH top-left and CENTRAL left edge
    path: 'M 208,72 C 380,68 402,158 396,268 C 390,378 318,462 208,462 C 98,462 26,378 20,268 C 14,158 36,76 208,72 Z',
  },
  {
    id: 'region-2',
    apiKey: 'North',
    label: 'NORTH',
    cx: 456, cy: 148,
    color: '#818cf8',      // indigo / purple
    // Wide top blob — overlaps WEST right side and EAST left side
    path: 'M 278,46 C 368,14 548,14 638,56 C 728,98 708,188 622,220 C 536,252 372,252 284,220 C 196,188 188,78 278,46 Z',
  },
  {
    id: 'region-3',
    apiKey: 'Central',
    label: 'CENTRAL',
    cx: 508, cy: 322,
    color: '#2dd4bf',      // teal
    // Centre blob — overlaps NORTH bottom, EAST lower-left, SOUTH top
    path: 'M 352,228 C 394,180 624,178 668,234 C 712,290 712,372 650,418 C 588,464 402,464 350,418 C 298,372 310,276 352,228 Z',
  },
  {
    id: 'region-4',
    apiKey: 'East',
    label: 'EAST',
    cx: 768, cy: 192,
    color: '#f472b6',      // pink / magenta
    // Right blob — overlaps NORTH top-right and CENTRAL right edge
    path: 'M 598,68 C 678,32 862,36 942,88 C 1022,140 1002,228 926,268 C 850,308 680,304 598,258 C 516,212 518,104 598,68 Z',
  },
  {
    id: 'region-5',
    apiKey: 'South',
    label: 'SOUTH',
    cx: 762, cy: 418,
    color: '#34d399',      // green
    // Bottom-right blob — overlaps CENTRAL lower and EAST bottom
    path: 'M 574,358 C 620,310 882,310 938,368 C 994,426 968,494 848,512 C 728,530 600,514 562,472 C 524,430 528,406 574,358 Z',
  },
];

// Decorative connection lines between blob centres
const LINES = [
  [205, 268, 456, 148],
  [456, 148, 768, 192],
  [456, 148, 508, 322],
  [508, 322, 762, 418],
  [768, 192, 762, 418],
  [205, 268, 508, 322],
];

// Sparse floating particles (computed once, no re-renders)
const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  x:     ((i * 293 + 50) % 960) + 20,
  y:     ((i * 197 + 80) % 480) + 20,
  r:     i % 4 === 0 ? 1.8 : 1.1,
  dur:   3.5 + (i % 5) * 0.7,
  delay: (i * 0.28) % 3.5,
}));

// ─────────────────────────────────────────────────────────────
interface Props {
  activeRegion?: string | null;
}
// ─────────────────────────────────────────────────────────────

const FuturisticWorldMap: React.FC<Props> = ({ activeRegion }) => {
  const [predictions, setPredictions] = useState<Record<string, number>>({});
  const [hotspots, setHotspots]       = useState<string[]>(['North', 'South']);
  const [hovered, setHovered]         = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  // Month/year selector for testing
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [year, setYear]   = useState(now.getFullYear());

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // ── Fetch ML predictions ────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`http://127.0.0.1:8000/api/predict?month=${month}&year=${year}`);
        const data = await res.json();
        const map: Record<string, number> = {};
        (data.predictions as { region: string; predicted_total: number }[])
          .forEach(p => { map[p.region] = p.predicted_total; });
        setPredictions(map);
        setHotspots(data.top_regions as string[]);
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    };
    load();
  }, [month, year]);

  const isActive  = (k: string) => (activeRegion ? activeRegion === k : hotspots.includes(k));
  const isHovered = (id: string) => hovered === id;

  return (
    <div className="relative w-full h-full">
      {/* Deep navy base */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 38%, #050e1f 0%, #020817 100%)' }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,.55) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(6,182,212,.55) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* ── SVG ──────────────────────────────────────────────── */}
      <svg
        viewBox="0 0 1000 520"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {/* Glow filter per region colour */}
          {REGIONS.map(r => (
            <filter key={r.id} id={`glow-${r.id}`} x="-55%" y="-55%" width="210%" height="210%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="blur" />
              <feFlood floodColor={r.color} floodOpacity="1" result="col" />
              <feComposite in="col" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <filter id="glow-soft" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-line" x="-5%" y="-200%" width="110%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Scan gradient */}
          <linearGradient id="scan-g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="45%"  stopColor="#06b6d4" stopOpacity="0.55" />
            <stop offset="55%"  stopColor="#06b6d4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Connection lines ───────────────────────────────── */}
        {LINES.map(([x1, y1, x2, y2], i) => (
          <line key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#06b6d4" strokeWidth={0.7} strokeOpacity={0.15}
            strokeDasharray="5 9" filter="url(#glow-line)"
          />
        ))}

        {/* ── Blob regions ──────────────────────────────────── */}
        {/*   mix-blend-mode:screen makes overlaps blend colours  */}
        <g style={{ isolation: 'isolate' }}>
          {REGIONS.map(region => {
            const active = isActive(region.apiKey);
            const hover  = isHovered(region.id);
            const total  = predictions[region.apiKey];

            return (
              <motion.g
                key={region.id}
                onHoverStart={() => setHovered(region.id)}
                onHoverEnd={() => setHovered(null)}
              >
                {/* Outer halo glow (active only) */}
                {active && (
                  <motion.path
                    d={region.path}
                    fill={region.color}
                    fillOpacity={0}
                    stroke={region.color}
                    strokeWidth={22}
                    strokeOpacity={0}
                    filter={`url(#glow-${region.id})`}
                    style={{ mixBlendMode: 'screen' }}
                    animate={{ strokeOpacity: [0.08, 0.22, 0.08] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Blob fill — screen blend so overlaps look glowy */}
                <motion.path
                  id={region.id}
                  d={region.path}
                  fill={region.color}
                  stroke={region.color}
                  style={{ mixBlendMode: 'screen' }}
                  filter={active
                    ? `url(#glow-${region.id})`
                    : hover ? 'url(#glow-soft)' : undefined}
                  animate={{
                    fillOpacity:   active ? 0.28 : hover ? 0.18 : 0.10,
                    strokeOpacity: active ? 1.0  : hover ? 0.80 : 0.40,
                    strokeWidth:   active ? 2.5  : hover ? 2.0  : 1.2,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Active — pulsing ping rings */}
                {active && (
                  <>
                    <motion.circle cx={region.cx} cy={region.cy} r={8}
                      fill="none" stroke={region.color} strokeWidth={2}
                      animate={{ r: [8, 52], opacity: [1, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.circle cx={region.cx} cy={region.cy} r={8}
                      fill="none" stroke={region.color} strokeWidth={1.5}
                      animate={{ r: [8, 52], opacity: [1, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.9 }}
                    />
                    <motion.circle cx={region.cx} cy={region.cy} r={5}
                      fill={region.color} filter={`url(#glow-${region.id})`}
                      animate={{ r: [5, 9, 5] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </>
                )}

                {/* Normal region dot */}
                {!active && (
                  <circle cx={region.cx} cy={region.cy} r={3.5}
                    fill={region.color} fillOpacity={hover ? 0.9 : 0.55}
                    filter="url(#glow-soft)"
                  />
                )}

                {/* Hotspot badge */}
                <AnimatePresence>
                  {active && (
                    <motion.g
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      <rect
                        x={region.cx - 70} y={region.cy + 14}
                        width={140} height={22} rx={11}
                        fill={region.color} fillOpacity={0.18}
                        stroke={region.color} strokeOpacity={0.75} strokeWidth={0.8}
                      />
                      <text
                        x={region.cx} y={region.cy + 29}
                        textAnchor="middle"
                        fill={region.color}
                        fontSize={8.5} fontFamily="monospace"
                        fontWeight="bold" letterSpacing="1.2"
                      >
                        ⚠ HOTSPOT{total !== undefined ? ` · ${Math.round(total)} MT` : ''}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Region label */}
                <motion.text
                  x={region.cx}
                  y={active ? region.cy - 18 : region.cy - 11}
                  textAnchor="middle"
                  fill={region.color}
                  fontFamily="monospace"
                  fontWeight={active ? 'bold' : 'normal'}
                  letterSpacing="2"
                  animate={{
                    opacity:  active ? 1 : hover ? 0.85 : 0.45,
                    fontSize: active ? 10.5 : 8,
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {region.label}
                </motion.text>
              </motion.g>
            );
          })}
        </g>

        {/* ── Floating particles ─────────────────────────────── */}
        {PARTICLES.map((p, i) => (
          <motion.circle key={i}
            cx={p.x} cy={p.y} r={p.r}
            fill="#06b6d4"
            animate={{ opacity: [0, 0.65, 0], cy: [p.y, p.y - 20, p.y] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}

        {/* ── Scanning line (pure SVG animation — zero re-renders) ── */}
        <rect x="-80" y="0" width="120" height="520" fill="url(#scan-g)" opacity={0.35}>
          <animateTransform
            attributeName="transform" type="translate"
            from="0 0" to="1080 0" dur="10s" repeatCount="indefinite"
          />
        </rect>

        {/* ── Corner brackets ─────────────────────────────────── */}
        <g stroke="#06b6d4" strokeWidth={2} strokeOpacity={0.4} fill="none">
          <polyline points="18,16 18,4 30,4"     />
          <polyline points="970,4 982,4 982,16"  />
          <polyline points="18,504 18,516 30,516"   />
          <polyline points="970,516 982,516 982,504" />
        </g>

        {/* ── HUD corner text ─────────────────────────────────── */}
        <text x="28" y="17" fill="#06b6d4" fontSize={7.5} fontFamily="monospace"
          opacity={0.45} letterSpacing="1.5">ECOMINE · AI THREAT MAP</text>
        <text x="972" y="517" fill="#06b6d4" fontSize={7.5} fontFamily="monospace"
          textAnchor="end" opacity={0.45} letterSpacing="1.5">XGBOOST · LIVE FORECAST</text>

        {/* Lat / lng guide lines */}
        {[130, 260, 390].map(y => (
          <line key={y} x1="18" y1={y} x2="982" y2={y}
            stroke="#06b6d4" strokeWidth={0.3} strokeOpacity={0.09} strokeDasharray="4 8" />
        ))}
        {[250, 500, 750].map(x => (
          <line key={x} x1={x} y1="14" x2={x} y2="506"
            stroke="#06b6d4" strokeWidth={0.3} strokeOpacity={0.09} strokeDasharray="4 8" />
        ))}
      </svg>

      {/* ── Month / Year selector overlay ────────────────────────
          Floating pill in bottom-left corner, pointer-events-auto
          so it stays clickable even when parent is pointer-events-none. */}
      <div
        className="absolute bottom-5 left-5 z-20 flex items-center gap-2"
        style={{ pointerEvents: 'auto' }}
      >
        <div
          className="flex items-center gap-1 rounded-full px-3 py-1.5 border"
          style={{
            background: 'rgba(2,6,23,0.82)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(6,182,212,0.45)',
            boxShadow: '0 0 12px rgba(6,182,212,0.18)',
          }}
        >
          {/* Prev */}
          <button
            onClick={prevMonth}
            className="text-cyan-400 hover:text-cyan-200 font-bold text-sm px-1 transition-colors select-none"
            title="Previous month"
          >
            ‹
          </button>

          {/* Label */}
          <span
            className="font-mono text-xs font-bold tracking-widest px-2"
            style={{ color: '#67e8f9', minWidth: '5.5rem', textAlign: 'center' }}
          >
            {loading ? (
              <span className="opacity-50 animate-pulse">···</span>
            ) : (
              `${MONTH_NAMES[month - 1]} ${year}`
            )}
          </span>

          {/* Next */}
          <button
            onClick={nextMonth}
            className="text-cyan-400 hover:text-cyan-200 font-bold text-sm px-1 transition-colors select-none"
            title="Next month"
          >
            ›
          </button>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-2">
          <span
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            style={{ animation: 'pulse 2s infinite' }}
          />
          <span className="font-mono text-[9px] text-cyan-600 tracking-widest uppercase">
            ML Live
          </span>
        </div>
      </div>
    </div>
  );
};

export default FuturisticWorldMap;
