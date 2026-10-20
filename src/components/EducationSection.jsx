import React from "react";
import { GraduationCap, MapPin, CalendarDays, BrainCircuit } from "lucide-react";

export default function EducationSection({ education }) {
  return (
    <section className="portfolio-section" style={{ minHeight: "auto", paddingTop: "72px", paddingBottom: "72px" }}>
      <div className="section-reveal" style={{ maxWidth: "920px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span className="badge-sculk">EDUCATION</span>
          <h2 style={{ marginTop: "14px", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}>Academic Foundation</h2>
        </div>
        <div className="interactive-panel" style={{ padding: "26px", border: "1px solid rgba(99,102,241,.28)", borderRadius: "18px", background: "rgba(15,23,42,.72)" }}>
          <div style={{ display: "flex", gap: "18px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(99,102,241,.16)", border: "1px solid rgba(99,102,241,.35)" }}><GraduationCap size={25} color="#a5b4fc" /></div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 6 }}>{education.degree}</h3>
              <div style={{ color: "#7dd3fc", fontWeight: 650, marginBottom: 14 }}>{education.university}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", color: "var(--text-muted)", fontSize: ".9rem" }}>
                <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><BrainCircuit size={15} /> {education.specialization}</span>
                <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><CalendarDays size={15} /> {education.period}</span>
                <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><MapPin size={15} /> {education.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
