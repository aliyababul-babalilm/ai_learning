"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dbKeyToSectionSlug } from "@/lib/assessment-questions";

interface SectionProgress {
  section: string;
  completed: boolean;
  scores: Record<string, number> | null;
  compositScore: number | null;
  tier: string | null;
}

const SECTION_META: Record<
  string,
  { title: string; description: string; icon: React.ReactNode }
> = {
  registration: {
    title: "Registration",
    description:
      "Basic role and department information to contextualize your assessment.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  data_maturity: {
    title: "Data Maturity",
    description:
      "Evaluate how your team collects, manages, and leverages data.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
  },
  personal_ai: {
    title: "Personal AI Usage",
    description:
      "Assess your individual experience and proficiency with AI tools.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  company_ai: {
    title: "Company AI Strategy",
    description:
      "Evaluate your organization's AI adoption, governance, and strategic readiness.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
};

const ALL_SECTIONS = ["registration", "data_maturity", "personal_ai", "company_ai"];

export default function AssessmentPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<SectionProgress[]>([]);
  const [userSections, setUserSections] = useState<string[]>(["registration"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }

    // Fetch progress and user-specific sections in parallel
    Promise.all([
      fetch(`/api/assessment?userId=${userId}`).then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      }),
      fetch(`/api/assessment/sections?userId=${userId}`).then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      }),
    ])
      .then(([assessmentData, sectionsData]) => {
        setProgress(assessmentData.progress || []);
        setUserSections(sectionsData.sections || ["registration"]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  // Filter sections to only those assigned to this user, preserving canonical order
  const SECTIONS = ALL_SECTIONS.filter((s) => userSections.includes(s));

  const completedCount = progress.filter(
    (p) => p.completed && SECTIONS.includes(p.section)
  ).length;
  const overallPercent =
    SECTIONS.length > 0
      ? Math.round((completedCount / SECTIONS.length) * 100)
      : 0;

  // Find the first incomplete section
  const nextSection = SECTIONS.find((s) => {
    const p = progress.find((pr) => pr.section === s);
    return !p?.completed;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-5 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-display">
                B
              </span>
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

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            AI Readiness Assessment
          </h1>
          <p className="text-muted leading-relaxed">
            This assessment evaluates your AI readiness across four key
            dimensions. Complete each section to receive a personalized
            readiness report with scores and recommendations.
          </p>
        </div>

        {/* Overall Progress */}
        <div className="glass-strong rounded-xl p-5 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-foreground">
              Overall Progress
            </span>
            <span className="text-muted">
              {completedCount} of {SECTIONS.length} sections complete
            </span>
          </div>
          <div className="w-full bg-border/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent-strong to-accent rounded-full h-2 transition-all"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-4">
          {SECTIONS.map((section, index) => {
            const meta = SECTION_META[section];
            const sectionProgress = progress.find(
              (p) => p.section === section
            );
            const isCompleted = sectionProgress?.completed || false;
            const isNext = section === nextSection;
            const sectionSlug = dbKeyToSectionSlug(section);

            return (
              <Link
                key={section}
                href={`/assessment/${sectionSlug}`}
                className={`block glass-card rounded-xl p-5 transition-all hover:shadow-md ${
                  isCompleted
                    ? "border-success/30 bg-success/5"
                    : isNext
                    ? "border-accent/30 bg-accent/5"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isCompleted
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        meta.icon
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                        Section {index + 1}
                      </span>
                      {isCompleted && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                          Complete
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">
                      {meta.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {meta.description}
                    </p>

                    {isCompleted && sectionProgress?.tier && (
                      <div className="mt-2 text-xs text-success font-medium">
                        Tier: {sectionProgress.tier}
                        {sectionProgress.compositScore !== null &&
                          ` — Score: ${sectionProgress.compositScore}`}
                      </div>
                    )}
                  </div>

                  {isNext && (
                    <div className="flex-shrink-0">
                      <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                        Up Next
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          {completedCount === SECTIONS.length ? (
            <div className="glass-strong rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                Assessment Complete
              </h3>
              <p className="text-sm text-muted mb-4">
                You have completed all sections of the AI Readiness Assessment.
              </p>
              <Link
                href="/assessment/results"
                className="btn-primary text-base px-8 py-3 rounded-xl inline-block"
              >
                View Your Results
              </Link>
            </div>
          ) : (
            <Link
              href={`/assessment/${dbKeyToSectionSlug(nextSection || "registration")}`}
              className="btn-primary text-base px-8 py-3 rounded-xl inline-block"
            >
              {completedCount === 0 ? "Start Assessment" : "Continue Assessment"}
            </Link>
          )}
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
