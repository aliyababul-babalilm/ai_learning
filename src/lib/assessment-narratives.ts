// Assessment Narrative Generation
// LLM-powered narrative generation for assessment results

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

async function generateText(opts: {
  system: string;
  user: string;
  temperature: number;
  maxTokens: number;
}): Promise<string> {
  const message = await anthropic.messages.create({
    model,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }
  return content.text.trim();
}

// ─── DIMENSION LABELS ──────────────────────────────────────────────────────

export const DIMENSION_LABELS: Record<string, { short: string; full: string }> = {
  DIM_DA: { short: "DA", full: "Data Availability & Accessibility" },
  DIM_DQ: { short: "DQ", full: "Data Quality & Integrity" },
  DIM_DI: { short: "DI", full: "Data Infrastructure & Tooling" },
  DIM_DG: { short: "DG", full: "Data Governance & Ownership" },
  DIM_DC: { short: "DC", full: "Data Culture & Literacy" },
  PAI_AD: { short: "AD", full: "AI Adoption Frequency & Depth" },
  PAI_TB: { short: "TB", full: "AI Tool Breadth" },
  PAI_PE: { short: "PE", full: "Prompt Engineering Proficiency" },
  PAI_CE: { short: "CE", full: "AI Critical Evaluation" },
  PAI_TW: { short: "TW", full: "AI Tool & Workflow Sophistication" },
  CAI_SV: { short: "SV", full: "AI Strategy & Vision" },
  CAI_IT: { short: "IT", full: "AI Infrastructure & Tooling" },
  CAI_PI: { short: "PI", full: "AI Process Integration" },
  CAI_TC: { short: "TC", full: "AI Talent & Capability" },
  CAI_GE: { short: "GE", full: "AI Governance & Ethics" },
};

// ─── TIER HELPERS ───────────────────────────────────────────────────────────

function dmiTierLabel(score: number): string {
  if (score <= 39) return "Foundational";
  if (score <= 59) return "Emerging";
  if (score <= 74) return "Structured";
  if (score <= 89) return "Advanced";
  return "Leading";
}

function pasTierLabel(score: number): string {
  if (score <= 29) return "Novice";
  if (score <= 49) return "Developing";
  if (score <= 69) return "Practitioner";
  if (score <= 84) return "Proficient";
  return "Advanced";
}

function cariTierLabel(score: number): string {
  if (score <= 39) return "Foundational";
  if (score <= 59) return "Emerging";
  if (score <= 74) return "Structured";
  if (score <= 89) return "Advanced";
  return "Leading";
}

function oarsTierLabel(score: number): string {
  if (score <= 34) return "Foundational";
  if (score <= 49) return "Emerging";
  if (score <= 64) return "Developing";
  if (score <= 79) return "Proficient";
  return "Advanced";
}

// ─── DMI NARRATIVE ─────────────────────────────────────────────────────────

export async function generateDMINarrative(
  scores: Record<string, number>,
  dmiScore: number,
  companyContext: string
): Promise<string> {
  const tier = dmiTierLabel(dmiScore);

  const system = `You are a Principal Data Strategy Consultant at a leading advisory firm.
You specialise in enterprise data maturity assessment and data-driven transformation.
Your outputs are specific, evidence-grounded, and free of generic filler.
Do not use phrases like "it is evident", "it is clear", or "in today's world".
Every sentence must earn its place.`;

  const user = `Produce a Data Maturity narrative for the following organisation.

ORGANISATION CONTEXT:
${companyContext}

DATA MATURITY INDEX: ${dmiScore}/100 — ${tier}

SUB-DIMENSION SCORES:
- Data Availability & Accessibility (DIM_DA): ${scores.DIM_DA}/100
- Data Quality & Integrity (DIM_DQ): ${scores.DIM_DQ}/100
- Data Infrastructure & Tooling (DIM_DI): ${scores.DIM_DI}/100
- Data Governance & Ownership (DIM_DG): ${scores.DIM_DG}/100
- Data Culture & Literacy (DIM_DC): ${scores.DIM_DC}/100

Write exactly four paragraphs:

Paragraph 1 — OVERALL POSITION: Summarise the organisation's data maturity position, grounding it in the composite score and tier. Be direct about what this tier means for AI readiness.

Paragraph 2 — STRUCTURAL GAPS: Identify the two weakest dimensions and explain the specific operational consequences of each gap. Be concrete about what cannot be done until these gaps close.

Paragraph 3 — STRENGTHS & LEVERAGE POINTS: Identify the strongest dimensions and explain how they can be leveraged to accelerate AI adoption. Name specific types of AI use cases these strengths enable.

Paragraph 4 — PRIORITY INVESTMENT ROADMAP: Recommend the top 2-3 investments to improve data maturity, in priority order. Name specific actions, not vague aspirations.`;

  return generateText({ system, user, temperature: 0.3, maxTokens: 1500 });
}

// ─── PAS NARRATIVE ─────────────────────────────────────────────────────────

export async function generatePASNarrative(
  scores: Record<string, number>,
  pasScore: number,
  roleContext: string
): Promise<string> {
  const tier = pasTierLabel(pasScore);

  const system = `You are a Senior AI Skills Development Specialist at a global consulting firm.
You assess individual AI proficiency and design personalised upskilling recommendations.
Your outputs are specific, constructive, and free of filler language.
Do not use phrases like "it is evident", "in conclusion", or "in today's world".`;

  const user = `Produce a Personal AI Skills narrative for the following individual.

ROLE CONTEXT:
${roleContext}

PERSONAL AI SCORE: ${pasScore}/100 — ${tier}

SUB-DIMENSION SCORES:
- AI Adoption Frequency & Depth (PAI_AD): ${scores.PAI_AD}/100
- AI Tool Breadth (PAI_TB): ${scores.PAI_TB}/100
- Prompt Engineering Proficiency (PAI_PE): ${scores.PAI_PE}/100
- AI Critical Evaluation (PAI_CE): ${scores.PAI_CE}/100
- AI Tool & Workflow Sophistication (PAI_TW): ${scores.PAI_TW}/100

Write exactly three sections:

Section 1 — AI PROFILE SUMMARY: A 3-4 sentence characterisation of this person's AI proficiency level. Ground it in the scores. Be honest but constructive.

Section 2 — PROMPT ANALYSIS: Based on the prompt engineering score, characterise their likely prompting behaviour — what they probably do well and where they likely fall short. Be specific about techniques they should learn.

Section 3 — THREE PERSONALISED RECOMMENDATIONS: Three numbered, specific recommendations to improve their AI skills, ordered by impact. Each should include a concrete action they can take this week.`;

  return generateText({ system, user, temperature: 0.3, maxTokens: 1200 });
}

// ─── CARI NARRATIVE ────────────────────────────────────────────────────────

export async function generateCARINarrative(
  scores: Record<string, number>,
  cariScore: number,
  companyContext: string
): Promise<string> {
  const tier = cariTierLabel(cariScore);

  const system = `You are a Managing Director of AI Transformation at a top-tier consulting firm.
You assess corporate AI readiness and design transformation roadmaps.
Your outputs are specific, commercially grounded, and free of generic consulting language.
Do not use phrases like "it is evident", "it is clear", "leverage synergies", or "in today's world".
Every sentence must earn its place.`;

  const user = `Produce a Company AI Readiness narrative for the following organisation.

ORGANISATION CONTEXT:
${companyContext}

COMPANY AI READINESS INDEX: ${cariScore}/100 — ${tier}

SUB-DIMENSION SCORES:
- AI Strategy & Vision (CAI_SV): ${scores.CAI_SV}/100
- AI Infrastructure & Tooling (CAI_IT): ${scores.CAI_IT}/100
- AI Process Integration (CAI_PI): ${scores.CAI_PI}/100
- AI Talent & Capability (CAI_TC): ${scores.CAI_TC}/100
- AI Governance & Ethics (CAI_GE): ${scores.CAI_GE}/100

Write exactly five paragraphs:

Paragraph 1 — STRATEGIC POSITION: Summarise the organisation's AI readiness tier and what it means for competitive positioning. Be direct.

Paragraph 2 — STRATEGIC GAPS: Identify the two weakest dimensions and explain the commercial consequence of each if left unaddressed.

Paragraph 3 — PROCESS OPPORTUNITY MAP: Based on the process integration score, identify 2-3 specific business processes where AI could deliver immediate value given the current infrastructure maturity.

Paragraph 4 — TALENT & GOVERNANCE: Assess the balance between talent capability and governance readiness. Flag any dangerous imbalances (e.g., high adoption with low governance).

Paragraph 5 — 90-DAY ACTION PLAN: Provide three specific, time-bound actions the organisation should take in the next 90 days.`;

  return generateText({ system, user, temperature: 0.3, maxTokens: 2000 });
}

// ─── EXECUTIVE SUMMARY ────────────────────────────────────────────────────

export async function generateExecutiveSummary(
  dmi: number,
  pas: number,
  cari: number,
  oars: number,
  companyContext: string
): Promise<string> {
  const system = `You are a Senior Partner at a globally respected AI advisory firm.
You are writing the executive summary of a formal AI Readiness Assessment report
that will be presented to a corporate leadership team.
The quality of this summary must be equivalent to a Gartner Magic Quadrant
research note or a McKinsey CEO briefing.
It must be authoritative, sharp, evidence-grounded, and free of cliche.
Do not use phrases like "it is evident", "it is clear", "in today's world",
"in conclusion", or any form of AI-generated filler.
Every sentence must earn its place.`;

  const user = `Produce the Executive Summary for the AI Readiness Assessment Report.

ORGANISATION CONTEXT:
${companyContext}

FULL SCORECARD:
- Data Maturity Index: ${dmi}/100 — ${dmiTierLabel(dmi)}
- Personal AI Score: ${pas}/100 — ${pasTierLabel(pas)}
- Company AI Readiness Index: ${cari}/100 — ${cariTierLabel(cari)}
- Overall AI Readiness Score: ${oars}/100 — ${oarsTierLabel(oars)}

Write an executive summary of exactly four paragraphs:

Paragraph 1 — HEADLINE FINDING: Deliver the single most important finding from this
assessment — the one insight a CEO or board member most needs to hear.
Ground it in the data. Be direct.

Paragraph 2 — STRENGTHS: Identify the two or three areas where the organisation
demonstrates genuine AI readiness capability, and explain precisely what they enable.

Paragraph 3 — CRITICAL GAPS: Identify the two or three most significant gaps that
constrain AI realisation, and explain the commercial consequence of each if left unaddressed.

Paragraph 4 — STRATEGIC IMPLICATION FOR AI PROGRAMME DESIGN: Translate the full
assessment picture into a clear directive for the AI training and capability-building
programme that Bab Al Ilm AI will design for this organisation.
Specify the starting point, the primary audience, the key capability themes,
and the non-negotiable prerequisites for success.`;

  return generateText({ system, user, temperature: 0.4, maxTokens: 1500 });
}

// ─── RECOMMENDATIONS ──────────────────────────────────────────────────────

export async function generateRecommendations(
  dmi: number,
  pas: number,
  cari: number,
  oars: number,
  companyContext: string
): Promise<string[]> {
  const system = `You are a Managing Director of AI Transformation at a top-tier consulting firm.
You produce specific, commercially grounded, evidence-based recommendations.
You do not produce generic advice. Every recommendation you write must be
actionable by a mid-market organisation within their existing constraints.
You name tools, methodologies, and timelines.
You are direct and efficient. You do not pad your writing.`;

  const scoreSummary = [
    `Data Maturity Index: ${dmi}/100 — ${dmiTierLabel(dmi)}`,
    `Personal AI Score: ${pas}/100 — ${pasTierLabel(pas)}`,
    `Company AI Readiness Index: ${cari}/100 — ${cariTierLabel(cari)}`,
    `Overall AI Readiness Score: ${oars}/100 — ${oarsTierLabel(oars)}`,
  ].join("\n");

  const user = `Based on the complete AI Readiness Assessment, produce exactly five strategic recommendations.
Rank them by priority.

ORGANISATION CONTEXT:
${companyContext}

FULL ASSESSMENT SCORECARD:
${scoreSummary}

For each recommendation, provide:
- PRIORITY TIER: [Immediate (0-30 days) / Short-Term (30-90 days) / Strategic (90+ days)]
- TITLE: A sharp, action-oriented title (max 10 words)
- RATIONALE: 2 sentences grounding the recommendation in specific assessment evidence
- RECOMMENDED ACTION: 3-5 specific, concrete steps to implement
- EFFORT ESTIMATE: [Low / Medium / High]
- IMPACT ESTIMATE: [Incremental / Significant / Transformational]

Format as a numbered list (1. through 5.). Use the field labels above as sub-headers within each item.`;

  const raw = await generateText({ system, user, temperature: 0.5, maxTokens: 2000 });

  // Split into individual recommendations
  const recommendations = raw
    .split(/(?=\d+\.\s)/)
    .map((s) => s.trim())
    .filter((s) => /^\d+\./.test(s));

  return recommendations.length > 0 ? recommendations : [raw];
}
