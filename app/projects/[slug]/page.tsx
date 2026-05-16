import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { projects, getProjectBySlug } from '@/components/featuredProjects/projectsData';
import ProjectGallery from '@/components/projects/ProjectGallery';

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
      <div className="pointer-events-none fixed inset-0 z-[5] h-scan opacity-[0.25]" aria-hidden />

      {/* Full-viewport hero (video when available, fallback to image) */}
      <section className="relative h-[100dvh] min-h-[20rem] w-full overflow-hidden">
        {project.video ? (
          <video
            src={project.video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <Image
            src={project.img}
            alt={project.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
            quality={90}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-[var(--bg)]"
          aria-hidden
        />

        <nav className="absolute left-0 right-0 top-0 z-10 flex min-w-0 items-center justify-start px-6 py-8 md:px-12 md:py-10 reveal animate-[terminal-slide_0.6s_ease-out_forwards]">
          <Link
            href="/#projects"
            className="group flex min-w-0 items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--fg)] drop-shadow-md transition-colors hover:text-white md:gap-3 md:text-[0.65rem] md:tracking-[0.3em]"
          >
            <span className="shrink-0 text-[1rem] transition-transform group-hover:-translate-x-1 md:text-[1.2rem]">
              &larr;
            </span>
            <span className="font-[family-name:var(--D)] text-[0.7rem] md:text-[0.8rem]">All projects</span>
          </Link>
        </nav>

        <header className="absolute inset-x-0 bottom-0 z-10 min-w-0 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-32 md:px-12 md:pb-14 md:pt-40 reveal animate-[terminal-slide_0.85s_ease-out_forwards]">
          <div className="w-full min-w-0 [container-type:inline-size]">
            <h1 className="font-display mb-5 max-w-full text-balance break-words text-[clamp(1.5rem,min(6.5vw,3.75cqi),4rem)] uppercase leading-[0.95] tracking-tight text-[var(--fg)] drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)] md:mb-8 lg:text-[clamp(1.65rem,min(5vw,3.5cqi),4.25rem)]">
              {project.name}
            </h1>
            <p className="w-full max-w-full py-2 font-sans text-pretty text-[0.9rem] font-normal leading-relaxed text-[#ebe8e0] backdrop-blur-[2px] md:text-[1.05rem]">
              &ldquo;{project.shortDesc}&rdquo;
            </p>
          </div>
        </header>
      </section>

      <div className="relative z-10 w-full px-6 pb-12 pt-16 md:px-12 md:pb-20 md:pt-20">
        {/* Project Content - Details Below */}
        <section className="grid grid-cols-1 gap-12 font-sans md:grid-cols-2 lg:gap-20 mb-24 items-start">
          <div className="space-y-12 py-4">
            <div className="reveal animate-[terminal-slide_0.6s_ease-out_forwards]">
              <h2 className="mb-4 flex items-center gap-3 text-[1rem] font-semibold uppercase tracking-[0.06em] text-[var(--fg)] md:text-[1.1rem]">
                <span className="h-2 w-2 shrink-0 bg-[var(--primary)]" aria-hidden />
                The Problem
              </h2>
              <p className="text-[0.95rem] font-normal leading-[1.75] text-[#c9c4ba] md:text-[1rem]">
                {project.clientProblem}
              </p>
            </div>

            <div className="reveal animate-[terminal-slide_0.8s_ease-out_forwards]">
              <h2 className="mb-4 flex items-center gap-3 text-[1rem] font-semibold uppercase tracking-[0.06em] text-[var(--fg)] md:text-[1.1rem]">
                <span className="h-2 w-2 shrink-0 bg-[var(--primary)]" aria-hidden />
                Architectural Solution
              </h2>
              <p className="text-[0.95rem] font-normal leading-[1.75] text-[#c9c4ba] md:text-[1rem]">
                {project.solution}
              </p>
            </div>
          </div>

          <div className="space-y-12 py-4">
            <div className="reveal animate-[terminal-slide_1s_ease-out_forwards]">
              <h2 className="mb-6 flex items-center gap-3 text-[1.05rem] font-semibold uppercase tracking-[0.06em] text-[var(--fg)] md:text-[1.15rem]">
                <span className="h-2 w-2 shrink-0 bg-[var(--primary)]" aria-hidden />
                Technical Capabilities
              </h2>
              <ul className="grid grid-cols-1 gap-3">
                {project.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="group flex items-start gap-4 bg-[var(--bg2)]/40 p-4 transition-colors hover:bg-[var(--bg2)]"
                  >
                    <span className="mt-0.5 min-w-[1.25rem] font-sans text-[0.7rem] font-semibold tabular-nums text-[var(--primary)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.9rem] font-normal leading-snug text-[#c9c4ba] transition-colors group-hover:text-[#e8e4d9] md:text-[0.95rem]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal animate-[terminal-slide_1.2s_ease-out_forwards]">
              <h2 className="mb-5 text-[1.05rem] font-semibold uppercase tracking-[0.06em] text-[var(--fg)] md:text-[1.15rem]">
                Tools / Infrastructure
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.techs.map((tech) => (
                  <span
                    key={tech}
                    className="cursor-default bg-[var(--bg2)] px-3 py-2 text-[0.7rem] font-medium uppercase tracking-wide text-[#ddd8cf] transition-colors hover:bg-[var(--bg3)] hover:text-[var(--fg)] md:text-[0.75rem]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Project gallery */}
        {(() => {
          const galleryImages = [
            project.img,
            ...(project.gallery ?? []).filter((g) => g !== project.img),
          ];
          return (
            <section className="mb-24 reveal animate-[terminal-slide_1.3s_ease-out_forwards]">
              <h2 className="mb-6 flex items-center gap-3 text-[1rem] font-semibold uppercase tracking-[0.06em] text-[var(--fg)] md:text-[1.1rem]">
                <span className="h-2 w-2 shrink-0 bg-[var(--primary)]" aria-hidden />
                Project Gallery
              </h2>
              <ProjectGallery images={galleryImages} projectName={project.name} />
            </section>
          );
        })()}

        {/* CTA Footer */}
        <footer className="flex flex-col items-start justify-between gap-8 pt-16 md:flex-row md:items-center md:gap-10 reveal animate-[terminal-slide_1.4s_ease-out_forwards]">
          <div className="min-w-0 flex-1 space-y-3 text-left font-sans">
            <h3 className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-[var(--fg)] md:text-[1.05rem]">
              End of case study
            </h3>
            <p className="w-full max-w-none text-[0.95rem] font-normal leading-relaxed text-[#c9c4ba] md:text-[1rem]">
              Want to deploy a similar architecture for your enterprise? Let&apos;s discuss protocol.
            </p>
          </div>
          <Link
            href="/#contact"
            className="btn-y !inline-block w-fit shrink-0 !px-5 !py-2.5 !text-[0.62rem] !tracking-[0.18em] hover:!scale-100 md:!px-6 md:!py-3 md:!text-[0.68rem]"
          >
            Initiate Contact
          </Link>
        </footer>
      </div>
    </main>
  );
}


