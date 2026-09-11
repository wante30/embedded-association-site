import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Cpu } from 'lucide-react';
import {
  activities,
  awards,
  culture,
  directions,
  projects,
  siteConfig,
  stats,
} from './data';
import { btn, Container, Eyebrow, Reveal, SectionHeading, Tag } from './components';

/* ============================ HERO ============================ */
function HeroVisual() {
  return (
    <div className="relative ml-auto aspect-[4/3.4] w-full max-w-[520px]">
      <div className="absolute inset-0 border border-sky/30 bg-night/70 shadow-[0_30px_80px_rgba(0,0,0,.45)]">
        <img
          src="/images/hero-pcb.jpg"
          alt="嵌入式 PCB 特写"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink/85 via-ink/25 to-transparent" />

        {/* Corner mono labels */}
        <div className="absolute left-4 top-4 font-mono text-[10px] text-sky">VCC 3V3</div>
        <div className="absolute right-4 top-4 font-mono text-[10px] text-sky">CLK 8MHz</div>
        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-sky">GND</div>
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 font-mono text-[10px] text-copper">
          <span className="led-pulse h-1.5 w-1.5 rounded-full bg-copper" /> PWR
        </div>

        {/* Center crosshair */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative grid h-16 w-16 place-items-center rounded-full border border-sky/40">
            <Cpu size={26} strokeWidth={1.3} className="text-sky" />
            <span className="absolute inset-x-[-28px] top-1/2 h-px bg-sky/30" />
            <span className="absolute left-1/2 top-[-28px] h-[28px] w-px -translate-x-1/2 translate-y-[-100%] bg-sky/30" />
          </div>
        </div>

        {/* Spec sheet overlay */}
        <div className="absolute bottom-12 left-4 font-mono text-[10px] leading-relaxed text-slate-300">
          <div>CHIP &nbsp;: STM32H743</div>
          <div>ARCH : Cortex-M7</div>
          <div>CLK &nbsp;&nbsp;: 480 MHz</div>
        </div>
      </div>

      {/* Pin callout */}
      <div className="absolute -right-2 top-1/3 hidden xl:flex xl:items-center xl:gap-2 xl:font-mono xl:text-[10px] xl:text-sky">
        <span className="h-px w-8 bg-sky/60" />
        <span>GPIO 04</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 grid-dark opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,.14),transparent_55%)]" />

      <Container className="relative grid min-h-[calc(82vh-64px)] items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div className="enter">
          <Eyebrow tone="dark">Student embedded systems community</Eyebrow>
          <h1 className="mt-6 font-display text-[44px] font-semibold leading-[1.02] tracking-tight-display md:text-[72px]">
            把代码写进
            <br />
            <span className="text-sky">真实世界。</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 md:text-[17px]">
            {siteConfig.lead}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/projects" className={btn.primary}>
              浏览项目 <ArrowRight size={16} />
            </Link>
            <Link to="/join" className={btn.outlineDark}>
              加入我们 <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-1 px-2 py-3 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
            >
              了解协会
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] text-slate-500">
            <span>STM32</span><span className="text-slate-700">/</span>
            <span>ESP32</span><span className="text-slate-700">/</span>
            <span>EMBEDDED&nbsp;LINUX</span><span className="text-slate-700">/</span>
            <span>EDGE&nbsp;AI</span><span className="text-slate-700">/</span>
            <span>ROBOTICS</span>
          </div>
        </div>

        <div className="enter enter-delay-2 hidden lg:block">
          <HeroVisual />
        </div>
      </Container>

      {/* Status bar */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ink/50 backdrop-blur-sm">
        <Container className="flex items-center justify-between py-3 font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-2">
            <span className="led-pulse h-1.5 w-1.5 rounded-full bg-copper" />
            SYS.STATUS / ONLINE
          </span>
          <span className="hidden sm:inline">EST. 2018 · {siteConfig.school}</span>
          <span>v2.6.0</span>
        </Container>
      </div>
    </section>
  );
}

/* ============================ STATS ============================ */
function Stats() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-elev)]">
      <Container>
        <div className="grid grid-cols-2 divide-x divide-y divide-[var(--border)] md:grid-cols-4 md:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-5 py-8 lg:px-8 lg:py-10">
              <div className="font-mono text-[32px] font-medium tracking-tight text-[var(--text)] md:text-[40px]">
                {s.value}
              </div>
              <div className="mt-2 text-xs text-[var(--text-muted)]">{s.label}</div>
              <div className="mono-label mt-1 text-[var(--text-faint)]">{s.sub}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================ TECH DIRECTIONS ============================ */
function TechDirections() {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow>Technology directions / 01</Eyebrow>
            <h2 className="mt-5 max-w-md font-display text-[32px] font-semibold leading-[1.1] tracking-tight-display md:text-[40px]">
              每个方向，
              <br />
              <span className="text-blue">都从一件小事开始。</span>
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-7 text-[var(--text-muted)]">
              从点亮一颗灯、读懂一个传感器，到把模型部署在一块小板上。完整做过一次，比听过一百次更重要。
            </p>
          </div>
          <div className="grid grid-cols-1 border-l border-t border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {directions.map((d) => (
              <Reveal
                key={d.num}
                className="group border-b border-r border-[var(--border)] bg-[var(--bg-elev)] p-6 transition-colors hover:bg-blue/[0.03]"
                delay={Number(d.num) * 40}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-blue">{d.num}</span>
                  <span className="font-mono text-[10px] text-[var(--text-faint)]">{d.en}</span>
                </div>
                <h3 className="mt-8 text-[17px] font-semibold text-[var(--text)]">{d.name}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[var(--text-muted)]">{d.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.tags.map((t) => (
                    <span key={t} className="font-mono text-[10px] text-[var(--text-faint)]">
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================ FEATURED PROJECT ============================ */
function FeaturedProject() {
  const p = projects[0];
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-sunken)] py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Featured project / 02"
          title={
            <>
              把设备带回
              <br className="hidden md:block" />
              <span className="text-blue">生活现场。</span>
            </>
          }
          action={
            <Link to="/projects" className={btn.link}>
              全部项目 <ArrowUpRight size={15} className="inline" />
            </Link>
          }
        />
        <Reveal>
          <Link
            to={`/projects/${p.slug}`}
            className="group mt-12 grid overflow-hidden border border-[var(--border)] bg-[var(--bg-elev)] transition-shadow duration-300 hover:shadow-lg md:grid-cols-[1.2fr_.8fr]"
          >
            <div className="relative overflow-hidden bg-ink">
              <img
                loading="lazy"
                src={p.image}
                alt=""
                className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
              <span className="absolute left-4 top-4 mono-label border border-white/20 bg-ink/60 px-2 py-1 text-sky backdrop-blur-sm">
                {p.status}
              </span>
            </div>
            <div className="flex flex-col justify-between p-7 lg:p-10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="mono-label text-[var(--text-faint)]">{p.en}</span>
                  <span className="font-mono text-[11px] text-blue">{p.year}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold leading-tight md:text-[28px]">
                  {p.name}
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--text-muted)]">
                  {p.summary}
                </p>
              </div>
              <div className="mt-10 flex items-end justify-between">
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <ArrowUpRight className="text-blue" />
              </div>
            </div>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

/* ============================ RECENT ACTIVITIES ============================ */
function RecentActivities() {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Recent activities / 03"
          title={<>最近，我们在做什么</>}
          action={
            <Link to="/activities" className={btn.link}>
              查看全部活动 <ArrowUpRight size={15} className="inline" />
            </Link>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {activities.map((a, i) => (
            <Reveal as="article" key={a.title} className="group" delay={i * 80}>
              <div className="relative overflow-hidden bg-ink">
                <img
                  loading="lazy"
                  src={a.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <span className="absolute left-3 top-3 mono-label border border-white/20 bg-ink/60 px-2 py-1 text-sky backdrop-blur-sm">
                  {a.tag}
                </span>
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-faint)]">
                  <span>{a.dateLabel}</span>
                  <span>{a.date}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{a.title}</h3>
                <p className="mt-2 text-[14px] leading-6 text-[var(--text-muted)]">{a.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================ AWARDS PREVIEW ============================ */
function AwardsPreview() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
      <div className="absolute inset-0 grid-dark opacity-40" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr] lg:gap-16">
          <div>
            <Eyebrow tone="dark">Awards / 04</Eyebrow>
            <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.1] tracking-tight-display md:text-[40px]">
              成绩会过去，
              <br />
              <span className="text-sky">能力会留下。</span>
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-7 text-slate-400">
              奖项是结果，不是全部。我们更在意在备赛、调试和复盘中留下的能力。
            </p>
            <Link
              to="/awards"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky transition-colors hover:text-sky-soft"
            >
              查看完整荣誉 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative border-l border-white/15 pl-7 md:pl-10">
            {awards.slice(0, 3).map((a) => (
              <div
                key={a.title}
                className="relative grid gap-3 border-b border-white/12 py-6 last:border-b-0 md:grid-cols-[70px_1fr_auto] md:items-center"
              >
                <span className="absolute -left-[31px] top-7 h-2 w-2 rounded-full border border-sky bg-ink md:-left-[35px]" />
                <div className="font-mono text-sm text-sky">{a.year}</div>
                <div>
                  <h3 className="font-semibold text-white">{a.title}</h3>
                  <p className="mt-1 text-[13px] text-slate-400">
                    {a.project} · {a.people}
                  </p>
                </div>
                <span className="mono-label border border-white/20 px-2 py-1 text-slate-300">
                  {a.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================ CULTURE WALL ============================ */
function CultureWall() {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Association culture / 05"
          title={
            <>
              实验室、焊接台、<br className="hidden md:block" />
              <span className="text-blue">比赛现场。</span>
            </>
          }
          desc="技术不止发生在屏幕里。这些是协会真实的日常。"
        />
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {culture.map((c, i) => (
            <Reveal
              key={c.label}
              className={`group relative overflow-hidden bg-ink ${
                i === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''
              }`}
              delay={i * 60}
            >
              <img
                loading="lazy"
                src={c.image}
                alt={c.label}
                className={`w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 ${
                  i === 0 ? 'h-full min-h-[280px] md:min-h-[360px]' : 'aspect-square'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="led-pulse h-1.5 w-1.5 rounded-full bg-copper" />
                <div>
                  <div className="font-mono text-[10px] text-sky">{c.en}</div>
                  <div className="text-xs font-medium text-white">{c.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================ JOIN CTA ============================ */
function JoinCTA() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg-sunken)] py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--bg-elev)] px-6 py-14 md:px-14 md:py-16">
          <div className="absolute inset-0 grid-dots opacity-40" />
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue/10 blur-[80px]" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Eyebrow>Join the lab / 06</Eyebrow>
              <h2 className="mt-5 max-w-2xl font-display text-[28px] font-semibold leading-[1.15] tracking-tight-display md:text-[40px]">
                和我们一起，把想法做成
                <br className="hidden md:block" />
                <span className="text-blue">真正运行的系统。</span>
              </h2>
            </div>
            <Link to="/join" className={`${btn.primary} shrink-0`}>
              了解招新流程 <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================ HOME ============================ */
export function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <TechDirections />
      <FeaturedProject />
      <RecentActivities />
      <AwardsPreview />
      <CultureWall />
      <JoinCTA />
    </>
  );
}
