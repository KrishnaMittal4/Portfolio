import React from "react";
import { ExternalLink, Cpu, ChevronRight } from "lucide-react";
import { GithubIcon } from "./Icons";

export default function ProjectsSection({ projects, hoveredProjectId, onHoverProject, onInspectProject }) {
  // Only display the 3 main flagship engineering projects
  const mainProjects = (projects || []).filter(p => 
    p.id === "smart-courtroom-rag" || 
    p.id === "ai-interview-platform" || 
    p.id === "ibm-fintech-analytics"
  );

  return (
    <section className="portfolio-section" style={{ minHeight: "100vh" }}>
      <div className="interactive-panel" style={{ width: "100%", maxWidth: "1200px" }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="badge-sculk section-reveal" style={{ marginBottom: "10px" }}>
            ✦ CORE PRODUCTION SYSTEMS
          </span>
          <h2 className="ancient-title section-reveal section-reveal-delay-1" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800" }}>
            FEATURED <span className="sculk-gradient-text">PROJECTS</span>
          </h2>
          <p className="section-reveal section-reveal-delay-2" style={{ color: "var(--text-muted)", maxWidth: "680px", margin: "10px auto 0", fontSize: "1rem" }}>
            Three end-to-end intelligent engineering systems: Grounded legal RAG, resume-adaptive interview evaluation, and financial sentiment ML analytics.
          </p>
        </div>

        {/* 3 Main Projects in Balanced, Identical Cards */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}
        >
          {mainProjects.map((project) => {
            const isHovered = hoveredProjectId === project.id;
            const accentColor = project.badgeColor || "var(--sculk-primary)";

            return (
              <div
                key={project.id}
                className="glass-panel card-glow-border"
                onMouseEnter={() => onHoverProject?.(project.id)}
                onMouseLeave={() => onHoverProject?.(null)}
                style={{
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  borderRadius: "18px",
                  background: "rgba(12, 18, 34, 0.82)",
                  border: `1px solid ${isHovered ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
                  borderTop: `3px solid ${accentColor}`,
                  boxShadow: isHovered 
                    ? `0 14px 40px rgba(0, 0, 0, 0.6), 0 0 30px ${accentColor}33` 
                    : "0 10px 30px rgba(0, 0, 0, 0.4)",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                <div>
                  {/* Category & Status Bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                    <span 
                      style={{ 
                        fontSize: "0.74rem", 
                        textTransform: "uppercase", 
                        fontFamily: "var(--font-mono)", 
                        color: accentColor,
                        background: `${accentColor}15`,
                        border: `1px solid ${accentColor}35`,
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontWeight: "700",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {project.category}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                      {project.stats}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: "1.35rem", fontWeight: "700", color: "#ffffff", marginBottom: "6px", lineHeight: "1.3" }}>
                    {project.title}
                  </h3>

                  {/* Subtitle */}
                  {project.subtitle && (
                    <div style={{ fontSize: "0.86rem", color: "#94a3b8", marginBottom: "14px", fontFamily: "var(--font-mono)", lineHeight: "1.4" }}>
                      {project.subtitle}
                    </div>
                  )}

                  {/* Description */}
                  <p style={{ color: "var(--text-main)", fontSize: "0.93rem", lineHeight: "1.65", marginBottom: "22px" }}>
                    {project.description}
                  </p>

                  {/* Tech Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
                    {project.tech.map((t, idx) => (
                      <span 
                        key={idx}
                        style={{
                          fontSize: "0.76rem",
                          fontFamily: "var(--font-mono)",
                          background: "rgba(15, 23, 42, 0.8)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "var(--sculk-cyan)",
                          padding: "3px 8px",
                          borderRadius: "4px"
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Architecture & Case Study Deep Dive Button */}
                  <button
                    onClick={() => onInspectProject?.(project.id)}
                    style={{
                      width: "100%",
                      marginBottom: "14px",
                      padding: "11px 16px",
                      borderRadius: "10px",
                      background: `${accentColor}18`,
                      border: `1px solid ${accentColor}55`,
                      color: "#ffffff",
                      fontSize: "0.86rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      boxShadow: `0 0 16px ${accentColor}18`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${accentColor}33`;
                      e.currentTarget.style.borderColor = accentColor;
                      e.currentTarget.style.boxShadow = `0 0 24px ${accentColor}44`;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${accentColor}18`;
                      e.currentTarget.style.borderColor = `${accentColor}55`;
                      e.currentTarget.style.boxShadow = `0 0 16px ${accentColor}18`;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <Cpu size={16} color={accentColor} />
                    <span>View Architecture &amp; Case Study</span>
                    <ChevronRight size={15} style={{ marginLeft: "auto", opacity: 0.7 }} />
                  </button>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "14px" }}>
                    {project.live ? (
                      <>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-sculk"
                          style={{ flexGrow: 1, padding: "9px 14px", fontSize: "0.88rem", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                        >
                          <ExternalLink size={14} />
                          <span>Live Preview</span>
                        </a>

                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                          style={{ padding: "9px 14px", fontSize: "0.88rem", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          title="View GitHub Repository"
                        >
                          <GithubIcon size={16} />
                        </a>
                      </>
                    ) : (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-sculk"
                        style={{ 
                          flexGrow: 1, 
                          padding: "9px 14px", 
                          fontSize: "0.88rem", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          gap: "8px",
                          textDecoration: "none"
                        }}
                      >
                        <GithubIcon size={16} />
                        <span>View Repository &amp; Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
