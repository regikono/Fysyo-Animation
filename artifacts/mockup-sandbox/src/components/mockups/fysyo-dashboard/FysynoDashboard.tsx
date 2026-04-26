import { useEffect, useRef, useState } from "react";

/* ─── Brand ─────────────────────────────────────────────── */
const T = "#00C9B1";   // teal
const C = "#00B4D8";   // cyan
const G = "#00D484";   // green
const O = "#FF6B35";   // orange
const BG = "#0A1220";
const CARD = "#0E1D30";
const BD = "#1A2E44";
const MID = "#7090A8";

/* ─── Timeline scenes ────────────────────────────────────── */
// Each scene: { label, duration (ms), cursorTo: {x,y}, click: bool, activeNav, expandCard, scrollY }
type Scene = {
  duration: number;
  cursor: { x: number; y: number };
  click?: boolean;
  activeNav: number;    // 0=dash,1=patients,2=appts,3=exercises
  activeCard?: number;  // which stat card glows
  expandRow?: number;   // which appt row highlights
  scrollY: number;      // simulated scroll offset px
  highlight?: string;   // element id to pulse
};

const SCENES: Scene[] = [
  // Open app → dashboard
  { duration: 1800, cursor: { x: 360, y: 160 }, activeNav: 0, scrollY: 0, activeCard: undefined },
  // Hover stat card 0
  { duration: 1200, cursor: { x: 376, y: 248 }, activeNav: 0, scrollY: 0, activeCard: 0 },
  // Hover stat card 2
  { duration: 1200, cursor: { x: 700, y: 248 }, activeNav: 0, scrollY: 0, activeCard: 2 },
  // Click on Appointments nav
  { duration: 900, cursor: { x: 112, y: 294 }, click: true, activeNav: 2, scrollY: 0 },
  // Hover first appointment row
  { duration: 1400, cursor: { x: 560, y: 420 }, activeNav: 2, scrollY: 0, expandRow: 0 },
  // Hover second appointment row
  { duration: 1200, cursor: { x: 560, y: 480 }, activeNav: 2, scrollY: 0, expandRow: 1 },
  // Click Patients nav
  { duration: 900, cursor: { x: 112, y: 254 }, click: true, activeNav: 1, scrollY: 0 },
  // Scroll down
  { duration: 1400, cursor: { x: 640, y: 480 }, activeNav: 1, scrollY: 80 },
  // Hover patient card
  { duration: 1400, cursor: { x: 400, y: 460 }, activeNav: 1, scrollY: 80, activeCard: 1 },
  // Back to Dashboard
  { duration: 900, cursor: { x: 112, y: 214 }, click: true, activeNav: 0, scrollY: 0 },
  // Rest on chart area
  { duration: 1600, cursor: { x: 820, y: 480 }, activeNav: 0, scrollY: 0, activeCard: 3 },
];

/* ─── Cursor component ───────────────────────────────────── */
function Cursor({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      pointerEvents: "none",
      zIndex: 100,
      transition: "left 0.6s cubic-bezier(0.4,0,0.2,1), top 0.6s cubic-bezier(0.4,0,0.2,1)",
    }}>
      {clicking && (
        <div style={{
          position: "absolute",
          top: -14,
          left: -14,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `${T}30`,
          border: `1.5px solid ${T}80`,
          animation: "ripple 0.4s ease-out forwards",
        }} />
      )}
      <svg width={22} height={26} viewBox="0 0 22 26" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
        <path d="M2 2 L2 20 L7 15 L11 23 L14 22 L10 14 L17 14 Z"
          fill="white" stroke="#1a1a2e" strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─── Nav items ──────────────────────────────────────────── */
const NAV = [
  { icon: "◫", label: "Dashboard" },
  { icon: "◎", label: "Patients" },
  { icon: "◷", label: "Appointments" },
  { icon: "◈", label: "Exercises" },
  { icon: "◉", label: "Analytics" },
  { icon: "◌", label: "Messages", badge: 3 },
];

function Sidebar({ activeNav }: { activeNav: number }) {
  return (
    <div style={{
      width: 180,
      minWidth: 180,
      background: "#07101C",
      borderRight: `1px solid ${BD}`,
      display: "flex",
      flexDirection: "column",
      padding: "18px 0",
    }}>
      <div style={{ padding: "0 16px 22px" }}>
        <img src="/__mockup/images/fysyo-logo.png" alt="FYSYO" style={{ width: 120 }} />
      </div>
      {NAV.map((n, i) => (
        <div key={n.label} style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 14px",
          margin: "1px 8px",
          borderRadius: 8,
          background: activeNav === i ? `${T}18` : "transparent",
          color: activeNav === i ? T : MID,
          fontWeight: activeNav === i ? 600 : 400,
          fontSize: 12,
          position: "relative",
          transition: "background 0.3s, color 0.3s",
        }}>
          {activeNav === i && (
            <div style={{
              position: "absolute",
              left: -8,
              top: "18%",
              bottom: "18%",
              width: 3,
              background: T,
              borderRadius: "0 3px 3px 0",
            }} />
          )}
          <span style={{ fontSize: 14 }}>{n.icon}</span>
          <span>{n.label}</span>
          {n.badge && (
            <span style={{
              marginLeft: "auto",
              background: O,
              color: "white",
              fontSize: 9,
              fontWeight: 700,
              borderRadius: 10,
              padding: "1px 6px",
            }}>{n.badge}</span>
          )}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ padding: "14px 16px", borderTop: `1px solid ${BD}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: `${C}22`, border: `1.5px solid ${C}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: C,
          }}>CL</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "white" }}>Dr. C. Lima</div>
            <div style={{ fontSize: 9, color: MID }}>Physiotherapist</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard panel ────────────────────────────────────── */
const STATS = [
  { label: "Today's Sessions", value: "12", color: T },
  { label: "Active Patients", value: "84", color: C },
  { label: "Recovery Rate", value: "91%", color: G },
  { label: "Avg Progress", value: "78%", color: O },
];

const APPTS = [
  { name: "Maria Silva", time: "09:00", type: "Shoulder Rehab", status: "In Progress", ini: "MS", color: T },
  { name: "João Costa", time: "10:30", type: "Post-Surgery Knee", status: "Upcoming", ini: "JC", color: C },
  { name: "Ana Rodrigues", time: "11:15", type: "Lower Back Pain", status: "Upcoming", ini: "AR", color: G },
  { name: "Pedro Alves", time: "13:00", type: "Sports Recovery", status: "Confirmed", ini: "PA", color: T },
];

const PATIENTS_D = [
  { name: "Luís Ferreira", progress: 88, condition: "Rotator Cuff", ini: "LF", color: T },
  { name: "Carla Nunes", progress: 65, condition: "Lumbar Disc", ini: "CN", color: C },
  { name: "Rui Barros", progress: 94, condition: "ACL Recovery", ini: "RB", color: G },
  { name: "Inês Sousa", progress: 42, condition: "Plantar Fascia", ini: "IS", color: O },
  { name: "Tiago Melo", progress: 73, condition: "Cervical Tension", ini: "TM", color: T },
  { name: "Sara Faria", progress: 57, condition: "Ankle Sprain", ini: "SF", color: C },
];

const BAR_DATA = [62, 74, 58, 81, 90, 76, 88];
const BAR_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function DashboardView({ activeCard, scrollY }: { activeCard?: number; scrollY: number }) {
  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Topbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 22px", borderBottom: `1px solid ${BD}`, background: "#08101E",
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Good morning, Dr. Lima 👋</div>
          <div style={{ fontSize: 10, color: MID }}>Saturday, 26 Apr · 12 sessions today</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            background: CARD, border: `1px solid ${BD}`, borderRadius: 8,
            padding: "6px 14px", color: MID, fontSize: 11, display: "flex", gap: 6, alignItems: "center",
          }}>
            <span>🔍</span><span>Search...</span>
          </div>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: CARD,
            border: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>🔔</div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{
        flex: 1,
        overflow: "hidden",
        padding: "18px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transform: `translateY(-${scrollY}px)`,
        transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Stat cards */}
        <div style={{ display: "flex", gap: 12 }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              flex: 1, background: CARD, border: `1px solid ${activeCard === i ? s.color + "66" : BD}`,
              borderRadius: 12, padding: "14px 16px", position: "relative", overflow: "hidden",
              boxShadow: activeCard === i ? `0 0 20px ${s.color}22` : "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "12px 12px 0 0" }} />
              <div style={{ fontSize: 9, color: MID, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: s.color }}>↑ trending up</div>
            </div>
          ))}
        </div>

        {/* Main row */}
        <div style={{ display: "flex", gap: 16, flex: 1 }}>
          {/* Appointments */}
          <div style={{
            flex: 1.2, background: CARD, border: `1px solid ${BD}`, borderRadius: 12, padding: "16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Today's Appointments</span>
              <span style={{ fontSize: 10, color: T }}>View all →</span>
            </div>
            {APPTS.map((a, i) => (
              <div key={a.name} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 8, marginBottom: 6,
                background: "#0A1828", border: `1px solid ${BD}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: `${a.color}22`, border: `1px solid ${a.color}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: a.color, flexShrink: 0,
                }}>{a.ini}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 1 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: MID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.type}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: T, fontWeight: 600, marginBottom: 3 }}>{a.time}</div>
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                    background: `${a.color}1A`, color: a.color,
                  }}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Bar chart */}
            <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Weekly Sessions</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70 }}>
                {BAR_DATA.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: "100%", height: (v / 100) * 58,
                      background: i === 4 ? T : `${T}44`,
                      borderRadius: "3px 3px 0 0",
                    }} />
                    <span style={{ fontSize: 9, color: MID }}>{BAR_DAYS[i]}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <span style={{ fontSize: 10, color: T, fontWeight: 600 }}>↑ 12% this week</span>
              </div>
            </div>

            {/* Compliance */}
            <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Compliance</div>
              {[
                { label: "Home exercises", v: 87, color: T },
                { label: "Clinic sessions", v: 95, color: C },
                { label: "Self-care", v: 72, color: G },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: MID }}>{item.label}</span>
                    <span style={{ fontSize: 10, color: item.color, fontWeight: 700 }}>{item.v}%</span>
                  </div>
                  <div style={{ height: 5, background: BD, borderRadius: 5 }}>
                    <div style={{ height: "100%", width: `${item.v}%`, background: item.color, borderRadius: 5 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientsView({ activeCard, scrollY }: { activeCard?: number; scrollY: number }) {
  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 22px", borderBottom: `1px solid ${BD}`, background: "#08101E",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Patients</div>
        <div style={{
          background: T, color: BG, fontSize: 11, fontWeight: 700,
          borderRadius: 8, padding: "6px 14px", cursor: "pointer",
        }}>+ New Patient</div>
      </div>
      <div style={{
        flex: 1, padding: "18px 22px",
        transform: `translateY(-${scrollY}px)`,
        transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {PATIENTS_D.map((p, i) => (
            <div key={p.name} style={{
              background: CARD,
              border: `1px solid ${activeCard === i ? p.color + "66" : BD}`,
              borderRadius: 12,
              padding: "16px",
              boxShadow: activeCard === i ? `0 0 24px ${p.color}22` : "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: `${p.color}22`, border: `1.5px solid ${p.color}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: p.color,
                }}>{p.ini}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: MID }}>{p.condition}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: MID }}>Recovery</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.progress}%</span>
              </div>
              <div style={{ height: 6, background: BD, borderRadius: 6 }}>
                <div style={{ height: "100%", width: `${p.progress}%`, background: p.color, borderRadius: 6, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppointmentsView({ expandRow }: { expandRow?: number }) {
  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 22px", borderBottom: `1px solid ${BD}`, background: "#08101E",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Appointments</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Day", "Week", "Month"].map((v, i) => (
            <div key={v} style={{
              padding: "5px 12px", borderRadius: 8, fontSize: 11,
              background: i === 0 ? `${T}22` : CARD,
              color: i === 0 ? T : MID,
              border: `1px solid ${i === 0 ? T + "44" : BD}`,
            }}>{v}</div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: "18px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
        {APPTS.concat([
          { name: "Miguel Torres", time: "15:00", type: "Hip Replacement Follow-up", status: "Confirmed", ini: "MT", color: G },
          { name: "Beatriz Lima", time: "16:30", type: "Wrist Tendonitis", status: "Confirmed", ini: "BL", color: O },
        ]).map((a, i) => (
          <div key={a.name} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: expandRow === i ? "14px 16px" : "10px 16px",
            borderRadius: 12,
            background: expandRow === i ? `${a.color}0E` : CARD,
            border: `1px solid ${expandRow === i ? a.color + "55" : BD}`,
            boxShadow: expandRow === i ? `0 0 20px ${a.color}15` : "none",
            transition: "all 0.35s ease",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: MID, width: 48, flexShrink: 0 }}>{a.time}</div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `${a.color}22`, border: `1.5px solid ${a.color}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: a.color, flexShrink: 0,
            }}>{a.ini}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: MID }}>{a.type}</div>
              {expandRow === i && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {["View Record", "Start Session", "Reschedule"].map(btn => (
                    <div key={btn} style={{
                      padding: "4px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                      background: btn === "Start Session" ? T : `${T}18`,
                      color: btn === "Start Session" ? BG : T,
                      cursor: "pointer",
                    }}>{btn}</div>
                  ))}
                </div>
              )}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
              background: `${a.color}1A`, color: a.color,
            }}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export function FysynoDashboard() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [clicking, setClicking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scene = SCENES[sceneIdx];

  useEffect(() => {
    if (scene.click) {
      const t = setTimeout(() => {
        setClicking(true);
        setTimeout(() => setClicking(false), 300);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [sceneIdx, scene.click]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setSceneIdx(i => (i + 1) % SCENES.length);
    }, scene.duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [sceneIdx, scene.duration]);

  const cur = scene.cursor;

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: `linear-gradient(145deg, #060D18 0%, #0A1628 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: 700,
        height: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${T}0A 0%, transparent 70%)`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      {/* Laptop shell */}
      <div style={{
        width: 1100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* Screen */}
        <div style={{
          width: "100%",
          background: "#1A2A3A",
          borderRadius: "14px 14px 0 0",
          padding: "8px 8px 0",
          boxShadow: `0 0 60px rgba(0,201,177,0.12), 0 30px 80px rgba(0,0,0,0.8)`,
        }}>
          {/* Browser chrome */}
          <div style={{
            background: "#0D1A28",
            borderRadius: "8px 8px 0 0",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: `1px solid ${BD}`,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57", "#FFBD2E", "#28C840"].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1,
              background: "#0A1520",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 10,
              color: MID,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <span style={{ color: T, fontSize: 9 }}>🔒</span>
              <span>app.fysyo.pt/dashboard</span>
            </div>
          </div>

          {/* App window */}
          <div style={{
            height: 560,
            background: BG,
            display: "flex",
            position: "relative",
            overflow: "hidden",
            borderRadius: "0 0 4px 4px",
          }}>
            <Sidebar activeNav={scene.activeNav} />

            {scene.activeNav === 0 && (
              <DashboardView activeCard={scene.activeCard} scrollY={scene.scrollY} />
            )}
            {scene.activeNav === 1 && (
              <PatientsView activeCard={scene.activeCard} scrollY={scene.scrollY} />
            )}
            {scene.activeNav === 2 && (
              <AppointmentsView expandRow={scene.expandRow} />
            )}
            {scene.activeNav >= 3 && (
              <DashboardView activeCard={scene.activeCard} scrollY={0} />
            )}

            {/* Cursor */}
            <Cursor x={cur.x} y={cur.y} clicking={clicking} />
          </div>
        </div>

        {/* Laptop base */}
        <div style={{
          width: "100%",
          height: 18,
          background: "linear-gradient(to bottom, #1E3040, #142030)",
          borderRadius: "0 0 6px 6px",
        }} />
        <div style={{
          width: "115%",
          height: 10,
          background: "linear-gradient(to bottom, #111E2C, #0A1520)",
          borderRadius: "0 0 40px 40px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }} />
        <div style={{
          width: "30%",
          height: 4,
          background: "#0D1A28",
          borderRadius: "0 0 6px 6px",
          marginTop: -4,
        }} />
      </div>
    </div>
  );
}
