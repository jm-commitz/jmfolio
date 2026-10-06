'use client';

import { useEffect, useRef } from 'react';

const GAP = 22; // px between dots
const BASE_R = 1.2; // resting dot radius
const PULSE_SHARE = 0.06; // fraction of dots that breathe
const PULSE_MAX_R = 3.2; // radius at the peak of a breath
const FPS = 30;

type Pulse = { x: number; y: number; phase: number; speed: number };

// Quick streaks (from the Socia Figma reference): tiny thin dashes that zip a
// short way along the grid lines, flash and fade within a fraction of a second.
type Streak = {
  axis: 'h' | 'v';
  x: number; // head position
  y: number;
  dir: 1 | -1;
  len: number; // px
  speed: number; // px/s
  life: number; // s
  age: number; // s
};
const STREAK_MAX = 10; // alive at once (desktop); halved on small screens
const STREAK_SPAWN_MIN = 0.09; // s between spawns
const STREAK_SPAWN_MAX = 0.26;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** "#rrggbb" / "#rgb" → [r, g, b]; anything else falls back to mid-grey. */
function rgbOf(color: string): [number, number, number] {
  const hex = color.replace('#', '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  const n = parseInt(full, 16);
  return Number.isNaN(n) || full.length !== 6
    ? [160, 160, 160]
    : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Fixed decorative background: dot grid (canvas) + top glow + grain (CSS, see
// .page-bg). A scattered few dots slowly grow and shrink, each on its own
// rhythm, and quick streaks flick along the grid lines across the page.
// Static (no streaks) under prefers-reduced-motion; pauses when the tab is hidden.
export default function PageBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streakRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const streakCanvas = streakRef.current;
    const sctx = streakCanvas?.getContext('2d');
    if (!canvas || !ctx || !streakCanvas || !sctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const base = document.createElement('canvas'); // static grid, drawn once per resize
    let pulses: Pulse[] = [];
    let color = '';
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let lastW = 0;
    let streaks: Streak[] = [];
    let fg: [number, number, number] = [160, 160, 160];
    let peak = 0.35;
    let lastStreakT = 0;
    let nextSpawn = 0;

    const readColor = () => {
      const css = getComputedStyle(document.documentElement);
      color = css.getPropertyValue('--bg-dot').trim();
      fg = rgbOf(css.getPropertyValue('--foreground').trim());
      peak = document.documentElement.classList.contains('dark') ? 0.35 : 0.28;
    };

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      // Cover the tallest the viewport gets (mobile URL bar hiding), so height
      // changes don't force a re-layout that would re-scatter the pulses.
      const h = Math.max(window.innerHeight, window.screen.height);
      lastW = w;
      for (const c of [canvas, base, streakCanvas]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      for (const c of [canvas, streakCanvas]) {
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
      }

      const bctx = base.getContext('2d');
      if (!bctx) return;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, w, h);
      bctx.fillStyle = color;
      pulses = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          bctx.beginPath();
          bctx.arc(x, y, BASE_R, 0, Math.PI * 2);
          bctx.fill();
          if (Math.random() < PULSE_SHARE) {
            pulses.push({
              x,
              y,
              phase: Math.random() * Math.PI * 2,
              speed: 0.4 + Math.random() * 0.9, // radians/sec — 3.5s to 15s per breath
            });
          }
        }
      }
    };

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      if (reduce) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = color;
      const s = t / 1000;
      for (const p of pulses) {
        // Eased 0→1→0 breath; mostly resting, briefly swelling.
        const wave = 0.5 - 0.5 * Math.cos(s * p.speed + p.phase);
        const k = wave * wave * wave;
        const r = BASE_R + (PULSE_MAX_R - BASE_R) * k;
        if (r <= BASE_R + 0.05) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const spawn = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Snap to the dot grid lines so streaks run along the grid.
      streaks.push({
        axis: Math.random() < 0.65 ? 'h' : 'v',
        x: GAP / 2 + Math.floor(Math.random() * (w / GAP)) * GAP,
        y: GAP / 2 + Math.floor(Math.random() * (h / GAP)) * GAP,
        dir: Math.random() < 0.5 ? 1 : -1,
        len: rand(10, 36),
        speed: rand(220, 520),
        life: rand(0.35, 0.9),
        age: 0,
      });
    };

    const drawStreaks = (t: number) => {
      const dt = lastStreakT ? Math.min(0.1, (t - lastStreakT) / 1000) : 0;
      lastStreakT = t;
      const cap = window.innerWidth < 768 ? STREAK_MAX / 2 : STREAK_MAX;

      nextSpawn -= dt;
      if (nextSpawn <= 0 && streaks.length < cap) {
        spawn();
        nextSpawn = rand(STREAK_SPAWN_MIN, STREAK_SPAWN_MAX);
      }

      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.clearRect(0, 0, streakCanvas.width, streakCanvas.height);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.lineWidth = 1;
      sctx.lineCap = 'round';
      const [cr, cg, cb] = fg;

      streaks = streaks.filter((st) => {
        st.age += dt;
        if (st.age >= st.life) return false;
        const move = st.speed * st.dir * dt;
        if (st.axis === 'h') st.x += move;
        else st.y += move;

        // Flash in and out over its short life.
        const a = Math.sin((Math.PI * st.age) / st.life) * peak;
        const tx = st.axis === 'h' ? st.x - st.len * st.dir : st.x;
        const ty = st.axis === 'v' ? st.y - st.len * st.dir : st.y;

        // Tail transparent → head bright.
        const grad = sctx.createLinearGradient(tx, ty, st.x, st.y);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},${a})`);
        sctx.strokeStyle = grad;
        sctx.beginPath();
        sctx.moveTo(tx, ty);
        sctx.lineTo(st.x, st.y);
        sctx.stroke();

        // Tiny bright head for the "flash".
        sctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(1, a * 1.6)})`;
        sctx.beginPath();
        sctx.arc(st.x, st.y, 0.75, 0, Math.PI * 2);
        sctx.fill();
        return true;
      });
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / FPS) return;
      last = t;
      draw(t);
      drawStreaks(t);
    };

    readColor();
    layout();
    draw(performance.now());
    if (!reduce) raf = requestAnimationFrame(loop);

    const onResize = () => {
      if (window.innerWidth === lastW) return;
      layout();
      draw(performance.now());
    };
    // Theme switches change --bg-dot / --foreground: redraw in the new colours.
    const themeObserver = new MutationObserver(() => {
      readColor();
      layout();
      draw(performance.now());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      lastStreakT = 0; // don't fast-forward streaks after the tab was hidden
      if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="page-bg">
      <div className="page-bg-dots">
        <canvas ref={canvasRef} className="absolute left-0 top-0" />
      </div>
      {/* Quick streaks along the grid, across the whole page (not corner-masked) */}
      <div className="page-bg-streaks">
        <canvas ref={streakRef} className="absolute left-0 top-0" />
      </div>
    </div>
  );
}
