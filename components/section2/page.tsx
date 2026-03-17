'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Shape from '@/components/svg/shape';
import Button from '@/components/button/button';

const projects = [
    {
        title: "Aura Architecture",
        subtitle: "Minimalist digital spaces for architectural firms.",
        image: "images/projects/1.png",
        description: "A comprehensive digital transformation for a leading architectural studio, focusing on clean lines and immersive project galleries."
    },
    {
        title: "Essence Coffee",
        subtitle: "Premium mobile experience for the modern connoisseur.",
        image: "images/projects/2.png",
        description: "Redefining the mobile ordering experience with an elegant dark-mode interface and fluid transition animations."
    },
    {
        title: "Flux Analytics",
        subtitle: "Sophisticated data visualization for SaaS.",
        image: "images/projects/3.png",
        description: "A complex data dashboard simplified into an intuitive experience, making large data sets accessible and actionable."
    }
];

export default function Section2() {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll through this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Update active index based on scroll position
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest < 0.33) {
            setActiveIndex(0);
        } else if (latest < 0.66) {
            setActiveIndex(1);
        } else {
            setActiveIndex(2);
        }
    });

    return (
        <section ref={containerRef} className="w-full h-[300vh] relative" id="projects">
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen w-full bg-[#F9F8F6] text-[#0B2D72] flex items-center transition-colors duration-500 overflow-hidden">
                <div className="container mx-auto px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-end">
                        {/* First Grid: Picture Placeholder */}
                        <div className="relative aspect-[4/4.5] bg-[#0B2D72]/5 overflow-hidden group border border-[#0B2D72]/10 mb-12 lg:mb-0">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeIndex}
                                    src={projects[activeIndex].image}
                                    alt={projects[activeIndex].title}
                                    initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D72]/20 to-transparent opacity-60"></div>
                        </div>

                        {/* Second Grid: Heading and Project List */}
                        <div className="flex flex-col space-y-12">
                            <div>
                                <div className="flex flex-col space-y-4 mb-8">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">// LATEST WORK</span>
                                    <div className="flex">
                                        <Button size="sm" className="px-6 rounded-none uppercase text-xs font-bold">
                                            View all Projects
                                        </Button>
                                    </div>
                                </div>
                                <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-[0.8]">
                                    Featured Projects
                                </h2>
                            </div>

                            <div className="flex flex-col space-y-10 relative">
                                {projects.map((project, index) => (
                                    <div
                                        key={index}
                                        className={`relative transition-opacity duration-300 ${activeIndex === index ? 'opacity-100' : 'opacity-20'}`}
                                    >
                                        <div className="flex items-start gap-6">
                                            {/* Scroll-powered Indicator */}
                                            <div className="w-6 h-6 flex items-start justify-center relative mt-2">
                                                {activeIndex === index && (
                                                    <motion.div
                                                        layoutId="project-indicator"
                                                        className="absolute inset-0"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 500,
                                                            damping: 30,
                                                            mass: 1,
                                                            bounce: 0.6
                                                        }}
                                                    >
                                                        <Shape className="w-full h-full" />
                                                    </motion.div>
                                                )}
                                                <span className="text-[10px] font-bold absolute -bottom-4 opacity-50">0{index + 1}</span>
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
                                                    {project.title}
                                                </h3>
                                                <AnimatePresence mode="wait">
                                                    {activeIndex === index && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="text-xl opacity-80 max-w-md leading-relaxed pb-2">
                                                                {project.subtitle}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
