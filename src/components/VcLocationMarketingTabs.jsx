import { ScoreBar, Section, Tag } from "./UiPrimitives";

const THREAT_COLOR = { low: "#00e676", medium: "#ffb830", high: "#ff5e5e" };
const FIT_COLOR = { high: "#00e676", medium: "#ffb830", low: "#ff5e5e" };
const SEV_COLOR = { low: "#00e676", medium: "#ffb830", high: "#ff5e5e" };

export function VcAnalysisTab({ result }) {
  return (
    <div className="non-dpr-section">
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <Section title="Market Sizing (TAM / SAM / SOM)" accent="#56ccf2">
            <div className="grid-3" style={{ marginBottom: 14 }}>
              {[
                ["TAM", result.marketSize?.tam],
                ["SAM", result.marketSize?.sam],
                ["SOM", result.marketSize?.som],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    background: "rgba(86,204,242,0.07)",
                    padding: "10px 6px",
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(241,239,233,0.45)",
                      fontFamily: "monospace",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#56ccf2" }}>
                    {val || "N/A"}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(241,239,233,0.7)", lineHeight: 1.6 }}>
              {result.marketSize?.insight}
            </p>
          </Section>
        </div>

        <div className="card">
          <Section title="Problem Pain Score" accent="#ffb830">
            <div style={{ marginBottom: 10 }}>
              <ScoreBar score={result.problemStrength?.score || 0} color="#ffb830" />
            </div>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 13,
                color: "rgba(241,239,233,0.7)",
                lineHeight: 1.6,
              }}
            >
              {result.problemStrength?.analysis}
            </p>
          </Section>

          <Section title="Defensibility & Moat" accent="#c58aff">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Tag label={result.moat?.type || "Local Advantage"} color="#c58aff" />
              <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#c58aff" }}>
                {result.moat?.score || 0}/10
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(241,239,233,0.7)", lineHeight: 1.6 }}>
              {result.moat?.explanation}
            </p>
          </Section>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <Section title="Competitor Landscape" accent="#ff5e5e">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(result.competitors || []).map((c, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                  <Tag
                    label={`${c.threat || "medium"} threat`}
                    color={THREAT_COLOR[c.threat] || "#ffb830"}
                  />
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(241,239,233,0.65)" }}>
                  ⚡ Weakness to exploit: {c.weakness}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <Section title="Revenue & Cashflow Models" accent="#00e676">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(result.revenueModels || []).map((rm, i) => (
                <div
                  key={i}
                  style={{
                    padding: 12,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                    borderLeft: `3px solid ${FIT_COLOR[rm.fit] || "#ffb830"}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{rm.model}</span>
                    <Tag label={`${rm.fit || "medium"} fit`} color={FIT_COLOR[rm.fit] || "#ffb830"} />
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: "rgba(241,239,233,0.65)", lineHeight: 1.5 }}>
                    {rm.rationale}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="card">
          <Section title="Key Risks & Low-Cost Mitigations" accent="#ffb830">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(result.risks || []).map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    borderLeft: `3px solid ${SEV_COLOR[r.severity] || "#ffb830"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{r.risk}</span>
                    <Tag label={r.severity || "medium"} color={SEV_COLOR[r.severity] || "#ffb830"} />
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "rgba(241,239,233,0.6)" }}>
                    🛡️ {r.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <div
        className="card"
        style={{
          background: "rgba(86,204,242,0.06)",
          borderColor: "rgba(86,204,242,0.22)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#56ccf2",
            fontFamily: "monospace",
            marginBottom: 8,
            fontWeight: 800,
          }}
        >
          Investor & Bank Manager Take
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.65,
            color: "rgba(241,239,233,0.88)",
            fontStyle: "italic",
          }}
        >
          "{result.investorTake}"
        </p>
      </div>
    </div>
  );
}

export function LocationTab({ result }) {
  const loc = result.locationAnalysis || {};
  return (
    <div className="non-dpr-section">
      <div
        className="card"
        style={{
          marginBottom: 16,
          background: "rgba(86,204,242,0.06)",
          borderColor: "rgba(86,204,242,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#56ccf2",
                fontWeight: 800,
              }}
            >
              Location Feasibility Score
            </div>
            <h3 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800 }}>
              Geographic & Regional Demand Fit
            </h3>
          </div>
          <span style={{ fontSize: 30, fontWeight: 900, color: "#56ccf2", fontFamily: "monospace" }}>
            {loc.suitabilityScore ?? 80}/100
          </span>
        </div>
        <ScoreBar score={loc.suitabilityScore ?? 80} max={100} color="#56ccf2" />
      </div>

      <div className="grid-2">
        <div className="card">
          <Section title="Recommended Launch Hubs" accent="#56ccf2">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {(loc.recommendedRegions || []).map((reg, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "rgba(86,204,242,0.12)",
                    color: "#56ccf2",
                    border: "1px solid rgba(86,204,242,0.3)",
                    borderRadius: 7,
                    padding: "6px 12px",
                    fontSize: 12.5,
                    fontWeight: 700,
                  }}
                >
                  📍 {reg}
                </span>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(241,239,233,0.72)", lineHeight: 1.6 }}>
              <strong>Demographic Fit:</strong> {loc.demographicFit}
            </p>
          </Section>
        </div>

        <div className="card">
          <Section title="Foot Traffic & Supply Chain" accent="#00e676">
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 13,
                color: "rgba(241,239,233,0.72)",
                lineHeight: 1.6,
              }}
            >
              {loc.footTrafficAndSupplyChain}
            </p>
          </Section>

          <Section title="Regional Advantages" accent="#ffb830">
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 13,
                color: "rgba(241,239,233,0.75)",
                lineHeight: 1.6,
              }}
            >
              {(loc.regionalAdvantages || []).map((adv, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  {adv}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

export function MarketingTab({ result }) {
  const mkt = result.marketingStrategy || {};
  return (
    <div className="non-dpr-section">
      <div
        className="card"
        style={{
          marginBottom: 16,
          background: "rgba(197,138,255,0.07)",
          borderColor: "rgba(197,138,255,0.28)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#c58aff",
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Core Campaign Hook
        </div>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, fontStyle: "italic" }}>
          "{mkt.messagingHook || "Start small, solve real problems, grow profitably."}"
        </h3>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <Section title="Ideal Customer Persona" accent="#c58aff">
            <p style={{ margin: 0, fontSize: 13.5, color: "rgba(241,239,233,0.75)", lineHeight: 1.6 }}>
              {mkt.targetAudiencePersona}
            </p>
          </Section>
        </div>

        <div className="card">
          <Section title="Zero-Budget Viral Growth Hacks" accent="#00e676">
            <ul
              style={{
                margin: 0,
                paddingLeft: 16,
                fontSize: 13,
                color: "rgba(241,239,233,0.75)",
                lineHeight: 1.65,
              }}
            >
              {(mkt.growthHacks || []).map((hack, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>
                  ⚡ {hack}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <Section title="Low-Cost Customer Acquisition Channels" accent="#56ccf2">
          <div className="grid-2">
            {(mkt.channels || []).map((ch, idx) => (
              <div
                key={idx}
                style={{
                  padding: 14,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid rgba(86,204,242,0.18)",
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#56ccf2", marginBottom: 6 }}>
                  📣 {ch.channel}
                </div>
                <p style={{ margin: 0, fontSize: 12.5, color: "rgba(241,239,233,0.68)", lineHeight: 1.55 }}>
                  {ch.strategy}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="card">
        <Section title="3-Phase Go-To-Market Roadmap" accent="#00e676">
          <div className="grid-3">
            {[result.gtm?.phase1, result.gtm?.phase2, result.gtm?.phase3].map((phase, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(0,0,0,0.22)",
                  padding: 14,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    color: "#00e676",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Phase {idx + 1}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>
                  {phase?.title}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {(phase?.tactics || []).map((tactic, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 12.5,
                        color: "rgba(241,239,233,0.68)",
                        lineHeight: 1.6,
                        paddingLeft: 12,
                        position: "relative",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ position: "absolute", left: 0, color: "#00e676" }}>›</span>
                      {tactic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
