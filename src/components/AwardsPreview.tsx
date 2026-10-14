import { awards } from '../content';
import { Link } from '../lib/router';
import { Icon } from './Icon';
import { assetPath } from '../lib/assetPath.mjs';

export function AwardsPreview({ showCertificates = false }: { showCertificates?: boolean }) {
  const published = awards.filter(award => !award.example);
  const featured = published.slice(0, 3);
  return <section className={`section awards-preview${showCertificates ? ' awards-preview--home' : ''}`} aria-labelledby="award-preview-heading">
    <div className="container">
      <div className="awards-preview__heading" data-reveal>
        <div>
          <span className="eyebrow">COMPETITION RECOGNITION</span>
          <h2 id="award-preview-heading">竞赛荣誉</h2>
          <p>已公开 {published.length} 项竞赛记录，其中 {published.filter(award => award.level === '国家级').length} 项国家级记录。</p>
        </div>
        <Link to="/awards" className="button button--outline">查看全部荣誉<Icon name="arrow" size={18}/></Link>
      </div>
      <div className="awards-preview__layout">
        {showCertificates && <Link to="/awards" className="home-certificate-preview" aria-label="查看荣誉证书墙" data-reveal>
          <span className="home-certificate-preview__images">{featured.map(award => <img key={award.id} src={assetPath(award.certificate.thumbnail, import.meta.env.BASE_URL || '/')} alt={`${award.name} · ${award.award} · ${award.team}`} width={award.certificate.width} height={award.certificate.height} loading="lazy" decoding="async"/>)}</span>
          <span>查看证书墙<Icon name="arrow" size={17}/></span>
        </Link>}
        <div className="awards-preview__grid">
        {featured.map(award => <article className="award-preview-card" data-reveal key={award.id}>
          <div className="award-preview-card__meta"><span>{award.year} · {award.level}</span><Icon name="trophy" size={20}/></div>
          <h3>{award.award}</h3>
          <p>{award.name}</p>
          <p className="award-preview-card__team">参赛成员：{award.team}</p>
        </article>)}
      </div>
      </div>
    </div>
  </section>;
}
