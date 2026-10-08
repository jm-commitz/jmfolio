import { ImageIcon, Monitor } from 'lucide-react';

// Empty state for a project whose screenshots aren't ready yet: the same
// Preview strip shape as ProjectGallery, filled with placeholder frames that
// read as "image coming soon" (a soft shimmer sweeps across them).
export default function GalleryPlaceholder({ count = 3 }: { count?: number }) {
  return (
    <div>
      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:scroll-px-0 sm:px-0">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            aria-hidden={i > 0}
            className="relative flex aspect-video w-[85%] shrink-0 snap-start flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed bg-[var(--muted)] text-[var(--muted-foreground)] sm:w-[560px]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--background)_60%,transparent)]">
              <ImageIcon className="h-6 w-6 opacity-70" strokeWidth={1.5} />
            </span>
            <span className="text-xs font-medium">Screenshot coming soon</span>
            {/* Soft shimmer, like a loading skeleton */}
            <span
              aria-hidden
              className="placeholder-shimmer pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          </div>
        ))}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
        <Monitor className="h-3.5 w-3.5" />
        Screenshots coming soon
      </p>
    </div>
  );
}
