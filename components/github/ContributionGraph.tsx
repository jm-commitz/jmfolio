'use client';

import { useState, type MouseEvent } from 'react';
import DragScroll from '@/components/ui/DragScroll';

export type Day = { date: string; count: number; level: number };

const LEVEL_COLOR = [
  'var(--border)',
  'color-mix(in srgb, var(--foreground) 28%, transparent)',
  'color-mix(in srgb, var(--foreground) 50%, transparent)',
  'color-mix(in srgb, var(--foreground) 74%, transparent)',
  'var(--foreground)',
];

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

type Tip = { day: Day; x: number; y: number };

export default function ContributionGraph({ weeks }: { weeks: (Day | null)[][] }) {
  const [tip, setTip] = useState<Tip | null>(null);

  const show = (day: Day) => (e: MouseEvent<HTMLSpanElement>) => {
    // Fixed positioning so the scroller's overflow doesn't clip the tooltip.
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ day, x: r.left + r.width / 2, y: r.top });
  };

  return (
    <>
      <DragScroll
        dir="rtl"
        className="no-scrollbar overflow-x-auto pb-1"
        onScroll={() => setTip(null)}
        onMouseLeave={() => setTip(null)}
      >
        <div dir="ltr" className="flex w-max gap-[4px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[4px]">
              {week.map((day, di) => (
                <span
                  key={di}
                  onMouseEnter={day ? show(day) : undefined}
                  className={`h-[14px] w-[14px] rounded-[3px] ${
                    day ? 'transition-shadow hover:ring-1 hover:ring-[var(--foreground)]' : ''
                  }`}
                  style={{
                    backgroundColor: day ? LEVEL_COLOR[day.level] : 'transparent',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </DragScroll>

      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border bg-[var(--background)] px-2 py-1 text-[11px] shadow-lg"
          style={{ left: tip.x, top: tip.y - 6 }}
        >
          <span className="font-semibold text-[var(--foreground)]">
            {tip.day.count === 0
              ? 'No contributions'
              : `${tip.day.count} contribution${tip.day.count === 1 ? '' : 's'}`}
          </span>
          <span className="text-[var(--muted-foreground)]">
            {' '}on {dateFormat.format(new Date(tip.day.date + 'T00:00:00Z'))}
          </span>
        </div>
      )}
    </>
  );
}
