'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// iOS App Store-style top bar: a "‹ Projects" back link, plus a compact
// icon/title/button that fades in once the big app header scrolls away.
export default function StickyAppBar({
  watchId,
  compact,
}: {
  watchId: string;
  compact: ReactNode;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), {
      rootMargin: '-56px 0px 0px 0px', // bar height
    });
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur-xl transition-colors ${
        show ? 'border-[var(--border)]' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-5">
        <Link
          href="/#projects"
          className="-ml-1.5 inline-flex items-center gap-0.5 text-[15px] font-medium text-[var(--foreground)] transition-opacity hover:opacity-70"
        >
          <ChevronLeft className="h-5 w-5" />
          Projects
        </Link>

        <div
          aria-hidden={!show}
          className={`flex min-w-0 items-center gap-2.5 transition duration-300 ${
            show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
          }`}
        >
          {compact}
        </div>
      </div>
    </header>
  );
}
