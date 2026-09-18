import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, usePath } from '../lib/router';
import { site } from '../content';
import { Icon } from './Icon';
export const nav = [['/', '首页'], ['/about', '协会介绍'], ['/projects', '项目'], ['/awards', '竞赛荣誉'], ['/activities', '活动'], ['/members', '成员'], ['/resources', '学习资源'], ['/join', '加入我们']];
export function Brand() { return <Link to="/" className="brand" aria-label={`${site.name}，返回首页`}><span className="brand-symbol"><Icon name="cpu" size={27}/></span><span><strong>{site.name}</strong><small>{site.englishName}</small></span></Link>; }
function Header() {
  const path = usePath();
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('association-theme') === 'dark'; } catch { return false; } });
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('association-theme', dark ? 'dark' : 'light'); } catch { /* storage may be disabled */ } }, [dark]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previousOverflow; dialog.current?.close(); };
  }, [open]);
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);
  return <header className="site-header"><div className="container header-inner"><Brand/><nav className="desktop-nav" aria-label="主导航">{nav.map(([href, label]) => <Link to={href} key={href} aria-current={active(href) ? 'page' : undefined} className={active(href) ? 'active' : ''}>{label}</Link>)}</nav><div className="header-actions"><a className="icon-button github-link" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="网站 GitHub 仓库"><Icon name="github" size={19}/></a><button className="icon-button" onClick={() => setDark(!dark)} aria-label={dark ? '切换浅色模式' : '切换深色模式'} title={dark ? '浅色模式' : '深色模式'}><Icon name={dark ? 'sun' : 'moon'} size={20}/></button><button ref={menuButton} className="icon-button mobile-menu-toggle" onClick={() => setOpen(true)} aria-label="打开导航菜单" aria-expanded={open} aria-controls="mobile-navigation"><Icon name="menu" size={22}/></button></div></div><dialog ref={dialog} id="mobile-navigation" className="mobile-dialog" aria-label="网站导航" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}><div className="mobile-dialog__header"><span>网站导航</span><button className="icon-button" aria-label="关闭导航菜单" onClick={() => { setOpen(false); menuButton.current?.focus(); }}><Icon name="close"/></button></div><nav aria-label="移动端主导航">{nav.map(([href, label], i) => <Link to={href} key={href} onClick={() => setOpen(false)} className={active(href) ? 'active' : ''}><span><small>0{i + 1}</small>{label}</span><Icon name="diagonal" size={19}/></Link>)}</nav><p>从一行代码，到真实世界。</p></dialog></header>;
}
function Footer() { return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Brand/><p>技术 · 分享 · 协作 · 开源 · 探索</p><span>从一行代码，到真实世界。</span></div><div className="footer-links"><div><h3>探索协会</h3><Link to="/about">协会介绍</Link><Link to="/projects">项目展示</Link><Link to="/awards">竞赛荣誉</Link></div><div><h3>一起成长</h3><Link to="/activities">活动记录</Link><Link to="/resources">学习资源</Link><Link to="/join">加入我们</Link></div><div><h3>保持联系</h3><a href={site.github} target="_blank" rel="noopener noreferrer">GitHub <Icon name="external" size={13}/></a><span>{site.school}</span><span>{site.college}</span><span>{site.location} · {site.contact}</span></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.name}</span><span className="preview-indicator"><i/>{site.founded} · {site.location}</span><a href="#top">回到顶部 ↑</a></div><p className="content-disclaimer">协会资料、活动记录和竞赛成果持续更新；官网仅展示已确认适合公开的信息。</p></div></footer>; }
export function Layout({ children }: { children: ReactNode }) { return <><a className="skip-link" href="#main">跳转到正文</a><Header/>{children}<Footer/></>; }
