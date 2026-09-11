import { advisor, members } from './data';
import { Container, PageHero, Reveal } from './components';

export function Members() {
  return (
    <>
      <PageHero
        k="Members / 05"
        t={<>一起做事的人。</>}
        d="协会由不同年级、不同方向的同学组成。指导教师带队，学生在项目里慢慢把想法做成系统。"
      />
      <section className="py-20 lg:py-24">
        <Container>
          {/* Advisor — featured card */}
          <Reveal>
            <div className="grid gap-6 border border-[var(--border)] bg-[var(--bg-elev)] p-6 md:grid-cols-[auto_1fr] md:p-8 lg:p-10">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-blue/10 ring-1 ring-blue/20 md:h-28 md:w-28">
                <span className="font-display text-3xl font-semibold text-blue">
                  {advisor.avatar}
                </span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono-label text-blue">{advisor.role}</span>
                  <span className="font-mono text-[10px] text-[var(--text-faint)]">
                    ADVISOR
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-semibold text-[var(--text)] md:text-3xl">
                  {advisor.name}
                </h2>
                <p className="mt-2 font-mono text-[12px] text-[var(--text-muted)]">
                  {advisor.focus}
                </p>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--text-muted)]">
                  {advisor.bio}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Members grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m, i) => (
              <Reveal
                as="article"
                key={m.name}
                className="group border border-[var(--border)] bg-[var(--bg-elev)] p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                delay={i * 60}
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-blue/10 font-display text-xl font-semibold text-blue">
                  {m.avatar}
                </div>
                <div className="mt-6">
                  <span className="mono-label text-blue">{m.role}</span>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {m.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-[var(--text-faint)]">
                    {m.focus}
                  </p>
                </div>
                <p className="mt-5 border-t border-[var(--border)] pt-4 text-[13px] leading-6 text-[var(--text-muted)]">
                  {m.bio}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
