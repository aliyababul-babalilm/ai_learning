"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [submitting, setSubmitting] = useState(false);

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
      fetch(`/api/companies/${companyId}/questions`)
        .then((r) => r.json())
        .then((data) => {
          const approved = data.filter(
            (q: Question & { isApproved: boolean }) => q.isApproved
          );
          setQuestions(approved);
        });
    }
  }, [companyId]);

  const totalSteps = 1 + questions.length; // step 0 = info, rest = questions
  const progress = ((step + 1) / (totalSteps + 1)) * 100;

  const canProceedStep0 = name.trim() && email.trim() && companyId;

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
        // Store user ID in localStorage for session
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name || "");
        localStorage.setItem("userEmail", data.user.email);
        router.push("/learn");
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
    if (step === totalSteps - 1) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
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
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-lg font-bold">AI Learning Platform</div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-border">
        <div
          className="h-1.5 bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center py-12 px-6">
        <div className="card max-w-2xl w-full p-8">
          {step === 0 ? (
            <>
              <h1 className="text-2xl font-bold text-primary mb-2">
                Welcome! Let&apos;s personalize your learning.
              </h1>
              <p className="text-text-secondary mb-8">
                Tell us about yourself so we can tailor the training to your
                role.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Your Company
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                  >
                    <option value="">Select your company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!canProceedStep0}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          ) : currentQuestion ? (
            <>
              <div className="text-sm text-text-secondary mb-2">
                Question {step} of {questions.length}
              </div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                {currentQuestion.text}
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Category: {currentQuestion.category.replace("_", " ")}
              </p>

              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [currentQuestion.id]: e.target.value,
                  })
                }
                className="w-full border border-border rounded-lg px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Type your answer here..."
              />

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 text-text-secondary hover:text-text transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="btn-primary disabled:opacity-40"
                >
                  {submitting
                    ? "Saving..."
                    : step === totalSteps - 1
                    ? "Complete Setup"
                    : "Next"}
                </button>
              </div>
            </>
          ) : (
            // No questions for this company
            <>
              <h2 className="text-xl font-semibold text-primary mb-4">
                All set!
              </h2>
              <p className="text-text-secondary mb-8">
                No additional questions for your company. Click below to start
                learning.
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-2.5 text-text-secondary hover:text-text"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
