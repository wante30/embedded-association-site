import { awards, Award } from './data';
import { Container, LevelBadge, PageHero, Reveal } from './components';

// Group awards by year, newest first
const byYear = awards.reduce((acc, a) => {
  (acc[a.year] = acc[a.year] || []).push(a);
  return acc;
}, {} as Record<string, Award[]>);
const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

export function Awards() {
  return (
    <>
      <PageHero
        k="Awards / 03"
        t={<>把每一次参赛，<br />变成下一次出发。</>}
        d="奖项是结果，不是全部。我们更在意在备赛、调试和复盘中留下的能力。"
      />
      <section className="py-20 lg:py-24">
        <Container>
          <div className="max-w-[1000px]">
            {years.map((year, yi) => (
              <Reveal
                key={year}
                className={`relative grid gap-0 md:grid-cols-[120px_1fr] ${
                  yi === 0 ? '' : 'mt-4'
                }`}
              >
                {/* Year label */}
                <div className="md:sticky md:top-24 md:self-start">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-semibold text-blue md:text-4xl">
                      {year}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-faint)]">
                      / {byYear[year].length} 项
                    </span>
                  </div>
                </div>

                {/* Awards for this year */}
                <div className="relative border-l border-[var(--border)] pl-6 md:pl-8">
                  {byYear[year].map((a, i) => (
                    <Reveal
                      key={a.title + i}
                      delay={i * 60}
                      className="relative py-5 last:pb-0"
                    >
                      <span className="absolute -left-[7px] top-7 h-3 w-3 rounded-full border-2 border-blue bg-[var(--bg)]" />
                      <div className="flex flex-wrap items-center gap-3">
                        <LevelBadge level={a.level} />
                        <span className="font-mono text-[10px] text-[var(--text-faint)]">
                          {a.date}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-[var(--text)]">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-6 text-[var(--text-muted)]">
                        {a.project} · {a.people}
                      </p>
                    </Reveal>
                  ))}
                  {yi < years.length - 1 && (
                    <span className="block h-8" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
