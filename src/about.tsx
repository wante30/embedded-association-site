import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { stats } from './data';
import { btn, Container, Eyebrow, PageHero, Reveal, SectionHeading } from './components';

const principles = [
  { num: '01', title: '动手优先', desc: '能跑的代码胜过漂亮的 PPT。每个想法都要落到一块真实的板上。' },
  { num: '02', title: '完整做过一次', desc: '从 0 到 1 比从 1 到 100 更重要。先把一个项目跑通，再谈优化。' },
  { num: '03', title: '把失败讲出来', desc: '复盘不是走流程。把失误讲清楚，下次才有人能绕开同一个坑。' },
];

export function About() {
  return (
    <>
      <PageHero
        k="About / 01"
        t={<>一群愿意<br />把手弄脏的人。</>}
        d="协会是一个由学生发起、共同维护的技术社区。我们在实验室、宿舍和比赛现场学习工程，也学习如何和别人一起把事情做完。"
      />

      {/* Narrative */}
      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-5 font-display text-[28px] font-semibold leading-[1.15] tracking-tight-display md:text-[40px]">
                从底层代码，
                <br />
                <span className="text-blue">到完整作品。</span>
              </h2>
            </div>
            <div className="space-y-6 text-[15px] leading-8 text-[var(--text-muted)]">
              <p>
                我们相信，嵌入式不是某一门课，而是一条完整的链路：从看懂原理图、画一块
                PCB、把元器件焊起来，到写出可调试的固件、让多个模块稳定协作，再到把模型部署到边缘设备、把作品带去比赛现场。
              </p>
              <p>
                协会没有“老师讲、学生听”的课堂。每个方向都从一个可以摸到的硬件开始，做到能跑、能演示、能复盘。失败的尝试和成功的演示同样重要。
              </p>
              <p>
                我们也相信协作比天赋更重要。从设计、焊接到调试，分工和代码评审都是日常。你会习惯把想法讲清楚、把代码写明白，也会从队友的失败里学到自己没踩过的坑。
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="border-t border-[var(--border)] py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Principles" title={<>我们相信的事</>} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {principles.map((v, i) => (
              <Reveal
                key={v.num}
                className="border-t border-[var(--border)] pt-6"
                delay={i * 70}
              >
                <span className="font-mono text-[11px] text-blue">{v.num}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text)]">
                  {v.title}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-[var(--text-muted)]">
                  {v.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats + Join CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-sunken)] py-20 lg:py-24">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-y divide-[var(--border)] border border-[var(--border)] bg-[var(--bg-elev)] md:grid-cols-4 md:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="px-5 py-7 lg:px-8">
                <div className="font-mono text-[26px] font-medium text-[var(--text)] md:text-[32px]">
                  {s.value}
                </div>
                <div className="mt-2 text-xs text-[var(--text-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--text)] md:text-3xl">
                想和我们一起做事？
              </h2>
              <p className="mt-2 text-[15px] text-[var(--text-muted)]">
                每个学期我们都会招新，不限年级。
              </p>
            </div>
            <Link to="/join" className={btn.primary}>
              了解招新流程 <ArrowUpRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
