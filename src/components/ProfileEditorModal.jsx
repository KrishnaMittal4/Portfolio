import React, { useState } from "react";
import { X, Save, RotateCcw, Download, Sparkles } from "lucide-react";
import { savePortfolioData, resetPortfolioData } from "../data/portfolioData";

export default function ProfileEditorModal({ data, onSave, onClose }) {
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState("profile");
  const [saveToast, setSaveToast] = useState(false);

  const handleProfileChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleSocialChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    savePortfolioData(formData);
    onSave(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Reset all portfolio configuration to default Ancient City data?")) {
      const reset = resetPortfolioData();
      setFormData(JSON.parse(JSON.stringify(reset)));
      onSave(reset);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolioData.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel interactive-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(94%, 720px)",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          padding: "28px",
          position: "relative",
          border: "1px solid var(--sculk-primary)",
          boxShadow: "0 0 40px rgba(0, 245, 212, 0.25)"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 className="ancient-title" style={{ fontSize: "1.4rem", color: "#ffffff" }}>
              CUSTOMIZE <span className="sculk-gradient-text">PROFILE DATA</span>
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Customize personal details, titles, and links in real-time.
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(56, 189, 248, 0.2)", paddingBottom: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              background: activeTab === "profile" ? "rgba(0, 245, 212, 0.2)" : "transparent",
              border: activeTab === "profile" ? "1px solid var(--sculk-primary)" : "none",
              color: activeTab === "profile" ? "#ffffff" : "var(--text-muted)",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.88rem"
            }}
          >
            Identity & Bio
          </button>
          <button
            onClick={() => setActiveTab("socials")}
            style={{
              background: activeTab === "socials" ? "rgba(0, 245, 212, 0.2)" : "transparent",
              border: activeTab === "socials" ? "1px solid var(--sculk-primary)" : "none",
              color: activeTab === "socials" ? "#ffffff" : "var(--text-muted)",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.88rem"
            }}
          >
            Contact & Links
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ flexGrow: 1, overflowY: "auto", paddingRight: "8px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {activeTab === "profile" ? (
            <>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={formData.profile.title}
                  onChange={(e) => handleProfileChange("title", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Hero Tagline
                </label>
                <input
                  type="text"
                  value={formData.profile.tagline}
                  onChange={(e) => handleProfileChange("tagline", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Detailed Biography / Philosophy
                </label>
                <textarea
                  rows={4}
                  value={formData.about.summary}
                  onChange={(e) => setFormData({ ...formData, about: { ...formData.about, summary: e.target.value } })}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Availability Status
                </label>
                <input
                  type="text"
                  value={formData.profile.status}
                  onChange={(e) => handleProfileChange("status", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.socials.email}
                  onChange={(e) => handleSocialChange("email", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={formData.socials.github}
                  onChange={(e) => handleSocialChange("github", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formData.socials.linkedin || ""}
                  onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.socials.phone || ""}
                  onChange={(e) => handleSocialChange("phone", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Location
                </label>
                <input
                  type="text"
                  value={formData.profile.location || ""}
                  onChange={(e) => handleProfileChange("location", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(6, 16, 32, 0.9)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "6px", color: "#fff" }}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(56, 189, 248, 0.15)", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleReset}
              className="btn-secondary"
              style={{ fontSize: "0.82rem", padding: "6px 12px" }}
              title="Reset back to default values"
            >
              <RotateCcw size={14} />
              <span>Defaults</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="btn-secondary"
              style={{ fontSize: "0.82rem", padding: "6px 12px" }}
              title="Export configuration as JSON file"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {saveToast && (
              <span style={{ fontSize: "0.82rem", color: "#00f5d4" }}>
                ✓ Saved live!
              </span>
            )}
            <button
              onClick={handleSave}
              className="btn-sculk"
              style={{ fontSize: "0.88rem", padding: "8px 20px" }}
            >
              <Save size={15} />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
