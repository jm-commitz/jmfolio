'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        sender: "Alex Rivera",
        role: "Project Manager",
        text: "he actually delivers. gave him a project and he came back with something way better than expected.",
        align: "left",
        type: "client",
        initials: "AR"
    },
    {
        id: 2,
        sender: "Me",
        text: "Thank you, nice working with you!",
        align: "right",
        type: "me"
    },
    {
        id: 3,
        sender: "Jordan Chen",
        role: "Startup Founder",
        text: "super easy to work with and the output was clean. would collab again.",
        align: "left",
        type: "client",
        initials: "JC"
    },
    {
        id: 4,
        sender: "Me",
        text: "Thanks, appreciated!",
        align: "right",
        type: "me"
    },
    {
        id: 5,
        sender: "Sarah Jenkins",
        role: "Creative Director",
        text: "the level of detail in the frontend implementation is insane. everything just works exactly how we envisioned.",
        align: "left",
        type: "client",
        initials: "SJ"
    },
    {
        id: 6,
        sender: "Me",
        text: "Glad you like it! Details make all the difference.",
        align: "right",
        type: "me"
    },
    {
        id: 7,
        sender: "Marcus Thorne",
        role: "CTO",
        text: "solid backend architecture. clean code, well-documented, and easy to scale. a rare find.",
        align: "left",
        type: "client",
        initials: "MT"
    },
    {
        id: 8,
        sender: "Me",
        text: "Always happy to help build a strong foundation. Thanks Marcus!",
        align: "right",
        type: "me"
    }
];

export default function Section4() {
    return (
        <section className="w-full min-h-screen bg-[#F9F8F6] text-[#0B2D72] py-32" id="testimonials">
            <div className="container mx-auto px-10">
                <div className="flex flex-col space-y-4 mb-20">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">// sheesh, thats life right there.</span>
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.8]">
                        Testimonials
                    </h2>
                </div>

                <div className="max-w-3xl mx-auto flex flex-col space-y-16">
                    {testimonials.map((msg, index) => (
                        <motion.div
                            key={msg.id}
                            initial={{
                                opacity: 0,
                                y: 40,
                                x: msg.align === 'left' ? -30 : 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                x: 0,
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.8,
                                ease: [0.23, 1, 0.32, 1],
                                delay: 0.1
                            }}
                            className={`flex ${msg.align === 'left' ? 'justify-start' : 'justify-end'} w-full items-end gap-3`}
                        >
                            {msg.align === 'left' && (
                                <div className="w-10 h-10 rounded-full bg-[#0B2D72] flex items-center justify-center text-[10px] font-bold text-[#F9F8F6] mb-1 flex-shrink-0">
                                    {msg.initials}
                                </div>
                            )}

                            <div className={`flex flex-col ${msg.align === 'left' ? 'items-start' : 'items-end'} max-w-[85%] md:max-w-[70%]`}>
                                {msg.align === 'left' && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 px-2">
                                        {msg.sender} — {msg.role}
                                    </span>
                                )}
                                <div className={`px-6 py-4 rounded-3xl text-lg md:text-xl font-medium leading-relaxed
                                    ${msg.align === 'left'
                                        ? 'bg-[#0B2D72] text-[#F9F8F6] rounded-bl-none'
                                        : 'bg-[#0B2D72]/5 text-[#0B2D72] rounded-br-none border border-[#0B2D72]/10'
                                    }
                                `}>
                                    {msg.text}
                                </div>
                                {msg.align === 'right' && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2 px-2">
                                        YOU
                                    </span>
                                )}
                            </div>

                            {msg.align === 'right' && (
                                <div className="w-10 h-10 rounded-full border border-[#0B2D72]/20 flex items-center justify-center text-[10px] font-bold mb-1 flex-shrink-0">
                                    ME
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center mt-32 space-y-6"
                >
                    <div className="h-px w-32 bg-[#0B2D72]/10" />
                    <p className="text-sm font-bold uppercase tracking-[0.4em] opacity-30">Let's build something together</p>
                </motion.div>
            </div>
        </section>
    );
}
