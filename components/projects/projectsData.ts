export type Project = {
  title: string;
  image: string;
  tags: string[];
  href?: string;
  video?: string; // if set, the grid shows the paused video (first frame) instead of the image
  description?: string;
  date?: string;
};

// Video-only projects. `image` is used as the paused-frame poster.
export const projects: Project[] = [
  {
    title: 'Dale Prime',
    image: '/images/projects/dale.png',
    video: '/images/projects/Dale.mp4',
    tags: ['SaaS', 'Production'],
    href: '#',
    description: 'A production SaaS platform built to streamline day-to-day business operations.',
    date: 'November 2025',
  },
  {
    title: 'DoIt',
    image: '/images/projects/doit/home.jpg',
    video: '/images/projects/doit/DoIt.mp4',
    tags: ['Mobile', 'App'],
    href: '#',
    description: 'A mobile app for orders, rewards, maps and on-the-go convenience.',
    date: 'September 2025',
  },
  {
    title: 'Omnichannel',
    image: '/images/projects/omnichannel.png',
    video: '/images/omnichannel.mp4',
    tags: ['SaaS', 'MVP'],
    href: '#',
    description: 'An MVP that unifies sales and messaging across every channel.',
    date: 'July 2025',
  },
  {
    title: 'Inventory System',
    image: '/images/projects/inventory.png',
    video: '/images/projects/mrp.mp4',
    tags: ['Web App'],
    href: '#',
    description: 'A web app for real-time inventory tracking and resource planning.',
    date: 'April 2025',
  },
  {
    title: 'Airbnb Clone',
    image: '/images/projects/airbnb.png',
    video: '/images/airbnb.mp4',
    tags: ['Template'],
    href: '#',
    description: 'A full-featured booking experience with a clean, modern UI.',
    date: 'January 2025',
  },
];
