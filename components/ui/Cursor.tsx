'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';


export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsHovered(false);
  }, [pathname]);


  useEffect(() => {
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Update dot immediately, keeping -50% centering
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(loop);
    };

    const handleMouseOver = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);

    window.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(loop);

    const checkHover = () => {
      const interactiveElements = document.querySelectorAll('a, button, .hover-trigger, .proj-row, .tc, .ac, .wc, .btn-y');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseOver);
        el.removeEventListener('mouseleave', handleMouseOut);
        el.addEventListener('mouseenter', handleMouseOver);
        el.addEventListener('mouseleave', handleMouseOut);
      });
    };


    checkHover();
    const observer = new MutationObserver(() => checkHover());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`cur ${isHovered ? 'on' : ''}`}
        style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 9999 }}
      />
      <div
        ref={ringRef}
        className={`cur-ring ${isHovered ? 'on' : ''}`}
        style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 9998 }}
      />
    </>
  );
}
