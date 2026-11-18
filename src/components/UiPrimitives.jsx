export function ScoreBar({ score, max = 10, color = "#00e676" }) {
  const safeScore = Number(score) || 0;
  const pct = Math.max(0, Math.min(100, (safeScore / max) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "rgba(255,255,255,0.09)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          fontWeight: 800,
          color,
          minWidth: 42,
          textAlign: "right",
        }}
      >
        {safeScore}/{max}
      </span>
    </div>
  );
}

export function Tag({ label, color = "#00e676" }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: 5,
        background: `${color}1c`,
        color,
        border: `1px solid ${color}44`,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export function Section({ title, children, accent = "#00e676" }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <div
          style={{
            width: 4,
            height: 16,
            background: accent,
            borderRadius: 2,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(241,239,233,0.52)",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, accent = "#00e676" }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${accent}33`,
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "rgba(241,239,233,0.5)",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color: accent, fontFamily: "monospace" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "rgba(241,239,233,0.5)", marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}
