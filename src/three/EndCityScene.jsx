import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { sculkAudio } from "../audio/sculkAudio";

// ─────────────────────────────────────────────────────────────────────────────
//  END CITY 3D SCENE — PURE MINECRAFT IMMERSION EDITION
//
//  Interactive Ecosystem:
//  • Clickable / Hoverable Shulkers:
//      - Hover: turns cursor into pointer, Shulker peeks and looks at your cursor.
//      - Click: snaps wide open, fires a glowing spiral Levitation Bullet into
//        the void with authentic synthesized audio and celebratory shell bounce.
//  • Spire End Crystal Pulse:
//      - Click the floating crystal atop the tallest spire to trigger an epic
//        Ender detonation, sending an expanding purple shockwave ring and
//        a vertical beacon energy beam piercing through the void.
//  • Next-Level Chain Reaction:
//      - As the End Crystal shockwave sweeps across the city, all End Rods flare
//        and all Shulkers panic-peek / snap open their shells simultaneously to
//        ride the shockwave wave!
//  • Full Purpur City architecture, floating End Ship, Elytra particle aura,
//    swaying Chorus plants, and smooth cinematic 5-waypoint camera navigation.
// ─────────────────────────────────────────────────────────────────────────────

export default function EndCityScene({
  scrollProgress = 0,
  activeSection = 0,
  isFreeRoam = false,
  quality = "high"
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const shulkersRef = useRef([]);
  const elytralParticlesRef = useRef(null);
  const endShipRef = useRef(null);
  const chorusRef = useRef([]);
  const endRodsRef = useRef([]);

  // End Crystal & Shockwave State
  const crystalRef = useRef(null);
  const crystalCoreRef = useRef(null);
  const shockwaveRef = useRef(null);
  const beaconBeamRef = useRef(null);
  const crystalStateRef = useRef({
    isHovered: false,
    flareTimer: 0,
    flareIntensity: 1.0
  });

  // Active Levitation Bullets fired by Shulkers
  const bulletsRef = useRef([]);

  // Clickable interactive objects for raycasting
  const interactablesRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isFreeRoamRef = useRef(isFreeRoam);
  isFreeRoamRef.current = isFreeRoam;
  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  const orbitRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    theta: Math.PI * 0.15,
    phi: Math.PI / 3.2,
    radius: 38,
    target: new THREE.Vector3(0, 8, 0)
  });

  // Cinematic camera waypoints through the End City
  const waypoints = [
    // 0: Hero – Wide aerial approach from void, End City towers ahead
    { pos: new THREE.Vector3(2, 18, 46), target: new THREE.Vector3(0, 10, 0) },
    // 1: About – Gliding alongside the tallest purpur spire & crystal
    { pos: new THREE.Vector3(22, 16, 20), target: new THREE.Vector3(2, 14, 0) },
    // 2: Projects – Vista framing the towers, bridges & floating End Ship
    { pos: new THREE.Vector3(-6, 26, 8), target: new THREE.Vector3(-2, 22, -8) },
    // 3: Skills – Close-up of shulker defenders and chorus grove
    { pos: new THREE.Vector3(-18, 8, -6), target: new THREE.Vector3(-4, 8, -12) },
    // 4: Contact – Ascending into the void above the city spires
    { pos: new THREE.Vector3(0, 36, 22), target: new THREE.Vector3(0, 10, -4) }
  ];

  // Fires a Levitation Bullet from a Shulker position
  const shootShulkerBullet = (scene, spawnPos) => {
    try { sculkAudio.playShulkerShoot(); } catch (_) {}

    const bulletGroup = new THREE.Group();
    bulletGroup.position.copy(spawnPos);
    bulletGroup.position.y += 0.9;

    // Glowing bullet core
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xfacc15,
      emissiveIntensity: 2.5,
      roughness: 0.1
    });
    const core = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), coreMat);
    bulletGroup.add(core);

    // Outer spiraling energy ring
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xe879f9,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const shell = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), shellMat);
    bulletGroup.add(shell);

    // Mini light
    const bulletLight = new THREE.PointLight(0xfde047, 1.8, 6, 2);
    bulletGroup.add(bulletLight);

    scene.add(bulletGroup);

    bulletsRef.current.push({
      mesh: bulletGroup,
      spawnY: spawnPos.y,
      age: 0,
      maxAge: 4.0, // seconds alive
      basePos: spawnPos.clone()
    });
  };

  // Triggers End Crystal Shockwave Pulse and Chain Reaction
  const triggerCrystalPulse = (scene) => {
    try { sculkAudio.playEndCrystalResonance(); } catch (_) {}
    crystalStateRef.current.flareTimer = 3.6;
    crystalStateRef.current.flareIntensity = 3.8;

    if (shockwaveRef.current) {
      shockwaveRef.current.scale.set(0.1, 0.1, 0.1);
      shockwaveRef.current.material.opacity = 0.95;
      shockwaveRef.current.visible = true;
    }
    if (beaconBeamRef.current) {
      beaconBeamRef.current.material.opacity = 0.9;
      beaconBeamRef.current.visible = true;
    }

    // CHAIN REACTION: Trigger all Shulkers to panic-peek simultaneously!
    shulkersRef.current.forEach((s, idx) => {
      s.userData.panicTimer = 3.2; // panic-peek for 3.2 seconds
      s.userData.excitedBob = 1.0;
      // Stagger small bullet fires from 2 random shulkers
      if (idx % 2 === 0) {
        setTimeout(() => {
          if (sceneRef.current) shootShulkerBullet(sceneRef.current, s.position);
        }, 300 + idx * 250);
      }
    });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    interactablesRef.current = [];
    bulletsRef.current = [];

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x04010a);
    scene.fog = new THREE.FogExp2(0x08021a, 0.016);

    // ── Camera ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 220);
    camera.position.copy(waypoints[0].pos);
    cameraRef.current = camera;

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: quality === "high",
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 2 : 1.2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // ── Lighting ───────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0x1a0630, 2.2);
    scene.add(ambient);

    // Main purpur glow – warm magenta from city centre
    const cityGlow = new THREE.PointLight(0xe879f9, 6, 60, 1.8);
    cityGlow.position.set(0, 14, 0);
    scene.add(cityGlow);

    // End Ship ethereal blue-white light
    const shipLight = new THREE.PointLight(0x7dd3fc, 4.5, 50, 2);
    shipLight.position.set(-4, 28, -10);
    scene.add(shipLight);

    // Chorus grove teal accent
    const chorusLight = new THREE.PointLight(0x2dd4bf, 3, 35, 2);
    chorusLight.position.set(-16, 6, -10);
    scene.add(chorusLight);

    // Far void blue rim
    const rimLight = new THREE.DirectionalLight(0x4f46e5, 1.2);
    rimLight.position.set(20, 30, 20);
    scene.add(rimLight);

    // ── Environment Builders ───────────────────────────────────────────────
    buildEndStoneFloor(scene);
    buildPurpurCityComplex(scene);
    buildChorusGrove(scene, chorusRef);
    buildEndRods(scene, endRodsRef);

    // ── Floating End Ship ──────────────────────────────────────────────────
    const ship = buildEndShip();
    ship.position.set(-4, 22, -10);
    scene.add(ship);
    endShipRef.current = ship;

    // ── INTERACTIVE SHULKER DEFENDERS ──────────────────────────────────────
    const shulkerPositions = [
      [6, 0.5, -4],
      [-5, 0.5, -8],
      [10, 0.5, 6],
      [-10, 0.5, 2],
      [2, 0.5, -14],
      [12, 14.5, -4] // Watchtower shulker
    ];
    shulkersRef.current = shulkerPositions.map(([x, y, z], idx) => {
      const s = buildShulker();
      s.position.set(x, y, z);
      s.userData.index = idx;
      s.userData.isHovered = false;
      s.userData.panicTimer = 0;
      s.userData.openProgress = 0;
      s.userData.excitedBob = 0;
      s.userData.onInteract = () => {
        // Snap wide open and launch a levitation bullet!
        s.userData.openProgress = 1.0;
        s.userData.excitedBob = 1.0;
        shootShulkerBullet(scene, s.position);
      };

      scene.add(s);
      interactablesRef.current.push({ mesh: s, type: "shulker", id: idx });
      return s;
    });

    // ── Elytra Particle Trails ─────────────────────────────────────────────
    const elytraParticles = buildElytraParticles(quality);
    scene.add(elytraParticles);
    elytralParticlesRef.current = elytraParticles;

    // ── Void Star Field ────────────────────────────────────────────────────
    buildVoidStars(scene, quality);

    // ── INTERACTIVE END CRYSTAL ON THE SPIRE ───────────────────────────────
    const crystalGroup = buildEndCrystal();
    crystalGroup.position.set(0, 32.5, 0);
    crystalGroup.userData.onInteract = () => {
      triggerCrystalPulse(scene);
    };
    scene.add(crystalGroup);
    crystalRef.current = crystalGroup;
    crystalCoreRef.current = crystalGroup.getObjectByName("crystalCore");
    interactablesRef.current.push({ mesh: crystalGroup, type: "crystal" });

    // Shockwave Ring Mesh
    const shockGeo = new THREE.RingGeometry(0.8, 2.5, 48);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xe879f9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const shockwave = new THREE.Mesh(shockGeo, shockMat);
    shockwave.rotation.x = Math.PI / 2;
    shockwave.position.set(0, 32.5, 0);
    shockwave.visible = false;
    scene.add(shockwave);
    shockwaveRef.current = shockwave;

    // Beacon Energy Beam Mesh
    const beamGeo = new THREE.CylinderGeometry(0.6, 0.6, 120, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xf472b6,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const beaconBeam = new THREE.Mesh(beamGeo, beamMat);
    beaconBeam.position.set(0, 92.5, 0);
    beaconBeam.visible = false;
    scene.add(beaconBeam);
    beaconBeamRef.current = beaconBeam;

    // ── Raycasting & Input Controls ────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isFreeRoamRef.current) {
        if (orbitRef.current.isDragging) {
          const dx = e.clientX - orbitRef.current.prevX;
          const dy = e.clientY - orbitRef.current.prevY;
          orbitRef.current.theta -= dx * 0.006;
          orbitRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.1, orbitRef.current.phi - dy * 0.006));
          orbitRef.current.prevX = e.clientX;
          orbitRef.current.prevY = e.clientY;
        }
        return;
      }

      // Check cursor hover over 3D interactables (Shulkers + Crystal)
      if (cameraRef.current && interactablesRef.current.length > 0) {
        raycaster.setFromCamera(pointer, cameraRef.current);
        const hitMeshes = interactablesRef.current.map(i => i.mesh);
        const intersects = raycaster.intersectObjects(hitMeshes, true);

        let hitAny = false;
        // Reset hover state for all shulkers
        shulkersRef.current.forEach(s => { s.userData.isHovered = false; });
        crystalStateRef.current.isHovered = false;

        if (intersects.length > 0) {
          hitAny = true;
          let curr = intersects[0].object;
          while (curr && !curr.userData?.onInteract) {
            curr = curr.parent;
          }
          if (curr) {
            if (curr.userData?.index !== undefined) {
              curr.userData.isHovered = true;
            } else {
              crystalStateRef.current.isHovered = true;
            }
          }
        }

        container.style.cursor = hitAny ? "pointer" : "default";
      }
    };

    const handleMouseDown = (e) => {
      if (isFreeRoamRef.current) {
        orbitRef.current.isDragging = true;
        orbitRef.current.prevX = e.clientX;
        orbitRef.current.prevY = e.clientY;
        return;
      }

      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (cameraRef.current && interactablesRef.current.length > 0) {
        raycaster.setFromCamera(pointer, cameraRef.current);
        const hitMeshes = interactablesRef.current.map(i => i.mesh);
        const intersects = raycaster.intersectObjects(hitMeshes, true);

        if (intersects.length > 0) {
          let curr = intersects[0].object;
          while (curr && !curr.userData?.onInteract) {
            curr = curr.parent;
          }
          if (curr && curr.userData?.onInteract) {
            curr.userData.onInteract();
          }
        }
      }
    };

    const handleMouseUp = () => {
      orbitRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
      if (!isFreeRoamRef.current) return;
      orbitRef.current.radius = Math.max(10, Math.min(60, orbitRef.current.radius + e.deltaY * 0.025));
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("resize", handleResize);

    // ── Animation Loop ─────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf;
    const camPos = new THREE.Vector3().copy(waypoints[0].pos);
    const camTarget = new THREE.Vector3().copy(waypoints[0].target);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const t = clock.getElapsedTime();

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Camera navigation
      if (isFreeRoamRef.current) {
        const { radius, theta, phi, target } = orbitRef.current;
        const tp = new THREE.Vector3(
          target.x + radius * Math.sin(phi) * Math.sin(theta),
          target.y + radius * Math.cos(phi),
          target.z + radius * Math.sin(phi) * Math.cos(theta)
        );
        camera.position.lerp(tp, 0.08);
        camera.lookAt(target);
      } else {
        const sp = Math.max(0, Math.min(1, scrollProgressRef.current));
        const numSeg = waypoints.length - 1;
        const sf = sp * numSeg;
        const idx = Math.min(Math.floor(sf), numSeg - 1);
        const sub = sf - idx;
        const ease = sub * sub * (3 - 2 * sub);
        const tp = new THREE.Vector3().lerpVectors(waypoints[idx].pos, waypoints[idx + 1].pos, ease);
        const tl = new THREE.Vector3().lerpVectors(waypoints[idx].target, waypoints[idx + 1].target, ease);
        tp.x += mouseRef.current.x * 0.8 + Math.sin(t * 0.55) * 0.18;
        tp.y += mouseRef.current.y * 0.45 + Math.cos(t * 0.42) * 0.14;
        camPos.lerp(tp, 0.05);
        camTarget.lerp(tl, 0.06);
        camera.position.copy(camPos);
        camera.lookAt(camTarget);
      }

      // ── Animate End Crystal & Core ──────────────────────────────────
      const isCrystalFlaring = crystalStateRef.current.flareTimer > 0;
      if (isCrystalFlaring) {
        crystalStateRef.current.flareTimer -= delta;
        crystalStateRef.current.flareIntensity = THREE.MathUtils.lerp(
          crystalStateRef.current.flareIntensity,
          1.0,
          delta * 0.9
        );
      } else {
        crystalStateRef.current.flareIntensity = THREE.MathUtils.lerp(
          crystalStateRef.current.flareIntensity,
          1.0,
          delta * 2.0
        );
      }

      if (crystalRef.current) {
        const outer = crystalRef.current.getObjectByName("crystalOuter");
        const inner = crystalRef.current.getObjectByName("crystalInner");
        const core = crystalCoreRef.current;

        const spinSpeed = isCrystalFlaring ? 4.0 : (crystalStateRef.current.isHovered ? 2.2 : 1.0);
        if (outer) {
          outer.rotation.x = t * 0.6 * spinSpeed;
          outer.rotation.y = t * 0.9 * spinSpeed;
        }
        if (inner) {
          inner.rotation.x = -t * 0.9 * spinSpeed;
          inner.rotation.y = -t * 0.6 * spinSpeed;
        }
        if (core) {
          const corePulse = 1.0 + Math.sin(t * (isCrystalFlaring ? 12 : 3.5)) * 0.25;
          core.scale.set(corePulse, corePulse, corePulse);
          core.material.emissiveIntensity = (isCrystalFlaring ? 4.5 : 2.5) * crystalStateRef.current.flareIntensity;
        }
        crystalRef.current.position.y = 32.5 + Math.sin(t * 1.5) * 0.35;
      }

      // Shockwave Ring Expansion
      if (shockwaveRef.current && shockwaveRef.current.visible) {
        const currentScale = shockwaveRef.current.scale.x;
        const newScale = currentScale + delta * 38;
        shockwaveRef.current.scale.set(newScale, newScale, newScale);
        shockwaveRef.current.material.opacity = Math.max(0, shockwaveRef.current.material.opacity - delta * 0.45);
        if (shockwaveRef.current.material.opacity <= 0.01) {
          shockwaveRef.current.visible = false;
        }
      }

      // Beacon Energy Beam Fade
      if (beaconBeamRef.current && beaconBeamRef.current.visible) {
        beaconBeamRef.current.rotation.y = t * 2.5;
        beaconBeamRef.current.material.opacity = Math.max(0, beaconBeamRef.current.material.opacity - delta * 0.35);
        if (beaconBeamRef.current.material.opacity <= 0.01) {
          beaconBeamRef.current.visible = false;
        }
      }

      // ── Animate Shulkers (Click, Hover & Panic Shockwave Reaction) ──
      shulkersRef.current.forEach((s, i) => {
        const lid = s.getObjectByName("lid");
        const eye = s.getObjectByName("eye");
        const isHovered = s.userData.isHovered;
        const isPanicking = s.userData.panicTimer > 0;

        if (isPanicking) {
          s.userData.panicTimer -= delta;
        }

        // Calculate lid openness
        let targetOpen = 0;
        if (isPanicking) {
          // Shockwave panic: open wide and vibrate
          targetOpen = 0.95 + Math.sin(t * 16 + i) * 0.05;
        } else if (isHovered) {
          // Hover peek
          targetOpen = 0.55;
        } else {
          // Normal idle cycle
          const phase = (t * 0.7 + i * 1.3) % (Math.PI * 2);
          targetOpen = Math.max(0, Math.sin(phase) * 1.2 - 0.2) * 0.75;
        }

        s.userData.openProgress = THREE.MathUtils.lerp(s.userData.openProgress, targetOpen, 0.12);

        if (lid) {
          lid.rotation.x = s.userData.openProgress * 0.9;
        }

        // Celebratory / surprise shell bob
        if (s.userData.excitedBob > 0) {
          s.userData.excitedBob = Math.max(0, s.userData.excitedBob - delta * 2.5);
        }
        const bobOffset = Math.sin(t * 12) * 0.18 * s.userData.excitedBob;
        const idleBob = Math.sin(t * 0.9 + i) * 0.05;
        s.position.y = (shulkerPositions[i]?.[1] || 0.5) + idleBob + bobOffset;

        // Eye glow
        if (eye) {
          const glowBase = isPanicking ? 3.0 : (isHovered ? 2.2 : 1.2);
          eye.material.emissiveIntensity = glowBase + Math.sin(t * (isPanicking ? 12 : 3) + i) * 0.5;
        }

        // Look angle tracking
        if (isHovered) {
          s.rotation.y = THREE.MathUtils.lerp(s.rotation.y, mouseRef.current.x * 0.6, 0.1);
        } else if (isPanicking) {
          s.rotation.y += delta * 4.0; // spin with surprise
        } else {
          s.rotation.y = Math.sin(t * 0.4 + i * 1.2) * 0.15;
        }
      });

      // ── Animate Active Levitation Bullets ────────────────────────────
      for (let bIdx = bulletsRef.current.length - 1; bIdx >= 0; bIdx--) {
        const bullet = bulletsRef.current[bIdx];
        bullet.age += delta;

        // Spiral upward path
        const speedY = 4.2;
        bullet.mesh.position.y += speedY * delta;
        const spiralRadius = 0.45;
        bullet.mesh.position.x = bullet.basePos.x + Math.sin(bullet.age * 6) * spiralRadius;
        bullet.mesh.position.z = bullet.basePos.z + Math.cos(bullet.age * 6) * spiralRadius;

        bullet.mesh.rotation.x += delta * 4;
        bullet.mesh.rotation.y += delta * 6;

        // Fade out as it expires
        if (bullet.age >= bullet.maxAge) {
          scene.remove(bullet.mesh);
          bulletsRef.current.splice(bIdx, 1);
        }
      }

      // City glow pulse (reacts to crystal flare)
      cityGlow.intensity = (5.5 + Math.sin(t * 2.2) * 1.2) * crystalStateRef.current.flareIntensity;
      shipLight.intensity = (4 + Math.sin(t * 1.8 + 1) * 0.8) * Math.min(2.0, crystalStateRef.current.flareIntensity);

      // Animate End Ship – gentle float
      if (endShipRef.current) {
        endShipRef.current.position.y = 22 + Math.sin(t * 0.55) * 0.6;
        endShipRef.current.rotation.z = Math.sin(t * 0.38) * 0.018;
        endShipRef.current.rotation.y = Math.sin(t * 0.22) * 0.012;
      }

      // Animate chorus plants – gentle sway
      chorusRef.current.forEach((c, i) => {
        c.rotation.z = Math.sin(t * 0.6 + i * 0.8) * 0.03;
        c.rotation.x = Math.cos(t * 0.5 + i * 0.6) * 0.025;
      });

      // Animate End Rods – flickering glow (flare with crystal)
      endRodsRef.current.forEach((rod, i) => {
        const glow = rod.getObjectByName("rodGlow");
        const flare = crystalStateRef.current.flareIntensity;
        if (glow) {
          glow.material.emissiveIntensity = (1.8 + Math.sin(t * 5 + i * 1.7) * 0.4) * flare;
          glow.material.opacity = Math.min(1.0, (0.75 + Math.sin(t * 4.5 + i) * 0.12) * flare);
        }
      });

      // Animate Elytra particles
      if (elytralParticlesRef.current) {
        const positions = elytralParticlesRef.current.geometry.attributes.position.array;
        const speeds = elytralParticlesRef.current.userData.speeds;
        const origins = elytralParticlesRef.current.userData.origins;

        for (let i = 0; i < positions.length / 3; i++) {
          const j = i * 3;
          const orbitT = t * speeds[i] + origins[i];
          const orbitR = 4 + Math.sin(orbitT * 1.3 + i) * 2;
          const orbitH = 22 + Math.sin(orbitT * 0.8 + i * 0.5) * 3 + (endShipRef.current?.position.y || 22) - 22;
          positions[j]     = -4 + Math.cos(orbitT) * orbitR;
          positions[j + 1] = orbitH + Math.sin(t * 1.5 + i * 0.3) * 0.4;
          positions[j + 2] = -10 + Math.sin(orbitT) * orbitR;
        }
        elytralParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        elytralParticlesRef.current.rotation.y = t * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [quality]);

  useEffect(() => {
    try { sculkAudio.playEnderTeleport(520 + (activeSection || 0) * 80); } catch (_) {}
  }, [activeSection]);

  return (
    <div
      ref={mountRef}
      className={`canvas-container ${isFreeRoam ? "free-roam-active" : ""}`}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  END CRYSTAL BUILDER (Interactive Spire Object)
// ─────────────────────────────────────────────────────────────────────────────
function buildEndCrystal() {
  const group = new THREE.Group();

  // Bedrock Base
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1e1e24,
    roughness: 0.92,
    metalness: 0.1
  });
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 2.2), baseMat);
  base.position.y = -1.2;
  group.add(base);

  // Outer Glass Cube
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.38,
    roughness: 0.08,
    metalness: 0.1,
    emissive: 0xe879f9,
    emissiveIntensity: 0.6
  });
  const outer = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 2.0), outerMat);
  outer.name = "crystalOuter";
  group.add(outer);

  // Inner Magma / Ender Cube
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    transparent: true,
    opacity: 0.68,
    roughness: 0.12,
    emissive: 0xdb2777,
    emissiveIntensity: 1.6
  });
  const inner = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), innerMat);
  inner.name = "crystalInner";
  group.add(inner);

  // Blinding Glowing Core
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xff00aa,
    emissive: 0xf43f5e,
    emissiveIntensity: 3.5,
    roughness: 0.1
  });
  const core = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), coreMat);
  core.name = "crystalCore";
  group.add(core);

  // Invisible Hitbox for Easy Clicking
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.6, 3.6), hitMat);
  group.add(hitbox);

  return group;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SHULKER DEFENDER BUILDER (Interactive Mob)
// ─────────────────────────────────────────────────────────────────────────────
function buildShulker() {
  const group = new THREE.Group();

  const colors = [0x9d4fc7, 0x7b3fa5, 0xb86dd4, 0xc48dde, 0x6a2e93];
  const col = colors[Math.floor(Math.random() * colors.length)];

  const bodyMat = new THREE.MeshStandardMaterial({
    color: col,
    roughness: 0.65,
    metalness: 0.12,
    emissive: new THREE.Color(col).multiplyScalar(0.3),
    emissiveIntensity: 0.6
  });

  // Shell bottom (fixed)
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), bodyMat);
  bottom.position.y = 0;
  group.add(bottom);

  // Shell top / lid (animated open)
  const lidMat = new THREE.MeshStandardMaterial({
    color: col,
    roughness: 0.6,
    metalness: 0.1,
    emissive: new THREE.Color(col).multiplyScalar(0.35),
    emissiveIntensity: 0.65
  });
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), lidMat);
  lid.name = "lid";
  const lidPivot = new THREE.Group();
  lidPivot.position.y = 0.4;
  lidPivot.add(lid);
  lid.position.y = 0.4;
  group.add(lidPivot);
  lid.name = "lid";

  // Eye (glowing yellow)
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xfde047,
    emissiveIntensity: 1.2,
    roughness: 0.2
  });
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.08), eyeMat);
  eye.name = "eye";
  eye.position.set(0, 0.78, 0.6);
  group.add(eye);

  // Decorative face stripe
  const stripeMat = new THREE.MeshStandardMaterial({
    color: 0x1a0a2e,
    roughness: 0.9
  });
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.1, 0.08), stripeMat);
  stripe.position.set(0, 0.65, 0.61);
  group.add(stripe);

  // Invisible Hitbox for Easy Clicking
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 2.0), hitMat);
  hitbox.position.y = 0.6;
  group.add(hitbox);

  group.scale.set(1.3, 1.3, 1.3);

  return group;
}

// ─────────────────────────────────────────────────────────────────────────────
//  END STONE FLOOR
// ─────────────────────────────────────────────────────────────────────────────
function buildEndStoneFloor(scene) {
  const endStoneMat = new THREE.MeshStandardMaterial({
    color: 0xd4cb7a,
    roughness: 0.88,
    metalness: 0.04
  });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(80, 1, 80), endStoneMat);
  floor.position.set(0, -0.5, 0);
  scene.add(floor);

  const scattered = [
    [14, 0, -8, 3, 0.5, 3],
    [-12, 0, 10, 2, 0.4, 2],
    [6, 0, 16, 4, 0.6, 4],
    [-18, 0, -4, 3, 0.5, 3],
    [20, 0, 4, 2, 0.4, 2],
    [-6, 0, -18, 3, 0.55, 3],
  ];
  scattered.forEach(([x, y, z, w, h, d]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), endStoneMat);
    m.position.set(x, y + h / 2, z);
    scene.add(m);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  PURPUR CITY COMPLEX — Main Tower + Smaller Spires
// ─────────────────────────────────────────────────────────────────────────────
function buildPurpurCityComplex(scene) {
  const purpurMat = new THREE.MeshStandardMaterial({
    color: 0x7a4fa0,
    roughness: 0.65,
    metalness: 0.1,
    emissive: 0x3a1a55,
    emissiveIntensity: 0.3
  });
  const purpurPillarMat = new THREE.MeshStandardMaterial({
    color: 0x8f5cb5,
    roughness: 0.6,
    metalness: 0.12,
    emissive: 0x4a2270,
    emissiveIntensity: 0.35
  });
  const purpurSlab = new THREE.MeshStandardMaterial({
    color: 0x6a3d8f,
    roughness: 0.7,
    metalness: 0.08
  });

  const addBox = (mat, x, y, z, w, h, d) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y + h / 2, z);
    scene.add(m);
    return m;
  };

  // 1. MAIN TOWER (tallest, centre)
  addBox(purpurMat, 0, 0, 0, 8, 2, 8);
  addBox(purpurPillarMat, 0, 2, 0, 6, 16, 6);
  [[-2.5, 0, -2.5], [2.5, 0, -2.5], [-2.5, 0, 2.5], [2.5, 0, 2.5]].forEach(([px, , pz]) => {
    addBox(purpurPillarMat, px, 2, pz, 1.2, 18, 1.2);
  });
  addBox(purpurSlab, 0, 18, 0, 8, 0.8, 8);
  addBox(purpurMat, 0, 18.8, 0, 4, 8, 4);

  const spireGeo = new THREE.ConeGeometry(2.6, 6, 4);
  const spireMat = new THREE.MeshStandardMaterial({
    color: 0xd946ef,
    emissive: 0xc026d3,
    emissiveIntensity: 1.2,
    roughness: 0.3
  });
  const spire = new THREE.Mesh(spireGeo, spireMat);
  spire.position.set(0, 30, 0);
  spire.rotation.y = Math.PI / 4;
  scene.add(spire);

  // 2. MEDIUM TOWER (right side)
  addBox(purpurMat, 12, 0, -4, 5, 1.5, 5);
  addBox(purpurPillarMat, 12, 1.5, -4, 4, 12, 4);
  addBox(purpurSlab, 12, 13.5, -4, 6, 0.7, 6);
  addBox(purpurMat, 12, 14.2, -4, 3, 5, 3);
  const spire2 = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4, 4), spireMat);
  spire2.position.set(12, 21.2, -4);
  spire2.rotation.y = Math.PI / 4;
  scene.add(spire2);

  // 3. SMALL TOWER (left)
  addBox(purpurMat, -10, 0, -6, 4, 1.2, 4);
  addBox(purpurPillarMat, -10, 1.2, -6, 3, 8, 3);
  addBox(purpurSlab, -10, 9.2, -6, 5, 0.6, 5);
  addBox(purpurMat, -10, 9.8, -6, 2.5, 4, 2.5);
  const spire3 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.5, 4), spireMat);
  spire3.position.set(-10, 17.3, -6);
  spire3.rotation.y = Math.PI / 4;
  scene.add(spire3);

  // 4. CORRIDOR BRIDGE
  addBox(purpurSlab, 6, 10, -2, 6, 0.8, 3);
  addBox(purpurPillarMat, 4, 10.8, -2, 0.5, 1.4, 0.5);
  addBox(purpurPillarMat, 8, 10.8, -2, 0.5, 1.4, 0.5);

  // 5. WATCH TOWER (back-right)
  addBox(purpurMat, 18, 0, -14, 3.5, 1, 3.5);
  addBox(purpurPillarMat, 18, 1, -14, 2.5, 6, 2.5);
  const spire4 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3, 4), spireMat);
  spire4.position.set(18, 10, -14);
  spire4.rotation.y = Math.PI / 4;
  scene.add(spire4);

  // 6. WALLS / BATTLEMENTS
  addBox(purpurMat, 0, 0, 10, 24, 3, 1.5);
  for (let bx = -10; bx <= 10; bx += 4) {
    addBox(purpurPillarMat, bx, 3, 10, 1.5, 1.5, 1.5);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  CHORUS PLANT GROVE
// ─────────────────────────────────────────────────────────────────────────────
function buildChorusGrove(scene, ref) {
  const chorusMat = new THREE.MeshStandardMaterial({
    color: 0x8b4f9e,
    roughness: 0.7,
    emissive: 0x5b1f6e,
    emissiveIntensity: 0.4
  });
  const flowerMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    roughness: 0.5,
    emissive: 0xa855f7,
    emissiveIntensity: 0.9
  });

  const plantPositions = [
    [-16, 0, -8], [-20, 0, -2], [-14, 0, -14],
    [-22, 0, -12], [-18, 0, 2], [-24, 0, 4]
  ];

  plantPositions.forEach(([px, , pz]) => {
    const plantGroup = new THREE.Group();
    plantGroup.position.set(px, 0, pz);

    const buildBranch = (parent, y, size, depth) => {
      if (depth <= 0 || size < 0.3) return;
      const stem = new THREE.Mesh(new THREE.BoxGeometry(size, size * 2.5, size), chorusMat.clone());
      stem.position.y = y + size * 1.25;
      parent.add(stem);

      if (depth === 1 || Math.random() < 0.5) {
        const flower = new THREE.Mesh(new THREE.BoxGeometry(size * 1.6, size * 1.6, size * 1.6), flowerMat.clone());
        flower.position.y = y + size * 2.5 + size * 0.8;
        parent.add(flower);
      }

      const numBranches = depth > 1 ? 2 + Math.floor(Math.random() * 2) : 1;
      for (let b = 0; b < numBranches; b++) {
        const bGroup = new THREE.Group();
        const angle = (b / numBranches) * Math.PI * 2 + Math.random() * 0.8;
        const bSize = size * 0.65;
        bGroup.position.set(
          Math.cos(angle) * size * 1.4,
          y + size * 2.5,
          Math.sin(angle) * size * 1.4
        );
        parent.add(bGroup);
        buildBranch(bGroup, 0, bSize, depth - 1);
      }
    };

    buildBranch(plantGroup, 0, 0.55, 3);
    scene.add(plantGroup);
    ref.current.push(plantGroup);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  END RODS — Glowing white lanterns on towers
// ─────────────────────────────────────────────────────────────────────────────
function buildEndRods(scene, ref) {
  const rodPositions = [
    [0, 27.5, 0],
    [12, 20, -4],
    [-10, 16.5, -6],
    [18, 8.5, -14],
    [-2, 20, 8],
    [6, 10.5, -2],
    [-4, 5, 10],
    [20, 4, 4]
  ];

  rodPositions.forEach(([x, y, z]) => {
    const rodGroup = new THREE.Group();
    rodGroup.position.set(x, y, z);

    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xc4e4ff,
      emissiveIntensity: 2.0,
      roughness: 0.1
    });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.name = "rodGlow";
    rodGroup.add(rod);

    const ptLight = new THREE.PointLight(0xd0e8ff, 1.5, 8, 2.5);
    rodGroup.add(ptLight);

    scene.add(rodGroup);
    ref.current.push(rodGroup);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  FLOATING END SHIP
// ─────────────────────────────────────────────────────────────────────────────
function buildEndShip() {
  const shipGroup = new THREE.Group();

  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x7a4fa0,
    roughness: 0.6,
    metalness: 0.15,
    emissive: 0x3a1a55,
    emissiveIntensity: 0.4
  });
  const deckMat = new THREE.MeshStandardMaterial({
    color: 0x5d3a7a,
    roughness: 0.7
  });
  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x1a0e2e,
    roughness: 0.85,
    metalness: 0.2
  });

  const addBox = (mat, x, y, z, w, h, d) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    shipGroup.add(m);
    return m;
  };

  // Main hull
  addBox(hullMat, 0, 0, 0, 10, 2.5, 5);
  addBox(hullMat, 0, 0, 0, 8, 1.5, 6.5);
  addBox(obsidianMat, 0, -1.5, 0, 6, 1, 3);
  addBox(deckMat, 0, 1.5, 0, 9, 0.5, 4.5);

  // Bow
  const bowGeo = new THREE.ConeGeometry(2, 3, 4);
  const bow = new THREE.Mesh(bowGeo, hullMat);
  bow.rotation.z = Math.PI / 2;
  bow.position.set(6, 0, 0);
  shipGroup.add(bow);

  // Stern
  addBox(hullMat, -5, 0.5, 0, 3, 3, 5);
  addBox(hullMat, -6.5, 1.5, 0, 1.5, 2.5, 4);

  // Mast
  addBox(deckMat, 0, 2, 0, 0.4, 6, 0.4);

  // Obsidian platform on deck
  addBox(obsidianMat, -2, 2.5, 0, 2.5, 1, 2);

  // End Chest
  const chestMat = new THREE.MeshStandardMaterial({
    color: 0x1a1040,
    roughness: 0.7,
    emissive: 0x7c3aed,
    emissiveIntensity: 1.6
  });
  addBox(chestMat, -2, 3.5, 0, 1.2, 0.9, 0.9);

  // Elytra display
  const elytraMat = new THREE.MeshStandardMaterial({
    color: 0xf9d8ff,
    roughness: 0.3,
    emissive: 0xd946ef,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.85
  });
  const lwGeo = new THREE.BoxGeometry(2, 0.1, 1.8);
  const lw = new THREE.Mesh(lwGeo, elytraMat);
  lw.position.set(-1.5, 3.2, -1.5);
  lw.rotation.z = -0.35;
  lw.rotation.y = 0.3;
  shipGroup.add(lw);

  const rw = new THREE.Mesh(lwGeo, elytraMat);
  rw.position.set(-1.5, 3.2, 1.5);
  rw.rotation.z = -0.35;
  rw.rotation.y = -0.3;
  shipGroup.add(rw);

  // End rods on ship
  const shipRodMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xb8e0ff,
    emissiveIntensity: 2.5
  });
  [[3, 2.5, -2], [3, 2.5, 2], [-4, 2.5, -2], [-4, 2.5, 2]].forEach(([rx, ry, rz]) => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 6), shipRodMat);
    rod.position.set(rx, ry, rz);
    shipGroup.add(rod);
  });

  return shipGroup;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ELYTRA PARTICLE TRAILS — Orbiting the End Ship
// ─────────────────────────────────────────────────────────────────────────────
function buildElytraParticles(quality) {
  const count = quality === "high" ? 300 : 140;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const speeds = [];
  const origins = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = 3 + Math.random() * 5;
    positions[i * 3]     = -4 + Math.cos(angle) * r;
    positions[i * 3 + 1] = 22 + (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = -10 + Math.sin(angle) * r;

    const t = Math.random();
    if (t < 0.4) {
      colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.28; colors[i * 3 + 2] = 0.98;
    } else if (t < 0.7) {
      colors[i * 3] = 0.6;  colors[i * 3 + 1] = 0.2;  colors[i * 3 + 2] = 0.95;
    } else {
      colors[i * 3] = 0.95; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0;
    }

    speeds.push(0.4 + Math.random() * 0.9);
    origins.push(angle);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: quality === "high" ? 0.22 : 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const pts = new THREE.Points(geo, mat);
  pts.userData = { speeds, origins };
  return pts;
}

// ─────────────────────────────────────────────────────────────────────────────
//  VOID STAR FIELD
// ─────────────────────────────────────────────────────────────────────────────
function buildVoidStars(scene, quality) {
  const count = quality === "high" ? 1200 : 500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 80 + Math.random() * 40;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.28,
    color: 0xddc8ff,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  scene.add(new THREE.Points(geo, mat));
}
