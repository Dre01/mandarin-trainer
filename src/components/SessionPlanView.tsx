import {
  chunkById,
  closedSystemById,
  contrastById,
  functionById,
  learnerConstruction,
  learnerLexeme,
  pronunciationById,
  scenarioById,
} from '../domain/curriculum';
import type { SessionPayload } from '../domain/types';

function LexemeGroup({ title, ids }: { title: string; ids: string[] }) {
  const items = ids.map(learnerLexeme).filter(Boolean);
  return <div className="plan-group"><h3>{title}<span>{items.length}</span></h3>{items.length ? <div className="chip-grid">{items.map((x) => <div className="learn-card" key={x!.id}><strong>{x!.pinyin}</strong><span>{x!.meaning}</span></div>)}</div> : <p className="muted">None selected.</p>}</div>;
}

export function SessionPlanView({ payload, onStart, onRegenerate }: { payload: SessionPayload; onStart: () => void; onRegenerate: () => void }) {
  const constructions = [...payload.acquireConstructionIds, ...payload.strengthenConstructionIds].map(learnerConstruction).filter(Boolean);
  const contrast = payload.contrastSetIds.map((id) => contrastById.get(id)).filter(Boolean);
  const chunks = payload.chunkIds.map((id) => chunkById.get(id)).filter(Boolean);
  const closed = payload.closedSystemIds.map((id) => closedSystemById.get(id)).filter(Boolean);
  const pronunciation = payload.pronunciationTargetIds.map((id) => pronunciationById.get(id)).filter(Boolean);
  const fn = payload.functionId ? functionById.get(payload.functionId) : undefined;
  const scenario = payload.scenario ? scenarioById.get(payload.scenario.id) : undefined;

  if (payload.kind === 'calibration') {
    return (
      <section className="stack-xl">
        <div className="section-head"><div><span className="eyebrow">BASELINE</span><h1>Cold calibration</h1><p>The target list is intentionally hidden so the test does not prime your answers.</p></div><div className="button-row"><button className="secondary" onClick={onRegenerate}>Regenerate</button><button className="primary" onClick={onStart}>Start calibration</button></div></div>
        <div className="panel stack-lg">
          <h2>What it samples</h2>
          <p>Core spoken vocabulary, basic sentence machinery, conversation repair, simple numbers, tones, and clear listening. Unknown material is recorded and skipped rather than taught during calibration.</p>
          <div className="plan-meta-grid">
            <div><span>Script</span><strong>No target preview</strong></div>
            <div><span>Listening</span><strong>L{payload.listening.startLevel} → L{payload.listening.maxLevel}</strong></div>
            <div><span>Correction</span><strong>Diagnostic</strong></div>
            <div><span>Result</span><strong>Seeds learner state</strong></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stack-xl">
      <div className="section-head"><div><span className="eyebrow">NEXT PAYLOAD</span><h1>Session plan</h1><p>The curriculum chooses; Voice executes.</p></div><div className="button-row"><button className="secondary" onClick={onRegenerate}>Regenerate</button><button className="primary" onClick={onStart}>Start voice session</button></div></div>
      <div className="panel stack-xl">
        <LexemeGroup title="Acquire" ids={payload.acquireLexemeIds} />
        <LexemeGroup title="Strengthen" ids={payload.strengthenLexemeIds} />
        <LexemeGroup title="Maintain" ids={payload.maintainLexemeIds} />
        <div className="plan-group"><h3>Constructions<span>{constructions.length}</span></h3>{constructions.length ? <div className="construction-list">{constructions.map((x) => <div key={x!.id}><strong>{x!.pattern}</strong><span>{x!.meaning}</span></div>)}</div> : <p className="muted">Prerequisites are still being acquired.</p>}</div>
        <div className="plan-group"><h3>Automatic chunks<span>{chunks.length}</span></h3>{chunks.length ? <div className="chip-grid">{chunks.map((x) => <div className="learn-card" key={x!.id}><strong>{x!.pinyin}</strong><span>{x!.meaning}</span></div>)}</div> : <p className="muted">No chunk target this session.</p>}</div>
        <div className="plan-meta-grid">
          <div><span>Contrast</span><strong>{contrast[0]?.name ?? 'Not ready yet'}</strong></div>
          <div><span>Function</span><strong>{fn?.capability ?? 'Controlled retrieval'}</strong></div>
          <div><span>Scenario</span><strong>{scenario ? `${scenario.name} · ${payload.scenario?.variantLevel}` : 'Not ready yet'}</strong></div>
          <div><span>Listening</span><strong>L{payload.listening.startLevel} → L{payload.listening.maxLevel}</strong></div>
          <div><span>Closed system</span><strong>{closed[0]?.name ?? 'None'}</strong></div>
          <div><span>Pronunciation</span><strong>{pronunciation[0]?.competency ?? 'Integrated correction'}</strong></div>
        </div>
      </div>
    </section>
  );
}
