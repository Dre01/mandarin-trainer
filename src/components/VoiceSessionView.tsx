import { useEffect, useRef, useState } from 'react';
import type { EvidenceRecord, SessionPayload } from '../domain/types';
import { learnerChunk, learnerLexeme } from '../domain/curriculum';
import { createVoiceSession, type VoiceController } from '../voice/createVoiceSession';

export function VoiceSessionView({ payload, onEvidence, onComplete }: {
  payload: SessionPayload;
  onEvidence: (record: EvidenceRecord) => void;
  onComplete: () => void;
}) {
  const controller = useRef<VoiceController | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live' | 'error'>('idle');
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => controller.current?.close(), []);

  async function connect() {
    setStatus('connecting'); setError('');
    try {
      controller.current = await createVoiceSession(payload, onEvidence);
      setStatus('live');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  }

  function toggleMute() {
    const next = !muted;
    controller.current?.mute(next);
    setMuted(next);
  }

  function finish() {
    controller.current?.close();
    controller.current = null;
    onComplete();
  }

  const targets = payload.acquireLexemeIds.map(learnerLexeme).filter(Boolean);
  const chunks = payload.chunkIds.map(learnerChunk).filter(Boolean);
  const calibration = payload.kind === 'calibration';

  return (
    <section className="voice-shell">
      <div className="voice-card">
        <span className="eyebrow">{calibration ? 'BASELINE CALIBRATION' : 'VOICE TRAINING · BAND 1'}</span>
        <h1>{status === 'live' ? 'Speak.' : 'Ready when you are.'}</h1>
        <p className="muted">Raw speech transcripts are intentionally hidden. Learner-facing Mandarin remains pinyin-based.</p>

        <div className={`orb ${status === 'live' ? 'live' : ''}`} aria-hidden="true"><span /></div>

        {status === 'idle' && <button className="primary large" onClick={connect}>Connect microphone</button>}
        {status === 'connecting' && <button className="primary large" disabled>Connecting…</button>}
        {status === 'error' && <><p className="error">{error}</p><button className="primary" onClick={connect}>Try again</button></>}
        {status === 'live' && <div className="button-row center"><button className="secondary" onClick={toggleMute}>{muted ? 'Unmute' : 'Mute'}</button><button className="secondary" onClick={() => controller.current?.interrupt()}>Stop agent</button><button className="danger" onClick={finish}>{calibration ? 'End calibration' : 'End session'}</button></div>}

        {!calibration && <div className="target-strip"><span>Session targets</span>{targets.map((x) => <div key={x!.id}><strong>{x!.pinyin}</strong><small>{x!.meaning}</small></div>)}{chunks.map((x) => <div key={x!.id}><strong>{x!.pinyin}</strong><small>{x!.meaning}</small></div>)}</div>}
      </div>
    </section>
  );
}
