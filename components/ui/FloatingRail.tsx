'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'railCollapsed';

// Bottom-right floating rail (viewers, Spotify, theme) with a chevron that
// collapses it down to a single button. The choice is remembered per visitor.
export default function FloatingRail({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  // overflow stays hidden while animating so items don't spill over the
  // chevron; once fully open it's visible again so hover cards aren't clipped.
  const [settled, setSettled] = useState(true);

  useEffect(() => {
    let collapsed = false;
    try {
      collapsed = localStorage.getItem(STORAGE_KEY) === '1';
    } catch {}
    if (!collapsed) return;
    const t = setTimeout(() => {
      setOpen(false);
      setSettled(false);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    setSettled(false);
    try {
      localStorage.setItem(STORAGE_KEY, next ? '0' : '1');
    } catch {}
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="floating-rail-items"
        aria-label={open ? 'Collapse quick actions' : 'Expand quick actions'}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-[var(--background)] text-[var(--muted-foreground)] shadow-lg transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>

      <div
        id="floating-rail-items"
        data-collapsed={!open}
        inert={!open}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && open) setSettled(true);
        }}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div
          className={`-m-3 flex min-h-0 flex-col items-center gap-2 p-3 ${
            open && settled ? 'overflow-visible' : 'overflow-hidden'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
