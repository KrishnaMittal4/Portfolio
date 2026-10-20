import React, { useState, useEffect, useRef } from "react";
import { ArrowDown, Download } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

// Typing animation hook
function useTypingEffect(text, speed = 55, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// Looping role typewriter hook
function useRoleTypewriter(roles, typingSpeed = 60, deleteSpeed = 28, pauseDuration = 2200) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!roles || roles.length === 0) return;
    const fullText = roles[roleIndex % roles.length];
    let timer;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, roles, typingSpeed, deleteSpeed, pauseDuration]);

  return currentText;
}

const ROLES = [
  "Software & AI/ML Engineer",
  "AI/ML & Full-Stack Developer",
  "RAG & LLM Systems Engineer",
  "Backend & Intelligent Systems Developer"
];

export default function HeroSection({ profile, socials, onNavigate, onOpenSettings }) {
  const { displayed: typedName, done: typingDone } = useTypingEffect(profile.name, 52, 300);
  const typedRole = useRoleTypewriter(ROLES, 55, 26, 2200);
  const particleRef = useRef(null);

  // Particle burst on mount
  useEffect(() => {
    const container = particleRef.current;
    if (!container) return;
    const colors = ["#6366f1", "#38bdf8", "#c084fc", "#818cf8"];
    const particles = 14;
    for (let i = 0; i < particles; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${40 + Math.random() * 40}%`;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.boxShadow = `0 0 6px ${colors[Math.floor(Math.random() * colors.length)]}`;
      p.style.animationDelay = `${i * 0.06}s`;
      p.style.animationDuration = `${1 + Math.random() * 0.6}s`;
      container.appendChild(p);
    }
    const cleanup = setTimeout(() => {
      if (container) container.innerHTML = "";
    }, 2200);
    return () => clearTimeout(cleanup);
  }, []);

  return (
    <section className="portfolio-section" style={{ textAlign: "center", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Particle Burst Container */}
      <div ref={particleRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      <div className="interactive-panel section-reveal" style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>



        {/* Typing Hero Title */}
        <h1
          className="ancient-title section-reveal section-reveal-delay-2"
          style={{
            fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
            fontWeight: "900",
            lineHeight: "1.1",
            marginBottom: "18px",
            textShadow: "0 0 40px rgba(99, 102, 241, 0.35)"
          }}
        >
          <span className="sculk-gradient-text">{typedName}</span>
          {!typingDone && <span className="typing-cursor" />}
        </h1>

        {/* Rotating Role Typewriter Pill */}
        <div
          className="section-reveal section-reveal-delay-2"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "rgba(13, 19, 35, 0.72)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            borderRadius: "28px",
            padding: "8px 22px",
            marginBottom: "20px",
            boxShadow: "0 0 25px rgba(99, 102, 241, 0.18)",
            backdropFilter: "blur(14px)",
            maxWidth: "92%"
          }}
        >
          <span style={{ color: "var(--sculk-cyan)", fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "1rem" }}>
            &gt;
          </span>
          <span
            style={{
              fontSize: "clamp(1.02rem, 2.2vw, 1.3rem)",
              color: "#ffffff",
              fontWeight: "600",
              letterSpacing: "0.3px",
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "var(--font-primary)"
            }}
          >
            {typedRole}
            <span className="typing-cursor" style={{ height: "1.2em", marginLeft: "4px" }} />
          </span>
        </div>

        {/* Tagline */}
        <p
          className="section-reveal section-reveal-delay-3"
          style={{
            fontSize: "1.05rem",
            color: "var(--text-muted)",
            maxWidth: "680px",
            margin: "0 auto 32px auto",
            lineHeight: "1.7"
          }}
        >
          {profile.tagline}
        </p>

        {/* CTAs */}
        <div className="section-reveal section-reveal-delay-3" style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "42px" }}>
          <button
            className="btn-sculk"
            onClick={() => onNavigate(2)}
          >
            <span>Explore Featured Projects</span>
            <ArrowDown size={18} />
          </button>

          <a
            className="btn-secondary"
            href={socials?.resume || "/KrishnaMittal_Resume.pdf"}
            download
            style={{ border: "1px solid rgba(99, 102, 241, 0.5)", color: "#e0e7ff", textDecoration: "none" }}
          >
            <Download size={18} />
            <span>Download Resume</span>
          </a>

          <a className="btn-secondary" href={socials?.github} target="_blank" rel="noreferrer" aria-label="GitHub" style={{ paddingInline: "14px", textDecoration: "none" }}>
            <GithubIcon size={19} /><span>GitHub</span>
          </a>

          {socials?.linkedin && (
            <a className="btn-secondary" href={socials?.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ paddingInline: "14px", textDecoration: "none" }}>
              <LinkedinIcon size={19} /><span>LinkedIn</span>
            </a>
          )}

        </div>

      </div>

      {/* Scroll Hint */}
      <div
        className="interactive-panel"
        onClick={() => onNavigate(1)}
        style={{
          marginTop: "20px",
          cursor: "pointer",
          color: "var(--text-dim)",
          fontSize: "0.82rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          position: "relative",
          zIndex: 1
        }}
      >
        <span>Scroll to explore engineering architecture &amp; projects</span>
        <ArrowDown size={16} style={{ animation: "sculkHeartbeat 1.5s infinite" }} />
      </div>
    </section>
  );
}
