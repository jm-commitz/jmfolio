export type Tech = {
  name: string;
  icon: string;
  // Monochrome logos need to flip with the theme so they stay visible.
  tone?: 'black' | 'white';
};

export type TechGroup = { label: string; items: Tech[] };

const I = (file: string) => `/images/techstack/${file}`;

// Logos live in public/images/techstack (single-colour ones are from Simple
// Icons and use tone: 'black'). Add/remove to match your stack.
export const techGroups: TechGroup[] = [
  {
    label: 'Languages',
    items: [
      { name: 'TypeScript', icon: I('typescript.svg') },
      { name: 'JavaScript', icon: I('javascript-logo-svgrepo-com.svg') },
      { name: 'Dart', icon: I('dart.svg'), tone: 'black' },
      { name: 'PHP', icon: I('php.svg') },
      { name: 'Python', icon: I('python.svg') },
      { name: 'HTML5', icon: I('html5.svg') },
      { name: 'CSS3', icon: I('css3.svg') },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { name: 'React', icon: I('react.svg') },
      { name: 'Next.js', icon: I('nextjs2.svg'), tone: 'black' },
      { name: 'Angular', icon: I('angular.svg') },
      { name: 'Tailwind CSS', icon: I('tailwindcss.svg'), tone: 'black' },
      { name: 'Framer Motion', icon: I('framer.svg'), tone: 'black' },
      { name: 'shadcn/ui', icon: I('shadcnui.svg'), tone: 'black' },
    ],
  },
  {
    label: 'Mobile',
    items: [
      { name: 'Flutter', icon: I('flutter.svg') },
      { name: 'Expo', icon: I('expo.svg'), tone: 'white' },
    ],
  },
  {
    label: 'Backend & Data',
    items: [
      { name: 'Node.js', icon: I('nodejs.svg') },
      { name: 'Laravel', icon: I('laravel.svg') },
      { name: 'MySQL', icon: I('mysql.svg') },
      { name: 'Supabase', icon: I('supabase.svg'), tone: 'black' },
      { name: 'Firebase', icon: I('firebase.svg'), tone: 'black' },
    ],
  },
  {
    label: 'DevOps & Tools',
    items: [
      { name: 'Git', icon: I('git.svg') },
      { name: 'GitHub', icon: I('github.svg'), tone: 'black' },
      { name: 'Docker', icon: I('docker.svg') },
      { name: 'Vercel', icon: I('vercel.svg'), tone: 'black' },
      { name: 'Cloudflare', icon: I('cloudflare.svg'), tone: 'black' },
      { name: 'Render', icon: I('render.svg'), tone: 'black' },
      { name: 'Figma', icon: I('figma.svg') },
    ],
  },
  {
    label: 'AI',
    items: [
      { name: 'Claude', icon: I('claude.svg') },
      { name: 'ChatGPT', icon: I('openai.svg'), tone: 'black' },
      { name: 'Copilot', icon: I('copilot.svg'), tone: 'black' },
      { name: 'Cursor', icon: I('cursor.svg'), tone: 'black' },
    ],
  },
];

/** Flat list, for anything that just needs every tool. */
export const tech: Tech[] = techGroups.flatMap((g) => g.items);
