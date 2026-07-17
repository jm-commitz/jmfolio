import Hero from '@/components/hero/Hero';
import Highlights from '@/components/highlights/Highlights';
import Experience from '@/components/experience/Experience';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import Tools from '@/components/tools/Tools';
import GithubContributions from '@/components/github/GithubContributions';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Highlights />
      <Experience />
      <ProjectsGrid />
      <Tools />
      <GithubContributions />
    </main>
  );
}
