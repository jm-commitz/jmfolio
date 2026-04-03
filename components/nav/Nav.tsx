'use client';
import { useEffect, useState, useRef } from 'react';

export default function Nav() {
  const [isVisible, setIsVisible] = useState(true);
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[900] flex justify-between items-center px-6 md:px-10 transition-all duration-500 backdrop-blur-md bg-[var(--bg)]/94 ${scrolled ? 'py-3' : 'py-[1.1rem]'} ${isVisible ? 'translate-y-0' : '-translate-y-full opacity-0'}`}
    >
      <a href="#" className="hover-trigger flex items-center justify-center w-[40px] h-[40px] bg-[#ff1919] transition-all duration-500 hover:bg-[#f5ff00] hover:scale-105 font-[family-name:var(--D)] text-[1.4rem] text-[var(--bg)] hover:text-black no-underline tracking-normal group pt-1">
        JA
      </a>
      <ul className="hidden md:flex gap-10 list-none m-0 p-0 items-center">
        <li><a href="#arsenal" className="hover-trigger text-[0.68rem] text-[#777] uppercase tracking-[0.2em] relative transition-colors duration-200 hover:text-[#f5ff00] pb-1 border-b border-transparent hover:border-[#f5ff00]">Services</a></li>
        <li><a href="#projects" className="hover-trigger text-[0.68rem] text-[#777] uppercase tracking-[0.2em] relative transition-colors duration-200 hover:text-[#f5ff00] pb-1 border-b border-transparent hover:border-[#f5ff00]">Projects</a></li>
        <li><a href="#about" className="hover-trigger text-[0.68rem] text-[#777] uppercase tracking-[0.2em] relative transition-colors duration-200 hover:text-[#f5ff00] pb-1 border-b border-transparent hover:border-[#f5ff00]">About</a></li>
        <li><a href="#testimonials" className="hover-trigger text-[0.68rem] text-[#777] uppercase tracking-[0.2em] relative transition-colors duration-200 hover:text-[#f5ff00] pb-1 border-b border-transparent hover:border-[#f5ff00]">Reviews</a></li>
        <li><a href="#contact" className="hover-trigger text-[0.68rem] text-[#777] uppercase tracking-[0.2em] relative transition-colors duration-200 hover:text-[#f5ff00] pb-1 border-b border-transparent hover:border-[#f5ff00]">Contact</a></li>
      </ul>
      <a href="mailto:anchetajaymark69@gmail.com" className="hover-trigger text-[0.7rem] font-bold uppercase tracking-[0.1em] bg-[#ff1919] text-[var(--fg)] py-[0.65rem] px-6 border-2 border-[#ff1919] transition-all duration-150 hover:bg-transparent hover:text-[#ff1919] hover:-translate-y-[2px] hover:-translate-x-[2px]">
        Hire Me ↗
      </a>
    </nav>
  );
}
