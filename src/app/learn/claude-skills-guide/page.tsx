"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClaudeSkillsGuidePage() {
  const [activeStep, setActiveStep] = useState<"install" | "chat">("install");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent/20">
      {/* Header */}
      <header className="py-5 border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link href="/learn" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b1220] to-[#0369a1] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-display">B</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Bab Al Ilm
            </span>
          </Link>
          <Link
            href="/learn/claude-skills/download-and-use"
            className="text-sm text-accent hover:text-accent-strong transition-colors font-semibold flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lesson
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        {/* Intro */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
            Desktop Integration
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Claude Desktop Custom Skills Guide
          </h1>
          <p className="text-muted text-base max-w-2xl leading-relaxed">
            Follow this interactive visual guide to learn how to add your downloaded <code className="font-mono text-sm px-1.5 py-0.5 bg-muted rounded text-accent">.skill</code> files into Claude Desktop and call them seamlessly from your chats.
          </p>
        </div>

        {/* Interactive Steps Toggles */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-border/20 rounded-xl mb-8">
          <button
            onClick={() => setActiveStep("install")}
            className={`py-3 px-4 rounded-lg font-display text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeStep === "install"
                ? "bg-white shadow-sm text-foreground animate-none"
                : "text-muted hover:text-foreground"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-mono font-bold">1</span>
            Importing the Skill File
          </button>
          <button
            onClick={() => setActiveStep("chat")}
            className={`py-3 px-4 rounded-lg font-display text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeStep === "chat"
                ? "bg-white shadow-sm text-foreground animate-none"
                : "text-muted hover:text-foreground"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-mono font-bold">2</span>
            Triggering from Chat
          </button>
        </div>

        {/* Visual Mockups Container */}
        <div className="mb-10 animate-fade-in">
          {activeStep === "install" ? (
            <div className="space-y-8">
              {/* Step 1 Instructions */}
              <div className="glass-card rounded-2xl p-6 border-l-4 border-accent">
                <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2 text-foreground">
                  Step 1: Adding Custom Skills in Settings
                </h2>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  Open Claude Desktop, navigate to Settings, select the <strong>Skills</strong> tab, and import the downloaded skill. Claude compiles the structure to activate it whenever its trigger words appear.
                </p>
                <div className="text-xs text-muted flex flex-wrap gap-x-4 gap-y-1">
                  <span>💡 <strong>Quick Shortcut:</strong> Save files directly to <code className="bg-muted px-1.5 py-0.5 rounded text-accent">~/.claude/skills/</code></span>
                </div>
              </div>

              {/* CSS macOS Window Mockup (Import UI) */}
              <div className="w-full bg-[#1e1e1f] rounded-2xl shadow-2xl border border-white/10 overflow-hidden font-sans">
                {/* macOS Titlebar */}
                <div className="bg-[#2d2d2f] px-4 py-3 flex items-center border-b border-black/20">
                  <div className="flex gap-1.5 mr-4">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium mx-auto -ml-10">Claude Settings</span>
                </div>

                {/* Main Settings Panel */}
                <div className="flex min-h-[420px] bg-[#1e1e1f] flex-col sm:flex-row">
                  {/* Left Sidebar */}
                  <div className="w-full sm:w-48 bg-[#252526] p-3 border-r border-black/20 flex flex-row sm:flex-col gap-1 text-sm text-slate-300 overflow-x-auto sm:overflow-x-visible">
                    <div className="px-2 py-1.5 rounded hover:bg-[#333334] cursor-pointer whitespace-nowrap">General</div>
                    <div className="px-2 py-1.5 rounded hover:bg-[#333334] cursor-pointer whitespace-nowrap">Profiles</div>
                    <div className="px-2 py-1.5 rounded hover:bg-[#333334] cursor-pointer whitespace-nowrap">Extensions</div>
                    <div className="px-2 py-1.5 rounded bg-[#cc522b]/15 text-[#f27a54] font-semibold whitespace-nowrap">Skills</div>
                    <div className="px-2 py-1.5 rounded hover:bg-[#333334] cursor-pointer whitespace-nowrap">Developer</div>
                  </div>

                  {/* Right Main Panel */}
                  <div className="flex-1 p-6 text-slate-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">Custom Skills</h3>
                        <p className="text-xs text-slate-400">Manage custom instructions and automated workflows</p>
                      </div>
                      <button className="bg-[#cc522b] hover:bg-[#b04522] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow transition-colors self-start sm:self-auto">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Import Skill
                      </button>
                    </div>

                    {/* Skill Cards / List */}
                    <div className="space-y-3">
                      <div className="bg-[#2d2d2f] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">Market Morning Brief</span>
                            <span className="bg-[#cc522b]/20 text-[#f27a54] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">v1.0</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 max-w-md">
                            Generates a daily structured commodities morning brief from raw overnight reports and price tables.
                          </p>
                          <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mt-3">
                            <span>Trigger: <code className="bg-black/30 px-1 py-0.5 rounded text-[#f27a54]">"morning brief"</code></span>
                            <span>•</span>
                            <span>File: <code className="bg-black/30 px-1 py-0.5 rounded text-slate-300">market-morning-brief.skill</code></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] text-emerald-400 font-semibold uppercase">Active</span>
                        </div>
                      </div>

                      {/* Drop Zone / Empty Slot */}
                      <div className="border border-dashed border-slate-700/60 rounded-xl p-8 text-center bg-[#252526]/50 hover:bg-[#252526] transition-colors cursor-pointer group">
                        <svg className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="block text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors">Drag and drop your downloaded skill here</span>
                        <span className="block text-[11px] text-slate-500 mt-1">Supports .skill, .md, or .json formats</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Step 2 Instructions */}
              <div className="glass-card rounded-2xl p-6 border-l-4 border-accent">
                <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2 text-foreground">
                  Step 2: Triggering and Running Your Skill
                </h2>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  Whenever you open a chat session, you don't need to specify prompt rules manually. Simply use your trigger phrase (e.g., <strong>&quot;morning brief&quot;</strong> or paste your raw overnight data), and Claude Desktop instantly triggers the custom skill, responding in your desired format.
                </p>
                <div className="text-xs text-muted">
                  💡 <strong>Pro Tip:</strong> Claude detects the skill intent dynamically. If you supply data, it executes the template structured layout.
                </div>
              </div>

              {/* CSS macOS Window Mockup (Chat UI) */}
              <div className="w-full bg-[#19191a] rounded-2xl shadow-2xl border border-white/10 overflow-hidden font-sans">
                {/* macOS Titlebar */}
                <div className="bg-[#222223] px-4 py-3 flex items-center border-b border-black/20">
                  <div className="flex gap-1.5 mr-4">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium mx-auto -ml-10">Claude 3.5 Sonnet</span>
                </div>

                {/* Chat Contents */}
                <div className="p-4 sm:p-6 space-y-6 min-h-[460px] flex flex-col justify-between">
                  <div className="space-y-5">
                    {/* User message */}
                    <div className="flex items-start justify-end gap-3">
                      <div className="max-w-[85%] sm:max-w-[75%] bg-[#cc522b] text-white rounded-2xl px-4 py-3 text-sm shadow">
                        <p className="font-semibold text-[10px] text-white/80 mb-1 tracking-wider">YOU</p>
                        <p className="leading-relaxed">
                          Please prepare the <strong className="underline">morning brief</strong> with these overnight numbers:<br />
                          Brent Crude closed 81.42 (+1.2%), Gold 2420 (-0.5%), HH Natural Gas 2.15 (+3.4%). Catalysts include Middle East supply worries and a US crude draw.
                        </p>
                      </div>
                    </div>

                    {/* Claude message response */}
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-lg bg-[#cc522b]/20 flex items-center justify-center text-[#f27a54] font-bold text-xs flex-shrink-0">
                        C
                      </div>
                      <div className="flex-1 bg-[#232324] border border-white/5 rounded-2xl px-4 py-4 sm:px-5 text-sm text-slate-200 shadow-md overflow-hidden">
                        {/* Dynamic loading indicator */}
                        <div className="flex items-center gap-2 mb-3 bg-[#cc522b]/15 border border-[#cc522b]/30 rounded-lg px-2.5 py-1 w-fit">
                          <span className="w-2 h-2 rounded-full bg-[#f27a54] animate-ping" />
                          <span className="text-[10px] font-semibold text-[#f27a54] uppercase tracking-wider">Skill Active: Market Morning Brief</span>
                        </div>

                        <h4 className="text-white font-bold text-sm border-b border-slate-700/50 pb-1.5 mb-3 uppercase tracking-wider">DAILY TRADING BRIEF</h4>
                        
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full text-xs text-left">
                            <thead>
                              <tr className="text-slate-400 border-b border-slate-700/40">
                                <th className="pb-1.5 font-semibold">Commodity</th>
                                <th className="pb-1.5 font-semibold">Close</th>
                                <th className="pb-1.5 font-semibold text-right">Change</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-800">
                                <td className="py-1.5 text-white font-medium">Brent Crude</td>
                                <td className="py-1.5">$81.42</td>
                                <td className="py-1.5 text-emerald-400 text-right">+1.2%</td>
                              </tr>
                              <tr className="border-b border-slate-800">
                                <td className="py-1.5 text-white font-medium">Gold</td>
                                <td className="py-1.5">$2,420.00</td>
                                <td className="py-1.5 text-rose-400 text-right">-0.5%</td>
                              </tr>
                              <tr>
                                <td className="py-1.5 text-white font-medium">Henry Hub NG</td>
                                <td className="py-1.5">$2.15</td>
                                <td className="py-1.5 text-emerald-400 text-right">+3.4%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <h5 className="font-semibold text-xs text-slate-300 mb-1">Key Market Drivers</h5>
                        <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 mb-4">
                          <li><strong className="text-slate-200">Supply Pressures:</strong> Increased regional premium pushing WTI/Brent margins.</li>
                          <li><strong className="text-slate-200">US Inventories:</strong> API data confirms drawdown leading to short cover.</li>
                        </ul>

                        <h5 className="font-semibold text-xs text-slate-300 mb-1">Technical Verdict</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Brent crude maintains support above $80.00 target. Short-term momentum remains bullish targeting $83.50. Risk managers note natural gas volatility is elevated.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="bg-[#252526] border border-white/5 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 mt-4">
                    <span>Ask Claude a question or type a trigger...</span>
                    <div className="flex gap-2">
                      <span className="px-1.5 py-0.5 bg-black/30 rounded text-[10px]">⌘ Enter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="text-center sm:text-right">
          <Link
            href="/learn/claude-skills/download-and-use"
            className="btn-primary inline-flex items-center gap-2 text-white"
            style={{ color: "white" }}
          >
            I am Ready to Download My Skill File
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50 bg-background/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs text-muted/60 font-medium">
            Bab Al Ilm — AI Mastery Programme
          </span>
        </div>
      </footer>
    </div>
  );
}
