'use client';

import { useEffect, useState, type ReactNode } from 'react';

type Sparkle = {
  id: string;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
};

function newSparkle(): Sparkle {
  return {
    id: Math.random().toString(36).slice(2),
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 3.5 + 3,
    delay: Math.random() * 0.5,
    duration: Math.random() * 0.4 + 0.5,
  };
}

function Star({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      style={{ display: 'block' }}
    >
      <path
        d="M34 0C34 18.78 49.22 34 68 34C49.22 34 34 49.22 34 68C34 49.22 18.78 34 0 34C18.78 34 34 18.78 34 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SparklesText({
  children,
  count = 6,
}: {
  children: ReactNode;
  count?: number;
}) {
  // Generate sparkles only on the client to avoid SSR hydration mismatch.
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(Array.from({ length: count }, newSparkle));
    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) => (Math.random() > 0.6 ? newSparkle() : s)),
      );
    }, 500);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <span className="relative inline-block">
      {sparkles.map((s) => (
        <span
          key={s.id}
          aria-hidden
          className="sparkle-star pointer-events-none absolute z-10 text-[var(--foreground)]"
          style={{
            left: s.x,
            top: s.y,
            animation: `sparkle-pop ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          <Star size={s.size} />
        </span>
      ))}
      <span className="relative z-0">{children}</span>
    </span>
  );
}
