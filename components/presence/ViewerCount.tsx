'use client';

import { useVisitorPresence } from './useVisitorPresence';

const MAX_FACES = 3;

export default function ViewerCount() {
  const { enabled, ids, count } = useVisitorPresence();

  // Hidden until presence is configured and the first sync lands — also keeps
  // server and client markup identical, so there's no hydration mismatch.
  if (!enabled || count === 0) return null;

  const faces = ids.slice(0, MAX_FACES);
  const extra = count - faces.length;

  return (
    <div
      // Faces stacked top-down in the floating rail, each on its own surface.
      className="flex flex-col items-center gap-2"
      title={`${count === 1 ? '1 person' : `${count} people`} viewing right now`}
    >
      {faces.map((id) => (
        // Each face gets its own surface, matching the theme toggle below.
        <span
          key={id}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-[var(--background)] shadow-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/avatar/${id}`}
            alt=""
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </span>
      ))}

      {extra > 0 && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-[var(--background)] text-[10px] font-semibold text-[var(--muted-foreground)] shadow-lg">
          +{extra}
        </span>
      )}
    </div>
  );
}
