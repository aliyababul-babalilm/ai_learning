"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Question {
  id: string;
  text: string;
  category: string;
  orderIndex: number;
  isApproved: boolean;
}

interface UserResponse {
  id: string;
  category: string;
  answer: string;
  questionId: string | null;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  responses: UserResponse[];
}

interface Company {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  questions: Question[];
  users: User[];
  _count?: { questions: number; users: number };
}

export default function AdminPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // New company form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  // Edit fields
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanyDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/companies/${id}`);
      const data = await res.json();
      setSelectedCompany(data);
      setEditName(data.name);
      setEditDescription(data.description || "");
      setEditIndustry(data.industry || "");
    } catch {
      console.error("Failed to fetch company detail");
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchCompanyDetail(selectedId);
    }
  }, [selectedId, fetchCompanyDetail]);

  async function fetchCompanies() {
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  async function createCompany() {
    if (!newName.trim()) return;
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          industry: newIndustry,
        }),
      });
      if (res.ok) {
        setNewName("");
        setNewDescription("");
        setNewIndustry("");
        setShowNewForm(false);
        fetchCompanies();
      }
    } catch {
      alert("Failed to create company");
    }
  }

  async function saveCompany() {
    if (!selectedId) return;
    setSaving(true);
    try {
      await fetch(`/api/companies/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          industry: editIndustry,
        }),
      });
      fetchCompanies();
      fetchCompanyDetail(selectedId);
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function generateQuestions() {
    if (!selectedId) return;
    setGenerating(true);
    try {
      const res = await fetch(
        `/api/companies/${selectedId}/questions/generate`,
        { method: "POST" }
      );
      if (res.ok) {
        fetchCompanyDetail(selectedId);
      } else {
        alert("Failed to generate questions");
      }
    } catch {
      alert("Failed to generate questions");
    } finally {
      setGenerating(false);
    }
  }

  async function toggleApproval(questionId: string, currentlyApproved: boolean) {
    try {
      await fetch(`/api/admin/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentlyApproved }),
      });
      if (selectedId) fetchCompanyDetail(selectedId);
    } catch {
      alert("Failed to update question");
    }
  }

  async function deleteQuestion(questionId: string) {
    if (!confirm("Delete this question?")) return;
    try {
      await fetch(`/api/admin/questions/${questionId}`, { method: "DELETE" });
      if (selectedId) fetchCompanyDetail(selectedId);
    } catch {
      alert("Failed to delete question");
    }
  }

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
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted font-medium">Admin Dashboard</span>
            <Link href="/learn" className="text-xs text-accent hover:text-accent-strong font-medium transition-colors">
              View Platform
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar: Companies */}
        <aside className="w-72 border-r border-border/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
              Companies
            </h2>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="text-xs text-accent hover:text-accent-strong font-medium transition-colors"
            >
              + Add
            </button>
          </div>

          {showNewForm && (
            <div className="mb-4 p-3 glass-card rounded-xl space-y-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Company name"
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-sm"
              />
              <input
                type="text"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Industry"
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-sm"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description"
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-sm h-16 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={createCompany}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewForm(false)}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedId === c.id
                    ? "bg-accent/5 border border-accent/20 text-foreground font-medium"
                    : "text-foreground hover:bg-border/20"
                }`}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted">
                  {c._count?.users || 0} users &middot;{" "}
                  {c._count?.questions || 0} questions
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {selectedCompany ? (
            <div className="space-y-8">
              {/* Company details */}
              <section className="glass-strong rounded-xl p-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Company Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={editIndustry}
                      onChange={(e) => setEditIndustry(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-sm h-20 resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={saveCompany}
                  disabled={saving}
                  className="btn-primary mt-4 text-sm disabled:opacity-40"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </section>

              {/* Questions */}
              <section className="glass-strong rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Onboarding Questions
                  </h2>
                  <button
                    onClick={generateQuestions}
                    disabled={generating}
                    className="btn-primary text-sm disabled:opacity-40"
                  >
                    {generating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      "Generate Questions"
                    )}
                  </button>
                </div>

                {selectedCompany.questions.length === 0 ? (
                  <p className="text-sm text-muted py-4">
                    No questions yet. Click &quot;Generate Questions&quot; to
                    create AI-generated onboarding questions tailored to this company.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedCompany.questions.map((q) => (
                      <div
                        key={q.id}
                        className={`glass-card rounded-xl p-4 flex items-start gap-3 ${
                          q.isApproved
                            ? "border-success/30 bg-success/5"
                            : ""
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{q.text}</p>
                          <span className="text-xs text-muted mt-1 inline-block">
                            Category: {q.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleApproval(q.id, q.isApproved)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${
                              q.isApproved
                                ? "bg-success/10 border-success/30 text-success"
                                : "border-border text-muted hover:border-accent/30 hover:text-accent"
                            }`}
                          >
                            {q.isApproved ? "Approved" : "Approve"}
                          </button>
                          <button
                            onClick={() => deleteQuestion(q.id)}
                            className="text-xs text-error/60 hover:text-error transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* User Responses */}
              <section className="glass-strong rounded-xl p-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  User Responses
                </h2>
                {selectedCompany.users.length === 0 ? (
                  <p className="text-sm text-muted">
                    No users have completed onboarding yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-2 px-3 text-muted font-semibold text-xs uppercase tracking-wider">
                            User
                          </th>
                          <th className="text-left py-2 px-3 text-muted font-semibold text-xs uppercase tracking-wider">
                            Email
                          </th>
                          <th className="text-left py-2 px-3 text-muted font-semibold text-xs uppercase tracking-wider">
                            Responses
                          </th>
                          <th className="text-left py-2 px-3 text-muted font-semibold text-xs uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCompany.users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-border/30"
                          >
                            <td className="py-2.5 px-3 font-medium text-foreground">
                              {user.name || "---"}
                            </td>
                            <td className="py-2.5 px-3 text-muted">
                              {user.email}
                            </td>
                            <td className="py-2.5 px-3">
                              {user.responses.length > 0 ? (
                                <details className="cursor-pointer">
                                  <summary className="text-accent text-xs hover:text-accent-strong font-medium">
                                    {user.responses.length} responses
                                  </summary>
                                  <div className="mt-2 space-y-1">
                                    {user.responses.map((r) => (
                                      <div
                                        key={r.id}
                                        className="text-xs bg-border/20 rounded-lg p-2"
                                      >
                                        <span className="font-semibold text-foreground">
                                          {r.category}:
                                        </span>{" "}
                                        <span className="text-muted">{r.answer}</span>
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              ) : (
                                <span className="text-muted text-xs">
                                  None
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-muted">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-border/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-sm">Select a company from the sidebar to manage its onboarding configuration.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
