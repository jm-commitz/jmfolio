import type { Metadata } from 'next';
import { projects } from '@/components/featuredProjects/projectsData';
import ProjectsPageShowcase from '@/components/projects/ProjectsPageShowcase';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/footer/Footer';

export const metadata: Metadata = {
  title: 'Projects | JM',
  description: 'Full archive of selected builds — dashboards, apps, and marketing sites.',
};

export default function ProjectsIndexPage() {
  const carouselProjects = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    year: p.year,
    img: p.img,
    video: p.video,
    category: p.category,
  }));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--red)] selection:text-white">
      <div className="h-scan opacity-[0.4]" />
      <Nav />

      <div className="relative z-10 pb-20 pt-24 md:pb-28 md:pt-28">
        <ProjectsPageShowcase projects={carouselProjects} />
      </div>

      <Footer />
    </main>
  );
}
