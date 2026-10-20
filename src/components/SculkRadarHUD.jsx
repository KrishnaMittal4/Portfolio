import React, { useState, useEffect } from "react";
import { Activity, ShieldAlert, Compass } from "lucide-react";

export default function SculkRadarHUD({ scrollProgress, activeSection, isFreeRoam, isSonicBooming, theme = "studio" }) {
  const [pulse, setPulse] = useState(false);
  const isStudio = theme === "studio";
  const isEndCity = theme === "endcity";

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(timer);
  }, [activeSection, scrollProgress]);

  // Coordinates simulation
  const coordY = isStudio ? 100 : (isEndCity ? 72 : -54);
  const coordZ = Math.round(28 - (scrollProgress || 0) * 26);
  const coordX = Math.round(Math.sin((scrollProgress || 0) * Math.PI * 2) * 12);

  const waypointsNames = isStudio
    ? ["EXECUTIVE SUMMARY", "BIO & ARCHITECTURE", "FEATURED WORK", "NEURAL STACK", "DIRECT FREQUENCY"]
    : (isEndCity
        ? ["PURPUR SPIRES", "OUTER COLONNADE", "CHAMBER OF RELICS", "SHULKER GROVE", "VOID APEX"]
        : ["RUINS PORTAL", "SCULK ARCHIVES", "CHAMBER OF RELICS", "WARDEN'S LAIR", "ALTAR OF ECHOES"]);

  return (
    <div 
      className="interactive-panel"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "24px",
        zIndex: 90,
        background: "rgba(7, 9, 14, 0.85)",
        backdropFilter: "blur(14px)",
        border: isStudio
          ? "1px solid rgba(99, 102, 241, 0.35)"
          : (isEndCity ? "1px solid rgba(232, 121, 249, 0.3)" : "1px solid rgba(56, 189, 248, 0.25)"),
        borderRadius: "12px",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.76rem",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)"
      }}
    >
      {/* Mini Radar Circular Display */}
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border: isEndCity ? "1px solid rgba(232, 121, 249, 0.45)" : "1px solid rgba(0, 245, 212, 0.4)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isEndCity
          ? "radial-gradient(circle, rgba(232, 121, 249, 0.15) 0%, rgba(4, 1, 10, 0.85) 70%)"
          : "radial-gradient(circle, rgba(0, 245, 212, 0.1) 0%, rgba(3, 8, 20, 0.8) 70%)"
      }}>
        {/* Radar crosshairs */}
        <div style={{ position: "absolute", width: "100%", height: "1px", background: isEndCity ? "rgba(232, 121, 249, 0.2)" : "rgba(0, 245, 212, 0.2)" }} />
        <div style={{ position: "absolute", width: "1px", height: "100%", background: isEndCity ? "rgba(232, 121, 249, 0.2)" : "rgba(0, 245, 212, 0.2)" }} />
        
        {/* Blip representing player/camera */}
        <div style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: isEndCity ? "#fde047" : "#00f5d4",
          boxShadow: isEndCity ? "0 0 8px #fde047" : "0 0 8px #00f5d4",
          transform: `translate(${coordX * 0.5}px, ${-(coordZ - 10) * 0.4}px)`
        }} />

        {/* Pulse ring on vibration */}
        {pulse && (
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: isEndCity ? "1px solid #e879f9" : "1px solid #00f5d4",
            animation: "sculkHeartbeat 0.6s ease-out"
          }} />
        )}
      </div>

      {/* Coordinate & Sector Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ color: isEndCity ? "#e879f9" : "var(--sculk-primary)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>SECTOR:</span>
          <span style={{ color: "#ffffff" }}>
            {waypointsNames[activeSection] || (isEndCity ? "VOID APEX" : "DEEP REALM")}
          </span>
        </div>
        <div style={{ color: "var(--text-dim)", display: "flex", gap: "10px" }}>
          <span>X: {coordX}</span>
          <span>Y: {coordY}</span>
          <span>Z: {coordZ}</span>
        </div>
      </div>

      {/* Status indicator */}
      <div style={{
        borderLeft: "1px solid var(--deepslate-border)",
        paddingLeft: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "2px"
      }}>
        <div style={{
          color: isStudio ? "#818cf8" : (isEndCity ? "#e879f9" : (activeSection === 3 ? "#f43f5e" : "#00f5d4")),
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontWeight: "500"
        }}>
          {activeSection === 3 && !isStudio ? <ShieldAlert size={13} /> : <Activity size={13} />}
          <span>
            {isStudio
              ? "✦ NEURAL ENGINE: 60 FPS • ACCELERATED"
              : (isEndCity
                  ? (activeSection === 3 ? "💎 SHULKER VIGILANCE: ACTIVE" : "VOID GRAVITY: STABLE (ZERO-G)")
                  : (activeSection === 3 ? "WARDEN ALERTED" : "SCULK VIBRATION: STABLE"))}
          </span>
        </div>
        <div style={{ color: "var(--text-dim)", display: "flex", gap: "6px" }}>
          <span>{isFreeRoam ? "FREE ROAM" : `ORBIT: ${Math.round((scrollProgress || 0) * 100)}%`}</span>
          <span>•</span>
          <span style={{ color: isStudio ? "#818cf8" : (isEndCity ? "#e879f9" : "var(--sculk-primary)") }}>
            {isStudio ? "PRO STUDIO UI/UX" : (isEndCity ? "END CITY DIMENSION" : "[B] SONIC BOOM")}
          </span>
        </div>
      </div>
    </div>
  );
}
