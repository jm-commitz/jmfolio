import { GITHUB_USERNAME } from '@/lib/github';

type Day = { date: string; count: number; level: number };
type Result = { total: number; days: Day[] };

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// Official GitHub data (includes private + org contributions like the profile graph).
// No date range = GitHub's default rolling last-year view.
async function fromGraphQL(
  username: string,
  token: string,
): Promise<Result | null> {
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const cal =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;
    const days: Day[] = cal.weeks.flatMap(
      (w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: LEVEL_MAP[d.contributionLevel] ?? 0,
        })),
    );
    return { total: cal.totalContributions as number, days };
  } catch {
    return null;
  }
}

// Public fallback (public-repo contributions only) when no token is configured.
async function fromPublic(username: string): Promise<Result | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const days: Day[] = (data.contributions ?? []).map(
      (d: { date: string; count: number; level: number }) => ({
        date: d.date,
        count: d.count,
        level: d.level,
      }),
    );
    const total =
      data.total?.lastYear ?? days.reduce((s, d) => s + d.count, 0);
    return { total, days };
  } catch {
    return null;
  }
}

const LEVEL_COLOR = [
  'var(--border)',
  'color-mix(in srgb, var(--foreground) 28%, transparent)',
  'color-mix(in srgb, var(--foreground) 50%, transparent)',
  'color-mix(in srgb, var(--foreground) 74%, transparent)',
  'var(--foreground)',
];

export default async function GithubContributions() {
  const token = process.env.GITHUB_TOKEN;
  const data =
    (token ? await fromGraphQL(GITHUB_USERNAME, token) : null) ??
    (await fromPublic(GITHUB_USERNAME));

  if (!data || !data.days.length) return null;

  const days = data.days;
  const firstWeekday = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
  const cells: (Day | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...days,
  ];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

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
        {data.total} contributions in the last year
      </p>
    </section>
  );
}
