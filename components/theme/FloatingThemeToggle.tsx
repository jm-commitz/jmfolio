'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const REVEAL_MS = 550;

export default function FloatingThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  // Avoid hydration mismatch — theme is only known on the client.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  // Switch with a circular reveal growing out of this button (View
  // Transitions API). Falls back to an instant switch where unsupported or
  // when the visitor prefers reduced motion.
  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    const apply = () => {
      // Set the class right away so the "new" snapshot is the new theme;
      // next-themes then persists it and keeps its own state in sync.
      const root = document.documentElement;
      root.classList.toggle('dark', next === 'dark');
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce || !button.current) {
      apply();
      return;
    }

    const rect = button.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // Radius that reaches the farthest corner of the viewport.
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: REVEAL_MS,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  };

  return (
    <button
      ref={button}
      type="button"
      data-tour="theme"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      onClick={toggle}
      // Positioning lives on the FloatingRail wrapper in app/layout.tsx.
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-[var(--background)] text-[var(--foreground)] shadow-lg transition-colors hover:bg-[var(--accent)]"
    >
      {/* key remounts the icon so it spins in on every switch */}
      <span key={mounted ? resolvedTheme : 'ssr'} className="theme-icon-in inline-flex">
        {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </span>
    </button>
  );
}
