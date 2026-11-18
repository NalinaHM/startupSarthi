export const BUDGET_TIERS = [
  { id: "zero", label: "₹0 (Zero Capital)", numeric: 0, hint: "Pre-orders, service-first & govt loans" },
  { id: "under25k", label: "Under ₹25,000", numeric: 20000, hint: "Micro-MVP & Mudra Shishu fit" },
  { id: "25k-1l", label: "₹25,000 – ₹1 Lakh", numeric: 60000, hint: "Mudra Kishore / PMEGP margin ready" },
  { id: "1l-5l", label: "₹1 Lakh – ₹5 Lakhs", numeric: 250000, hint: "Equipment + working capital ready" },
  { id: "5l-plus", label: "₹5 Lakhs+", numeric: 600000, hint: "Scale-ready / Mudra Tarun & SISFS" },
];

export const FOUNDER_PROFILES = [
  { id: "general", label: "General Category", isSpecial: false },
  { id: "women", label: "Woman Entrepreneur (Extra Subsidy)", isSpecial: true },
  { id: "sc_st", label: "SC / ST Entrepreneur (Extra Subsidy)", isSpecial: true },
  { id: "obc_minority", label: "OBC / Minority / Ex-Servicemen / Divyang", isSpecial: true },
  { id: "student_youth", label: "Student / First-Time Youth Founder", isSpecial: false },
];

export const SECTORS = [
  "Food, Tiffin & Cloud Kitchen",
  "Agritech & Rural Business",
  "Retail, Kirana & Local D2C",
  "Services, Repair & Home Care",
  "Manufacturing & Micro-Unit",
  "AI, Software & SaaS",
  "EdTech & Skill Coaching",
  "Healthcare & Wellness",
  "CleanTech, Solar & EV",
  "Fintech & Local Commerce",
  "General / Multi-Sector",
];

export const VERIFIED_GOVT_SCHEMES = [
  {
    id: "pmmy",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    badge: "0% Collateral",
    maxFunding: "Up to ₹20 Lakhs (Shishu ₹50k · Kishore ₹5L · Tarun ₹10L · Tarun Plus ₹20L)",
    subsidy: "Collateral-free credit guarantee; low MSME bank interest (~8.5%–12%)",
    bestFor: "Any non-farm micro/small business (services, trading, food, manufacturing) with zero collateral.",
    portalUrl: "https://www.jansamarth.in",
    portalName: "JanSamarth Portal",
    documents: [
      "Aadhaar Card & PAN Card",
      "Udyam MSME Registration (Free online)",
      "Detailed Project Report (DPR) — Generate in DPR Tab",
      "6 Months Bank Statement & Passport Photos",
      "Equipment / Machinery Quotation (if buying assets)",
    ],
  },
  {
    id: "pmegp",
    name: "PMEGP (Prime Minister's Employment Generation Programme)",
    badge: "15%–35% Subsidy",
    maxFunding: "Up to ₹50 Lakhs (Manufacturing) · Up to ₹20 Lakhs (Service/Business)",
    subsidy: "Direct Govt Grant: 15% (Urban General), 25% (Rural General / Urban Special), 35% (Rural Special)",
    bestFor: "First-time founders setting up a new manufacturing or service micro-enterprise with minimal own savings (only 5%–10% margin).",
    portalUrl: "https://www.kviconline.gov.in/pmegpeportal/",
    portalName: "KVIC PMEGP Portal",
    documents: [
      "Aadhaar, PAN & Educational Certificate (8th pass min. for loans > ₹10L Mfg / ₹5L Service)",
      "Caste / Special Category Certificate (for 25%–35% subsidy)",
      "Rural Area Certificate (if applying in rural block)",
      "Project Report (DPR) with Capital & Working Capital split",
      "EDP Training Undertaking (free online training)",
    ],
  },
  {
    id: "standup-india",
    name: "Stand-Up India Scheme",
    badge: "Women & SC/ST",
    maxFunding: "₹10 Lakhs to ₹1 Crore (Composite Loan)",
    subsidy: "Up to 85% project cost financed; up to 7-year repayment with 18-month moratorium",
    bestFor: "Women and SC/ST entrepreneurs starting a brand-new (greenfield) manufacturing, service, agri-allied, or trading venture.",
    portalUrl: "https://www.standupmitra.in/",
    portalName: "StandUp Mitra Portal",
    documents: [
      "Identity & Address Proof + Category / Women Ownership Proof (51%+ stake)",
      "Business Registration / Udyam Certificate",
      "Detailed Project Report (DPR) & Rent Agreement",
      "ITR / Bank Statement (if available)",
    ],
  },
  {
    id: "pm-svanidhi",
    name: "PM SVANidhi (Micro Credit for Vendors)",
    badge: "Zero Paperwork",
    maxFunding: "₹10,000 → ₹20,000 → ₹50,000 progressive tranches",
    subsidy: "7% interest subsidy on timely repayment + ₹1,200/yr UPI cashback",
    bestFor: "Ultra-low capital micro-entrepreneurs, street food carts, local stall owners, and micro-vendors starting from ₹0.",
    portalUrl: "https://pmsvanidhi.mohua.gov.in/",
    portalName: "PM SVANidhi Portal",
    documents: [
      "Aadhaar Card linked with Mobile Number",
      "Active Savings Bank Account",
      "Certificate of Vending / Letter of Recommendation from Urban Local Body",
    ],
  },
  {
    id: "sisfs",
    name: "Startup India Seed Fund Scheme (SISFS)",
    badge: "Grant up to ₹20L",
    maxFunding: "Up to ₹20 Lakhs Equity-Free Grant + up to ₹50 Lakhs Debt/Convertible",
    subsidy: "Non-repayable grant for Proof of Concept, MVP prototype, and product trials",
    bestFor: "Innovative tech, agritech, edtech, healthcare, or scalable product startups registered as Pvt Ltd / LLP with DPIIT.",
    portalUrl: "https://seedfund.startupindia.gov.in/",
    portalName: "Startup India Seed Fund",
    documents: [
      "DPIIT Startup Recognition Certificate (Free on startupindia.gov.in)",
      "Company Incorporation Certificate (Pvt Ltd / LLP / Partnership)",
      "Pitch Deck & Prototype / MVP Demo",
      "Founders' Resume & 18-Month Utilization Plan",
    ],
  },
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma Scheme",
    badge: "5% Interest + ₹15k Grant",
    maxFunding: "₹1 Lakh (1st tranche) + ₹2 Lakhs (2nd tranche) + ₹15,000 Free Toolkit Voucher",
    subsidy: "Fixed 5% concessional interest rate + ₹500/day skill training stipend",
    bestFor: "Artisans, tailors, carpenters, potters, barbers, garland makers, and traditional craftspeople across 18 trades.",
    portalUrl: "https://pmvishwakarma.gov.in/",
    portalName: "PM Vishwakarma Portal",
    documents: [
      "Aadhaar Card & Mobile Number",
      "Bank Account Details & Ration Card",
      "Registration via nearest Common Service Centre (CSC)",
    ],
  },
];

/**
 * Deterministic PMEGP subsidy, Mudra tier, and Loan EMI calculator (works 100% offline).
 */
export function calculateFundingMetrics({
  projectCost = 300000,
  interestRate = 10.5,
  tenureMonths = 60,
  founderProfile = "general",
  areaType = "urban",
}) {
  const isSpecial = ["women", "sc_st", "obc_minority"].includes(founderProfile);
  const isRural = areaType === "rural";

  // Official PMEGP Margin Money (Subsidy) rates:
  // General Urban: 15% | General Rural: 25% | Special Urban: 25% | Special Rural: 35%
  let subsidyPercent = 15;
  if (isSpecial && isRural) subsidyPercent = 35;
  else if (isSpecial || isRural) subsidyPercent = 25;

  // Own beneficiary contribution under PMEGP: 10% General, 5% Special
  const ownContributionPercent = isSpecial ? 5 : 10;
  const ownContributionAmount = Math.round((projectCost * ownContributionPercent) / 100);

  // PMEGP subsidy cap applies up to ₹50L manufacturing / ₹20L service
  const eligibleCostForSubsidy = Math.min(projectCost, 2000000);
  const subsidyAmount = Math.round((eligibleCostForSubsidy * subsidyPercent) / 100);

  // Net principal after own contribution & subsidy lock-in adjustment
  const netLoanAmount = Math.max(0, projectCost - ownContributionAmount - subsidyAmount);

  // Standard monthly EMI formula on net loan
  const monthlyRate = interestRate / 12 / 100;
  let monthlyEmi = 0;
  if (netLoanAmount > 0 && tenureMonths > 0) {
    if (monthlyRate === 0) {
      monthlyEmi = Math.round(netLoanAmount / tenureMonths);
    } else {
      const factor = Math.pow(1 + monthlyRate, tenureMonths);
      monthlyEmi = Math.round((netLoanAmount * monthlyRate * factor) / (factor - 1));
    }
  }

  // Mudra Tier matching
  let mudraTier = "Tarun Plus (₹10L – ₹20L)";
  if (projectCost <= 50000) mudraTier = "Shishu (Up to ₹50,000)";
  else if (projectCost <= 500000) mudraTier = "Kishore (₹50,000 – ₹5 Lakhs)";
  else if (projectCost <= 1000000) mudraTier = "Tarun (₹5 Lakhs – ₹10 Lakhs)";
  else if (projectCost > 2000000) mudraTier = "CGTMSE / Stand-Up India (> ₹20L)";

  return {
    subsidyPercent,
    subsidyAmount,
    ownContributionPercent,
    ownContributionAmount,
    netLoanAmount,
    monthlyEmi,
    mudraTier,
  };
}

export function formatINR(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}
