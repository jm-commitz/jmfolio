import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--M)] text-[0.62rem] uppercase tracking-[0.2em]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-[var(--fg3)]" aria-hidden>
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={isLast ? 'text-[var(--fg)]' : 'text-[var(--fg2)]'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[var(--fg2)] no-underline transition-colors hover:text-[var(--primary)]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
