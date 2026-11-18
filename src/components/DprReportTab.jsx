import { useState, useEffect } from "react";
import { formatINR } from "../data/schemes";
import { t } from "../i18n/translations";
import { loadDprProfile, saveDprProfile } from "../utils/storage";

export default function DprReportTab({
  result,
  idea,
  targetLocation,
  sector,
  founderProfileLabel,
  areaType,
  lang,
  onPrintDpr,
}) {
  const dpr = result.dprReport || {};
  const [profile, setProfile] = useState(() => loadDprProfile());

  useEffect(() => {
    saveDprProfile(profile);
  }, [profile]);

  const businessTitle =
    profile.businessName.trim() || result.suggestedBusinessName || "Proposed Micro Enterprise";
  const founderTitle = profile.founderName.trim() || "[Applicant Name]";
  const addressText =
    profile.address.trim() || targetLocation?.trim() || "[City / Taluk / District, State]";
  const contactText = profile.contact.trim() || "[Mobile Number / Email]";

  const fixedCap = Number(dpr.fixedCapitalINR) || 80000;
  const workingCap = Number(dpr.workingCapitalINR) || 70000;
  const totalCost = Number(dpr.totalProjectCostINR) || fixedCap + workingCap;
  const ownShare = Number(dpr.ownContributionINR) || Math.round(totalCost * 0.1);
  const subsidyEst = Number(dpr.govtSubsidyEstINR) || Math.round(totalCost * 0.25);
  const bankLoan =
    Number(dpr.bankLoanRequiredINR) || Math.max(0, totalCost - ownShare - subsidyEst);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div>
      {/* Customization Bar (hidden when printing) */}
      <div className="card no-print" style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: "#00e676" }}>
              📄 {t(lang, "dprTitle")}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(241,239,233,0.65)" }}>
              {t(lang, "dprSub")}
            </p>
          </div>
          <button onClick={onPrintDpr} className="primary-cta">
            🖨️ {t(lang, "printDpr")}
          </button>
        </div>

        <div className="grid-2">
          <div>
            <label className="field-label">{t(lang, "founderName")}</label>
            <input
              className="field-input"
              value={profile.founderName}
              onChange={(e) => setProfile({ ...profile, founderName: e.target.value })}
              placeholder="e.g. Ramesh Kumar / Nalina H M"
            />
          </div>
          <div>
            <label className="field-label">{t(lang, "businessName")}</label>
            <input
              className="field-input"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              placeholder={result.suggestedBusinessName || "e.g. Namma Millet Kitchen"}
            />
          </div>
          <div>
            <label className="field-label">{t(lang, "businessAddress")}</label>
            <input
              className="field-input"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder={targetLocation || "e.g. Mysuru, Karnataka - 570001"}
            />
          </div>
          <div>
            <label className="field-label">{t(lang, "contactPhone")}</label>
            <input
              className="field-input"
              value={profile.contact}
              onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
              placeholder="e.g. +91 98XXXXXX10 / founder@email.com"
            />
          </div>
        </div>
      </div>

      {/* Formal Printable Bank DPR Sheet */}
      <div className="dpr-sheet" id="bank-dpr-sheet">
        <div
          style={{
            borderBottom: "2px solid #111827",
            paddingBottom: 14,
            marginBottom: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#059669",
              }}
            >
              DETAILED PROJECT REPORT (DPR) — FOR PM MUDRA / PMEGP / MSME BANK LOAN
            </div>
            <h2 style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 900, color: "#111827" }}>
              {businessTitle}
            </h2>
            <div style={{ fontSize: 13, color: "#4b5563" }}>
              Sector: {sector} · Area: {areaType === "rural" ? "Rural" : "Urban"} · Date: {today}
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "#374151" }}>
            <div>
              <strong>Total Project Cost:</strong> {formatINR(totalCost)}
            </div>
            <div>
              <strong>Bank Loan Requested:</strong> {formatINR(bankLoan)}
            </div>
          </div>
        </div>

        {/* Section 1: Promoter Details */}
        <h4 style={{ margin: "0 0 6px", fontSize: 14, color: "#111827" }}>
          1. Promoter & Enterprise Profile
        </h4>
        <table className="dpr-table" style={{ marginBottom: 18 }}>
          <tbody>
            <tr>
              <th style={{ width: "30%" }}>Name of Applicant / Promoter</th>
              <td>{founderTitle}</td>
            </tr>
            <tr>
              <th>Proposed Enterprise Name</th>
              <td>{businessTitle}</td>
            </tr>
            <tr>
              <th>Location / Unit Address</th>
              <td>{addressText}</td>
            </tr>
            <tr>
              <th>Contact Details</th>
              <td>{contactText}</td>
            </tr>
            <tr>
              <th>Applicant Category & Constitution</th>
              <td>{founderProfileLabel} · Sole Proprietorship / Micro Enterprise (Udyam)</td>
            </tr>
            <tr>
              <th>Estimated Employment Generation</th>
              <td>{dpr.employmentGenerated || "2–4 local employees within 12 months"}</td>
            </tr>
          </tbody>
        </table>

        {/* Section 2: Executive Summary */}
        <h4 style={{ margin: "0 0 6px", fontSize: 14, color: "#111827" }}>
          2. Executive Summary & Business Model
        </h4>
        <p style={{ margin: "0 0 8px", fontSize: 13, lineHeight: 1.6, color: "#1f2937" }}>
          {dpr.executiveSummary || result.oneLiner}
        </p>
        <p style={{ margin: "0 0 18px", fontSize: 13, lineHeight: 1.6, color: "#374151" }}>
          <strong>Proposed Activity:</strong> {dpr.businessModelSummary || idea}
        </p>

        {/* Section 3: Cost of Project & Means of Finance */}
        <div className="grid-2" style={{ marginBottom: 18 }}>
          <div>
            <h4 style={{ margin: "0 0 6px", fontSize: 14, color: "#111827" }}>
              3A. Cost of Project
            </h4>
            <table className="dpr-table">
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fixed Capital (Tools, Setup, Equipment)</td>
                  <td>{formatINR(fixedCap)}</td>
                </tr>
                <tr>
                  <td>Working Capital (Stock, Operations, Marketing)</td>
                  <td>{formatINR(workingCap)}</td>
                </tr>
                <tr>
                  <th>Total Project Cost</th>
                  <th>{formatINR(totalCost)}</th>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 style={{ margin: "0 0 6px", fontSize: 14, color: "#111827" }}>
              3B. Means of Finance
            </h4>
            <table className="dpr-table">
              <thead>
                <tr>
                  <th>Source of Funds</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Promoter Own Contribution (Margin)</td>
                  <td>{formatINR(ownShare)}</td>
                </tr>
                <tr>
                  <td>Expected Govt Subsidy (PMEGP / State)</td>
                  <td>{formatINR(subsidyEst)}</td>
                </tr>
                <tr>
                  <td>Term Loan + Working Capital (Bank / Mudra)</td>
                  <td>{formatINR(bankLoan)}</td>
                </tr>
                <tr>
                  <th>Total Means of Finance</th>
                  <th>{formatINR(ownShare + subsidyEst + bankLoan)}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: 12-Month Projections */}
        <h4 style={{ margin: "0 0 6px", fontSize: 14, color: "#111827" }}>
          4. Projected Monthly Revenue, Expenses & Net Surplus (Year 1)
        </h4>
        <table className="dpr-table" style={{ marginBottom: 18 }}>
          <thead>
            <tr>
              <th>Operating Period</th>
              <th>Est. Monthly Sales</th>
              <th>Est. Monthly Expenses</th>
              <th>Est. Net Profit / Month</th>
            </tr>
          </thead>
          <tbody>
            {(dpr.monthlyProjections || []).map((row, idx) => (
              <tr key={idx}>
                <td>{row.period}</td>
                <td>{formatINR(row.monthlyRevenueINR)}</td>
                <td>{formatINR(row.monthlyExpenseINR)}</td>
                <td style={{ fontWeight: 700, color: "#047857" }}>
                  {formatINR(row.monthlyProfitINR)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Section 5: Viability & Declaration */}
        <h4 style={{ margin: "0 0 6px", fontSize: 14, color: "#111827" }}>
          5. Loan Repayment Viability & Market Scope
        </h4>
        <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.6, color: "#1f2937" }}>
          {dpr.repaymentViability ||
            "Projected monthly surplus comfortably covers estimated monthly EMI obligations, demonstrating strong financial viability and debt servicing capability."}
        </p>

        <div
          style={{
            marginTop: 26,
            paddingTop: 14,
            borderTop: "1px dashed #9ca3af",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 12,
            color: "#4b5563",
          }}
        >
          <div>
            <div>Place: {addressText}</div>
            <div>Date: {today}</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>
              Prepared with StartupSarthi AI Funding Companion (Verify final figures with your bank/CA).
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: 24 }}>______________________________</div>
            <strong>Signature of Applicant ({founderTitle})</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
