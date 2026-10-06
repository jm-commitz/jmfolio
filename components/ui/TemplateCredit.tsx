'use client';

import { useEffect, useState } from 'react';
import { Github } from 'lucide-react';

// Required by the LICENSE (attribution clause): every public deployment of this
// template must show this credit. Please keep it. Thank you!
//
// On the author's own site it doubles as a "use this template" invite; on
// everyone else's it reads "Template by Jaymark Ancheta". The ?ref=template tag
// lets the author count visits that come from sites built on the template.
const REPO = 'https://github.com/jm-commitz/jmfolio';
const OWNER_HOSTS = ['jmancheta.cloud', 'www.jmancheta.cloud'];

export default function TemplateCredit() {
  // Decided after mount so server and client markup match.
  const [owner, setOwner] = useState<boolean | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setOwner(OWNER_HOSTS.includes(window.location.hostname)), 0);
    return () => clearTimeout(t);
  }, []);

  const label =
    owner === true ? 'Open source · Use this template' : 'Template by Jaymark Ancheta';

  return (
    <a
      href={`${REPO}?ref=template`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 left-5 z-30 inline-flex items-center gap-1.5 rounded-full border bg-[color-mix(in_srgb,var(--background)_80%,transparent)] px-3 py-1.5 text-[11px] font-medium text-[var(--muted-foreground)] shadow-sm backdrop-blur-md transition-colors hover:text-[var(--foreground)]"
    >
      <Github className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
