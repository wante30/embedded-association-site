import { site, projects, activities } from '../content';
import { Link } from '../lib/router';
import { Icon } from '../components/Icon';
import { ProjectArt } from '../components/Art';
import { ActivityCard } from '../components/Cards';
import { Directions, JoinBanner, SectionTitle } from '../components/UI';
import { assetPath } from '../lib/assetPath.mjs';
import { AwardsPreview } from '../components/AwardsPreview';
import '../styles/home.css';

export default function Home() {
  // Content order determines the featured project and its earlier work.
  const [featured, ...earlierProjects] = projects;
  const circuitSmall = assetPath('/images/hero-focus.webp', import.meta.env.BASE_URL || '/');
  const circuitLarge = assetPath('/images/hero-pcb.jpg', import.meta.env.BASE_URL || '/');
  return <>
    <section className="home-hero">
      <div className="container hero-content">
        <span className="hero-eyebrow"><i/>{site.school}<span>{site.college}</span></span>
        <h1>单片机与<br/><span>嵌入式协会</span></h1>
        <p className="hero-tagline">{site.tagline}</p>
        <p className="hero-description">{site.description}</p>
        <div className="hero-actions">
          <Link to={`/projects/${featured.id}`} className="button button--primary">查看{featured.shortName}<Icon name="arrow" size={18}/></Link>
          <Link to="/awards" className="button button--glass">竞赛荣誉<Icon name="trophy" size={17}/></Link>
        </div>
      </div>
      <div className="hero-visual">
        <picture className="hero-photo">
          <source media="(min-width: 768px), (min-resolution: 1.5dppx)" srcSet={circuitLarge}/>
          <img src={circuitSmall} alt="嵌入式电路板视觉背景" width={602} height={400} fetchPriority="high" decoding="async"/>
        </picture>
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
      <div className="home-projects__heading" data-reveal><span className="eyebrow">FEATURED PROJECT / {featured.period.split(' · ')[0]}</span><Link to="/projects" className="text-link">全部项目<Icon name="arrow" size={17}/></Link></div>
      <article className="featured-project" aria-labelledby="featured-project-heading">
        <div className="featured-project__heading" data-reveal>
          <span className="featured-status"><i/>{featured.status}</span>
          <h2 id="featured-project-heading"><span>{featured.shortName}</span><span>{featured.name.replace(`${featured.shortName}——`, '')}</span></h2>
        </div>
        <figure className="featured-project__visual">
          <ProjectArt kind={featured.art} image={featured.image} alt={featured.imageCaption || featured.name} example={featured.example}/>
          <figcaption>{featured.imageCaption}</figcaption>
        </figure>
        <div className="featured-project__content" data-reveal>
          <p>{featured.summary}</p>
          <ul className="featured-modules">{featured.architecture.map(item => <li key={item}><Icon name="check" size={15}/>{item}</li>)}</ul>
          <p className="featured-tech">{featured.tags.join(' / ')}</p>
          <Link to={`/projects/${featured.id}`} className="button button--primary">查看{featured.shortName}项目<Icon name="arrow" size={18}/></Link>
        </div>
      </article>
      <div className="project-continuity" data-reveal>
        <p>围绕老年健康与智慧养老方向持续演进</p>
        <div>{earlierProjects.map(project => <Link to={`/projects/${project.id}`} key={project.id} aria-label={project.name}><span>{project.shortName}</span><Icon name="arrow" size={18}/></Link>)}</div>
      </div>
    </div></section>

    <AwardsPreview showCertificates/>

    <section className="section home-directions"><div className="container">
      <SectionTitle eyebrow="LEARN BY BUILDING" title="找到你的实践方向。" description="从数字逻辑、HDL 到嵌入式系统，找到适合自己的实践入口。" to="/resources" action="学习路线"/>
      <Directions compact/>
    </div></section>

    <section className="section section--white home-activities"><div className="container">
      <SectionTitle eyebrow="ASSOCIATION JOURNAL" title="一起学习，留下真实记录。" description="技术培训、协会纳新与竞赛训练。" to="/activities" action="全部活动"/>
      <div className="activity-grid">{activities.map(activity => <ActivityCard key={activity.id} activity={activity}/>)}</div>
    </div></section>
    <JoinBanner/>
  </>;
}
