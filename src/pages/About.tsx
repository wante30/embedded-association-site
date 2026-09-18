import { Link } from '../lib/router';
import { site } from '../content';
import { Icon } from '../components/Icon';
import { Directions, JoinBanner, SectionTitle } from '../components/UI';
import { assetPath } from '../lib/assetPath.mjs';
export default function About() { return <>
  <section className="section about-intro"><div className="container about-grid"><div><span className="eyebrow">ABOUT THE ASSOCIATION</span><h1>从 2024 开始，<br/><span className="blue-text">把课堂之外的想法做出来。</span></h1><p className="intro-lead">{site.school} · {site.college}<br/>{site.name}</p><p>协会成立于 {site.founded} 年，主要实践空间位于 {site.location}，由 {site.advisor} 老师指导。我们围绕单片机、嵌入式、物联网、电子设计与边缘智能开展学习、培训、竞赛和项目实践。</p><Link to="/join" className="button button--primary">了解如何加入<Icon name="arrow" size={17}/></Link></div><figure className="about-photo"><img src={assetPath('/images/association-group-2024.webp', import.meta.env.BASE_URL || '/')} alt="单片机与嵌入式协会 2024 秋季培训合影"/><figcaption><span className="photo-caption">2024 秋 · 协会培训活动</span><strong>BUILD<br/><span>TOGETHER.</span></strong></figcaption></figure></div></section>
  <section className="section section--white"><div className="container"><SectionTitle eyebrow="WHAT WE EXPLORE" title="我们探索什么" description="软硬件不必分开理解。把每个环节接起来，才是完整的工程。"/><Directions/></div></section>
  <section className="section"><div className="container"><SectionTitle centered eyebrow="THE WAY WE BUILD" title="技术之外，我们同样在意这些。"/><div className="principle-grid">{[{ icon:'circuit', num:'01', title:'动手，让知识落地', text:'从小任务开始。画一张图、焊一块板、解决一个问题，用实践检验理解。' },{ icon:'book', num:'02', title:'分享，让经验留下', text:'把培训资料、调试过程和竞赛经验整理下来，让后来的人可以继续往前走。' },{ icon:'users', num:'03', title:'协作，让作品完整', text:'硬件、软件、算法与表达各有专长。一起做事，才能把系统真正接通。' }].map(p => <article key={p.num}><div><Icon name={p.icon} size={31}/><span>{p.num}</span></div><h3>{p.title}</h3><p>{p.text}</p></article>)}</div></div></section><JoinBanner/>
</>; }
