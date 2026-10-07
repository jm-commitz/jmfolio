'use client';

import { useEffect, useState } from 'react';
import { Github } from 'lucide-react';

// Required by the LICENSE (attribution clause): every public deployment of this
// template must show this credit. Please keep it. Thank you!
//
// Hidden on the author's own site (and on localhost while developing); shown
// everywhere else as "Template by Jaymark Ancheta". The ?ref=template tag lets
// the author count visits that come from sites built on the template.
const REPO = 'https://github.com/jm-commitz/jmfolio';
const OWNER_HOSTS = ['jmancheta.cloud', 'www.jmancheta.cloud', 'localhost', '127.0.0.1'];

export default function TemplateCredit() {
  // Decided after mount so server and client markup match.
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(!OWNER_HOSTS.includes(window.location.hostname)), 0);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <a
      href={`${REPO}?ref=template`}
      data-say="Make this site yours 🙌"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 left-5 z-30 inline-flex items-center gap-1.5 rounded-full border bg-[color-mix(in_srgb,var(--background)_80%,transparent)] px-3 py-1.5 text-[11px] font-medium text-[var(--muted-foreground)] shadow-sm backdrop-blur-md transition-colors hover:text-[var(--foreground)]"
    >
      <Github className="h-3.5 w-3.5" />
      Template by Jaymark Ancheta
    </a>
  );
}
