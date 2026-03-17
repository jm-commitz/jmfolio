'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/button/button';
import Shape from '@/components/svg/shape';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const [activeNav, setActiveNav] = useState('projects');

  useEffect(() => {
    // Reset to projects as default when menu opens
    if (isMenuOpen) {
      setActiveNav('projects');
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isMenuOpen ? 'bg-background/95 backdrop-blur-md' : 'bg-background/80 backdrop-blur-sm'}`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center">
          {/* Menu - Center */}
          <button
            onClick={toggleMenu}
            className="flex flex-col space-y-1 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-foreground transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-foreground transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Logo - Left */}
        <div className="absolute left-8 top-4 text-xl font-bold">
          Portfolio
        </div>

        {/* CTA - Right */}
        <div className="absolute right-8 top-4">
          <Button size="sm">
            Let's work together
          </Button>
        </div>
      </nav>

      {/* Expandable Menu */}
      <AnimatePresence mode="sync">
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeOut'
            }}
            className="w-full overflow-hidden will-change-transform bg-background/95 backdrop-blur-md"
          >
            <div className="px-10 min-h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] px-10 h-[600px]">
                {/* First Grid - Navigation Items */}
                <div className="flex flex-col space-y-6 pt-20">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Navigation</h3>
                  <div className="flex flex-col space-y-4 relative" onMouseLeave={() => setActiveNav('projects')}>
                    {['projects', 'about', 'blogs', 'contact'].map((item) => (
                      <a
                        key={item}
                        href={`#${item}`}
                        className={`group flex items-center gap-4 text-4xl md:text-5xl lg:text-6xl font-bold transition-all duration-300 outline-none focus:outline-none ${activeNav === item ? 'text-[#0b2d72]' : 'text-foreground hover:text-[#0b2d72]'}`}
                        onClick={toggleMenu}
                        onMouseEnter={() => setActiveNav(item)}
                      >
                        <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center relative">
                          {activeNav === item && (
                            <motion.div
                              layoutId="nav-indicator"
                              className="absolute inset-0"
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                                mass: 1,
                                bounce: 0.6
                              }}
                            >
                              <Shape className="w-full h-full" />
                            </motion.div>
                          )}
                        </div>
                        <span className={`transition-transform duration-300 capitalize ${activeNav === item ? 'translate-x-0' : '-translate-x-10'}`}>
                          {item}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Second Grid - Contact Information */}
                <div className="flex flex-col space-y-8 pt-20">
                  <div className="flex flex-col space-y-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Get in Touch</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <a href="mailto:anchetajaymark69@gmail.com" className="text-xl font-medium text-foreground hover:text-[#0b2d72] transition-colors">
                          anchetajaymark69@gmail.com
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <a href="tel:+1234567890" className="text-xl font-medium text-foreground hover:text-[#0b2d72] transition-colors">
                          +63 915 234 5678
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Location</p>
                        <p className="text-xl font-medium text-foreground">
                          BGC, Taguig City
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button size="lg" className="w-full md:w-auto px-10">
                      Send Message
                    </Button>
                  </div>
                </div>

                {/* Third Grid - Project Showcase Images */}
                <div className="flex flex-col space-y-6 pt-20">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Featured Projects</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    <div className="group relative overflow-hidden bg-muted aspect-[4/3]">
                      <img
                        src="/images/projects/1.png"
                        alt="Project Showcase 1"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-background/90 backdrop-blur-sm px-4 py-2 flex justify-between items-center transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                          <span className="text-sm font-semibold text-foreground uppercase tracking-wider">E-Commerce</span>
                          <span className="text-[10px] text-muted-foreground uppercase">2024</span>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden bg-muted aspect-[4/3]">
                      <img
                        src="/images/projects/2.png"
                        alt="Project Showcase 2"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-background/90 backdrop-blur-sm px-4 py-2 flex justify-between items-center transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                          <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Task App</span>
                          <span className="text-[10px] text-muted-foreground uppercase">2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}