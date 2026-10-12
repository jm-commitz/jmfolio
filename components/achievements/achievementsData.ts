export type Achievement = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  kind: 'award' | 'participation'; // picks the icon (trophy / medal)
  description: string;
  href?: string; // proof: the listing page or certificate
  hrefLabel?: string; // link text for `href`, e.g. "View certificate"
  projectSlug?: string; // the project it came from — links to its case study
  image: string; // Featured slide visual
  imageVariant?: 'browser' | 'paper'; // site screenshot in a MacBook, or a certificate sheet
  facts?: { value: string; label: string }[]; // up to 3 stats on the Featured slide
  featured?: number; // position in the Featured carousel; achievements come before projects
};

export const achievements: Achievement[] = [
  {
    id: 'pafolios-potd',
    title: 'Portfolio of the Day',
    issuer: 'Pafolios',
    date: 'Aug 13, 2026',
    kind: 'award',
    description:
      'This portfolio was picked as Portfolio of the Day in the Software Developer category on Pafolios.',
    href: 'https://pafolios.com/jaymark-ancheta',
    hrefLabel: 'View on Pafolios',
    image: '/images/projects/portfolio/2.png',
    imageVariant: 'browser',
    facts: [
      { value: 'Aug 13', label: 'Portfolio of the Day, 2026' },
      { value: 'Dev', label: 'Software Developer category' },
    ],
    featured: 1,
  },
  {
    id: 'appbuilders-hackathon-2026',
    title: 'AppBuildersPH Hackathon 2026',
    issuer: 'App Builders PH',
    date: 'Oct 9–10, 2026',
    kind: 'participation',
    description:
      'Built Onai, an offline “Mother AI” for the family, in 24 hours with team 404 Devs at Cyberzone, SM Makati.',
    href: '/images/hackathon/certificate.pdf',
    hrefLabel: 'View certificate',
    projectSlug: 'onai',
    image: '/images/hackathon/certificate.png',
    imageVariant: 'paper',
    facts: [
      { value: '24h', label: 'to build it' },
      { value: '4', label: 'devs on team 404 Devs' },
      { value: '0', label: 'internet needed to run' },
    ],
    featured: 2,
  },
];
