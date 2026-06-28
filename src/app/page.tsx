import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            AI Learning Platform
          </div>
          <Link
            href="/admin"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Master AI with Hands-On Training
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Interactive, personalized learning that teaches you to use AI
            effectively in your specific job role. Practice real techniques and
            get instant AI feedback.
          </p>
          <Link
            href="/onboarding"
            className="btn-accent text-lg px-8 py-3 rounded-lg font-semibold"
          >
            Start Learning
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-bg">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-primary mb-12">
            What You Will Learn
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Prompt Engineering
              </h3>
              <p className="text-text-secondary">
                Master six essential techniques — from setting roles to chain of
                thought reasoning — with hands-on practice and AI-powered
                feedback on every prompt you write.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Claude Desktop Setup
              </h3>
              <p className="text-text-secondary">
                Configure Claude Desktop as your personal AI workspace — create
                projects, write custom instructions, organize conversations, and
                optimize for daily use.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Personalized to Your Job
              </h3>
              <p className="text-text-secondary">
                Every exercise is tailored to your industry, role, and daily
                tasks. Practice with prompts relevant to your actual work — not
                generic examples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Transform How You Use AI?
          </h2>
          <p className="text-white/70 mb-8">
            Start with a quick onboarding to personalize your learning
            experience.
          </p>
          <Link
            href="/onboarding"
            className="btn-accent text-lg px-8 py-3 rounded-lg font-semibold"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white/60 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          AI Learning Platform — Powered by Bab Al Ilm AI
        </div>
      </footer>
    </div>
  );
}
