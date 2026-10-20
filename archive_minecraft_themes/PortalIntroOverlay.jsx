import React, { useState, useEffect, useRef } from "react";

// ─── Cinematic Portal Intro Overlay ───────────────────────────────────────────
// Plays once when the End Realm theme is active.
// Shows: Portal swirl → title lore → stats → CTA → fades out.
// Stored in sessionStorage so it doesn't replay on soft-refresh within same session.

const SEQUENCE = [
  {
    id: "void",
    delay: 0,
    duration: 800,
    content: null, // just portal animation
  },
  {
    id: "lore1",
    delay: 600,
    duration: 1000,
    content: {
      tag: "label",
      text: "[ VOID SIGNAL DETECTED ]",
    },
  },
  {
    id: "lore2",
    delay: 1300,
    duration: 1200,
    content: {
      tag: "title",
      text: "Entering Krishna's Realm",
    },
  },
  {
    id: "lore3",
    delay: 2100,
    duration: 1100,
    content: {
      tag: "sub",
      text: "Architecting intelligent AI pipelines, LLM systems & modern applications.",
    },
  },
  {
    id: "code1",
    delay: 2900,
    duration: 1000,
    content: {
      tag: "code",
      lines: [
        '> dimension.load("krishna_workspace")',
        '  ↳ initializing neural engines...',
        '  ↳ mounting 3D environment...',
      ],
    },
  },
  {
    id: "code2",
    delay: 3700,
    duration: 1000,
    content: {
      tag: "code",
      lines: [
        '> profile.ready()',
        '  ↳ Krishna Mittal: AI/ML & Full-Stack Engineer',
      ],
    },
  },
  {
    id: "enter",
    delay: 4500,
    duration: 1100,
    content: {
      tag: "cta",
      text: "ENTER PORTFOLIO",
    },
  },
];

const TOTAL_DURATION = 5600;

export default function PortalIntroOverlay({ onComplete, portfolioData, theme = "end" }) {
  const isEndCity = theme === "endcity";
  const [phase, setPhase] = useState(0); // which sequence step is active
  const [visibleLines, setVisibleLines] = useState([]); // lines visible so far
  const [isExiting, setIsExiting] = useState(false);
  const [skipVisible, setSkipVisible] = useState(true);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  // Check sessionStorage so it only plays once per session
  const alreadyPlayed = sessionStorage.getItem("portal_intro_played");

  useEffect(() => {
    if (alreadyPlayed) {
      onComplete?.();
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        triggerExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Sequence timers
    const timers = SEQUENCE.map((step) =>
      setTimeout(() => {
        setPhase((p) => Math.max(p, SEQUENCE.indexOf(step)));
        if (step.content?.tag === "code") {
          // Reveal lines one by one with typing feel
          step.content.lines.forEach((line, li) => {
            setTimeout(() => {
              setVisibleLines((prev) => [...prev, { id: step.id + li, text: line }]);
            }, li * 150);
          });
        }
      }, step.delay)
    );

    // Exit sequence
    const exitTimer = setTimeout(() => {
      triggerExit();
    }, TOTAL_DURATION);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
    };
  }, []);

  // Portal canvas swirl animation
  useEffect(() => {
    if (alreadyPlayed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    startTimeRef.current = performance.now();

    const particles = Array.from({ length: 180 }, (_, i) => ({
      angle: (i / 180) * Math.PI * 2,
      radius: 80 + Math.random() * 140,
      speed: 0.3 + Math.random() * 0.6,
      size: 1.2 + Math.random() * 2.5,
      alpha: 0.3 + Math.random() * 0.7,
      // End City: brighter magenta/gold; End Realm: deep violet
      color: isEndCity
        ? (Math.random() < 0.5 ? "#e879f9" : Math.random() < 0.5 ? "#c084fc" : "#fde047")
        : (Math.random() < 0.5 ? "#d946ef" : Math.random() < 0.5 ? "#a855f7" : "#22d3ee"),
    }));

    const draw = (now) => {
      animFrameRef.current = requestAnimationFrame(draw);
      const t = (now - startTimeRef.current) * 0.001;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Deep void background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
      bg.addColorStop(0, "rgba(60, 5, 100, 0.28)");
      bg.addColorStop(0.5, "rgba(10, 2, 30, 0.6)");
      bg.addColorStop(1, "rgba(2, 0, 10, 0.85)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Spiral arms
      for (let arm = 0; arm < 4; arm++) {
        ctx.beginPath();
        const armOffset = (arm / 4) * Math.PI * 2 + t * 0.4;
        for (let r = 10; r < 260; r += 3) {
          const theta = armOffset + r * 0.028 + t * 0.6;
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;
          const alpha = Math.max(0, (1 - r / 260)) * 0.55;
          if (r === 10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${arm % 2 ? "217,70,239" : "168,85,247"},${0.35 + Math.sin(t * 1.5 + arm) * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Orbiting void particles
      particles.forEach((p) => {
        p.angle += p.speed * 0.012;
        const r = p.radius * (0.92 + Math.sin(t * 0.8 + p.angle) * 0.08);
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r * 0.55; // slight oval for depth
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `,${p.alpha * (0.7 + Math.sin(t * 2.2 + p.angle) * 0.3)})`).replace("rgb", "rgba").replace("#d946ef", "rgba(217,70,239,").replace("#a855f7", "rgba(168,85,247,").replace("#22d3ee", "rgba(34,211,238,");
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.7 + Math.sin(t * 2.2 + p.angle) * 0.3);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Central glowing portal disc
      const discR = 120 + Math.sin(t * 2.2) * 8;
      const disc = ctx.createRadialGradient(cx, cy, 0, cx, cy, discR);
      if (isEndCity) {
        disc.addColorStop(0, `rgba(253,224,71,${0.85 + Math.sin(t * 3) * 0.1})`);
        disc.addColorStop(0.25, `rgba(232,121,249,0.72)`);
        disc.addColorStop(0.6, `rgba(147,51,234,0.45)`);
        disc.addColorStop(0.85, `rgba(192,132,252,0.2)`);
      } else {
        disc.addColorStop(0, `rgba(244,114,182,${0.9 + Math.sin(t * 3) * 0.1})`);
        disc.addColorStop(0.25, `rgba(217,70,239,0.7)`);
        disc.addColorStop(0.6, `rgba(126,34,206,0.45)`);
        disc.addColorStop(0.85, `rgba(34,211,238,0.2)`);
      }
      disc.addColorStop(1, "rgba(5,2,12,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, discR, 0, Math.PI * 2);
      ctx.fillStyle = disc;
      ctx.fill();

      // Outer pulsing ring
      ctx.beginPath();
      ctx.arc(cx, cy, discR * (1.18 + Math.sin(t * 1.5) * 0.04), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34,211,238,${0.4 + Math.sin(t * 2) * 0.2})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const triggerExit = () => {
    setIsExiting(true);
    sessionStorage.setItem("portal_intro_played", "1");
    setTimeout(() => {
      onComplete?.();
    }, 1000);
  };

  if (alreadyPlayed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(2,0,10,0.97)",
        transition: "opacity 1s ease",
        opacity: isExiting ? 0 : 1,
        pointerEvents: isExiting ? "none" : "all",
      }}
    >
      {/* Portal canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Text overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          maxWidth: "640px",
          width: "90%",
          textAlign: "center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Lore label */}
        {phase >= 1 && (
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              color: isEndCity ? "#fde047" : "#22d3ee",
              fontFamily: "monospace",
              animation: "portalFadeIn 0.8s ease forwards",
              opacity: 0,
            }}
          >
            {isEndCity ? "[ PURPUR SIGNAL DETECTED ]" : "[ VOID SIGNAL DETECTED ]"}
          </span>
        )}

        {/* Main title */}
        {phase >= 2 && (
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
              fontWeight: 900,
              background: isEndCity
                ? "linear-gradient(135deg, #fde047, #e879f9 40%, #c084fc 70%, #9333ea)"
                : "linear-gradient(135deg, #f472b6, #d946ef 40%, #a855f7 70%, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.15,
              animation: "portalFadeIn 1s ease forwards",
              opacity: 0,
              fontFamily: "'Outfit', sans-serif",
              textShadow: "none",
            }}
          >
            {isEndCity ? "You are entering the End City" : "You are entering the End Realm"}
          </h1>
        )}

        {/* Subtitle */}
        {phase >= 3 && (
          <p
            style={{
              margin: 0,
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.7)",
              fontStyle: "italic",
              animation: "portalFadeIn 1s ease forwards",
              opacity: 0,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {isEndCity
              ? "A city of purpur towers, Shulker guardians & Elytra glory."
              : "A dimension forged from code, logic & creative chaos."}
          </p>
        )}

        {/* Code terminal block */}
        {phase >= 4 && visibleLines.length > 0 && (
          <div
            style={{
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(168,85,247,0.35)",
              borderRadius: "10px",
              padding: "16px 22px",
              width: "100%",
              textAlign: "left",
              backdropFilter: "blur(8px)",
              animation: "portalFadeIn 0.6s ease forwards",
              opacity: 0,
            }}
          >
            {visibleLines.map((line) => (
              <div
                key={line.id}
                style={{
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  fontSize: "0.82rem",
                  color: line.text.startsWith(">")
                    ? (isEndCity ? "#e879f9" : "#d946ef")
                    : line.text.includes("Krishna") || line.text.includes("Full Stack") || line.text.includes("relics")
                    ? (isEndCity ? "#fde047" : "#22d3ee")
                    : "rgba(200,200,230,0.8)",
                  lineHeight: 1.75,
                  letterSpacing: "0.02em",
                }}
              >
                {line.text}
              </div>
            ))}
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "14px",
                background: "#d946ef",
                animation: "portalBlink 0.8s step-end infinite",
                verticalAlign: "text-bottom",
              }}
            />
          </div>
        )}

        {/* Enter Portal CTA */}
        {phase >= 6 && (
          <button
            onClick={triggerExit}
            style={{
              pointerEvents: "all",
              marginTop: "10px",
              padding: "12px 36px",
              background: "linear-gradient(135deg, #7e22ce, #d946ef)",
              border: "1px solid rgba(244,114,182,0.4)",
              borderRadius: "30px",
              color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.12em",
              cursor: "pointer",
              animation: "portalFadeIn 0.8s ease forwards, portalPulse 2s ease infinite",
              opacity: 0,
              boxShadow: "0 0 32px rgba(217,70,239,0.5)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.06)";
              e.target.style.boxShadow = "0 0 48px rgba(217,70,239,0.75)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 0 32px rgba(217,70,239,0.5)";
            }}
          >
            {isEndCity ? "🏰 ENTER THE CITY" : "⚡ ENTER THE REALM"}
          </button>
        )}
      </div>

      {/* Skip button */}
      {skipVisible && !isExiting && (
        <button
          onClick={triggerExit}
          style={{
            position: "absolute",
            top: "24px",
            right: "28px",
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(0, 245, 212, 0.4)",
            borderRadius: "20px",
            color: "#ffffff",
            padding: "8px 18px",
            fontSize: "0.82rem",
            fontWeight: "600",
            fontFamily: "var(--font-mono, monospace)",
            cursor: "pointer",
            zIndex: 20,
            boxShadow: "0 0 15px rgba(0, 245, 212, 0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "rgba(0, 245, 212, 0.8)";
            e.target.style.boxShadow = "0 0 25px rgba(0, 245, 212, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "rgba(0, 245, 212, 0.4)";
            e.target.style.boxShadow = "0 0 15px rgba(0, 245, 212, 0.2)";
          }}
        >
          Skip to Portfolio (ESC) ›
        </button>
      )}

      {/* Keyframe styles */}
      <style>{`
        @keyframes portalFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes portalBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes portalPulse {
          0%, 100% { box-shadow: 0 0 32px rgba(217,70,239,0.5); }
          50%       { box-shadow: 0 0 60px rgba(217,70,239,0.8); }
        }
      `}</style>
    </div>
  );
}
