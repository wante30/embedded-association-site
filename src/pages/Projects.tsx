import { useState } from 'react';
import { projects } from '../content';
import { ProjectCard } from '../components/Cards';
import { EmptyState, ExampleNote, FilterTabs, SearchField } from '../components/UI';
export default function Projects() {
  const [category, setCategory] = useState('全部');
  const [query, setQuery] = useState('');
  const list = projects.filter(p => (category === '全部' || p.category === category) && `${p.name} ${p.summary} ${p.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="page-dark collection-page"><section className="collection-header"><div className="container"><div className="page-heading"><div><span className="eyebrow">PROJECT SHOWCASE</span><h1>每一个想法，<br/><span>都可以有一个实物答案。</span></h1><p>把代码、硬件与创意放在一起，看看会发生什么。</p></div><span className="page-index">01<span>PROJECTS</span></span></div><div className="collection-toolbar"><FilterTabs items={['全部','物联网','嵌入式','边缘 AI']} value={category} onChange={setCategory}/><SearchField value={query} onChange={setQuery}/></div></div></section><section className="collection-results"><div className="container"><p className="results-count" aria-live="polite">{list.length} 个项目示例</p>{list.length ? <div className="project-grid">{list.map(p => <ProjectCard key={p.id} project={p}/>)}</div> : <EmptyState reset={() => {setCategory('全部');setQuery('');}}/>}<ExampleNote/></div></section><div className="collection-end container"><IconlessLine/><p>一个好项目，不止于能运行。<span>更在于可理解、可验证、可分享。</span></p><IconlessLine/></div></div>;
}
function IconlessLine() { return <span className="end-line"/>; }
