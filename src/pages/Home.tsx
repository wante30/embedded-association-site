import { site, projects, activities } from '../content';
import { Link } from '../lib/router';
import { Icon } from '../components/Icon';
import { ProjectArt } from '../components/Art';
import { ActivityCard } from '../components/Cards';
import { Directions, JoinBanner, SectionTitle } from '../components/UI';
import { assetPath } from '../lib/assetPath.mjs';

export default function Home() {
  // Content order determines the featured project and its earlier work.
  const [featured, ...earlierProjects] = projects;
  return <>
    <section className="home-hero">
      <div className="container hero-content">
        <span className="hero-eyebrow"><i/>{site.school}<span>{site.college}</span></span>
        <h1>单片机与<br/><span>嵌入式协会</span></h1>
        <p className="hero-tagline">{site.tagline}</p>
        <p className="hero-description">{site.description}</p>
        <div className="hero-actions">
          <Link to="/projects" className="button button--primary">查看项目<Icon name="arrow" size={18}/></Link>
          <Link to="/about" className="button button--glass">了解协会<Icon name="diagonal" size={17}/></Link>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-photo" style={{ backgroundImage: `url(${assetPath('/images/hero-focus.webp', import.meta.env.BASE_URL || '/')})` }} role="img" aria-label="嵌入式电路板视觉背景"/>
        <div className="hero-vignette"/>
        <span className="hero-signature">BUILD. SHARE. GROW.</span>
      </div>
    </section>

    <section className="home-facts" aria-label="协会概览"><dl className="container">
      <div><dt>成立于</dt><dd>{site.founded}<small> 年</small></dd></div>
      <div><dt>实践空间</dt><dd>{site.location}</dd></div>
      <div><dt>指导教师</dt><dd>{site.advisor}</dd></div>
    </dl></section>

    <section className="section section--white home-projects"><div className="container">
      <SectionTitle eyebrow="FEATURED PROJECT" title="从想法到系统，持续实践。" to="/projects" action="全部项目"/>
      <article className="featured-project">
        <figure className="featured-project__visual">
          <ProjectArt kind={featured.art} image={featured.image} alt={featured.imageCaption || featured.name} example={featured.example}/>
          <figcaption>{featured.imageCaption}</figcaption>
        </figure>
        <div className="featured-project__content">
          <span className="featured-status"><i/>{featured.status}</span>
          <h3>{featured.name}</h3>
          <p>{featured.summary}</p>
          <ul className="featured-modules">{featured.architecture.map(item => <li key={item}><Icon name="check" size={15}/>{item}</li>)}</ul>
          <div className="tag-row">{featured.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
          <Link to={`/projects/${featured.id}`} className="button button--primary">查看慧枢项目<Icon name="arrow" size={18}/></Link>
        </div>
      </article>
      <div className="project-continuity">
        <p>围绕老年健康与智慧养老方向持续演进</p>
        <div>{earlierProjects.map(project => <Link to={`/projects/${project.id}`} key={project.id}><span>{project.name}</span><Icon name="arrow" size={18}/></Link>)}</div>
      </div>
    </div></section>

    <section className="section home-directions"><div className="container">
      <SectionTitle eyebrow="LEARN BY BUILDING" title="找到你的实践方向。" description="从一块开发板开始，把知识连成真正运行的系统。" to="/resources" action="学习路线"/>
      <Directions compact/>
    </div></section>

    <section className="section section--white home-activities"><div className="container">
      <SectionTitle eyebrow="ASSOCIATION JOURNAL" title="一起学习，留下真实记录。" description="技术培训、协会纳新与竞赛训练。" to="/activities" action="全部活动"/>
      <div className="activity-grid">{activities.map(activity => <ActivityCard key={activity.id} activity={activity}/>)}</div>
    </div></section>
    <JoinBanner/>
  </>;
}