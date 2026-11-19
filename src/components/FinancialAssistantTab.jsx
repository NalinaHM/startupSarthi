import { useState, useRef, useEffect } from "react";
import { askFinancialAssistant } from "../services/aiService";
import {
  clearAssistantHistory,
  loadAssistantHistory,
  saveAssistantHistory,
} from "../utils/storage";
import { t } from "../i18n/translations";
import { Tag } from "./UiPrimitives";

function createMessage(role, content) {
  const ts = Date.now();
  return {
    id: `${role}_${ts}_${Math.random().toString(36).slice(2, 7)}`,
    role,
    ...(role === "user" ? { text: content } : { data: content }),
    timestamp: ts,
  };
}

export default function FinancialAssistantTab({
  result,
  idea,
  sector,
  budgetTier,
  targetLocation,
  lang,
}) {
  const [messages, setMessages] = useState(() => loadAssistantHistory());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextDisabled, setContextDisabled] = useState(false);
  const [error, setError] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});

  const chatBottomRef = useRef(null);

  const hasContext = Boolean(idea || result);
  const useContext = hasContext && !contextDisabled;

  useEffect(() => {
    saveAssistantHistory(messages);
  }, [messages]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickPrompts = [
    t(lang, "quickPrompt1"),
    t(lang, "quickPrompt2"),
    t(lang, "quickPrompt3"),
    t(lang, "quickPrompt4"),
    t(lang, "quickPrompt5"),
    t(lang, "quickPrompt6"),
  ];

  async function handleSend(customText) {
    const q = (typeof customText === "string" ? customText : input).trim();
    if (!q || loading) return;

    setError(null);
    setInput("");

    const userMsg = createMessage("user", q);
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await askFinancialAssistant({
        question: q,
        contextIdea: useContext ? idea : "",
        contextSector: useContext ? sector : "",
        contextBudget: useContext ? budgetTier?.label : "",
        contextLocation: useContext ? targetLocation : "",
        contextSchemes: useContext ? result?.governmentSchemes : [],
        langCode: lang,
      });

      const assistantMsg = createMessage("assistant", response);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get advice. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    clearAssistantHistory();
    setMessages([]);
    setCheckedSteps({});
  }

  function toggleStep(key) {
    setCheckedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="non-dpr-section" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Header & Context Bar */}
      <div
        className="card"
        style={{
          marginBottom: 16,
          background: "linear-gradient(135deg, rgba(0,230,118,0.08), rgba(197,138,255,0.06))",
          borderColor: "rgba(0,230,118,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
                {t(lang, "assistantTitle")}
              </h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "rgba(241,239,233,0.7)" }}>
                {t(lang, "assistantSub")}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="nav-pill-btn"
                style={{ fontSize: 11, padding: "5px 10px", color: "rgba(241,239,233,0.6)" }}
              >
                🗑️ {t(lang, "assistantClear")}
              </button>
            )}
          </div>
        </div>

        {/* Context Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            padding: "8px 12px",
            background: "rgba(0,0,0,0.25)",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: useContext && idea ? "#00e676" : "#56ccf2", fontWeight: 700 }}>
              {useContext && idea
                ? `💡 ${t(lang, "assistantContextActive")} ${result?.suggestedBusinessName || sector}`
                : `🌐 ${t(lang, "assistantContextGeneral")}`}
            </span>
            {useContext && idea && (
              <span style={{ color: "rgba(241,239,233,0.5)" }}>
                ({budgetTier?.label || "₹0–₹25k"} · {targetLocation || "India"})
              </span>
            )}
          </div>

          {hasContext && (
            <button
              type="button"
              onClick={() => setContextDisabled((prev) => !prev)}
              style={{
                background: "transparent",
                border: "none",
                color: "#56ccf2",
                cursor: "pointer",
                fontSize: 11.5,
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              {useContext ? "Switch to General Q&A" : "Attach My Startup Context"}
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "rgba(241,239,233,0.5)",
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          ⚡ Suggested Financial Questions
        </div>
        <div className="chip-row">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="chip-btn"
              onClick={() => handleSend(prompt)}
              style={{ fontSize: 12, padding: "7px 11px" }}
              disabled={loading}
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div
        className="card"
        style={{
          minHeight: 320,
          maxHeight: 560,
          overflowY: "auto",
          marginBottom: 16,
          background: "rgba(8,11,20,0.6)",
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 16px", color: "rgba(241,239,233,0.65)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#f1efe9" }}>
              {t(lang, "assistantEmptyHeading")}
            </h4>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, maxWidth: 500, marginInline: "auto" }}>
              {t(lang, "assistantEmptySub")}
            </p>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.role === "user") {
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: "flex-end",
                  maxWidth: "85%",
                  background: "linear-gradient(135deg, rgba(0,230,118,0.18), rgba(86,204,242,0.12))",
                  border: "1px solid rgba(0,230,118,0.35)",
                  borderRadius: "14px 14px 2px 14px",
                  padding: "10px 14px",
                  color: "#f1efe9",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </div>
            );
          }

          const data = msg.data || {};
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: "flex-start",
                width: "100%",
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "14px 14px 14px 2px",
                padding: "16px",
              }}
            >
              {/* Core Answer */}
              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "rgba(241,239,233,0.92)",
                }}
              >
                {data.answer || "Here is the financial guidance for your request."}
              </p>

              {/* Action Steps Checklist */}
              {(data.actionSteps || []).length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#00e676",
                      fontWeight: 800,
                      marginBottom: 8,
                    }}
                  >
                    📋 {t(lang, "assistantActionChecklist")}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {data.actionSteps.map((step, sIdx) => {
                      const key = `${msg.id}_step_${sIdx}`;
                      const isChecked = !!checkedSteps[key];
                      return (
                        <label
                          key={sIdx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            fontSize: 12.5,
                            color: isChecked ? "rgba(241,239,233,0.45)" : "rgba(241,239,233,0.8)",
                            cursor: "pointer",
                            lineHeight: 1.5,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStep(key)}
                            style={{ accentColor: "#00e676", marginTop: 3, cursor: "pointer" }}
                          />
                          <span style={{ textDecoration: isChecked ? "line-through" : "none" }}>
                            {step}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Financial Metrics & Applicable Schemes */}
              {(data.estimatedFinancials || (data.applicableSchemes || []).length > 0) && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    paddingTop: 8,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {data.estimatedFinancials && (
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: "#ffb830",
                        fontFamily: "monospace",
                        background: "rgba(255,184,48,0.12)",
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "1px solid rgba(255,184,48,0.25)",
                      }}
                    >
                      💰 {data.estimatedFinancials}
                    </span>
                  )}
                  {(data.applicableSchemes || []).map((sch, schIdx) => (
                    <Tag key={schIdx} label={sch} color="#56ccf2" />
                  ))}
                </div>
              )}

              {/* Pro Tip Box */}
              {data.proTip && (
                <div
                  style={{
                    background: "rgba(197,138,255,0.08)",
                    border: "1px solid rgba(197,138,255,0.24)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 12,
                    color: "rgba(241,239,233,0.85)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "#c58aff" }}>{t(lang, "assistantProTip")}:</strong>{" "}
                  {data.proTip}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10,
              fontSize: 12.5,
              color: "#00e676",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00e676",
                animation: "pulse 1.2s infinite",
              }}
            />
            {t(lang, "assistantThinking")}
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: "rgba(255,94,94,0.1)",
            border: "1px solid rgba(255,94,94,0.3)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 12,
            color: "#ff7a7a",
            fontSize: 12.5,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Input Bar */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          background: "rgba(8,11,20,0.8)",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t(lang, "assistantInputPlaceholder")}
          rows={1}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#f1efe9",
            fontSize: 13.5,
            lineHeight: 1.5,
            resize: "none",
          }}
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="primary-cta"
          style={{ padding: "10px 20px", fontSize: 13, whiteSpace: "nowrap" }}
        >
          {loading ? "..." : t(lang, "assistantSend")} →
        </button>
      </div>
    </div>
  );
}
