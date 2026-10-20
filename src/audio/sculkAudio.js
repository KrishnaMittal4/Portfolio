// Procedural Sculk & Ancient City Audio Synthesizer via Web Audio API
// Generates ambient subterranean cavern drones, sculk crystal resonances, and Warden heartbeats without external asset dependencies.

class SculkAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.droneGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.filter = null;
    this.isMuted = true;
    this.isInitialized = false;
    this.onStateChange = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Low-pass filter for dark subterranean cavern acoustics
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(280, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(3.5, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // Ambient Drone Gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.droneGain.connect(this.filter);

      // Detuned subterranean drone oscillators
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = "sine";
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = "triangle";
      this.droneOsc2.frequency.setValueAtTime(53.8, this.ctx.currentTime); // Slight binaural detune

      this.droneOsc1.connect(this.droneGain);
      this.droneOsc2.connect(this.droneGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio not supported or failed to initialize:", e);
    }
  }

  toggleMute() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    const targetGain = this.isMuted ? 0 : 0.65;
    
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }

    if (this.onStateChange) {
      this.onStateChange(!this.isMuted);
    }

    if (!this.isMuted) {
      this.playSculkResonance(440);
    }

    return !this.isMuted;
  }

  // Plays a crystal sculk vibration chime when the user interacts or scrolls
  playSculkResonance(frequency = 520) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.8, now + 0.4);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      // Ignored
    }
  }

  // Plays a deep Warden heartbeat sub-thud
  playWardenHeartbeat() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.28);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Ignored
    }
  }

  // Plays the intense Warden Sonic Boom charge-up and shockwave roar
  playSonicBoom() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Charge-up high pitch energy whistle
      const chargeOsc = this.ctx.createOscillator();
      const chargeGain = this.ctx.createGain();
      chargeOsc.type = "sawtooth";
      chargeOsc.frequency.setValueAtTime(140, now);
      chargeOsc.frequency.exponentialRampToValueAtTime(920, now + 1.1);

      chargeGain.gain.setValueAtTime(0.02, now);
      chargeGain.gain.linearRampToValueAtTime(0.22, now + 1.05);
      chargeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

      chargeOsc.connect(chargeGain);
      chargeGain.connect(this.masterGain);
      chargeOsc.start(now);
      chargeOsc.stop(now + 1.15);

      // 2. The Sonic Boom Blast at t + 1.1s
      const blastTime = now + 1.1;
      const blastOsc = this.ctx.createOscillator();
      const blastGain = this.ctx.createGain();
      blastOsc.type = "sine";
      blastOsc.frequency.setValueAtTime(95, blastTime);
      blastOsc.frequency.exponentialRampToValueAtTime(24, blastTime + 0.8);

      blastGain.gain.setValueAtTime(0.55, blastTime);
      blastGain.gain.exponentialRampToValueAtTime(0.001, blastTime + 0.95);

      blastOsc.connect(blastGain);
      blastGain.connect(this.masterGain);
      blastOsc.start(blastTime);
      blastOsc.stop(blastTime + 0.95);
    } catch (e) {
      // Ignored
    }
  }

  // Plays a mechanical Redstone repeater tick/click
  playRedstoneClick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      // Ignored
    }
  }

  // Plays an energized Redstone signal pulse humming sound
  playRedstonePulse(freq = 440) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.25, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // Ignored
    }
  }

  // Plays an ethereal Ender teleportation whoosh & chime
  playEnderTeleport(freq = 580) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.45);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      // Ignored
    }
  }

  // Plays an End Crystal resonance detonation & shockwave harmonic
  playEndCrystalResonance() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;

      // Deep sub bass blast
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = "sine";
      bass.frequency.setValueAtTime(160, now);
      bass.frequency.exponentialRampToValueAtTime(38, now + 0.85);
      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      bass.connect(bassGain);
      bassGain.connect(this.masterGain);
      bass.start(now);
      bass.stop(now + 0.9);

      // Crystalline shimmer overtone
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = "triangle";
      chime.frequency.setValueAtTime(987.77, now); // B5 note
      chime.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
      chime.frequency.exponentialRampToValueAtTime(440, now + 1.2);
      chimeGain.gain.setValueAtTime(0.18, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      chime.connect(chimeGain);
      chimeGain.connect(this.masterGain);
      chime.start(now);
      chime.stop(now + 1.2);
    } catch (e) {
      // Ignored
    }
  }

  // Plays a Shulker shell snap & levitation projectile sound
  playShulkerShoot() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;

      // Shell opening clack / pop
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = "square";
      click.frequency.setValueAtTime(340, now);
      click.frequency.exponentialRampToValueAtTime(90, now + 0.05);
      clickGain.gain.setValueAtTime(0.2, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      click.connect(clickGain);
      clickGain.connect(this.masterGain);
      click.start(now);
      click.stop(now + 0.06);

      // Rising levitation bullet projectile whistling shimmer
      const bullet = this.ctx.createOscillator();
      const bulletGain = this.ctx.createGain();
      bullet.type = "sine";
      bullet.frequency.setValueAtTime(440, now + 0.04);
      bullet.frequency.exponentialRampToValueAtTime(1180, now + 0.35);
      bulletGain.gain.setValueAtTime(0.14, now + 0.04);
      bulletGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      bullet.connect(bulletGain);
      bulletGain.connect(this.masterGain);
      bullet.start(now + 0.04);
      bullet.stop(now + 0.4);
    } catch (e) {
      // Ignored
    }
  }
}

export const sculkAudio = new SculkAudioEngine();
