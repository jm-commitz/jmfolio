'use client';

import { useEffect, useState } from 'react';
import { Download, MessageCircle } from 'lucide-react';

// Edit these to change what clients see.
const STATUS = 'Open to freelance projects';
const REPLY_TIME = 'Usually replies within a day';
const CV_HREF = '/cv/JAYMARK%20ANCHETA%20-%20CV.pdf';
const MESSAGE_HREF = 'https://api.whatsapp.com/send?phone=639917944729';
const TIME_ZONE = 'Asia/Manila';

const clock = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: TIME_ZONE,
});
const hourOf = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  hourCycle: 'h23',
  timeZone: TIME_ZONE,
});

function mood(hour: number) {
  if (hour < 7) return 'Probably asleep 🌙';
  if (hour < 12) return 'Morning, coffee in hand ☕';
  if (hour < 18) return 'Heads-down building 💻';
  if (hour < 22) return 'Evening, still around 🌆';
  return 'Winding down 🌙';
}

export default function AvailabilityCard() {
  // Rendered after mount so server and client markup match.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return (
    <section data-tour="availability" className="px-5 pt-8 lg:px-6 lg:pt-20">
      <div className="rounded-2xl border p-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00c853] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00c853]" />
          </span>
          <p className="text-sm font-semibold text-[var(--foreground)]">{STATUS}</p>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3 border-t pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              Manila time
            </p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-[var(--foreground)]">
              {now ? clock.format(now) : '--:--'}
            </p>
          </div>
          <p className="pb-1 text-right text-xs text-[var(--muted-foreground)]">
            {now ? mood(Number(hourOf.format(now))) : ' '}
          </p>
        </div>

        <p className="mt-2 text-xs text-[var(--muted-foreground)]">{REPLY_TIME}</p>

        <div className="mt-4 flex gap-2">
          <a
            href={CV_HREF}
            download
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--foreground)] px-3 py-2 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            Download CV
          </a>
          <a
            href={MESSAGE_HREF}
            target="_blank"
            rel="noreferrer"
            aria-label="Message me"
            className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
