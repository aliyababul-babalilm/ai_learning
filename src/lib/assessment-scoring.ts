// Assessment Scoring Engine
// Ported from visa-commodities — exact formulas, weights, mappings, and edge cases

// ─── Helpers ────────────────────────────────────────────────────────────────

function likertToPoints(value: string): number {
  if (value.startsWith("1")) return 20;
  if (value.startsWith("2")) return 40;
  if (value.startsWith("3")) return 60;
  if (value.startsWith("4")) return 80;
  return 100;
}

function average(values: number[]): number {
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

// ─── DATA MATURITY ──────────────────────────────────────────────────────────

export function scoreDimDA(responses: Record<string, any>): number {
  // DA1: multi-select with weighted scoring
  const da1 = (() => {
    const values: string[] = responses.DA1 || [];
    if (values.includes("I don't know")) return 20;
    let score = 0;
    if (values.includes("Cloud-based platforms (e.g., Google Cloud, AWS, Azure)")) score += 25;
    if (values.includes("ERP or CRM systems (e.g., SAP, Salesforce, QuickBooks, Dynamics)")) score += 20;
    if (values.includes("A dedicated data warehouse or data lake")) score += 30;
    if (values.includes("On-premise servers or local data centres")) score += 10;
    if (values.includes("Spreadsheets (Excel, Google Sheets)")) score -= 10;
    if (values.includes("Paper records or physical filing systems")) score -= 20;
    if (values.includes("Individual employees' devices or email inboxes")) score -= 15;
    return Math.max(10, Math.min(100, 40 + score));
  })();

  // DA2: likert
  const da2 = likertToPoints(responses.DA2 || "3");

  // DA3: grid scoring (Yes:100, Partial:60, No:20, Don't Know:30) averaged
  const da3 = (() => {
    const grid: Record<string, string> = responses.DA3 || {};
    const values = Object.values(grid);
    if (values.length === 0) return 50;
    const scores = values.map((v) =>
      v === "Yes" ? 100 : v === "Partial" ? 60 : v === "No" ? 20 : 30
    );
    return average(scores);
  })();

  // DA4: single-select mapping
  const da4Map: Record<string, number> = {
    "Real-time (continuous stream)": 100,
    "Near real-time (every few minutes to hourly)": 85,
    "Daily batch updates": 70,
    "Weekly updates": 45,
    "Monthly or less frequently": 25,
    "Manual updates with no fixed schedule": 15,
  };
  const da4 = da4Map[responses.DA4] ?? 50;

  // DA5: single-select mapping
  const da5Map: Record<string, number> = {
    "Yes, frequently (several times per month)": 10,
    "Yes, occasionally (a few times per quarter)": 35,
    "Rarely (once or twice in the past year)": 65,
    "No, this has not been an issue": 100,
    "I don't know": 30,
  };
  const da5 = da5Map[responses.DA5] ?? 50;

  return average([da1, da2, da3, da4, da5]);
}

export function scoreDimDQ(responses: Record<string, any>): number {
  // DQ1: likert
  const dq1 = likertToPoints(responses.DQ1 || "3");

  // DQ2: multi-select issues (-15 each, "rare or not a concern" = 100)
  const dq2 = (() => {
    const values: string[] = responses.DQ2 || [];
    if (values.includes("Data quality issues are rare or not a concern for us")) return 100;
    return Math.max(10, 100 - values.length * 15);
  })();

  // DQ3: single-select
  const dq3Map: Record<string, number> = {
    "Yes \u2014 automated validation rules are built into our systems": 90,
    "Yes \u2014 we carry out periodic manual data cleansing exercises": 65,
    "Both automated validation and periodic manual cleansing": 100,
    "Informal / ad-hoc cleansing only": 35,
    "No formal validation or cleansing processes": 10,
  };
  const dq3 = dq3Map[responses.DQ3] ?? 50;

  // DQ4: single-select
  const dq4Map: Record<string, number> = {
    "Always \u2014 we have a single source of truth that all teams use": 100,
    "Usually \u2014 minor discrepancies occur but are generally reconcilable": 80,
    "Sometimes \u2014 differences are common and require investigation to resolve": 55,
    "Rarely \u2014 different teams regularly report materially different numbers": 25,
    "Never \u2014 data consistency is a persistent and unresolved problem": 5,
  };
  const dq4 = dq4Map[responses.DQ4] ?? 50;

  return average([dq1, dq2, dq3, dq4]);
}

export function scoreDimDI(responses: Record<string, any>): number {
  // DI1: multi-select with weighted scoring
  const di1 = (() => {
    const values: string[] = responses.DI1 || [];
    if (values.includes("I don't know")) return 25;
    if (values.includes("No formal data tools \u2014 data is managed manually")) return 10;
    let score = 25;
    if (values.includes("Business Intelligence tools (Power BI, Tableau, Looker, Metabase)")) score += 20;
    if (values.includes("Cloud data warehouse (Snowflake, BigQuery, Redshift, Azure Synapse)")) score += 25;
    if (values.includes("On-premise database (MySQL, SQL Server, Oracle, PostgreSQL)")) score += 15;
    if (values.includes("ERP system with built-in reporting (SAP, Oracle ERP, Microsoft Dynamics, QuickBooks Enterprise)")) score += 10;
    if (values.includes("CRM with analytics (Salesforce, HubSpot)")) score += 10;
    if (values.includes("ETL / data integration tools (Fivetran, Talend, Azure Data Factory, dbt)")) score += 15;
    if (values.includes("Custom-built data pipelines or APIs")) score += 15;
    if (values.includes("Microsoft Excel / Google Sheets (primary data tool)")) score -= 10;
    return Math.max(10, Math.min(100, score));
  })();

  // DI2: single-select
  const di2Map: Record<string, number> = {
    "Automatically via integrated APIs or data pipelines \u2014 data syncs in real time or on a schedule": 100,
    "Semi-automatically \u2014 some integrations exist but many transfers require manual triggering": 70,
    "Mostly manual \u2014 data is regularly exported (e.g., as Excel files) and re-imported into other systems": 35,
    "Fully manual \u2014 employees move data between systems by hand": 10,
    "I don't know": 25,
  };
  const di2 = di2Map[responses.DI2] ?? 50;

  // DI3: single-select
  const di3Map: Record<string, number> = {
    "Yes \u2014 automated backups with a tested recovery plan": 100,
    "Yes \u2014 backups exist but the recovery plan has not been formally tested": 75,
    "Partial \u2014 some systems are backed up but not all": 45,
    "No \u2014 backups are informal or non-existent": 10,
    "I don't know": 20,
  };
  const di3 = di3Map[responses.DI3] ?? 50;

  // DI4: likert
  const di4 = likertToPoints(responses.DI4 || "3");

  return average([di1, di2, di3, di4]);
}

export function scoreDimDG(responses: Record<string, any>): number {
  // DG1: single-select
  const dg1Map: Record<string, number> = {
    "Yes \u2014 a dedicated Chief Data Officer or equivalent senior role": 100,
    "Yes \u2014 data ownership is assigned at the department or dataset level": 75,
    "Informally \u2014 one person tends to manage data but without a formal mandate": 45,
    "No \u2014 data governance is not formally assigned": 10,
    "I don't know": 20,
  };
  const dg1 = dg1Map[responses.DG1] ?? 50;

  // DG2: multi-select (count * 20, capped at 100; "None" = 5)
  const dg2 = (() => {
    const values: string[] = responses.DG2 || [];
    if (values.includes("None of the above")) return 5;
    return Math.min(100, values.length * 20);
  })();

  // DG3: single-select
  const dg3Map: Record<string, number> = {
    "Role-based access controls are strictly enforced via system-level permissions": 100,
    "Access is managed but controls are not always consistently applied": 70,
    "Access is largely trust-based, with minimal technical controls": 35,
    "There are no formal access controls \u2014 most employees can access most data": 10,
    "I don't know": 20,
  };
  const dg3 = dg3Map[responses.DG3] ?? 50;

  // DG4: single-select
  const dg4Map: Record<string, number> = {
    "Yes \u2014 and it was a significant incident with material business impact": 20,
    "Yes \u2014 a minor incident occurred and was contained": 55,
    "No \u2014 not to my knowledge": 90,
    "I don't know": 35,
  };
  const dg4 = dg4Map[responses.DG4] ?? 50;

  return average([dg1, dg2, dg3, dg4]);
}

export function scoreDimDC(responses: Record<string, any>): number {
  // DC1: likert
  const dc1 = likertToPoints(responses.DC1 || "3");

  // DC2: single-select
  const dc2Map: Record<string, number> = {
    "Highly literate \u2014 leaders actively seek out data, interpret dashboards, and challenge data quality.": 100,
    "Moderately literate \u2014 most leaders are comfortable with standard reports and KPIs.": 75,
    "Partially literate \u2014 some leaders engage with data; others prefer narrative or verbal briefings.": 50,
    "Low literacy \u2014 data is rarely used in leadership discussions or strategic decisions.": 20,
    "I don't know": 30,
  };
  const dc2 = dc2Map[responses.DC2] ?? 50;

  // DC3: single-select
  const dc3Map: Record<string, number> = {
    "Yes \u2014 KPIs are formally defined, tracked in a dashboard, and reviewed in regular governance meetings.": 100,
    "Yes \u2014 KPIs exist and are tracked, but review is inconsistent or informal.": 70,
    "Partially \u2014 some teams track KPIs; others do not.": 40,
    "No \u2014 KPI tracking is not currently in place.": 10,
  };
  const dc3 = dc3Map[responses.DC3] ?? 50;

  // DC4: single-select
  const dc4Map: Record<string, number> = {
    "Quantitative data analysis (reviewing metrics, running queries, analysing trends)": 100,
    "Structured qualitative review (interviews, surveys, focus groups)": 55,
    "Management experience and intuition": 20,
    "A mix of data and qualitative judgement": 75,
    "The root cause is rarely formally investigated": 5,
  };
  const dc4 = dc4Map[responses.DC4] ?? 50;

  // DC5: single-select
  const dc5Map: Record<string, number> = {
    "Yes \u2014 structured training delivered to all or most employees": 100,
    "Yes \u2014 training offered but take-up was limited or voluntary": 65,
    "No \u2014 but we are planning to do so": 40,
    "No \u2014 and it is not currently a priority": 10,
  };
  const dc5 = dc5Map[responses.DC5] ?? 50;

  return average([dc1, dc2, dc3, dc4, dc5]);
}

export function getDMITier(score: number): string {
  if (score <= 39) return "Foundational";
  if (score <= 59) return "Emerging";
  if (score <= 74) return "Structured";
  if (score <= 89) return "Advanced";
  return "Leading";
}

export function calculateDMI(responses: Record<string, any>): {
  dimensions: { DIM_DA: number; DIM_DQ: number; DIM_DI: number; DIM_DG: number; DIM_DC: number };
  dmiScore: number;
  tier: string;
} {
  const DIM_DA = scoreDimDA(responses);
  const DIM_DQ = scoreDimDQ(responses);
  const DIM_DI = scoreDimDI(responses);
  const DIM_DG = scoreDimDG(responses);
  const DIM_DC = scoreDimDC(responses);
  const dmiScore = average([DIM_DA, DIM_DQ, DIM_DI, DIM_DG, DIM_DC]);
  return {
    dimensions: { DIM_DA, DIM_DQ, DIM_DI, DIM_DG, DIM_DC },
    dmiScore,
    tier: getDMITier(dmiScore),
  };
}

// ─── PERSONAL AI ────────────────────────────────────────────────────────────

export function scorePaiAD(responses: Record<string, any>): number {
  // PAI_AD1: frequency mapping
  const ad1Map: Record<string, number> = {
    "Multiple times per day": 100,
    "Once per day": 85,
    "Several times per week": 65,
    "Once per week or less": 40,
    "Rarely (less than once per month)": 20,
    "Never": 0,
  };
  const ad1 = ad1Map[responses.PAI_AD1] ?? 0;

  // PAI_AD2: multi-select count * 10, cap 100; "I do not" = 0
  const ad2 = (() => {
    const values: string[] = responses.PAI_AD2 || [];
    if (values.includes("I do not currently use AI for professional tasks")) return 0;
    return Math.min(100, values.length * 10);
  })();

  // PAI_AD3: depth mapping
  const ad3Map: Record<string, number> = {
    "Surface level": 20,
    "Functional": 45,
    "Proficient": 70,
    "Advanced": 90,
    "Expert": 100,
  };
  const ad3 = ad3Map[responses.PAI_AD3] ?? 20;

  // PAI_AD4: change mapping
  const ad4Map: Record<string, number> = {
    "Significantly increased \u2014 AI is now a core part of how I work": 100,
    "Moderately increased \u2014 I use AI more than before": 80,
    "Remained the same": 55,
    "Decreased \u2014 I have found AI less useful than expected": 25,
    "I have not used AI consistently enough to observe a trend": 20,
  };
  const ad4 = ad4Map[responses.PAI_AD4] ?? 20;

  return average([ad1, ad2, ad3, ad4]);
}

export function scorePaiTB(responses: Record<string, any>): number {
  // PAI_TB1: multi-select count * 10, cap 100; "None" = 0
  const tb1 = (() => {
    const values: string[] = responses.PAI_TB1 || [];
    if (values.includes("None of the above")) return 0;
    return Math.min(100, values.length * 10);
  })();

  // PAI_TB2: likert
  const tb2 = likertToPoints(responses.PAI_TB2 || "3");

  // PAI_TB3: workflow mapping
  const tb3Map: Record<string, number> = {
    "Yes \u2014 I have designed and implemented multiple AI workflows": 100,
    "Yes \u2014 I have built at least one AI-assisted workflow": 80,
    "I have attempted to but faced technical barriers": 55,
    "No \u2014 but I am interested in doing so": 35,
    "No \u2014 I don't see the need": 10,
  };
  const tb3 = tb3Map[responses.PAI_TB3] ?? 35;

  return average([tb1, tb2, tb3]);
}

export function scorePaiPE(responses: Record<string, any>): number {
  // PAI_PE1: approach mapping
  const pe1Map: Record<string, number> = {
    "Conversational": 25,
    "Directive": 45,
    "Structured": 70,
    "Engineered": 90,
    "Systematic": 100,
  };
  const pe1 = pe1Map[responses.PAI_PE1] ?? 25;

  // PAI_PE2: multi-select count * 12, cap 100; "None" = 0
  const pe2 = (() => {
    const values: string[] = responses.PAI_PE2 || [];
    if (values.includes("None of the above \u2014 I am not familiar with these techniques")) return 0;
    return Math.min(100, values.length * 12);
  })();

  // PAI_PE4: iteration behaviour mapping
  const pe4Map: Record<string, number> = {
    "Accept the output as-is, even if imperfect": 10,
    "Rephrase my original request and try again": 40,
    "Add specific feedback or corrections to my follow-up prompt (\"This is too long, please focus on...\")": 65,
    "Systematically diagnose why the first prompt failed and redesign it": 85,
    "Use multiple follow-up prompts to iteratively refine the output toward a clear target": 100,
  };
  const pe4 = pe4Map[responses.PAI_PE4] ?? 40;

  // PAI_PE3: free-text prompt scoring algorithm
  const pe3 = scorePromptSample(responses.PAI_PE3 || "");

  // Weighted composite: PE1*0.2 + PE2*0.15 + PE4*0.15 + PE3*0.5
  return Math.round(pe1 * 0.2 + pe2 * 0.15 + pe4 * 0.15 + pe3 * 0.5);
}

function scorePromptSample(prompt: string): number {
  const lower = prompt.toLowerCase();
  let score = 25;
  if (prompt.length >= 80) score += 15;
  if (lower.includes("you are")) score += 12;
  if (lower.includes("context")) score += 8;
  if (lower.includes("format") || lower.includes("table") || lower.includes("json") || lower.includes("bullet")) score += 12;
  if (lower.includes("do not") || lower.includes("limit") || lower.includes("max") || lower.includes("under ")) score += 10;
  if (lower.includes("step by step") || lower.includes("first") || lower.includes("then")) score += 8;
  if (prompt.includes(":")) score += 5;
  if (/\n/.test(prompt)) score += 5;
  return Math.max(20, Math.min(100, score));
}

export function scorePaiCE(responses: Record<string, any>): number {
  // PAI_CE1: likert
  const ce1 = likertToPoints(responses.PAI_CE1 || "3");

  // PAI_CE2: standard practice mapping
  const ce2Map: Record<string, number> = {
    "I use AI output directly without modification \u2014 I trust it": 10,
    "I review the output for obvious errors or tone issues before using": 40,
    "I fact-check key claims against authoritative sources": 75,
    "I treat AI output as a first draft that I substantially edit before use": 90,
    "I use AI output as a thinking prompt and write the final product myself": 100,
  };
  const ce2 = ce2Map[responses.PAI_CE2] ?? 40;

  // PAI_CE3: statement classification
  const correct = new Set([
    "AI can produce plausible-sounding but entirely fabricated information",
    "AI tools can embed or amplify biases present in their training data",
    "The same prompt can produce different outputs at different times",
    "AI does not \"understand\" content \u2014 it predicts statistically likely outputs",
  ]);
  const incorrect = new Set([
    "AI tools can access real-time information from the internet (always)",
    "AI-generated content is always factually accurate if it sounds confident",
    "AI tools can fully replace human judgement in complex, ambiguous situations",
  ]);
  let ce3Score = 0;
  const ce3Values: string[] = responses.PAI_CE3 || [];
  for (const statement of ce3Values) {
    if (correct.has(statement)) ce3Score += 20;
    if (incorrect.has(statement)) ce3Score -= 10;
  }
  ce3Score = Math.max(0, Math.min(100, ce3Score + 20));

  // PAI_CE4: personal protocols mapping
  const ce4Map: Record<string, number> = {
    "Yes \u2014 I have clear personal guidelines about appropriate and inappropriate AI use in my role": 100,
    "Informally \u2014 I have a general sense of where I will and won't use AI": 70,
    "Not yet \u2014 but I am thinking about it": 45,
    "No \u2014 I use AI wherever it is helpful without formal criteria": 20,
  };
  const ce4 = ce4Map[responses.PAI_CE4] ?? 45;

  return average([ce1, ce2, ce3Score, ce4]);
}

export function scorePaiTW(responses: Record<string, any>): number {
  // PAI_TW1: Multi-select advanced features (+12 per feature, "None" = 0, cap 100)
  const tw1 = responses.PAI_TW1;
  let tw1Score = 0;
  if (Array.isArray(tw1)) {
    if (tw1.includes("None of the above")) {
      tw1Score = 0;
    } else {
      tw1Score = Math.min(100, tw1.length * 12);
    }
  }

  // PAI_TW2: Project count
  const tw2Map: Record<string, number> = {
    "None \u2014 I don't use Projects": 0,
    "1 project": 30,
    "2-3 projects for different work areas": 60,
    "4-5 projects covering most of my workflow": 85,
    "6+ projects \u2014 I have a project for every major work stream": 100,
  };
  const tw2Score = tw2Map[responses.PAI_TW2] ?? 0;

  // PAI_TW3: Skills usage
  const tw3Map: Record<string, number> = {
    "I don't know what Claude Skills are": 0,
    "I've heard of them but haven't used any": 15,
    "I've enabled and used pre-built skills from Anthropic": 45,
    "I've created 1-2 custom skills for my own use": 75,
    "I've created multiple skills and shared them with my team": 100,
  };
  const tw3Score = tw3Map[responses.PAI_TW3] ?? 0;

  // PAI_TW4: Automation approach
  const tw4Map: Record<string, number> = {
    "I type everything from scratch each time": 10,
    "I copy-paste previous prompts and modify them": 30,
    "I have saved templates I reuse regularly": 55,
    "I use Claude Skills or similar tools to automate my most common tasks": 80,
    "I've built end-to-end automated workflows where AI runs with minimal manual input": 100,
  };
  const tw4Score = tw4Map[responses.PAI_TW4] ?? 0;

  // PAI_TW5: Multi-select customization (+14 per item, "None" = 0, cap 100)
  const tw5 = responses.PAI_TW5;
  let tw5Score = 0;
  if (Array.isArray(tw5)) {
    if (tw5.includes("None of the above")) {
      tw5Score = 0;
    } else {
      tw5Score = Math.min(100, tw5.length * 14);
    }
  }

  return Math.round((tw1Score + tw2Score + tw3Score + tw4Score + tw5Score) / 5);
}

export function getPASTier(score: number): string {
  if (score <= 29) return "Novice";
  if (score <= 49) return "Developing";
  if (score <= 69) return "Practitioner";
  if (score <= 84) return "Proficient";
  return "Advanced";
}

export function calculatePAS(responses: Record<string, any>): {
  dimensions: { PAI_AD: number; PAI_TB: number; PAI_PE: number; PAI_CE: number; PAI_TW: number };
  pasScore: number;
  tier: string;
} {
  const PAI_AD = scorePaiAD(responses);
  const PAI_TB = scorePaiTB(responses);
  const PAI_PE = scorePaiPE(responses);
  const PAI_CE = scorePaiCE(responses);
  const PAI_TW = scorePaiTW(responses);
  const pasScore = average([PAI_AD, PAI_TB, PAI_PE, PAI_CE, PAI_TW]);
  return {
    dimensions: { PAI_AD, PAI_TB, PAI_PE, PAI_CE, PAI_TW },
    pasScore,
    tier: getPASTier(pasScore),
  };
}

// ─── COMPANY AI ─────────────────────────────────────────────────────────────

export function scoreCaiSV(responses: Record<string, any>): number {
  const sv1Map: Record<string, number> = {
    "Yes \u2014 AI is a named strategic priority with defined goals, a roadmap, and executive ownership": 100,
    "Partially \u2014 AI has been discussed at leadership level but is not yet formally codified in strategy": 65,
    "No \u2014 AI has not yet entered the organisation's formal strategic planning": 20,
    "I don't know": 25,
  };
  const sv1 = sv1Map[responses.CAI_SV1] ?? 25;

  const sv2Map: Record<string, number> = {
    "The CEO / Managing Director personally champions AI adoption": 100,
    "The CTO or Chief Digital Officer leads AI strategy": 85,
    "A dedicated AI / Innovation team with C-suite backing": 90,
    "AI is sponsored at the divisional or department level, not at the executive level": 55,
    "There is no clear executive sponsor for AI": 15,
    "I don't know": 25,
  };
  const sv2 = sv2Map[responses.CAI_SV2] ?? 25;

  const sv3Map: Record<string, number> = {
    "Yes \u2014 AI has a formal, dedicated budget line": 100,
    "Yes \u2014 AI spending is approved project-by-project but there is no standing budget": 70,
    "No \u2014 AI spending comes from general IT or operational budgets without formal allocation": 40,
    "No \u2014 there is no active AI investment at this time": 10,
    "I don't know": 25,
  };
  const sv3 = sv3Map[responses.CAI_SV3] ?? 25;

  const sv4 = likertToPoints(responses.CAI_SV4 || "3");

  // SV5: free-text length scoring
  const sv5Text: string = responses.CAI_SV5 || "";
  const sv5 = Math.min(100, Math.max(35, 35 + Math.round((sv5Text.length - 50) / 4)));

  return average([sv1, sv2, sv3, sv4, sv5]);
}

export function scoreCaiIT(responses: Record<string, any>): number {
  const it1Map: Record<string, number> = {
    "Microsoft ecosystem (Azure, M365, Teams, Dynamics)": 80,
    "Google ecosystem (Google Workspace, Google Cloud)": 80,
    "SAP or Oracle ecosystem (enterprise ERP)": 75,
    "Salesforce ecosystem (CRM-centric)": 75,
    "A hybrid of cloud and on-premise systems from multiple vendors": 65,
    "Predominantly legacy / on-premise systems with limited cloud adoption": 25,
    "I don't know": 25,
  };
  const it1 = it1Map[responses.CAI_IT1] ?? 25;

  const it2Map: Record<string, number> = {
    "Yes \u2014 multiple AI capabilities are live and actively used (e.g., Copilot, Einstein, etc.)": 100,
    "Yes \u2014 at least one AI capability is live and integrated into a business process": 80,
    "Partially \u2014 AI features exist in our tools but are not actively used": 55,
    "No \u2014 no AI capabilities are currently live": 15,
    "I don't know": 25,
  };
  const it2 = it2Map[responses.CAI_IT2] ?? 25;

  // IT3: multi-select
  const it3 = (() => {
    const values: string[] = responses.CAI_IT3 || [];
    if (values.includes("None of the above")) return 10;
    if (values.includes("I don't know")) return 25;
    return Math.min(100, values.length * 12);
  })();

  return average([it1, it2, it3]);
}

export function scoreCaiPI(responses: Record<string, any>): number {
  // PI1: multi-select
  const pi1 = (() => {
    const values: string[] = responses.CAI_PI1 || [];
    if (values.includes("None of the above")) return 10;
    if (values.includes("I don't know")) return 25;
    return Math.min(100, values.length * 12);
  })();

  // PI2: free-text length scoring
  const pi2Text: string = responses.CAI_PI2 || "";
  const pi2 = Math.min(100, Math.max(35, 35 + Math.round((pi2Text.length - 50) / 5)));

  // PI3: single-select
  const pi3Map: Record<string, number> = {
    "A structured, data-driven prioritisation framework based on ROI, feasibility, and strategic alignment": 100,
    "Informed by leadership intuition and strategic priorities": 70,
    "Driven by vendor recommendations or industry peer benchmarking": 55,
    "Organic / bottom-up \u2014 AI adoption happens where individual employees take initiative": 45,
    "We have not yet begun formally prioritising AI integration": 15,
    "I don't know": 25,
  };
  const pi3 = pi3Map[responses.CAI_PI3] ?? 25;

  // PI4: barrier count
  const pi4 = (() => {
    const values: string[] = responses.CAI_PI4 || [];
    if (values.includes("We do not face significant barriers \u2014 AI integration is progressing well")) return 90;
    return Math.max(20, 90 - values.length * 18);
  })();

  return average([pi1, pi2, pi3, pi4]);
}

export function scoreCaiTC(responses: Record<string, any>): number {
  // TC1: likert
  const tc1 = likertToPoints(responses.CAI_TC1 || "3");

  // TC2: single-select
  const tc2Map: Record<string, number> = {
    "Yes \u2014 a structured, organisation-wide AI upskilling programme is underway": 100,
    "Yes \u2014 targeted training for specific roles or teams": 80,
    "Informally \u2014 individuals have undertaken self-directed AI learning (online courses, etc.)": 55,
    "No \u2014 but it is planned for the next 12 months": 35,
    "No \u2014 AI training is not currently a priority": 10,
  };
  const tc2 = tc2Map[responses.CAI_TC2] ?? 35;

  // TC3: single-select
  const tc3Map: Record<string, number> = {
    "Fully internally delivered \u2014 we have the capability to design, build, and manage AI systems in-house": 100,
    "Primarily internal with occasional external support": 85,
    "Balanced \u2014 internal team works in partnership with external specialists": 65,
    "Primarily external \u2014 we rely heavily on vendors or consultants for AI work": 40,
    "Entirely external \u2014 all AI initiatives are outsourced": 20,
  };
  const tc3 = tc3Map[responses.CAI_TC3] ?? 40;

  return average([tc1, tc2, tc3]);
}

export function scoreCaiGE(responses: Record<string, any>): number {
  // GE1: single-select
  const ge1Map: Record<string, number> = {
    "Yes \u2014 a comprehensive AI policy covering acceptable use, data handling, and accountability is in place and communicated": 100,
    "Yes \u2014 a basic policy exists but is not comprehensively applied": 70,
    "In development \u2014 a policy is being drafted": 45,
    "No \u2014 and it is not currently planned": 10,
    "I don't know": 25,
  };
  const ge1 = ge1Map[responses.CAI_GE1] ?? 25;

  // GE2: single-select
  const ge2Map: Record<string, number> = {
    "Yes \u2014 automated monitoring and human oversight processes are in place": 100,
    "Yes \u2014 periodic manual reviews of AI outputs are conducted": 75,
    "Informal \u2014 occasional spot-checks but no systematic review": 45,
    "No \u2014 AI outputs are not currently monitored or audited": 10,
    "Not applicable \u2014 we have no AI in production": 35,
  };
  const ge2 = ge2Map[responses.CAI_GE2] ?? 25;

  // GE3: multi-select count * 16, cap 100; "None" = 10
  const ge3 = (() => {
    const values: string[] = responses.CAI_GE3 || [];
    if (values.includes("None of the above have been formally considered")) return 10;
    return Math.min(100, values.length * 16);
  })();

  // GE4: free-text length scoring
  const ge4Text: string = responses.CAI_GE4 || "";
  const ge4 = Math.min(100, Math.max(35, 35 + Math.round((ge4Text.length - 30) / 3)));

  return average([ge1, ge2, ge3, ge4]);
}

export function getCARITier(score: number): string {
  if (score <= 39) return "Foundational";
  if (score <= 59) return "Emerging";
  if (score <= 74) return "Structured";
  if (score <= 89) return "Advanced";
  return "Leading";
}

export function calculateCARI(responses: Record<string, any>): {
  dimensions: { CAI_SV: number; CAI_IT: number; CAI_PI: number; CAI_TC: number; CAI_GE: number };
  cariScore: number;
  tier: string;
  visibilityWeight: number;
} {
  const CAI_SV = scoreCaiSV(responses);
  const CAI_IT = scoreCaiIT(responses);
  const CAI_PI = scoreCaiPI(responses);
  const CAI_TC = scoreCaiTC(responses);
  const CAI_GE = scoreCaiGE(responses);
  const cariScore = average([CAI_SV, CAI_IT, CAI_PI, CAI_TC, CAI_GE]);

  // RC2 visibility weight
  const rc2 = responses.RC2 || "";
  let visibilityWeight = 1.0;
  if (rc2.startsWith("Full visibility")) visibilityWeight = 1.5;
  else if (rc2.startsWith("Significant visibility")) visibilityWeight = 1.25;
  else if (rc2.startsWith("Moderate visibility")) visibilityWeight = 1.0;
  else if (rc2.startsWith("Limited visibility")) visibilityWeight = 0.75;
  else if (rc2.startsWith("No visibility")) visibilityWeight = 0.5;

  return {
    dimensions: { CAI_SV, CAI_IT, CAI_PI, CAI_TC, CAI_GE },
    cariScore,
    tier: getCARITier(cariScore),
    visibilityWeight,
  };
}

// ─── OVERALL ────────────────────────────────────────────────────────────────

export function getOARSTier(score: number): string {
  if (score <= 34) return "Foundational";
  if (score <= 49) return "Emerging";
  if (score <= 64) return "Developing";
  if (score <= 79) return "Proficient";
  return "Advanced";
}

export function calculateOARS(
  dmi: number,
  pas: number,
  cari: number
): { score: number; tier: string } {
  const score = Math.round((dmi + pas + cari) / 3);
  return { score, tier: getOARSTier(score) };
}
