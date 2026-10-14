import { site, projects, activities } from '../content';
import { Link } from '../lib/router';
import { Icon } from '../components/Icon';
import { ActivityCard } from '../components/Cards';
import { Directions, JoinBanner, SectionTitle } from '../components/UI';
import { assetPath } from '../lib/assetPath.mjs';
import { AwardsPreview } from '../components/AwardsPreview';
import '../styles/home.css';

export default function Home() {
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
          <Link to="/about" className="button button--primary">了解协会<Icon name="arrow" size={18}/></Link>
          <Link to="/resources" className="button button--glass">学习资源<Icon name="arrow" size={17}/></Link>
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

    <section className="section section--white home-activities"><div className="container">
      <SectionTitle eyebrow="ASSOCIATION JOURNAL" title="协会活动" description="技术培训、协会纳新与竞赛训练。" to="/activities" action="全部活动"/>
      <div className="activity-grid">{activities.map(activity => <ActivityCard key={activity.id} activity={activity}/>)}</div>
    </div></section>
    <section className="section home-directions"><div className="container">
      <SectionTitle eyebrow="LEARN BY BUILDING" title="学习与实践" description="从数字逻辑、HDL 到嵌入式系统，找到适合自己的实践入口。" to="/resources" action="学习路线"/>
      <Directions compact/>
    </div></section>
    <section className="section home-projects"><div className="container">
      <SectionTitle eyebrow="PROJECT PRACTICE" title="项目实践" description="围绕老年健康与智慧养老方向持续演进。" to="/projects" action="全部项目"/>
      <div className="home-project-list">{projects.map(project => <article className="home-project-row" data-reveal key={project.id}>
        <span className="home-project-row__period">{project.period.split(' · ')[0]}</span>
        <div><h3><Link to={`/projects/${project.id}`}>{project.name}<Icon name="arrow" size={18}/></Link></h3><p>{project.summary}</p></div>
      </article>)}</div>
    </div></section>
    <JoinBanner/>
    <AwardsPreview showCertificates/>
  </>;
}
