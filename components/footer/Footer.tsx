import { Github, Linkedin, Twitter, Instagram, Mail, FileText } from 'lucide-react';

// Placeholder links — replace href values with your real profiles.
const socials = [
  { label: 'Email', href: 'mailto:jaymarkancheta@socia.ph', Icon: Mail },
  { label: 'GitHub', href: '#', Icon: Github },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
  { label: 'Twitter', href: '#', Icon: Twitter },
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Resume', href: '/cv/JAYMARK%20ANCHETA%20-%20CV.pdf', Icon: FileText },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-2xl px-5 pb-10 pt-6">
      <div className="border-t pt-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') || href.endsWith('.pdf') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-[var(--muted-foreground)]">
          © 2026 Jaymark Ancheta. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
