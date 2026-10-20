import React, { useState, useRef, useEffect } from "react";
import { Cpu, Sparkles } from "lucide-react";

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

export default function SkillsSection({ skills }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  const handleCategoryChange = (idx) => {
    setActiveCategory(idx);
  };

  const active = skills?.[activeCategory];

  return (
    <section ref={sectionRef} className="portfolio-section" style={{ minHeight: "100vh" }}>
      <div className="interactive-panel" style={{ width: "100%", maxWidth: "1100px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span className="badge-sculk" style={{ marginBottom: "10px" }}>
            ✦ CORE COMPETENCIES &amp; TOOLING
          </span>
          <h2 className="ancient-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800" }}>
            TECHNICAL <span className="sculk-gradient-text">STACK</span>
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "650px", margin: "10px auto 0" }}>
            Technologies and computer-science foundations used across my AI/ML, backend, and full-stack projects.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "32px", flexWrap: "wrap" }}>
          {skills?.map((cat, idx) => (
            <button
              key={cat.category}
              onClick={() => handleCategoryChange(idx)}
              style={{
                background: activeCategory === idx ? "rgba(99, 102, 241, 0.2)" : "rgba(15, 23, 42, 0.6)",
                border: activeCategory === idx ? "1px solid var(--sculk-primary)" : "1px solid rgba(148, 163, 184, 0.2)",
                color: activeCategory === idx ? "#ffffff" : "var(--text-muted)",
                padding: "9px 18px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
            >
              {cat.category}
            </button>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: "clamp(24px, 4vw, 40px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Sparkles size={18} color="var(--sculk-cyan)" />
            <h3 style={{ margin: 0, color: "#fff", fontSize: "1.15rem" }}>{active?.category}</h3>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
            {active?.items.map((skill, i) => (
              <div
                key={skill}
                className="card-glow-border"
                style={{
                  background: "rgba(11, 16, 29, 0.72)",
                  border: "1px solid rgba(255, 255, 255, 0.09)",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "0.94rem",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(12px)",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${i * 0.045}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--sculk-primary)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.09)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sculk-cyan)", boxShadow: "0 0 8px var(--sculk-cyan)", flexShrink: 0 }} />
                {skill}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "32px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px",
            fontSize: "0.84rem", color: "var(--text-muted)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Cpu size={16} color="var(--sculk-primary)" />
              <span>Applied across projects, coursework, and internship experience</span>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", color: "var(--sculk-cyan)", fontSize: "0.8rem" }}>
              ✦ ACTIVE STACK • 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
