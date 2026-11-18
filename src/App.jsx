import { useState, useRef, useEffect } from "react";
import { BUDGET_TIERS, FOUNDER_PROFILES, SECTORS } from "./data/schemes";
import { LANGUAGES, t } from "./i18n/translations";
import { analyzeStartupIdea } from "./services/aiService";
import {
  deleteSavedIdea,
  loadLanguage,
  loadSavedIdeas,
  saveIdeaToDevice,
  saveLanguage,
} from "./utils/storage";
import BudgetPlannerTab from "./components/BudgetPlannerTab";
import SchemesMatcherTab from "./components/SchemesMatcherTab";
import DprReportTab from "./components/DprReportTab";
import { LocationTab, MarketingTab, VcAnalysisTab } from "./components/VcLocationMarketingTabs";
import SavedIdeasDrawer from "./components/SavedIdeasDrawer";

const VERDICT_CONFIG = {
  "STRONG BET": { color: "#00e676", bg: "rgba(0,230,118,0.08)", border: "rgba(0,230,118,0.32)" },
  "WORTH EXPLORING": { color: "#56ccf2", bg: "rgba(86,204,242,0.08)", border: "rgba(86,204,242,0.32)" },
  "PROCEED WITH CAUTION": { color: "#ffb830", bg: "rgba(255,184,48,0.08)", border: "rgba(255,184,48,0.32)" },
  "HARD PASS": { color: "#ff5e5e", bg: "rgba(255,94,94,0.08)", border: "rgba(255,94,94,0.32)" },
};

const EXAMPLES = [
  {
    idea: "Home-cooked millet tiffin & healthy lunch subscription for college students and IT workers using WhatsApp orders",
    location: "Mysuru, Karnataka",
    sector: "Food, Tiffin & Cloud Kitchen",
    budgetId: "under25k",
  },
  {
    idea: "On-demand solar pump & farm equipment rental + soil testing micro-service for smallholder villages",
    location: "Mandya, Karnataka (Rural)",
    sector: "Agritech & Rural Business",
    budgetId: "zero",
  },
  {
    idea: "Eco-friendly paper bag & biodegradable plate micro-manufacturing unit supplying local bakeries and kirana stores",
    location: "Hubballi, Karnataka",
    sector: "Manufacturing & Micro-Unit",
    budgetId: "25k-1l",
  },
  {
    idea: "Doorstep mobile, laptop & appliance repair service run by certified local technicians on a commission model",
    location: "Bengaluru Suburbs",
    sector: "Services, Repair & Home Care",
    budgetId: "zero",
  },
];

export default function App() {
  const [lang, setLang] = useState(() => loadLanguage());
  const [view, setView] = useState("home"); // 'home' | 'calculator' | 'saved'

  // Form inputs
  const [idea, setIdea] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [sector, setSector] = useState(SECTORS[0]);
  const [budgetId, setBudgetId] = useState("zero");
  const [founderProfileId, setFounderProfileId] = useState("general");
  const [areaType, setAreaType] = useState("urban");

  // Analysis state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentIdeaId, setCurrentIdeaId] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("budget"); // 'budget' | 'schemes' | 'dpr' | 'vc' | 'location' | 'marketing'
  const [checkedDocs, setCheckedDocs] = useState({});
  const [savedIdeas, setSavedIdeas] = useState(() => loadSavedIdeas());
  const [justSaved, setJustSaved] = useState(false);
  const [printMode, setPrintMode] = useState("full"); // 'full' | 'dpr'

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const textareaRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    saveLanguage(lang);
  }, [lang]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [idea]);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const selectedBudget = BUDGET_TIERS.find((b) => b.id === budgetId) || BUDGET_TIERS[0];
  const selectedProfile =
    FOUNDER_PROFILES.find((p) => p.id === founderProfileId) || FOUNDER_PROFILES[0];

  async function handleInstallApp() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  async function handleAnalyze() {
    if (!idea.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setCheckedDocs({});
    setJustSaved(false);
    setCurrentIdeaId(`idea_${Date.now()}`);

    try {
      const parsed = await analyzeStartupIdea({
        idea,
        targetLocation,
        sector,
        budgetTier: selectedBudget,
        founderProfile: selectedProfile,
        areaType,
        langCode: lang,
      });
      setResult(parsed);
      setActiveTab("budget");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSaveCurrentIdea(nextCheckedDocs = checkedDocs) {
    if (!result) return;
    const id = currentIdeaId || `idea_${Date.now()}`;
    setCurrentIdeaId(id);
    const updated = saveIdeaToDevice({
      id,
      idea: idea.trim(),
      targetLocation: targetLocation.trim(),
      sector,
      budgetId,
      founderProfileId,
      areaType,
      lang,
      result,
      checkedDocs: nextCheckedDocs,
    });
    setSavedIdeas(updated);
    setJustSaved(true);
  }

  function handleToggleDoc(docKey) {
    const next = { ...checkedDocs, [docKey]: !checkedDocs[docKey] };
    setCheckedDocs(next);
    // If already saved, auto-sync checklist to localStorage
    if (currentIdeaId && savedIdeas.some((item) => item.id === currentIdeaId)) {
      handleSaveCurrentIdea(next);
    }
  }

  function handleLoadSaved(item) {
    setIdea(item.idea || "");
    setTargetLocation(item.targetLocation || "");
    setSector(item.sector || SECTORS[0]);
    setBudgetId(item.budgetId || "zero");
    setFounderProfileId(item.founderProfileId || "general");
    setAreaType(item.areaType || "urban");
    setResult(item.result || null);
    setCheckedDocs(item.checkedDocs || {});
    setCurrentIdeaId(item.id);
    setJustSaved(true);
    setActiveTab("budget");
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteSaved(id) {
    const updated = deleteSavedIdea(id);
    setSavedIdeas(updated);
    if (id === currentIdeaId) {
      setJustSaved(false);
    }
  }

  function triggerPrint(mode = "full") {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintMode("full"), 500);
    }, 80);
  }

  const vc = result
    ? VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG["WORTH EXPLORING"]
    : null;

  const isAlreadySaved = Boolean(
    justSaved || (currentIdeaId && savedIdeas.some((item) => item.id === currentIdeaId)),
  );

  const RESULT_TABS = [
    { id: "budget", label: `💸 ${t(lang, "tabBudget")}`, accent: "#00e676" },
    { id: "schemes", label: `🏛️ ${t(lang, "tabSchemes")}`, accent: "#ffb830" },
    { id: "dpr", label: `📄 ${t(lang, "tabDpr")}`, accent: "#56ccf2" },
    { id: "vc", label: `📊 ${t(lang, "tabVc")}`, accent: "#00e676" },
    { id: "location", label: `📍 ${t(lang, "tabLocation")}`, accent: "#56ccf2" },
    { id: "marketing", label: `📣 ${t(lang, "tabMarketing")}`, accent: "#c58aff" },
  ];

  return (
    <div className={`app-shell ${printMode === "dpr" ? "print-only-dpr" : ""}`}>
      {/* Ambient Background */}
      <div className="ambient-bg no-print">
        <div className="ambient-glow-top" />
        <div className="ambient-glow-bottom" />
      </div>

      {/* Top Sticky App Bar */}
      <nav className="top-nav no-print">
        <div className="top-nav-inner">
          <button
            className="brand-group"
            onClick={() => {
              setView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img src="/icons/icon-192.png" alt="StartupSarthi" className="brand-icon" />
            <div>
              <span className="brand-name">{t(lang, "appName")}</span>
              <span className="brand-sub">{t(lang, "offlineReady")}</span>
            </div>
          </button>

          <div className="nav-controls">
            {/* Desktop Navigation */}
            <button
              className="nav-pill-btn desktop-only"
              onClick={() => setView("home")}
              style={
                view === "home"
                  ? { borderColor: "#00e676", color: "#00e676", background: "rgba(0,230,118,0.1)" }
                  : undefined
              }
            >
              🚀 {t(lang, "navAnalyze")}
            </button>
            <button
              className="nav-pill-btn desktop-only"
              onClick={() => setView("calculator")}
              style={
                view === "calculator"
                  ? { borderColor: "#ffb830", color: "#ffb830", background: "rgba(255,184,48,0.1)" }
                  : undefined
              }
            >
              🧮 {t(lang, "navCalculator")}
            </button>
            <button
              className="nav-pill-btn desktop-only"
              onClick={() => setView("saved")}
              style={
                view === "saved"
                  ? { borderColor: "#56ccf2", color: "#56ccf2", background: "rgba(86,204,242,0.1)" }
                  : undefined
              }
            >
              💾 {t(lang, "savedIdeas")} ({savedIdeas.length})
            </button>

            {/* Language Switcher */}
            <div className="lang-switcher" role="group" aria-label="Language">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  className={`lang-btn ${lang === item.code ? "active" : ""}`}
                  onClick={() => setLang(item.code)}
                  title={item.nativeName}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Install PWA Button (shown when browser supports install) */}
            {deferredPrompt && (
              <button className="nav-pill-btn install" onClick={handleInstallApp}>
                📲 {t(lang, "installApp")}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-container">
        {view === "calculator" && (
          <div style={{ paddingTop: 24 }}>
            <SchemesMatcherTab
              result={null}
              founderProfile={founderProfileId}
              areaType={areaType}
              lang={lang}
              standalone
            />
          </div>
        )}

        {view === "saved" && (
          <div style={{ paddingTop: 18 }}>
            <SavedIdeasDrawer
              savedIdeas={savedIdeas}
              onLoad={handleLoadSaved}
              onDelete={handleDeleteSaved}
              lang={lang}
            />
          </div>
        )}

        {view === "home" && (
          <>
            {/* Hero Header */}
            <header
              className="no-print"
              style={{ paddingTop: 38, paddingBottom: 28, textAlign: "center" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  background: "rgba(0,230,118,0.08)",
                  border: "1px solid rgba(0,230,118,0.22)",
                  borderRadius: 99,
                  padding: "6px 14px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#00e676",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#00e676",
                    fontWeight: 800,
                  }}
                >
                  {t(lang, "heroBadge")}
                </span>
              </div>

              <h1
                style={{
                  margin: "0 0 12px",
                  fontSize: "clamp(28px, 5vw, 48px)",
                  fontWeight: 900,
                  lineHeight: 1.12,
                  letterSpacing: "-0.025em",
                }}
              >
                {t(lang, "heroTitle1")}{" "}
                <span style={{ color: "#00e676" }}>{t(lang, "heroTitle2")}</span>
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  color: "rgba(241,239,233,0.68)",
                  lineHeight: 1.6,
                  maxWidth: 640,
                  marginInline: "auto",
                }}
              >
                {t(lang, "heroSubtitle")}
              </p>
            </header>

            {/* Founder Intake Card */}
            <section className="card no-print" style={{ marginBottom: 20 }}>
              {/* Idea Textarea */}
              <div style={{ marginBottom: 16 }}>
                <label className="field-label" style={{ color: "#00e676" }}>
                  {t(lang, "ideaLabel")}
                </label>
                <textarea
                  ref={textareaRef}
                  className="field-textarea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.metaKey || e.ctrlKey) && handleAnalyze()}
                  placeholder={t(lang, "ideaPlaceholder")}
                  rows={3}
                  style={{ minHeight: 88, resize: "none", fontSize: 15, lineHeight: 1.55 }}
                />
              </div>

              {/* Location & Sector */}
              <div className="grid-2" style={{ marginBottom: 16 }}>
                <div>
                  <label className="field-label">{t(lang, "locationLabel")}</label>
                  <input
                    type="text"
                    className="field-input"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    placeholder={t(lang, "locationPlaceholder")}
                  />
                </div>
                <div>
                  <label className="field-label">{t(lang, "sectorLabel")}</label>
                  <select
                    className="field-select"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  >
                    {SECTORS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Starting Budget Chips */}
              <div style={{ marginBottom: 16 }}>
                <label className="field-label">{t(lang, "budgetLabel")}</label>
                <div className="chip-row">
                  {BUDGET_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      className={`chip-btn ${budgetId === tier.id ? "active" : ""}`}
                      onClick={() => setBudgetId(tier.id)}
                      title={tier.hint}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Founder Profile & Urban/Rural */}
              <div className="grid-2" style={{ marginBottom: 18 }}>
                <div>
                  <label className="field-label">{t(lang, "profileLabel")}</label>
                  <select
                    className="field-select"
                    value={founderProfileId}
                    onChange={(e) => setFounderProfileId(e.target.value)}
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
                      className={`chip-btn ${areaType === "urban" ? "active" : ""}`}
                      onClick={() => setAreaType("urban")}
                      style={{ flex: 1 }}
                    >
                      🏙️ {t(lang, "areaUrban")}
                    </button>
                    <button
                      type="button"
                      className={`chip-btn ${areaType === "rural" ? "active" : ""}`}
                      onClick={() => setAreaType("rural")}
                      style={{ flex: 1 }}
                    >
                      🌾 {t(lang, "areaRural")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontSize: 11.5, color: "rgba(241,239,233,0.38)", fontFamily: "monospace" }}>
                  {t(lang, "shortcutHint")}
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !idea.trim()}
                  className="primary-cta"
                >
                  {loading ? t(lang, "analyzingBtn") : t(lang, "analyzeBtn")}
                </button>
              </div>
            </section>

            {/* Sample Low-Capital Founder Ideas */}
            {!result && !loading && (
              <section className="no-print" style={{ marginBottom: 28 }}>
                <div className="field-label" style={{ marginBottom: 10 }}>
                  ⚡ {t(lang, "sampleTitle")}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setIdea(ex.idea);
                        setTargetLocation(ex.location);
                        setSector(ex.sector);
                        setBudgetId(ex.budgetId);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 11,
                        padding: "11px 14px",
                        fontSize: 13,
                        color: "rgba(241,239,233,0.78)",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span>💡 {ex.idea}</span>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: "#00e676",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t(lang, "useSample")}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ textAlign: "center", padding: "54px 0" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    margin: "0 auto 18px",
                    border: "3px solid rgba(0,230,118,0.16)",
                    borderTopColor: "#00e676",
                    borderRadius: "50%",
                    animation: "spin 0.85s linear infinite",
                  }}
                />
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
                  {t(lang, "loadingTitle")}
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(241,239,233,0.48)", fontFamily: "monospace" }}>
                  {t(lang, "loadingSub")}
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  background: "rgba(255,94,94,0.1)",
                  border: "1px solid rgba(255,94,94,0.32)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 20,
                  color: "#ff7a7a",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Results Dashboard */}
            {result && (
              <div ref={resultsRef}>
                {/* Verdict Hero Card */}
                <div
                  className="non-dpr-section"
                  style={{
                    background: vc.bg,
                    border: `1px solid ${vc.border}`,
                    borderRadius: 16,
                    padding: "24px 20px",
                    marginBottom: 18,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(241,239,233,0.45)",
                      fontFamily: "monospace",
                      marginBottom: 6,
                    }}
                  >
                    {result.suggestedBusinessName || "Startup Verdict"}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(26px, 4.5vw, 36px)",
                      fontWeight: 900,
                      color: vc.color,
                      marginBottom: 8,
                    }}
                  >
                    {result.verdict}
                  </div>
                  <p
                    style={{
                      margin: "0 auto 16px",
                      fontSize: 15,
                      color: "rgba(241,239,233,0.86)",
                      maxWidth: 600,
                      lineHeight: 1.55,
                    }}
                  >
                    {result.oneLiner}
                  </p>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "rgba(241,239,233,0.5)", fontFamily: "monospace" }}>
                      Feasibility Score
                    </span>
                    <div
                      style={{
                        width: 130,
                        height: 6,
                        background: "rgba(255,255,255,0.12)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, Number(result.verdictScore) || 75)}%`,
                          height: "100%",
                          background: vc.color,
                        }}
                      />
                    </div>
                    <strong style={{ color: vc.color, fontFamily: "monospace" }}>
                      {result.verdictScore}%
                    </strong>
                  </div>

                  {/* Quick Save & Export Actions */}
                  <div
                    className="no-print"
                    style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10 }}
                  >
                    <button
                      onClick={() => handleSaveCurrentIdea()}
                      className="nav-pill-btn"
                      style={
                        isAlreadySaved
                          ? { borderColor: "#00e676", color: "#00e676", background: "rgba(0,230,118,0.14)" }
                          : undefined
                      }
                    >
                      {isAlreadySaved ? `💾 ${t(lang, "savedDone")}` : `💾 ${t(lang, "saveIdea")}`}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("dpr");
                        triggerPrint("dpr");
                      }}
                      className="nav-pill-btn"
                      style={{ borderColor: "rgba(86,204,242,0.45)", color: "#56ccf2" }}
                    >
                      📄 {t(lang, "printDpr")}
                    </button>
                    <button onClick={() => triggerPrint("full")} className="nav-pill-btn">
                      🖨️ {t(lang, "printReport")}
                    </button>
                  </div>
                </div>

                {/* Result Section Tabs */}
                <div className="tabs-scroll no-print" style={{ marginBottom: 18 }}>
                  {RESULT_TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        className="tab-btn"
                        onClick={() => setActiveTab(tab.id)}
                        style={
                          isActive
                            ? { background: tab.accent, color: "#07110b" }
                            : undefined
                        }
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content Panels */}
                {activeTab === "budget" && (
                  <BudgetPlannerTab
                    result={result}
                    budgetTier={selectedBudget}
                    lang={lang}
                    onGoToSchemes={() => setActiveTab("schemes")}
                    onGoToDpr={() => setActiveTab("dpr")}
                  />
                )}

                {activeTab === "schemes" && (
                  <SchemesMatcherTab
                    result={result}
                    founderProfile={founderProfileId}
                    areaType={areaType}
                    checkedDocs={checkedDocs}
                    onToggleDoc={handleToggleDoc}
                    lang={lang}
                  />
                )}

                {activeTab === "dpr" && (
                  <DprReportTab
                    result={result}
                    idea={idea}
                    targetLocation={targetLocation}
                    sector={sector}
                    founderProfileLabel={selectedProfile.label}
                    areaType={areaType}
                    lang={lang}
                    onPrintDpr={() => triggerPrint("dpr")}
                  />
                )}

                {activeTab === "vc" && <VcAnalysisTab result={result} />}
                {activeTab === "location" && <LocationTab result={result} />}
                {activeTab === "marketing" && <MarketingTab result={result} />}

                {/* Bottom Reset */}
                <div className="no-print" style={{ textAlign: "center", marginTop: 28 }}>
                  <button
                    onClick={() => {
                      setResult(null);
                      setIdea("");
                      setCurrentIdeaId(null);
                      setJustSaved(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="nav-pill-btn"
                  >
                    {t(lang, "newIdeaBtn")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav no-print">
        <button
          className={`mobile-nav-item ${view === "home" ? "active" : ""}`}
          onClick={() => setView("home")}
        >
          <span style={{ fontSize: 18 }}>🚀</span>
          <span>{t(lang, "navAnalyze")}</span>
        </button>
        <button
          className={`mobile-nav-item ${view === "calculator" ? "active" : ""}`}
          onClick={() => setView("calculator")}
        >
          <span style={{ fontSize: 18 }}>🧮</span>
          <span>{t(lang, "tabSchemes")}</span>
        </button>
        <button
          className={`mobile-nav-item ${view === "saved" ? "active" : ""}`}
          onClick={() => setView("saved")}
        >
          <span style={{ fontSize: 18 }}>💾</span>
          <span>
            {t(lang, "savedIdeas")} ({savedIdeas.length})
          </span>
        </button>
      </div>
    </div>
  );
}
