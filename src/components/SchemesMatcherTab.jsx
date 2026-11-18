import { useState, useMemo } from "react";
import {
  FOUNDER_PROFILES,
  VERIFIED_GOVT_SCHEMES,
  calculateFundingMetrics,
  formatINR,
} from "../data/schemes";
import { t } from "../i18n/translations";
import { Section, StatCard, Tag } from "./UiPrimitives";

export default function SchemesMatcherTab({
  result,
  founderProfile = "general",
  areaType = "urban",
  checkedDocs = {},
  onToggleDoc,
  lang = "en",
  standalone = false,
}) {
  const initialAmount =
    Number(result?.dprReport?.totalProjectCostINR) ||
    Number(result?.bootstrapPlan?.recommendedLoanINR) ||
    300000;

  const [projectCost, setProjectCost] = useState(
    Math.min(2500000, Math.max(25000, initialAmount)),
  );
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [calcProfile, setCalcProfile] = useState(founderProfile);
  const [calcArea, setCalcArea] = useState(areaType);

  const metrics = useMemo(
    () =>
      calculateFundingMetrics({
        projectCost,
        interestRate,
        tenureMonths,
        founderProfile: calcProfile,
        areaType: calcArea,
      }),
    [projectCost, interestRate, tenureMonths, calcProfile, calcArea],
  );

  const aiSchemes = result?.governmentSchemes || [];

  return (
    <div className="non-dpr-section">
      {/* Offline Subsidy & EMI Calculator */}
      <div
        className="card"
        style={{
          marginBottom: 18,
          background: "linear-gradient(135deg, rgba(255,184,48,0.07), rgba(0,230,118,0.04))",
          borderColor: "rgba(255,184,48,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🧮</span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#ffb830" }}>
                {t(lang, "calcTitle")}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(241,239,233,0.68)", lineHeight: 1.5 }}>
              {t(lang, "calcSub")}
            </p>
          </div>
          <Tag label={metrics.mudraTier} color="#00e676" />
        </div>

        {/* Sliders & Profile Selector */}
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "rgba(241,239,233,0.7)", fontWeight: 600 }}>
                {t(lang, "loanAmount")}
              </span>
              <strong style={{ color: "#ffb830", fontFamily: "monospace", fontSize: 14 }}>
                {formatINR(projectCost)}
              </strong>
            </div>
            <input
              type="range"
              min={25000}
              max={2500000}
              step={25000}
              value={projectCost}
              onChange={(e) => setProjectCost(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#ffb830", cursor: "pointer" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: "rgba(241,239,233,0.4)",
              }}
            >
              <span>₹25k</span>
              <span>₹5L</span>
              <span>₹10L</span>
              <span>₹25L</span>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 10 }}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "rgba(241,239,233,0.7)" }}>{t(lang, "interestRate")}</span>
                <strong style={{ color: "#56ccf2", fontFamily: "monospace" }}>
                  {interestRate}%
                </strong>
              </div>
              <input
                type="range"
                min={5}
                max={16}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#56ccf2", cursor: "pointer" }}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "rgba(241,239,233,0.7)" }}>{t(lang, "tenureMonths")}</span>
                <strong style={{ color: "#00e676", fontFamily: "monospace" }}>
                  {tenureMonths}m
                </strong>
              </div>
              <input
                type="range"
                min={12}
                max={84}
                step={6}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#00e676", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        {/* Category & Urban/Rural toggles */}
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div>
            <label className="field-label">{t(lang, "profileLabel")}</label>
            <select
              className="field-select"
              value={calcProfile}
              onChange={(e) => setCalcProfile(e.target.value)}
            >
              {FOUNDER_PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">{t(lang, "areaTypeLabel")}</label>
            <div className="chip-row">
              <button
                type="button"
                className={`chip-btn ${calcArea === "urban" ? "active" : ""}`}
                onClick={() => setCalcArea("urban")}
                style={{ flex: 1 }}
              >
                🏙️ {t(lang, "areaUrban")}
              </button>
              <button
                type="button"
                className={`chip-btn ${calcArea === "rural" ? "active" : ""}`}
                onClick={() => setCalcArea("rural")}
                style={{ flex: 1 }}
              >
                🌾 {t(lang, "areaRural")}
              </button>
            </div>
          </div>
        </div>

        {/* Live Outputs */}
        <div className="grid-4">
          <StatCard
            label={`${t(lang, "estSubsidy")} (${metrics.subsidyPercent}%)`}
            value={formatINR(metrics.subsidyAmount)}
            sub="Free govt grant under PMEGP"
            accent="#00e676"
          />
          <StatCard
            label={`${t(lang, "ownContribution")} (${metrics.ownContributionPercent}%)`}
            value={formatINR(metrics.ownContributionAmount)}
            sub="Your minimum savings needed"
            accent="#56ccf2"
          />
          <StatCard
            label={t(lang, "netBankLoan")}
            value={formatINR(metrics.netLoanAmount)}
            sub="After subsidy & own share"
            accent="#c58aff"
          />
          <StatCard
            label={t(lang, "monthlyEmi")}
            value={`${formatINR(metrics.monthlyEmi)}/mo`}
            sub={`At ${interestRate}% for ${tenureMonths}m`}
            accent="#ffb830"
          />
        </div>
      </div>

      {/* AI Matched Schemes (when analysis result exists) */}
      {aiSchemes.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Section title={t(lang, "aiMatchedSchemes")} accent="#00e676">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {aiSchemes.map((scheme, sIdx) => (
                <div key={sIdx} className="card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{scheme.name}</h4>
                        <Tag label={scheme.type || "Govt Scheme"} color="#ffb830" />
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "#00e676",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          marginTop: 5,
                        }}
                      >
                        💰 {scheme.maxFunding}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Tag label={scheme.eligibility || "Eligible"} color="#00e676" />
                      {scheme.portalUrl && (
                        <a
                          href={scheme.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="nav-pill-btn no-print"
                          style={{
                            textDecoration: "none",
                            fontSize: 11,
                            padding: "5px 10px",
                            color: "#56ccf2",
                          }}
                        >
                          {t(lang, "officialPortal")}
                        </a>
                      )}
                    </div>
                  </div>

                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: 13.5,
                      color: "rgba(241,239,233,0.75)",
                      lineHeight: 1.6,
                    }}
                  >
                    {scheme.summary}
                  </p>

                  <div
                    className="grid-2"
                    style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div>
                      <div className="field-label">📋 {t(lang, "docChecklist")}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {(scheme.documentsRequired || []).map((doc, dIdx) => {
                          const key = `ai-${sIdx}-${dIdx}`;
                          const isChecked = !!checkedDocs[key];
                          return (
                            <label
                              key={dIdx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 12.5,
                                color: isChecked ? "#00e676" : "rgba(241,239,233,0.75)",
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => onToggleDoc && onToggleDoc(key)}
                                style={{ accentColor: "#00e676", cursor: "pointer" }}
                              />
                              <span style={{ textDecoration: isChecked ? "line-through" : "none" }}>
                                {doc}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="field-label">🚀 {t(lang, "appSteps")}</div>
                      <ol
                        style={{
                          margin: 0,
                          paddingLeft: 18,
                          fontSize: 12.5,
                          color: "rgba(241,239,233,0.72)",
                          lineHeight: 1.65,
                        }}
                      >
                        {(scheme.applicationSteps || []).map((step, stIdx) => (
                          <li key={stIdx} style={{ marginBottom: 4 }}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Always-Available Verified Offline Schemes Directory */}
      <Section
        title={standalone ? t(lang, "verifiedSchemes") : `${t(lang, "verifiedSchemes")} — Quick Reference`}
        accent="#56ccf2"
      >
        <div className="grid-2">
          {VERIFIED_GOVT_SCHEMES.map((scheme) => (
            <div key={scheme.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>
                    {scheme.name}
                  </h4>
                  <Tag label={scheme.badge} color="#ffb830" />
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#00e676",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {scheme.maxFunding}
                </div>
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: 12.5,
                    color: "rgba(241,239,233,0.75)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>Subsidy / Benefit:</strong> {scheme.subsidy}
                </p>
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: 12,
                    color: "rgba(241,239,233,0.58)",
                    lineHeight: 1.5,
                  }}
                >
                  {scheme.bestFor}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span style={{ fontSize: 11, color: "rgba(241,239,233,0.45)" }}>
                  {scheme.documents.length} key documents
                </span>
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="no-print"
                  style={{
                    color: "#56ccf2",
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  {scheme.portalName} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
