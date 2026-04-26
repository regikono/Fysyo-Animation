const TEAL = "#00C9B1";
const CYAN = "#00B4D8";
const GREEN = "#00D484";
const ORANGE = "#FF6B35";
const DARK = "#0A1220";
const CARD = "#0E1D30";
const BORDER = "#1A2E44";
const TEXT_MID = "#7090A8";
const TEXT_DIM = "#3D5A72";

const SIDEBAR_W = 220;

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard", active: true },
  { icon: "👤", label: "Patients", active: false },
  { icon: "📅", label: "Appointments", active: false },
  { icon: "🏃", label: "Exercises", active: false },
  { icon: "📊", label: "Analytics", active: false },
  { icon: "💬", label: "Messages", active: false, badge: 3 },
  { icon: "⚙️", label: "Settings", active: false },
];

const STATS = [
  { label: "Today's Sessions", value: "12", sub: "+2 from yesterday", color: TEAL, icon: "📋" },
  { label: "Active Patients", value: "84", sub: "6 new this week", color: CYAN, icon: "👥" },
  { label: "Recovery Rate", value: "91%", sub: "↑ 3% this month", color: GREEN, icon: "💪" },
  { label: "Avg. Progress", value: "78%", sub: "Across all programs", color: ORANGE, icon: "📈" },
];

const APPOINTMENTS = [
  { name: "Maria Silva", time: "09:00", type: "Shoulder Rehab", status: "In Progress", avatar: "MS" },
  { name: "João Costa", time: "10:30", type: "Post-Surgery Knee", status: "Upcoming", avatar: "JC" },
  { name: "Ana Rodrigues", time: "11:15", type: "Lower Back Pain", status: "Upcoming", avatar: "AR" },
  { name: "Pedro Alves", time: "13:00", type: "Sports Recovery", status: "Confirmed", avatar: "PA" },
  { name: "Sofia Mendes", time: "14:30", type: "Cervical Tension", status: "Confirmed", avatar: "SM" },
];

const PATIENTS = [
  { name: "Luís Ferreira", progress: 88, sessions: 14, condition: "Rotator Cuff", avatar: "LF" },
  { name: "Carla Nunes", progress: 65, sessions: 8, condition: "Lumbar Disc", avatar: "CN" },
  { name: "Rui Barros", progress: 94, sessions: 21, condition: "ACL Recovery", avatar: "RB" },
  { name: "Inês Sousa", progress: 42, sessions: 4, condition: "Plantar Fascia", avatar: "IS" },
];

const WEEKLY = [62, 74, 58, 81, 90, 76, 88];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Avatar({ initials, color = TEAL, size = 32 }: { initials: string; color?: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color + "22",
        border: `1.5px solid ${color}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        color: color,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function StatCard({ label, value, sub, color, icon }: typeof STATS[0]) {
  return (
    <div style={{
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 14,
      padding: "20px 22px",
      flex: 1,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "14px 14px 0 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: TEXT_MID, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 18 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "white", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 11, color: color, fontWeight: 500 }}>{sub}</div>
    </div>
  );
}

function ProgressBar({ value, color = TEAL, height = 6 }: { value: number; color?: string; height?: number }) {
  return (
    <div style={{ background: BORDER, borderRadius: height, height, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: height }} />
    </div>
  );
}

function BarChart() {
  const maxH = 80;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: maxH + 24, paddingBottom: 0 }}>
      {WEEKLY.map((v, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
          <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "100%",
              height: (v / 100) * maxH,
              background: i === 4 ? TEAL : `${TEAL}44`,
              borderRadius: "4px 4px 0 0",
              transition: "height 0.3s ease",
            }} />
          </div>
          <div style={{ fontSize: 10, color: TEXT_MID, fontWeight: 500 }}>{DAYS[i]}</div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    "In Progress": { bg: `${TEAL}22`, color: TEAL },
    "Upcoming": { bg: `${CYAN}18`, color: CYAN },
    "Confirmed": { bg: `${GREEN}18`, color: GREEN },
  };
  const s = map[status] ?? { bg: BORDER, color: TEXT_MID };
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontSize: 10,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 20,
      letterSpacing: "0.04em",
    }}>
      {status}
    </span>
  );
}

function DonutChart({ value, color = TEAL, size = 88 }: { value: number; color?: string; size?: number }) {
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BORDER} strokeWidth={10} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={800} fill="white">{value}%</text>
    </svg>
  );
}

function MiniSparkline({ data, color = TEAL, w = 80, h = 28 }: { data: number[]; color?: string; w?: number; h?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      <circle cx={pts.split(" ").at(-1)!.split(",")[0]} cy={pts.split(" ").at(-1)!.split(",")[1]} r={2.5} fill={color} />
    </svg>
  );
}

const SPARKLINES = [
  [55, 62, 70, 64, 74, 81, 90],
  [40, 48, 52, 60, 55, 65, 76],
  [70, 78, 85, 80, 88, 92, 94],
  [20, 28, 35, 38, 40, 40, 42],
];

export function FysynoDashboard() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: DARK,
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontSize: 13,
      color: "white",
      overflow: "hidden",
    }}>
      <div style={{
        width: SIDEBAR_W,
        minWidth: SIDEBAR_W,
        background: "#080F1C",
        borderRight: `1px solid ${BORDER}`,
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
      }}>
        <div style={{ padding: "0 20px 28px" }}>
          <img src="/__mockup/images/fysyo-logo.png" alt="FYSYO" style={{ width: 140, display: "block" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
          {NAV_ITEMS.map((item) => (
            <div key={item.label} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              background: item.active ? `${TEAL}18` : "transparent",
              color: item.active ? TEAL : TEXT_MID,
              fontWeight: item.active ? 600 : 400,
              cursor: "pointer",
              position: "relative",
            }}>
              {item.active && (
                <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, background: TEAL, borderRadius: "0 3px 3px 0" }} />
              )}
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ fontSize: 13 }}>{item.label}</span>
              {item.badge && (
                <div style={{
                  marginLeft: "auto",
                  background: ORANGE,
                  color: "white",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "1px 7px",
                }}>
                  {item.badge}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="DR" color={CYAN} size={34} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "white" }}>Dr. Carla Lima</div>
              <div style={{ fontSize: 10, color: TEXT_MID }}>Physiotherapist</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 28px",
          borderBottom: `1px solid ${BORDER}`,
          background: "#08101E",
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Good morning, Dr. Lima 👋</div>
            <div style={{ fontSize: 11, color: TEXT_MID, marginTop: 2 }}>Saturday, 26 April 2026 · 12 sessions scheduled today</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: TEXT_MID,
              fontSize: 12,
            }}>
              <span>🔍</span>
              <span>Search patients...</span>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: CARD,
              border: `1px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, cursor: "pointer",
            }}>🔔</div>
            <Avatar initials="DR" color={CYAN} size={36} />
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 16 }}>
            {STATS.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{
              flex: 1.4,
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              padding: "20px 22px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Today's Appointments</div>
                <span style={{ fontSize: 11, color: TEAL, cursor: "pointer", fontWeight: 500 }}>View all →</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {APPOINTMENTS.map((a) => (
                  <div key={a.name} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#0A1828",
                    border: `1px solid ${BORDER}`,
                  }}>
                    <Avatar initials={a.avatar} color={a.status === "In Progress" ? TEAL : CYAN} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: TEXT_MID }}>{a.type}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, marginBottom: 4 }}>{a.time}</div>
                      <StatusBadge status={a.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}>
              <div style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                padding: "20px 22px",
                flex: 1,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Weekly Sessions</div>
                  <div style={{ fontSize: 11, color: TEXT_MID }}>This week</div>
                </div>
                <BarChart />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: TEXT_MID }}>Peak: Friday · 90%</div>
                  <div style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>↑ 12% vs last week</div>
                </div>
              </div>

              <div style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                padding: "18px 22px",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Compliance Rate</div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <DonutChart value={87} color={TEAL} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: TEXT_MID, marginBottom: 8 }}>Exercise adherence this month</div>
                    {[
                      { label: "Home exercises", v: 87, color: TEAL },
                      { label: "Clinic sessions", v: 95, color: CYAN },
                      { label: "Self-care plans", v: 72, color: GREEN },
                    ].map((item) => (
                      <div key={item.label} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: TEXT_MID }}>{item.label}</span>
                          <span style={{ fontSize: 10, color: item.color, fontWeight: 600 }}>{item.v}%</span>
                        </div>
                        <ProgressBar value={item.v} color={item.color} height={4} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: "20px 22px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Patient Recovery Progress</div>
              <span style={{ fontSize: 11, color: TEAL, cursor: "pointer", fontWeight: 500 }}>View all patients →</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              {PATIENTS.map((p, i) => (
                <div key={p.name} style={{
                  background: "#0A1828",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: "16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Avatar initials={p.avatar} color={i % 2 === 0 ? TEAL : CYAN} size={36} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: TEXT_MID, marginTop: 1 }}>{p.condition}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: TEXT_MID }}>Recovery</span>
                    <span style={{ fontSize: 11, color: i % 2 === 0 ? TEAL : CYAN, fontWeight: 700 }}>{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} color={i % 2 === 0 ? TEAL : CYAN} height={5} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontSize: 10, color: TEXT_MID }}>{p.sessions} sessions</span>
                    <MiniSparkline data={SPARKLINES[i]} color={i % 2 === 0 ? TEAL : CYAN} />
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
