'use client';

import { useState } from 'react';
import { Check, Share } from 'lucide-react';

// Native share sheet where available (phones); otherwise copies the link.
export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* dismissed */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      data-say="Share this project"
      aria-label={copied ? 'Link copied' : `Share ${title}`}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
    >
      {copied ? <Check className="h-[18px] w-[18px]" /> : <Share className="h-[18px] w-[18px]" />}
      {copied && (
        <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border bg-[var(--background)] px-2 py-0.5 text-[11px] font-medium text-[var(--foreground)] shadow-md">
          Copied
        </span>
      )}
    </button>
  );
}
