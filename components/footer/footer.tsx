'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Shape from '@/components/svg/shape';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { name: "GitHub", url: "https://github.com/jm-commitz" },
        { name: "LinkedIn", url: "https://www.linkedin.com/in/jaymark-ancheta-8511b430b/" },
        { name: "Email", url: "mailto:anchetajaymark69@gmail.com" }
    ];

    return (
        <footer className="w-full bg-[#0B2D72] text-[#F9F8F6] py-24 md:py-32 relative overflow-hidden" id="contact">
            {/* Background Shape - Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 translate-x-1/2 -translate-y-1/2 rotate-12">
                <Shape className="w-full h-full" />
            </div>

            <div className="container mx-auto px-10 relative z-10">
                <div className="flex flex-col space-y-24">
                    {/* Top Section: Tagline */}
                    <div className="flex flex-col space-y-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">// project inquiry</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-7xl md:text-9xl font-bold tracking-tighter uppercase leading-[0.8]"
                        >
                            let's build <br />something.
                        </motion.h2>
                    </div>

                    {/* Bottom Section: Links and Copy */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pt-12 border-t border-[#F9F8F6]/10">
                        {/* Links */}
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                            {socialLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg md:text-xl font-bold uppercase tracking-tight hover:opacity-50 transition-opacity duration-300 flex items-center gap-2 group"
                                    whileHover={{ x: 5 }}
                                >
                                    <span>{link.name}</span>
                                    <div className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Shape className="w-full h-full" />
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* Copyright */}
                        <div className="flex flex-col space-y-2 items-start md:items-end">
                            <p className="text-sm font-bold uppercase tracking-widest opacity-40">
                                © {currentYear} Jaymark Ancheta
                            </p>
                            <p className="text-xs opacity-30 italic">
                                made with too much coffee.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
