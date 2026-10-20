import React, { useState, useEffect } from "react";
import { X, ExternalLink, Cpu, GitBranch, ShieldCheck, Zap, Activity, ChevronRight, Terminal, CheckCircle2, AlertTriangle, Scale, Lock, Server, Sparkles } from "lucide-react";
import { GithubIcon } from "./Icons";
import { PROJECT_CASE_STUDIES } from "../data/projectCaseStudies";

export default function ProjectCaseStudyModal({ projectId, onClose }) {
  const caseStudy = PROJECT_CASE_STUDIES[projectId];
  const [activeTab, setActiveTab] = useState("architecture");
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  // Close on Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!caseStudy) return null;

  const currentStep = caseStudy.pipeline?.[selectedStepIndex] || caseStudy.pipeline?.[0];
  const isSmartCourtroom = caseStudy.id === "smart-courtroom-rag";

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        zIndex: 9999,
        padding: "clamp(12px, 3vw, 28px)",
        animation: "fadeIn 0.25s ease-out"
      }}
    >
      <div 
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          background: "rgba(10, 16, 30, 0.95)",
          border: `1px solid ${caseStudy.badgeColor ? `${caseStudy.badgeColor}55` : "rgba(99, 102, 241, 0.45)"}`,
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.85), 0 0 45px ${caseStudy.badgeColor ? `${caseStudy.badgeColor}25` : "rgba(99, 102, 241, 0.2)"}`,
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Top Header */}
        <div 
          style={{
            padding: "24px 28px 20px 28px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 16, 30, 0.4) 100%)",
            position: "relative"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                <span 
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: "700",
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: caseStudy.badgeColor || "var(--sculk-primary)",
                    background: "rgba(99, 102, 241, 0.12)",
                    border: `1px solid ${caseStudy.badgeColor || "var(--sculk-primary)"}44`,
                    padding: "4px 12px",
                    borderRadius: "20px"
                  }}
                >
                  {caseStudy.badge}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  {caseStudy.stats}
                </span>
              </div>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)", fontWeight: "800", color: "#ffffff", lineHeight: "1.2", margin: 0 }}>
                {caseStudy.title}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px", marginBottom: 0 }}>
                {caseStudy.subtitle}
              </p>
            </div>

            {/* Action buttons + Close */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              {caseStudy.live && (
                <a
                  href={caseStudy.live}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-sculk"
                  style={{ padding: "8px 14px", fontSize: "0.82rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <ExternalLink size={14} />
                  <span className="hide-on-mobile">Live Demo</span>
                </a>
              )}
              {caseStudy.github && (
                <a
                  href={caseStudy.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: "8px 14px", fontSize: "0.82rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  title="View GitHub Code"
                >
                  <GithubIcon size={16} />
                  <span className="hide-on-mobile">Source Code</span>
                </a>
              )}
              <button
                onClick={onClose}
                aria-label="Close Case Study"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  color: "#cbd5e1",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
            {[
              { id: "architecture", label: "Pipeline & Architecture", icon: <Cpu size={15} /> },
              ...(isSmartCourtroom ? [{ id: "grounding", label: "Grounding & Refusal Gate", icon: <ShieldCheck size={15} /> }] : []),
              ...(isSmartCourtroom ? [{ id: "mootcourt", label: "Multi-Agent Moot Court", icon: <Scale size={15} /> }] : []),
              { id: "challenges", label: "Engineering Decisions", icon: <GitBranch size={15} /> },
              { id: "metrics", label: "Evaluation & Benchmarks", icon: <Activity size={15} /> }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? "rgba(99, 102, 241, 0.24)" : "rgba(15, 23, 42, 0.6)",
                    border: isActive ? `1px solid ${caseStudy.badgeColor || "var(--sculk-primary)"}` : "1px solid rgba(148, 163, 184, 0.18)",
                    color: isActive ? "#ffffff" : "var(--text-muted)",
                    padding: "7px 16px",
                    borderRadius: "10px",
                    fontSize: "0.84rem",
                    fontWeight: isActive ? "600" : "500",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span style={{ color: isActive ? (caseStudy.badgeColor || "var(--sculk-primary)") : "inherit" }}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div 
          style={{
            padding: "24px 28px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}
        >
          {/* Executive Problem / Solution Card */}
          <div 
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: "14px",
              padding: "18px 22px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px"
            }}
          >
            <div>
              <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "1px", color: "#f87171", fontWeight: "700", marginBottom: "6px" }}>
                Problem Statement
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
                {caseStudy.overview.problem}
              </p>
            </div>
            <div>
              <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--sculk-cyan)", fontWeight: "700", marginBottom: "6px" }}>
                Architectural Solution
              </div>
              <p style={{ color: "var(--text-main)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
                {caseStudy.overview.solution}
              </p>
            </div>
          </div>

          {/* TAB 1: SYSTEM ARCHITECTURE */}
          {activeTab === "architecture" && (
            <div>
              {/* Documented Pipeline Architecture Flow */}
              {isSmartCourtroom && (
                <div style={{ marginBottom: "26px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
                    <div>
                      <div style={{ color: "var(--sculk-cyan)", fontFamily: "var(--font-mono)", fontSize: ".72rem", letterSpacing: "1px", marginBottom: "4px" }}>
                        DOCUMENTED REPOSITORY PIPELINE
                      </div>
                      <h3 style={{ color: "#fff", fontSize: "1.05rem", margin: 0 }}>
                        Legal Retrieval &amp; Generation Architecture
                      </h3>
                    </div>
                    <span style={{ color: "var(--text-dim)", fontSize: ".78rem", fontFamily: "var(--font-mono)" }}>
                      Input PDFs → Extraction → Hybrid RRF → Rerank → Gate → Groq LLM → Verification
                    </span>
                  </div>

                  {/* Visual Architecture Flow Blocks */}
                  <div 
                    style={{
                      background: "rgba(10, 16, 30, 0.85)",
                      border: "1px solid rgba(56, 189, 248, 0.28)",
                      borderRadius: "14px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      fontFamily: "var(--font-mono)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                      <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "8px 14px", borderRadius: "8px", color: "#e2e8f0", fontSize: "0.82rem" }}>
                        LEGAL JUDGMENTS (PDFs)
                      </div>
                      <span style={{ color: "var(--sculk-cyan)" }}>↓</span>
                      <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "8px 14px", borderRadius: "8px", color: "#e2e8f0", fontSize: "0.82rem" }}>
                        PDF EXTRACTION + CLEANING
                      </div>
                      <span style={{ color: "var(--sculk-cyan)" }}>↓</span>
                      <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "8px 14px", borderRadius: "8px", color: "#e2e8f0", fontSize: "0.82rem" }}>
                        CHUNKING + LEGAL METADATA
                      </div>
                    </div>

                    <div style={{ textAlign: "center", color: "var(--sculk-cyan)", margin: "2px 0" }}>↓</div>

                    {/* Hybrid Retrieval Box */}
                    <div 
                      style={{
                        background: "rgba(14, 25, 48, 0.8)",
                        border: "2px dashed #38bdf8",
                        borderRadius: "12px",
                        padding: "14px 20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <span style={{ color: "#38bdf8", fontWeight: "700", fontSize: "0.82rem", letterSpacing: "1px" }}>
                        HYBRID RETRIEVAL LAYER
                      </span>
                      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                        <div style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid #38bdf8", padding: "6px 14px", borderRadius: "8px", fontSize: "0.8rem", color: "#7dd3fc" }}>
                          FAISS Dense Semantic (all-MiniLM-L6-v2)
                        </div>
                        <span style={{ color: "#38bdf8", fontWeight: "700", alignSelf: "center" }}>+</span>
                        <div style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid #38bdf8", padding: "6px 14px", borderRadius: "8px", fontSize: "0.8rem", color: "#7dd3fc" }}>
                          BM25 Sparse Lexical (Term Matching)
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "center", color: "var(--sculk-cyan)", margin: "2px 0" }}>↓</div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                      <div style={{ background: "rgba(192, 132, 252, 0.15)", border: "1px solid #c084fc", padding: "8px 14px", borderRadius: "8px", color: "#e9d5ff", fontSize: "0.82rem" }}>
                        RRF FUSION (Rank Combination)
                      </div>
                      <span style={{ color: "var(--sculk-cyan)" }}>↓</span>
                      <div style={{ background: "rgba(192, 132, 252, 0.15)", border: "1px solid #c084fc", padding: "8px 14px", borderRadius: "8px", color: "#e9d5ff", fontSize: "0.82rem" }}>
                        CROSS-ENCODER RERANK (Top-15)
                      </div>
                      <span style={{ color: "var(--sculk-cyan)" }}>↓</span>
                      <div style={{ background: "rgba(0, 245, 212, 0.15)", border: "1px solid #00f5d4", padding: "8px 14px", borderRadius: "8px", color: "#5eead4", fontSize: "0.82rem", fontWeight: "700" }}>
                        RETRIEVAL CONFIDENCE GATE (Refusal)
                      </div>
                    </div>

                    <div style={{ textAlign: "center", color: "var(--sculk-cyan)", margin: "2px 0" }}>↓</div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                      <div style={{ background: "rgba(56, 189, 248, 0.2)", border: "1px solid #38bdf8", padding: "8px 14px", borderRadius: "8px", color: "#ffffff", fontSize: "0.82rem" }}>
                        GROQ LLM INFERENCE (&gt;200 tok/sec)
                      </div>
                      <span style={{ color: "var(--sculk-cyan)" }}>↓</span>
                      <div style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid #f59e0b", padding: "8px 14px", borderRadius: "8px", color: "#fde68a", fontSize: "0.82rem" }}>
                        CITATION VERIFICATION (Corpus Cross-Check)
                      </div>
                      <span style={{ color: "var(--sculk-cyan)" }}>↓</span>
                      <div style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", padding: "8px 14px", borderRadius: "8px", color: "#6ee7b7", fontSize: "0.82rem", fontWeight: "700" }}>
                        GROUNDED ANSWER &amp; CITATIONS
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Pipeline Stepper */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <Terminal size={17} color="var(--sculk-cyan)" />
                  <span>Pipeline Component Breakdown</span>
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  Click stages to inspect implementation details
                </span>
              </div>

              {/* Step Navigation Bar */}
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${caseStudy.pipeline.length}, 1fr)`,
                  gap: "6px",
                  marginBottom: "18px",
                  overflowX: "auto",
                  paddingBottom: "6px"
                }}
              >
                {caseStudy.pipeline.map((p, idx) => {
                  const isSelected = selectedStepIndex === idx;
                  return (
                    <button
                      key={p.step}
                      onClick={() => setSelectedStepIndex(idx)}
                      style={{
                        padding: "10px 8px",
                        background: isSelected ? "rgba(99, 102, 241, 0.28)" : "rgba(15, 23, 42, 0.65)",
                        border: isSelected ? `2px solid ${caseStudy.badgeColor || "var(--sculk-primary)"}` : "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.2s ease",
                        minWidth: "100px"
                      }}
                    >
                      <span 
                        style={{
                          fontSize: "0.72rem",
                          fontFamily: "var(--font-mono)",
                          fontWeight: "700",
                          color: isSelected ? (caseStudy.badgeColor || "var(--sculk-primary)") : "var(--text-dim)"
                        }}
                      >
                        STEP {p.step}
                      </span>
                      <span 
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: isSelected ? "700" : "500",
                          color: isSelected ? "#ffffff" : "var(--text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%"
                        }}
                      >
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Deep Dive Card */}
              {currentStep && (
                <div
                  className="terminal-block"
                  style={{
                    padding: "22px 26px",
                    animation: "fadeIn 0.2s ease-out",
                    borderLeft: `4px solid ${caseStudy.badgeColor || "var(--sculk-primary)"}`,
                    marginBottom: "24px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--sculk-cyan)", textTransform: "uppercase" }}>
                        STAGE {currentStep.step} OF 0{caseStudy.pipeline.length}
                      </span>
                      <h4 style={{ fontSize: "1.2rem", color: "#ffffff", fontWeight: "700", marginTop: "2px", margin: 0 }}>
                        {currentStep.name}
                      </h4>
                    </div>
                    <span 
                      style={{
                        background: "rgba(56, 189, 248, 0.12)",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        color: "#7dd3fc",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        padding: "4px 12px",
                        borderRadius: "8px"
                      }}
                    >
                      {currentStep.tech}
                    </span>
                  </div>

                  <p style={{ color: "#e2e8f0", fontSize: "0.95rem", lineHeight: "1.7", margin: 0 }}>
                    {currentStep.summary}
                  </p>
                </div>
              )}

              {/* Product Engineering: Beyond the AI Pipeline */}
              {caseStudy.beyondAIPipeline && (
                <div 
                  style={{
                    background: "rgba(13, 19, 35, 0.75)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    borderRadius: "14px",
                    padding: "22px 24px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <Server size={18} color="var(--sculk-cyan)" />
                    <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "700", color: "#ffffff" }}>
                      Beyond the AI Pipeline: Full-Stack Product Engineering
                    </h4>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                    {caseStudy.beyondAIPipeline.map((item, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: "rgba(15, 23, 42, 0.7)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "10px",
                          padding: "12px 14px"
                        }}
                      >
                        <div style={{ color: "#38bdf8", fontWeight: "700", fontSize: "0.88rem", fontFamily: "var(--font-mono)", marginBottom: "4px" }}>
                          {item.name}
                        </div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.5" }}>
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: GROUNDING & REFUSAL GATE (Smart Courtroom) */}
          {activeTab === "grounding" && isSmartCourtroom && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Hallucination Control Visual Banner */}
              <div 
                style={{
                  background: "linear-gradient(180deg, rgba(14, 25, 48, 0.9) 0%, rgba(8, 14, 28, 0.95) 100%)",
                  border: "2px solid #00f5d4",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <ShieldCheck size={24} color="#00f5d4" />
                  <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#ffffff", fontWeight: "800" }}>
                    Multi-Tier Grounding &amp; Hallucination Control Architecture
                  </h3>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.65", margin: "0 0 20px 0" }}>
                  Legal research cannot rely on superficial prompt instructions like &quot;be accurate.&quot; The system enforces a strict mathematical refusal threshold and a post-generation citation auditing pass.
                </p>

                {/* 5-Stage Verification Process Strip */}
                <div 
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "10px",
                    marginBottom: "20px"
                  }}
                >
                  {[
                    { step: "01", name: "RETRIEVE", desc: "FAISS + BM25" },
                    { step: "02", name: "GATE", desc: "Refusal Threshold" },
                    { step: "03", name: "GENERATE", desc: "Groq LLM" },
                    { step: "04", name: "VERIFY", desc: "Corpus Audit" },
                    { step: "05", name: "DISPLAY", desc: "Grounded Output" }
                  ].map((s, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: "rgba(15, 23, 42, 0.8)",
                        border: idx === 1 ? "1px solid #ef4444" : idx === 3 ? "1px solid #00f5d4" : "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "10px",
                        padding: "12px",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--sculk-cyan)" }}>
                        {s.step}
                      </div>
                      <div style={{ fontWeight: "700", color: "#ffffff", fontSize: "0.95rem", margin: "4px 0" }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
                        {s.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3 Core Grounding Guarantees */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                  <div style={{ background: "rgba(15, 23, 42, 0.65)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ color: "#fca5a5", fontWeight: "700", fontSize: "0.92rem", marginBottom: "6px" }}>
                      1. Strict Confidence Refusal Gate
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.6", margin: 0 }}>
                      If top retrieval similarity falls below the calibrated threshold, the system halts and refuses to fabricate ungrounded legal text, displaying the closest available precedent instead.
                    </p>
                  </div>

                  <div style={{ background: "rgba(15, 23, 42, 0.65)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ color: "#7dd3fc", fontWeight: "700", fontSize: "0.92rem", marginBottom: "6px" }}>
                      2. Physical Corpus Citation Cross-Check
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.6", margin: 0 }}>
                      Generated case names, docket numbers, and statutory sections are deterministically matched against physical corpus records. Unverified or disputed citations are flagged in amber/red.
                    </p>
                  </div>

                  <div style={{ background: "rgba(15, 23, 42, 0.65)", border: "1px solid rgba(0, 245, 212, 0.3)", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ color: "#5eead4", fontWeight: "700", fontSize: "0.92rem", marginBottom: "6px" }}>
                      3. Passage Support Audit
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.6", margin: 0 }}>
                      Every paragraph claim must be supported by at least one retrieved chunk passage. The UI links directly to the highlighted source paragraph within the Indian court judgment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MULTI-AGENT MOOT COURT (Smart Courtroom) */}
          {activeTab === "mootcourt" && isSmartCourtroom && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div 
                style={{
                  background: "linear-gradient(180deg, rgba(16, 22, 42, 0.9) 0%, rgba(10, 16, 30, 0.95) 100%)",
                  border: "2px solid #c084fc",
                  borderRadius: "16px",
                  padding: "24px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <Scale size={24} color="#c084fc" />
                  <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#ffffff", fontWeight: "800" }}>
                    Adversarial Multi-Agent Courtroom Simulation
                  </h3>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.65", margin: "0 0 24px 0" }}>
                  Simulates a formal courtroom hearing over a contested legal dispute. Instead of a single model prompt, distinct agents assume the roles of Petitioner Counsel, Respondent Counsel, and a Judicial Bench.
                </p>

                {/* Moot Court Workflow Graph */}
                <div 
                  style={{
                    background: "rgba(10, 16, 30, 0.9)",
                    border: "1px solid rgba(192, 132, 252, 0.3)",
                    borderRadius: "14px",
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "10px 20px", borderRadius: "8px", color: "#ffffff", fontWeight: "700" }}>
                    CONTESTED LEGAL ISSUE / CASE
                  </div>

                  <span style={{ color: "#c084fc", fontSize: "1.2rem" }}>↓</span>

                  {/* Petitioner vs Respondent Split */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", width: "100%", maxWidth: "720px" }}>
                    <div style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid #38bdf8", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                      <div style={{ color: "#38bdf8", fontWeight: "800", fontSize: "0.95rem" }}>
                        PETITIONER AGENT
                      </div>
                      <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", margin: "4px 0" }}>Engine: Groq LPU</div>
                      <p style={{ color: "#e2e8f0", fontSize: "0.82rem", margin: 0, lineHeight: "1.5" }}>
                        Argues statutory claims backed by retrieved Indian court precedents.
                      </p>
                    </div>

                    <div style={{ background: "rgba(244, 63, 94, 0.12)", border: "1px solid #f43f5e", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                      <div style={{ color: "#f43f5e", fontWeight: "800", fontSize: "0.95rem" }}>
                        RESPONDENT AGENT
                      </div>
                      <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", margin: "4px 0" }}>Engine: Groq LPU</div>
                      <p style={{ color: "#e2e8f0", fontSize: "0.82rem", margin: 0, lineHeight: "1.5" }}>
                        Submits counter-rebuttals and distinguishes opposing citations.
                      </p>
                    </div>
                  </div>

                  <span style={{ color: "#c084fc", fontSize: "1.2rem" }}>↓</span>

                  <div style={{ background: "rgba(192, 132, 252, 0.18)", border: "1px solid #c084fc", padding: "12px 24px", borderRadius: "10px", textAlign: "center", width: "100%", maxWidth: "520px" }}>
                    <div style={{ color: "#e9d5ff", fontWeight: "800", fontSize: "1rem" }}>
                      PRESIDING BENCH (Gemini)
                    </div>
                    <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", margin: "3px 0 6px 0" }}>Synthesizes Ratio Decidendi</div>
                    <p style={{ color: "#ffffff", fontSize: "0.84rem", margin: 0, lineHeight: "1.5" }}>
                      Weighs evidence, evaluates counter-arguments, and issues a reasoned judicial decree.
                    </p>
                  </div>

                  <span style={{ color: "#00f5d4", fontSize: "1.2rem" }}>↓</span>

                  <div style={{ background: "rgba(0, 245, 212, 0.15)", border: "1px solid #00f5d4", padding: "8px 20px", borderRadius: "8px", color: "#5eead4", fontWeight: "700", fontSize: "0.85rem" }}>
                    FINAL REASONED JUDICIAL OUTCOME
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ENGINEERING CHALLENGES & DECISIONS */}
          {activeTab === "challenges" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {caseStudy.challenges.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(13, 20, 36, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "20px 24px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <ShieldCheck size={18} color="#f59e0b" />
                    <h4 style={{ fontSize: "1.05rem", color: "#ffffff", fontWeight: "700", margin: 0 }}>
                      {item.challenge}
                    </h4>
                  </div>
                  
                  <div style={{ marginBottom: "12px", padding: "10px 14px", background: "rgba(239, 68, 68, 0.08)", borderLeft: "3px solid #ef4444", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.76rem", textTransform: "uppercase", color: "#fca5a5", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                      Problem / Engineering Context:
                    </span>
                    <p style={{ color: "#e2e8f0", fontSize: "0.88rem", marginTop: "4px", marginBottom: 0, lineHeight: "1.6" }}>
                      {item.decision}
                    </p>
                  </div>

                  <div style={{ padding: "10px 14px", background: "rgba(16, 185, 129, 0.08)", borderLeft: "3px solid #10b981", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.76rem", textTransform: "uppercase", color: "#6ee7b7", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                      Decision, Approach &amp; Rationale:
                    </span>
                    <p style={{ color: "#f8fafc", fontSize: "0.88rem", marginTop: "4px", marginBottom: 0, lineHeight: "1.6" }}>
                      {item.solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BENCHMARKS, EVALUATION & LIMITATIONS */}
          {activeTab === "metrics" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "22px" }}>
                {caseStudy.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      borderRadius: "14px",
                      padding: "20px",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)", fontWeight: "800", color: caseStudy.badgeColor || "var(--sculk-primary)", fontFamily: "var(--font-mono)" }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#ffffff", marginTop: "4px" }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: "1.4" }}>
                      {m.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Honest Engineering Limitations Card */}
              {caseStudy.limitations && (
                <div 
                  style={{
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "14px",
                    padding: "18px 22px",
                    marginBottom: "20px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b", fontWeight: "700", fontSize: "0.95rem", marginBottom: "6px" }}>
                    <AlertTriangle size={18} />
                    <span>Honest Engineering Appraisal &amp; Scaling Path</span>
                  </div>
                  <p style={{ color: "var(--text-main)", fontSize: "0.88rem", lineHeight: "1.65", margin: 0 }}>
                    {caseStudy.limitations}
                  </p>
                </div>
              )}

              {/* Direct links callout */}
              <div 
                style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(56, 189, 248, 0.15))",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  borderRadius: "14px",
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px"
                }}
              >
                <div>
                  <div style={{ fontWeight: "700", color: "#ffffff", fontSize: "1rem" }}>
                    Explore the Production Codebase &amp; Architecture
                  </div>
                  <div style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                    Inspect FastAPI controllers, FAISS retrieval pipelines, and evaluation benchmarks directly on GitHub.
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  {caseStudy.live && (
                    <a
                      href={caseStudy.live}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-sculk"
                      style={{ padding: "8px 16px", fontSize: "0.84rem", textDecoration: "none" }}
                    >
                      <ExternalLink size={15} />
                      <span>Live App</span>
                    </a>
                  )}
                  {caseStudy.github && (
                    <a
                      href={caseStudy.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ padding: "8px 16px", fontSize: "0.84rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <GithubIcon size={16} />
                      <span>GitHub Repo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
