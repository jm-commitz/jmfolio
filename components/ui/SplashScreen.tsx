"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ finishLoading }: { finishLoading: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast increment for that "data-crunching" feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Small delay before sliding up for impact
          setTimeout(finishLoading, 400);
          return 100;
        }
        // Random larger jumps to make it look active
        const jump = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + jump, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [finishLoading]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }} // Match studio easing
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FF4500] text-black"
    >
      <div className="flex flex-col items-center gap-4">
        {/* The Triple Box Animation */}
        <div className="flex gap-1.5 h-12 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: [0.19, 1, 0.22, 1], // Studio-style snappy easing
              }}
              className="w-4 h-4 bg-black"
            />
          ))}
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-1] font-[family-name:var(--M)]">
          <div className="text-[0.9rem] tracking-[0.2em] uppercase font-bold">
            LOADING
          </div>
        </div>
      </div>
    </motion.div>
  );
}
