import { useMemo, useState } from 'react';
import { curriculum } from '../domain/curriculum';
import type { LearnerState } from '../domain/types';

export function CurriculumView({ state }: { state: LearnerState }) {
  const [query, setQuery] = useState('');
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return curriculum.lexemes.filter((x) => !q || x.pinyin.toLowerCase().includes(q) || x.meaning_core.toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="stack-lg">
      <div className="section-head">
        <div><span className="eyebrow">SOURCE OF TRUTH</span><h1>Band 1 curriculum</h1></div>
        <input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pinyin or English" />
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Pinyin</th><th>Meaning</th><th>Priority</th><th>Production</th><th>Listening</th></tr></thead>
          <tbody>
            {items.map((x) => {
              const s = state.lexemes[x.id];
              return <tr key={x.id}><td className="pinyin">{x.pinyin}</td><td>{x.meaning_core}</td><td><span className="pill">{x.priority.replace('_', '-')}</span></td><td>{s?.production ?? 'new'}</td><td>{s?.listening ?? 'unrecognized'}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
      <p className="muted small">Learner-facing curriculum intentionally omits Chinese characters. Internal character data remains in the bundle for disambiguation and API use.</p>
    </section>
  );
}
