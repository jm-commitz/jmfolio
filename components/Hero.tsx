"use client";

import Button from '@/components/button/button';

export default function Hero() {
  return (
    <section className="flex flex-col items-start justify-center h-full w-full text-left px-4 md:px-6 overflow-hidden">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight break-words max-w-full">I turn ideas into interfaces and interfaces into experiences.</h1>
      <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground break-words max-w-full">Aspiring full stack developer passionate about building clean, purposeful digital products from the ground up.
      </p>
      <Button className="mt-8">
        See Projects
      </Button>
    </section>
  );
}
