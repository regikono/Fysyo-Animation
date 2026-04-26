import { useEffect, useRef, useState } from "react";

const BRAND_TEAL = "#00C9B1";
const BRAND_DARK = "#0A1628";
const BRAND_MID = "#0D2040";
const BRAND_ACCENT = "#FF6B35";

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

function HumanFigure({ x, y, size, phase }: { x: number; y: number; size: number; phase: number }) {
  const armAngle = Math.sin(phase * Math.PI * 2) * 30;
  const legAngle = Math.sin(phase * Math.PI * 2 + Math.PI) * 25;
  const headY = y - size * 1.65;
  const bodyLen = size * 0.8;
  const shoulderY = y - size * 1.1;
  const hipY = y - size * 0.3;

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const armLen = size * 0.6;
  const legLen = size * 0.7;

  return (
    <g>
      <circle cx={x} cy={headY} r={size * 0.18} fill="none" stroke={BRAND_TEAL} strokeWidth={2.5} />
      <line x1={x} y1={headY + size * 0.18} x2={x} y2={hipY} stroke={BRAND_TEAL} strokeWidth={2.5} strokeLinecap="round" />
      <line
        x1={x} y1={shoulderY}
        x2={x + Math.cos(rad(armAngle - 90)) * armLen}
        y2={shoulderY + Math.sin(rad(armAngle - 90)) * armLen}
        stroke={BRAND_TEAL} strokeWidth={2.5} strokeLinecap="round"
      />
      <line
        x1={x} y1={shoulderY}
        x2={x + Math.cos(rad(-armAngle - 90)) * armLen}
        y2={shoulderY + Math.sin(rad(-armAngle - 90)) * armLen}
        stroke={BRAND_TEAL} strokeWidth={2.5} strokeLinecap="round"
      />
      <line
        x1={x} y1={hipY}
        x2={x + Math.cos(rad(legAngle + 90)) * legLen}
        y2={hipY + Math.sin(rad(legAngle + 90)) * legLen}
        stroke={BRAND_TEAL} strokeWidth={2.5} strokeLinecap="round"
      />
      <line
        x1={x} y1={hipY}
        x2={x + Math.cos(rad(-legAngle + 90)) * legLen}
        y2={hipY + Math.sin(rad(-legAngle + 90)) * legLen}
        stroke={BRAND_TEAL} strokeWidth={2.5} strokeLinecap="round"
      />
    </g>
  );
}

function Heartbeat({ t }: { t: number }) {
  const w = 300;
  const h = 60;
  const phase = (t * 2) % 1;

  const pts: [number, number][] = [
    [0, h / 2],
    [w * 0.15, h / 2],
    [w * 0.2, h / 2],
    [w * 0.25, h * 0.1],
    [w * 0.3, h * 0.9],
    [w * 0.35, h * 0.05],
    [w * 0.42, h / 2],
    [w * 0.55, h / 2],
    [w * 0.6, h / 2],
    [w * 0.65, h * 0.2],
    [w * 0.7, h * 0.8],
    [w * 0.75, h * 0.1],
    [w * 0.8, h / 2],
    [w, h / 2],
  ];

  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

  const dashLen = 700;
  const offset = dashLen * (1 - phase);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={d}
        fill="none"
        stroke={BRAND_ACCENT}
        strokeWidth={2}
        strokeDasharray={dashLen}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={d} fill="none" stroke={BRAND_ACCENT} strokeWidth={1} opacity={0.15} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PulseRing({ cx, cy, t, delay = 0, color = BRAND_TEAL }: { cx: number; cy: number; t: number; delay?: number; color?: string }) {
  const phase = ((t + delay) % 1);
  const r = 10 + phase * 80;
  const opacity = 1 - phase;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      opacity={opacity * 0.5}
    />
  );
}

function SpineWave({ t }: { t: number }) {
  const points = 12;
  const w = 40;
  const h = 300;
  const amplitude = 10;

  const path = Array.from({ length: points + 1 }, (_, i) => {
    const y = (i / points) * h;
    const wave = Math.sin((i / points) * Math.PI * 3 + t * Math.PI * 4) * amplitude;
    return `${i === 0 ? "M" : "L"} ${w / 2 + wave} ${y}`;
  }).join(" ");

  const circles = Array.from({ length: points }, (_, i) => {
    const y = ((i + 0.5) / points) * h;
    const wave = Math.sin(((i + 0.5) / points) * Math.PI * 3 + t * Math.PI * 4) * amplitude;
    return { x: w / 2 + wave, y };
  });

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={path} fill="none" stroke={BRAND_TEAL} strokeWidth={1.5} opacity={0.3} />
      {circles.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={3} fill={BRAND_TEAL}
          opacity={0.4 + Math.sin(t * Math.PI * 2 + i * 0.5) * 0.3}
        />
      ))}
    </svg>
  );
}

function FloatingParticle({ x, y, t, size, speed, delay }: {
  x: number; y: number; t: number; size: number; speed: number; delay: number;
}) {
  const phase = (t * speed + delay) % 1;
  const py = y - phase * 120;
  const opacity = phase < 0.2 ? phase / 0.2 : phase > 0.8 ? (1 - phase) / 0.2 : 1;

  return (
    <circle cx={x} cy={py} r={size} fill={BRAND_TEAL} opacity={opacity * 0.4} />
  );
}

function GridDots({ cols, rows, t }: { cols: number; rows: number; t: number }) {
  const dots = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const wave = Math.sin(t * Math.PI * 2 + i * 0.4 + j * 0.3) * 0.5 + 0.5;
      dots.push(
        <circle
          key={`${i}-${j}`}
          cx={i * 40 + 20}
          cy={j * 40 + 20}
          r={1.5}
          fill={BRAND_TEAL}
          opacity={0.05 + wave * 0.12}
        />
      );
    }
  }
  return <>{dots}</>;
}

function LetterPath({ letter, x, y, progress, fontSize = 120 }: {
  letter: string; x: number; y: number; progress: number; fontSize?: number;
}) {
  const scale = progress < 0.6 ? progress / 0.6 : 1;
  const opacity = progress;
  const translateY = progress < 0.6 ? 30 * (1 - progress / 0.6) : 0;

  return (
    <text
      x={x}
      y={y + translateY}
      fontSize={fontSize}
      fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
      fontWeight="900"
      fill="white"
      opacity={opacity}
      style={{ transform: `scale(${scale})`, transformOrigin: `${x}px ${y}px`, letterSpacing: "0.05em" }}
    >
      {letter}
    </text>
  );
}

export function FysyoAnimation() {
  const t = useCycle(6000);
  const [logoPhase, setLogoPhase] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const timeRef = useRef(0);

  useEffect(() => {
    const startTime = Date.now();
    const update = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      timeRef.current = elapsed;

      setLogoPhase(Math.min(1, elapsed / 1.5));
      if (elapsed > 1.2) setTaglineVisible(true);
      if (elapsed > 1.8) setSubtitleVisible(true);
    };
    const interval = setInterval(update, 16);
    return () => clearInterval(interval);
  }, []);

  const logoProgress = logoPhase;
  const letterDelay = 0.18;
  const letters = ["F", "Y", "S", "Y", "O"];
  const letterSpacing = 88;
  const logoStartX = 640 - (letters.length * letterSpacing) / 2;

  const particles = [
    { x: 80, y: 500, size: 3, speed: 0.4, delay: 0 },
    { x: 140, y: 450, size: 2, speed: 0.3, delay: 0.3 },
    { x: 200, y: 520, size: 4, speed: 0.5, delay: 0.6 },
    { x: 1100, y: 480, size: 3, speed: 0.35, delay: 0.1 },
    { x: 1160, y: 440, size: 2, speed: 0.45, delay: 0.5 },
    { x: 1220, y: 510, size: 4, speed: 0.3, delay: 0.8 },
    { x: 350, y: 600, size: 2, speed: 0.4, delay: 0.2 },
    { x: 950, y: 580, size: 3, speed: 0.38, delay: 0.7 },
  ];

  const figPhase = (t * 1.5) % 1;

  return (
    <div
      className="w-full h-screen overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_MID} 50%, #0A1E3D 100%)` }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">

        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BRAND_TEAL} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BRAND_TEAL} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="accentGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BRAND_ACCENT} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BRAND_ACCENT} stopOpacity="0" />
          </radialGradient>
          <filter id="blur4">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="blur2">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BRAND_TEAL} stopOpacity="0" />
            <stop offset="50%" stopColor={BRAND_TEAL} stopOpacity="0.6" />
            <stop offset="100%" stopColor={BRAND_TEAL} stopOpacity="0" />
          </linearGradient>
          <clipPath id="mainClip">
            <rect x="0" y="0" width="1280" height="720" />
          </clipPath>
        </defs>

        <g clipPath="url(#mainClip)">
          <GridDots cols={32} rows={18} t={t} />

          <circle cx={640} cy={360} r={400} fill="url(#centerGlow)" />
          <circle cx={640} cy={360} r={200} fill="url(#accentGlow)" />

          {particles.map((p, i) => (
            <FloatingParticle key={i} {...p} t={t} />
          ))}

          <g transform="translate(60, 200)">
            <SpineWave t={t} />
          </g>
          <g transform="translate(1180, 200)">
            <SpineWave t={t} />
          </g>

          <g transform="translate(160, 400)">
            <PulseRing cx={0} cy={0} t={t} delay={0} />
            <PulseRing cx={0} cy={0} t={t} delay={0.33} />
            <PulseRing cx={0} cy={0} t={t} delay={0.66} />
          </g>
          <g transform="translate(1120, 400)">
            <PulseRing cx={0} cy={0} t={t} delay={0.15} color={BRAND_ACCENT} />
            <PulseRing cx={0} cy={0} t={t} delay={0.48} color={BRAND_ACCENT} />
            <PulseRing cx={0} cy={0} t={t} delay={0.81} color={BRAND_ACCENT} />
          </g>

          <g transform="translate(220, 510)">
            <HumanFigure x={0} y={0} size={60} phase={figPhase} />
          </g>
          <g transform="translate(1060, 510)">
            <HumanFigure x={0} y={0} size={60} phase={(figPhase + 0.4) % 1} />
          </g>

          <line
            x1={0} y1={360}
            x2={Math.sin(t * Math.PI * 2) * 200 + 480}
            y2={360}
            stroke="url(#lineGrad)"
            strokeWidth={1}
            opacity={0.5}
          />
          <line
            x1={1280} y1={360}
            x2={1280 - (Math.sin(t * Math.PI * 2 + Math.PI) * 200 + 480)}
            y2={360}
            stroke="url(#lineGrad)"
            strokeWidth={1}
            opacity={0.5}
          />

          <circle
            cx={640}
            cy={360}
            r={180 + Math.sin(t * Math.PI * 2) * 15}
            fill="none"
            stroke={BRAND_TEAL}
            strokeWidth={0.5}
            opacity={0.12}
            strokeDasharray="4 12"
          />
          <circle
            cx={640}
            cy={360}
            r={240 + Math.sin(t * Math.PI * 2 + 1) * 10}
            fill="none"
            stroke={BRAND_TEAL}
            strokeWidth={0.5}
            opacity={0.07}
            strokeDasharray="4 20"
          />

          {letters.map((letter, i) => {
            const progress = Math.max(0, Math.min(1, logoProgress * (1 + letters.length * letterDelay) - i * letterDelay));
            return (
              <LetterPath
                key={i}
                letter={letter}
                x={logoStartX + i * letterSpacing}
                y={310}
                progress={progress}
              />
            );
          })}

          <rect
            x={logoStartX - 10}
            y={320}
            width={(letterSpacing * letters.length) * logoProgress}
            height={3}
            fill={BRAND_TEAL}
            rx={1.5}
          />

          <text
            x={640}
            y={380}
            textAnchor="middle"
            fontSize={15}
            fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
            fontWeight="400"
            fill={BRAND_TEAL}
            letterSpacing="0.35em"
            opacity={taglineVisible ? 1 : 0}
            style={{ transition: "opacity 0.8s ease" }}
          >
            PHYSIOTHERAPY & MOVEMENT SCIENCE
          </text>

          <g opacity={subtitleVisible ? 1 : 0} style={{ transition: "opacity 0.8s ease" }}>
            <text
              x={640}
              y={430}
              textAnchor="middle"
              fontSize={12}
              fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
              fontWeight="300"
              fill="white"
              letterSpacing="0.15em"
              opacity={0.5}
            >
              MOVE BETTER · LIVE STRONGER
            </text>

            <g transform="translate(530, 455)">
              <Heartbeat t={t} />
            </g>
          </g>

          {[0, 0.25, 0.5, 0.75].map((offset, i) => {
            const angle = ((t + offset) % 1) * Math.PI * 2;
            const rx = 320;
            const ry = 180;
            const cx = 640 + Math.cos(angle) * rx;
            const cy = 360 + Math.sin(angle) * ry;
            const size = 1.5 + Math.sin(angle) * 1;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={size}
                fill={i % 2 === 0 ? BRAND_TEAL : BRAND_ACCENT}
                opacity={0.7}
              />
            );
          })}

          <g transform="translate(0, 680)" opacity={subtitleVisible ? 0.4 : 0} style={{ transition: "opacity 1s ease" }}>
            <text
              x={640}
              y={0}
              textAnchor="middle"
              fontSize={10}
              fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
              fontWeight="300"
              fill="white"
              letterSpacing="0.2em"
            >
              YOUR RECOVERY STARTS HERE
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
