'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import SplashScreen from '@/components/ui/SplashScreen';

type PromoCardProps = {
  triggerSelector: string;
  storageKey?: string;
  kicker?: string;
  title: string;
  description: string;
  previewVideoSrc?: string;
  ctaLabel?: string;
  ctaHref: string;
  modalSrc?: string;
};

export default function PromoCard({
  triggerSelector,
  storageKey = 'promoCardDismissed',
  kicker = '[NEW]',
  title,
  description,
  previewVideoSrc,
  ctaLabel = 'Open',
  ctaHref,
  modalSrc,
}: PromoCardProps) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [videoOk, setVideoOk] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [splashOpen, setSplashOpen] = useState(false);

  const key = useMemo(() => storageKey, [storageKey]);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(key) === '1');
    } catch {
      setDismissed(false);
    }
  }, [key]);

  useEffect(() => {
    if (dismissed) return;
    const target = document.querySelector(triggerSelector);
    if (!target) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setOpen(true);
          obs.disconnect();
        });
      },
      { threshold: 0.25, root: null, rootMargin: '-10% 0px -30% 0px' }
    );

    obs.observe(target);
    return () => obs.disconnect();
  }, [dismissed, triggerSelector]);

  useEffect(() => {
    if (!modalSrc) return;
    if (modalOpen) document.documentElement.dataset.gameModalOpen = '1';
    else delete document.documentElement.dataset.gameModalOpen;
    return () => {
      delete document.documentElement.dataset.gameModalOpen;
    };
  }, [modalOpen, modalSrc]);

  useEffect(() => {
    if (!modalSrc) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as unknown;
      if (!data || typeof data !== 'object') return;
      if ((data as { type?: unknown }).type === 'swarm-escape:close') {
        setModalOpen(false);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [modalSrc]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(key, '1');
    } catch {
      // ignore
    }
  };

  // Radix Dialog handles scroll lock + ESC

  if (dismissed) return null;

  return (
    <>
      <aside
        aria-label="Promo card"
        className={[
          'fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[9999] w-[min(300px,calc(100vw-16px))] sm:w-[min(340px,calc(100vw-24px))] overflow-hidden shadow-[0_16px_44px_rgba(0,0,0,0.45)]',
          'transition-all duration-200',
          open ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-3 opacity-0 pointer-events-none',
          'motion-reduce:transition-none motion-reduce:transform-none',
        ].join(' ')}
      >
        <div className="bg-[#0b0b0b] relative">
          <button
            type="button"
            aria-label="Close promo"
            onClick={close}
            className={[
              'absolute top-2 right-2 z-20 grid place-items-center h-[28px] w-[28px]',
              'border border-white/20 bg-black/70 text-white hover:bg-black/90',
              'text-[18px] leading-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
            ].join(' ')}
          >
            ×
          </button>

          <div aria-hidden className="grid grid-cols-2 gap-2 p-2 sm:p-2">
            <div className="overflow-hidden bg-black h-[104px] sm:h-[132px] relative">
              {previewVideoSrc && videoOk && open ? (
                <video
                  key={previewVideoSrc}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  controls={false}
                  onError={() => setVideoOk(false)}
                >
                  <source src={previewVideoSrc} type="video/mp4" />
                </video>
              ) : (
                <div
                  className={[
                    'h-full',
                    'bg-[radial-gradient(circle_at_30%_40%,rgba(216,90,48,0.25),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(24,95,165,0.22),transparent_55%),linear-gradient(135deg,rgba(0,0,0,0.06),rgba(0,0,0,0.01))]',
                  ].join(' ')}
                >
                  <div className="h-full opacity-35 [background-size:18px_18px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]" />
                </div>
              )}
            </div>
            <div className="overflow-hidden bg-black h-[76px] sm:h-[92px] relative">
              {previewVideoSrc && videoOk && open ? (
                <video
                  key={previewVideoSrc}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  controls={false}
                  onError={() => setVideoOk(false)}
                >
                  <source src={previewVideoSrc} type="video/mp4" />
                </video>
              ) : (
                <div
                  className={[
                    'h-full',
                    'bg-[radial-gradient(circle_at_30%_40%,rgba(216,90,48,0.25),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(24,95,165,0.22),transparent_55%),linear-gradient(135deg,rgba(0,0,0,0.06),rgba(0,0,0,0.01))]',
                  ].join(' ')}
                >
                  <div className="h-full opacity-35 [background-size:18px_18px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[var(--red)] p-3 text-[#190a05] sm:p-3.5">
          <div className="text-[0.65rem] uppercase tracking-[0.28em] opacity-90">{kicker}</div>
          <div className="mt-2 font-[family-name:var(--D)] text-[1.15rem] leading-[1.05] tracking-[0.02em]">
            {title}
          </div>
          <div className="mt-2 text-[0.75rem] sm:text-[0.78rem] leading-[1.6] opacity-95">{description}</div>

          <div className="mt-3 flex flex-wrap gap-2">
            {modalSrc ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSplashOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-black/90 text-white border border-black/40 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[0.68rem] sm:text-[0.7rem] uppercase tracking-[0.12em] hover:bg-black"
              >
                {ctaLabel} →
              </button>
            ) : (
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 bg-black/90 text-white border border-black/40 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[0.68rem] sm:text-[0.7rem] uppercase tracking-[0.12em] hover:bg-black"
              >
                {ctaLabel} →
              </a>
            )}
          </div>
        </div>
      </aside>

      {modalSrc && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent
            showCloseButton
            closeButtonClassName="lg:hidden"
            className={[
              // Full-screen modal (all breakpoints)
              'flex items-center justify-center w-screen h-[100dvh] max-w-none p-0 gap-0 rounded-none bg-transparent text-[var(--fg)] ring-0 overflow-hidden',
            ].join(' ')}
          >
            <VisuallyHidden.Root>
              <DialogTitle>{title}</DialogTitle>
            </VisuallyHidden.Root>
            <div className="w-full h-full overflow-hidden bg-transparent">
              <iframe
                title={title}
                src={modalSrc}
                className="h-full w-full border-0 outline-none block"
                allow="fullscreen"
                scrolling="no"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {modalSrc && splashOpen && (
        <SplashScreen
          finishLoading={() => {
            setSplashOpen(false);
            setModalOpen(true);
          }}
        />
      )}
    </>
  );
}

