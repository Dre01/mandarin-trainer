import { useEffect, useMemo, useState } from 'react';
import type { EvidenceRecord, LearnerState, TargetState, TargetType } from '../domain/types';
import { applyEvidenceToTarget } from './mastery';
import { createInitialState, loadState, saveState } from './storage';

type StateBucketKey = keyof Pick<LearnerState, 'lexemes' | 'constructions' | 'chunks' | 'contrasts' | 'closedSystems' | 'functions' | 'pronunciation'>;

const pluralKey: Record<TargetType, StateBucketKey> = {
  lexeme: 'lexemes',
  construction: 'constructions',
  chunk: 'chunks',
  contrast: 'contrasts',
  closed_system: 'closedSystems',
  function: 'functions',
  pronunciation: 'pronunciation',
};

export function useLearnerState() {
  const [state, setState] = useState<LearnerState>(() => loadState());

  useEffect(() => saveState(state), [state]);

  const actions = useMemo(() => ({
    recordEvidence(evidence: EvidenceRecord) {
      setState((previous) => {
        const bucketName = pluralKey[evidence.targetType];
        const bucket = previous[bucketName] as Record<string, TargetState>;
        const updated = applyEvidenceToTarget(bucket[evidence.targetId], evidence);
        return {
          ...previous,
          [bucketName]: { ...bucket, [evidence.targetId]: updated },
          evidence: [...previous.evidence, evidence],
          updatedAt: new Date().toISOString(),
        };
      });
    },
    startSession(sessionId: string) {
      setState((previous) => ({ ...previous, activeSessionId: sessionId }));
    },
    completeSession(sessionId: string, kind: 'calibration' | 'training') {
      setState((previous) => ({
        ...previous,
        activeSessionId: undefined,
        calibrationCompleted: previous.calibrationCompleted || (kind === 'calibration' && previous.evidence.some((e) => e.sessionId === sessionId)),
        completedSessionIds: [...new Set([...previous.completedSessionIds, sessionId])],
      }));
    },
    replaceState(next: LearnerState) { setState(next); },
    reset() { setState(createInitialState()); },
  }), []);

  return { state, actions };
}
