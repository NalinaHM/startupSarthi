import { formatINR } from "../data/schemes";
import { t } from "../i18n/translations";
import { Tag } from "./UiPrimitives";

export default function SavedIdeasDrawer({ savedIdeas, onLoad, onDelete, lang }) {
  return (
    <div style={{ paddingTop: 12 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 900 }}>
          💾 {t(lang, "savedTitle")}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(241,239,233,0.6)" }}>
          All saved plans and loan document checklists stay stored offline on your device.
        </p>
      </div>

      {savedIdeas.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "44px 20px" }}>
          <div style={{ fontSize: 34, marginBottom: 12 }}>📁</div>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(241,239,233,0.65)", maxWidth: 420, marginInline: "auto", lineHeight: 1.6 }}>
            {t(lang, "savedEmpty")}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {savedIdeas.map((item) => {
            const totalDocs = (item.result?.governmentSchemes || []).reduce(
              (acc, s) => acc + (s.documentsRequired?.length || 0),
              0,
            );
            const checkedCount = Object.values(item.checkedDocs || {}).filter(Boolean).length;
            const dateStr = new Date(item.updatedAt || item.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 14,
                }}
              >
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                    <strong style={{ fontSize: 15 }}>
                      {item.result?.suggestedBusinessName || item.sector}
                    </strong>
                    <Tag label={item.result?.verdict || "SAVED"} color="#00e676" />
                    {totalDocs > 0 && (
                      <Tag
                        label={`${t(lang, "checklistProgress")}: ${checkedCount}/${totalDocs}`}
                        color="#ffb830"
                      />
                    )}
                  </div>
                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: 13,
                      color: "rgba(241,239,233,0.72)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.idea.length > 120 ? `${item.idea.slice(0, 120)}…` : item.idea}
                  </p>
                  <div style={{ fontSize: 11.5, color: "rgba(241,239,233,0.45)" }}>
                    📍 {item.targetLocation || "India"} · Lean Launch:{" "}
                    {formatINR(item.result?.bootstrapPlan?.minLaunchCostINR || 25000)} · {dateStr}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onLoad(item)}
                    className="nav-pill-btn"
                    style={{
                      background: "rgba(0,230,118,0.14)",
                      borderColor: "rgba(0,230,118,0.4)",
                      color: "#00e676",
                    }}
                  >
                    {t(lang, "loadPlan")} →
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="nav-pill-btn"
                    style={{ borderColor: "rgba(255,94,94,0.35)", color: "#ff5e5e" }}
                  >
                    {t(lang, "deletePlan")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
