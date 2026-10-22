import React, { useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";

export default function Navbar({
  activeSection,
  onNavigate,
  socials,
  currentTheme = "ancient"
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAncient = currentTheme === "ancient";
  const currentMeta = {
    name: isAncient ? "Ancient City" : "Pro Studio",
    logoIcon: "KM",
    titleMain: "KRISHNA ",
    titleGrad: "MITTAL",
    sub: isAncient ? "SCULK ARCHIVES & AI" : "SOFTWARE & AI/ML ENGINEER",
    bgGrad: isAncient
      ? "linear-gradient(135deg, #00f5d4, #0284c7)"
      : "linear-gradient(135deg, #6366f1, #38bdf8)",
    boxShadow: isAncient
      ? "0 0 18px rgba(0, 245, 212, 0.55)"
      : "0 0 18px rgba(99, 102, 241, 0.55)",
    navItems: [
      { id: 0, label: "Overview", icon: "✦" },
      { id: 1, label: "About & Exp", icon: "⚡" },
      { id: 2, label: "Projects", icon: "🚀" },
      { id: 3, label: "Skills", icon: "🧠" },
      { id: 4, label: "Contact", icon: "📡" }
    ]
  };

  return (
    <>
    <header className="nav-hud interactive-panel">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => onNavigate(0)}
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: currentMeta.bgGrad,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: currentMeta.boxShadow,
          fontWeight: "800",
          fontSize: "0.95rem",
          color: "#ffffff"
        }}>
          KM
        </div>
        <div>
          <span className="ancient-title" style={{ fontSize: "1.02rem", fontWeight: "800", letterSpacing: "1px" }}>
            {currentMeta.titleMain}
            <span className="sculk-gradient-text">{currentMeta.titleGrad}</span>
          </span>
        </div>
      </div>

      {/* Desktop Nav Waypoints */}
      <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {currentMeta.navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={isActive ? "nav-dot-active" : ""}
              style={{
                background: isActive ? (isAncient ? "rgba(0, 245, 212, 0.15)" : "rgba(99, 102, 241, 0.18)") : "transparent",
                border: isActive ? "1px solid var(--sculk-primary)" : "1px solid transparent",
                color: isActive ? "#ffffff" : "var(--text-muted)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.86rem",
                fontWeight: isActive ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#ffffff";
                if (!isActive) e.currentTarget.style.background = isAncient ? "rgba(0, 245, 212, 0.08)" : "rgba(99, 102, 241, 0.08)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-muted)";
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        className={`hamburger-btn ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(prev => !prev)}
        aria-label="Toggle mobile menu"
        style={{ marginLeft: "auto" }}
      >
        <span /><span /><span />
      </button>

      {/* Right Action: Theme Switcher & Resume Download */}
      <div className="nav-actions-desktop" style={{ display: "flex", alignItems: "center", gap: "10px" }}>


        <a href={socials?.resume || "/KrishnaMittal_Resume.pdf"} download className="btn-sculk" style={{ padding: "7px 18px", fontSize: ".82rem", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", fontWeight: "600" }}>
          <Download size={14} /><span>Resume</span>
        </a>
      </div>
    </header>

    {/* Mobile Nav Panel */}
    <div className={`mobile-nav-panel ${isMobileMenuOpen ? "open" : ""}`}>


      {currentMeta.navItems.map((item) => (
        <button
          key={item.id}
          className={`mobile-nav-btn ${activeSection === item.id ? "active" : ""}`}
          onClick={() => {
            onNavigate(item.id);
            setIsMobileMenuOpen(false);
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
          <span>{item.label}</span>
          {activeSection === item.id && (
            <span style={{
              marginLeft: "auto",
              width: "6px", height: "6px",
              borderRadius: "50%",
              background: "var(--sculk-primary)",
              boxShadow: "0 0 8px var(--sculk-primary)"
            }} />
          )}
        </button>
      ))}
    </div>
  </>
  );
}
