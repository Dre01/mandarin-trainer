import { curriculum } from '../domain/curriculum';
import type { LearnerState } from '../domain/types';
import { ProgressBar } from './ProgressBar';

function rate(ids: string[], states: LearnerState['lexemes'], statuses: string[]) {
  if (!ids.length) return 0;
  return ids.filter((id) => statuses.includes(states[id]?.production ?? 'new')).length / ids.length * 100;
}

export function Dashboard({ state, onNewSession }: { state: LearnerState; onNewSession: () => void }) {
  const coreA = curriculum.lexemes.filter((x) => x.priority === 'core_a').map((x) => x.id);
  const coreB = curriculum.lexemes.filter((x) => x.priority === 'core_b').map((x) => x.id);
  const constructions = curriculum.constructions.map((x) => x.id);
  const activeConstructions = constructions.filter((id) => ['active', 'automatic'].includes(state.constructions[id]?.production ?? 'new')).length;
  const automaticLexemes = Object.values(state.lexemes).filter((x) => x.production === 'automatic').length;
  const activeLexemes = Object.values(state.lexemes).filter((x) => ['active', 'automatic'].includes(x.production)).length;

  return (
    <section className="stack-xl">
      <div className="hero-card">
        <div>
          <span className="eyebrow">BAND 1 · CONTROL</span>
          <h1>{state.calibrationCompleted ? 'Make the core language reflexive.' : 'Start from what you already know.'}</h1>
          <p>{state.calibrationCompleted
            ? 'Progress is based on retrieval evidence, not time spent or lesson completion.'
            : 'The first voice session is a cold spoken calibration. It samples existing knowledge so the curriculum does not waste time reteaching easy material.'}</p>
        </div>
        <button className="primary" onClick={onNewSession}>{state.calibrationCompleted ? 'Generate next session' : 'Run baseline calibration'}</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><span>Automatic lexemes</span><strong>{automaticLexemes}</strong><small>of 275</small></div>
        <div className="stat-card"><span>Active or better</span><strong>{activeLexemes}</strong><small>lexemes</small></div>
        <div className="stat-card"><span>Constructions active</span><strong>{activeConstructions}</strong><small>of 60</small></div>
        <div className="stat-card"><span>Sessions completed</span><strong>{state.completedSessionIds.length}</strong><small>evidence-bearing</small></div>
      </div>

      <div className="panel stack-lg">
        <h2>Graduation-critical progress</h2>
        <ProgressBar value={rate(coreA, state.lexemes, ['automatic'])} label="Core-A automatic" />
        <ProgressBar value={rate(coreB, state.lexemes, ['active', 'automatic'])} label="Core-B active or automatic" />
        <ProgressBar value={constructions.length ? activeConstructions / constructions.length * 100 : 0} label="Constructions active or automatic" />
      </div>

      <div className="panel">
        <h2>Current evidence</h2>
        {state.evidence.length ? (
          <div className="evidence-list">
            {state.evidence.slice(-8).reverse().map((e) => (
              <div className="evidence-row" key={e.id}>
                <span className={e.correct ? 'dot good' : 'dot bad'} />
                <code>{e.targetId}</code>
                <span>{e.mode}</span>
                <small>{e.independent ? `independent · ${e.latency ?? 'timing n/a'}` : `hint ${e.hintLevel}`}</small>
              </div>
            ))}
          </div>
        ) : <p className="muted">No training evidence yet. Run the baseline calibration to begin.</p>}
      </div>
    </section>
  );
}
