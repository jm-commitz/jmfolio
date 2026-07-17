import { GITHUB_USERNAME } from '@/lib/github';

type Day = { date: string; count: number; level: number };
type ContribData = { total: Record<string, number>; contributions: Day[] };

async function getContributions(
  username: string,
): Promise<ContribData | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as ContribData;
  } catch {
    return null;
  }
}

// Monochrome level shades (theme-aware via --foreground).
const LEVEL_COLOR = [
  'var(--border)',
  'color-mix(in srgb, var(--foreground) 28%, transparent)',
  'color-mix(in srgb, var(--foreground) 50%, transparent)',
  'color-mix(in srgb, var(--foreground) 74%, transparent)',
  'var(--foreground)',
];

export default async function GithubContributions() {
  const data = await getContributions(GITHUB_USERNAME);
  if (!data || !data.contributions?.length) return null;

  const days = data.contributions;
  const firstWeekday = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
  const cells: (Day | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...days,
  ];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const total =
    data.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);

  return (
    <section className="mx-auto w-full max-w-2xl px-5 py-8">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        GitHub
      </h2>

      <div className="no-scrollbar overflow-x-auto pb-1">
        <div className="flex gap-[4px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[4px]">
              {week.map((day, di) => (
                <span
                  key={di}
                  title={day ? `${day.count} contribution(s) on ${day.date}` : ''}
                  className="h-[14px] w-[14px] rounded-[3px]"
                  style={{
                    backgroundColor: day ? LEVEL_COLOR[day.level] : 'transparent',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--muted-foreground)]">
        {total} contributions in the last year
      </p>
    </section>
  );
}
