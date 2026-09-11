import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { joinLearn, joinReasons, joinSteps, siteConfig } from './data';
import { btn, Container, Eyebrow, PageHero, Reveal, SectionHeading } from './components';

export function Join() {
  return (
    <>
      <PageHero
        k="Join us / 07"
        t={
          <>
            和我们一起，把想法做成
            <br />
            <span className="text-sky">真正运行的系统。</span>
          </>
        }
        d="不要求你已经会 STM32，也不要求你有漂亮的项目经历。只要愿意动手、愿意把一件事做完。"
      />

      {/* Why join */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why join us"
            title={<>为什么加入我们</>}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {joinReasons.map((r, i) => (
              <Reveal
                key={r.num}
                className="border-t border-[var(--border)] pt-6"
                delay={i * 70}
              >
                <span className="font-mono text-[11px] text-blue">{r.num}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text)]">
                  {r.title}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-[var(--text-muted)]">
                  {r.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What you'll learn */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-sunken)] py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div>
              <Eyebrow>What you learn</Eyebrow>
              <h2 className="mt-5 font-display text-[28px] font-semibold leading-[1.15] tracking-tight-display md:text-[36px]">
                能学到什么
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-[var(--text-muted)]">
                从一颗 LED 到一个能跑的系统，每一步都有人带你走一遍。
              </p>
            </div>
            <ul className="space-y-0">
              {joinLearn.map((l, i) => (
                <Reveal
                  as="li"
                  key={i}
                  className="flex items-start gap-4 border-b border-[var(--border)] py-4 last:border-b-0"
                  delay={i * 50}
                >
                  <span className="led-pulse mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                  <span className="text-[15px] leading-7 text-[var(--text)]">{l}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Recruitment flow"
            title={<>招新流程</>}
            desc="从填表到加入，大约两周。我们不卡人数，只看是不是合适。"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {joinSteps.map((s, i) => (
              <Reveal
                key={s.num}
                className="relative border-t border-[var(--border)] pt-6"
                delay={i * 70}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-blue">{s.num}</span>
                  {i < joinSteps.length - 1 && (
                    <span className="font-mono text-[10px] text-[var(--text-faint)]">
                      →
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-[var(--text-muted)]">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32">
        <div className="absolute inset-0 grid-dark opacity-40" />
        <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue/15 blur-[100px]" />
        <Container className="relative text-center">
          <Eyebrow tone="dark">Ready to build</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight-display md:text-5xl">
            加入我们，<br />
            把想法做成<span className="text-sky">真正运行的系统。</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-7 text-slate-300">
            不需要你已经有项目，只需要你愿意把一件事做完。
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={siteConfig.recruitmentUrl || '#'} className={btn.primary}>
              立即报名 <ArrowUpRight size={16} />
            </a>
            <Link to="/projects" className={btn.outlineDark}>
              先看看项目
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
