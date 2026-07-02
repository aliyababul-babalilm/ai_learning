"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleResume(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setLoginError("No learner profile was found for that email.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name || "");
      localStorage.setItem("userEmail", data.user.email);
      router.push("/dashboard");
    } catch {
      setLoginError("Could not load that profile. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="py-5">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-display">B</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Bab Al Ilm
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center -mt-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-xs font-medium text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            AI Mastery Programme
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-6">
            Master AI for
            <br />
            <span className="bg-gradient-to-r from-accent-strong to-accent bg-clip-text text-transparent">
              Your Work
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Interactive, personalized training that teaches you to use AI
            effectively in your specific job role. Practice real techniques
            and receive instant, expert-level feedback.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/onboarding"
              className="btn-primary text-white text-base px-8 py-3.5 rounded-xl"
              style={{ color: 'white' }}
            >
              Begin Your Training
            </Link>

            <form onSubmit={handleResume} className="w-full max-w-sm glass-card rounded-xl p-4">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Returning learner
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 glass-input rounded-lg px-3 py-2 text-sm min-w-0"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  disabled={loggingIn || !email.trim()}
                  className="btn-secondary text-sm px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loggingIn ? "Loading..." : "Resume"}
                </button>
              </div>
              {loginError && (
                <p className="text-xs text-error mt-2">{loginError}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Prompt Engineering",
                description:
                  "Six essential techniques with hands-on practice and AI-powered feedback on every prompt you write.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
              },
              {
                title: "Claude Skills",
                description:
                  "Build reusable AI prompt templates you can download and use in Claude Desktop for consistent, repeatable results.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                ),
              },
              {
                title: "Claude Projects",
                description:
                  "Set up your Claude Desktop workspace with projects, custom instructions, and an organized knowledge system.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs text-muted/60 font-medium">
            Bab Al Ilm — AI Mastery Programme
          </span>
        </div>
      </footer>
    </div>
  );
}
