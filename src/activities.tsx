import { activities } from './data';
import { Container, PageHero, Reveal } from './components';

export function Activities() {
  return (
    <>
      <PageHero
        k="Activities / 04"
        t={<>技术不只发生在<br />屏幕里。</>}
        d="培训、焊接、复盘和一次次把设备带到现场，构成了协会真实的日常。"
      />
      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((a, i) => (
              <Reveal
                as="article"
                key={a.title}
                className="group border border-[var(--border)] bg-[var(--bg-elev)] transition-shadow duration-300 hover:shadow-md"
                delay={i * 70}
              >
                <div className="relative overflow-hidden bg-ink">
                  <img
                    loading="lazy"
                    src={a.image}
                    alt={a.title}
                    className="aspect-[4/3] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <span className="absolute left-3 top-3 mono-label border border-white/20 bg-ink/60 px-2 py-1 text-sky backdrop-blur-sm">
                    {a.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-3">
                    <span className="font-mono text-2xl font-semibold text-blue">
                      {a.dateLabel}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-faint)]">
                      {a.date}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text)]">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-6 text-[var(--text-muted)]">
                    {a.summary}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
