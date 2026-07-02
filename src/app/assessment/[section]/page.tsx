"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getQuestionsForSection,
  sectionSlugToDbKey,
  type AssessmentQuestion,
} from "@/lib/assessment-questions";

const SECTION_TITLES: Record<string, string> = {
  registration: "Registration",
  "data-maturity": "Data Maturity",
  "personal-ai": "Personal AI Usage",
  "company-ai": "Company AI Strategy",
};

export default function AssessmentSectionPage() {
  const params = useParams<{ section: string }>();
  const router = useRouter();
  const section = params.section;
  const questions = getQuestionsForSection(section);
  const sectionTitle = SECTION_TITLES[section] || section;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const question = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isLast = currentIndex === questions.length - 1;

  // Redirect if invalid section
  useEffect(() => {
    if (questions.length === 0) {
      router.push("/assessment");
    }
  }, [questions.length, router]);

  const validate = useCallback(
    (q: AssessmentQuestion): string | null => {
      const val = responses[q.id];

      if (q.required) {
        if (q.type === "grid") {
          const grid = val as Record<string, string> | undefined;
          if (!grid || !q.gridItems) return "Please answer all rows.";
          for (const item of q.gridItems) {
            if (!grid[item]) return `Please select an option for "${item}".`;
          }
          return null;
        }
        if (q.type === "multi-select") {
          if (!val || !Array.isArray(val) || val.length === 0)
            return "Please select at least one option.";
          if (q.maxSelections && val.length > q.maxSelections)
            return `Please select at most ${q.maxSelections} options.`;
          return null;
        }
        if (!val || (typeof val === "string" && val.trim() === ""))
          return "This field is required.";
        if (q.type === "text" || q.type === "long-text") {
          const str = (val as string).trim();
          if (q.minLength && str.length < q.minLength)
            return `Please enter at least ${q.minLength} characters.`;
          if (q.maxLength && str.length > q.maxLength)
            return `Please keep your response under ${q.maxLength} characters.`;
        }
      }
      return null;
    },
    [responses]
  );

  function handleNext() {
    if (!question) return;
    const error = validate(question);
    if (error) {
      setErrors({ ...errors, [question.id]: error });
      return;
    }
    setErrors({});
    if (isLast) {
      handleSubmit();
    } else {
      setDirection("next");
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setErrors({});
      setDirection("prev");
      setCurrentIndex((i) => i - 1);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/");
        return;
      }
      const dbSection = sectionSlugToDbKey(section);
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          section: dbSection,
          responses,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/assessment");
    } catch {
      setErrors({ _submit: "Failed to save your responses. Please try again." });
      setSubmitting(false);
    }
  }

  function setResponse(id: string, value: any) {
    setResponses((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  if (questions.length === 0) {
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
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <Link href="/assessment" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-display">B</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Bab Al Ilm
            </span>
          </Link>
          <span className="text-xs text-muted font-medium">{sectionTitle}</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-6 w-full pt-6">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-border/50 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-accent-strong to-accent rounded-full h-1.5 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-8 w-full">
        <div
          key={question.id}
          className={`transition-all duration-300 ${
            direction === "next" ? "animate-slide-right" : "animate-slide-left"
          }`}
        >
          <div className="glass-card rounded-xl p-6 md:p-8">
            {question.dimension && question.dimension !== "identity" && question.dimension !== "org_context" && question.dimension !== "ai_context" && question.dimension !== "workflow" && (
              <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-2">
                {question.dimension.replace(/_/g, " ")}
              </div>
            )}
            <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-1">
              {question.text}
            </h2>
            {question.helpText && (
              <p className="text-sm text-muted mb-4">{question.helpText}</p>
            )}
            {!question.helpText && <div className="mb-4" />}

            {/* Input based on question type */}
            <QuestionInput
              question={question}
              value={responses[question.id]}
              onChange={(val) => setResponse(question.id, val)}
            />

            {errors[question.id] && (
              <p className="mt-3 text-sm font-medium" style={{ color: "#dc2626" }}>
                {errors[question.id]}
              </p>
            )}
          </div>
        </div>

        {errors._submit && (
          <p className="mt-4 text-sm font-medium text-center" style={{ color: "#dc2626" }}>
            {errors._submit}
          </p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="text-sm font-medium text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={submitting}
            className="btn-primary text-sm px-6 py-2.5 rounded-xl disabled:opacity-40 flex items-center gap-1"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Saving...
              </span>
            ) : isLast ? (
              "Complete Section"
            ) : (
              <>
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs text-muted/60 font-medium">
            Bab Al Ilm — AI Mastery Programme
          </span>
        </div>
      </footer>
    </div>
  );
}

// ─── Question Input Components ──────────────────────────────────────────────

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: AssessmentQuestion;
  value: any;
  onChange: (val: any) => void;
}) {
  switch (question.type) {
    case "text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
          placeholder="Type your answer..."
          maxLength={question.maxLength}
        />
      );

    case "long-text":
      return (
        <div>
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none h-32"
            placeholder="Type your answer..."
            maxLength={question.maxLength}
          />
          {question.minLength && (
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  (value || "").length < question.minLength ? "text-muted" : "text-success"
                }`}
              >
                {(value || "").length}/{question.minLength} min characters
              </span>
            </div>
          )}
        </div>
      );

    case "single-select":
      return (
        <div className="space-y-2">
          {(question.options || []).map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                value === option
                  ? "border-accent bg-accent/5 text-foreground font-medium shadow-sm"
                  : "border-border/50 bg-white/50 text-foreground hover:border-accent/30 hover:bg-accent/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    value === option ? "border-accent" : "border-border"
                  }`}
                >
                  {value === option && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      );

    case "multi-select":
      return (
        <div className="space-y-2">
          {question.maxSelections && (
            <p className="text-xs text-muted mb-1">
              Select up to {question.maxSelections}
            </p>
          )}
          {(question.options || []).map((option) => {
            const selected = Array.isArray(value) && value.includes(option);
            const atMax = question.maxSelections && Array.isArray(value) && value.length >= question.maxSelections && !selected;
            return (
              <button
                key={option}
                onClick={() => {
                  const current: string[] = Array.isArray(value) ? [...value] : [];
                  if (selected) {
                    onChange(current.filter((v) => v !== option));
                  } else if (!atMax) {
                    onChange([...current, option]);
                  }
                }}
                disabled={!!atMax}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                  selected
                    ? "border-accent bg-accent/5 text-foreground font-medium shadow-sm"
                    : atMax
                    ? "border-border/30 bg-border/10 text-muted cursor-not-allowed"
                    : "border-border/50 bg-white/50 text-foreground hover:border-accent/30 hover:bg-accent/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
                      selected ? "border-accent bg-accent" : "border-border"
                    }`}
                  >
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      );

    case "likert":
      return (
        <div className="space-y-2">
          {(question.options || []).map((option, i) => {
            const isSelected = value === option;
            return (
              <button
                key={option}
                onClick={() => onChange(option)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                  isSelected
                    ? "border-accent bg-accent/5 text-foreground font-medium shadow-sm"
                    : "border-border/50 bg-white/50 text-foreground hover:border-accent/30 hover:bg-accent/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected
                        ? "bg-accent text-white"
                        : "bg-border/30 text-muted"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span>{option.replace(/^\d+\s*[—\-]\s*/, "")}</span>
                </div>
              </button>
            );
          })}
        </div>
      );

    case "grid":
      return <GridInput question={question} value={value} onChange={onChange} />;

    default:
      return null;
  }
}

function GridInput({
  question,
  value,
  onChange,
}: {
  question: AssessmentQuestion;
  value: Record<string, string> | undefined;
  onChange: (val: Record<string, string>) => void;
}) {
  const grid = value || {};
  const items = question.gridItems || [];
  const options = question.gridOptions || [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 pr-4 text-xs font-semibold text-muted uppercase tracking-wider w-1/3">
              Data Type
            </th>
            {options.map((opt) => (
              <th key={opt} className="text-center py-2 px-2 text-xs font-semibold text-muted uppercase tracking-wider">
                {opt}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item} className="border-t border-border/30">
              <td className="py-3 pr-4 text-foreground text-sm">{item}</td>
              {options.map((opt) => (
                <td key={opt} className="text-center py-3 px-2">
                  <button
                    onClick={() => onChange({ ...grid, [item]: opt })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                      grid[item] === opt
                        ? "border-accent bg-accent text-white"
                        : "border-border/50 bg-white/50 hover:border-accent/30"
                    }`}
                  >
                    {grid[item] === opt && (
                      <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
