# How to Restore Minecraft Themes (End City & Ancient City)

All 3D models, procedural shaders, audio triggers, and portal overlays for the **End City** and **Ancient City** themes are preserved here.

## Files Preserved:
1. `AncientCityScene.jsx` - Subterranean Sculk voxel realm with Warden, resonance pulses, and custom shaders.
2. `EndCityScene.jsx` - Purpur spires, floating End Ship, animated Shulkers, and Chorus plants.
3. `PortalIntroOverlay.jsx` - Cinematic End portal transition sequence.

## How to Re-Enable in `App.jsx`:
1. Re-import the scenes at the top of `src/App.jsx`:
   ```javascript
   import AncientCityScene from "./three/AncientCityScene";
   import EndCityScene from "./three/EndCityScene";
   import PortalIntroOverlay from "./components/PortalIntroOverlay";
   ```
2. In `src/App.jsx`, change the `themeCycle`:
   ```javascript
   const themeCycle = ["studio", "endcity", "ancient"];
   ```
3. In the return JSX of `src/App.jsx`, uncomment or render the scenes:
   ```jsx
   {theme === "endcity" && <EndCityScene ... />}
   {theme === "ancient" && <AncientCityScene ... />}
   ```
4. In `src/components/Navbar.jsx`, restore the `onToggleTheme` button in the header.
