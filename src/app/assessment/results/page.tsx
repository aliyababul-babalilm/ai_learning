"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── DIMENSION LABELS ──────────────────────────────────────────────────────

const DIMENSION_LABELS: Record<string, { short: string; full: string }> = {
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

// ─── TIER COLORS ───────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  Foundational: "#dc2626",
  Novice: "#dc2626",
  Emerging: "#d97706",
  Developing: "#d97706",
  Structured: "#0ea5e9",
  Practitioner: "#0ea5e9",
  Proficient: "#16a34a",
  Advanced: "#16a34a",
  Leading: "#7c3aed",
};

function getTierColor(tier: string): string {
  return TIER_COLORS[tier] || "#0ea5e9";
}

// ─── RADAR CHART ───────────────────────────────────────────────────────────

function RadarChart({
  dimensions,
  size = 300,
}: {
  dimensions: { label: string; score: number; fullLabel: string }[];
  size?: number;
}) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const n = dimensions.length;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const rings = [25, 50, 75, 100];

  const dataPoints = dimensions.map((d, i) => getPoint(i, d.score));
  const dataPath =
    dataPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ") + " Z";

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{ maxWidth: size, width: "100%" }}
    >
      {/* Grid rings */}
      {rings.map((ring) => {
        const points = Array.from({ length: n }, (_, i) =>
          getPoint(i, ring)
        );
        const path =
          points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ") + " Z";
        return (
          <path
            key={ring}
            d={path}
            fill="none"
            stroke="#d7e0eb"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const end = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="#d7e0eb"
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon */}
      <path
        d={dataPath}
        fill="rgba(14, 165, 233, 0.2)"
        stroke="#0ea5e9"
        strokeWidth={2}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#0ea5e9" />
      ))}

      {/* Labels */}
      {dimensions.map((d, i) => {
        const labelPoint = getPoint(i, 120);
        return (
          <text
            key={i}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fontWeight={600}
            fill="#0f172a"
          >
            {d.label}
            <tspan
              x={labelPoint.x}
              dy={14}
              fontSize={10}
              fontWeight={400}
              fill="#5a6780"
            >
              {d.score}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}

// ─── SCORE CARD ────────────────────────────────────────────────────────────

function ScoreCard({
  label,
  score,
  tier,
}: {
  label: string;
  score: number;
  tier: string;
}) {
  const color = getTierColor(tier);
  return (
    <div className="glass-card rounded-xl p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
        {label}
      </p>
      <p className="text-4xl font-display font-bold text-foreground">{score}</p>
      <span
        className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full"
        style={{
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        {tier}
      </span>
    </div>
  );
}

// ─── DIMENSION TABLE ───────────────────────────────────────────────────────

function DimensionTable({
  dimensions,
}: {
  dimensions: Record<string, number>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 font-semibold text-muted text-xs uppercase tracking-wider">
              Dimension
            </th>
            <th className="text-right py-2 px-3 font-semibold text-muted text-xs uppercase tracking-wider">
              Score
            </th>
            <th className="text-left py-2 px-3 font-semibold text-muted text-xs uppercase tracking-wider">
              Benchmark
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dimensions).map(([key, score]) => {
            const label = DIMENSION_LABELS[key];
            if (!label) return null;
            const benchmarkTier = getBenchmarkTier(score);
            const color = getTierColor(benchmarkTier);
            return (
              <tr key={key} className="border-b border-border/30">
                <td className="py-2.5 px-3">
                  <span className="font-semibold text-foreground text-xs">
                    {label.short}
                  </span>
                  <span className="text-muted ml-2 text-xs">
                    {label.full}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-display font-bold text-foreground">
                  {score}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    {benchmarkTier}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getBenchmarkTier(score: number): string {
  if (score <= 39) return "Foundational";
  if (score <= 59) return "Emerging";
  if (score <= 74) return "Structured";
  if (score <= 89) return "Advanced";
  return "Leading";
}

// ─── NARRATIVE SECTION ─────────────────────────────────────────────────────

function NarrativeSection({
  content,
}: {
  content: string | null;
}) {
  if (!content) {
    return (
      <div className="py-4 text-sm text-muted italic">
        Narrative analysis is being generated. Refresh the page in a moment.
      </div>
    );
  }

  return (
    <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed">
      {content.split("\n\n").map((paragraph, i) => {
        // Check if paragraph starts with a heading marker
        if (paragraph.startsWith("###")) {
          return (
            <h4
              key={i}
              className="font-display font-bold text-foreground mt-4 mb-2 text-sm"
            >
              {paragraph.replace(/^###\s*/, "")}
            </h4>
          );
        }
        if (paragraph.startsWith("##")) {
          return (
            <h3
              key={i}
              className="font-display font-bold text-foreground mt-5 mb-2 text-base"
            >
              {paragraph.replace(/^##\s*/, "")}
            </h3>
          );
        }
        // Handle numbered items
        if (/^\d+\./.test(paragraph.trim())) {
          return (
            <div key={i} className="mb-3">
              {paragraph.split("\n").map((line, j) => (
                <p key={j} className="mb-1 text-sm leading-relaxed">
                  {renderBoldText(line)}
                </p>
              ))}
            </div>
          );
        }
        return (
          <p key={i} className="mb-3 text-sm leading-relaxed">
            {renderBoldText(paragraph)}
          </p>
        );
      })}
    </div>
  );
}

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── RECOMMENDATION CARD ──────────────────────────────────────────────────

function RecommendationCard({
  text,
  index,
}: {
  text: string;
  index: number;
}) {
  // Parse out fields from the recommendation text
  const lines = text.split("\n").filter(Boolean);
  const title =
    lines[0]?.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "").trim() || "";

  // Extract field values
  const getField = (label: string): string => {
    const line = lines.find((l) =>
      l.toUpperCase().includes(label.toUpperCase())
    );
    if (!line) return "";
    return line.replace(new RegExp(`.*${label}[:\\s]*`, "i"), "").replace(/\*\*/g, "").trim();
  };

  const priority = getField("PRIORITY TIER");
  const rationale = getField("RATIONALE");
  const effort = getField("EFFORT ESTIMATE");
  const impact = getField("IMPACT ESTIMATE");

  // Extract action items
  const actionLines = lines.filter(
    (l) =>
      /^\s*[-*]\s/.test(l) ||
      /^\s*\d+\)\s/.test(l) ||
      (l.includes("RECOMMENDED ACTION") && false)
  );

  const priorityColor =
    priority.toLowerCase().includes("immediate")
      ? "#dc2626"
      : priority.toLowerCase().includes("short")
      ? "#d97706"
      : "#0ea5e9";

  const effortColor =
    effort.toLowerCase().includes("low")
      ? "#16a34a"
      : effort.toLowerCase().includes("high")
      ? "#dc2626"
      : "#d97706";

  const impactColor =
    impact.toLowerCase().includes("transformational")
      ? "#7c3aed"
      : impact.toLowerCase().includes("significant")
      ? "#16a34a"
      : "#0ea5e9";

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <span className="text-sm font-display font-bold text-accent">
            {index + 1}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-foreground text-sm mb-2">
            {title || `Recommendation ${index + 1}`}
          </h4>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {priority && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${priorityColor}15`,
                  color: priorityColor,
                }}
              >
                {priority}
              </span>
            )}
            {effort && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${effortColor}15`,
                  color: effortColor,
                }}
              >
                Effort: {effort}
              </span>
            )}
            {impact && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${impactColor}15`,
                  color: impactColor,
                }}
              >
                Impact: {impact}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="text-sm text-muted leading-relaxed">
            {rationale && <p className="mb-2">{rationale}</p>}
            {actionLines.length > 0 && (
              <ul className="list-disc list-inside space-y-1">
                {actionLines.map((line, i) => (
                  <li key={i} className="text-xs">
                    {line.replace(/^\s*[-*]\s/, "").replace(/^\s*\d+\)\s/, "")}
                  </li>
                ))}
              </ul>
            )}
            {!rationale && actionLines.length === 0 && (
              <NarrativeSection content={text.replace(/^\d+\.\s*/, "")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TYPES ─────────────────────────────────────────────────────────────────

interface ResultsData {
  completedAt: string;
  companyName: string;
  assignedSections?: string[];
  scores: {
    dmi: {
      score: number;
      tier: string;
      dimensions: Record<string, number>;
    } | null;
    pas: {
      score: number;
      tier: string;
      dimensions: Record<string, number>;
    };
    cari: {
      score: number;
      tier: string;
      dimensions: Record<string, number>;
    } | null;
    oars: {
      score: number;
      tier: string;
    };
  };
  narratives: {
    dmi: string | null;
    pas: string | null;
    cari: string | null;
    executiveSummary: string | null;
    recommendations: string[];
  };
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }

    fetch(`/api/assessment/results?userId=${userId}`)
      .then((r) => {
        if (!r.ok) {
          return r.json().then((body) => {
            throw new Error(body.message || "Failed to load results");
          });
        }
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <ResultsHeader />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="glass-strong rounded-xl p-10 text-center">
            <div className="relative mb-5 h-14 w-14 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-border/50" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-accent border-r-accent/50" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Preparing Your Results
            </h2>
            <p className="text-sm text-muted leading-relaxed max-w-md mx-auto">
              We are calculating your scores and generating personalised
              narratives. This may take a moment.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                Computing scores
              </span>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                Generating narratives
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <ResultsHeader />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.27 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="font-display text-lg font-bold text-foreground mb-2">
              Results Not Available
            </h2>
            <p className="text-sm text-muted mb-4">{error}</p>
            <Link
              href="/assessment"
              className="btn-primary text-sm px-6 py-2.5 rounded-lg inline-block"
            >
              Return to Assessment
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!data) return null;

  const { scores, narratives, completedAt, companyName } = data;
  const completedDate = new Date(completedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hasDmi = !!scores.dmi;
  const hasCari = !!scores.cari;

  // Build dimension arrays for radar charts
  const dmiDimensions = hasDmi
    ? Object.entries(scores.dmi!.dimensions).map(([key, score]) => ({
        label: DIMENSION_LABELS[key]?.short || key,
        score,
        fullLabel: DIMENSION_LABELS[key]?.full || key,
      }))
    : [];

  const pasDimensions = Object.entries(scores.pas.dimensions).map(
    ([key, score]) => ({
      label: DIMENSION_LABELS[key]?.short || key,
      score,
      fullLabel: DIMENSION_LABELS[key]?.full || key,
    })
  );

  const cariDimensions = hasCari
    ? Object.entries(scores.cari!.dimensions)
        .filter(([key]) => key !== "visibilityWeight")
        .map(([key, score]) => ({
          label: DIMENSION_LABELS[key]?.short || key,
          score: score as number,
          fullLabel: DIMENSION_LABELS[key]?.full || key,
        }))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <ResultsHeader />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        {/* ─── HEADER ─────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                Your AI Readiness Assessment
              </h1>
              <p className="text-sm text-muted">
                {companyName} &middot; Completed {completedDate}
              </p>
            </div>
            <div className="flex items-end gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">
                  Overall Score
                </p>
                <p className="text-5xl font-display font-bold text-foreground leading-none">
                  {scores.oars.score}
                </p>
              </div>
              <span
                className="text-sm font-semibold px-3 py-1.5 rounded-full mb-1"
                style={{
                  backgroundColor: `${getTierColor(scores.oars.tier)}15`,
                  color: getTierColor(scores.oars.tier),
                }}
              >
                {scores.oars.tier}
              </span>
            </div>
          </div>
        </div>

        {/* ─── SECTION A: SCORE OVERVIEW ──────────────────────── */}
        <section className="mb-10">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">
            Score Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hasDmi && (
              <ScoreCard
                label="Data Maturity (DMI)"
                score={scores.dmi!.score}
                tier={scores.dmi!.tier}
              />
            )}
            <ScoreCard
              label="Personal AI (PAS)"
              score={scores.pas.score}
              tier={scores.pas.tier}
            />
            {hasCari && (
              <ScoreCard
                label="Company AI (CARI)"
                score={scores.cari!.score}
                tier={scores.cari!.tier}
              />
            )}
            <ScoreCard
              label="Overall (OARS)"
              score={scores.oars.score}
              tier={scores.oars.tier}
            />
          </div>
        </section>

        {/* ─── SECTION B: DATA MATURITY ───────────────────────── */}
        {hasDmi && (
        <section className="mb-10">
          <div className="glass-strong rounded-xl p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Data Maturity Index (DMI)
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex justify-center items-start">
                <RadarChart dimensions={dmiDimensions} />
              </div>
              <div>
                <DimensionTable dimensions={scores.dmi!.dimensions} />
              </div>
            </div>
            {narratives.dmi && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="font-display text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  Analysis
                </h3>
                <NarrativeSection content={narratives.dmi} />
              </div>
            )}
          </div>
        </section>
        )}

        {/* ─── SECTION C: PERSONAL AI SKILLS ──────────────────── */}
        <section className="mb-10">
          <div className="glass-strong rounded-xl p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Personal AI Skills (PAS)
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex justify-center items-start">
                <RadarChart dimensions={pasDimensions} />
              </div>
              <div>
                <DimensionTable dimensions={scores.pas.dimensions} />
              </div>
            </div>
            {narratives.pas && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="font-display text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  Analysis
                </h3>
                <NarrativeSection content={narratives.pas} />
              </div>
            )}
          </div>
        </section>

        {/* ─── SECTION D: COMPANY AI READINESS ────────────────── */}
        {hasCari && (
        <section className="mb-10">
          <div className="glass-strong rounded-xl p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Company AI Readiness (CARI)
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex justify-center items-start">
                <RadarChart dimensions={cariDimensions} />
              </div>
              <div>
                <DimensionTable
                  dimensions={Object.fromEntries(
                    Object.entries(scores.cari!.dimensions).filter(
                      ([k]) => k !== "visibilityWeight"
                    )
                  )}
                />
              </div>
            </div>
            {narratives.cari && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="font-display text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  Analysis
                </h3>
                <NarrativeSection content={narratives.cari} />
              </div>
            )}
          </div>
        </section>
        )}

        {/* ─── SECTION E: KEY FINDINGS & RECOMMENDATIONS ──────── */}
        <section className="mb-10">
          <div className="glass-strong rounded-xl p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Executive Summary
            </h2>
            <NarrativeSection content={narratives.executiveSummary} />
          </div>
        </section>

        {narratives.recommendations && narratives.recommendations.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Strategic Recommendations
            </h2>
            <div className="space-y-4">
              {narratives.recommendations.map((rec, i) => (
                <RecommendationCard key={i} text={rec} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ─── FOOTER ACTIONS ─────────────────────────────────── */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/assessment"
            className="text-sm text-accent hover:text-accent-strong font-medium transition-colors"
          >
            Back to Assessment
          </Link>
          <Link
            href="/dashboard"
            className="btn-primary text-sm px-6 py-2.5 rounded-lg inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs text-muted/60 font-medium">
            Bab Al Ilm — AI Mastery Programme
          </span>
        </div>
      </footer>
    </div>
  );
}

// ─── SHARED HEADER ─────────────────────────────────────────────────────────

function ResultsHeader() {
  return (
    <header className="py-5 border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center">
            <span className="text-white text-xs font-bold font-display">B</span>
          </div>
          <span className="font-display text-sm font-semibold tracking-tight text-foreground">
            Bab Al Ilm
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="text-xs text-accent hover:text-accent-strong font-medium transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </header>
  );
}
