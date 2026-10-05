import Hero from '@/components/hero/Hero';
import Highlights from '@/components/highlights/Highlights';
import Experience from '@/components/experience/Experience';
import ProjectsList from '@/components/projects/ProjectsList';
import Tools from '@/components/tools/Tools';
import GithubContributions from '@/components/github/GithubContributions';
import TourCursor from '@/components/tour/TourCursor';
import FeaturedProject from '@/components/featured/FeaturedProject';
import AvailabilityCard from '@/components/availability/AvailabilityCard';

export default function Home() {
  return (
    // Mobile: panels stack in DOM order and the page scrolls normally.
    // Desktop (lg): a full-height 3-column grid where each column is its own
    // scroller — the wheel only moves the column under the pointer, and
    // overscroll-contain stops it chaining into the others at the ends.
    <main className="min-h-screen lg:grid lg:h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="no-scrollbar lg:h-screen lg:overflow-y-auto lg:overscroll-contain lg:border-r">
        <Hero />
        <Highlights />
        <Experience />
      </aside>

      <div className="no-scrollbar min-w-0 lg:h-screen lg:overflow-y-auto lg:overscroll-contain">
        <FeaturedProject />
        <ProjectsList />
      </div>

      <aside className="no-scrollbar lg:h-screen lg:overflow-y-auto lg:overscroll-contain lg:border-l">
        <AvailabilityCard />
        <Tools />
        <GithubContributions />
      </aside>

      {/* Guided cursor tour — every page load, after the splash */}
      <TourCursor />
    </main>
  );
}
