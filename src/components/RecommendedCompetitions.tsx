import { useEffect } from 'react';
import { competitionRecommendations as recommendations } from '../content';
import { Icon } from './Icon';
import '../styles/competitions.css';

export function RecommendedCompetitions() {
  useEffect(() => {
    if (window.location.hash !== '#recommended-competitions') return;
    // The static entry has no section anchor until React mounts the content.
    const frame = window.requestAnimationFrame(() => document.getElementById('recommended-competitions')?.scrollIntoView({ behavior: 'instant' }));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return <section id="recommended-competitions" className="competition-recommendations" aria-labelledby="recommended-competitions-heading" data-reveal>
    <div className="competition-recommendations__heading"><h2 id="recommended-competitions-heading">推荐竞赛</h2><span>{recommendations.version} 版 · {recommendations.entries.length} 项</span></div>
    <p>{recommendations.description}</p>
    <p className="competition-recommendations__note">{recommendations.note}</p>
    <div className="competition-groups">{recommendations.groups.map(group => {
      const entries = recommendations.entries.filter(entry => entry.priority === group.id);
      return <details className="competition-group" key={group.id} open={group.id === 'S'}>
        <summary><h3><span>{group.id}</span>{group.title}</h3><span>{entries.length} 项<Icon name="chevron" size={17}/></span></summary>
        <p>{group.description}</p>
        <ul className="competition-list">{entries.map(entry => <li className="competition-item" key={entry.id}>
          <h4>{entry.name}</h4>
          <p className="competition-item__topics">{entry.topics}</p>
          <p className="competition-item__meta"><span>建议形式：{entry.format}</span><span>建议年级：{entry.years}</span></p>
          <p className="competition-item__purpose">{entry.purpose}</p>
        </li>)}</ul>
      </details>;
    })}</div>
    <p className="competition-recommendations__source">来源：{recommendations.sourceTitle}。{recommendations.advice}</p>
  </section>;
}
