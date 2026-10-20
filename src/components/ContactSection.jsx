import React, { useState } from "react";
import { Mail, Copy, Check, Phone, MapPin, ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./Icons";
import { sculkAudio } from "../audio/sculkAudio";

export default function ContactSection({ socials, profile }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(socials.email);
    setCopied(true);
    sculkAudio.playSculkResonance(600);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="portfolio-section" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="interactive-panel section-reveal" style={{ width: "100%", maxWidth: "860px", margin: "0 auto" }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="badge-sculk" style={{ marginBottom: "12px", display: "inline-block" }}>
            ✦ INQUIRIES &amp; COLLABORATION
          </span>
          <h2
            className="ancient-title"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              fontWeight: "900",
              lineHeight: "1.15",
              marginBottom: "14px"
            }}
          >
            LET'S BUILD <span className="sculk-gradient-text">TOGETHER</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: "600px",
              margin: "0 auto",
              fontSize: "1.02rem",
              lineHeight: "1.65"
            }}
          >
            Looking for an AI/ML Engineer or Full-Stack Developer? Whether you have an open role, an architectural discussion, or a breakthrough idea—let's connect.
          </p>
        </div>

        {/* Central Direct Connect Hub */}
        <div
          className="glass-panel card-glow-border"
          style={{
            padding: "clamp(24px, 4vw, 42px)",
            borderRadius: "20px",
            background: "rgba(11, 17, 32, 0.78)",
            border: "1px solid rgba(99, 102, 241, 0.28)",
            boxShadow: "0 20px 50px rgba(7, 9, 14, 0.7), 0 0 35px rgba(99, 102, 241, 0.12)",
            backdropFilter: "blur(18px)",
            textAlign: "center"
          }}
        >
          {/* Availability Status Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "6px 16px", borderRadius: "20px", background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.3)", marginBottom: "28px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--sculk-primary)", boxShadow: "0 0 10px var(--sculk-primary)" }} />
            <span style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: "600", fontFamily: "var(--font-mono)" }}>
              {profile.status || "AVAILABLE FOR AI/ML & FULL-STACK ROLES • 2026"}
            </span>
          </div>

          {/* Primary Email Highlight Card */}
          <div
            style={{
              background: "rgba(6, 12, 24, 0.85)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "14px",
              padding: "20px 24px",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", textAlign: "left" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(56, 189, 248, 0.25))",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Mail size={22} color="var(--sculk-cyan)" />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-dim)", marginBottom: "2px" }}>
                  Direct Email Inquiries
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "#ffffff", fontWeight: "600", wordBreak: "break-all" }}>
                  {socials.email}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginLeft: "auto", flexWrap: "wrap" }}>
              <a
                href={`mailto:${socials.email}?subject=Engineering%20Opportunity%20-%20Krishna%20Mittal`}
                className="btn-sculk"
                style={{ padding: "8px 18px", fontSize: "0.86rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>Write Email</span>
                <ArrowUpRight size={16} />
              </a>

              <button
                onClick={handleCopyEmail}
                className="btn-secondary"
                style={{ padding: "8px 16px", fontSize: "0.86rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                title="Copy email to clipboard"
              >
                {copied ? <Check size={16} color="#00f5d4" /> : <Copy size={16} />}
                <span>{copied ? "Copied!" : "Copy Address"}</span>
              </button>
            </div>
          </div>

          {/* Direct Social Portals Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "28px" }}>
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px 20px",
                  background: "rgba(13, 20, 38, 0.75)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--sculk-cyan)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(56, 189, 248, 0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(56, 189, 248, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GithubIcon size={20} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>GitHub</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Explore Source Code</div>
                </div>
                <ExternalLink size={14} color="var(--text-dim)" style={{ marginLeft: "auto" }} />
              </a>
            )}

            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px 20px",
                  background: "rgba(13, 20, 38, 0.75)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--sculk-primary)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LinkedinIcon size={20} color="#818cf8" />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>LinkedIn</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Connect Professionally</div>
                </div>
                <ExternalLink size={14} color="var(--text-dim)" style={{ marginLeft: "auto" }} />
              </a>
            )}

            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px 20px",
                  background: "rgba(13, 20, 38, 0.75)",
                  border: "1px solid rgba(192, 132, 252, 0.25)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--soul-amethyst)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(192, 132, 252, 0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(192, 132, 252, 0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(192, 132, 252, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TwitterIcon size={20} color="#c084fc" />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>Twitter / X</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Tech Updates &amp; AI</div>
                </div>
                <ExternalLink size={14} color="var(--text-dim)" style={{ marginLeft: "auto" }} />
              </a>
            )}
          </div>

          {/* Quick Details Chips (Phone & Location) */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", paddingTop: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.07)" }}>
            {socials.phone && (
              <a
                href={`tel:${socials.phone}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(6, 12, 24, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.09)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-mono)",
                  textDecoration: "none"
                }}
              >
                <Phone size={14} color="var(--sculk-primary)" />
                <span>{socials.phone}</span>
              </a>
            )}

            {profile.location && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(6, 12, 24, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.09)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem"
                }}
              >
                <MapPin size={14} color="var(--sculk-cyan)" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>

        </div>

        {/* Professional Footer */}
        <footer
          style={{
            marginTop: "60px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(99, 102, 241, 0.2)",
            textAlign: "center",
            fontSize: "0.84rem",
            color: "var(--text-dim)"
          }}
        >
          <div>
            Built with React, Three.js &amp; WebGL. Designed for High Performance &amp; AI Engineering.
          </div>
          <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} {profile.name} • All Rights Reserved
          </div>
        </footer>

      </div>
    </section>
  );
}
