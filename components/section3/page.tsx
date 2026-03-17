'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Shape from '@/components/svg/shape';

export default function Section3() {
    const funFacts = [
        "currently obsessed with clean UI",
        "yes i have a Pythagoras pic on my hero. no i won't explain it",
        "always building something"
    ];

    return (
        <section className="w-full min-h-screen bg-[#F9F8F6] text-[#0B2D72] flex items-center py-32" id="about">
            <div className="container mx-auto px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-start">
                    {/* Left Column: Heading and Body */}
                    <div className="flex flex-col space-y-12">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 block">// yes, that's me</span>
                            <h2 className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.8] mb-8">
                                About
                            </h2>
                            <div className="h-0.5 w-24 bg-[#0B2D72] mb-12"></div>
                        </div>

                        <p className="text-2xl md:text-3xl leading-tight max-w-xl font-medium">
                            i'm an aspiring full stack developer who got into coding because i wanted to build things — not just understand them.
                        </p>
                        <p className="text-xl md:text-2xl leading-relaxed max-w-xl opacity-80">
                            i mess around with Flutter, Node.js, and whatever else gets the job done. when i'm not coding i'm probably overthinking my next project idea.
                        </p>
                    </div>

                    {/* Right Column: Fun Facts */}
                    <div className="flex flex-col space-y-12 pt-0 lg:pt-32">
                        <div className="bg-[#0B2D72]/5 p-8 md:p-12 border border-[#0B2D72]/10 relative group">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-10 opacity-60">Fun Facts</h3>

                            <ul className="space-y-8">
                                {funFacts.map((fact, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        viewport={{ once: true }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-4 h-4 mt-1.5 flex-shrink-0">
                                            <Shape className="w-full h-full" />
                                        </div>
                                        <span className="text-lg md:text-xl font-medium leading-tight">
                                            {fact}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Decorative corner element */}
                            <div className="absolute top-0 right-0 w-8 h-8 opacity-10">
                                <Shape className="w-full h-full" />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4 px-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">Status: Available for new things</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
