import { Link } from '../lib/router';
import { assetUrl } from '../lib/paths';
import { site } from '../content';
import { Icon } from '../components/Icon';
import { Directions, JoinBanner, SectionTitle } from '../components/UI';
export default function About() { return <>
  <section className="section about-intro"><div className="container about-grid"><div><span className="eyebrow">ABOUT THE ASSOCIATION</span><h1>一群热爱技术的人，<br/><span className="blue-text">一起把想法变成现实。</span></h1><p className="intro-lead">{site.name}<br/>一个面向学生的技术实践与分享空间。</p><p>从单片机、物联网到边缘智能，我们关注的不只是代码能不能运行，更是为什么这样设计、怎样验证，以及如何把经验分享给别人。</p><Link to="/join" className="button button--primary">从这里开始<Icon name="arrow" size={17}/></Link></div><figure className="about-photo"><img src={assetUrl('/images/lab-scene.webp')} alt="电子实验工作台概念场景，非协会实拍"/><figcaption><span className="photo-caption">场景示意 · 非协会实拍</span><strong>MAKE IDEAS<br/><span>REAL.</span></strong></figcaption></figure></div></section>
  <section className="section section--white"><div className="container"><SectionTitle eyebrow="WHAT WE EXPLORE" title="我们探索什么" description="软硬件不必分开理解。把每个环节接起来，才是完整的工程。"/><Directions/></div></section>
  <section className="section"><div className="container"><SectionTitle centered eyebrow="THE WAY WE BUILD" title="技术之外，我们同样在意这些。"/><div className="principle-grid">{[{ icon:'circuit', num:'01', title:'动手，让知识落地', text:'从小任务开始。画一张图、焊一块板、解决一个问题，用实践检验理解。' },{ icon:'book', num:'02', title:'分享，让经验留下', text:'记录真正遇到的问题，而不只留下成功的截图。让每次探索都能被接着走下去。' },{ icon:'users', num:'03', title:'协作，让作品完整', text:'有人擅长硬件，有人擅长算法，也有人擅长把复杂的事情讲清楚。一起做出更完整的作品。' }].map(p => <article key={p.num}><div><Icon name={p.icon} size={31}/><span>{p.num}</span></div><h3>{p.title}</h3><p>{p.text}</p></article>)}</div></div></section><JoinBanner/>
</>; }
