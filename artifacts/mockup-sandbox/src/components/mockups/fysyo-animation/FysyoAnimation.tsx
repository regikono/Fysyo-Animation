import { useEffect, useRef, useState } from "react";

const BRAND_TEAL = "#00D4B4";
const BRAND_CYAN = "#00B8E6";
const BRAND_DARK = "#0A1220";
const BRAND_MID = "#0D1E35";
const BRAND_GREEN = "#00D484";

function useCycle(duration: number) {
  const [t, setT] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const tick = (now: number) => {
      if (!start.current) start.current = now;
      const elapsed = (now - start.current) % duration;
      setT(elapsed / duration);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [duration]);

  return t;
}

function useEntrance(delay: number, duration: number) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.max(0, Math.min(1, (elapsed - delay) / duration));
      setProgress(easeOut(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [delay, duration]);
  return progress;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function PulseRing({ cx, cy, t, delay = 0, color = BRAND_TEAL, maxR = 120 }: {
  cx: number; cy: number; t: number; delay?: number; color?: string; maxR?: number;
}) {
  const phase = ((t + delay) % 1);
  const r = 8 + phase * maxR;
  const opacity = (1 - phase) * 0.5;
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.5} opacity={opacity} />;
}

function OrbitDot({ cx, cy, t, delay, radius, color, size = 3 }: {
  cx: number; cy: number; t: number; delay: number; radius: number; color: string; size?: number;
}) {
  const angle = ((t + delay) % 1) * Math.PI * 2;
  const x = cx + Math.cos(angle) * radius;
  const y = cy + Math.sin(angle) * radius;
  return <circle cx={x} cy={y} r={size} fill={color} opacity={0.8} />;
}

function FloatingParticle({ x, baseY, t, delay, size, color }: {
  x: number; baseY: number; t: number; delay: number; size: number; color: string;
}) {
  const phase = ((t + delay) % 1);
  const y = baseY - phase * 160;
  const opacity = phase < 0.15 ? phase / 0.15 : phase > 0.75 ? (1 - phase) / 0.25 : 1;
  return <circle cx={x} cy={y} r={size} fill={color} opacity={opacity * 0.45} />;
}

function GridDots({ cols, rows, t, opacity = 0.1 }: { cols: number; rows: number; t: number; opacity?: number }) {
  return (
    <>
      {Array.from({ length: cols }, (_, i) =>
        Array.from({ length: rows }, (_, j) => {
          const wave = Math.sin(t * Math.PI * 2 + i * 0.5 + j * 0.4) * 0.5 + 0.5;
          return (
            <circle
              key={`${i}-${j}`}
              cx={i * 44 + 22}
              cy={j * 44 + 22}
              r={1.5}
              fill={BRAND_TEAL}
              opacity={opacity * (0.3 + wave * 0.7)}
            />
          );
        })
      )}
    </>
  );
}

function Heartbeat({ t, opacity }: { t: number; opacity: number }) {
  const phase = (t * 1.8) % 1;
  const w = 340;
  const h = 50;
  const pts: [number, number][] = [
    [0, h / 2], [w * 0.12, h / 2], [w * 0.18, h / 2],
    [w * 0.22, h * 0.08], [w * 0.27, h * 0.92], [w * 0.31, h * 0.03],
    [w * 0.37, h / 2], [w * 0.5, h / 2],
    [w * 0.54, h / 2], [w * 0.58, h * 0.15], [w * 0.62, h * 0.85],
    [w * 0.66, h * 0.05], [w * 0.72, h / 2], [w, h / 2],
  ];
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const dashLen = 900;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={d} fill="none" stroke={BRAND_TEAL} strokeWidth={1.5} opacity={opacity * 0.15} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={d}
        fill="none"
        stroke={BRAND_TEAL}
        strokeWidth={2}
        strokeDasharray={dashLen}
        strokeDashoffset={dashLen * (1 - phase)}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />
    </svg>
  );
}

function ArcSweep({ cx, cy, r, t, color, delay = 0 }: {
  cx: number; cy: number; r: number; t: number; color: string; delay?: number;
}) {
  const angle = ((t + delay) % 1) * Math.PI * 2;
  const sweep = Math.PI * 1.2;
  const startAngle = angle;
  const endAngle = angle + sweep;
  const x1 = cx + Math.cos(startAngle) * r;
  const y1 = cy + Math.sin(startAngle) * r;
  const x2 = cx + Math.cos(endAngle) * r;
  const y2 = cy + Math.sin(endAngle) * r;
  const largeArc = sweep > Math.PI ? 1 : 0;
  return (
    <path
      d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      opacity={0.35}
      strokeLinecap="round"
    />
  );
}

export function FysyoAnimation() {
  const t = useCycle(8000);

  const logoEntrance = useEntrance(200, 900);
  const tagEntrance = useEntrance(900, 700);
  const heartEntrance = useEntrance(1400, 600);
  const subtitleEntrance = useEntrance(1800, 600);

  const cx = 640;
  const cy = 310;

  const logoY = cy - 40 + (1 - logoEntrance) * 30;
  const logoScale = 0.5 + logoEntrance * 0.5;

  const particles = [
    { x: 70, baseY: 560, delay: 0, size: 2.5, color: BRAND_TEAL },
    { x: 130, baseY: 600, delay: 0.4, size: 1.5, color: BRAND_CYAN },
    { x: 200, baseY: 540, delay: 0.7, size: 3, color: BRAND_GREEN },
    { x: 1100, baseY: 550, delay: 0.2, size: 2, color: BRAND_TEAL },
    { x: 1160, baseY: 590, delay: 0.6, size: 3, color: BRAND_CYAN },
    { x: 1220, baseY: 570, delay: 0.9, size: 1.5, color: BRAND_GREEN },
    { x: 320, baseY: 650, delay: 0.3, size: 2, color: BRAND_TEAL },
    { x: 960, baseY: 640, delay: 0.8, size: 2.5, color: BRAND_CYAN },
  ];

  return (
    <div
      className="w-full h-screen overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, ${BRAND_MID} 60%, #091828 100%)` }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BRAND_TEAL} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BRAND_TEAL} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BRAND_CYAN} stopOpacity="0.07" />
            <stop offset="100%" stopColor={BRAND_CYAN} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BRAND_TEAL} stopOpacity="0.25" />
            <stop offset="100%" stopColor={BRAND_TEAL} stopOpacity="0" />
          </radialGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="clip">
            <rect x="0" y="0" width="1280" height="720" />
          </clipPath>
        </defs>

        <g clipPath="url(#clip)">
          <GridDots cols={30} rows={17} t={t} opacity={0.08} />

          <circle cx={cx} cy={cy} r={500} fill="url(#glow1)" filter="url(#softBlur)" />
          <circle cx={cx} cy={cy} r={280} fill="url(#glow2)" filter="url(#softBlur)" />

          {particles.map((p, i) => (
            <FloatingParticle key={i} {...p} t={t} />
          ))}

          <ArcSweep cx={cx} cy={cy} r={260} t={t} color={BRAND_TEAL} delay={0} />
          <ArcSweep cx={cx} cy={cy} r={300} t={t} color={BRAND_CYAN} delay={0.5} />
          <ArcSweep cx={cx} cy={cy} r={230} t={t} color={BRAND_GREEN} delay={0.25} />

          <circle cx={cx} cy={cy} r={210 + Math.sin(t * Math.PI * 2) * 8} fill="none" stroke={BRAND_TEAL} strokeWidth={0.5} opacity={0.1} strokeDasharray="6 14" />
          <circle cx={cx} cy={cy} r={270 + Math.sin(t * Math.PI * 2 + 1) * 6} fill="none" stroke={BRAND_CYAN} strokeWidth={0.5} opacity={0.07} strokeDasharray="4 18" />

          <PulseRing cx={cx} cy={cy} t={t} delay={0} maxR={220} />
          <PulseRing cx={cx} cy={cy} t={t} delay={0.33} maxR={220} />
          <PulseRing cx={cx} cy={cy} t={t} delay={0.66} maxR={220} />

          <OrbitDot cx={cx} cy={cy} t={t} delay={0} radius={250} color={BRAND_TEAL} size={3} />
          <OrbitDot cx={cx} cy={cy} t={t} delay={0.5} radius={250} color={BRAND_GREEN} size={2.5} />
          <OrbitDot cx={cx} cy={cy} t={t} delay={0.25} radius={290} color={BRAND_CYAN} size={2} />
          <OrbitDot cx={cx} cy={cy} t={t} delay={0.75} radius={290} color={BRAND_TEAL} size={2} />

          <circle
            cx={cx} cy={cy}
            r={190}
            fill="url(#logoGlow)"
            filter="url(#softBlur)"
            opacity={logoEntrance}
          />

          <g
            transform={`translate(${cx}, ${logoY}) scale(${logoScale}) translate(-220, -75)`}
            style={{ opacity: logoEntrance }}
          >
            <image
              href="/__mockup/images/fysyo-logo.png"
              x={0}
              y={0}
              width={440}
              height={150}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          <g opacity={tagEntrance} transform={`translate(0, ${(1 - tagEntrance) * 15})`}>
            <text
              x={cx}
              y={440}
              textAnchor="middle"
              fontSize={13}
              fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
              fontWeight={400}
              fill={BRAND_TEAL}
              letterSpacing="0.38em"
            >
              PHYSIOTHERAPY &amp; MOVEMENT SCIENCE
            </text>
          </g>

          <g opacity={heartEntrance} transform={`translate(${cx - 170}, 465)`}>
            <Heartbeat t={t} opacity={heartEntrance} />
          </g>

          <g opacity={subtitleEntrance} transform={`translate(0, ${(1 - subtitleEntrance) * 10})`}>
            <text
              x={cx}
              y={538}
              textAnchor="middle"
              fontSize={11}
              fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
              fontWeight={300}
              fill="white"
              letterSpacing="0.22em"
              opacity={0.4}
            >
              MOVE BETTER · LIVE STRONGER · RECOVER FASTER
            </text>
          </g>

          <g opacity={subtitleEntrance * 0.6}>
            <line x1={cx - 220} y1={562} x2={cx - 20} y2={562} stroke={BRAND_TEAL} strokeWidth={0.5} opacity={0.3} />
            <circle cx={cx} cy={562} r={2} fill={BRAND_TEAL} opacity={0.5} />
            <line x1={cx + 20} y1={562} x2={cx + 220} y2={562} stroke={BRAND_TEAL} strokeWidth={0.5} opacity={0.3} />
          </g>

          <g opacity={subtitleEntrance * 0.35}>
            <text
              x={cx}
              y={695}
              textAnchor="middle"
              fontSize={9}
              fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
              fontWeight={300}
              fill="white"
              letterSpacing="0.25em"
            >
              YOUR RECOVERY STARTS HERE
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
