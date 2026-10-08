import {
  Store,
  Smartphone,
  MessagesSquare,
  Boxes,
  BedDouble,
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
  // 'phone': portrait phone screenshots in phone frames.
  // 'devices': desktop `gallery` shots in MacBook frames + `mobileGallery` in iPhones.
  galleryVariant?: 'phone' | 'devices';
  mobileGallery?: string[]; // phone screenshots for the 'devices' variant
  // Show N empty "screenshot coming soon" frames on the detail page instead of
  // the real media — for projects whose screenshots aren't ready yet.
  placeholderGallery?: number;
  sourceHref?: string; // public repo — shows a "Use this portfolio" offer on the detail page
  caseStudy?: CaseStudy; // long-form write-up rendered under the features
  featured?: number; // position in the homepage Featured carousel (1 = first)
};

// Only `problem` and `highlights` are required, so a case study can be written
// from what's verifiable (e.g. screenshots) without inventing stats or a stack.
export type CaseStudy = {
  role?: string;
  timeline?: string;
  stack?: string[];
  problem: string;
  numbers?: { value: string; label: string }[];
  highlights: { title: string; body: string }[];
};

// Video-only projects. `image` is used as the paused-frame poster.
export const projects: Project[] = [
  {
    slug: 'doit',
    title: 'DoIt',
    featured: 3,
    image: '/images/projects/doit/home.jpg',
    video: '/images/projects/doit/DoIt.mp4',
    tags: ['Delivery', 'Mobile', 'App'],
    href: '#',
    description:
      'A water-refill delivery app. Find nearby refill stations on a map, order gallons to your door and track them until they arrive, chat with the station, and earn PTS points you can redeem with partner brands.',
    date: 'September 2025',
    icon: Smartphone,
    iconBg: '#6366F1',
    galleryVariant: 'phone',
    gallery: [
      '/images/projects/doit/home.jpg',
      '/images/projects/doit/maps.jpg',
      '/images/projects/doit/orders.jpg',
      '/images/projects/doit/rewards.jpg',
      '/images/projects/doit/chat.jpg',
      '/images/projects/doit/profile.jpg',
    ],
    features: [
      'Nearby refill stations with ratings, distance and ETA',
      'Map of every station around you',
      'Order gallons and track them from the home screen',
      'Orders grouped into Pending, Active, Done and Cancelled',
      'In-app chat with the refill station',
      'PTS points with a partner rewards catalog',
      'Recurring weekly or biweekly deliveries',
      'One account that switches between Buyer, Seller and Rider',
    ],
    caseStudy: {
      problem:
        'Ordering drinking water usually means calling or messaging a refill station and hoping someone answers. You don’t know which stations are nearby, how long delivery takes, or where your order is. DoIt puts stations, ordering, tracking and messaging in one app, and gives customers a reason to come back with points and recurring deliveries.',
      highlights: [
        {
          title: 'One account, three modes',
          body: 'The same login switches between Buyer, Seller and Rider from the profile screen. Station owners and riders don’t need a separate app or account, and a "Partner" card on the home screen invites station owners to join.',
        },
        {
          title: 'Stations on a map, not a list',
          body: 'A full-screen map pins every nearby refill station around your location. The home screen lists the closest ones with their rating, water types (purified, mineral, alkaline), distance and delivery time.',
        },
        {
          title: 'Order status you can see',
          body: 'An active order shows up as a card on the home screen ("Waiting for confirmation") with a Track button. The Orders tab splits everything into Pending, Active, Done and Cancelled, with gallons, price and date for each.',
        },
        {
          title: 'Loyalty built in',
          body: 'Orders earn PTS points, shown on the home screen and in a Rewards tab with a balance, history, a "How to earn PTS" guide and a catalog of partner rewards and promos.',
        },
        {
          title: 'Set it and forget it',
          body: 'Recurring orders automate weekly or biweekly deliveries, so a household that drinks the same amount every week doesn’t have to reorder by hand.',
        },
        {
          title: 'A friendlier greeting',
          body: 'The home screen opens with a personal greeting and a thirsty water-drop mascot asking for a refill. It gives the app a personality instead of starting on a plain order form.',
        },
      ],
    },
  },
  {
    slug: 'caramove',
    title: 'Caramove',
    featured: 1,
    image: '/images/projects/caramove/caramove1.jpg',
    logo: '/images/projects/caramove/caramove_pwa.png',
    tags: ['Marketplace', 'Mobile', 'PWA'],
    href: '#',
    date: 'April – August 2026',
    description:
      'A local delivery marketplace for Tuguegarao City. Customers, shop owners and riders each get their own experience inside one Flutter app, backed by a Laravel API and a Next.js admin panel — covering the whole order lifecycle from browsing a shop to a rider submitting photo proof of delivery.',
    galleryVariant: 'phone',
    gallery: [
      '/images/projects/caramove/caramove1.jpg',
      '/images/projects/caramove/caramove2.jpg',
      '/images/projects/caramove/caramove3.jpg',
      '/images/projects/caramove/caramove4.jpg',
      '/images/projects/caramove/caramove5.jpg',
      '/images/projects/caramove/caramove6.jpg',
    ],
    features: [
      'Browse shops and products, search, cart and checkout',
      'Live shipping quote before the order is placed',
      'Shop owner order queue: accept, prepare, mark ready',
      'Rider assignment — automatic, with manual override',
      'Order tracking on an OpenStreetMap view',
      'Photo proof of delivery, then customer confirmation',
      'Ratings and reviews once an order completes',
      'Push notifications on every status change',
      'Admin panel for shop approvals, reports and payouts',
      'Rider incentives tracked, approved and marked paid',
    ],
    caseStudy: {
      role: 'Solo developer — API, admin panel and mobile app',
      timeline: 'April – August 2026 · 52 commits across three repositories',
      stack: [
        'Laravel 13',
        'PHP 8.3',
        'Sanctum',
        'Flutter',
        'Riverpod',
        'go_router',
        'Dio',
        'flutter_map',
        'Next.js 16',
        'React 19',
        'Tailwind v4',
        'shadcn/ui',
        'Firebase Cloud Messaging',
      ],
      problem:
        "Local deliveries in Tuguegarao City run on Facebook posts and phone calls. Shops and riders coordinate by hand, and customers have no idea where an order is once they've paid. Caramove puts all four parties — customer, shop owner, rider and admin — on one system, so an order moves through a single tracked lifecycle instead of a group chat.",
      numbers: [
        { value: '117', label: 'API endpoints' },
        { value: '4', label: 'roles, 4 separate auth guards' },
        { value: '26', label: 'mobile screens' },
        { value: '~14,800', label: 'lines of Dart' },
        { value: '18', label: 'Eloquent models, 30 migrations' },
        { value: '3', label: 'client surfaces on one API' },
      ],
      highlights: [
        {
          title: 'Four roles, four separate auth guards',
          body: 'Rather than one users table with a role column, each role has its own model, table and Sanctum guard. A customer token is structurally incapable of reaching a shop owner endpoint — authorisation is enforced by middleware that type-checks the authenticated model, so a missed permission check fails closed instead of leaking data.',
        },
        {
          title: 'The order lifecycle is a state machine, not controller code',
          body: 'Every transition — accept, reject, prepare, ready, assign rider, dispatch, deliver, confirm, cancel — lives in one service with sixteen guarded methods. Controllers only call into it. Each transition also fires the right push notification to whichever party needs to know, so notifications can’t drift out of sync with order state.',
        },
        {
          title: 'Shipping priced from configurable tiers',
          body: 'Instead of hard-coded rates, the quote engine composes weight tiers, distance tiers and peak-hour surcharges — flat or percentage, including windows that run past midnight — plus optional priority-delivery and rider-incentive settings. Operations can retune pricing from the admin panel without a deploy.',
        },
        {
          title: 'Networking built for patchy mobile data',
          body: 'One shared Dio client attaches the auth token and retries timeouts, dropped connections and 5xx responses three times on a 3/6/10-second backoff. The API answers every error — 500s included — as JSON, so the app and admin panel parse one predictable error shape instead of occasionally choking on an HTML stack trace.',
        },
        {
          title: 'Service-area enforcement',
          body: 'Delivery addresses are geofenced to Tuguegarao City before an order is accepted, keeping the rider pool inside a distance the shipping tiers were actually priced for.',
        },
        {
          title: 'OpenStreetMap over Google Maps',
          body: 'Maps run on flutter_map against OSM tiles. For a single-city service area, Google’s tile costs and billing setup bought nothing, and dropping the dependency kept the app buildable without a paid API key.',
        },
      ],
    },
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    featured: 2,
    image: '/images/projects/portfolio/2.png',
    logo: '/images/projects/portfolio/icon.png',
    tags: ['Web App', 'Open Source', 'Live'],
    href: 'https://www.jmancheta.cloud',
    sourceHref: 'https://github.com/jm-commitz/jmfolio',
    date: '2026',
    description:
      'This site: an open-source developer portfolio with a 3-column desktop layout, an iOS-style hello splash, a guided cursor tour, App Store-style project pages and live GitHub and Spotify data.',
    galleryVariant: 'devices',
    gallery: ['/images/projects/portfolio/2.png', '/images/projects/portfolio/1.png'],
    mobileGallery: ['/images/projects/portfolio/3.png'],
    features: [
      'Three-column desktop layout where each column scrolls on its own',
      'iOS-style "hello" splash that hands off to the tour',
      'Figma-style guided cursor tour with typing speech bubbles',
      'App Store-style project pages with full case studies',
      'Instagram-style story highlights',
      'Live GitHub graph, Spotify now playing and viewer count',
      'Circular reveal when switching light and dark themes',
      'Animated dot-grid background drawn on a canvas',
    ],
    caseStudy: {
      role: 'Design & development',
      timeline: '2026 · built with Claude Code',
      stack: [
        'Next.js 16',
        'React 19',
        'TypeScript',
        'Tailwind CSS',
        'Framer Motion',
        'Embla Carousel',
        'Supabase Realtime',
        'Spotify Web API',
        'GitHub GraphQL API',
        'next-themes',
        'Vercel',
      ],
      problem:
        'Most developer portfolios are the same template: a hero, a grid of cards and a contact form. They show what you made but nothing about how you build. This one is designed to behave like a product: it greets you, gives you a tour, and its project pages read like App Store listings with real case studies, while staying fast and statically rendered.',
      numbers: [
        { value: '39', label: 'React components' },
        { value: '13', label: 'guided tour stops' },
        { value: '3', label: 'live data sources: GitHub, Spotify, Supabase' },
        { value: '4', label: 'API routes' },
      ],
      highlights: [
        {
          title: 'Three columns, three scrollers',
          body: 'On desktop the page itself never scrolls. Each column is its own full-height scroller with overscroll-contain, so the wheel only moves the column under the pointer and never spills into the others at the ends.',
        },
        {
          title: 'A tour bubble that leads the typing',
          body: 'The guided cursor types each message letter by letter. The bubble measures the typed text plus the next couple of characters, so it always grows just ahead of the caret. It flips sides, turns the cursor and slides to fit on small screens.',
        },
        {
          title: 'A breathing dot field that costs almost nothing',
          body: 'The background grid is drawn once to an offscreen canvas. Only about 6% of the dots are animated, at 30fps, and the loop pauses when the tab is hidden and stops entirely for reduced motion.',
        },
        {
          title: 'Theme switch as a circular reveal',
          body: 'Switching light and dark uses the View Transitions API: the new theme grows out of the toggle button as a circle, with an instant fallback where the API or motion is not available.',
        },
        {
          title: 'Live data without giving up static pages',
          body: 'The homepage stays statically generated. Spotify and viewer presence load on the client through API routes, the GitHub graph revalidates hourly, and the profile picture loads straight from GitHub so a new avatar shows up within minutes.',
        },
        {
          title: 'Music-aware avatar',
          body: 'While Spotify is playing, the avatar swaps to an animated GIF chosen from the artist’s genres (party, rock or normal), with a now-playing bubble above it.',
        },
      ],
    },
  },
  {
    slug: 'landing-page-dashboard',
    placeholderGallery: 3,
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
    placeholderGallery: 3,
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
    placeholderGallery: 3,
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
    placeholderGallery: 3,
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
