import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SpatialScene({
  scrollProgress = 0,
  activeSection = 0,
  isFreeRoam = false,
  quality = "high"
}) {
  const mountRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  const isFreeRoamRef = useRef(isFreeRoam);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const orbitRef = useRef({ theta: 0, phi: Math.PI / 2.3, radius: 22, isDragging: false, lastX: 0, lastY: 0 });

  scrollRef.current = scrollProgress;
  isFreeRoamRef.current = isFreeRoam;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup with atmospheric spatial depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080d1a, 0.025);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: quality === "high", alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 2 : 1));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Multi-Point Spatial Lighting (Lavender + Rose + Ice Specular)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLavender = new THREE.PointLight(0xc084fc, 4.5, 50);
    keyLavender.position.set(12, 14, 15);
    scene.add(keyLavender);

    const fillRose = new THREE.PointLight(0xf472b6, 3.8, 45);
    fillRose.position.set(-14, -8, 12);
    scene.add(fillRose);

    const iceCyanRim = new THREE.DirectionalLight(0x38bdf8, 2.0);
    iceCyanRim.position.set(0, 20, -10);
    scene.add(iceCyanRim);

    // ─── Floating Refractive Glass Objects (visionOS / Spatial UI) ─────
    const glassGroup = new THREE.Group();
    scene.add(glassGroup);

    // 1. Central Refractive Glass Torus (Mobius ring feel)
    const torusGeo = new THREE.TorusGeometry(3.6, 0.75, 24, quality === "high" ? 64 : 36);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.52,
      thickness: 1.8,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      attenuationColor: 0xc084fc,
      attenuationDistance: 4.0
    });
    const mainTorus = new THREE.Mesh(torusGeo, glassMaterial);
    glassGroup.add(mainTorus);

    // Inner glowing core sphere inside torus
    const coreSphereGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const coreSphereMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0xc084fc,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.5
    });
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    glassGroup.add(coreSphere);

    // 2. Satellite Refractive Glass Spheres (Vision Pro floating orbs)
    const orbPositions = [
      { x: -7.5, y: 3.8, z: -3.5, r: 1.5, color: 0xf472b6 },
      { x: 8.2, y: -2.8, z: -2.0, r: 1.8, color: 0x38bdf8 },
      { x: -5.0, y: -5.0, z: 2.0, r: 1.1, color: 0xc084fc },
      { x: 6.0, y: 5.2, z: 1.5, r: 1.2, color: 0xf472b6 }
    ];

    const orbs = [];
    orbPositions.forEach((pos, idx) => {
      const orbGeo = new THREE.SphereGeometry(pos.r, quality === "high" ? 36 : 24, quality === "high" ? 36 : 24);
      const orbMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.88,
        opacity: 0.95,
        transparent: true,
        roughness: 0.12,
        ior: 1.48,
        thickness: 1.2,
        clearcoat: 1.0,
        attenuationColor: pos.color,
        attenuationDistance: 3.0
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.position.set(pos.x, pos.y, pos.z);
      glassGroup.add(orbMesh);
      orbs.push({ mesh: orbMesh, baseY: pos.y, phase: idx * 1.5, speed: 0.8 + idx * 0.2 });
    });

    // 3. Ambient Aurora Floating Dust & Light Sprites
    const particleCount = quality === "high" ? 140 : 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xc084fc), // lavender
      new THREE.Color(0xf472b6), // rose
      new THREE.Color(0x38bdf8), // ice blue
      new THREE.Color(0xffffff)  // specular white
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePos[i3] = (Math.random() - 0.5) * 44;
      particlePos[i3 + 1] = (Math.random() - 0.5) * 32;
      particlePos[i3 + 2] = (Math.random() - 0.5) * 36;

      const c = palette[i % palette.length];
      particleColors[i3] = c.r;
      particleColors[i3 + 1] = c.g;
      particleColors[i3 + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    // Circular soft gradient texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const radGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 15);
    radGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    radGrad.addColorStop(0.5, "rgba(192, 132, 252, 0.6)");
    radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 32, 32);
    const pTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.6,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // ─── Interaction Listeners ─────────────────────────────────────────
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isFreeRoamRef.current && orbitRef.current.isDragging) {
        const deltaX = e.clientX - orbitRef.current.lastX;
        const deltaY = e.clientY - orbitRef.current.lastY;
        orbitRef.current.theta -= deltaX * 0.005;
        orbitRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, orbitRef.current.phi - deltaY * 0.005));
        orbitRef.current.lastX = e.clientX;
        orbitRef.current.lastY = e.clientY;
      }
    };

    const handleMouseDown = (e) => {
      if (isFreeRoamRef.current) {
        orbitRef.current.isDragging = true;
        orbitRef.current.lastX = e.clientX;
        orbitRef.current.lastY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      orbitRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
      if (isFreeRoamRef.current) {
        orbitRef.current.radius = Math.max(10, Math.min(46, orbitRef.current.radius + e.deltaY * 0.02));
      }
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("resize", handleResize);

    // ─── Animation Loop ───────────────────────────────────────────────
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Animate Main Glass Torus
      mainTorus.rotation.x = elapsed * 0.22;
      mainTorus.rotation.y = elapsed * 0.32;
      mainTorus.rotation.z = Math.sin(elapsed * 0.4) * 0.2;

      // Animate Core Sphere pulse
      coreSphere.scale.setScalar(1 + Math.sin(elapsed * 2.0) * 0.06);

      // Animate Satellite Glass Orbs
      orbs.forEach((orb) => {
        orb.mesh.position.y = orb.baseY + Math.sin(elapsed * orb.speed + orb.phase) * 0.85;
        orb.mesh.rotation.x = elapsed * 0.2;
        orb.mesh.rotation.y = elapsed * 0.25;
      });

      // Slowly rotate dust particles
      dustParticles.rotation.y = elapsed * 0.02;

      // Camera Trajectory
      if (isFreeRoamRef.current) {
        const { theta, phi, radius } = orbitRef.current;
        camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
        camera.position.y = radius * Math.cos(phi);
        camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
        camera.lookAt(0, 0, 0);
      } else {
        const p = scrollRef.current;
        // Spatial camera path gliding around refractive objects
        const targetCamX = Math.sin(p * Math.PI * 1.5) * 5.5 + mouseRef.current.x * 2.2;
        const targetCamY = 1.5 - p * 7 + mouseRef.current.y * 1.6;
        const targetCamZ = 24 - p * 12;

        camera.position.x += (targetCamX - camera.position.x) * 0.06;
        camera.position.y += (targetCamY - camera.position.y) * 0.06;
        camera.position.z += (targetCamZ - camera.position.z) * 0.06;
        camera.lookAt(mouseRef.current.x * 1.2, -p * 1.8, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      torusGeo.dispose();
      glassMaterial.dispose();
      coreSphereGeo.dispose();
      coreSphereMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pTexture.dispose();
      orbs.forEach(o => {
        o.mesh.geometry.dispose();
        o.mesh.material.dispose();
      });
      renderer.dispose();
    };
  }, [quality]);

  return (
    <div
      ref={mountRef}
      className={`canvas-container ${isFreeRoam ? "free-roam-active" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: isFreeRoam ? "auto" : "none"
      }}
    />
  );
}
