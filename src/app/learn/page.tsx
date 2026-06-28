"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ModuleInfo {
  slug: string;
  title: string;
  type: string;
  lessonCount: number;
}

interface ProgressEntry {
  lessonId: string;
  status: string;
  lesson: { module: { slug: string } };
}

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

  const moduleDescriptions: Record<string, string> = {
    "prompt-engineering":
      "Master six essential prompt engineering techniques with hands-on practice and AI feedback.",
    "claude-setup":
      "Configure Claude Desktop as your personal AI workspace for maximum productivity.",
  };

  const moduleIcons: Record<string, string> = {
    "prompt-engineering": "interactive",
    "claude-setup": "setup",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            AI Learning Platform
          </Link>
          {userName && (
            <span className="text-sm text-white/70">
              Welcome, {userName}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-primary mb-2">Your Learning Path</h1>
        <p className="text-text-secondary mb-10">
          Complete both modules to master AI tools for your work.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((mod) => {
            const completed = getModuleProgress(mod.slug);
            const progressPercent =
              mod.lessonCount > 0
                ? Math.round((completed / mod.lessonCount) * 100)
                : 0;

            return (
              <Link
                key={mod.slug}
                href={`/learn/${mod.slug}`}
                className="card p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      moduleIcons[mod.slug] === "interactive"
                        ? "bg-accent/10"
                        : "bg-primary/10"
                    }`}
                  >
                    {moduleIcons[mod.slug] === "interactive" ? (
                      <svg
                        className="w-5 h-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs bg-border/60 text-text-secondary px-2 py-1 rounded-full">
                    {mod.lessonCount} lessons
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-primary mb-2 group-hover:text-primary-light transition-colors">
                  {mod.title}
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                  {moduleDescriptions[mod.slug] || ""}
                </p>

                {/* Progress bar */}
                <div className="mt-auto">
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>
                      {completed} of {mod.lessonCount} completed
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-accent rounded-full h-2 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
