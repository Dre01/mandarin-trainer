import type { LearnerState } from '../domain/types';

const KEY = 'mandarin-control.state.v1';

export function createInitialState(): LearnerState {
  const now = new Date().toISOString();
  return {
    version: 1,
    lexemes: {},
    constructions: {},
    chunks: {},
    contrasts: {},
    closedSystems: {},
    functions: {},
    pronunciation: {},
    evidence: [],
    completedSessionIds: [],
    calibrationCompleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

function migrate(parsed: Partial<LearnerState>): LearnerState {
  const base = createInitialState();
  return {
    ...base,
    ...parsed,
    version: 1,
    lexemes: parsed.lexemes ?? {},
    constructions: parsed.constructions ?? {},
    chunks: parsed.chunks ?? {},
    contrasts: parsed.contrasts ?? {},
    closedSystems: parsed.closedSystems ?? {},
    functions: parsed.functions ?? {},
    pronunciation: parsed.pronunciation ?? {},
    evidence: parsed.evidence ?? [],
    completedSessionIds: parsed.completedSessionIds ?? [],
    calibrationCompleted: parsed.calibrationCompleted ?? false,
  };
}

export function loadState(): LearnerState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<LearnerState>;
    if (parsed.version !== 1) return createInitialState();
    return migrate(parsed);
  } catch {
    return createInitialState();
  }
}

export function saveState(state: LearnerState) {
  localStorage.setItem(KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
}

export function exportState(state: LearnerState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mandarin-control-state-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importState(file: File): Promise<LearnerState> {
  const parsed = JSON.parse(await file.text()) as Partial<LearnerState>;
  if (parsed.version !== 1) throw new Error('Unsupported learner-state version.');
  return migrate(parsed);
}
