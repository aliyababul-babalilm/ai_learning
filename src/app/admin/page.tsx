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

interface LessonProgress {
  id: string;
  status: string;
  userPrompt: string | null;
  aiFeedback: string | null;
  improvedPrompt: string | null;
  finalSkillFile: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  lesson: {
    slug: string;
    title: string;
    module: {
      slug: string;
      title: string;
    };
  };
}

interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  responses: UserResponse[];
  progress: LessonProgress[];
}

interface DepartmentQuestion {
  id: string;
  text: string;
  questionType: string;
  options: string[] | null;
  category: string;
  isRequired: boolean;
  orderIndex: number;
}

interface Department {
  id: string;
  name: string;
  assessmentSections: string[];
  questions: DepartmentQuestion[];
}

interface AssessmentResult {
  id: string;
  section: string;
  scores: Record<string, number> | null;
  compositScore: number | null;
  tier: string | null;
  narrative: string | null;
  completedAt: string | null;
  responses: unknown;
}

interface Company {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  modules: string[];
  companyContext: string | null;
  questions: Question[];
  users: User[];
  _count?: { questions: number; users: number };
}
export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [verifying, setVerifying] = useState(false);

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
  const [editModules, setEditModules] = useState<string[]>(["learning"]);
  const [editCompanyContext, setEditCompanyContext] = useState("");
  const [saving, setSaving] = useState(false);

  // Departments
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showNewDept, setShowNewDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptQuestions, setNewDeptQuestions] = useState<
    { text: string; questionType: string; options: string; category: string; isRequired: boolean }[]
  >([]);

  // Assessment results
  const [assessmentUsers, setAssessmentUsers] = useState<
    { userId: string; userName: string; email: string; assessments: AssessmentResult[] }[]
  >([]);

  // Admin tabs
  const [activeTab, setActiveTab] = useState<"details" | "questions" | "departments" | "learners" | "assessments">("details");

  async function verifyPassword(pass: string): Promise<boolean> {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    const savedPass = sessionStorage.getItem("admin_password");
    if (savedPass) {
      verifyPassword(savedPass).then((valid) => {
        if (valid) {
          setIsAuthorized(true);
          fetchCompanies();
        } else {
          sessionStorage.removeItem("admin_password");
        }
        setCheckingAuth(false);
      });
    } else {
      setCheckingAuth(false);
    }
  }, []);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setAuthError("");
    const isValid = await verifyPassword(password);
    if (isValid) {
      sessionStorage.setItem("admin_password", password);
      setIsAuthorized(true);
      fetchCompanies();
    } else {
      setAuthError("Incorrect password");
    }
    setVerifying(false);
    setCheckingAuth(false);
  }

  const fetchDepartments = useCallback(async (companyId: string) => {
    try {
      const res = await fetch(`/api/companies/${companyId}/departments`);
      const data = await res.json();
      setDepartments(data);
    } catch {
      console.error("Failed to fetch departments");
    }
  }, []);

  const fetchAssessmentResults = useCallback(async (companyId: string) => {
    try {
      const res = await fetch(`/api/companies/${companyId}`);
      const data = await res.json();
      const usersWithAssessments = await Promise.all(
        (data.users || []).map(async (user: User) => {
          const aRes = await fetch(`/api/assessment?userId=${user.id}`);
          const aData = await aRes.json();
          return {
            userId: user.id,
            userName: user.name || "Unnamed",
            email: user.email,
            assessments: aData.assessments || [],
          };
        })
      );
      setAssessmentUsers(
        usersWithAssessments.filter((u: { assessments: AssessmentResult[] }) => u.assessments.length > 0)
      );
    } catch {
      console.error("Failed to fetch assessment results");
    }
  }, []);

  const fetchCompanyDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/companies/${id}`);
      const data = await res.json();
      setSelectedCompany(data);
      setEditName(data.name);
      setEditDescription(data.description || "");
      setEditIndustry(data.industry || "");
      setEditModules(data.modules || ["learning"]);
      setEditCompanyContext(data.companyContext || "");
      fetchDepartments(id);
      fetchAssessmentResults(id);
    } catch {
      console.error("Failed to fetch company detail");
    }
  }, [fetchDepartments, fetchAssessmentResults]);

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
      // Save modules and context separately
      await fetch(`/api/companies/${selectedId}/modules`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modules: editModules,
          companyContext: editCompanyContext,
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

  async function createDepartment() {
    if (!selectedId || !newDeptName.trim()) return;
    try {
      const questions = newDeptQuestions.map((q, i) => ({
        text: q.text,
        questionType: q.questionType,
        options: q.questionType !== "text" && q.options ? q.options.split(",").map((o: string) => o.trim()) : null,
        category: q.category,
        isRequired: q.isRequired,
        orderIndex: i,
      }));
      const res = await fetch(`/api/companies/${selectedId}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDeptName, questions }),
      });
      if (res.ok) {
        setNewDeptName("");
        setNewDeptQuestions([]);
        setShowNewDept(false);
        fetchDepartments(selectedId);
      } else {
        alert("Failed to create department");
      }
    } catch {
      alert("Failed to create department");
    }
  }

  async function deleteDepartment(deptId: string) {
    if (!selectedId || !confirm("Delete this department and all its questions?")) return;
    try {
      await fetch(`/api/companies/${selectedId}/departments/${deptId}`, { method: "DELETE" });
      fetchDepartments(selectedId);
    } catch {
      alert("Failed to delete department");
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Checking authorization...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f5f8] px-4">
        <div className="max-w-md w-full glass-strong rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted mt-2">Enter password to access the administrator panel</p>
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-xs font-medium" style={{ color: '#dc2626' }}>
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={verifying}
              className="w-full btn-primary py-3 rounded-xl font-semibold text-white disabled:opacity-40"
              style={{ color: 'white' }}
            >
              {verifying ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
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
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-1 border-b border-border/50 pb-0">
                {(
                  [
                    { key: "details", label: "Details" },
                    { key: "questions", label: "Questions" },
                    { key: "departments", label: "Departments" },
                    { key: "learners", label: "Learner Work" },
                    { key: "assessments", label: "Assessment Results" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                      activeTab === tab.key
                        ? "border-accent text-accent"
                        : "border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Company Details Tab */}
              {activeTab === "details" && (
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

                  {/* Module Provisioning */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Provisioned Modules
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editModules.includes("learning")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditModules([...editModules, "learning"]);
                            } else {
                              setEditModules(editModules.filter((m) => m !== "learning"));
                            }
                          }}
                          className="rounded border-border"
                        />
                        AI Learning
                      </label>
                      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editModules.includes("assessment")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditModules([...editModules, "assessment"]);
                            } else {
                              setEditModules(editModules.filter((m) => m !== "assessment"));
                            }
                          }}
                          className="rounded border-border"
                        />
                        AI Assessment
                      </label>
                    </div>
                  </div>

                  {/* Company Context */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground mb-1">
                      Company Context
                    </label>
                    <p className="text-xs text-muted mb-2">
                      Background info about the company used to contextualize AI-generated questions and assessments.
                    </p>
                    <textarea
                      value={editCompanyContext}
                      onChange={(e) => setEditCompanyContext(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-sm h-28 resize-none"
                      placeholder="E.g., 'A multinational commodity trading firm with 500 employees, trading in metals and energy...'"
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
              )}

              {/* Questions Tab */}
              {activeTab === "questions" && (
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
              )}

              {/* Departments Tab */}
              {activeTab === "departments" && (
              <section className="glass-strong rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Department Templates
                  </h2>
                  <button
                    onClick={() => setShowNewDept(!showNewDept)}
                    className="text-xs text-accent hover:text-accent-strong font-medium transition-colors"
                  >
                    + Add Department
                  </button>
                </div>

                {showNewDept && (
                  <div className="mb-6 p-4 glass-card rounded-xl space-y-3">
                    <input
                      type="text"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      placeholder="Department name (e.g., Trading, Finance, HR)"
                      className="w-full glass-input rounded-lg px-3 py-2 text-sm"
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                          Questions
                        </span>
                        <button
                          onClick={() =>
                            setNewDeptQuestions([
                              ...newDeptQuestions,
                              { text: "", questionType: "text", options: "", category: "role_context", isRequired: true },
                            ])
                          }
                          className="text-xs text-accent hover:text-accent-strong font-medium"
                        >
                          + Add Question
                        </button>
                      </div>

                      {newDeptQuestions.map((q, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/70 border border-border/50 space-y-2">
                          <input
                            type="text"
                            value={q.text}
                            onChange={(e) => {
                              const updated = [...newDeptQuestions];
                              updated[i] = { ...updated[i], text: e.target.value };
                              setNewDeptQuestions(updated);
                            }}
                            placeholder="Question text"
                            className="w-full glass-input rounded-lg px-2.5 py-1.5 text-sm"
                          />
                          <div className="flex gap-2 flex-wrap">
                            <select
                              value={q.questionType}
                              onChange={(e) => {
                                const updated = [...newDeptQuestions];
                                updated[i] = { ...updated[i], questionType: e.target.value };
                                setNewDeptQuestions(updated);
                              }}
                              className="glass-input rounded-lg px-2 py-1 text-xs"
                            >
                              <option value="text">Text</option>
                              <option value="single-select">Single Select</option>
                              <option value="multi-select">Multi Select</option>
                              <option value="likert">Likert Scale</option>
                            </select>
                            <select
                              value={q.category}
                              onChange={(e) => {
                                const updated = [...newDeptQuestions];
                                updated[i] = { ...updated[i], category: e.target.value };
                                setNewDeptQuestions(updated);
                              }}
                              className="glass-input rounded-lg px-2 py-1 text-xs"
                            >
                              <option value="role_context">Role Context</option>
                              <option value="data_maturity">Data Maturity</option>
                              <option value="ai_skills">AI Skills</option>
                              <option value="workflow">Workflow</option>
                            </select>
                            <label className="flex items-center gap-1 text-xs text-muted cursor-pointer">
                              <input
                                type="checkbox"
                                checked={q.isRequired}
                                onChange={(e) => {
                                  const updated = [...newDeptQuestions];
                                  updated[i] = { ...updated[i], isRequired: e.target.checked };
                                  setNewDeptQuestions(updated);
                                }}
                              />
                              Required
                            </label>
                            <button
                              onClick={() => setNewDeptQuestions(newDeptQuestions.filter((_, j) => j !== i))}
                              className="text-xs text-error/60 hover:text-error"
                            >
                              Remove
                            </button>
                          </div>
                          {q.questionType !== "text" && (
                            <input
                              type="text"
                              value={q.options}
                              onChange={(e) => {
                                const updated = [...newDeptQuestions];
                                updated[i] = { ...updated[i], options: e.target.value };
                                setNewDeptQuestions(updated);
                              }}
                              placeholder="Options (comma-separated)"
                              className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={createDepartment} className="btn-primary text-xs py-1.5 px-3">
                        Create Department
                      </button>
                      <button onClick={() => { setShowNewDept(false); setNewDeptQuestions([]); }} className="text-xs text-muted hover:text-foreground">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {departments.length === 0 ? (
                  <p className="text-sm text-muted py-4">
                    No department templates yet. Add one to define department-specific assessment questions.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {departments.map((dept) => (
                      <details key={dept.id} className="glass-card rounded-xl p-4">
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{dept.name}</h3>
                              <span className="text-xs text-muted">{dept.questions.length} questions</span>
                              {dept.assessmentSections.length > 0 && (
                                <span className="text-xs text-accent ml-2">
                                  Sections: {dept.assessmentSections.join(", ")}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.preventDefault(); deleteDepartment(dept.id); }}
                              className="text-xs text-error/60 hover:text-error transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </summary>
                        <div className="mt-3 space-y-3">
                          {/* Assessment Sections */}
                          <div className="rounded-lg bg-white/70 border border-border/50 p-3">
                            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                              Required Assessment Sections
                            </p>
                            <p className="text-xs text-muted mb-2">
                              Override AI inference — define which sections users in this department must complete.
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <label className="flex items-center gap-1.5 text-xs text-muted cursor-not-allowed">
                                <input type="checkbox" checked disabled className="rounded border-border" />
                                Personal AI
                              </label>
                              {[
                                { key: "data_maturity", label: "Data Maturity" },
                                { key: "company_ai", label: "Company AI" },
                              ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={dept.assessmentSections.includes(key)}
                                    onChange={async (e) => {
                                      const newSections = e.target.checked
                                        ? [...dept.assessmentSections, key]
                                        : dept.assessmentSections.filter((s) => s !== key);
                                      try {
                                        await fetch(`/api/companies/${selectedId}/departments/${dept.id}`, {
                                          method: "PATCH",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ assessmentSections: newSections }),
                                        });
                                        if (selectedId) fetchDepartments(selectedId);
                                      } catch {
                                        alert("Failed to update assessment sections");
                                      }
                                    }}
                                    className="rounded border-border"
                                  />
                                  {label}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Questions */}
                          {dept.questions.map((q) => (
                            <div key={q.id} className="rounded-lg bg-white/70 border border-border/50 p-3">
                              <p className="text-sm text-foreground">{q.text}</p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-[11px] text-accent font-medium">{q.questionType}</span>
                                <span className="text-[11px] text-muted">{q.category}</span>
                                {!q.isRequired && <span className="text-[11px] text-muted">(optional)</span>}
                              </div>
                              {q.options && (
                                <p className="text-xs text-muted mt-1">
                                  Options: {Array.isArray(q.options) ? (q.options as string[]).join(", ") : String(q.options)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </section>
              )}

              {/* Learner Work Tab */}
              {activeTab === "learners" && (
              <section className="glass-strong rounded-xl p-6">
                <div className="mb-5">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Learner Work
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    Interview answers plus each learner&apos;s latest saved lesson draft, feedback, improved prompt, and generated files.
                  </p>
                </div>
                {selectedCompany.users.length === 0 ? (
                  <p className="text-sm text-muted">
                    No users have completed onboarding yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedCompany.users.map((user) => {
                      const submittedCount = user.progress.filter((p) => p.status === "completed").length;
                      const draftCount = user.progress.filter((p) => p.status === "in_progress").length;

                      return (
                        <details
                          key={user.id}
                          className="glass-card rounded-xl p-4 group"
                        >
                          <summary className="cursor-pointer list-none">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div>
                                <h3 className="font-display text-lg font-bold text-foreground">
                                  {user.name || "Unnamed learner"}
                                </h3>
                                <p className="text-sm text-muted">{user.email}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
                                  {user.responses.length} interview answers
                                </span>
                                <span className="px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">
                                  {submittedCount} submitted lessons
                                </span>
                                <span className="px-2.5 py-1 rounded-full bg-border/40 text-muted font-medium">
                                  {draftCount} saved drafts
                                </span>
                                <span className="text-muted">
                                  Joined {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </summary>

                          <div className="mt-5 grid gap-5">
                            <div>
                              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                                Interview Answers
                              </h4>
                              {user.responses.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-2">
                                  {user.responses.map((r) => (
                                    <div
                                      key={r.id}
                                      className="rounded-lg bg-white/70 border border-border/50 p-3"
                                    >
                                      <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-1">
                                        {r.category}
                                      </div>
                                      <p className="text-sm text-foreground leading-relaxed">
                                        {r.answer}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted">No interview answers saved.</p>
                              )}
                            </div>

                            <div>
                              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                                Lesson Work
                              </h4>
                              {user.progress.length > 0 ? (
                                <div className="space-y-3">
                                  {user.progress.map((p) => (
                                    <details
                                      key={p.id}
                                      className="rounded-xl border border-border/60 bg-white/70 p-4"
                                    >
                                      <summary className="cursor-pointer list-none">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                          <div>
                                            <div className="text-[11px] font-semibold text-accent uppercase tracking-wider">
                                              {p.lesson.module.title}
                                            </div>
                                            <h5 className="font-semibold text-foreground">
                                              {p.lesson.title}
                                            </h5>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-2 text-xs">
                                            {typeof p.score === "number" && (
                                              <span className="px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                                                Score {p.score}
                                              </span>
                                            )}
                                            <span className="px-2 py-1 rounded-full bg-border/40 text-muted font-medium">
                                              {p.status.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-muted">
                                              Updated {new Date(p.updatedAt).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>
                                      </summary>

                                      <div className="mt-4 space-y-3">
                                        {p.userPrompt && (
                                          <div>
                                            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                                              Learner Prompt / Draft
                                            </div>
                                            <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed rounded-lg bg-border/20 border border-border/40 p-3 max-h-56 overflow-y-auto">
                                              {p.userPrompt}
                                            </pre>
                                          </div>
                                        )}

                                        {p.aiFeedback && (
                                          <div>
                                            <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-1">
                                              AI Feedback
                                            </div>
                                            <p className="text-sm text-foreground leading-relaxed rounded-lg bg-accent/5 border border-accent/20 p-3 whitespace-pre-line">
                                              {p.aiFeedback}
                                            </p>
                                          </div>
                                        )}

                                        {p.improvedPrompt && (
                                          <div>
                                            <div className="text-[11px] font-semibold text-success uppercase tracking-wider mb-1">
                                              Improved Prompt
                                            </div>
                                            <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed rounded-lg bg-success/5 border border-success/20 p-3 max-h-56 overflow-y-auto">
                                              {p.improvedPrompt}
                                            </pre>
                                          </div>
                                        )}

                                        {p.finalSkillFile && (
                                          <div>
                                            <div className="text-[11px] font-semibold text-success uppercase tracking-wider mb-1">
                                              Generated Skill File
                                            </div>
                                            <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed rounded-lg bg-success/5 border border-success/20 p-3 max-h-56 overflow-y-auto">
                                              {p.finalSkillFile}
                                            </pre>
                                          </div>
                                        )}
                                      </div>
                                    </details>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted">No lesson work saved yet.</p>
                              )}
                            </div>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                )}
              </section>
              )}

              {/* Assessment Results Tab */}
              {activeTab === "assessments" && (
              <section className="glass-strong rounded-xl p-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Assessment Results
                </h2>
                {assessmentUsers.length === 0 ? (
                  <p className="text-sm text-muted py-4">
                    No users have completed any assessment sections yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {assessmentUsers.map((au) => (
                      <details key={au.userId} className="glass-card rounded-xl p-4">
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{au.userName}</h3>
                              <span className="text-xs text-muted">{au.email}</span>
                            </div>
                            <div className="flex gap-2">
                              {au.assessments.map((a) => (
                                <span
                                  key={a.id}
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    a.completedAt
                                      ? "bg-success/10 text-success"
                                      : "bg-border/40 text-muted"
                                  }`}
                                >
                                  {a.section.replace(/_/g, " ")}
                                  {a.compositScore != null && `: ${a.compositScore}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </summary>
                        <div className="mt-4 space-y-3">
                          {au.assessments.map((a) => (
                            <div key={a.id} className="rounded-lg bg-white/70 border border-border/50 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-foreground capitalize">
                                  {a.section.replace(/_/g, " ")}
                                </span>
                                <div className="flex gap-2 text-xs">
                                  {a.tier && (
                                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                                      {a.tier}
                                    </span>
                                  )}
                                  {a.compositScore != null && (
                                    <span className="text-muted">Score: {a.compositScore}</span>
                                  )}
                                </div>
                              </div>
                              {a.narrative && (
                                <p className="text-sm text-muted leading-relaxed mb-2 whitespace-pre-line">
                                  {a.narrative}
                                </p>
                              )}
                              {a.scores && (
                                <div className="grid grid-cols-2 gap-1">
                                  {Object.entries(a.scores as Record<string, number>).map(([key, val]) => (
                                    <div key={key} className="text-xs text-muted">
                                      <span className="font-medium">{key}:</span> {val}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <details className="mt-2">
                                <summary className="text-xs text-accent cursor-pointer">
                                  View raw responses
                                </summary>
                                <pre className="mt-1 text-xs text-muted font-mono bg-border/20 rounded-lg p-2 max-h-40 overflow-y-auto whitespace-pre-wrap">
                                  {JSON.stringify(a.responses, null, 2)}
                                </pre>
                              </details>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </section>
              )}
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
