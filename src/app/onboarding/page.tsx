"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
}

interface Question {
  id: string;
  text: string;
  category: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (companyId) {
      setLoadingQuestions(true);
      setQuestionsError("");
      setQuestions([]);
      fetch(`/api/companies/${companyId}/questions`)
        .then((r) => r.json())
        .then((data) => {
          const approved = data.filter(
            (q: Question & { isApproved: boolean }) => q.isApproved
          );
          setQuestions(approved);
          if (approved.length === 0) {
            setQuestionsError(
              "This company does not have approved interview questions yet. Ask an admin to generate and approve questions before onboarding learners."
            );
          }
        })
        .catch(() => {
          setQuestionsError("Could not load interview questions for this company.");
        })
        .finally(() => setLoadingQuestions(false));
    } else {
      setQuestions([]);
      setQuestionsError("");
    }
  }, [companyId]);

  const totalSteps = 1 + questions.length;
  const progress = ((step + 1) / (totalSteps + 1)) * 100;

  const canProceedStep0 =
    name.trim() &&
    email.trim() &&
    companyId &&
    !loadingQuestions &&
    questions.length > 0;
  const currentQuestion = step > 0 ? questions[step - 1] : null;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const responses = questions.map((q) => ({
        questionId: q.id,
        category: q.category,
        answer: answers[q.id] || "",
      }));

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, companyId, responses }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name || "");
        localStorage.setItem("userEmail", data.user.email);
        router.push("/dashboard");
      } else {
        alert("Failed to save your responses. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (step === 0 && !canProceedStep0) return;
    if (currentQuestion && !(answers[currentQuestion.id] || "").trim()) return;
    setDirection("forward");
    if (step === totalSteps - 1) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  }

  function handleBack() {
    setDirection("back");
    setStep(step - 1);
  }

  const selectedCompany = companies.find((c) => c.id === companyId);

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
      <header className="py-5">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-display">B</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Bab Al Ilm
            </span>
          </Link>
          <span className="text-xs text-muted font-medium">AI Mastery Programme</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-border/50">
        <div
          className="h-full bg-gradient-to-r from-accent-strong to-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center py-12 px-6">
        <div className="max-w-xl w-full">
          <div
            key={step}
            className={direction === "forward" ? "animate-slide-right" : "animate-slide-left"}
          >
            {step === 0 ? (
              <div className="glass-strong rounded-2xl p-8 md:p-10">
                <div className="mb-8">
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    Welcome to Bab Al Ilm
                  </h1>
                  <p className="text-muted text-sm leading-relaxed">
                    Before we begin your AI mastery journey, we need to understand your
                    role so every lesson, example, and exercise is personalized to your
                    actual work.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Your Company
                    </label>
                    <select
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
                    >
                      <option value="">Select your company</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {loadingQuestions && (
                      <p className="text-xs text-muted mt-2">
                        Loading interview questions...
                      </p>
                    )}
                    {!loadingQuestions && questionsError && (
                      <p className="text-xs text-error mt-2">
                        {questionsError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!canProceedStep0}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : currentQuestion ? (
              <div className="glass-strong rounded-2xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">{step}</span>
                  </div>
                  <span className="text-xs text-muted font-medium">
                    Question {step} of {questions.length}
                    {selectedCompany && ` — ${selectedCompany.name}`}
                  </span>
                </div>

                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  {currentQuestion.text}
                </h2>
                <p className="text-xs text-muted mb-6">
                  Your answer helps us personalize every lesson to your specific work context.
                </p>

                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [currentQuestion.id]: e.target.value,
                    })
                  }
                  className="w-full glass-input rounded-lg px-4 py-3 h-32 resize-none text-sm"
                  placeholder="Share as much detail as you can — the more we know, the better your training experience..."
                  autoFocus
                />

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="text-sm text-muted hover:text-foreground transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={submitting || !(answers[currentQuestion.id] || "").trim()}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Saving..."
                      : step === totalSteps - 1
                      ? "Complete Setup"
                      : "Continue"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-strong rounded-2xl p-8 md:p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  All set!
                </h2>
                <p className="text-muted text-sm mb-8">
                  Your profile is ready. Click below to start your AI mastery journey.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleBack}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary disabled:opacity-40"
                  >
                    {submitting ? "Saving..." : "Start Learning"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
