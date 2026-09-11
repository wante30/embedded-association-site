import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { resources } from './data';
import { Container, PageHero, Reveal } from './components';

export function Resources() {
  const [active, setActive] = useState(0);
  const group = resources[active];

  return (
    <>
      <PageHero
        k="Resources / 06"
        t={<>给新成员的<br />一张路线图。</>}
        d="按兴趣选一条路径，先做出一个小东西，再去补齐背后的知识。"
      />
      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mono-label text-[var(--text-faint)]">分类</p>
              <nav className="mt-4 border-l border-[var(--border)]">
                {resources.map((g, i) => (
                  <button
                    key={g.cat}
                    onClick={() => setActive(i)}
                    className={`block w-full border-l-2 py-2.5 pl-4 text-left text-sm transition-colors ${
                      active === i
                        ? 'border-blue text-blue font-semibold'
                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                    style={{ marginLeft: '-1px' }}
                  >
                    <span className="font-mono text-[10px] text-[var(--text-faint)] mr-2">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {g.cat}
                  </button>
                ))}
              </nav>
              <div className="mt-8 border border-[var(--border)] bg-[var(--bg-elev)] p-4">
                <p className="mono-label text-[var(--text-faint)]">提示</p>
                <p className="mt-2 text-[12px] leading-6 text-[var(--text-muted)]">
                  资源会随每届成员更新。如果你有想推荐的内容，欢迎在 GitHub 提 PR。
                </p>
              </div>
            </aside>

            {/* Cards */}
            <div>
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-5">
                <h2 className="font-display text-2xl font-semibold text-[var(--text)] md:text-3xl">
                  {group.cat}
                </h2>
                <span className="mono-label text-[var(--text-faint)]">{group.en}</span>
                <span className="h-px flex-1 bg-[var(--border)]" />
                <span className="font-mono text-[10px] text-[var(--text-faint)]">
                  {group.items.length} 项
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {group.items.map((r, i) => (
                  <Reveal key={r.name} delay={i * 50} className="h-full">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="group flex h-full flex-col border border-[var(--border)] bg-[var(--bg-elev)] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-[var(--text)]">{r.name}</h3>
                        <ExternalLink
                          size={15}
                          className="shrink-0 text-[var(--text-faint)] transition-colors group-hover:text-blue"
                        />
                      </div>
                      <p className="mt-3 text-[14px] leading-7 text-[var(--text-muted)]">
                        {r.desc}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                        <div className="flex flex-wrap gap-1.5">
                          {r.tags.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[10px] text-[var(--text-faint)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="mono-label border border-[var(--border)] px-2 py-1 text-[var(--text-muted)]">
                          {r.level}
                        </span>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
