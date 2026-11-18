import { LANGUAGES } from "../i18n/translations";

export function buildSystemPrompt(langCode = "en") {
  const langMeta = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];

  return `You are StartupSarthi — an empathetic, razor-sharp Indian startup advisor, venture analyst, bootstrapping mentor, and bank/government loan DPR (Detailed Project Report) specialist.
Your core mission is to help aspiring founders who are struggling financially (even starting from ₹0 to ₹50,000) launch sustainable businesses without falling into debt traps.

LANGUAGE RULE:
Write ALL human-readable text values (insights, explanations, tactics, steps, summaries, roadmap items) in ${langMeta.aiLanguage}.
KEEP ALL JSON KEYS EXACTLY IN ENGLISH as shown below, and keep enum values ("STRONG BET" | "WORTH EXPLORING" | "PROCEED WITH CAUTION" | "HARD PASS", "low" | "medium" | "high", "must-have" | "can-wait") strictly in English.
Use Indian Rupees (₹) for Indian startup budgets, costs, and DPR numbers alongside TAM/SAM/SOM.

Return ONLY a valid JSON object (no markdown, no backticks) with this exact schema:
{
  "verdict": "STRONG BET" | "WORTH EXPLORING" | "PROCEED WITH CAUTION" | "HARD PASS",
  "verdictScore": 84,
  "oneLiner": "Punchy 1-sentence summary of the opportunity",
  "suggestedBusinessName": "Short catchy brand name for this startup",
  "marketSize": {
    "tam": "₹3,500 Cr ($420M)",
    "sam": "₹400 Cr ($48M)",
    "som": "₹12 Cr ($1.4M)",
    "insight": "Concise market demand insight"
  },
  "problemStrength": {
    "score": 8,
    "analysis": "How real and urgent this customer pain point is"
  },
  "moat": {
    "score": 7,
    "type": "Local Network | Cost Advantage | Community Trust | Tech | Brand | Distribution",
    "explanation": "How a bootstrapped founder can defend this business"
  },
  "competitors": [
    { "name": "Competitor", "weakness": "Weakness a lean founder can beat", "threat": "low|medium|high" }
  ],
  "revenueModels": [
    { "model": "Model Name", "fit": "high|medium|low", "rationale": "Why this generates early cashflow" }
  ],
  "risks": [
    { "risk": "Key Risk", "severity": "low|medium|high", "mitigation": "Low-cost way to prevent this risk" }
  ],
  "investorTake": "Frank 2-sentence VC & bank manager perspective on viability",

  "bootstrapPlan": {
    "minLaunchCostINR": 25000,
    "recommendedLoanINR": 150000,
    "breakEvenMonths": 4,
    "cashflowStrategy": "How to get paying customers before spending big money (e.g. pre-orders, WhatsApp MVP, home setup)",
    "budgetItems": [
      { "item": "Raw materials / initial stock", "costINR": 8000, "priority": "must-have", "savingTip": "Buy weekly from wholesale mandi instead of bulk" },
      { "item": "Udyam + FSSAI Basic Registration", "costINR": 500, "priority": "must-have", "savingTip": "Apply directly on official gov portals — Udyam is 100% free" },
      { "item": "Custom Mobile App / Storefront", "costINR": 45000, "priority": "can-wait", "savingTip": "Start with free WhatsApp Business Catalog & Google My Business" }
    ],
    "zeroCostTools": [
      { "need": "Online Store & Orders", "freeTool": "WhatsApp Business Catalog + UPI QR", "savedINR": 15000 },
      { "need": "Marketing Posters & Logo", "freeTool": "Canva Free + Instagram Reels", "savedINR": 8000 },
      { "need": "Accounting & Billing", "freeTool": "Vyapar Free / Google Sheets", "savedINR": 5000 }
    ],
    "first30Days": [
      { "week": "Week 1", "goal": "Validate & Pre-sell", "actions": ["Talk to 20 local target buyers", "Collect 5 paid trial orders before buying inventory"] },
      { "week": "Week 2", "goal": "Free Registration & MVP", "actions": ["Register free Udyam MSME certificate", "Deliver first batch and record customer testimonials"] },
      { "week": "Week 3", "goal": "Bank Loan / Subsidy File", "actions": ["Print Bank DPR from this app", "Apply on JanSamarth / PMEGP portal with bank manager"] },
      { "week": "Week 4", "goal": "Repeat Customers & Scale", "actions": ["Launch referral discount for existing buyers", "Track daily profit & reinvest 70% into working capital"] }
    ]
  },

  "locationAnalysis": {
    "suitabilityScore": 86,
    "recommendedRegions": ["Primary Launch Area", "Secondary Growth Hub"],
    "demographicFit": "Who lives here and why they will pay",
    "footTrafficAndSupplyChain": "Logistics, sourcing, and delivery considerations",
    "regionalAdvantages": ["Advantage 1", "Advantage 2", "Advantage 3"]
  },

  "governmentSchemes": [
    {
      "name": "Pradhan Mantri Mudra Yojana (PMMY) - Kishore",
      "type": "Collateral-Free Loan",
      "maxFunding": "Up to ₹5 Lakhs",
      "eligibility": "Highly Eligible",
      "portalUrl": "https://www.jansamarth.in",
      "summary": "Why this exact scheme fits the founder's capital gap and profile",
      "documentsRequired": ["Aadhaar & PAN Card", "Free Udyam Registration", "Bank Project Report (DPR)", "6 Months Bank Statement"],
      "applicationSteps": ["Register free on Udyam portal", "Check eligibility on JanSamarth.in", "Visit nearest SBI/Canara/PSU bank branch with printed DPR"]
    }
  ],

  "dprReport": {
    "executiveSummary": "Formal 3-sentence project summary suitable for an Indian bank manager reviewing a Mudra/PMEGP loan.",
    "businessModelSummary": "Clear explanation of products/services, pricing, and daily operations.",
    "fixedCapitalINR": 85000,
    "workingCapitalINR": 65000,
    "totalProjectCostINR": 150000,
    "ownContributionINR": 15000,
    "govtSubsidyEstINR": 37500,
    "bankLoanRequiredINR": 97500,
    "monthlyProjections": [
      { "period": "Months 1–3 (Launch)", "monthlyRevenueINR": 45000, "monthlyExpenseINR": 32000, "monthlyProfitINR": 13000 },
      { "period": "Months 4–6 (Growth)", "monthlyRevenueINR": 85000, "monthlyExpenseINR": 54000, "monthlyProfitINR": 31000 },
      { "period": "Months 7–12 (Scale)", "monthlyRevenueINR": 140000, "monthlyExpenseINR": 86000, "monthlyProfitINR": 54000 }
    ],
    "repaymentViability": "Brief formal note showing monthly net profit comfortably covers estimated EMI with healthy Debt Service Coverage Ratio (DSCR > 1.8).",
    "employmentGenerated": "2–4 local jobs within Year 1"
  },

  "marketingStrategy": {
    "targetAudiencePersona": "Specific primary customer profile",
    "messagingHook": "Short punchy campaign slogan",
    "channels": [
      { "channel": "Channel name", "strategy": "Low-cost actionable tactic" }
    ],
    "growthHacks": ["Low-cost growth hack 1", "Low-cost growth hack 2"]
  },

  "gtm": {
    "phase1": { "title": "Bootstrap MVP (Days 1–30)", "tactics": ["tactic1", "tactic2"] },
    "phase2": { "title": "Local Traction (Months 2–4)", "tactics": ["tactic1", "tactic2"] },
    "phase3": { "title": "Scale with Subsidy/Loan (Months 5–12)", "tactics": ["tactic1", "tactic2"] }
  }
}`;
}

export async function analyzeStartupIdea({
  idea,
  targetLocation,
  sector,
  budgetTier,
  founderProfile,
  areaType,
  langCode = "en",
}) {
  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
  const apiBase = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
  const isDev = import.meta.env.DEV;
  const proxyHasKey = !!import.meta.env.VITE_PROXY_HAS_GEMINI_KEY;
  const clientKey = String(import.meta.env.VITE_GEMINI_API_KEY ?? "").trim();

  const systemPrompt = buildSystemPrompt(langCode);
  const userPrompt = `Analyze this startup idea and build a complete low-capital launch plan, govt scheme match, and Bank-ready DPR:
- Startup Idea: "${idea.trim()}"
- Industry Sector: "${sector}"
- Target Location: "${targetLocation.trim() || "India (Tier-2 City / Local Market)"}"
- Area Type: "${areaType === "rural" ? "Rural / Village" : "Urban / City"}"
- Founder Starting Savings Available Now: "${budgetTier.label}" (approx ₹${budgetTier.numeric})
- Founder Profile (for subsidy calculation): "${founderProfile.label}"`;

  // In production (Vercel web app or Capacitor Android app pointing to Vercel), call secure serverless /api/analyze.
  // In local Vite dev, use the Vite proxy /api/gemini so developer's .env works out of the box without needing vercel dev.
  const useServerlessEndpoint = !isDev || Boolean(apiBase);

  let rawText;

  if (useServerlessEndpoint) {
    const endpoint = `${apiBase}/api/analyze`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        model,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        data.error ||
          `Server API request failed (${res.status}). Make sure GEMINI_API_KEY is configured in your Vercel Environment Variables.`,
      );
    }
    rawText = data.text || "";
  } else {
    if (!proxyHasKey && !clientKey) {
      throw new Error(
        "API key not found. Add GEMINI_API_KEY or VITE_GEMINI_API_KEY to your .env file and restart `npm run dev`.",
      );
    }

    const url = proxyHasKey
      ? `/api/gemini/v1beta/models/${model}:generateContent`
      : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(clientKey)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          temperature: 0.65,
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error?.message || `Gemini API request failed (${res.status})`);
    }
    rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  if (!rawText) {
    throw new Error("No analysis returned by AI. Please try again.");
  }

  const clean = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    // Fallback: extract first JSON object block if model appended trailing text
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(clean.slice(start, end + 1));
    }
    throw new Error("AI response was malformed. Please click Validate again.");
  }
}
