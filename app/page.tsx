import Hero from '@/components/hero/Hero';
import Highlights from '@/components/highlights/Highlights';
import Experience from '@/components/experience/Experience';
import ProjectsList from '@/components/projects/ProjectsList';
import Tools from '@/components/tools/Tools';
import GithubContributions from '@/components/github/GithubContributions';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Highlights />
      <Experience />
      <ProjectsList />
      <Tools />
      <GithubContributions />
    </main>
  );
}
