import { useState } from 'react';
import { awards } from '../content';
import { Icon } from '../components/Icon';
import { EmptyState, FilterTabs, JoinBanner, SearchField } from '../components/UI';
import { CertificateThumbnail, CertificateViewer } from '../components/CertificateViewer';
import '../styles/certificates.css';

const levels = ['全部', '国家级', '赛区', '省级', '校级'];

export default function Awards() {
  const [level, setLevel] = useState('全部');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<(typeof awards)[number] | null>(null);
  const list = awards.filter(award =>
    (level === '全部' || award.level === level) &&
    `${award.name} ${award.award} ${award.team}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const years = [...new Set(list.map(award => award.year))];
  const reset = () => { setLevel('全部'); setQuery(''); };

  return <>
    <section className="section awards-page">
      <div className="container">
        <div className="awards-heading">
          <div>
            <span className="eyebrow">MILESTONES & RECOGNITION</span>
            <h1>竞赛荣誉</h1>
            <p>记录已确认可公开的协会成员与团队竞赛成果。</p>
          </div>
          <div className="award-emblem" aria-hidden="true"><div/><Icon name="trophy" size={78}/><span>EFFORT BECOMES EXPERIENCE</span></div>
        </div>
        <div className="collection-toolbar">
          <FilterTabs items={levels} value={level} onChange={setLevel}/>
          <SearchField value={query} onChange={setQuery} placeholder="搜索赛事、奖项或成员…"/>
        </div>
        <p className="awards-count" aria-live="polite">{list.length} 项竞赛记录</p>
        {list.length ? <div className="awards-timeline">
          {years.map(year => <section className="timeline-year" key={year}>
            <div className="year-label"><strong>{year}</strong><small>竞赛记录</small></div>
            <div className="timeline-records">
              {list.filter(award => award.year === year).map(award => <article className="award-card" key={award.id}>
                <span className="timeline-dot"/>
                <div className="award-card__main">
                  <div className="award-card__labels"><span className="tag tag--blue">{award.level}</span><span>{award.sourceLabel}</span></div>
                  <h2>{award.name}</h2>
                  <p className="award-name">{award.award}</p>
                  <p>参赛成员：{award.team}</p>
                </div>
                <CertificateThumbnail certificate={award.certificate} title={`${award.name} · ${award.team}`} sourceLabel={award.sourceLabel} onOpen={() => setSelected(award)}/>
              </article>)}
            </div>
          </section>)}
        </div> : <EmptyState reset={reset}/>}
      </div>
    </section>
    {selected && <CertificateViewer certificate={selected.certificate} title={`${selected.name} · ${selected.award} · ${selected.team}`} sourceLabel={selected.sourceLabel} onClose={() => setSelected(null)}/>}
    <JoinBanner/>
  </>;
}
