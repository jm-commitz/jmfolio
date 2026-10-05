'use client';

import { useEffect, useRef } from 'react';

const GAP = 22; // px between dots
const BASE_R = 1.2; // resting dot radius
const PULSE_SHARE = 0.06; // fraction of dots that breathe
const PULSE_MAX_R = 3.2; // radius at the peak of a breath
const FPS = 30;

type Pulse = { x: number; y: number; phase: number; speed: number };

// Fixed decorative background: dot grid (canvas) + top glow + grain (CSS, see
// .page-bg). A scattered few dots slowly grow and shrink, each on its own
// rhythm. Static under prefers-reduced-motion; pauses when the tab is hidden.
export default function PageBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const base = document.createElement('canvas'); // static grid, drawn once per resize
    let pulses: Pulse[] = [];
    let color = '';
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let lastW = 0;

    const readColor = () => {
      color = getComputedStyle(document.documentElement).getPropertyValue('--bg-dot').trim();
    };

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      // Cover the tallest the viewport gets (mobile URL bar hiding), so height
      // changes don't force a re-layout that would re-scatter the pulses.
      const h = Math.max(window.innerHeight, window.screen.height);
      lastW = w;
      for (const c of [canvas, base]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

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

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / FPS) return;
      last = t;
      draw(t);
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
    // Theme switches change --bg-dot: redraw in the new colour.
    const themeObserver = new MutationObserver(() => {
      readColor();
      layout();
      draw(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const onVisibility = () => {
      cancelAnimationFrame(raf);
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
    </div>
  );
}
