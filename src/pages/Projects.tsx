import { useState } from 'react';
import { projects } from '../content';
import { ProjectCard } from '../components/Cards';
import { EmptyState, FilterTabs, SearchField } from '../components/UI';
export default function Projects() {
  const [category, setCategory] = useState('全部');
  const [query, setQuery] = useState('');
  const list = projects.filter(p => (category === '全部' || p.category === category) && `${p.name} ${p.summary} ${p.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="page-dark collection-page"><section className="collection-header"><div className="container"><div className="page-heading"><div><span className="eyebrow">PROJECT SHOWCASE</span><h1>项目不是一张结果图，<br/><span>而是一段持续演进的过程。</span></h1><p>记录真实项目的技术路线、系统实现与阶段成果。</p></div><span className="page-index">01<span>PROJECTS</span></span></div><div className="collection-toolbar"><FilterTabs items={['全部','物联网']} value={category} onChange={setCategory}/><SearchField value={query} onChange={setQuery}/></div></div></section><section className="collection-results"><div className="container"><p className="results-count" aria-live="polite">{list.length} 个项目记录</p>{list.length ? <div className="project-grid">{list.map(p => <ProjectCard key={p.id} project={p}/>)}</div> : <EmptyState reset={() => {setCategory('全部');setQuery('');}}/>}</div></section><div className="collection-end container"><IconlessLine/><p>一个好项目，不止于能运行。<span>更在于可理解、可验证、可分享。</span></p><IconlessLine/></div></div>;
}
function IconlessLine() { return <span className="end-line"/>; }
