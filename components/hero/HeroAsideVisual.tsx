'use client';

import { useEffect, useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroIntroContext } from '@/components/ui/SmoothScroll';

const ASCII_URL = '/ascii/ascii.txt';

export default function HeroAsideVisual() {
  const [originalAscii, setOriginalAscii] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string>('');
  const introReady = useContext(HeroIntroContext) ?? true;
  const animationRef = useRef<number>(0);

  useEffect(() => {
    fetch(ASCII_URL)
      .then((res) => res.text())
      .then((text) => setOriginalAscii(text))
      .catch(() => setOriginalAscii(''));
  }, []);

  useEffect(() => {
    if (!originalAscii || !introReady) return;

    const lines = originalAscii.split('\n');
    const height = lines.length;
    const width = lines[0]?.length || 0;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);

    let frame = 0;
    const totalFrames = 80; // Speed of the "resolve"

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;

      const nextFrameText = lines.map((line, y) => {
        return line.split('').map((char, x) => {
          if (char === ' ' || char === '\r') return char;

          // Calculate distance from center to create the "spread" effect
          const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          const normalizedDist = dist / maxDist;

          // Resolve logic
          if (normalizedDist < progress) {
            // Already resolved
            return char;
          } else if (normalizedDist < progress + 0.15) {
            // The "Shimmering Edge" - creates the liquid digital feel
            const noise = ['@', '#', '*', ':', '.', '°', '·'];
            return noise[Math.floor(Math.random() * noise.length)];
          } else {
            // Sparse state (the quiet background)
            return Math.random() > 0.98 ? '.' : ' ';
          }
        }).join('');
      }).join('\n');

      setDisplayText(nextFrameText);

      if (frame < totalFrames) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [originalAscii, introReady]);

  return (
    <div className="h-aside-panel scrollbar-hide relative flex items-center justify-center overflow-hidden w-full h-full bg-transparent">
      <motion.pre
        className="h-aside-ascii relative z-10 font-mono leading-[0.85] tracking-tighter select-none pointer-events-none text-white"
        aria-hidden="true"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={introReady ? {
          opacity: 1,
          filter: 'blur(0px)',
        } : {}}
        transition={{
          opacity: { duration: 0.5 },
          filter: { duration: 0.8 },
        }}
      >
        {displayText || ' '}
      </motion.pre>

      {/* Scanline/Noise Grain Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-[#111111]" />
    </div>
  );
}
