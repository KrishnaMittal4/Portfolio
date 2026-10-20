# Ancient City 3D Portfolio — Real-time WebGL Experience

An interactive 3D developer portfolio inspired by the **Deep Dark Ancient City** and **Warden** aesthetic, built with **React 19**, **Three.js**, **WebGL**, and **Web Audio API**.

---

## 🌟 Key Features

1. **Procedural Voxel Ancient City Environment**:
   - Imposing **Central Portal Structure** made of reinforced deepslate voxels with an animated inner soul void.
   - Weathered colonnades, ruined pillars, sculk catalysts, and bone block shrines.
   - InstancedMesh terrain rendering delivering silky-smooth 60-120 FPS performance.
   - 1,800+ floating soul particles / catalyst embers rising from the subterranean cavern.

2. **Animated Voxel Warden Entity**:
   - Articulated voxel guardian with idle breathing, head tracking (looking toward cursor and camera), and twitching sculk antennae.
   - **Glowing Soul Core Heartbeat**: Synchronized emissive chest lighting throbbing with sub-bass audio and sculk vibrations.
   - Interactive reaction: triggers alert animations when the user scrolls or emits sculk vibration pings.

3. **Cinematic Scroll-Driven Camera Choreography**:
   - Glides smoothly through 5 subterranean waypoints as you scroll:
     - **Waypoint 0: The Descent (Overview & Hero)**: Grand view of the portal archway and entrance ruins.
     - **Waypoint 1: The Sculk Archives (Lore & About)**: Flight down through side colonnades and developer genesis.
     - **Waypoint 2: The Chamber of Relics (Projects)**: Holographic displays of featured engineering projects.
     - **Waypoint 3: The Guardian's Core (Warden & Skills)**: Direct close-up encounter with the towering Warden and skill mastery matrices.
     - **Waypoint 4: The Altar of Echoes (Echoes & Contact)**: Panoramic vista overlooking the illuminated subterranean city.

4. **Dual Camera Modes**:
   - **Cinematic Tour**: Scroll-controlled narrative camera flight.
   - **Free Roam 3D Mode**: Click the **Compass / Free Roam** button in the HUD to freely orbit, rotate, zoom, and inspect every voxel block in full 3D!

5. **Procedural Subterranean Audio Synthesizer**:
   - Web Audio API procedural sound engine: zero external audio downloads or broken asset dependencies.
   - Ambient deep subterranean drone, sculk crystal resonance pings, and sub-bass Warden heartbeat pulses.
   - Mute / Unmute audio toggle with live equalizer wave visualizer in the top HUD.

6. **In-App Profile Customizer (Live Editing & JSON Export)**:
   - Click **"Edit Profile"** in the top HUD or hero section to customize your Name, Title, Tagline, Bio, Status, Email, and Social links in real time.
   - Real-time LocalStorage persistence so your custom changes stay saved.
   - Includes **Export JSON** and **Reset to Defaults** options.

7. **Subterranean Radar HUD**:
   - Bottom-corner navigation HUD showing deep cavern coordinates (`Y: -54`, matching Minecraft Ancient City depth), sector names, vibration radar blips, and threat telemetry.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone or navigate to the directory
cd Portfolio

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **3D Graphics Engine**: Three.js & WebGL 2.0
- **Audio**: Web Audio API (Procedural Synthesis)
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism & Custom Keyframe Shaders
- **Icons**: Lucide React & Handcrafted SVGs
