'use client';
import React from 'react';
import Image from 'next/image';

/** Digits only, country code, no + (WhatsApp API format). */
const WHATSAPP_PHONE = '639917944729';
/** Digits only, country code, no + (Viber deep link). */
const VIBER_PHONE = '639553806970';

/** Opens in the compose field so visitors can edit before sending. */
const CHAT_PREFILL =
  "Hi! I came across your portfolio and I'd love to chat about a project.";

const encodedPrefill = encodeURIComponent(CHAT_PREFILL);

const chatLinks = [
  {
    name: 'WhatsApp',
    shortId: 'WA',
    url: `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedPrefill}`,
    openInNewTab: true,
    iconSrc: '/images/social/whatsapp.svg',
  },
  {
    name: 'Viber',
    shortId: 'VB',
    url: `viber://chat?number=%2B${VIBER_PHONE}&text=${encodedPrefill}`,
    openInNewTab: false,
    iconSrc: '/images/social/viber.svg',
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-[#f0ece0]/[0.06] bg-[var(--bg)]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-end gap-16 border-b border-[#f0ece0]/[0.07] px-6 pb-16 pt-20 md:px-10 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-5 flex items-center gap-2.5 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--red)]">
            <span className="inline-block h-[2px] w-[25px] bg-[var(--red)]" />
            Let&apos;s Work Together
          </div>
          <div className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.88] tracking-[-0.01em]">
            GOT A<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px var(--fg)' }}>
              PROJECT
            </span>
            <br />
            IN <span className="text-[var(--red)]">MIND?</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <a
            href="mailto:anchetajaymark69@gmail.com"
            className="font-[family-name:var(--D)] text-[1.5rem] text-[var(--fg2)] no-underline transition-colors duration-200 hover:text-[var(--yellow)]"
          >
            anchetajaymark69@gmail.com
          </a>
          <div className="mt-2 flex flex-col items-start gap-3 lg:items-end">
            {chatLinks.map((c) => (
              <a
                key={c.name}
                href={c.url}
                {...(c.openInNewTab
                  ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                  : { rel: 'nofollow' })}
                className="group flex items-center gap-2.5 font-[family-name:var(--M)] text-[0.72rem] uppercase tracking-[0.15em] text-[var(--fg)] no-underline transition-colors duration-200 hover:text-[var(--primary)] md:text-[0.75rem]"
              >
                <Image
                  src={c.iconSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="h-[18px] w-[18px] shrink-0 object-contain md:h-5 md:w-5"
                  loading="lazy"
                />
                <span>{c.name}</span>
                <span className="text-[1rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col flex-wrap items-center justify-between gap-4 px-6 py-6 font-[family-name:var(--M)] md:flex-row md:px-10">
        <div className="text-[0.6rem] uppercase tracking-[0.15em] text-[#f0ece0]/[0.18]">© 2025 JM — All rights reserved.</div>
        <div className="flex gap-2">
          {chatLinks.map((c) => (
            <a
              key={c.shortId}
              href={c.url}
              {...(c.openInNewTab
                ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                : { rel: 'nofollow' })}
              className="flex items-center gap-1.5 border border-[#f0ece0]/[0.12] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-[var(--fg2)] no-underline transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <Image
                src={c.iconSrc}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5 shrink-0 object-contain opacity-90"
                loading="lazy"
              />
              {c.shortId}
            </a>
          ))}
        </div>
        <div className="text-[0.6rem] uppercase tracking-[0.15em] text-[#f0ece0]/[0.18]">Built in the PH</div>
      </div>

      <div className="pointer-events-none -mt-8 select-none whitespace-nowrap pb-4 text-center font-[family-name:var(--D)] text-[clamp(6rem,22vw,20rem)] leading-none text-[#f0ece0]/[0.018]">
        JM ANCHETA
      </div>
    </footer>
  );
}
