import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StudioScene({
  scrollProgress = 0,
  activeSection = 0,
  isFreeRoam = false,
  quality = "high"
}) {
  const mountRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  const isFreeRoamRef = useRef(isFreeRoam);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const orbitRef = useRef({ theta: 0, phi: Math.PI / 2.3, radius: 24, isDragging: false, lastX: 0, lastY: 0 });

  scrollRef.current = scrollProgress;
  isFreeRoamRef.current = isFreeRoam;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.022);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 26);

    const renderer = new THREE.WebGLRenderer({ antialias: quality === "high", alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 2 : 1));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Subtle Ambient & Directional Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0x818cf8, 2.5);
    keyLight.position.set(15, 20, 20);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 3.5, 60);
    fillLight.position.set(-18, -10, 15);
    scene.add(fillLight);

    const centerGlow = new THREE.PointLight(0x6366f1, 4.0, 45);
    centerGlow.position.set(0, 0, 0);
    scene.add(centerGlow);

    // ─── Neural Constellation Network ─────────────────────────────────
    const nodeCount = quality === "high" ? 110 : 65;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeVelocities = [];

    for (let i = 0; i < nodeCount; i++) {
      const idx = i * 3;
      // Ellipsoidal distribution around center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 5 + Math.random() * 12;

      nodePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      nodePositions[idx + 1] = (r * Math.cos(phi)) * 0.65;
      nodePositions[idx + 2] = r * Math.sin(phi) * Math.sin(theta);

      nodeVelocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.008,
        baseX: nodePositions[idx],
        baseY: nodePositions[idx + 1],
        baseZ: nodePositions[idx + 2],
        phase: Math.random() * Math.PI * 2
      });
    }

    // Node Points
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));

    // Circle texture for smooth glow dots
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(129, 140, 248, 0.9)");
    grad.addColorStop(0.6, "rgba(56, 189, 248, 0.4)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const pointTexture = new THREE.CanvasTexture(canvas);

    const nodeMat = new THREE.PointsMaterial({
      size: 0.85,
      map: pointTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // ─── Main Constellation Container for Apple/Stripe Dynamic Parallax ──
    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    const nodeCloud = new THREE.Points(nodeGeo, nodeMat);
    constellationGroup.add(nodeCloud);

    // Synaptic Connecting Lines
    const maxConnections = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    constellationGroup.add(lineSegments);

    // ─── Neural Synapse Signal Pulses (Traveling Data Packets) ───────────
    const pulseCount = quality === "high" ? 24 : 12;
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));

    const pulseCanvas = document.createElement("canvas");
    pulseCanvas.width = 64;
    pulseCanvas.height = 64;
    const pCtx = pulseCanvas.getContext("2d");
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    pGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    pGrad.addColorStop(0.25, "rgba(56, 189, 248, 1)");
    pGrad.addColorStop(0.65, "rgba(99, 102, 241, 0.7)");
    pGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pulseTexture = new THREE.CanvasTexture(pulseCanvas);

    const pulseMat = new THREE.PointsMaterial({
      size: 1.5,
      map: pulseTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const pulseCloud = new THREE.Points(pulseGeo, pulseMat);
    constellationGroup.add(pulseCloud);

    // Initialize pulse state
    const pulses = [];
    for (let p = 0; p < pulseCount; p++) {
      pulses.push({
        from: Math.floor(Math.random() * nodeCount),
        to: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.45
      });
    }

    // ─── Floating Geometric Prisms (Linear / Vercel Spatial Aesthetic) ──
    const prismGroup = new THREE.Group();
    constellationGroup.add(prismGroup);

    // Primary central icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(2.4, 0);
    const icoMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.45,
      transparent: true,
      opacity: 0.65,
      wireframe: false
    });
    const primaryIco = new THREE.Mesh(icoGeo, icoMat);
    prismGroup.add(primaryIco);

    // Outer wireframe shell
    const icoWireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const wireIco = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 0), icoWireMat);
    prismGroup.add(wireIco);

    // Secondary satellite octahedron
    const octGeo = new THREE.OctahedronGeometry(1.2, 0);
    const octMat = new THREE.MeshPhysicalMaterial({
      color: 0x818cf8,
      transmission: 0.8,
      transparent: true,
      opacity: 0.6
    });
    const satelliteOct = new THREE.Mesh(octGeo, octMat);
    satelliteOct.position.set(-6, 3, -4);
    prismGroup.add(satelliteOct);

    const satelliteOct2 = new THREE.Mesh(octGeo, octMat);
    satelliteOct2.position.set(7, -2.5, -3);
    prismGroup.add(satelliteOct2);

    // Ambient floating dust particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 50;
      dustPos[i + 1] = (Math.random() - 0.5) * 35;
      dustPos[i + 2] = (Math.random() - 0.5) * 40;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.25,
      color: 0x818cf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    constellationGroup.add(dust);

    // ─── Interaction Handlers ─────────────────────────────────────────
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
        orbitRef.current.radius = Math.max(10, Math.min(48, orbitRef.current.radius + e.deltaY * 0.02));
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
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Update Node Positions
      const positions = nodeGeo.attributes.position.array;
      for (let i = 0; i < nodeCount; i++) {
        const idx = i * 3;
        const vel = nodeVelocities[i];
        vel.phase += delta * 0.6;

        positions[idx] = vel.baseX + Math.sin(vel.phase) * 0.9;
        positions[idx + 1] = vel.baseY + Math.cos(vel.phase * 1.3) * 0.7;
        positions[idx + 2] = vel.baseZ + Math.sin(vel.phase * 0.8) * 0.9;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      // Update Synaptic Connection Lines
      let lineVertexIdx = 0;
      let lineCount = 0;
      const maxDistance = quality === "high" ? 4.8 : 4.0;
      const linePositionsArr = lineGeo.attributes.position.array;
      const lineColorsArr = lineGeo.attributes.color.array;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const i3 = i * 3;
          const j3 = j * 3;
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = 1.0 - dist / maxDistance;
            // First vertex
            linePositionsArr[lineVertexIdx] = positions[i3];
            linePositionsArr[lineVertexIdx + 1] = positions[i3 + 1];
            linePositionsArr[lineVertexIdx + 2] = positions[i3 + 2];
            lineColorsArr[lineVertexIdx] = 0.39 * alpha;
            lineColorsArr[lineVertexIdx + 1] = 0.4 * alpha;
            lineColorsArr[lineVertexIdx + 2] = 0.95 * alpha;
            lineVertexIdx += 3;

            // Second vertex
            linePositionsArr[lineVertexIdx] = positions[j3];
            linePositionsArr[lineVertexIdx + 1] = positions[j3 + 1];
            linePositionsArr[lineVertexIdx + 2] = positions[j3 + 2];
            lineColorsArr[lineVertexIdx] = 0.22 * alpha;
            lineColorsArr[lineVertexIdx + 1] = 0.74 * alpha;
            lineColorsArr[lineVertexIdx + 2] = 0.97 * alpha;
            lineVertexIdx += 3;

            lineCount++;
          }
        }
      }
      lineGeo.setDrawRange(0, lineCount * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // Rotate geometric prisms
      primaryIco.rotation.x = elapsed * 0.18;
      primaryIco.rotation.y = elapsed * 0.25;
      wireIco.rotation.x = -elapsed * 0.14;
      wireIco.rotation.y = -elapsed * 0.2;

      satelliteOct.rotation.x = elapsed * 0.3;
      satelliteOct.rotation.y = elapsed * 0.2;
      satelliteOct.position.y = 3 + Math.sin(elapsed * 1.2) * 0.6;

      satelliteOct2.rotation.x = -elapsed * 0.25;
      satelliteOct2.rotation.y = elapsed * 0.35;
      satelliteOct2.position.y = -2.5 + Math.cos(elapsed * 1.1) * 0.6;

      // Update Neural Synapse Pulses
      const pulsePosArr = pulseGeo.attributes.position.array;
      const validDist = quality === "high" ? 4.8 : 4.0;
      for (let p = 0; p < pulseCount; p++) {
        const pulse = pulses[p];
        pulse.progress += delta * pulse.speed;

        if (pulse.progress >= 1.0) {
          pulse.progress = 0;
          pulse.from = pulse.to;
          // Find adjacent connected node
          const cand = [];
          const fromIdx = pulse.from * 3;
          for (let k = 0; k < nodeCount; k++) {
            if (k !== pulse.from) {
              const kIdx = k * 3;
              const dx = positions[fromIdx] - positions[kIdx];
              const dy = positions[fromIdx + 1] - positions[kIdx + 1];
              const dz = positions[fromIdx + 2] - positions[kIdx + 2];
              if (Math.sqrt(dx * dx + dy * dy + dz * dz) < validDist) {
                cand.push(k);
              }
            }
          }
          pulse.to = cand.length > 0 ? cand[Math.floor(Math.random() * cand.length)] : Math.floor(Math.random() * nodeCount);
        }

        const fIdx = pulse.from * 3;
        const tIdx = pulse.to * 3;
        const prog = pulse.progress;
        const p3 = p * 3;

        pulsePosArr[p3] = positions[fIdx] + (positions[tIdx] - positions[fIdx]) * prog;
        pulsePosArr[p3 + 1] = positions[fIdx + 1] + (positions[tIdx + 1] - positions[fIdx + 1]) * prog;
        pulsePosArr[p3 + 2] = positions[fIdx + 2] + (positions[tIdx + 2] - positions[fIdx + 2]) * prog;
      }
      pulseGeo.attributes.position.needsUpdate = true;

      // ─── Apple / Stripe Style Parallax Dynamic 3D Tilt ────────────────
      constellationGroup.rotation.y = elapsed * 0.03 + mouseRef.current.x * 0.35;
      constellationGroup.rotation.x = -mouseRef.current.y * 0.25;
      constellationGroup.rotation.z = mouseRef.current.x * 0.08;
      dust.rotation.y = -elapsed * 0.012;

      // Camera Positioning: Cinematic vs Free Roam
      if (isFreeRoamRef.current) {
        const { theta, phi, radius } = orbitRef.current;
        camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
        camera.position.y = radius * Math.cos(phi);
        camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
        camera.lookAt(0, 0, 0);
      } else {
        const p = scrollRef.current;
        // Enhanced Spatial Parallax Camera Trajectory
        const targetCamX = Math.sin(p * Math.PI * 1.8) * 6 + mouseRef.current.x * 4.5;
        const targetCamY = 2 - p * 8 + mouseRef.current.y * 3.2;
        const targetCamZ = 24 - p * 14;

        camera.position.x += (targetCamX - camera.position.x) * 0.055;
        camera.position.y += (targetCamY - camera.position.y) * 0.055;
        camera.position.z += (targetCamZ - camera.position.z) * 0.055;
        camera.lookAt(mouseRef.current.x * 2.5, -p * 2 + mouseRef.current.y * 1.5, 0);
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

      // Dispose resources
      nodeGeo.dispose();
      nodeMat.dispose();
      pointTexture.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      pulseTexture.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      icoWireMat.dispose();
      octGeo.dispose();
      octMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
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
