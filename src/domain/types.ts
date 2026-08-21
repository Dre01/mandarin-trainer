export type ProductionStatus = 'new' | 'recognized' | 'active' | 'automatic';
export type ListeningStatus = 'unrecognized' | 'slow' | 'clear' | 'natural';
export type TargetType = 'lexeme' | 'construction' | 'chunk' | 'contrast' | 'function' | 'pronunciation' | 'closed_system';
export type SessionMode = 'acquire' | 'drill' | 'manipulate' | 'simulate' | 'converse' | 'listen' | 'test';
export type SessionKind = 'calibration' | 'training';
export type ListeningLevel = 1 | 2 | 3;

export interface Lexeme {
  id: string;
  pinyin: string;
  meaning_core: string;
  band_bucket: 'core' | 'wider';
  cluster: string;
  priority: 'core_a' | 'core_b' | 'wider_w1' | 'wider_w2';
  construction_ids: string[];
  function_ids: string[];
  scenario_ids: string[];
  contrast_set_ids: string[];
  learner_display?: { primary?: string; secondary?: string; show_hanzi?: boolean };
}

export interface Construction {
  id: string;
  number: number;
  pattern_pinyin: string;
  core_function: string;
  priority: 'a1' | 'a2' | 'b';
  earliest_cluster: string;
  required_lexeme_ids: string[];
  optional_lexeme_ids: string[];
  examples: Array<{ pinyin?: string; meaning?: string }>;
  contrast_set_ids: string[];
  function_ids: string[];
  scenario_ids: string[];
}

export interface FixedChunk {
  id: string;
  code?: string;
  type: string;
  pinyin: string;
  meaning: string;
  priority: string;
  component_lexeme_ids?: string[];
  function_ids: string[];
  scenario_ids: string[];
}

export interface ContrastSet {
  id: string;
  name: string;
  priority: string;
  member_lexeme_ids: string[];
  member_construction_ids: string[];
  goal: string;
  graduation_threshold: unknown;
}

export interface ClosedSystem {
  id: string;
  name: string;
  type: string;
  graduation_standard: string;
  elements?: Array<{ pinyin?: string; meaning?: string }>;
}

export interface FunctionItem {
  id: string;
  number: number;
  capability: string;
  construction_ids: string[];
  chunk_ids: string[];
  hard_gate: boolean;
  scenario_ids: string[];
}

export interface PronunciationTarget {
  id: string;
  code: string;
  competency: string;
  requirement: string;
  hard_gate: boolean;
}

export interface ScenarioVariant {
  level: string;
  name?: string;
  description?: string;
  complication?: string;
}

export interface Scenario {
  id: string;
  name: string;
  purpose: string;
  required_function_ids: string[];
  high_value_construction_ids: string[];
  high_value_lexeme_ids: string[];
  variants: ScenarioVariant[];
  success_definition: string;
}

export interface AssessmentModule {
  id: string;
  module: string;
  name: string;
  hard_gate: boolean;
  purpose: string;
}

export interface CurriculumBundle {
  manifest: Record<string, unknown>;
  lexemes: Lexeme[];
  constructions: Construction[];
  chunks: FixedChunk[];
  contrasts: ContrastSet[];
  closed_systems: ClosedSystem[];
  functions: FunctionItem[];
  pronunciation: PronunciationTarget[];
  scenarios: Scenario[];
  assessments: AssessmentModule[];
  session_protocol: Record<string, unknown>;
}

export interface EvidenceRecord {
  id: string;
  sessionId: string;
  timestamp: string;
  targetType: TargetType;
  targetId: string;
  mode: SessionMode;
  correct: boolean;
  independent: boolean;
  hintLevel: 0 | 1 | 2 | 3 | 4 | 5;
  listeningLevel?: ListeningLevel;
  contextId?: string;
  novelContext?: boolean;
  spontaneous?: boolean;
  latency?: 'immediate' | 'slight' | 'long';
  pronunciation?: 'blocked' | 'unclear' | 'acceptable' | 'good';
  note?: string;
}

export interface TargetState {
  production: ProductionStatus;
  listening: ListeningStatus;
  successes: number;
  failures: number;
  independentSuccesses: number;
  fastIndependentSuccesses: number;
  consecutiveFailures: number;
  sessionsSeen: string[];
  contextsSeen: string[];
  spontaneousSuccesses: number;
  lastSeenAt?: string;
  nextDueAt?: string;
}

export interface LearnerState {
  version: 1;
  lexemes: Record<string, TargetState>;
  constructions: Record<string, TargetState>;
  chunks: Record<string, TargetState>;
  contrasts: Record<string, TargetState>;
  closedSystems: Record<string, TargetState>;
  functions: Record<string, TargetState>;
  pronunciation: Record<string, TargetState>;
  evidence: EvidenceRecord[];
  completedSessionIds: string[];
  calibrationCompleted: boolean;
  activeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionPayload {
  id: string;
  kind: SessionKind;
  band: 1;
  generatedAt: string;
  acquireLexemeIds: string[];
  strengthenLexemeIds: string[];
  maintainLexemeIds: string[];
  acquireConstructionIds: string[];
  strengthenConstructionIds: string[];
  chunkIds: string[];
  contrastSetIds: string[];
  closedSystemIds: string[];
  pronunciationTargetIds: string[];
  functionId?: string;
  scenario?: { id: string; variantLevel: 'A' | 'B' | 'C' | 'D' };
  listening: { startLevel: ListeningLevel; maxLevel: ListeningLevel };
  correctionPolicy: 'near_total';
  pinyinPolicy: 'acquisition_only';
  modes: SessionMode[];
}
