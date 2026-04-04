import type { Metadata } from 'next';
import { projects } from '@/components/featuredProjects/projectsData';
import ProjectsCarousel from '@/components/projects/ProjectsCarousel';
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
  }));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--red)] selection:text-white">
      <div className="h-scan opacity-[0.4]" />
      <Nav />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-10 pt-24 sm:px-6 md:px-10 md:pb-14 md:pt-28">
        <header className="mb-8 text-center md:mb-10">
          <h1 className="mx-auto font-[family-name:var(--D)] text-[clamp(2.25rem,8vw,4.5rem)] uppercase leading-none tracking-tighter">
            All projects
          </h1>
        </header>
      </div>

      <div className="relative z-10 pb-20 md:pb-28">
        <ProjectsCarousel projects={carouselProjects} />
      </div>

      <Footer />
    </main>
  );
}
