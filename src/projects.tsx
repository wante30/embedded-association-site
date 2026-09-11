import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Project, projects } from './data';
import { btn, Container, PageHero, Reveal, Tag } from './components';

/* ---------- Project card (image-dominant) ---------- */
export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link to={`/projects/${p.slug}`} className="group block">
      <div className="relative overflow-hidden bg-ink">
        <img
          loading="lazy"
          src={p.image}
          alt={p.name}
          className="aspect-video w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        <span className="absolute left-3 top-3 mono-label border border-white/20 bg-ink/60 px-2 py-1 text-sky backdrop-blur-sm">
          {p.status}
        </span>
      </div>
      <div className="pt-4">
        <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-faint)]">
          <span>{p.en}</span>
          <span className="text-blue">{p.year}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-[var(--text)]">
          {p.name}
        </h3>
        <p className="mt-2 text-[14px] leading-6 text-[var(--text-muted)]">{p.summary}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <ArrowUpRight size={17} className="text-blue transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

/* ---------- Projects list page ---------- */
export function Projects() {
  return (
    <>
      <PageHero
        k="Projects / 02"
        t={<>从原理图，<br />到现场。</>}
        d="记录协会成员正在做、已经做完，以及愿意继续打磨的项目。每一个都从一块板子、一行代码开始。"
      />
      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-x-7 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

/* ---------- Project detail page ---------- */
export function ProjectDetail({ p }: { p: Project }) {
  const sections: [string, string][] = [
    ['背景', p.background],
    ['目标', p.goal],
    ['系统架构', p.architecture],
    ['阶段成果', p.result],
  ];
  return (
    <>
      <PageHero k={p.en} t={p.name} d={p.summary}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="mono-label border border-white/20 px-2 py-1 text-sky">{p.status}</span>
          <span className="font-mono text-[11px] text-slate-400">{p.contest}</span>
          <span className="font-mono text-[11px] text-slate-400">{p.year}</span>
        </div>
      </PageHero>
      <section className="py-20 lg:py-24">
        <Container>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue transition-colors hover:text-azure"
          >
            <ArrowLeft size={15} /> 返回项目列表
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden border border-[var(--border)] bg-ink">
                <img src={p.image} alt={p.name} className="aspect-[4/3.4] w-full object-cover" />
              </div>
              <div className="mt-6 border border-[var(--border)] bg-[var(--bg-elev)] p-5">
                <p className="mono-label text-[var(--text-faint)]">负责人</p>
                <p className="mt-2 font-semibold text-[var(--text)]">{p.lead}</p>
                <div className="mt-5 border-t border-[var(--border)] pt-4">
                  <p className="mono-label text-[var(--text-faint)]">团队成员</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.members.map((m) => (
                      <span
                        key={m}
                        className="font-mono text-[11px] text-[var(--text-muted)]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 border-t border-[var(--border)] pt-4">
                  <p className="mono-label text-[var(--text-faint)]">技术栈</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <div>
              {sections.map(([t, d], i) => (
                <Reveal
                  key={t}
                  className="border-t border-[var(--border)] pt-6 first:border-t-0 first:pt-0"
                  delay={i * 60}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-blue">
                      0{i + 1}
                    </span>
                    <h2 className="font-display text-xl font-semibold text-[var(--text)]">
                      {t}
                    </h2>
                  </div>
                  <p className="mt-3 text-[15px] leading-8 text-[var(--text-muted)]">
                    {d}
                  </p>
                </Reveal>
              ))}

              <div className="mt-12 border-t border-[var(--border)] pt-8">
                <Link to="/projects" className={btn.outline}>
                  <ArrowLeft size={15} /> 查看其他项目
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
