'use client';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>('.h-block');
    const handleMouseMove = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      blocks.forEach(b => {
        const spd = parseFloat(b.dataset.spd || "1");
        const axis = b.dataset.axis || 'xy';
        const dx = axis.includes('x') ? cx * spd * 30 : 0;
        const dy = axis.includes('y') ? cy * spd * 30 : 0;
        b.style.transform = `translate(${dx}px,${dy}px) ${b.classList.contains('hb3') ? 'rotate(15deg)' : b.classList.contains('hb4') ? 'rotate(-8deg)' : ''}`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => {
      const d = parseFloat(el.getAttribute('data-d') || "0");
      (el as HTMLElement).style.transitionDelay = d + 's';
      obs.observe(el);
    });

    const animCount = (el: HTMLElement) => {
      const target = +(el.dataset.count || 0);
      const suf = el.dataset.suf || '';
      const dur = 1200;
      const start = performance.now();
      function step(now: number) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    const countObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animCount(e.target as HTMLElement);
          countObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-n[data-count]').forEach(el => countObs.observe(el));

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      obs.disconnect();
      countObs.disconnect();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero" id="home">
      <div className="h-ghost">DEVELOPER</div>
      <div className="h-scan"></div>

      <div className="h-block hb1" data-spd="2.5" data-axis="y"></div>
      <div className="h-block hb2" data-spd="-2" data-axis="x"></div>
      <div className="h-block hb3" data-spd="1.5" data-axis="xy"></div>
      <div className="h-block hb4" data-spd="-3" data-axis="y"></div>
      <div className="h-block hb5" data-spd="1" data-axis="x"></div>

      <div className="h-sticker hs-ready">READY?</div>
      <div className="h-sticker hs-cross">×</div>
      <div className="h-sticker hs-note">// PHL</div>
      <div className="h-barcode"></div>

      <div className="h-content">
        <div className="avail reveal"><span className="avail-dot"></span>Available for Projects</div>
        <h1 className="h-title">
          <span className="hl1 reveal" data-d="0.05">BUILDING</span>
          <span className="hl2 glitch reveal" data-g="PRODUCTS" data-d="0.1">PRODUCTS</span>
          <span className="hl3 reveal" data-d="0.15">THAT WORK.</span>
        </h1>
        <p className="h-desc reveal" data-d="0.2">Full-stack and mobile developer based in the Philippines. I build SaaS platforms, mobile apps, and web systems for businesses that need real solutions — not cookie-cutter templates.</p>
        <div className="h-btns reveal" data-d="0.25">
          <a href="#projects" className="btn-y hover-trigger">See My Work →</a>
          <a href="mailto:anchetajaymark69@gmail.com" className="btn-o hover-trigger">Get In Touch</a>
        </div>
      </div>
    </section>
  );
}
