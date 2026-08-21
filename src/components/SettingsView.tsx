import { useRef } from 'react';
import type { LearnerState } from '../domain/types';
import { exportState, importState } from '../state/storage';

export function SettingsView({ state, onReplace, onReset }: { state: LearnerState; onReplace: (s: LearnerState) => void; onReset: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  return <section className="stack-lg"><div><span className="eyebrow">LOCAL-FIRST</span><h1>Settings</h1><p>Progress is stored in this browser. Export it periodically.</p></div><div className="panel stack-lg"><h2>Progress data</h2><div className="button-row"><button className="secondary" onClick={() => exportState(state)}>Export JSON</button><button className="secondary" onClick={() => input.current?.click()}>Import JSON</button><input ref={input} hidden type="file" accept="application/json" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; onReplace(await importState(file)); }} /><button className="danger" onClick={() => { if (confirm('Reset all learner progress?')) onReset(); }}>Reset progress</button></div></div><div className="panel"><h2>API boundary</h2><p>The browser requests a short-lived Realtime client secret from <code>/api/realtime-token</code>. The permanent OpenAI API key belongs only in the token server environment.</p></div></section>;
}
