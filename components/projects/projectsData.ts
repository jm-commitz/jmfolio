import {
  Store,
  Smartphone,
  MessagesSquare,
  Boxes,
  BedDouble,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

export type Project = {
  slug: string; // URL segment — kept stable even if `title` is reworded
  title: string;
  image: string;
  tags: string[];
  href?: string;
  video?: string; // if set, the grid shows the paused video (first frame) instead of the image
  description?: string;
  date?: string;
  icon?: LucideIcon; // list thumbnail glyph; falls back to `image`
  iconBg?: string; // square colour behind the glyph
  logo?: string; // real logo/PWA icon file — wins over `icon` when present
  gallery?: string[]; // extra detail-page shots; the video is prepended at render
  features?: string[]; // bullet list on the detail page
};

// Video-only projects. `image` is used as the paused-frame poster.
export const projects: Project[] = [
  {
    slug: 'doit',
    title: 'DoIt',
    image: '/images/projects/doit/home.jpg',
    video: '/images/projects/doit/DoIt.mp4',
    tags: ['Mobile', 'App'],
    href: '#',
    description: 'A mobile app for orders, rewards, maps and on-the-go convenience.',
    date: 'September 2025',
    icon: Smartphone,
    iconBg: '#6366F1',
  },
  {
    slug: 'caramove',
    title: 'Caramove',
    // Placeholder art until real screens exist — swap `image` for a screenshot.
    image: '/images/projects/caramove-placeholder.svg',
    tags: ['Marketplace', 'Mobile', 'App'],
    href: '#',
    description:
      'A Shopee-style mobile marketplace: browse and search listings, visit seller storefronts, message sellers in-app, then add to cart, check out and track orders through to delivery and ratings.',
    icon: ShoppingBag,
    iconBg: '#EE4D2D',
  },
  {
    slug: 'cinemode',
    title: 'Cinemode',
    image: '/images/projects/cinemode/screen1.png',
    tags: ['Streaming', 'PWA', 'Live'],
    href: 'https://cinemode.fun',
    description:
      'A movie streaming web app with the latest releases, free to watch — just skip or close the ads. Installable as a PWA, so it runs like a native app from the home screen. Live at cinemode.fun.',
    logo: '/images/projects/cinemode/cinemode_pwa.png',
    gallery: [
      '/images/projects/cinemode/screen1.png',
      '/images/projects/cinemode/screen2.png',
      '/images/projects/cinemode/screen3.png',
      '/images/projects/cinemode/screen4.png',
    ],
    features: [
      'Latest movie releases, free to stream',
      'Ad-supported — skip or close the ads to watch',
      'Installable as a PWA, runs like a native app',
    ],
  },
  {
    slug: 'landing-page-dashboard',
    title: 'Landing Page + Dashboard',
    image: '/images/projects/dale.png',
    video: '/images/projects/Dale.mp4',
    tags: ['Marketplace', 'Landing Page', 'Dashboard'],
    href: '#',
    description:
      'A marketplace landing page paired with an admin dashboard for day-to-day operations.',
    date: 'November 2025',
    icon: Store,
    iconBg: '#F59E0B',
  },
  {
    slug: 'omnichannel',
    title: 'Omnichannel',
    image: '/images/projects/omnichannel.png',
    video: '/images/omnichannel.mp4',
    tags: ['SaaS', 'MVP'],
    href: '#',
    description: 'An MVP that unifies sales and messaging across every channel.',
    date: 'July 2025',
    icon: MessagesSquare,
    iconBg: '#10B981',
  },
  {
    slug: 'inventory-system',
    title: 'Inventory System',
    image: '/images/projects/inventory.png',
    video: '/images/projects/mrp.mp4',
    tags: ['Web App'],
    href: '#',
    description: 'A web app for real-time inventory tracking and resource planning.',
    date: 'April 2025',
    icon: Boxes,
    iconBg: '#0EA5E9',
  },
  {
    slug: 'airbnb-clone',
    title: 'Airbnb Clone',
    image: '/images/projects/airbnb.png',
    video: '/images/airbnb.mp4',
    tags: ['Template'],
    href: '#',
    description: 'A full-featured booking experience with a clean, modern UI.',
    date: 'January 2025',
    icon: BedDouble,
    iconBg: '#EF4444',
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
