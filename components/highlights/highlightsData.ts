export type Highlight = {
  id: 'about' | 'stack' | 'contact' | 'now';
  label: string;
  title: string;
  body: string;
};

// Placeholder content — edit freely.
export const highlights: Highlight[] = [
  {
    id: 'about',
    label: 'About',
    title: 'About me',
    body: 'Full-stack & mobile developer from the Philippines. I build fast, reliable web and mobile apps end-to-end — from idea to launch.',
  },
  {
    id: 'stack',
    label: 'Stack',
    title: 'My stack',
    body: 'React, Next.js, React Native / Expo, Node, and Laravel — plus AI tools like Claude, ChatGPT, Copilot and Cursor in my daily workflow.',
  },
  {
    id: 'now',
    label: 'Now',
    title: "What I'm up to",
    body: 'Currently building at Socia I.T Solutions and shipping side projects on the weekends.',
  },
  {
    id: 'contact',
    label: 'Contact',
    title: "Let's talk",
    body: "Open to freelance and full-time work. Hit Message on my profile to reach me on WhatsApp, or Follow on GitHub.",
  },
];
