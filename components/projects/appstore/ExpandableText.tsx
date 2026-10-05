'use client';

import { useEffect, useRef, useState } from 'react';

// App Store description: clamped to a few lines with a "more" link, which only
// appears when the text actually overflows.
export default function ExpandableText({ text, lines = 3 }: { text: string; lines?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    const ro = new ResizeObserver(() => setOverflows(el.scrollHeight > el.clientHeight + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded]);

  return (
    <div className="relative">
      <p
        ref={ref}
        className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--foreground)]"
        style={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
      >
        {text}
      </p>
      {overflows && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="absolute bottom-0 right-0 bg-[var(--background)] pl-6 text-[15px] font-medium text-[var(--foreground)] underline-offset-2 [mask-image:linear-gradient(to_right,transparent,black_1.5rem)] hover:underline"
        >
          more
        </button>
      )}
    </div>
  );
}
