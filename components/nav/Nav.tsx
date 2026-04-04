'use client';
import { useEffect, useState, useRef } from 'react';

export default function Nav() {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setScrolled(currentScrollY > 60);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#arsenal' },
    { name: 'Projects', href: '/#projects' },
    { name: 'About', href: '/#about' },
    { name: 'Reviews', href: '/#testimonials' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[900] flex md:grid md:grid-cols-3 justify-between items-center px-6 md:px-10 transition-all duration-500 backdrop-blur-md bg-[var(--bg)]/94 ${scrolled ? 'py-3' : 'py-[1.1rem]'} ${isVisible || isOpen ? 'translate-y-0' : '-translate-y-full opacity-0'}`}
      >
        <div className="flex items-center justify-start">
          <a href="/" className="hover-trigger flex items-center justify-center w-9 h-9 bg-[var(--primary)] transition-all duration-500 hover:scale-105 font-[family-name:var(--D)] text-lg text-white no-underline tracking-normal group pt-1 xl:w-10 xl:h-10 xl:text-[1.4rem]">
            JA
          </a>
        </div>

        {/* Centered on Desktop, End on Mobile */}
        <div className="flex items-center md:justify-center">
          <button
            onClick={toggleMenu}
            className="group flex flex-col items-center md:gap-1.5 hover-trigger focus:outline-none"
          >
            <div className="flex flex-col gap-[5px] items-center">
              <span className={`w-8 h-[2px] bg-[var(--fg)] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px] bg-[var(--red)]' : ''}`} />
              <span className={`w-5 h-[2px] bg-[var(--fg2)] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-8 h-[2px] bg-[var(--fg)] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px] bg-[var(--red)]' : ''}`} />
            </div>
          </button>
        </div>

        <div className="hidden md:flex items-center justify-end">
          <a href="mailto:anchetajaymark69@gmail.com" className="btn-y hover-trigger text-[0.7rem] font-bold uppercase tracking-[0.1em] py-[0.65rem] px-6 whitespace-nowrap">
            Hire Me ↗
          </a>
        </div>
      </nav>

      {/* Expandable Menu Overlay */}
      <div className={`fixed inset-0 z-[850] bg-[var(--bg)] transition-all duration-700 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto backdrop-blur-2xl' : 'opacity-0 pointer-events-none translate-y-12 blur-2xl'}`}>
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
                  <span className="font-[family-name:var(--D)] text-[clamp(2.5rem,8vw,5.5rem)] text-[var(--fg)] leading-none uppercase tracking-tighter group-hover:text-[var(--red)] group-hover:scale-[1.1] transition-all duration-500 inline-block">
                    {link.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Social / Contact Info at bottom of menu */}
          <div className="absolute bottom-12 md:bottom-20 flex flex-col items-center gap-6 reveal in">
            <div className="h-[1px] w-20 bg-[var(--fg3)]" />
            <div className="flex gap-10 items-center justify-center font-[family-name:var(--M)] text-[0.65rem] tracking-[0.4em] uppercase text-[var(--fg3)]">
              <a href="#" className="hover:text-[var(--fg)] transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-[var(--fg)] transition-colors">Github</a>
              <a href="#" className="hover:text-[var(--fg)] transition-colors">Behance</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
