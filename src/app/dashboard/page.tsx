"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardData {
  user: {
    id: string;
    name: string | null;
    email: string;
    department: string | null;
  };
  company: {
    id: string;
    name: string;
    modules: string[];
  } | null;
  moduleProgress: {
    learning: {
      completedLessons: number;
      totalLessonsAttempted: number;
    };
    assessment: {
      completedSections: number;
      totalSections: number;
    };
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }

    fetch(`/api/user/dashboard?userId=${userId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        router.push("/");
      });
  }, [router]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const modules = data.company?.modules || ["learning"];
  const hasLearning = modules.includes("learning");
  const hasAssessment = modules.includes("assessment");

  const learningPercent =
    data.moduleProgress.learning.totalLessonsAttempted > 0
      ? Math.round(
          (data.moduleProgress.learning.completedLessons /
            data.moduleProgress.learning.totalLessonsAttempted) *
            100
        )
      : 0;

  const assessmentPercent = Math.round(
    (data.moduleProgress.assessment.completedSections /
      data.moduleProgress.assessment.totalSections) *
      100
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-5 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-display">B</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Bab Al Ilm
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {data.user.name && (
              <span className="text-sm text-muted">
                Welcome, {data.user.name}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        {/* Company name */}
        {data.company && (
          <div className="mb-2">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              {data.company.name}
            </span>
          </div>
        )}

        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Your Dashboard
          </h1>
          <p className="text-muted">
            Select a module below to continue your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Learning Tile */}
          {hasLearning && (
            <Link
              href="/learn"
              className="glass-card rounded-xl p-6 group block"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl font-bold text-foreground group-hover:text-accent-strong transition-colors mb-1">
                    AI Learning
                  </h2>
                  <p className="text-sm text-muted mb-4 leading-relaxed">
                    Interactive, personalized training on prompt engineering,
                    Claude Skills, and Claude Projects.
                  </p>
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1.5">
                      <span>
                        {data.moduleProgress.learning.completedLessons} lessons
                        completed
                      </span>
                      <span>{learningPercent}%</span>
                    </div>
                    <div className="w-full bg-border/50 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-accent-strong to-accent rounded-full h-1.5 transition-all"
                        style={{ width: `${learningPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          )}

          {/* AI Assessment Tile */}
          {hasAssessment && (
            <Link
              href="/assessment"
              className="glass-card rounded-xl p-6 group block"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl font-bold text-foreground group-hover:text-accent-strong transition-colors mb-1">
                    AI Assessment
                  </h2>
                  <p className="text-sm text-muted mb-4 leading-relaxed">
                    Evaluate your AI readiness across data maturity, personal AI
                    usage, and company AI strategy.
                  </p>
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1.5">
                      <span>
                        {data.moduleProgress.assessment.completedSections} of{" "}
                        {data.moduleProgress.assessment.totalSections} sections
                      </span>
                      <span>{assessmentPercent}%</span>
                    </div>
                    <div className="w-full bg-border/50 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-accent-strong to-accent rounded-full h-1.5 transition-all"
                        style={{ width: `${assessmentPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          )}
        </div>

        {/* If only one module, show a full-width message */}
        {!hasLearning && !hasAssessment && (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-muted">
              No modules have been provisioned for your company yet. Please
              contact your administrator.
            </p>
          </div>
        )}
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
