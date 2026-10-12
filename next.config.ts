import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const baseConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 768, 1024, 1280, 1600, 1920],
    imageSizes: [64, 128, 256, 384, 512],
    minimumCacheTTL: 31536000, // 1 year
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
};

// In dev, Next resolves dynamic routes (/projects/[slug]) in a worker it
// spawns as a child process. When Windows security software blocks that spawn
// (EPERM), the worker stays dead and every project page 500s until restart.
// Worker threads run in-process, so nothing is spawned. Dev only: builds can't
// use worker threads (the config isn't cloneable into them).
export default function nextConfig(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return baseConfig;
  return {
    ...baseConfig,
    experimental: { ...baseConfig.experimental, workerThreads: true },
  };
}
