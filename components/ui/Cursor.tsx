'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/** Vertical gap from pointer hotspot to bottom edge of VIEW PROJECT (px). */
const VIEW_LABEL_GAP = 16;

function applyViewProjectLabelPosition(el: HTMLDivElement, clientX: number, clientY: number) {
  el.style.left = `${clientX}px`;
  el.style.top = `${clientY}px`;
  el.style.transform = `translate(-50%, calc(-100% - ${VIEW_LABEL_GAP}px))`;
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const viewProjectRef = useRef(false);
  const posRef = useRef({ x: 0, y: 0 });

  const [isHovered, setIsHovered] = useState(false);
  const [viewProject, setViewProject] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsHovered(false);
    setViewProject(false);
    viewProjectRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!viewProject || !labelRef.current) return;
    const { x, y } = posRef.current;
    applyViewProjectLabelPosition(labelRef.current, x, y);
  }, [viewProject]);

  useEffect(() => {
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      posRef.current = { x: mx, y: my };

      if (viewProjectRef.current && labelRef.current) {
        applyViewProjectLabelPosition(labelRef.current, mx, my);
      } else if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;

      if (ringRef.current && !viewProjectRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(loop);
    };

    const handleInteractiveEnter = () => setIsHovered(true);
    const handleInteractiveLeave = () => setIsHovered(false);

    const handleViewProjectEnter = () => {
      viewProjectRef.current = true;
      setViewProject(true);
    };
    const handleViewProjectLeave = () => {
      viewProjectRef.current = false;
      setViewProject(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(loop);

    const checkHover = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, .hover-trigger, .proj-row, .tc, .ac, .wc, .btn-y'
      );
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleInteractiveEnter);
        el.removeEventListener('mouseleave', handleInteractiveLeave);
        el.addEventListener('mouseenter', handleInteractiveEnter);
        el.addEventListener('mouseleave', handleInteractiveLeave);
      });

      const viewProjectEls = document.querySelectorAll('.cursor-view-project');
      viewProjectEls.forEach((el) => {
        el.removeEventListener('mouseenter', handleViewProjectEnter);
        el.removeEventListener('mouseleave', handleViewProjectLeave);
        el.addEventListener('mouseenter', handleViewProjectEnter);
        el.addEventListener('mouseleave', handleViewProjectLeave);
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
      {!viewProject && (
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
      )}
      {viewProject && (
        <div
          ref={labelRef}
          className="cursor-view-project-label"
          style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 10000 }}
        >
          VIEW PROJECT
        </div>
      )}
    </>
  );
}
