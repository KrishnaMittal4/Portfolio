import React from "react";
import { Award, Terminal, Hammer, Compass, Target, GraduationCap, ArrowRight, ExternalLink } from "lucide-react";

export default function AboutSection({ about, experience }) {
  const currently = about?.currently || {
    building: "AI-Powered Smart Courtroom",
    buildingDesc: "Grounded legal RAG for Indian judgments with hybrid FAISS+BM25 retrieval, RRF fusion, cross-encoder reranking, and multi-agent moot court simulation.",
    buildingLink: "https://github.com/KrishnaMittal4/AI-POWERED-SMARTCOURTROOM",
    exploring: ["RAG", "Agentic AI", "LLM Evaluation", "AI Backend Systems"],
    interestedIn: ["Software Engineering", "AI/ML Engineering", "GenAI Engineering"],
    graduating: "May 2027"
  };

  return (
    <section className="portfolio-section" style={{ minHeight: "100vh" }}>
      <div className="interactive-panel" style={{ width: "100%", maxWidth: "1080px" }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span className="badge-sculk" style={{ marginBottom: "10px" }}>
            ✦ BACKGROUND &amp; VISION
          </span>
          <h2 className="ancient-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800" }}>
            ARCHITECTING <span className="sculk-gradient-text">INTELLIGENT SYSTEMS</span>
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "620px", margin: "10px auto 0", fontSize: "1rem" }}>
            Engineering grounded retrieval pipelines, intelligent agentic workflows, and production-grade full-stack software.
          </p>
        </div>

        {/* About Me Story Card with Scannable Bold Highlights */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: "clamp(24px, 3.5vw, 36px)", 
            marginBottom: "28px", 
            borderLeft: "4px solid var(--sculk-primary)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <h3 className="ancient-title" style={{ fontSize: "1.3rem", color: "#ffffff", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <Terminal size={20} color="var(--sculk-primary)" />
              <span>About Me</span>
            </h3>
            <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--sculk-cyan)", background: "rgba(56, 189, 248, 0.1)", padding: "3px 12px", borderRadius: "12px", border: "1px solid rgba(56, 189, 248, 0.25)" }}>
              UPES Dehradun • B.Tech CSE (AI &amp; ML)
            </span>
          </div>

          <div style={{ color: "var(--text-main)", fontSize: "1.02rem", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ margin: 0 }}>
              I'm Krishna Mittal, a <strong style={{ color: "#ffffff" }}>B.Tech Computer Science &amp; Engineering</strong> student specializing in <strong style={{ color: "var(--sculk-cyan)" }}>Artificial Intelligence &amp; Machine Learning</strong> at <strong style={{ color: "#ffffff" }}>UPES, Dehradun</strong>.
            </p>
            <p style={{ margin: 0 }}>
              I build end-to-end AI and full-stack systems, with a focus on <strong style={{ color: "#ffffff" }}>Retrieval-Augmented Generation (RAG)</strong>, <strong style={{ color: "#ffffff" }}>LLM applications</strong>, <strong style={{ color: "#ffffff" }}>NLP</strong>, <strong style={{ color: "#ffffff" }}>machine learning</strong>, and <strong style={{ color: "#ffffff" }}>backend engineering</strong>. My work ranges from <strong style={{ color: "var(--sculk-cyan)" }}>hybrid legal-retrieval systems</strong> and <strong style={{ color: "var(--sculk-cyan)" }}>multi-agent AI workflows</strong> to <strong style={{ color: "var(--sculk-cyan)" }}>financial sentiment analysis</strong> and <strong style={{ color: "var(--sculk-cyan)" }}>intelligent interview-evaluation platforms</strong>.
            </p>
            <p style={{ margin: 0 }}>
              I enjoy working beyond model integration—designing <strong style={{ color: "#ffffff" }}>retrieval pipelines, APIs, evaluation systems, verification layers</strong>, and user-facing applications that turn AI concepts into practical products.
            </p>
            <p style={{ margin: 0 }}>
              I'm currently exploring <strong style={{ color: "var(--sculk-primary)" }}>Software Engineering</strong> and <strong style={{ color: "var(--sculk-primary)" }}>AI/ML opportunities</strong> where I can work on real-world intelligent systems.
            </p>
          </div>
        </div>

        {/* CURRENTLY SECTION (Directly below About) */}
        <div 
          className="glass-panel card-glow-border"
          style={{
            padding: "26px 28px",
            marginBottom: "36px",
            background: "rgba(12, 18, 34, 0.82)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.12)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00f5d4", boxShadow: "0 0 10px #00f5d4" }} />
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: "#ffffff", fontFamily: "var(--font-mono)" }}>
              CURRENT STATUS &amp; FOCUS
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            
            {/* Building */}
            <div style={{ background: "rgba(15, 23, 42, 0.65)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "var(--sculk-cyan)", fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>
                <Hammer size={15} />
                <span>Building</span>
              </div>
              <div style={{ fontWeight: "700", color: "#ffffff", fontSize: "0.98rem", marginBottom: "6px" }}>
                {currently.building}
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", lineHeight: "1.5", margin: 0 }}>
                {currently.buildingDesc}
              </p>
              {currently.buildingLink && (
                <a 
                  href={currently.buildingLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#38bdf8", fontSize: "0.8rem", marginTop: "8px", textDecoration: "none", fontWeight: "600" }}
                >
                  <span>Explore Repository</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Exploring */}
            <div style={{ background: "rgba(15, 23, 42, 0.65)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(192, 132, 252, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#c084fc", fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>
                <Compass size={15} />
                <span>Exploring</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {currently.exploring.map((item, idx) => (
                  <span 
                    key={idx}
                    style={{
                      background: "rgba(192, 132, 252, 0.12)",
                      border: "1px solid rgba(192, 132, 252, 0.3)",
                      color: "#e9d5ff",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      padding: "4px 9px",
                      borderRadius: "6px"
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Interested In */}
            <div style={{ background: "rgba(15, 23, 42, 0.65)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(0, 245, 212, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#00f5d4", fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>
                <Target size={15} />
                <span>Interested In</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {currently.interestedIn.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ffffff", fontSize: "0.85rem", fontWeight: "600" }}>
                    <span style={{ color: "#00f5d4" }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Graduating */}
            <div style={{ background: "rgba(15, 23, 42, 0.65)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#a5b4fc", fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>
                <GraduationCap size={15} />
                <span>Graduating</span>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff", marginBottom: "4px" }}>
                {currently.graduating}
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: 0 }}>
                UPES Dehradun • B.Tech Computer Science &amp; Engineering
              </p>
            </div>

          </div>
        </div>

        {/* Experience Timeline */}
        <div className="glass-panel" style={{ padding: "clamp(24px, 4vw, 36px)", display: "flex", flexDirection: "column" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            <h3 className="ancient-title" style={{ fontSize: "1.3rem", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <Award size={22} color="#00f5d4" />
              <span>Engineering Experience &amp; Internships</span>
            </h3>

            {/* Career Progression Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", flexWrap: "wrap" }}>
              <span style={{ color: "#38bdf8" }}>2025: Scientific Automation</span>
              <ArrowRight size={12} />
              <span style={{ color: "#c084fc" }}>2026: ML &amp; Financial AI</span>
              <ArrowRight size={12} />
              <span style={{ color: "#00f5d4" }}>2026+: Advanced RAG</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {experience?.map((exp, i) => (
              <div 
                key={i}
                style={{
                  display: "flex",
                  gap: "20px",
                  paddingBottom: i !== experience.length - 1 ? "28px" : "0",
                  borderBottom: i !== experience.length - 1 ? "1px solid rgba(56, 189, 248, 0.12)" : "none"
                }}
              >
                {/* Timeline node */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: i === 0 ? "#c084fc" : "#00f5d4",
                    boxShadow: i === 0 ? "0 0 12px #c084fc" : "0 0 12px #00f5d4",
                    marginTop: "6px"
                  }} />
                  {i !== experience.length - 1 && (
                    <div style={{ width: "2px", flexGrow: 1, background: "rgba(56, 189, 248, 0.2)", marginTop: "8px" }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                    <div>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                        {exp.role} <span style={{ color: "var(--sculk-cyan)" }}>@ {exp.company}</span>
                      </h4>
                      {exp.projectTitle && (
                        <div style={{ fontSize: "0.92rem", color: "#e2e8f0", fontWeight: "600", marginTop: "4px" }}>
                          {exp.projectTitle}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--sculk-primary)", background: "rgba(0, 245, 212, 0.1)", padding: "3px 12px", borderRadius: "12px", height: "fit-content" }}>
                      {exp.period}
                    </span>
                  </div>

                  {/* Technologies Tags */}
                  {exp.technologies && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "10px 0 12px 0" }}>
                      {exp.technologies.map((tech, tIdx) => (
                        <span 
                          key={tIdx}
                          style={{
                            fontSize: "0.74rem",
                            fontFamily: "var(--font-mono)",
                            background: "rgba(15, 23, 42, 0.7)",
                            border: "1px solid rgba(148, 163, 184, 0.2)",
                            color: "#cbd5e1",
                            padding: "2px 8px",
                            borderRadius: "4px"
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bullet Highlights */}
                  {exp.highlights ? (
                    <ul style={{ margin: "10px 0 0 0", paddingLeft: "18px", color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.65" }}>
                      {exp.highlights.map((bullet, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: "6px" }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.93rem", lineHeight: "1.65", margin: "8px 0 0 0" }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
