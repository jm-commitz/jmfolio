export type Experience = {
  period: string;
  company: string;
  role: string;
  current?: boolean;
  href?: string;
  shiny?: boolean;
};

// Placeholder content — edit periods, companies, and roles to match your history.
export const experiences: Experience[] = [
  {
    period: 'August 2025 – Present',
    company: 'Socia I.T Solutions',
    role: 'Full-Stack Developer',
    current: true,
    href: 'https://socia.ph/',
    shiny: true,
  },
  {
    period: '2023 – Present',
    company: 'Freelance',
    role: 'Full-Stack & Mobile Developer',
    current: true,
  },
  {
    period: '2021',
    company: 'Hello World',
    role: 'Wrote my first line of code',
  },
];
