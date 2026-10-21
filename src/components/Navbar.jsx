import React, { useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";

export default function Navbar({
  activeSection,
  onNavigate,
  socials,
  currentTheme = "studio",
  onSelectTheme
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
        {/* Segmented Theme Switcher */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "3px",
          gap: "3px"
        }}>
          <button
            onClick={() => onSelectTheme?.("studio")}
            title="Pro Studio AI Theme"
            style={{
              background: currentTheme === "studio" ? "linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(56, 189, 248, 0.25))" : "transparent",
              border: currentTheme === "studio" ? "1px solid #6366f1" : "1px solid transparent",
              color: currentTheme === "studio" ? "#ffffff" : "var(--text-muted)",
              borderRadius: "16px",
              padding: "4px 10px",
              fontSize: "0.78rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease"
            }}
          >
            <span>⚡</span>
            <span>Studio</span>
          </button>
          <button
            onClick={() => onSelectTheme?.("ancient")}
            title="Ancient City (Minecraft Deep Dark) Theme"
            style={{
              background: currentTheme === "ancient" ? "linear-gradient(135deg, rgba(0, 245, 212, 0.35), rgba(2, 132, 199, 0.25))" : "transparent",
              border: currentTheme === "ancient" ? "1px solid #00f5d4" : "1px solid transparent",
              color: currentTheme === "ancient" ? "#ffffff" : "var(--text-muted)",
              borderRadius: "16px",
              padding: "4px 10px",
              fontSize: "0.78rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease"
            }}
          >
            <span>🌌</span>
            <span>Ancient City</span>
          </button>
        </div>

        <a href={socials?.resume || "/KrishnaMittal_Resume.pdf"} download className="btn-sculk" style={{ padding: "7px 18px", fontSize: ".82rem", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", fontWeight: "600" }}>
          <Download size={14} /><span>Resume</span>
        </a>
      </div>
    </header>

    {/* Mobile Nav Panel */}
    <div className={`mobile-nav-panel ${isMobileMenuOpen ? "open" : ""}`}>
      {/* Mobile Theme Switcher Row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        marginBottom: "12px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.08)"
      }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>Active Theme:</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => { onSelectTheme?.("studio"); }}
            style={{
              background: currentTheme === "studio" ? "rgba(99, 102, 241, 0.3)" : "transparent",
              border: currentTheme === "studio" ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
              color: "#ffffff",
              padding: "5px 10px",
              borderRadius: "12px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            ⚡ Studio
          </button>
          <button
            onClick={() => { onSelectTheme?.("ancient"); }}
            style={{
              background: currentTheme === "ancient" ? "rgba(0, 245, 212, 0.3)" : "transparent",
              border: currentTheme === "ancient" ? "1px solid #00f5d4" : "1px solid rgba(255,255,255,0.1)",
              color: "#ffffff",
              padding: "5px 10px",
              borderRadius: "12px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            🌌 Ancient City
          </button>
        </div>
      </div>

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
