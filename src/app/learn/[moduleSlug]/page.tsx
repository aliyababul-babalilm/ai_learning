"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import type { LessonData } from "@/lib/lessons-data";

interface ProgressEntry {
  lessonId: string;
  status: string;
  lesson: { slug: string; module: { slug: string } };
}

export default function ModuleLessonsPage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = use(params);
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch(`/api/lessons?module=${moduleSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setLessons(data.lessons);
        const mod = data.modules.find(
          (m: { slug: string }) => m.slug === moduleSlug
        );
        if (mod) {
          setModuleTitle(mod.title);
          setModuleDescription(mod.description || "");
        }
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
  }, [moduleSlug]);

  function getLessonStatus(lessonSlug: string) {
    const entry = progress.find((p) => p.lesson?.slug === lessonSlug);
    return entry?.status || "not_started";
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
          <Link
            href="/learn"
            className="text-sm text-muted hover:text-foreground transition-colors font-medium"
          >
            All Modules
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <Link
          href="/learn"
          className="text-sm text-accent hover:text-accent-strong transition-colors mb-6 inline-flex items-center gap-1 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Modules
        </Link>

        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {moduleTitle}
          </h1>
          <p className="text-muted leading-relaxed">
            {moduleDescription || `${lessons.length} lessons. Complete each lesson by practicing the technique and receiving AI feedback.`}
          </p>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const status = getLessonStatus(lesson.slug);
            return (
              <Link
                key={lesson.slug}
                href={`/learn/${moduleSlug}/${lesson.slug}`}
                className="glass-card rounded-xl p-5 flex items-center gap-4 group block"
              >
                {/* Status icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === "completed"
                      ? "bg-success/10 text-success"
                      : status === "in_progress"
                      ? "bg-accent/10 text-accent"
                      : "bg-border/40 text-muted"
                  }`}
                >
                  {status === "completed" ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-accent-strong transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-muted truncate">
                    {lesson.description}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-medium ${
                    status === "completed"
                      ? "bg-success/10 text-success"
                      : status === "in_progress"
                      ? "bg-accent/10 text-accent"
                      : "bg-border/40 text-muted"
                  }`}
                >
                  {status === "completed"
                    ? "Completed"
                    : status === "in_progress"
                    ? "In Progress"
                    : "Not Started"}
                </span>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-muted group-hover:text-accent transition-colors flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
