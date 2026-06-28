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

  // Personalized example state
  const [personalizedExample, setPersonalizedExample] = useState<{
    before: string;
    after: string;
    explanation: string;
  } | null>(null);
  const [loadingExample, setLoadingExample] = useState(false);

  // Reset state when lesson changes
  useEffect(() => {
    setCurrentStep(0);
    setUserPrompt("");
    setEvaluation(null);
    setEvaluationError("");
    setPersonalizedExample(null);
  }, [moduleSlug, lessonSlug]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Lesson Not Found
          </h1>
          <Link href={`/learn/${moduleSlug}`} className="text-accent hover:text-accent-strong font-medium">
            Back to module
          </Link>
        </div>
      </div>
    );
  }

  const steps = lesson.steps;
  const step = steps[currentStep];
  const totalSteps = steps.length;

  async function loadPersonalizedExample() {
    setLoadingExample(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch("/api/lessons/generate-example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technique: lesson!.title,
          lessonTitle: lesson!.title,
          userId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPersonalizedExample(data);
      }
    } catch {
      // Fall back to static example
    } finally {
      setLoadingExample(false);
    }
  }

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
      setCurrentStep(currentStep + 1);
    } catch {
      setEvaluationError("Failed to evaluate your prompt. Please try again.");
    } finally {
      setEvaluating(false);
    }
  }

  function goToStep(index: number) {
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

  const stepLabels: Record<LessonStep["type"], string> = {
    explain: "Learn",
    example: "Example",
    practice: "Practice",
    feedback: "Feedback",
    improved: "Improved",
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold font-display">B</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Bab Al Ilm
            </span>
          </Link>
          <Link
            href={`/learn/${moduleSlug}`}
            className="text-sm text-muted hover:text-foreground transition-colors font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {lesson.moduleTitle}
          </Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-border/30">
        <div
          className="h-full bg-gradient-to-r from-accent-strong to-accent transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-60 border-r border-border/50 p-4 hidden md:block">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
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
                      ? "bg-accent/5 text-accent font-medium border border-accent/20"
                      : isCompleted
                      ? "text-success"
                      : isLocked
                      ? "text-muted/30 cursor-not-allowed"
                      : "text-muted hover:bg-border/20"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                      isActive
                        ? "bg-accent text-white"
                        : isCompleted
                        ? "bg-success/10 text-success"
                        : "bg-border/40 text-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span>{stepLabels[s.type]}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 max-w-3xl">
          <div className="mb-6">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Step {currentStep + 1} of {totalSteps} &middot; {stepLabels[step.type]}
            </span>
            <h1 className="font-display text-2xl font-bold text-foreground mt-1">
              {step.title}
            </h1>
          </div>

          {/* Step content */}
          {step.type === "explain" && (
            <div className="space-y-4">
              {step.content?.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {step.type === "example" && (
            <div className="space-y-6">
              {/* Personalize button */}
              {!personalizedExample && (
                <button
                  onClick={loadPersonalizedExample}
                  disabled={loadingExample}
                  className="btn-secondary text-xs gap-2"
                >
                  {loadingExample ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Generating personalized example...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Personalize this example to my role
                    </>
                  )}
                </button>
              )}

              {personalizedExample && (
                <div className="glass rounded-lg px-4 py-2.5 text-xs text-accent font-medium flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Example personalized to your role
                </div>
              )}

              {/* Before */}
              <div>
                <h3 className="text-xs font-semibold text-error uppercase tracking-wider mb-2">
                  Before (Weak Prompt)
                </h3>
                <div className="bg-error/5 border border-error/20 rounded-xl p-4">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                    {personalizedExample?.before || step.before}
                  </pre>
                </div>
              </div>

              {/* After */}
              <div>
                <h3 className="text-xs font-semibold text-success uppercase tracking-wider mb-2">
                  After (Strong Prompt)
                </h3>
                <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                    {personalizedExample?.after || step.after}
                  </pre>
                </div>
              </div>

              {/* Explanation */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  Why This Works
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {personalizedExample?.explanation || step.explanation}
                </p>
              </div>
            </div>
          )}

          {step.type === "practice" && (
            <div className="space-y-4">
              {step.instruction && (
                <div className="glass-card rounded-xl p-5 mb-6">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {step.instruction}
                  </p>
                </div>
              )}

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 h-48 resize-y font-mono text-sm"
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
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
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
                  <div className="glass-strong rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-4xl font-display font-bold ${
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
                        <div className="text-sm font-semibold text-foreground">
                          Score out of 100
                        </div>
                        <div className="text-sm text-muted">
                          {evaluation.score >= 70
                            ? "Excellent work! Strong application of the technique."
                            : evaluation.score >= 40
                            ? "Good foundation. Review the feedback for specific improvements."
                            : "Keep practicing. The improved version below shows how to strengthen your approach."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Your prompt */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      Your Prompt
                    </h3>
                    <div className="bg-border/20 rounded-xl p-4">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                        {userPrompt}
                      </pre>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                      AI Feedback
                    </h3>
                    <div className="glass-card rounded-xl p-5">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {evaluation.feedback}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-strong rounded-xl p-8 text-center">
                  <p className="text-muted">
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
                  <p className="text-muted">
                    Here is an improved version of your prompt that demonstrates the{" "}
                    <strong className="text-foreground">{lesson.title}</strong> technique
                    at a professional level:
                  </p>

                  <div className="bg-success/5 border border-success/20 rounded-xl p-5">
                    <h3 className="text-xs font-semibold text-success uppercase tracking-wider mb-3">
                      Improved Prompt
                    </h3>
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                      {evaluation.improvedPrompt}
                    </pre>
                  </div>

                  <div className="glass-card rounded-xl p-5">
                    <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                      Key Improvements
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      Compare the improved prompt above with your original attempt.
                      Notice how the {lesson.title.toLowerCase()} technique is applied
                      more effectively, with specific references to your work context.
                      Try incorporating these improvements in your next prompt.
                    </p>
                  </div>

                  <div className="flex gap-3">
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
                      className="btn-secondary"
                    >
                      Try Again
                    </button>
                  </div>
                </>
              ) : (
                <div className="glass-strong rounded-xl p-8 text-center">
                  <p className="text-muted">
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
          <div className="mt-10 flex justify-between border-t border-border/50 pt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`text-sm font-medium transition-colors ${
                currentStep === 0
                  ? "text-muted/30 cursor-not-allowed"
                  : "text-muted hover:text-foreground"
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
