'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { HERO_SCROLL_VH } from '@/lib/heroConstants';

type AsciiData = { text: string; cols: number; rows: number };

function parseAscii(raw: string): AsciiData {
  const lines = raw.split('\n');
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const m = line.match(/^( *)/);
    if (m) minIndent = Math.min(minIndent, m[1].length);
  }
  if (!isFinite(minIndent)) minIndent = 0;
  const trimmed = lines.map(l => l.slice(minIndent).trimEnd());
  const cols = Math.max(...trimmed.map(l => l.length), 1);
  return { text: trimmed.join('\n'), cols, rows: trimmed.length };
}

function AsciiPanel({
  url,
  align = 'center',
  style,
}: {
  url: string;
  align?: 'start' | 'end' | 'center';
  style?: CSSProperties;
}) {
  const [data, setData] = useState<AsciiData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(10);

  useEffect(() => {
    fetch(url)
      .then(r => r.text())
      .then(raw => setData(parseAscii(raw)))
      .catch(() => {});
  }, [url]);

  useEffect(() => {
    if (!data || !containerRef.current) return;
    const el = containerRef.current;
    const compute = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0 || h === 0) return;
      const byWidth = w / (data.cols * 0.6);
      const byHeight = h / data.rows;
      setFontSize(Math.min(byWidth, byHeight));
    };
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    compute();
    return () => ro.disconnect();
  }, [data]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden flex items-center ${
        align === 'start' ? 'justify-start' : align === 'end' ? 'justify-end' : 'justify-center'
      }`}
      style={style}
    >
      {data && (
        <pre
          aria-hidden="true"
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: `${fontSize}px`,
            lineHeight: 1,
            letterSpacing: 0,
            color: 'var(--primary)',
            whiteSpace: 'pre',
            userSelect: 'none',
            pointerEvents: 'none',
            margin: 0,
            padding: 0,
            opacity: 0.9,
          }}
        >
          {data.text}
        </pre>
      )}
    </div>
  );
}

const SCROLL_HEIGHT = `${HERO_SCROLL_VH * 100}vh`;

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  const leftX  = useTransform(progress, [0, 1], ['0%', '-55%']);
  const rightX = useTransform(progress, [0, 1], ['0%',  '55%']);

  const hintOpacity    = useTransform(progress, [0, 0.08], [1, 0]);
  const headingOpacity = useTransform(progress, [0.6, 1], [0, 1]);
  const headingY       = useTransform(progress, [0.6, 1], ['16%', '0%']);
  const softwareX      = useTransform(progress, [0, 1], ['27.5vw', '0vw']);
  const developerX     = useTransform(progress, [0, 1], ['-27.5vw', '0vw']);

  useEffect(() => {
    const update = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      progress.set(Math.max(0, Math.min(1, -top / (height - viewH))));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [progress]);

  return (
    <div ref={wrapperRef} id="home" style={{ height: SCROLL_HEIGHT }}>
      <section
        className="sticky top-0 w-full overflow-hidden grid grid-cols-2 grid-rows-[1fr]"
        style={{ height: '100vh' }}
      >
        {/* Hands */}
        <motion.div className="w-full h-full" style={{ x: leftX }}>
          <AsciiPanel url="/ascii/left_hand.txt" align="start" />
        </motion.div>
        <motion.div className="w-full h-full" style={{ x: rightX }}>
          <AsciiPanel url="/ascii/right_hand.txt" align="end" />
        </motion.div>

        {/* Text — only appears after hands are spread */}
        <motion.div
          style={{ opacity: headingOpacity, y: headingY }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10"
        >
          <div className="flex flex-col items-center">
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(3.8rem, 11vw, 10rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                textAlign: 'center',
                margin: 0,
              }}
            >
              <motion.span style={{ display: 'block', color: 'var(--fg)', x: softwareX }}>SOFTWARE</motion.span>
              <motion.span style={{ display: 'block', color: 'var(--fg)', x: developerX }}>DEVELOPER</motion.span>
            </h1>
            <div className="w-full flex items-center justify-between mt-3 md:mt-4 gap-6 pointer-events-auto">
              <div className="flex flex-row items-center gap-4 md:gap-6 select-none">
                {['laravel.svg', 'nextjs2.svg', 'flutter.svg', 'react.svg', 'mysql.svg'].map(logo => (
                  <img
                    key={logo}
                    src={`/images/techstack/${logo}`}
                    alt={logo.split('.')[0]}
                    className="h-4 md:h-5 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  />
                ))}
              </div>
              <div className="font-[family-name:var(--M)] text-[0.65rem] md:text-[0.75rem] uppercase tracking-[0.4em] text-[var(--primary)] opacity-90 shrink-0 select-none">
                JM ANCHETA
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none z-10"
        >
          <span style={{ fontFamily: 'var(--M)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--primary)', opacity: 0.7 }}>
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: 'var(--primary)', opacity: 0.7 }}
          >
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5"/>
              <motion.rect
                x="7" y="5" width="2" height="5" rx="1" fill="currentColor"
                animate={{ y: [5, 9, 5], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
