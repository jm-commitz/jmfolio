'use client';

import React from 'react';

import { motion } from 'framer-motion';

export default function Section1() {
    return (
        <section className="w-full h-screen bg-[#F9F8F6] text-[#0B2D72] flex items-center py-24">
            <div className="container mx-auto px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left Grid: Text Content */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-40">// about my craft</span>
                            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-[0.9]">
                                i build for the web. front to back.
                            </h2>
                        </div>
                        <div className="h-0.5 w-24 bg-[#0B2D72]"></div>
                        <p className="text-xl md:text-2xl leading-relaxed max-w-xl opacity-90">
                            From designing interfaces that feel smooth to wiring up backends that actually make sense, I do both. Currently leveling up in full stack development and turning every side project into a lesson.
                        </p>
                    </div>

                    {/* Right Grid: Picture Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full aspect-[4/4.5] bg-[#0B2D72]/5 overflow-hidden group"
                    >
                        <img
                            src="images/whatido.png"
                            alt="Project workspace"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#0B2D72]/0 group-hover:bg-[#0B2D72]/10 transition-colors duration-500"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
