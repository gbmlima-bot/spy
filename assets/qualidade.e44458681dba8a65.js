// Controller independent of WebGL: raw wall time, hysteresis and a manual override.
(function (root) {
  const profiles = Object.freeze({
    high: Object.freeze({ dpr: 2, shadow: 4096, samples: 4, bloom: .5, blur: 1, detail: 1 }),
    balanced: Object.freeze({ dpr: 1.5, shadow: 2048, samples: 2, bloom: .25, blur: .5, detail: .7 }),
    low: Object.freeze({ dpr: 1, shadow: 1024, samples: 0, bloom: 0, blur: 0, detail: .4 })
  });
  const tiers = ['low', 'balanced', 'high'];
  class Quality {
    constructor(storage, changed = () => {}) {
      this.storage = storage; this.changed = changed; this.mode = 'auto'; this.tier = 'balanced'; this.scale = 1;
      try { const s = storage?.getItem('mira-quality'); if (s === 'auto' || profiles[s]) this.mode = s; } catch (_) {}
      if (this.mode !== 'auto') this.tier = this.mode;
      this.lastChange = -Infinity; this.reset(0);
    }
    reset(now) { this.last = 0; this.windowStart = now; this.frames = 0; this.slow = 0; this.fastSince = null; this.warmUntil = now + 3000; }
    set(mode, now = performance.now()) {
      if (mode !== 'auto' && !profiles[mode]) throw Error('Unknown quality: ' + mode);
      this.mode = mode; this.tier = mode === 'auto' ? 'balanced' : mode; this.scale = 1; this.lastChange = now;
      try { this.storage?.setItem('mira-quality', mode); } catch (_) {}
      this.reset(now); this.changed(this.snapshot());
    }
    snapshot() {
      if (!this.cached || this.cached.mode !== this.mode || this.cached.tier !== this.tier || this.cached.scale !== this.scale) this.cached = Object.freeze({ mode: this.mode, tier: this.tier, scale: this.scale, ...profiles[this.tier] });
      return this.cached;
    }
    sample(now, valid = true) {
      if (!valid) { this.reset(now); return; }
      this.last = now;
      if (this.mode !== 'auto' || now < this.warmUntil) return;
      if (!this.frames) this.windowStart = now;
      this.frames++;
      const elapsed = now - this.windowStart;
      if (elapsed < 3000) return;
      const fps = (this.frames - 1) * 1000 / elapsed; this.frames = 0;
      this.slow = fps < 45 ? this.slow + 1 : 0;
      if (fps > 57) { if (this.fastSince === null) this.fastSince = this.windowStart; } else this.fastSince = null;
      if (now - this.lastChange < 10000) return;
      let index = tiers.indexOf(this.tier), change = false;
      if (this.slow >= 2) {
        if (index > 0) { this.tier = tiers[index - 1]; this.scale = 1; change = true; }
        else if (fps < 30 && this.scale > .75) { this.scale = Math.max(.75, +(this.scale - .1).toFixed(2)); change = true; }
      } else if (this.fastSince !== null && now - this.fastSince >= 15000) {
        if (this.scale < 1) { this.scale = Math.min(1, +(this.scale + .1).toFixed(2)); change = true; }
        else if (index < 2) { this.tier = tiers[index + 1]; change = true; }
      }
      if (change) { this.lastChange = now; this.reset(now); this.changed(this.snapshot()); }
    }
  }
  const api = { Quality, profiles };
  if (typeof module !== 'undefined') module.exports = api;
  else root.MIRA_QUALITY = api;
})(typeof window === 'undefined' ? globalThis : window);
