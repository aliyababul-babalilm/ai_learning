"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getLesson } from "@/lib/lessons-data";
import type { LessonStep } from "@/lib/lessons-data";

interface EvaluationResult {
  score: number;
  feedback: string;
  improvedPrompt: string;
}

interface PersonalizedExample {
  before: string;
  after: string;
  explanation: string;
}

interface SavedProgress {
  status: string;
  userPrompt: string | null;
  aiFeedback: string | null;
  improvedPrompt: string | null;
  score: number | null;
  finalSkillFile: string | null;
}

type DisplayStep = LessonStep | {
  type: "run";
  title: string;
} | {
  type: "guide";
  title: string;
};

function generateSkillFileContent(state: Record<string, any>): string {
  const anatomy = state["anatomy-of-a-skill"] || {};
  const build = state["build-your-first-skill"] || {};
  const download = state["download-and-use"] || {};

  // Use the improved versions if available, fall back to user's original
  const skillContent = download.improved || download.userPrompt || build.improved || build.userPrompt || "";
  const anatomyContent = anatomy.improved || anatomy.userPrompt || "";

  // Try to extract skill name from anatomy step (first line)
  const firstLine = anatomyContent.split("\n")[0]?.trim() || "my-skill";
  const descriptionLines = anatomyContent.split("\n").slice(1).join("\n  ").trim();

  return `---
name: ${firstLine}
description: >
  ${descriptionLines || "A custom skill created during AI training."}
---

${skillContent || "# Instructions\n\nAdd your skill instructions here."}
`;
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
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);

  // Builder state accumulation
  const [builderState, setBuilderState] = useState<Record<string, any>>({});
  const [loadingBuilder, setLoadingBuilder] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [generatedSkill, setGeneratedSkill] = useState("");
  const [generatingSkill, setGeneratingSkill] = useState(false);

  // Personalized example state
  const [personalizedExample, setPersonalizedExample] = useState<PersonalizedExample | null>(null);
  const [loadingExample, setLoadingExample] = useState(false);
  const [exampleError, setExampleError] = useState("");
  const [runAnswer, setRunAnswer] = useState("");
  const [runningPrompt, setRunningPrompt] = useState(false);
  const [runError, setRunError] = useState("");
  const [guideTab, setGuideTab] = useState<"install" | "chat">("install");

  // Fetch accumulated builder state for this module
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId || !lesson) {
      setLoadingBuilder(false);
      return;
    }
    fetch(`/api/lessons/builder-state?userId=${userId}&moduleSlug=${moduleSlug}`)
      .then((r) => r.json())
      .then((data) => setBuilderState(data.state || {}))
      .catch(() => {})
      .finally(() => setLoadingBuilder(false));
  }, [moduleSlug]);

  // Reset state when lesson changes
  useEffect(() => {
    setCurrentStep(0);
    setUserPrompt("");
    setEvaluation(null);
    setEvaluationError("");
    setPersonalizedExample(null);
    setExampleError("");
    setCopySuccess(false);
    setGeneratedSkill("");
    setRunAnswer("");
    setRunError("");
    setDraftSaved(false);
    setGuideTab("install");
  }, [moduleSlug, lessonSlug]);

  useEffect(() => {
    if (!lesson) return;
    loadPersonalizedExample();
  }, [lessonSlug, lesson]);

  const steps: DisplayStep[] =
    lesson && moduleSlug === "prompt-engineering"
      ? [...lesson.steps, { type: "run", title: "Run Your Improved Prompt" }]
      : lesson && moduleSlug === "claude-skills" && lessonSlug === "download-and-use"
      ? [...lesson.steps, { type: "guide", title: "Setup Guide (Screenshots)" }]
      : lesson?.steps || [];

  useEffect(() => {
    if (!lesson) return;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoadingProgress(false);
      return;
    }

    setLoadingProgress(true);
    fetch(`/api/lessons/progress?userId=${encodeURIComponent(userId)}&lessonSlug=${encodeURIComponent(lesson.slug)}`)
      .then((r) => r.json())
      .then((data: { progress: SavedProgress | null }) => {
        const saved = data.progress;
        if (!saved) return;

        if (saved.userPrompt) setUserPrompt(saved.userPrompt);
        if (saved.aiFeedback && saved.improvedPrompt && typeof saved.score === "number") {
          setEvaluation({
            score: saved.score,
            feedback: saved.aiFeedback,
            improvedPrompt: saved.improvedPrompt,
          });
          const improvedIndex = steps.findIndex((s) => s.type === "improved");
          setCurrentStep(improvedIndex >= 0 ? improvedIndex : 3);
        } else if (saved.userPrompt) {
          const practiceIndex = steps.findIndex((s) => s.type === "practice");
          setCurrentStep(practiceIndex >= 0 ? practiceIndex : 0);
        }
        if (saved.finalSkillFile) setGeneratedSkill(saved.finalSkillFile);
      })
      .catch(() => {})
      .finally(() => setLoadingProgress(false));
  }, [lessonSlug, lesson]);

  useEffect(() => {
    if (!lesson || loadingProgress || !userPrompt.trim() || evaluation) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setDraftSaved(false);
    const timeoutId = window.setTimeout(() => {
      fetch("/api/lessons/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          lessonSlug: lesson.slug,
          status: "in_progress",
          userPrompt,
        }),
      })
        .then((r) => {
          if (r.ok) {
            setDraftSaved(true);
            window.setTimeout(() => setDraftSaved(false), 1800);
          }
        })
        .catch(() => {});
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [userPrompt, lessonSlug, lesson, loadingProgress, evaluation]);

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

  const step = steps[currentStep];
  const totalSteps = steps.length;

  async function loadPersonalizedExample() {
    setLoadingExample(true);
    setExampleError("");
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setExampleError("Complete onboarding to see your personalized example.");
        return;
      }
      const res = await fetch(
        `/api/lessons/personalized-example?userId=${encodeURIComponent(userId)}&lessonSlug=${encodeURIComponent(
          lesson!.slug
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        setPersonalizedExample(data);
      } else {
        setExampleError("Your personalized example is not ready yet. Complete onboarding to generate it.");
      }
    } catch {
      setExampleError("Could not load your personalized example.");
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

      let skillContent = "";
      if (
        moduleSlug === "claude-skills" &&
        (lessonSlug === "build-your-first-skill" || lessonSlug === "download-and-use")
      ) {
        setGeneratingSkill(true);
        const skillRes = await fetch("/api/lessons/generate-skill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillDescription: [
              builderState["anatomy-of-a-skill"]?.improved ||
                builderState["anatomy-of-a-skill"]?.userPrompt ||
                "",
              userPrompt,
              result.improvedPrompt,
            ]
              .filter(Boolean)
              .join("\n\n---\n\n"),
            userId,
            lessonSlug: lesson!.slug,
          }),
        });

        if (skillRes.ok) {
          const skillData = await skillRes.json();
          skillContent = skillData.skillContent || "";
          setGeneratedSkill(skillContent);
        }
        setGeneratingSkill(false);
      }

      // Save to builder state after successful evaluation
      const stateKey = lessonSlug;
      const newState = {
        ...builderState,
        [stateKey]: { userPrompt, improved: result.improvedPrompt, skillContent },
      };
      setBuilderState(newState);
      fetch("/api/lessons/builder-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          lessonId: lesson!.slug,
          builderState: newState,
        }),
      }).catch(() => {});
    } catch {
      setEvaluationError("Failed to evaluate your prompt. Please try again.");
    } finally {
      setEvaluating(false);
      setGeneratingSkill(false);
    }
  }

  async function handleRunPrompt() {
    const promptToRun = evaluation?.improvedPrompt || userPrompt;
    if (!promptToRun.trim()) return;

    setRunningPrompt(true);
    setRunError("");
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch("/api/lessons/run-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToRun, userId }),
      });
      if (!res.ok) throw new Error("Run failed");
      const data = await res.json();
      setRunAnswer(data.answer || "");
    } catch {
      setRunError("Failed to run this prompt. Please try again.");
    } finally {
      setRunningPrompt(false);
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

  const stepLabels: Record<DisplayStep["type"], string> = {
    explain: "Learn",
    example: "Example",
    practice: "Practice",
    feedback: "Feedback",
    improved: "Improved",
    run: "Run",
    guide: "Setup Guide",
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
              {loadingExample && (
                <div className="glass rounded-lg px-4 py-2.5 text-xs text-muted font-medium">
                  Loading your personalized example...
                </div>
              )}

              {!loadingExample && personalizedExample && (
                <div className="glass rounded-lg px-4 py-2.5 text-xs text-accent font-medium flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Example personalized to your role
                </div>
              )}

              {!loadingExample && !personalizedExample && (
                <div className="glass-card rounded-xl p-5">
                  <p className="text-sm text-muted">
                    {exampleError || "Your personalized example is not ready yet."}
                  </p>
                </div>
              )}

              {personalizedExample && (
                <>
                  <div>
                    <h3 className="text-xs font-semibold text-error uppercase tracking-wider mb-2">
                      Before (Weak Prompt)
                    </h3>
                    <div className="bg-error/5 border border-error/20 rounded-xl p-4">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                        {personalizedExample.before}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-success uppercase tracking-wider mb-2">
                      After (Strong Prompt)
                    </h3>
                    <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                        {personalizedExample.after}
                      </pre>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                      Why This Works
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {personalizedExample.explanation}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {step.type === "practice" && (
            <div className="space-y-4">
              {/* Previous work indicator */}
              {!loadingBuilder && builderState[lessonSlug] && (
                <div className="glass rounded-xl p-4 border border-success/30 bg-success/5 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-semibold text-success">You completed this previously</span>
                  </div>
                  <div className="font-mono text-xs text-slate-600 whitespace-pre-wrap bg-white/70 rounded-lg p-3 border border-slate-200 max-h-32 overflow-y-auto">
                    {builderState[lessonSlug].userPrompt || builderState[lessonSlug].improved || "Completed"}
                  </div>
                </div>
              )}

              {step.instruction && (
                <div className="glass-card rounded-xl p-5 mb-6">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {step.instruction}
                  </p>
                </div>
              )}

              {personalizedExample && (
                <div className="glass rounded-xl p-4 border border-accent/20 bg-accent/5">
                  <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                    Personalized Reference Example
                  </h3>
                  <div className="grid gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-error uppercase tracking-wider mb-1">
                        Before
                      </div>
                      <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed bg-white/70 rounded-lg p-3 border border-error/10">
                        {personalizedExample.before}
                      </pre>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-success uppercase tracking-wider mb-1">
                        After
                      </div>
                      <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed bg-white/70 rounded-lg p-3 border border-success/10">
                        {personalizedExample.after}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 h-48 resize-y font-mono text-sm"
                placeholder={step.placeholder || "Write your prompt here..."}
              />

              <div className="min-h-5">
                {draftSaved && !evaluation && (
                  <p className="text-xs text-success">Draft saved</p>
                )}
              </div>

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
                    {generatingSkill ? "Generating skill file..." : "Evaluating with AI..."}
                  </span>
                ) : (
                  moduleSlug === "claude-skills" &&
                  (lessonSlug === "build-your-first-skill" || lessonSlug === "download-and-use")
                    ? "Submit and Generate Skill"
                    : "Submit for AI Feedback"
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
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-success uppercase tracking-wider">
                        Improved Prompt
                      </h3>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(evaluation.improvedPrompt).then(() => {
                            setCopiedPrompt(true);
                            setTimeout(() => setCopiedPrompt(false), 2000);
                          });
                        }}
                        className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-success/20 hover:border-success/40 bg-success/10 text-success hover:bg-success/20 transition-all font-medium cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedPrompt ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
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
                    {moduleSlug === "prompt-engineering" ? (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="btn-primary"
                      >
                        Run This Prompt
                      </button>
                    ) : (
                      <Link
                        href={`/learn/${moduleSlug}`}
                        className="btn-primary"
                      >
                        Back to Lessons
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setCurrentStep(2);
                        setUserPrompt("");
                        setEvaluation(null);
                        setRunAnswer("");
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

          {step.type === "run" && (
            <div className="space-y-6">
              {evaluation ? (
                <>
                  <p className="text-muted">
                    Run your improved prompt here and review the answer directly in this lesson.
                  </p>

                  <div className="bg-success/5 border border-success/20 rounded-xl p-5">
                    <h3 className="text-xs font-semibold text-success uppercase tracking-wider mb-3">
                      Prompt To Run
                    </h3>
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                      {evaluation.improvedPrompt}
                    </pre>
                  </div>

                  <button
                    onClick={handleRunPrompt}
                    disabled={runningPrompt}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {runningPrompt ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Running prompt...
                      </span>
                    ) : (
                      "Run Prompt"
                    )}
                  </button>

                  {runError && <p className="text-sm text-error">{runError}</p>}

                  {runAnswer && (
                    <div className="glass-card rounded-xl p-5">
                      <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                        Answer
                      </h3>
                      <div className="text-sm text-foreground leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold text-foreground mt-4 mb-2 first:mt-0" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-bold text-foreground mt-4 mb-2 first:mt-0" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-bold text-foreground mt-3 mb-1.5 first:mt-0" {...props} />,
                            p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                            hr: ({node, ...props}) => <hr className="my-4 border-t border-border/50" {...props} />,
                            table: ({node, ...props}) => (
                              <div className="overflow-x-auto my-4 border border-border/50 rounded-xl">
                                <table className="w-full text-left text-sm border-collapse" {...props} />
                              </div>
                            ),
                            thead: ({node, ...props}) => <thead className="bg-[#f8fbff] border-b border-border/50 text-xs font-semibold text-muted uppercase tracking-wider" {...props} />,
                            tbody: ({node, ...props}) => <tbody className="divide-y divide-border/30" {...props} />,
                            tr: ({node, ...props}) => <tr className="hover:bg-border/5 transition-colors" {...props} />,
                            th: ({node, ...props}) => <th className="px-4 py-3 font-semibold text-foreground" {...props} />,
                            td: ({node, ...props}) => <td className="px-4 py-3 text-muted leading-normal" {...props} />,
                          }}
                        >
                          {runAnswer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  <Link href={`/learn/${moduleSlug}`} className="btn-secondary">
                    Back to Lessons
                  </Link>
                </>
              ) : (
                <div className="glass-strong rounded-xl p-8 text-center">
                  <p className="text-muted">
                    Complete the practice step first to run your improved prompt.
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

          {step.type === "guide" && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-muted text-sm leading-relaxed">
                Follow this interactive visual guide to learn how to add your custom <code className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded text-accent">.skill</code> files into Claude Desktop and trigger them seamlessly from your chats.
              </p>

              {/* Interactive Steps Toggles */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-border/20 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setGuideTab("install")}
                  className={`py-2.5 px-4 rounded-lg font-display text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    guideTab === "install"
                      ? "bg-white shadow-sm text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-mono font-bold">1</span>
                  Importing the Skill File
                </button>
                <button
                  type="button"
                  onClick={() => setGuideTab("chat")}
                  className={`py-2.5 px-4 rounded-lg font-display text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    guideTab === "chat"
                      ? "bg-white shadow-sm text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-mono font-bold">2</span>
                  Triggering from Chat
                </button>
              </div>

              {/* Visual Mockups */}
              <div className="mb-6">
                {guideTab === "install" ? (
                  <div className="space-y-4">
                    {/* Step 1 Instructions */}
                    <div className="glass-card rounded-xl p-5 border-l-4 border-accent text-sm">
                      <h3 className="font-display font-bold mb-1.5 text-foreground">
                        Step 1: Adding Custom Skills in Settings
                      </h3>
                      <p className="text-muted leading-relaxed">
                        Open Claude Desktop, navigate to Settings, select the <strong>Skills</strong> tab, and import the downloaded skill. Claude compiles the structure to activate it whenever its trigger words appear.
                      </p>
                    </div>

                    {/* CSS macOS Window Mockup (Import UI) */}
                    <div className="w-full bg-[#1e1e1f] rounded-xl shadow-xl border border-white/10 overflow-hidden font-sans">
                      {/* macOS Titlebar */}
                      <div className="bg-[#2d2d2f] px-4 py-2 flex items-center border-b border-black/20">
                        <div className="flex gap-1.5 mr-4">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium mx-auto -ml-10">Claude Settings</span>
                      </div>

                      {/* Main Settings Panel */}
                      <div className="flex min-h-[340px] bg-[#1e1e1f] flex-col sm:flex-row">
                        {/* Left Sidebar */}
                        <div className="w-full sm:w-40 bg-[#252526] p-2 border-r border-black/20 flex flex-row sm:flex-col gap-0.5 text-xs text-slate-300 overflow-x-auto sm:overflow-x-visible">
                          <div className="px-2 py-1 rounded hover:bg-[#333334] cursor-pointer whitespace-nowrap">General</div>
                          <div className="px-2 py-1 rounded hover:bg-[#333334] cursor-pointer whitespace-nowrap">Profiles</div>
                          <div className="px-2 py-1 rounded hover:bg-[#333334] cursor-pointer whitespace-nowrap">Extensions</div>
                          <div className="px-2 py-1 rounded bg-[#cc522b]/15 text-[#f27a54] font-semibold whitespace-nowrap">Skills</div>
                          <div className="px-2 py-1 rounded hover:bg-[#333334] cursor-pointer whitespace-nowrap">Developer</div>
                        </div>

                        {/* Right Main Panel */}
                        <div className="flex-1 p-4 text-slate-200">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                            <div>
                              <h4 className="text-sm font-bold text-white">Custom Skills</h4>
                              <p className="text-[10px] text-slate-450">Manage custom instructions and automated workflows</p>
                            </div>
                            <button type="button" className="bg-[#cc522b] hover:bg-[#b04522] text-[10px] font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 shadow transition-colors self-start sm:self-auto text-white">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                              </svg>
                              Import Skill
                            </button>
                          </div>

                          {/* Skill Cards / List */}
                          <div className="space-y-2">
                            <div className="bg-[#2d2d2f] border border-white/5 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs text-white">Market Morning Brief</span>
                                  <span className="bg-[#cc522b]/20 text-[#f27a54] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">v1.0</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                                  Generates a daily structured commodities morning brief from raw overnight reports and price tables.
                                </p>
                                <div className="flex flex-wrap gap-2 text-[9px] text-slate-500 mt-2">
                                  <span>Trigger: <code className="bg-black/30 px-1 py-0.5 rounded text-[#f27a54]">"morning brief"</code></span>
                                  <span>•</span>
                                  <span>File: <code className="bg-black/30 px-1 py-0.5 rounded text-slate-300">market-morning-brief.skill</code></span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] text-emerald-400 font-semibold uppercase">Active</span>
                              </div>
                            </div>

                            {/* Drop Zone / Empty Slot */}
                            <div className="border border-dashed border-slate-700/60 rounded-lg p-6 text-center bg-[#252526]/50 hover:bg-[#252526] transition-colors cursor-pointer group">
                              <svg className="w-6 h-6 text-slate-500 mx-auto mb-1 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="block text-xs text-slate-400 font-medium group-hover:text-slate-300 transition-colors">Drag and drop your downloaded skill here</span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">Supports .skill, .md, or .json formats</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Step 2 Instructions */}
                    <div className="glass-card rounded-xl p-5 border-l-4 border-accent text-sm">
                      <h3 className="font-display font-bold mb-1.5 text-foreground">
                        Step 2: Triggering and Running Your Skill
                      </h3>
                      <p className="text-muted leading-relaxed">
                        Whenever you open a chat session, simply use your trigger phrase (e.g., <strong>&quot;morning brief&quot;</strong> or paste your raw overnight data), and Claude Desktop instantly triggers the custom skill.
                      </p>
                    </div>

                    {/* CSS macOS Window Mockup (Chat UI) */}
                    <div className="w-full bg-[#19191a] rounded-xl shadow-xl border border-white/10 overflow-hidden font-sans">
                      {/* macOS Titlebar */}
                      <div className="bg-[#222223] px-4 py-2 flex items-center border-b border-black/20">
                        <div className="flex gap-1.5 mr-4">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium mx-auto -ml-10">Claude 3.5 Sonnet</span>
                      </div>

                      {/* Chat Contents */}
                      <div className="p-4 space-y-4 min-h-[380px] flex flex-col justify-between">
                        <div className="space-y-4">
                          {/* User message */}
                          <div className="flex items-start justify-end gap-2">
                            <div className="max-w-[85%] bg-[#cc522b] text-white rounded-xl px-3.5 py-2.5 text-xs shadow">
                              <p className="font-semibold text-[9px] text-white/80 mb-0.5 tracking-wider">YOU</p>
                              <p className="leading-relaxed">
                                Please prepare the <strong className="underline">morning brief</strong> with these overnight numbers:<br />
                                Brent Crude closed 81.42 (+1.2%), Gold 2420 (-0.5%), HH Natural Gas 2.15 (+3.4%).
                              </p>
                            </div>
                          </div>

                          {/* Claude message response */}
                          <div className="flex items-start gap-2">
                            {/* Avatar */}
                            <div className="w-6 h-6 rounded-md bg-[#cc522b]/20 flex items-center justify-center text-[#f27a54] font-bold text-[10px] flex-shrink-0">
                              C
                            </div>
                            <div className="flex-1 bg-[#232324] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-slate-200 shadow overflow-hidden">
                              {/* Active Badge */}
                              <div className="flex items-center gap-1.5 mb-2 bg-[#cc522b]/15 border border-[#cc522b]/30 rounded px-2 py-0.5 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#f27a54] animate-ping" />
                                <span className="text-[9px] font-semibold text-[#f27a54] uppercase tracking-wider">Skill Active: Market Morning Brief</span>
                              </div>

                              <h5 className="text-white font-bold text-xs border-b border-slate-700/50 pb-1 mb-2 uppercase tracking-wider">DAILY TRADING BRIEF</h5>
                              
                              <div className="overflow-x-auto mb-3">
                                <table className="min-w-full text-[10px] text-left">
                                  <thead>
                                    <tr className="text-slate-400 border-b border-slate-800">
                                      <th className="pb-1 font-semibold">Commodity</th>
                                      <th className="pb-1 font-semibold">Close</th>
                                      <th className="pb-1 font-semibold text-right">Change</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-b border-slate-900/50">
                                      <td className="py-1 text-white font-medium">Brent Crude</td>
                                      <td className="py-1">$81.42</td>
                                      <td className="py-1 text-emerald-400 text-right">+1.2%</td>
                                    </tr>
                                    <tr>
                                      <td className="py-1 text-white font-medium font-bold">Gold</td>
                                      <td className="py-1">$2,420.00</td>
                                      <td className="py-1 text-rose-400 text-right">-0.5%</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-normal">
                                Brent crude holds technical support pivot. Gas volatility increases bullish bias.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Input bar */}
                        <div className="bg-[#252526] border border-white/5 rounded-lg px-3 py-2 flex items-center justify-between text-[10px] text-slate-500 mt-2">
                          <span>Ask Claude a question or type a trigger...</span>
                          <div className="flex gap-2">
                            <span className="px-1.5 py-0.5 bg-black/30 rounded text-[9px]">⌘ Enter</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Claude Skills: Download .skill file section */}
          {moduleSlug === "claude-skills" && lessonSlug === "download-and-use" && !loadingBuilder && (
            <div className="glass-card rounded-2xl p-6 mt-6">
              <h3 className="font-display text-xl font-bold mb-4">Your Complete Skill File</h3>

              {Object.keys(builderState).length > 0 ? (
                <>
                  {/* Show accumulated content */}
                  <div className="glass-input rounded-xl p-4 mb-4 font-mono text-sm whitespace-pre-wrap">
                    {generatedSkill ||
                      builderState["download-and-use"]?.skillContent ||
                      builderState["build-your-first-skill"]?.skillContent ||
                      generateSkillFileContent(builderState)}
                  </div>

                  {/* Download button */}
                  <button
                    onClick={() => {
                      const content =
                        generatedSkill ||
                        builderState["download-and-use"]?.skillContent ||
                        builderState["build-your-first-skill"]?.skillContent ||
                        generateSkillFileContent(builderState);
                      const blob = new Blob([content], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${(builderState["anatomy-of-a-skill"]?.userPrompt || "my-skill")
                        .split("\n")[0]
                        .replace(/\s+/g, "-")
                        .toLowerCase()}.skill`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold mr-3"
                  >
                    Download .skill File
                  </button>

                  {/* Installation instructions */}
                  <div className="mt-6 glass rounded-xl p-5">
                    <h4 className="font-display text-lg font-bold mb-3">How to Install Your Skill</h4>
                    <ol className="space-y-3 text-sm text-slate-700">
                      <li>
                        <strong>1. Save the file</strong> — Click &quot;Download .skill File&quot; above. Save it
                        somewhere you can find it.
                      </li>
                      <li>
                        <strong>2. Open Claude Desktop</strong> — Launch the Claude Desktop app on your computer.
                      </li>
                      <li>
                        <strong>3. Go to Settings</strong> — Click the menu icon in the top-left, then
                        &quot;Settings&quot;.
                      </li>
                      <li>
                        <strong>4. Find &quot;Skills&quot;</strong> — In Settings, look for the &quot;Skills&quot; or
                        &quot;Custom Skills&quot; section.
                      </li>
                      <li>
                        <strong>5. Import your skill</strong> — Click &quot;Add Skill&quot; or &quot;Import&quot;, then
                        select the .skill file you downloaded.
                      </li>
                      <li>
                        <strong>6. Test it</strong> — Start a new conversation and try triggering your skill. It should
                        activate automatically based on the trigger conditions you defined.
                      </li>
                    </ol>
                    <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-lg text-sm mb-4">
                      <strong>Pro tip:</strong> You can also place .skill files directly in{" "}
                      <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono">~/.claude/skills/</code> and
                      Claude will pick them up automatically on next launch.
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <span className="text-xs text-muted">Need a visual guide with step-by-step screenshots?</span>
                      <Link href="/learn/claude-skills-guide" className="text-sm font-semibold text-accent hover:text-accent-strong transition-colors inline-flex items-center gap-1">
                        View Setup & Usage Guide
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted">
                  Complete the previous lessons in this module to build your skill file. Your work from each lesson will
                  accumulate here.
                </p>
              )}
            </div>
          )}

          {/* Claude Projects: Complete Blueprint section */}
          {moduleSlug === "claude-projects" && lessonSlug === "complete-blueprint" && !loadingBuilder && (
            <div className="glass-card rounded-2xl p-6 mt-6">
              <h3 className="font-display text-xl font-bold mb-4">Your Claude Desktop Blueprint</h3>

              {Object.keys(builderState).length > 0 ? (
                <>
                  <div className="space-y-4">
                    {Object.entries(builderState).map(([lessonKey, data]: [string, any]) => (
                      <div key={lessonKey} className="glass rounded-xl p-4">
                        <h4 className="font-semibold text-sm text-slate-600 uppercase tracking-wider mb-2">
                          {lessonKey.replace(/-/g, " ")}
                        </h4>
                        <div className="font-mono text-sm whitespace-pre-wrap bg-white rounded-lg p-3 border border-slate-200">
                          {data.improved || data.userPrompt || "Not completed yet"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const text = Object.entries(builderState)
                        .map(
                          ([key, data]: [string, any]) =>
                            `## ${key.replace(/-/g, " ").toUpperCase()}\n\n${data.improved || data.userPrompt || ""}`
                        )
                        .join("\n\n---\n\n");
                      navigator.clipboard.writeText(text).then(() => {
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      });
                    }}
                    className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold mt-4"
                  >
                    {copySuccess ? "Copied!" : "Copy Complete Blueprint"}
                  </button>
                </>
              ) : (
                <p className="text-sm text-muted">
                  Complete the previous lessons in this module to build your blueprint. Your work from each lesson will
                  accumulate here.
                </p>
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
