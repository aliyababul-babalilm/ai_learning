"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getLesson } from "@/lib/lessons-data";
import type { LessonStep } from "@/lib/lessons-data";

interface EvaluationResult {
  score: number;
  feedback: string;
  improvedPrompt: string;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = use(params);

  const lesson = getLesson(moduleSlug, lessonSlug);

  const [currentStep, setCurrentStep] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState("");

  // Reset state when lesson changes
  useEffect(() => {
    setCurrentStep(0);
    setUserPrompt("");
    setEvaluation(null);
    setEvaluationError("");
  }, [moduleSlug, lessonSlug]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Lesson Not Found
          </h1>
          <Link href={`/learn/${moduleSlug}`} className="text-primary hover:underline">
            Back to module
          </Link>
        </div>
      </div>
    );
  }

  const steps = lesson.steps;
  const step = steps[currentStep];
  const totalSteps = steps.length;

  async function handleSubmitPrompt() {
    if (!userPrompt.trim()) return;

    setEvaluating(true);
    setEvaluationError("");

    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch("/api/lessons/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt,
          technique: lesson!.title,
          lessonTitle: lesson!.title,
          lessonSlug: lesson!.slug,
          userId,
        }),
      });

      if (!res.ok) throw new Error("Evaluation failed");

      const result = await res.json();
      setEvaluation(result);
      // Auto-advance to feedback step
      setCurrentStep(currentStep + 1);
    } catch {
      setEvaluationError("Failed to evaluate your prompt. Please try again.");
    } finally {
      setEvaluating(false);
    }
  }

  function goToStep(index: number) {
    // Allow going to practice step and before freely
    // Allow feedback/improved only if evaluation exists
    if (index <= 2) {
      setCurrentStep(index);
    } else if (evaluation) {
      setCurrentStep(index);
    }
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  const stepIcons: Record<LessonStep["type"], string> = {
    explain: "Learn",
    example: "Example",
    practice: "Practice",
    feedback: "Feedback",
    improved: "Improved",
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            AI Learning Platform
          </Link>
          <Link
            href={`/learn/${moduleSlug}`}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            &larr; Back to {lesson.moduleTitle}
          </Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-border">
        <div
          className="h-1 bg-accent transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-white p-4 hidden md:block">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            {lesson.title}
          </h3>
          <nav className="space-y-1">
            {steps.map((s, i) => {
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;
              const isLocked = i > 2 && !evaluation;

              return (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  disabled={isLocked}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/5 text-primary font-medium"
                      : isCompleted
                      ? "text-success"
                      : isLocked
                      ? "text-text-secondary/40 cursor-not-allowed"
                      : "text-text-secondary hover:bg-border/30"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                      isActive
                        ? "bg-primary text-white"
                        : isCompleted
                        ? "bg-success/10 text-success"
                        : "bg-border/60 text-text-secondary"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span>{stepIcons[s.type]}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 max-w-3xl">
          <div className="mb-6">
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Step {currentStep + 1} of {totalSteps} &middot;{" "}
              {stepIcons[step.type]}
            </span>
            <h1 className="text-2xl font-bold text-primary mt-1">
              {step.title}
            </h1>
          </div>

          {/* Step content */}
          {step.type === "explain" && (
            <div className="prose prose-lg max-w-none">
              {step.content?.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-text leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {step.type === "example" && (
            <div className="space-y-6">
              {/* Before */}
              <div>
                <h3 className="text-sm font-semibold text-error uppercase tracking-wider mb-2">
                  Before (Weak Prompt)
                </h3>
                <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-text font-mono">
                    {step.before}
                  </pre>
                </div>
              </div>

              {/* After */}
              <div>
                <h3 className="text-sm font-semibold text-success uppercase tracking-wider mb-2">
                  After (Strong Prompt)
                </h3>
                <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-text font-mono">
                    {step.after}
                  </pre>
                </div>
              </div>

              {/* Explanation */}
              {step.explanation && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-primary mb-2">
                    Why This Works
                  </h3>
                  <p className="text-sm text-text leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {step.type === "practice" && (
            <div className="space-y-4">
              {step.instruction && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                    {step.instruction}
                  </p>
                </div>
              )}

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 h-48 resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono text-sm"
                placeholder={step.placeholder || "Write your prompt here..."}
              />

              {evaluationError && (
                <p className="text-sm text-error">{evaluationError}</p>
              )}

              <button
                onClick={handleSubmitPrompt}
                disabled={evaluating || !userPrompt.trim()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {evaluating ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Evaluating with AI...
                  </span>
                ) : (
                  "Submit for AI Feedback"
                )}
              </button>
            </div>
          )}

          {step.type === "feedback" && (
            <div className="space-y-6">
              {evaluation ? (
                <>
                  {/* Score */}
                  <div className="card p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-4xl font-bold ${
                          evaluation.score >= 70
                            ? "text-success"
                            : evaluation.score >= 40
                            ? "text-accent"
                            : "text-error"
                        }`}
                      >
                        {evaluation.score}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-secondary">
                          Score out of 100
                        </div>
                        <div className="text-sm text-text-secondary">
                          {evaluation.score >= 70
                            ? "Great work!"
                            : evaluation.score >= 40
                            ? "Good start, room to improve."
                            : "Keep practicing!"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Your prompt */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Your Prompt
                    </h3>
                    <div className="bg-border/30 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-text font-mono">
                        {userPrompt}
                      </pre>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                      AI Feedback
                    </h3>
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                      <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                        {evaluation.feedback}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-text-secondary">
                    Complete the practice step first to receive feedback.
                  </p>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-primary mt-4"
                  >
                    Go to Practice
                  </button>
                </div>
              )}
            </div>
          )}

          {step.type === "improved" && (
            <div className="space-y-6">
              {evaluation ? (
                <>
                  <p className="text-text-secondary">
                    Here is an improved version of your prompt that better
                    demonstrates the <strong>{lesson.title}</strong> technique:
                  </p>

                  <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-success uppercase tracking-wider mb-3">
                      Improved Prompt
                    </h3>
                    <pre className="whitespace-pre-wrap text-sm text-text font-mono leading-relaxed">
                      {evaluation.improvedPrompt}
                    </pre>
                  </div>

                  <div className="card p-6 bg-accent/5 border-accent/20">
                    <h3 className="text-sm font-semibold text-accent-dark mb-2">
                      What Changed?
                    </h3>
                    <p className="text-sm text-text leading-relaxed">
                      Compare the improved prompt above with your original
                      attempt. Notice how the {lesson.title.toLowerCase()}{" "}
                      technique is applied more effectively. Try incorporating
                      these improvements in your next prompt.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={`/learn/${moduleSlug}`}
                      className="btn-primary"
                    >
                      Back to Lessons
                    </Link>
                    <button
                      onClick={() => {
                        setCurrentStep(2);
                        setUserPrompt("");
                        setEvaluation(null);
                      }}
                      className="px-5 py-2.5 border border-border rounded-lg text-text-secondary hover:bg-border/20 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-text-secondary">
                    Complete the practice step first to see an improved version.
                  </p>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-primary mt-4"
                  >
                    Go to Practice
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex justify-between border-t border-border pt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-5 py-2.5 rounded-lg transition-colors ${
                currentStep === 0
                  ? "text-text-secondary/40 cursor-not-allowed"
                  : "text-text-secondary hover:bg-border/30"
              }`}
            >
              &larr; Back
            </button>

            {step.type !== "practice" &&
              step.type !== "improved" &&
              currentStep < totalSteps - 1 && (
                <button
                  onClick={handleNext}
                  disabled={step.type === "feedback" && !evaluation}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next &rarr;
                </button>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
