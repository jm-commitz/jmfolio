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
      // Faces stacked top-down in the floating rail, overlapping like an
      // avatar group. Each keeps its own border so the seams stay readable.
      className="flex flex-col items-center"
      title={`${count === 1 ? '1 person' : `${count} people`} viewing right now`}
    >
      {faces.map((id, i) => (
        // Each face gets its own surface, matching the theme toggle below.
        <span
          key={id}
          className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-[var(--background)] shadow-lg ${
            i > 0 ? '-mt-3' : ''
          }`}
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
        <span className="-mt-3 flex h-8 w-8 items-center justify-center rounded-full border bg-[var(--background)] text-[10px] font-semibold text-[var(--muted-foreground)] shadow-lg">
          +{extra}
        </span>
      )}
    </div>
  );
}
