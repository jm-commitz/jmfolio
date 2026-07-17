import ThemeToggle from '@/components/theme/ThemeToggle';

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-[var(--background)]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
        <a
          href="#"
          className="text-sm font-semibold tracking-tight text-[var(--foreground)]"
        >
          JM
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
