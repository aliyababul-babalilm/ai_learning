"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ModuleInfo {
  slug: string;
  title: string;
  description: string;
  order: number;
  lessonCount: number;
}

interface ProgressEntry {
  lessonId: string;
  status: string;
  lesson: { module: { slug: string } };
}

const moduleIcons: Record<string, React.ReactNode> = {
  "prompt-engineering": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  "claude-skills": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  "claude-projects": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
};

export default function LearnPage() {
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    if (storedName) setUserName(storedName);

    fetch("/api/lessons")
      .then((r) => r.json())
      .then((data) => {
        setModules(data.modules);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (userId) {
      fetch(`/api/lessons/progress?userId=${userId}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setProgress(data);
        })
        .catch(() => {});
    }
  }, []);

  function getModuleProgress(moduleSlug: string) {
    const moduleProgress = progress.filter(
      (p) => p.lesson?.module?.slug === moduleSlug
    );
    const completed = moduleProgress.filter(
      (p) => p.status === "completed"
    ).length;
    return completed;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

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
            {userName && (
              <span className="text-sm text-muted">
                Welcome, {userName}
              </span>
            )}
            <Link
              href="/admin"
              className="text-xs text-muted hover:text-foreground transition-colors font-medium"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Your Learning Path
          </h1>
          <p className="text-muted">
            Complete all three modules to master AI tools for your work.
          </p>
        </div>

        <div className="space-y-6">
          {modules.map((mod, index) => {
            const completed = getModuleProgress(mod.slug);
            const progressPercent =
              mod.lessonCount > 0
                ? Math.round((completed / mod.lessonCount) * 100)
                : 0;

            return (
              <Link
                key={mod.slug}
                href={`/learn/${mod.slug}`}
                className="glass-card rounded-xl p-6 group block"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      {moduleIcons[mod.slug] || (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                            Module {index + 1}
                          </span>
                          <span className="text-xs text-muted">
                            {mod.lessonCount} lessons
                          </span>
                        </div>
                        <h2 className="font-display text-xl font-bold text-foreground group-hover:text-accent-strong transition-colors">
                          {mod.title}
                        </h2>
                      </div>
                      <svg
                        className="w-5 h-5 text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    <p className="text-sm text-muted mb-4 leading-relaxed">
                      {mod.description}
                    </p>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs text-muted mb-1.5">
                        <span>
                          {completed} of {mod.lessonCount} completed
                        </span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-border/50 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-accent-strong to-accent rounded-full h-1.5 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
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
