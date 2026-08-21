import { useMemo, useState } from 'react';
import { CurriculumView } from './components/CurriculumView';
import { Dashboard } from './components/Dashboard';
import { SessionPlanView } from './components/SessionPlanView';
import { SettingsView } from './components/SettingsView';
import { VoiceSessionView } from './components/VoiceSessionView';
import { generateSessionPayload } from './session/selectSession';
import { useLearnerState } from './state/useLearnerState';
import type { SessionPayload } from './domain/types';

type Screen = 'dashboard' | 'curriculum' | 'session' | 'voice' | 'settings';

export default function App() {
  const { state, actions } = useLearnerState();
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [payload, setPayload] = useState<SessionPayload | null>(null);

  const navigation = useMemo(() => [
    ['dashboard', 'Overview'], ['curriculum', 'Curriculum'], ['session', 'Next session'], ['settings', 'Settings'],
  ] as const, []);

  function newSession() {
    const next = generateSessionPayload(state);
    setPayload(next);
    setScreen('session');
  }

  function startVoice() {
    if (!payload) return;
    actions.startSession(payload.id);
    setScreen('voice');
  }

  function completeVoice() {
    if (payload) actions.completeSession(payload.id, payload.kind);
    setPayload(null);
    setScreen('dashboard');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span>MC</span><div><strong>Mandarin Control</strong><small>spoken-first curriculum</small></div></div>
        <nav>{navigation.map(([id, label]) => <button key={id} className={screen === id ? 'active' : ''} onClick={() => id === 'session' && !payload ? newSession() : setScreen(id)}>{label}</button>)}</nav>
        <div className="sidebar-bottom"><span>Band 1</span><strong>Control</strong></div>
      </aside>
      <main>
        {screen === 'dashboard' && <Dashboard state={state} onNewSession={newSession} />}
        {screen === 'curriculum' && <CurriculumView state={state} />}
        {screen === 'session' && payload && <SessionPlanView payload={payload} onStart={startVoice} onRegenerate={newSession} />}
        {screen === 'voice' && payload && <VoiceSessionView payload={payload} onEvidence={actions.recordEvidence} onComplete={completeVoice} />}
        {screen === 'settings' && <SettingsView state={state} onReplace={actions.replaceState} onReset={actions.reset} />}
      </main>
    </div>
  );
}
