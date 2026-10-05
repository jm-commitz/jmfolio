import Hero from '@/components/hero/Hero';
import Highlights from '@/components/highlights/Highlights';
import Experience from '@/components/experience/Experience';
import ProjectsList from '@/components/projects/ProjectsList';
import Tools from '@/components/tools/Tools';
import GithubContributions from '@/components/github/GithubContributions';
import TourCursor from '@/components/tour/TourCursor';

export default function Home() {
  return (
    // Mobile: panels stack in DOM order. Desktop (lg): 3-column grid with
    // sticky side panels — profile (+ highlights, experience) left, projects middle, tools/GitHub right.
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)]">
      <aside className="no-scrollbar lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-r">
        <Hero />
        <Highlights />
        <Experience />
      </aside>

      <div className="min-w-0">
        <ProjectsList />
      </div>

      <aside className="no-scrollbar lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l">
        <Tools />
        <GithubContributions />
      </aside>

      {/* Guided cursor tour — every page load, after the splash */}
      <TourCursor />
    </main>
  );
}
