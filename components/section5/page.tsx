'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Shape from '@/components/svg/shape';

export default function Section5() {
    const points = [
        {
            title: "full stack",
            desc: "i handle both sides so you don't have to coordinate two people"
        },
        {
            title: "product-minded",
            desc: "i think about the user, not just the code"
        },
        {
            title: "always improving",
            desc: "every project makes me better"
        }
    ];

    return (
        <section className="w-full min-h-screen bg-[#F9F8F6] text-[#0B2D72] flex items-center py-32" id="why-me">
            <div className="container mx-auto px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center">
                    {/* Left Side: Content */}
                    <div className="flex flex-col space-y-12">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 block">// the truth</span>
                            <h2 className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.8] mb-8">
                                why me <br />tho?
                            </h2>
                            <div className="h-0.5 w-24 bg-[#0B2D72] mb-12"></div>
                        </div>

                        <div className="space-y-8">
                            <p className="text-2xl md:text-3xl leading-tight max-w-xl font-medium">
                                real talk — i'm not the most junior dev out there. but i show up, i learn fast, and i actually care about what i build.
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed max-w-xl opacity-60 italic">
                                you're not getting someone who just copy-pastes from Stack Overflow (okay maybe sometimes). you're getting someone who figures it out.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Quick Points */}
                    <div className="grid grid-cols-1 gap-6">
                        {points.map((point, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white p-8 md:p-10 border border-[#0B2D72]/5 hover:border-[#0B2D72]/20 transition-all duration-500 hover:shadow-[20px_20px_60px_rgba(11,45,114,0.05)]"
                            >
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="w-8 h-8 flex items-center justify-center relative">
                                        <Shape className="w-full h-full opacity-100" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                                        {point.title}
                                    </h3>
                                </div>
                                <p className="text-lg opacity-60 leading-relaxed font-medium pl-14">
                                    {point.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
