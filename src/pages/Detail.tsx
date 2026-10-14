import type { Project, Activity } from '../content';
import { projects } from '../content';
import { Link } from '../lib/router';
import { ProjectArt, ActivityArt } from '../components/Art';
import { ExampleNote, JoinBanner } from '../components/UI';
import { Icon } from '../components/Icon';
export function ProjectDetail({ project: p }: { project: Project }) {
  const relatedProjects = projects.filter(project => project.id !== p.id);

  return <>
    <section className="detail-head">
      <div className="container">
        <Link to="/projects" className="back-link">← 返回项目展示</Link>
        <span className="eyebrow">{p.kicker}</span>
        <h1>{p.name}</h1>
        <p>{p.summary}</p>
        <div className="tag-row">
          {p.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          {p.example && <span className="tag">概念示例</span>}
        </div>
      </div>
    </section>
    <section className="section">
      <div className="container detail-grid">
        <aside className="detail-visual">
          <ProjectArt kind={p.art} image={p.image} alt={p.imageCaption || p.name} example={p.example}/>
          {p.imageCaption && <p className="detail-caption">{p.imageCaption}</p>}
          <div className="detail-meta">
            <h2>项目档案</h2>
            <dl>
              <div><dt>方向</dt><dd>{p.category}</dd></div>
              <div><dt>阶段</dt><dd>{p.status}</dd></div>
              <div><dt>时间 / 来源</dt><dd>{p.period}</dd></div>
              <div><dt>团队</dt><dd>{p.team}</dd></div>
            </dl>
          </div>
        </aside>
        <div className="detail-content">
          {p.example && <ExampleNote>本页为项目结构示例，未声明真实实验结果。</ExampleNote>}
          <section data-reveal>
            <span className="eyebrow">01 / CONTEXT</span>
            <h2>从什么问题出发</h2>
            <p>{p.background}</p>
          </section>
          <section data-reveal>
            <span className="eyebrow">02 / APPROACH</span>
            <h2>希望实现什么</h2>
            <p>{p.goal}</p>
          </section>
          <section data-reveal>
            <span className="eyebrow">03 / SYSTEM</span>
            <h2>让每个环节协同运行</h2>
            <ul className="system-flow">
              {p.architecture.map((module, index) => <li key={module}>
                <small aria-hidden="true">{String(index + 1).padStart(2, '0')}</small>
                <span>{module}</span>
              </li>)}
            </ul>
          </section>
          <section data-reveal>
            <span className="eyebrow">04 / RECORD</span>
            <h2>阶段成果与验证记录</h2>
            <p>{p.result}</p>
          </section>
          {relatedProjects.length > 0 && <section className="related-projects" data-reveal>
            <span className="eyebrow">05 / RELATED PROJECTS</span>
            <h2>相关项目</h2>
            <p>围绕老年健康与智慧养老方向持续演进。</p>
            <ul className="related-project-list">
              {relatedProjects.map(project => <li key={project.id}>
                <Link to={`/projects/${project.id}`} className="related-project-link">
                  <div><span>{project.period}</span><strong>{project.name}</strong></div>
                  <Icon name="arrow" size={18}/>
                </Link>
              </li>)}
            </ul>
          </section>}
        </div>
      </div>
    </section>
    <JoinBanner/>
  </>;
}
export function ActivityDetail({ activity: a }: { activity: Activity }) { return <><section className="detail-head"><div className="container"><Link to="/activities" className="back-link">← 返回活动记录</Link><span className="eyebrow">{a.category} / {a.duration}</span><h1>{a.title}</h1><p>{a.summary}</p></div></section><section className="section"><article className="container article-content"><ActivityArt kind={a.art} image={a.image} alt={a.title} example={a.example}/>{a.example && <ExampleNote>本页为活动档案示例，时间、地点、照片与报道须核实后补充。</ExampleNote>}<h2>活动记录</h2><p>{a.body}</p><h2>主要内容</h2><ol className="article-outline">{a.outline.map((x,i) => <li key={x}><span>0{i+1}</span>{x}</li>)}</ol><Link to="/activities" className="button button--outline">探索其他活动<Icon name="arrow" size={17}/></Link></article></section></>; }
export function NotFound() { return <section className="not-found container"><span>404</span><h1>这条线路，还没有接通。</h1><p>页面可能已移动，或者这个地址还没有对应的内容。</p><Link to="/" className="button button--primary">回到首页<Icon name="arrow" size={18}/></Link></section>; }
