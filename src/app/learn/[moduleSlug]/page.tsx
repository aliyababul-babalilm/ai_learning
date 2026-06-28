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

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch(`/api/lessons?module=${moduleSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setLessons(data.lessons);
        const mod = data.modules.find(
          (m: { slug: string }) => m.slug === moduleSlug
        );
        if (mod) setModuleTitle(mod.title);
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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="bg-primary text-white py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            AI Learning Platform
          </Link>
          <Link
            href="/learn"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            All Modules
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <Link
          href="/learn"
          className="text-sm text-primary hover:underline mb-4 inline-block"
        >
          &larr; Back to Modules
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-2">{moduleTitle}</h1>
        <p className="text-text-secondary mb-10">
          {lessons.length} lessons. Complete each lesson by practicing the
          technique and receiving AI feedback.
        </p>

        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            const status = getLessonStatus(lesson.slug);
            return (
              <Link
                key={lesson.slug}
                href={`/learn/${moduleSlug}/${lesson.slug}`}
                className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group block"
              >
                {/* Status icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === "completed"
                      ? "bg-success/10 text-success"
                      : status === "in_progress"
                      ? "bg-accent/10 text-accent"
                      : "bg-border/60 text-text-secondary"
                  }`}
                >
                  {status === "completed" ? (
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
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary group-hover:text-primary-light transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-text-secondary truncate">
                    {lesson.description}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
                    status === "completed"
                      ? "bg-success/10 text-success"
                      : status === "in_progress"
                      ? "bg-accent/10 text-accent"
                      : "bg-border/60 text-text-secondary"
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
                  className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors flex-shrink-0"
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
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
