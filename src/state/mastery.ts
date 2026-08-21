import type { EvidenceRecord, ListeningStatus, ProductionStatus, TargetState } from '../domain/types';

export function emptyTargetState(): TargetState {
  return {
    production: 'new',
    listening: 'unrecognized',
    successes: 0,
    failures: 0,
    independentSuccesses: 0,
    fastIndependentSuccesses: 0,
    consecutiveFailures: 0,
    sessionsSeen: [],
    contextsSeen: [],
    spontaneousSuccesses: 0,
  };
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function deriveProduction(state: TargetState): ProductionStatus {
  const sessionCount = state.sessionsSeen.length;
  const contextCount = state.contextsSeen.length;
  if (
    state.independentSuccesses >= 8 &&
    state.fastIndependentSuccesses >= 6 &&
    sessionCount >= 3 &&
    contextCount >= 2 &&
    state.spontaneousSuccesses >= 1
  ) return 'automatic';
  if (state.independentSuccesses >= 3 && sessionCount >= 2 && contextCount >= 2) return 'active';
  if (state.successes >= 2) return 'recognized';
  return 'new';
}

function deriveListening(current: ListeningStatus, evidence: EvidenceRecord): ListeningStatus {
  if (!evidence.correct || !evidence.listeningLevel) return current;
  if (evidence.listeningLevel >= 3) return 'natural';
  if (evidence.listeningLevel === 2 && current !== 'natural') return 'clear';
  if (evidence.listeningLevel === 1 && current === 'unrecognized') return 'slow';
  return current;
}

function demoteAfterFailure(derived: ProductionStatus, previous: ProductionStatus, failures: number): ProductionStatus {
  if (failures < 2) return derived;
  if (previous === 'automatic' && derived === 'automatic') return 'active';
  if (failures >= 3 && previous === 'active' && ['active', 'automatic'].includes(derived)) return 'recognized';
  return derived;
}

export function applyEvidenceToTarget(previous: TargetState | undefined, evidence: EvidenceRecord): TargetState {
  const state = previous ?? emptyTargetState();
  const fastIndependent = evidence.correct && evidence.independent && evidence.latency !== 'long';
  const consecutiveFailures = evidence.correct ? 0 : state.consecutiveFailures + 1;
  const next: TargetState = {
    ...state,
    successes: state.successes + (evidence.correct ? 1 : 0),
    failures: state.failures + (evidence.correct ? 0 : 1),
    independentSuccesses: state.independentSuccesses + (evidence.correct && evidence.independent ? 1 : 0),
    fastIndependentSuccesses: state.fastIndependentSuccesses + (fastIndependent ? 1 : 0),
    consecutiveFailures,
    spontaneousSuccesses: state.spontaneousSuccesses + (evidence.correct && evidence.spontaneous ? 1 : 0),
    sessionsSeen: unique([...state.sessionsSeen, evidence.sessionId]),
    contextsSeen: evidence.contextId ? unique([...state.contextsSeen, evidence.contextId]) : state.contextsSeen,
    lastSeenAt: evidence.timestamp,
    listening: deriveListening(state.listening, evidence),
  };
  next.production = demoteAfterFailure(deriveProduction(next), state.production, consecutiveFailures);
  return next;
}
