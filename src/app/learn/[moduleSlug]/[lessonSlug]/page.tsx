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
};

function generateSkillFileContent(state: Record<string, any>): string {
  // Lesson 1: YAML header (name, description, trigger)
  const lesson1 = state["what-are-skills"] || {};
  const yamlHeader = lesson1.improved || lesson1.userPrompt || "";

  // Lesson 2: Role + Input specification
  const lesson2 = state["anatomy-of-a-skill"] || {};
  const roleAndInput = lesson2.improved || lesson2.userPrompt || "";

  // Lesson 3: Analysis framework + Output specification
  const lesson3 = state["build-your-first-skill"] || {};
  const analysisAndOutput = lesson3.improved || lesson3.userPrompt || "";

  // Lesson 4: Edge cases + Constraints
  const lesson4 = state["download-and-use"] || {};
  const edgesAndConstraints = lesson4.improved || lesson4.userPrompt || "";

  // If we have a YAML header from lesson 1, use it as-is (it should contain ---)
  // Otherwise construct a minimal one
  let header = yamlHeader.trim();
  if (!header.startsWith("---")) {
    header = `---\nname: my-skill\ndescription: >\n  A custom skill created during AI training.\n---`;
  }

  // Strip any trailing --- if the user included it, then re-add to ensure clean separation
  // The header should end with ---
  if (!header.endsWith("---")) {
    header = header + "\n---";
  }

  const sections = [header];

  if (roleAndInput.trim()) {
    sections.push(roleAndInput.trim());
  }

  if (analysisAndOutput.trim()) {
    sections.push(analysisAndOutput.trim());
  }

  if (edgesAndConstraints.trim()) {
    sections.push(edgesAndConstraints.trim());
  }

  // If no body sections exist, add a placeholder
  if (sections.length === 1) {
    sections.push("# Instructions\n\nAdd your skill instructions here.");
  }

  return sections.join("\n\n");
}

function extractSkillName(state: Record<string, any>): string {
  const lesson1 = state["what-are-skills"] || {};
  const content = lesson1.improved || lesson1.userPrompt || "";
  // Try to extract name from YAML: name: some-skill-name
  const nameMatch = content.match(/name:\s*(.+)/);
  if (nameMatch) {
    return nameMatch[1].trim().replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase() || "my-skill";
  }
  return "my-skill";
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
  }, [moduleSlug, lessonSlug]);

  useEffect(() => {
    if (!lesson) return;
    // Only auto-generate personalized examples for prompt engineering lessons
    // Skills lessons have their own static examples that are already relevant
    if (moduleSlug === "prompt-engineering") {
      loadPersonalizedExample();
    }
  }, [lessonSlug, lesson]);

  const steps: DisplayStep[] =
    lesson && moduleSlug === "prompt-engineering"
      ? [...lesson.steps, { type: "run", title: "Run Your Improved Prompt" }]
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
        lessonSlug === "download-and-use"
      ) {
        setGeneratingSkill(true);
        // Assemble all pieces from all 4 lessons for the generate-skill API
        const allPieces = [
          builderState["what-are-skills"]?.improved ||
            builderState["what-are-skills"]?.userPrompt ||
            "",
          builderState["anatomy-of-a-skill"]?.improved ||
            builderState["anatomy-of-a-skill"]?.userPrompt ||
            "",
          builderState["build-your-first-skill"]?.improved ||
            builderState["build-your-first-skill"]?.userPrompt ||
            "",
          result.improvedPrompt || userPrompt,
        ]
          .filter(Boolean)
          .join("\n\n---\n\n");

        const skillRes = await fetch("/api/lessons/generate-skill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillDescription: allPieces,
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
                  moduleSlug === "claude-skills" && lessonSlug === "download-and-use"
                    ? "Submit & Assemble Skill File"
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

          {/* Claude Skills: Download skill file section */}
          {moduleSlug === "claude-skills" && lessonSlug === "download-and-use" && !loadingBuilder && (
            <div className="glass-card rounded-2xl p-6 mt-6">
              <h3 className="font-display text-xl font-bold mb-4">Your Complete Skill File</h3>

              {Object.keys(builderState).length > 0 ? (
                <>
                  {/* Show what pieces have been completed */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { key: "what-are-skills", label: "YAML Header" },
                      { key: "anatomy-of-a-skill", label: "Role & Input" },
                      { key: "build-your-first-skill", label: "Analysis & Output" },
                      { key: "download-and-use", label: "Edge Cases & Constraints" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`text-xs px-3 py-2 rounded-lg font-medium ${
                          builderState[key]
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-border/20 text-muted border border-border/30"
                        }`}
                      >
                        {builderState[key] ? "\u2713" : "\u25CB"} {label}
                      </div>
                    ))}
                  </div>

                  {/* Show assembled content */}
                  <div className="glass-input rounded-xl p-4 mb-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {generatedSkill ||
                      builderState["download-and-use"]?.skillContent ||
                      generateSkillFileContent(builderState)}
                  </div>

                  {/* Download button */}
                  <button
                    onClick={() => {
                      const content =
                        generatedSkill ||
                        builderState["download-and-use"]?.skillContent ||
                        generateSkillFileContent(builderState);
                      const skillName = extractSkillName(builderState);
                      const blob = new Blob([content], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `SKILL.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold mr-3"
                  >
                    Download SKILL.md
                  </button>

                  <button
                    onClick={() => {
                      const content =
                        generatedSkill ||
                        builderState["download-and-use"]?.skillContent ||
                        generateSkillFileContent(builderState);
                      navigator.clipboard.writeText(content).then(() => {
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      });
                    }}
                    className="btn-secondary rounded-xl px-6 py-3 text-sm font-semibold"
                  >
                    {copySuccess ? "Copied!" : "Copy to Clipboard"}
                  </button>

                  {/* Installation instructions */}
                  <div className="mt-6 glass rounded-xl p-5">
                    <h4 className="font-display text-lg font-bold mb-3">How to Install in Claude Desktop</h4>
                    <ol className="space-y-3 text-sm text-slate-700">
                      <li>
                        <strong>1. Download the file</strong> — Click &quot;Download SKILL.md&quot; above.
                      </li>
                      <li>
                        <strong>2. Create a folder</strong> — Create a new folder named after your skill
                        (e.g., <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono">{extractSkillName(builderState)}/</code>).
                      </li>
                      <li>
                        <strong>3. Move the file</strong> — Put the downloaded SKILL.md inside that folder.
                      </li>
                      <li>
                        <strong>4. ZIP the folder</strong> — Right-click the folder and compress/ZIP it.
                      </li>
                      <li>
                        <strong>5. Upload to Claude Desktop</strong> — Open Claude Desktop, go to{" "}
                        <strong>Customize</strong> (bottom-left icon) &rarr; <strong>Skills</strong> &rarr;{" "}
                        <strong>+</strong> &rarr; <strong>Upload a skill</strong> &rarr; select your ZIP file.
                      </li>
                      <li>
                        <strong>6. Test it</strong> — Start a new conversation and try your trigger phrase.
                        The skill should activate automatically.
                      </li>
                    </ol>
                    <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-lg text-sm">
                      <strong>Testing tips:</strong> Run your skill against three inputs — a normal case, an edge case
                      (missing data), and a stress test (lots of data). If the output is not right, update the SKILL.md
                      instructions and re-upload. Most skills need 2-3 iterations to reach production quality.
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
