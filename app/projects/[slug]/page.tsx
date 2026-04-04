import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects, getProjectBySlug } from '@/components/featuredProjects/projectsData';

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--red)] selection:text-white">
      {/* Decorative scanline overlay */}
      <div className="h-scan opacity-[0.4]" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-20 relative z-10">
        {/* Navigation & Breadcrumb */}
        <nav className="flex items-center justify-between gap-4 mb-16 reveal animate-[terminal-slide_0.6s_ease-out_forwards]">
          <Link
            href="/projects"
            className="group text-[0.6rem] md:text-[0.65rem] tracking-[0.2em] md:tracking-[0.3em] uppercase text-[var(--fg2)] hover:text-[var(--fg)] transition-all flex items-center gap-2 md:gap-3"
          >
            <span className="text-[1rem] md:text-[1.2rem] group-hover:-translate-x-1 transition-transform">&larr;</span>
            <span className="font-[family-name:var(--D)] text-[0.7rem] md:text-[0.8rem]">All projects</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-4 text-[0.55rem] md:text-[0.65rem] tracking-widest text-[var(--fg3)]">
              <span className="hidden xs:inline">STRESS_TEST_MODE: ON</span>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--red)] animate-pulse" />
          </div>
        </nav>

        {/* Hero Section */}
        <header className="mb-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
          <div className="reveal animate-[terminal-slide_0.8s_ease-out_forwards]">
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <span className="text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-[var(--red)] font-[family-name:var(--M)] px-2 py-1 bg-[var(--red)]/5">
                SYSTEM_ID: {project.num} // {project.year}
              </span>
              <div className="hidden sm:block h-[1px] w-8 md:w-12 bg-[var(--fg3)]" />
              <span className="text-[0.55rem] md:text-[0.65rem] tracking-[0.2em] md:tracking-[0.3em] uppercase text-[var(--fg3)] font-[family-name:var(--M)]">
                {project.techs.slice(0, 3).join(' + ')}
              </span>
            </div>
            <h1 className="font-[family-name:var(--D)] text-[clamp(1.75rem,8vw,5.5rem)] leading-[0.95] md:leading-[0.9] tracking-tight uppercase mb-6 md:mb-8">
              {project.name}
            </h1>
            <p className="max-w-xl text-[0.8rem] md:text-[1rem] text-[var(--fg2)] leading-relaxed italic font-[family-name:var(--M)] border-l-2 border-[var(--red)]/30 pl-4 md:pl-6 py-2">
              "{project.shortDesc}"
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-2 font-[family-name:var(--M)] reveal animate-[terminal-slide_1s_ease-out_forwards]">
            <div className="text-[0.6rem] tracking-[0.5em] uppercase text-[var(--fg3)] text-right rotate-180 [writing-mode:vertical-rl]">
              ESTABLISHED_M26
            </div>
            <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-[var(--fg3)] to-transparent" />
          </div>
        </header>

        {/* Project Viewport - Full Width Image */}
        <section className="mb-24 reveal animate-[terminal-slide_1s_ease-out_forwards]">
          <div className="group relative">
            <div className="bg-[var(--bg2)] overflow-hidden relative">
              {/* Dynamic status bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--bg3)] overflow-hidden">
                <div className="h-full bg-[var(--red)] w-1/3 animate-[tick_8s_infinite]" />
              </div>

              <div className="p-2 md:p-4">
                <img
                  src={project.img}
                  alt={project.name}
                  className="w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700 brightness-[0.9] hover:brightness-100"
                />
              </div>

              {/* Labels */}
              <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2 pointer-events-none">
                <div className="bg-[var(--red)] px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white">
                  {project.year}
                </div>
                <div className="bg-[var(--bg)]/80 backdrop-blur-xl px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--fg)] font-[family-name:var(--M)]">
                  BUILD_VER_2.0
                </div>
              </div>
            </div>

            {/* Image Metadata Footer */}
            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-[family-name:var(--M)] text-[0.45rem] md:text-[0.55rem] tracking-[0.2em] md:tracking-[0.3em] text-[var(--fg3)] uppercase">
              <span>SCAN_RESOLUTION: 4K_OPTIMIZED</span>
              <div className="flex gap-4">
                <span>BITRATE: 64MBPS</span>
                <span>STATE: FROZEN</span>
              </div>
            </div>
          </div>
        </section>

        {/* Project Content - Details Below */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24 items-start">
          <div className="space-y-12 py-4">
            <div className="reveal animate-[terminal-slide_0.6s_ease-out_forwards]">
              <h2 className="text-[1.1rem] md:text-[1.2rem] font-bold tracking-[0.2em] uppercase text-[var(--fg)] mb-4 flex items-center gap-3 font-[family-name:var(--D)]">
                <span className="w-2 h-2 bg-[var(--red)]" />
                The Problem
              </h2>
              <p className="text-[0.9rem] text-[var(--fg2)] leading-[1.7] font-[family-name:var(--M)]">
                {project.clientProblem}
              </p>
            </div>

            <div className="reveal animate-[terminal-slide_0.8s_ease-out_forwards]">
              <h2 className="text-[1.1rem] md:text-[1.2rem] font-bold tracking-[0.2em] uppercase text-[var(--fg)] mb-4 flex items-center gap-3 font-[family-name:var(--D)]">
                <span className="w-2 h-2 bg-[var(--red)]" />
                Architectural Solution
              </h2>
              <p className="text-[0.9rem] text-[var(--fg2)] leading-[1.7] font-[family-name:var(--M)]">
                {project.solution}
              </p>
            </div>
          </div>

          <div className="space-y-12 py-4">
            <div className="reveal animate-[terminal-slide_1s_ease-out_forwards]">
              <h2 className="text-[1.2rem] font-bold tracking-[0.2em] uppercase text-[var(--fg)] mb-6 flex items-center gap-3 font-[family-name:var(--D)]">
                <span className="w-2 h-2 bg-[var(--red)]" />
                Technical Capabilities
              </h2>
              <ul className="grid grid-cols-1 gap-4">
                {project.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="group flex items-start gap-4 p-4 bg-[var(--bg2)]/50 hover:bg-[var(--bg2)] transition-colors"
                  >
                    <span className="text-[0.6rem] text-[var(--red)] font-[family-name:var(--M)] mt-1">0{idx + 1}</span>
                    <span className="text-[0.85rem] text-[var(--fg2)] group-hover:text-[var(--fg)] transition-colors leading-snug font-[family-name:var(--M)] tracking-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal animate-[terminal-slide_1.2s_ease-out_forwards]">
              <h2 className="text-[1.2rem] font-bold tracking-[0.2em] uppercase text-[var(--fg)] mb-5 font-[family-name:var(--D)]">Tools / Infrastructure</h2>
              <div className="flex flex-wrap gap-2">
                {project.techs.map((tech) => (
                  <span
                    key={tech}
                    className="text-[0.62rem] text-[var(--fg2)] font-bold uppercase tracking-[0.25em] px-4 py-2 bg-[var(--bg3)] hover:text-[var(--fg)] transition-all cursor-default font-[family-name:var(--M)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <footer className="pt-16 flex flex-col md:flex-row items-center justify-between gap-10 reveal animate-[terminal-slide_1.4s_ease-out_forwards]">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-[1.1rem] text-[var(--red)] font-bold tracking-[0.25em] uppercase font-[family-name:var(--D)]">
              END_OF_CASE_STUDY
            </h3>
            <p className="text-[0.95rem] text-[var(--fg2)] font-[family-name:var(--M)] max-w-lg">
              Want to deploy a similar architecture for your enterprise? Let's discuss protocol.
            </p>
          </div>
          <Link
            href="/#contact"
            className="btn-y px-10 py-5 text-[0.8rem] tracking-[0.3em] font-bold hover:scale-105 transition-transform"
          >
            Initiate Contact
          </Link>
        </footer>
      </div>
    </main>
  );
}


