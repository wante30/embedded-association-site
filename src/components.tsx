import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Github, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { siteConfig } from './data';
import { Reveal, useScrolled, useTheme } from './lib';

export const NAV: [string, string][] = [
  ['/', '首页'],
  ['/about', '协会介绍'],
  ['/projects', '项目'],
  ['/awards', '竞赛荣誉'],
  ['/activities', '活动'],
  ['/members', '成员'],
  ['/resources', '学习资源'],
  ['/join', '加入我们'],
];

/* ---------- Layout primitives ---------- */
export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[1280px] px-5 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

/* ---------- Logo mark (chip top-view) ---------- */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative grid place-items-center bg-ink text-white"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none">
        <rect x="6" y="6" width="12" height="12" rx="1" stroke="#7dd3fc" strokeWidth="1.3" />
        <rect x="9.5" y="9.5" width="5" height="5" fill="#38bdf8" />
        <path
          d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"
          stroke="#e39a54"
          strokeWidth="1.4"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}

/* ---------- Eyebrow (mono spec-sheet label + power LED) ---------- */
export function Eyebrow({
  children,
  tone = 'light',
}: {
  children: React.ReactNode;
  tone?: 'light' | 'dark';
}) {
  const text = tone === 'dark' ? 'text-sky' : 'text-blue';
  return (
    <div className={`mono-label flex items-center gap-2.5 ${text}`}>
      <span className="led-pulse h-1.5 w-1.5 rounded-full bg-copper" />
      <span>{children}</span>
    </div>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  desc,
  action,
  tone = 'light',
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  action?: React.ReactNode;
  tone?: 'light' | 'dark';
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2
          className={`mt-5 max-w-2xl font-display text-[28px] font-semibold leading-[1.1] tracking-tight-display md:text-[40px] ${
            tone === 'dark' ? 'text-white' : ''
          }`}
        >
          {title}
        </h2>
        {desc && (
          <p
            className={`mt-4 max-w-xl text-[15px] leading-7 ${
              tone === 'dark' ? 'text-slate-300' : 'text-[var(--text-muted)]'
            }`}
          >
            {desc}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- Button class strings ---------- */
export const btn = {
  primary:
    'inline-flex items-center gap-2 bg-blue px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-azure hover:-translate-y-0.5',
  outline:
    'inline-flex items-center gap-2 border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition-all duration-200 hover:border-blue hover:text-blue hover:-translate-y-0.5',
  outlineDark:
    'inline-flex items-center gap-2 border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-sky hover:text-sky hover:-translate-y-0.5',
  ghost:
    'inline-flex items-center gap-1 px-2 py-3 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-blue',
  link: 'inline-flex items-center gap-1 text-sm font-semibold text-blue transition-colors hover:text-azure',
};

/* ---------- Tag chip ---------- */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1 font-mono text-[10px] tracking-wider text-[var(--text-muted)]">
      {children}
    </span>
  );
}

/* ---------- Award level badge ---------- */
export function LevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    '国家级': 'border-blue/40 bg-blue/10 text-blue',
    '省级': 'border-sky/40 bg-sky/10 text-sky',
    '校级': 'border-[var(--border)] bg-[var(--bg-elev)] text-[var(--text-muted)]',
  };
  return (
    <span className={`mono-label border px-2 py-1 ${styles[level] || styles['校级']}`}>
      {level}
    </span>
  );
}

/* ---------- Header ---------- */
export function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(8);
  const { dark, toggle } = useTheme();
  const loc = useLocation();

  const isActive = (h: string) =>
    h === '/' ? loc.pathname === '/' : loc.pathname.startsWith(h);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // When transparent (not scrolled, menu closed), header sits over the always-dark
  // hero — so text/icons must be light regardless of theme. When solid, use theme text.
  const onDark = !scrolled && !open;
  const logoName = onDark ? 'text-white' : 'text-[var(--text)]';
  const logoSub = onDark ? 'text-slate-400' : 'text-[var(--text-muted)]';
  const navInactive = onDark
    ? 'text-slate-300 hover:text-white'
    : 'text-[var(--text-muted)] hover:text-[var(--text)]';
  const iconBtn = onDark
    ? 'text-slate-300 hover:text-white'
    : 'text-[var(--text-muted)] hover:text-blue';
  const menuBtn = onDark ? 'text-white' : 'text-[var(--text)]';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-[var(--border)] bg-[color:var(--bg)]/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 lg:px-8">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
          <Logo />
          <span className="leading-tight">
            <b className={`block font-mono text-[11px] tracking-[.14em] ${logoName}`}>
              {siteConfig.englishName}
            </b>
            <small className={`block text-[10px] ${logoSub}`}>嵌入式技术协会</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV.map(([h, t]) => (
            <Link
              key={h}
              to={h}
              className={`relative px-3 py-2 text-[13px] font-medium transition-colors ${
                isActive(h) ? 'text-sky' : navInactive
              }`}
            >
              {t}
              <span
                className={`absolute inset-x-3 -bottom-[1px] h-px origin-left bg-sky transition-transform duration-300 ${
                  isActive(h) ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={siteConfig.github}
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
            className={`hidden p-2 transition-colors sm:block ${iconBtn}`}
          >
            <Github size={17} />
          </a>
          <button
            aria-label="切换深色模式"
            className={`p-2 transition-colors ${iconBtn}`}
            onClick={toggle}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            aria-label="打开菜单"
            className={`p-2 md:hidden ${menuBtn}`}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-[var(--border)] bg-[var(--bg-elev)] transition-[max-height,opacity] duration-300 md:hidden ${
          open ? 'max-h-[560px] opacity-100 border-t' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-5 py-2">
          {NAV.map(([h, t]) => (
            <Link
              key={h}
              to={h}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between border-b border-[var(--border)] py-3.5 text-sm last:border-b-0 ${
                isActive(h) ? 'text-blue' : 'text-[var(--text)]'
              }`}
            >
              <span>{t}</span>
              <ArrowUpRight size={14} className="text-[var(--text-faint)]" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-5 text-white lg:px-8">
      <div className="absolute inset-0 grid-dark opacity-50" />
      <div className="relative mx-auto max-w-[1280px] py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo />
              <span className="font-mono text-xs tracking-[.14em]">
                {siteConfig.englishName}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              {siteConfig.description}
              <br />
              {siteConfig.school} · 学生技术组织
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] text-slate-500">
              <span className="border border-white/15 px-2 py-1">STM32</span>
              <span className="border border-white/15 px-2 py-1">ESP32</span>
              <span className="border border-white/15 px-2 py-1">RTOS</span>
              <span className="border border-white/15 px-2 py-1">AIoT</span>
            </div>
          </div>

          <div>
            <p className="mono-label text-sky">导航</p>
            <div className="mt-4 grid grid-cols-2 gap-y-2.5">
              {NAV.slice(1, 7).map(([h, t]) => (
                <Link
                  key={h}
                  to={h}
                  className="text-sm text-slate-300 transition-colors hover:text-white"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mono-label text-sky">联系</p>
            <p className="mt-4 text-sm text-slate-300">{siteConfig.email}</p>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
            >
              <Github size={15} /> GitHub
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-5 font-mono text-[10px] text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>© 2026 {siteConfig.name} · 示例内容，上线前请替换</span>
          <span className="flex items-center gap-2">
            <span className="led-pulse h-1.5 w-1.5 rounded-full bg-copper" />
            SYS.STATUS / ONLINE · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Shell (Layout) ---------- */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}

/* ---------- Inner-page hero (always dark) ---------- */
export function PageHero({
  k,
  t,
  d,
  children,
}: {
  k: string;
  t: React.ReactNode;
  d: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 grid-dark opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/40 to-transparent" />
      <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue/10 blur-[120px]" />
      <Container className="relative py-20 lg:py-24">
        <div className="enter">
          <Eyebrow tone="dark">{k}</Eyebrow>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight-display md:text-6xl">
            {t}
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-8 text-slate-300 md:text-[17px]">
            {d}
          </p>
        </div>
        {children}
      </Container>
    </section>
  );
}

/* ---------- Reveal re-export for convenience ---------- */
export { Reveal };
