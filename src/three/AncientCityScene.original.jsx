import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { sculkAudio } from "../audio/sculkAudio";

export default function AncientCityScene({
  scrollProgress = 0,
  activeSection = 0,
  isFreeRoam = false,
  quality = "high",
  projects = [],
  hoveredProjectId = null,
  onSelectProject = null
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const wardenRef = useRef(null);
  const soulCoreRef = useRef(null);
  const particlesRef = useRef(null);

  // Mouse tracking for camera parallax and Warden cursor lookAt
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isFreeRoamRef = useRef(isFreeRoam);
  isFreeRoamRef.current = isFreeRoam;

  // Track scroll velocity for Warden walk kinematics
  const scrollStateRef = useRef({
    prevProgress: scrollProgress,
    velocity: 0,
    walkPhase: 0
  });

  // Orbit controls state for free roam mode
  const orbitRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    theta: 0,
    phi: Math.PI / 3,
    radius: 28,
    target: new THREE.Vector3(0, 5, 0)
  });

  // Waypoints for smooth cinematic camera tour
  const waypoints = [
    // 0: Hero - Grand overview of portal
    { pos: new THREE.Vector3(0, 8, 26), target: new THREE.Vector3(0, 5.5, 0) },
    // 1: Lore / About - Colonnade walkway
    { pos: new THREE.Vector3(14, 5, 15), target: new THREE.Vector3(2, 4.5, 0) },
    // 2: Relics / Projects - Chamber of Ruins & Ancient Shrine vista
    { pos: new THREE.Vector3(-12, 5.8, 10), target: new THREE.Vector3(-2, 4.2, 0) },
    // 3: Warden / Skills - Intimate face-to-face with the living Warden
    { pos: new THREE.Vector3(0, 4.2, 11), target: new THREE.Vector3(0, 5.2, -2) },
    // 4: Echoes / Contact - High panoramic altar vista
    { pos: new THREE.Vector3(0, 16, 22), target: new THREE.Vector3(0, 4, -5) }
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020611);
    scene.fog = new THREE.FogExp2(0x020611, 0.024);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 150);
    camera.position.copy(waypoints[0].pos);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: quality === "high", powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 2 : 1.2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Cavern Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1628, 1.4);
    scene.add(ambientLight);

    // Main Portal Sculk Blue Point Light
    const portalLight = new THREE.PointLight(0x00f5d4, 3.5, 35, 1.8);
    portalLight.position.set(0, 7, -1);
    scene.add(portalLight);

    // Warden Soul Core Light
    const wardenLight = new THREE.PointLight(0x00e5ff, 2.8, 22, 2);
    wardenLight.position.set(0, 5, -2);
    scene.add(wardenLight);

    // Chamber of Relics Ambient Point Light
    const relicsLight = new THREE.PointLight(0x38bdf8, 2.4, 28, 1.8);
    relicsLight.position.set(-8, 6, -2);
    scene.add(relicsLight);

    // 5. Build Procedural Voxel Ancient City Environment
    buildVoxelAncientCity(scene, quality);

    // 6. Build Animated Living Warden Entity
    const warden = buildVoxelWarden();
    warden.position.set(0, 0, -2);
    scene.add(warden);
    wardenRef.current = warden;

    const core = warden.getObjectByName("soulCore");
    if (core) soulCoreRef.current = core;

    // 7. Floating Soul Catalyst Particles
    const particles = buildSoulParticles(quality);
    scene.add(particles);
    particlesRef.current = particles;

    const handleCanvasMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Orbit controls in Free Roam
      if (orbitRef.current.isDragging && isFreeRoamRef.current) {
        const deltaX = e.clientX - orbitRef.current.prevX;
        const deltaY = e.clientY - orbitRef.current.prevY;
        orbitRef.current.theta -= deltaX * 0.006;
        orbitRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, orbitRef.current.phi - deltaY * 0.006));
        orbitRef.current.prevX = e.clientX;
        orbitRef.current.prevY = e.clientY;
      }
    };

    const handleMouseDown = (e) => {
      if (!isFreeRoamRef.current) return;
      orbitRef.current.isDragging = true;
      orbitRef.current.prevX = e.clientX;
      orbitRef.current.prevY = e.clientY;
    };

    const handleMouseUp = () => {
      orbitRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
      if (!isFreeRoamRef.current) return;
      orbitRef.current.radius = Math.max(8, Math.min(48, orbitRef.current.radius + e.deltaY * 0.02));
    };

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleCanvasMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: true });

    // 10. Master Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId;

    const currentCamPos = new THREE.Vector3().copy(waypoints[0].pos);
    const currentCamTarget = new THREE.Vector3().copy(waypoints[0].target);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Compute scroll velocity for Warden walk cycle kinematics
      const progressDiff = Math.abs((scrollProgress || 0) - scrollStateRef.current.prevProgress);
      scrollStateRef.current.prevProgress = scrollProgress || 0;
      const targetVel = progressDiff / Math.max(delta, 0.001);
      scrollStateRef.current.velocity = THREE.MathUtils.lerp(scrollStateRef.current.velocity, targetVel * 0.4, 0.15);
      const walkSpeed = Math.min(scrollStateRef.current.velocity, 2.5);
      scrollStateRef.current.walkPhase += walkSpeed * delta * 7;

      // Camera Animation (Cinematic Tour vs Free Roam)
      if (isFreeRoamRef.current) {
        const r = orbitRef.current.radius;
        const theta = orbitRef.current.theta;
        const phi = orbitRef.current.phi;
        const t = orbitRef.current.target;

        const targetPos = new THREE.Vector3(
          t.x + r * Math.sin(phi) * Math.sin(theta),
          t.y + r * Math.cos(phi),
          t.z + r * Math.sin(phi) * Math.cos(theta)
        );
        camera.position.lerp(targetPos, 0.08);
        camera.lookAt(t);
      } else {
        const progress = Math.max(0, Math.min(1, scrollProgress || 0));
        const numSegments = waypoints.length - 1;
        const segmentFloat = progress * numSegments;
        const index = Math.min(Math.floor(segmentFloat), numSegments - 1);
        const subT = segmentFloat - index;

        const easeT = subT * subT * (3 - 2 * subT);
        const targetPos = new THREE.Vector3().lerpVectors(waypoints[index].pos, waypoints[index + 1].pos, easeT);
        const targetLook = new THREE.Vector3().lerpVectors(waypoints[index].target, waypoints[index + 1].target, easeT);

        // Natural floating sway & mouse parallax
        targetPos.x += mouseRef.current.x * 0.7 + Math.sin(elapsedTime * 0.8) * 0.15;
        targetPos.y += mouseRef.current.y * 0.4 + Math.cos(elapsedTime * 0.6) * 0.15;

        currentCamPos.lerp(targetPos, 0.055);
        currentCamTarget.lerp(targetLook, 0.06);

        camera.position.copy(currentCamPos);
        camera.lookAt(currentCamTarget);
      }

      // Animate Soul Particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += 0.025;
          if (positions[i] > 22) positions[i] = 0.2;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y = elapsedTime * 0.03;
      }

      // -----------------------------------------------------------
      // FEATURE: ENHANCED WARDEN KINEMATICS (Prowl, Scent Sniffing & Gaze)
      // -----------------------------------------------------------
      if (wardenRef.current) {
        const breathing = Math.sin(elapsedTime * 1.8);
        const heartbeat = Math.pow(Math.sin(elapsedTime * 3.5), 10);

        const torso = wardenRef.current.getObjectByName("torso");
        const head = wardenRef.current.getObjectByName("head");
        const leftArm = wardenRef.current.getObjectByName("leftArm");
        const rightArm = wardenRef.current.getObjectByName("rightArm");
        const leftLeg = wardenRef.current.getObjectByName("leftLeg");
        const rightLeg = wardenRef.current.getObjectByName("rightLeg");
        const leftHorn = wardenRef.current.getObjectByName("leftHorn");
        const rightHorn = wardenRef.current.getObjectByName("rightHorn");

        // 1. Soul Chest Heartbeat Pulse
        if (soulCoreRef.current) {
          const coreScale = 1 + heartbeat * 0.45 + breathing * 0.1;
          soulCoreRef.current.scale.set(coreScale, coreScale, coreScale);
          wardenLight.intensity = 2.0 + heartbeat * 2.8 + breathing * 0.5;
        }

        // 2. Scent-Detection / Sniffing Cycle (Occurs every 7.5 seconds when standing still)
        const sniffCycle = elapsedTime % 7.5;
        const isSniffing = sniffCycle < 2.0 && walkSpeed < 0.25;

        // 3. Stride Kinematics linked to user scroll speed
        const stride = Math.sin(scrollStateRef.current.walkPhase);
        const armStride = Math.min(0.65, walkSpeed * 0.45);
        const legStride = Math.min(0.55, walkSpeed * 0.35);

        // Legs: stride forward/backward in cadence with scroll
        if (leftLeg && rightLeg) {
          leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, stride * legStride, 0.12);
          rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, -stride * legStride, 0.12);
        }

        // Torso: bobbing up and down with stride & breathing
        if (torso) {
          const strideBob = Math.abs(Math.sin(scrollStateRef.current.walkPhase * 2)) * 0.12;
          torso.position.y = 3.6 + breathing * 0.08 + strideBob;
        }

        // Arms: dynamic prowl swing opposing the legs
        if (leftArm && rightArm) {
          const baseArmSwing = -stride * armStride;
          leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, baseArmSwing + Math.sin(elapsedTime * 1.5) * 0.1, 0.12);
          rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, -baseArmSwing - Math.sin(elapsedTime * 1.5) * 0.1, 0.12);
        }

        // Head: sniffing sequence vs. smooth mouse cursor gaze tracking
        if (head) {
          if (isSniffing) {
            // Tilts head upward and twitches nose/antennae smelling sound vibrations in the dark
            const sniffTwitch = Math.sin(sniffCycle * 16) * 0.06;
            head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -0.42 + sniffTwitch, 0.1);
            head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, Math.sin(sniffCycle * 8) * 0.1, 0.1);
          } else {
            // Spherical cursor tracking
            const targetHeadX = -mouseRef.current.y * 0.28;
            const targetHeadY = mouseRef.current.x * 0.38 + Math.sin(elapsedTime * 0.5) * 0.05;
            head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetHeadX, 0.08);
            head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetHeadY, 0.08);
          }
        }

        // Antennae: subtle organic vibration and excitement during sniff
        if (leftHorn && rightHorn) {
          const hornExcitement = isSniffing ? Math.sin(elapsedTime * 24) * 0.12 : 0;
          const hornTwitch = Math.sin(elapsedTime * 8) > 0.85 ? 0.12 : 0;
          leftHorn.rotation.z = -0.15 + hornTwitch + hornExcitement;
          rightHorn.rotation.z = 0.15 - hornTwitch - hornExcitement;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleCanvasMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("click", handleCanvasClick);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [quality, projects]);

  // Audio resonance on section navigation
  useEffect(() => {
    sculkAudio.playSculkResonance(480 + (activeSection || 0) * 80);
    sculkAudio.playWardenHeartbeat();
  }, [activeSection]);

  return <div ref={mountRef} className={`canvas-container ${isFreeRoam ? "free-roam-active" : ""}`} />;
}

// -------------------------------------------------------------
// PROCEDURAL VOXEL ANCIENT CITY GENERATION
// -------------------------------------------------------------
function buildVoxelAncientCity(scene, quality) {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

  const deepslateMat = new THREE.MeshStandardMaterial({
    color: 0x091122,
    roughness: 0.9,
    metalness: 0.1
  });

  const reinforcedDeepslateMat = new THREE.MeshStandardMaterial({
    color: 0x142033,
    roughness: 0.75,
    metalness: 0.3
  });

  const sculkMat = new THREE.MeshStandardMaterial({
    color: 0x012b38,
    emissive: 0x00f5d4,
    emissiveIntensity: 0.38,
    roughness: 0.6
  });

  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.85
  });

  // Central Ancient Portal
  const portalGroup = new THREE.Group();
  const portalWidth = 14;
  const portalHeight = 11;

  for (let x = -portalWidth / 2; x <= portalWidth / 2; x++) {
    for (let y = 0; y <= portalHeight; y++) {
      const isFrame =
        Math.abs(x) >= portalWidth / 2 - 1 ||
        y >= portalHeight - 1 ||
        y <= 0;

      if (isFrame) {
        const block = new THREE.Mesh(boxGeometry, reinforcedDeepslateMat);
        block.position.set(x, y + 0.5, 0);
        portalGroup.add(block);

        if (Math.random() < 0.28) {
          const sculkBlock = new THREE.Mesh(boxGeometry, sculkMat);
          sculkBlock.scale.set(1.02, 1.02, 1.02);
          sculkBlock.position.set(x, y + 0.5, 0.1);
          portalGroup.add(sculkBlock);
        }
      }
    }
  }

  // Portal Void Plane
  const voidGeo = new THREE.PlaneGeometry(portalWidth - 2.2, portalHeight - 1.8);
  const voidMat = new THREE.MeshBasicMaterial({
    color: 0x00b4d8,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });
  const portalVoid = new THREE.Mesh(voidGeo, voidMat);
  portalVoid.position.set(0, portalHeight / 2 + 0.5, 0.05);
  portalGroup.add(portalVoid);

  scene.add(portalGroup);

  // Colonnades & Ruined Pillars
  const pillarPositions = [
    { x: -10, z: 8 }, { x: -10, z: 16 }, { x: -10, z: 24 },
    { x: 10, z: 8 },  { x: 10, z: 16 },  { x: 10, z: 24 },
    { x: -18, z: 0 }, { x: 18, z: 0 }
  ];

  pillarPositions.forEach(pos => {
    const pillarHeight = 7 + Math.floor(Math.random() * 4);
    for (let y = 0; y < pillarHeight; y++) {
      const pillarBlock = new THREE.Mesh(boxGeometry, y % 3 === 0 ? sculkMat : deepslateMat);
      pillarBlock.position.set(pos.x, y + 0.5, pos.z);
      scene.add(pillarBlock);
    }
  });

  // Ancient Terraced Voxel Floor
  const floorWidth = 46;
  const floorDepth = 46;
  const count = (floorWidth * floorDepth) / 2;
  const floorMesh = new THREE.InstancedMesh(boxGeometry, deepslateMat, count);

  const dummy = new THREE.Object3D();
  let instanceIdx = 0;

  for (let x = -floorWidth / 2; x <= floorWidth / 2; x += 1.4) {
    for (let z = -10; z <= floorDepth; z += 1.4) {
      if (instanceIdx >= count) break;

      const distFromCenter = Math.sqrt(x * x + z * z);
      const heightOffset = Math.sin(x * 0.25) * Math.cos(z * 0.25) * 0.8 - (distFromCenter > 20 ? 1.5 : 0);

      dummy.position.set(x, heightOffset, z);
      dummy.scale.set(1.35, 1, 1.35);
      dummy.updateMatrix();

      floorMesh.setMatrixAt(instanceIdx, dummy.matrix);
      instanceIdx++;
    }
  }
  floorMesh.instanceMatrix.needsUpdate = true;
  scene.add(floorMesh);

  // Sculk Catalyst Shrines
  const shrines = [
    { x: -6, z: 6 },
    { x: 6, z: 6 },
    { x: -5, z: 18 },
    { x: 5, z: 18 }
  ];

  shrines.forEach(shrine => {
    const base = new THREE.Mesh(boxGeometry, sculkMat);
    base.scale.set(2, 0.8, 2);
    base.position.set(shrine.x, 0.4, shrine.z);
    scene.add(base);

    const boneLeft = new THREE.Mesh(boxGeometry, boneMat);
    boneLeft.scale.set(0.3, 1.5, 0.3);
    boneLeft.position.set(shrine.x - 0.7, 1.2, shrine.z);
    boneLeft.rotation.z = -0.2;
    scene.add(boneLeft);

    const boneRight = new THREE.Mesh(boxGeometry, boneMat);
    boneRight.scale.set(0.3, 1.5, 0.3);
    boneRight.position.set(shrine.x + 0.7, 1.2, shrine.z);
    boneRight.rotation.z = 0.2;
    scene.add(boneRight);

    const coreGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f5d4,
      emissive: 0x00f5d4,
      emissiveIntensity: 1.8
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(shrine.x, 1.1, shrine.z);
    scene.add(core);
  });
}

// -------------------------------------------------------------
// ARTICULATED VOXEL WARDEN GUARDIAN
// -------------------------------------------------------------
function buildVoxelWarden() {
  const wardenGroup = new THREE.Group();
  wardenGroup.name = "warden";

  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  const wardenSkinMat = new THREE.MeshStandardMaterial({
    color: 0x061426,
    roughness: 0.85
  });

  const sculkAntennaMat = new THREE.MeshStandardMaterial({
    color: 0x023e4d,
    emissive: 0x00f5d4,
    emissiveIntensity: 0.8,
    roughness: 0.4
  });

  const ribMat = new THREE.MeshStandardMaterial({
    color: 0x0a223a,
    emissive: 0x00e5ff,
    emissiveIntensity: 0.5
  });

  const soulCoreMat = new THREE.MeshStandardMaterial({
    color: 0x00f5d4,
    emissive: 0x00f5d4,
    emissiveIntensity: 2.5
  });

  // 1. Legs with pivots for stride kinematics
  const leftLeg = new THREE.Group();
  leftLeg.name = "leftLeg";
  leftLeg.position.set(-1.1, 2.8, 0);

  const leftLegMesh = new THREE.Mesh(boxGeo, wardenSkinMat);
  leftLegMesh.scale.set(1.1, 2.8, 1.1);
  leftLegMesh.position.set(0, -1.4, 0);
  leftLeg.add(leftLegMesh);
  wardenGroup.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.name = "rightLeg";
  rightLeg.position.set(1.1, 2.8, 0);

  const rightLegMesh = new THREE.Mesh(boxGeo, wardenSkinMat);
  rightLegMesh.scale.set(1.1, 2.8, 1.1);
  rightLegMesh.position.set(0, -1.4, 0);
  rightLeg.add(rightLegMesh);
  wardenGroup.add(rightLeg);

  // 2. Torso
  const torso = new THREE.Group();
  torso.name = "torso";
  torso.position.set(0, 3.6, 0);

  const chest = new THREE.Mesh(boxGeo, wardenSkinMat);
  chest.scale.set(3.4, 3.2, 1.8);
  chest.position.set(0, 1.6, 0);
  torso.add(chest);

  // Ribcage bars
  for (let r = 0; r < 3; r++) {
    const rib = new THREE.Mesh(boxGeo, ribMat);
    rib.scale.set(2.4, 0.28, 0.2);
    rib.position.set(0, 1.1 + r * 0.55, 0.95);
    torso.add(rib);
  }

  // Glowing Soul Heart
  const soulCore = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55), soulCoreMat);
  soulCore.name = "soulCore";
  soulCore.position.set(0, 1.65, 0.6);
  torso.add(soulCore);

  // 3. Head & Antennae
  const headGroup = new THREE.Group();
  headGroup.name = "head";
  headGroup.position.set(0, 3.5, 0);

  const headMesh = new THREE.Mesh(boxGeo, wardenSkinMat);
  headMesh.scale.set(2.2, 1.8, 1.8);
  headMesh.position.set(0, 0.9, 0);
  headGroup.add(headMesh);

  // Sculk Antennae
  const leftHorn = new THREE.Group();
  leftHorn.name = "leftHorn";
  leftHorn.position.set(-1.3, 1.7, 0);

  const hornPart1L = new THREE.Mesh(boxGeo, sculkAntennaMat);
  hornPart1L.scale.set(0.35, 1.4, 0.35);
  hornPart1L.position.set(0, 0.7, 0);
  leftHorn.add(hornPart1L);

  const hornPart2L = new THREE.Mesh(boxGeo, sculkAntennaMat);
  hornPart2L.scale.set(0.9, 0.35, 0.35);
  hornPart2L.position.set(-0.35, 1.3, 0);
  leftHorn.add(hornPart2L);
  headGroup.add(leftHorn);

  const rightHorn = new THREE.Group();
  rightHorn.name = "rightHorn";
  rightHorn.position.set(1.3, 1.7, 0);

  const hornPart1R = new THREE.Mesh(boxGeo, sculkAntennaMat);
  hornPart1R.scale.set(0.35, 1.4, 0.35);
  hornPart1R.position.set(0, 0.7, 0);
  rightHorn.add(hornPart1R);

  const hornPart2R = new THREE.Mesh(boxGeo, sculkAntennaMat);
  hornPart2R.scale.set(0.9, 0.35, 0.35);
  hornPart2R.position.set(0.35, 1.3, 0);
  rightHorn.add(hornPart2R);
  headGroup.add(rightHorn);

  torso.add(headGroup);

  // 4. Arms with shoulder pivots for prowling kinematics
  const leftArm = new THREE.Group();
  leftArm.name = "leftArm";
  leftArm.position.set(-2.2, 2.9, 0);

  const armMeshL = new THREE.Mesh(boxGeo, wardenSkinMat);
  armMeshL.scale.set(1.1, 3.6, 1.1);
  armMeshL.position.set(0, -1.5, 0);
  leftArm.add(armMeshL);
  torso.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.name = "rightArm";
  rightArm.position.set(2.2, 2.9, 0);

  const armMeshR = new THREE.Mesh(boxGeo, wardenSkinMat);
  armMeshR.scale.set(1.1, 3.6, 1.1);
  armMeshR.position.set(0, -1.5, 0);
  rightArm.add(armMeshR);
  torso.add(rightArm);

  wardenGroup.add(torso);

  return wardenGroup;
}

// -------------------------------------------------------------
// SOUL CATALYST PARTICLES SYSTEM
// -------------------------------------------------------------
function buildSoulParticles(quality) {
  const particleCount = quality === "high" ? 1800 : 700;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorSoul1 = new THREE.Color(0x00f5d4);
  const colorSoul2 = new THREE.Color(0x38bdf8);
  const colorSoul3 = new THREE.Color(0xc084fc);

  for (let i = 0; i < particleCount; i++) {
    const r = Math.random() * 28;
    const angle = Math.random() * Math.PI * 2;

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.random() * 20 + 0.2;
    positions[i * 3 + 2] = Math.sin(angle) * r + 8;

    const chosenColor = Math.random() < 0.6 ? colorSoul1 : (Math.random() < 0.85 ? colorSoul2 : colorSoul3);
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: quality === "high" ? 0.16 : 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  return new THREE.Points(geometry, material);
}
