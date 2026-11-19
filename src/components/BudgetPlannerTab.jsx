import { formatINR } from "../data/schemes";
import { t } from "../i18n/translations";
import { Section, StatCard, Tag } from "./UiPrimitives";

export default function BudgetPlannerTab({ result, budgetTier, lang, onGoToSchemes, onGoToDpr, onGoToAssistant }) {
  const plan = result.bootstrapPlan || {};
  const minLaunch = Number(plan.minLaunchCostINR) || 25000;
  const userSavings = Number(budgetTier?.numeric) || 0;
  const gap = Math.max(0, minLaunch - userSavings);
  const recommendedLoan = Number(plan.recommendedLoanINR) || Math.max(50000, gap);

  return (
    <div className="non-dpr-section">
      {/* Capital Reality Banner */}
      <div
        className="card"
        style={{
          marginBottom: 16,
          background: "linear-gradient(135deg, rgba(0,230,118,0.07), rgba(86,204,242,0.05))",
          borderColor: "rgba(0,230,118,0.28)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#00e676",
              }}
            >
              💸 {t(lang, "capitalGapTitle")}
            </div>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                color: "rgba(241,239,233,0.85)",
                lineHeight: 1.55,
              }}
            >
              {plan.cashflowStrategy ||
                "Start lean by pre-selling to your first 10 local customers before investing in heavy setup or inventory."}
            </p>
          </div>
        </div>

        <div className="grid-4">
          <StatCard
            label={t(lang, "yourSavings")}
            value={formatINR(userSavings)}
            sub={budgetTier?.label}
            accent="#56ccf2"
          />
          <StatCard
            label={t(lang, "minLaunchCost")}
            value={formatINR(minLaunch)}
            sub="Minimum Lean MVP"
            accent="#00e676"
          />
          <StatCard
            label={t(lang, "fundingNeeded")}
            value={gap > 0 ? formatINR(gap) : "₹0 (Self-Start!)"}
            sub={`Suggested Loan/Grant: ${formatINR(recommendedLoan)}`}
            accent="#ffb830"
          />
          <StatCard
            label={t(lang, "breakEven")}
            value={`${plan.breakEvenMonths || 4} ${t(lang, "months")}`}
            sub="Estimated profit timeline"
            accent="#c58aff"
          />
        </div>

        <div className="no-print" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <button
            onClick={onGoToSchemes}
            className="nav-pill-btn"
            style={{ borderColor: "rgba(255,184,48,0.45)", color: "#ffb830" }}
          >
            🏛️ Match Mudra & PMEGP Subsidy for {formatINR(recommendedLoan)} →
          </button>
          <button
            onClick={onGoToDpr}
            className="nav-pill-btn"
            style={{ borderColor: "rgba(0,230,118,0.45)", color: "#00e676" }}
          >
            📄 Generate Bank Loan Project Report (DPR) →
          </button>
          <button
            onClick={onGoToAssistant}
            className="nav-pill-btn"
            style={{ borderColor: "rgba(197,138,255,0.45)", color: "#c58aff" }}
          >
            🤖 Ask AI Financial Assistant →
          </button>
        </div>
      </div>

      {/* Budget Breakdown & Zero-Cost Tools */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <Section title={t(lang, "budgetBreakdown")} accent="#00e676">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(plan.budgetItems || []).map((item, idx) => {
                const isMust = item.priority === "must-have";
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 14px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 10,
                      borderLeft: `3px solid ${isMust ? "#00e676" : "#ffb830"}`,
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
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{item.item}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Tag
                          label={isMust ? t(lang, "mustHave") : t(lang, "canWait")}
                          color={isMust ? "#00e676" : "#ffb830"}
                        />
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 800,
                            fontSize: 13,
                            color: "#f1efe9",
                          }}
                        >
                          {formatINR(item.costINR)}
                        </span>
                      </div>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "rgba(241,239,233,0.6)",
                        lineHeight: 1.5,
                      }}
                    >
                      💡 {item.savingTip}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        <div className="card">
          <Section title={t(lang, "zeroCostAlts")} accent="#56ccf2">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(plan.zeroCostTools || []).map((tool, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 14px",
                    background: "rgba(86,204,242,0.06)",
                    border: "1px solid rgba(86,204,242,0.18)",
                    borderRadius: 10,
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
                    <span style={{ fontSize: 12, color: "rgba(241,239,233,0.6)" }}>{tool.need}</span>
                    <Tag label={`Saves ${formatINR(tool.savedINR)}`} color="#00e676" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#56ccf2" }}>
                    🆓 {tool.freeTool}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* First 30 Days Zero-Debt Roadmap */}
      <div className="card">
        <Section title={t(lang, "first30Days")} accent="#c58aff">
          <div className="grid-2">
            {(plan.first30Days || []).map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(0,0,0,0.22)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Tag label={step.week} color="#c58aff" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#f1efe9" }}>
                    {step.goal}
                  </span>
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 16,
                    fontSize: 12.5,
                    color: "rgba(241,239,233,0.7)",
                    lineHeight: 1.6,
                  }}
                >
                  {(step.actions || []).map((act, aIdx) => (
                    <li key={aIdx} style={{ marginBottom: 4 }}>
                      {act}
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
