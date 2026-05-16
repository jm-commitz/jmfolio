'use client';
import Nav from '@/components/nav/Nav';
import Hero from '@/components/hero/Hero';
import ProjectsPageShowcase from '@/components/projects/ProjectsPageShowcase';
import Footer from '@/components/footer/Footer';
import PromoCard from '@/components/ui/PromoCard';
import { projects } from '@/components/featuredProjects/projectsData';
import { motion } from 'framer-motion';


export default function Home() {
  return (
    <main
      className={`min-h-screen transition-colors duration-700 bg-[var(--bg)] text-[var(--fg)]`}
    >
      <Nav />
      <Hero />
      <motion.div
        id="projects"
        className="pb-24 md:pb-32"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <ProjectsPageShowcase projects={projects} />
      </motion.div>
      <Footer />

      <PromoCard
        triggerSelector="#projects"
        storageKey="promo:swarm-escape:dismissed"
        kicker="[NEW GAME]"
        title="Swarm Escape"
        description="Survive as long as you can. Arrow keys / d-pad. Takes ~10 seconds to learn."
        previewVideoSrc="/swarm_game/swarm_escape.mp4"
        ctaLabel="Play now"
        ctaHref="/game/swarm_escape_game.html"
        modalSrc="/game/swarm_escape_game.html"
      />
    </main>
  );
}
