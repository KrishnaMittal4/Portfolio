import React, { Suspense, lazy, useState, useEffect, useRef } from "react";

const AncientCityScene = lazy(() => import("./three/AncientCityScene"));
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import ContactSection from "./components/ContactSection";
import ProjectCaseStudyModal from "./components/ProjectCaseStudyModal";
import { loadPortfolioData } from "./data/portfolioData";

export default function App() {
  const [portfolioData] = useState(() => loadPortfolioData());
  // Ancient City is the only public theme. Studio remains in the source for easy restoration later.
  const theme = "ancient";

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [activeCaseStudyId, setActiveCaseStudyId] = useState(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneQuality, setSceneQuality] = useState("medium");
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Load the decorative 3D scene after primary content is interactive.
  // Respect reduced-motion and scale rendering cost to the device.
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const configureScene = () => {
      const reduceMotion = motionQuery.matches;
      const isMobile = mobileQuery.matches;
      const memory = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;

      setReducedMotion(reduceMotion);
      if (reduceMotion || isMobile) {
        setSceneQuality("low");
      } else if (memory >= 8 && cores >= 8 && window.devicePixelRatio <= 2) {
        setSceneQuality("high");
      } else {
        setSceneQuality("medium");
      }
    };

    configureScene();
    motionQuery.addEventListener?.("change", configureScene);
    mobileQuery.addEventListener?.("change", configureScene);

    let idleId;
    let timeoutId;
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(() => setSceneReady(true), { timeout: 1400 });
    } else {
      timeoutId = window.setTimeout(() => setSceneReady(true), 700);
    }

    return () => {
      motionQuery.removeEventListener?.("change", configureScene);
      mobileQuery.removeEventListener?.("change", configureScene);
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0;
      setScrollProgress(progress);

      const sectionElements = sectionRefs.map(r => r.current);
      const viewportMid = window.scrollY + window.innerHeight * 0.45;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= viewportMid) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index) => {
    const targetEl = sectionRefs[index]?.current;
    if (targetEl) {
      const navOffset = 70;
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - navOffset),
        behavior: "smooth"
      });
    }
  };

  // Smooth cursor tracking for background spotlight
  useEffect(() => {
    let frameId;
    const handlePointerMove = (e) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div data-theme={theme} style={{ position: "relative", minHeight: "100vh", backgroundColor: "var(--bg-abyss)" }}>
      {/* Decorative 3D background is deferred so core portfolio content loads first. */}
      {sceneReady && !reducedMotion && (
        <Suspense fallback={null}>
          <AncientCityScene
            scrollProgress={scrollProgress}
            activeSection={activeSection}
            isFreeRoam={false}
            quality={sceneQuality}
            projects={portfolioData.projects}
            hoveredProjectId={hoveredProjectId}
            onSelectProject={(id) => setActiveCaseStudyId(id)}
          />
        </Suspense>
      )}

      {/* Cyber Dot-Grid & Dynamic Cursor Spotlight */}
      <div className="cyber-dot-grid" />
      <div className="cursor-spotlight" />

      {/* Top HUD Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        socials={portfolioData.socials}
        currentTheme={theme}
      />

      {/* Scrollable Content Sections */}
      <main className="content-wrapper">
        <div ref={sectionRefs[0]}>
          <HeroSection
            profile={portfolioData.profile}
            socials={portfolioData.socials}
            onNavigate={scrollToSection}
          />
        </div>

        <div ref={sectionRefs[1]}>
          <AboutSection
            about={portfolioData.about}
            experience={portfolioData.experience}
          />
        </div>

        <div ref={sectionRefs[2]}>
          <ProjectsSection
            projects={portfolioData.projects}
            hoveredProjectId={hoveredProjectId}
            onHoverProject={(id) => setHoveredProjectId(id)}
            onInspectProject={(id) => setActiveCaseStudyId(id)}
          />
        </div>

        <div ref={sectionRefs[3]}>
          <SkillsSection skills={portfolioData.skills} />
        </div>

        <div ref={sectionRefs[4]}>
          <ContactSection
            socials={portfolioData.socials}
            profile={portfolioData.profile}
          />
        </div>
      </main>

      {/* Interactive Project Architecture & Case Study Modal */}
      {activeCaseStudyId && (
        <ProjectCaseStudyModal
          projectId={activeCaseStudyId}
          onClose={() => setActiveCaseStudyId(null)}
        />
      )}
    </div>
  );
}
