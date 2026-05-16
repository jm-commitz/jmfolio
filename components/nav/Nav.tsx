'use client';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { HERO_SCROLL_VH } from '@/lib/heroConstants';

export default function Nav() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  const [isVisible, setIsVisible] = useState(!isHomePage);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Re-evaluate visibility on route change
    if (!isHomePage) {
      setIsVisible(true);
      setScrolled(window.scrollY > 50);
    } else {
      setIsVisible(window.scrollY >= 0.6 * (HERO_SCROLL_VH - 1) * window.innerHeight);
    }
  }, [isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!isHomePage) {
        if (currentScrollY < 50) {
          setIsVisible(true);
          setScrolled(false);
        } else {
          const scrollingDown = currentScrollY > lastScrollY.current;
          setIsVisible(!scrollingDown);
          setScrolled(true);
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      const scrollable  = (HERO_SCROLL_VH - 1) * window.innerHeight;
      const textAppearY = 0.6 * scrollable;
      const heroEnd     = scrollable;

      if (currentScrollY < textAppearY) {
        setIsVisible(false);
        setScrolled(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY >= textAppearY && currentScrollY <= heroEnd) {
        setIsVisible(true);
        setScrolled(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Normal show-on-scroll-up / hide-on-scroll-down behaviour past the hero
      const scrollingDown = currentScrollY > lastScrollY.current;
      // Grace zone: always show nav right as it enters post-hero territory
      setIsVisible(!scrollingDown || currentScrollY < heroEnd + 120);
      setScrolled(true);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[900] flex md:grid md:grid-cols-3 justify-between items-center px-6 md:px-10 transition-all duration-500 backdrop-blur-md bg-[var(--bg)]/94 ${scrolled ? 'py-3' : 'py-[1.1rem]'} ${isVisible || isOpen ? 'translate-y-0' : '-translate-y-full opacity-0'}`}
      >
        <div className="flex items-center justify-start">
          <a href="/" className="hover-trigger flex items-center justify-center w-9 h-9 bg-[var(--primary)] transition-all duration-500 hover:scale-105 font-[family-name:var(--D)] text-xl font-black text-white no-underline tracking-normal group pt-1 xl:w-10 xl:h-10 xl:text-2xl">
            JA
          </a>
        </div>

        {/* Centered on Desktop, End on Mobile */}
        <div className="flex items-center md:justify-center">
          <button
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="nav-menu"
            className="group flex flex-col items-center md:gap-1.5 hover-trigger focus:outline-none"
          >
            <div className="flex flex-col gap-[5px] items-center">
              <span className={`w-8 h-[2px] bg-[var(--fg)] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px] bg-[var(--red)]' : ''}`} aria-hidden="true" />
              <span className={`w-5 h-[2px] bg-[var(--fg2)] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} aria-hidden="true" />
              <span className={`w-8 h-[2px] bg-[var(--fg)] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px] bg-[var(--red)]' : ''}`} aria-hidden="true" />
            </div>
          </button>
        </div>

        <div className="hidden md:flex items-center justify-end">
          <a
            href="/cv/JAYMARK ANCHETA - CV.pdf"
            download="JAYMARK ANCHETA - CV.pdf"
            className="btn-y hover-trigger text-[0.7rem] font-black uppercase tracking-[0.1em] py-[0.65rem] px-6 whitespace-nowrap"
          >
            Download CV ↓
          </a>
        </div>
      </nav>

      {/* Expandable Menu Overlay */}
      <div
        id="nav-menu"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal={isOpen}
        className={`fixed inset-0 z-[850] bg-[var(--bg)] transition-all duration-700 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto backdrop-blur-2xl' : 'opacity-0 pointer-events-none translate-y-12 blur-2xl'}`}
      >
        <div className="h-scan opacity-[0.2]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 md:p-20 overflow-hidden">

          {/* Vertical Navigation Links */}
          <ul className="flex flex-col items-center gap-2 md:gap-4 list-none m-0 p-0 text-center relative z-10">
            {navLinks.map((link, idx) => (
              <li
                key={link.name}
                className={`transform transition-all duration-700 delay-[${idx * 100}ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="group block relative py-2 no-underline hover-trigger"
                >
                  <span className="font-[family-name:var(--D)] font-bold text-[clamp(2.5rem,8vw,5.5rem)] text-[var(--fg)] leading-none uppercase tracking-tighter group-hover:text-[var(--red)] group-hover:scale-[1.1] transition-all duration-500 inline-block">
                    {link.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Social / Contact Info at bottom of menu */}
          <div className="absolute bottom-12 md:bottom-20 flex flex-col items-center gap-6 reveal in">
            <div className="h-[1px] w-20 bg-[var(--fg3)]" />
            <div className="flex items-center justify-center font-[family-name:var(--M)] text-[0.65rem] tracking-[0.4em] uppercase text-[var(--fg3)]">
              <a
                href="/cv/JAYMARK ANCHETA - CV.pdf"
                download="JAYMARK ANCHETA - CV.pdf"
                className="hover:text-[var(--fg)] transition-colors"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
