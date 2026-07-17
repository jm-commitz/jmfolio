export type Tech = {
  name: string;
  icon: string;
  // Monochrome logos need to flip with the theme so they stay visible.
  tone?: 'black' | 'white';
};

// Logos live in public/images/techstack. Add/remove to match your stack.
export const tech: Tech[] = [
  { name: 'JavaScript', icon: '/images/techstack/javascript-logo-svgrepo-com.svg' },
  { name: 'TypeScript', icon: '/images/techstack/typescript.svg' },
  { name: 'React', icon: '/images/techstack/react.svg' },
  { name: 'Next.js', icon: '/images/techstack/nextjs2.svg', tone: 'black' },
  { name: 'Node.js', icon: '/images/techstack/nodejs.svg' },
  { name: 'Angular', icon: '/images/techstack/angular.svg' },
  { name: 'Flutter', icon: '/images/techstack/flutter.svg' },
  { name: 'Expo', icon: '/images/techstack/expo.svg', tone: 'white' },
  { name: 'Laravel', icon: '/images/techstack/laravel.svg' },
  { name: 'PHP', icon: '/images/techstack/php.svg' },
  { name: 'Python', icon: '/images/techstack/python.svg' },
  { name: 'MySQL', icon: '/images/techstack/mysql.svg' },
  { name: 'HTML5', icon: '/images/techstack/html5.svg' },
  { name: 'CSS3', icon: '/images/techstack/css3.svg' },
  { name: 'Docker', icon: '/images/techstack/docker.svg' },
  { name: 'Git', icon: '/images/techstack/git.svg' },
  { name: 'Figma', icon: '/images/techstack/figma.svg' },
  { name: 'Claude', icon: '/images/techstack/claude.svg' },
  { name: 'ChatGPT', icon: '/images/techstack/openai.svg', tone: 'black' },
  { name: 'Copilot', icon: '/images/techstack/copilot.svg', tone: 'black' },
  { name: 'Cursor', icon: '/images/techstack/cursor.svg', tone: 'black' },
];
