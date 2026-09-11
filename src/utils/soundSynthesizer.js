// Web Audio API Synthesizer for Pain SOS Mode
// 100% Offline, Pure Synthesized Audio with Zero External Files

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.activeNodes = [];
    this.currentTrack = null;
    this.gainNode = null;
    this.volume = 0.6;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  stop() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {
        // already stopped
      }
    });
    this.activeNodes = [];
    this.currentTrack = null;
  }

  // Brown Noise Generator (deep, warm, womb-like calming frequencies)
  playBrownNoise() {
    this.stop();
    this.initContext();

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain boost
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle low-pass filter to smooth the noise
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.7, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, this.gainNode);
    this.currentTrack = 'brown';
  }

  // Gentle Rain Sound Simulator
  playRain() {
    this.stop();
    this.initContext();

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Highpass to remove heavy mud
    const hpFilter = this.ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(600, this.ctx.currentTime);

    // Lowpass to simulate droplet texture
    const lpFilter = this.ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.45, this.ctx.currentTime);

    noiseSource.connect(hpFilter);
    hpFilter.connect(lpFilter);
    lpFilter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    noiseSource.start();
    this.activeNodes.push(noiseSource, hpFilter, lpFilter, this.gainNode);
    this.currentTrack = 'rain';
  }

  // 432 Hz Calm Healing Drone with subtle 4Hz Delta Binaural wave
  playCalmDrone() {
    this.stop();
    this.initContext();

    const baseFreq = 432; // Sacred calming frequency
    const deltaBeat = 4;   // 4Hz deep relaxation delta wave

    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(baseFreq + deltaBeat, this.ctx.currentTime);

    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(baseFreq / 2, this.ctx.currentTime); // 216Hz warm sub

    const pannerLeft = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (pannerLeft) pannerLeft.pan.value = -0.7;

    const pannerRight = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (pannerRight) pannerRight.pan.value = 0.7;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);

    if (pannerLeft && pannerRight) {
      oscLeft.connect(pannerLeft);
      pannerLeft.connect(this.gainNode);
      oscRight.connect(pannerRight);
      pannerRight.connect(this.gainNode);
    } else {
      oscLeft.connect(this.gainNode);
      oscRight.connect(this.gainNode);
    }

    subOsc.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    oscLeft.start();
    oscRight.start();
    subOsc.start();

    this.activeNodes.push(oscLeft, oscRight, subOsc, this.gainNode);
    this.currentTrack = 'drone';
  }

  // Soft Singing Bowl / Chime for Timer Completion
  playGong() {
    this.initContext();
    const now = this.ctx.currentTime;
    
    const freqs = [528, 792, 1056]; // Solfeggio 528Hz harmonic
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.5);
    });
  }
}

export const soundSynth = new SoundSynthesizer();
