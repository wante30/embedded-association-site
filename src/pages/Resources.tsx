import { useState } from 'react';
import { site, resources, learningPaths, fpgaLearningPaths } from '../content';
import { Icon } from '../components/Icon';
import { EmptyState, FilterTabs, SearchField } from '../components/UI';

const categories = ['全部', 'FPGA', '单片机', '嵌入式', '物联网', '人工智能', '开发工具'];

function LearningRoute({ title, description, label, steps }: {
  title: string;
  description: string;
  label: string;
  steps: { title: string; topics: string }[];
}) {
  return <section className="learning-route">
    <h2>{title}</h2>
    <p>{description}</p>
    <ol className="learning-path" aria-label={label}>
      {steps.map((step, index) => <li key={step.title}>
        <span>0{index + 1}</span>
        <div><strong>{step.title}</strong><p>{step.topics}</p></div>
      </li>)}
    </ol>
  </section>;
}

export default function Resources() {
  const requested = new URLSearchParams(window.location.search).get('category') || '全部';
  const [category, setCategory] = useState(categories.includes(requested) ? requested : '全部');
  const [query, setQuery] = useState('');
  const list = resources.filter(resource =>
    (category === '全部' || resource.category === category) &&
    `${resource.name} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const reset = () => { setCategory('全部'); setQuery(''); };

  return <div className="page-dark resources-page">
    <section className="collection-header">
      <div className="container">
        <div className="resource-heading">
          <div>
            <span className="eyebrow">START SMALL. KEEP BUILDING.</span>
            <h1>学习资源</h1>
            <p>{site.audience}</p>
          </div>
          <div className="resource-stack" aria-hidden="true"><span/><span/><span><Icon name="book" size={49}/></span></div>
        </div>
        <p className="learning-intro">按基础与兴趣选择路线，从小练习开始，逐步进入系统与项目实践。</p>
        <div className="learning-routes">
          <LearningRoute title="数字电路 / FPGA" description="从逻辑设计到 RTL、仿真验证与板级调试。" label="FPGA 学习路线" steps={fpgaLearningPaths}/>
          <LearningRoute title="单片机 / 嵌入式" description="从常用外设到实时系统、通信与项目联调。" label="单片机与嵌入式学习路线" steps={learningPaths}/>
        </div>
        <div className="collection-toolbar">
          <FilterTabs items={categories} value={category} onChange={setCategory}/>
          <SearchField value={query} onChange={setQuery} placeholder="搜索学习资源…"/>
        </div>
      </div>
    </section>
    <section className="collection-results">
      <div className="container">
        <p className="results-count" aria-live="polite">{list.length} 项学习资源</p>
        {list.length ? <div className="resource-grid">
          {list.map(resource => <a key={resource.id} className="resource-card" href={resource.url} target="_blank" rel="noopener noreferrer">
            <div className="resource-card__top">
              <span className="resource-icon"><Icon name={resource.category === 'FPGA' ? 'circuit' : resource.category === '人工智能' ? 'spark' : resource.category === '物联网' ? 'wifi' : resource.category === '开发工具' ? 'layers' : 'cpu'}/></span>
              <Icon name="external" size={17}/>
            </div>
            <h2>{resource.name}</h2>
            <p>{resource.description}</p>
            <div className="resource-card__bottom"><span className="tag">{resource.level}</span><span>{resource.publisher}</span></div>
          </a>)}
        </div> : <EmptyState reset={reset}/>}
        <p className="quiet-note">FPGA 工具与文档应按开发板的厂商、器件系列和工具版本选择。</p>
        <p className="quiet-note">协会自编网页教程与清理后的 PDF 下载版会逐步开放；当前先提供学习路线、官方文档与工具入口。</p>
      </div>
    </section>
  </div>;
}