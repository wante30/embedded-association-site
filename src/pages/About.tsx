import { Link } from '../lib/router';
import { site } from '../content';
import { Icon } from '../components/Icon';
import { Directions, JoinBanner, SectionTitle } from '../components/UI';
import { assetPath } from '../lib/assetPath.mjs';
import { AwardsPreview } from '../components/AwardsPreview';
export default function About() { return <>
  <section className="section about-intro"><div className="container about-grid"><div><span className="eyebrow">ABOUT THE ASSOCIATION</span><h1>从 2024 开始，<br/><span className="blue-text">把课堂之外的想法做出来。</span></h1><p className="intro-lead">{site.school} · {site.college}<br/>{site.name}</p><p className="about-audience">{site.audience}</p><p>协会成立于 {site.founded} 年，主要实践空间位于 {site.location}，由 {site.advisor} 老师指导。学习与实践围绕单片机、嵌入式系统、物联网、FPGA、EDA、计算机视觉与边缘计算展开，结合竞赛任务与真实项目，把专业基础做成可以运行的系统。</p><div className="about-actions"><Link to="/awards" className="button button--primary">查看竞赛荣誉<Icon name="trophy" size={17}/></Link><Link to="/join" className="button button--outline">了解如何加入<Icon name="arrow" size={17}/></Link></div></div><figure className="about-photo"><img src={assetPath('/images/association-group-2024.jpg', import.meta.env.BASE_URL || '/')} alt="单片机与嵌入式协会 2024 秋季培训合影"/><figcaption>2024 秋 · 协会培训合影</figcaption></figure></div></section>
  <AwardsPreview/>
  <section className="section section--white"><div className="container"><SectionTitle eyebrow="WHAT WE EXPLORE" title="我们探索什么" description="从单片机、FPGA 与 EDA，到物联网、计算机视觉与边缘计算，把专业知识接起来。"/><Directions/></div></section>
  <section className="section"><div className="container"><SectionTitle centered eyebrow="THE WAY WE BUILD" title="技术之外，我们同样在意这些。"/><div className="principle-grid">{[{ icon:'circuit', num:'01', title:'动手，让知识落地', text:'从小任务开始。画一张图、焊一块板、解决一个问题，用实践检验理解。' },{ icon:'book', num:'02', title:'分享，让经验留下', text:'把培训资料、调试过程和竞赛经验整理下来，让后来的人可以继续往前走。' },{ icon:'users', num:'03', title:'协作，让作品完整', text:'硬件、软件、算法与表达各有专长。一起做事，才能把系统真正接通。' }].map(p => <article data-reveal key={p.num}><div><Icon name={p.icon} size={31}/><span>{p.num}</span></div><h3>{p.title}</h3><p>{p.text}</p></article>)}</div></div></section><JoinBanner/>
</>; }
