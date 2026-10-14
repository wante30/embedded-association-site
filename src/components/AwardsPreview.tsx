import { awards } from '../content';
import { Link } from '../lib/router';
import { Icon } from './Icon';

export function AwardsPreview() {
  const published = awards.filter(award => !award.example);
  const featured = published.slice(0, 3);
  return <section className="section awards-preview" aria-labelledby="award-preview-heading">
    <div className="container">
      <div className="awards-preview__heading" data-reveal>
        <div>
          <span className="eyebrow">COMPETITION RECOGNITION</span>
          <h2 id="award-preview-heading">竞赛荣誉</h2>
          <p>已公开 {published.length} 项竞赛记录，其中 {published.filter(award => award.level === '国家级').length} 项国家级记录。</p>
        </div>
        <Link to="/awards" className="button button--outline">查看全部荣誉<Icon name="arrow" size={18}/></Link>
      </div>
      <div className="awards-preview__grid">
        {featured.map(award => <article className="award-preview-card" data-reveal key={award.id}>
          <div className="award-preview-card__meta"><span>{award.year} · {award.level}</span><Icon name="trophy" size={20}/></div>
          <h3>{award.award}</h3>
          <p>{award.name}</p>
          <p className="award-preview-card__team">参赛成员：{award.team}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
