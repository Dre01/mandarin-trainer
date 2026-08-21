import { curriculum } from '../domain/curriculum';
import type { LearnerState, ListeningLevel, SessionPayload, TargetState } from '../domain/types';

const clusterRank: Record<string, number> = {
  core_control: 0,
  core_identity: 1,
  core_glue: 2,
  core_questions_space: 3,
  core_time: 4,
  core_actions: 5,
  core_measure: 6,
  core_everyday: 7,
  wider_grammar: 8,
  wider_actions: 9,
  wider_states: 10,
  wider_food: 11,
  wider_transport: 12,
  wider_home: 13,
  wider_social: 14,
  wider_work: 15,
  wider_health: 16,
  wider_transactions: 17,
};

const priorityRank: Record<string, number> = {
  core_a: 0,
  core_b: 1,
  wider_w1: 2,
  wider_w2: 3,
};

// A deliberate spoken-first bootstrap. It prevents an empty learner state from
// producing six unrelated words merely because they share the same cluster.
const FOUNDATION_ORDER = [
  'lex_wo', 'lex_ni', 'lex_shi_be', 'lex_bu', 'lex_xiang', 'lex_shenme',
  'lex_you', 'lex_meiyou', 'lex_zai_location', 'lex_nar', 'lex_keyi', 'lex_shuo',
  'lex_tingdong', 'lex_man', 'lex_qing', 'lex_jiao', 'lex_qu', 'lex_lai',
  'lex_jintian', 'lex_yao_want', 'lex_xihuan', 'lex_juede', 'lex_ma', 'lex_ne',
  'lex_de', 'lex_danshi', 'lex_yinwei', 'lex_suoyi', 'lex_ge_classifier', 'lex_duoshao',
];
const foundationRank = new Map(FOUNDATION_ORDER.map((id, index) => [id, index]));

const CHUNK_ORDER = [
  'chunk_g01_hello', 'chunk_g02_goodbye', 'chunk_r03_slower', 'chunk_r01_not_understood',
  'chunk_r02_repeat', 'chunk_r04_what_mean', 'chunk_r05_how_say', 'chunk_r06_do_you_mean',
  'chunk_d01_no_problem', 'chunk_d06_you_are_welcome', 'chunk_d02_whats_wrong',
];

const CLOSED_SYSTEM_ORDER = [
  'closed_numbers', 'closed_clock', 'closed_money', 'closed_phone_numbers',
  'closed_calendar', 'closed_classifiers', 'closed_relative_time', 'closed_sequencing',
];

const PRONUNCIATION_ORDER = [
  'pron_p01_tone1', 'pron_p02_tone2', 'pron_p03_tone3', 'pron_p04_tone4',
  'pron_p05_neutral', 'pron_p06_third_tone_combos', 'pron_p07_yi_bu_changes',
  'pron_p08_jqx_vs_zhchsh', 'pron_p09_zcs_vs_zhchsh', 'pron_p10_phrase_rhythm',
  'pron_p11_finals', 'pron_p12_pinyin_decode',
];

const CALIBRATION_LEXEMES = [
  'lex_wo', 'lex_ni', 'lex_shi_be', 'lex_bu', 'lex_you', 'lex_meiyou',
  'lex_xiang', 'lex_yao_want', 'lex_shenme', 'lex_nar', 'lex_zenme', 'lex_keyi',
  'lex_qu', 'lex_lai', 'lex_xihuan', 'lex_juede', 'lex_jintian', 'lex_danshi',
];
const CALIBRATION_CONSTRUCTIONS = [
  'con_c01_identity', 'con_c02_basic_negation', 'con_c05_have_exist',
  'con_c06_not_have_exist', 'con_c15_ma_question', 'con_c17_what_question',
  'con_c19_where_question', 'con_c29_want_action',
];

function productionRank(value: TargetState['production'] | undefined) {
  return ({ new: 0, recognized: 1, active: 2, automatic: 3 } as const)[value ?? 'new'];
}

function scoreNewLexeme(item: (typeof curriculum.lexemes)[number]) {
  const foundation = foundationRank.get(item.id);
  if (foundation !== undefined) return foundation;
  return 1000 + (clusterRank[item.cluster] ?? 99) * 10 + (priorityRank[item.priority] ?? 9);
}

function projectedLexemeReady(state: LearnerState, selectedNew: Set<string>, id: string) {
  return selectedNew.has(id) || productionRank(state.lexemes[id]?.production) >= 1;
}

function eligibleConstruction(state: LearnerState, selectedNew: Set<string>, required: string[]) {
  if (!required.length) return true;
  const ready = required.filter((id) => projectedLexemeReady(state, selectedNew, id)).length;
  return ready / required.length >= 0.8;
}

function trainingListeningLevels(state: LearnerState): { startLevel: ListeningLevel; maxLevel: ListeningLevel } {
  const coreA = curriculum.lexemes.filter((x) => x.priority === 'core_a');
  if (!coreA.length) return { startLevel: 1, maxLevel: 2 };
  const clear = coreA.filter((x) => ['clear', 'natural'].includes(state.lexemes[x.id]?.listening ?? 'unrecognized')).length / coreA.length;
  const natural = coreA.filter((x) => state.lexemes[x.id]?.listening === 'natural').length / coreA.length;
  if (natural >= 0.35) return { startLevel: 2, maxLevel: 3 };
  if (clear >= 0.25) return { startLevel: 2, maxLevel: 3 };
  return { startLevel: 1, maxLevel: 2 };
}

function calibrationPayload(): SessionPayload {
  return {
    id: `b1-cal-${crypto.randomUUID()}`,
    kind: 'calibration',
    band: 1,
    generatedAt: new Date().toISOString(),
    acquireLexemeIds: CALIBRATION_LEXEMES,
    strengthenLexemeIds: [],
    maintainLexemeIds: [],
    acquireConstructionIds: CALIBRATION_CONSTRUCTIONS,
    strengthenConstructionIds: [],
    chunkIds: ['chunk_g01_hello', 'chunk_r03_slower', 'chunk_r01_not_understood'],
    contrastSetIds: ['cs01_negation', 'cs02_desire_need'],
    closedSystemIds: ['closed_numbers'],
    pronunciationTargetIds: ['pron_p01_tone1', 'pron_p02_tone2', 'pron_p03_tone3', 'pron_p04_tone4'],
    listening: { startLevel: 1, maxLevel: 2 },
    correctionPolicy: 'near_total',
    pinyinPolicy: 'acquisition_only',
    modes: ['drill', 'listen', 'converse', 'test'],
  };
}

export function generateSessionPayload(state: LearnerState): SessionPayload {
  if (!state.calibrationCompleted) return calibrationPayload();

  const newLexemes = curriculum.lexemes
    .filter((x) => !state.lexemes[x.id] || state.lexemes[x.id].production === 'new')
    .sort((a, b) => scoreNewLexeme(a) - scoreNewLexeme(b));

  const strengthen = curriculum.lexemes
    .filter((x) => ['recognized', 'active'].includes(state.lexemes[x.id]?.production ?? ''))
    .sort((a, b) => {
      const sa = state.lexemes[a.id]; const sb = state.lexemes[b.id];
      return (sb?.consecutiveFailures ?? 0) - (sa?.consecutiveFailures ?? 0)
        || (sa?.fastIndependentSuccesses ?? 0) - (sb?.fastIndependentSuccesses ?? 0);
    });

  const maintain = curriculum.lexemes
    .filter((x) => state.lexemes[x.id]?.production === 'automatic')
    .sort((a, b) => (state.lexemes[a.id]?.lastSeenAt ?? '').localeCompare(state.lexemes[b.id]?.lastSeenAt ?? ''));

  const selectedNewLexemes = newLexemes.slice(0, 6);
  const selectedNewIds = new Set(selectedNewLexemes.map((x) => x.id));

  const newConstructions = curriculum.constructions
    .filter((x) => (!state.constructions[x.id] || state.constructions[x.id].production === 'new') && eligibleConstruction(state, selectedNewIds, x.required_lexeme_ids))
    .sort((a, b) => {
      const pa = ({ a1: 0, a2: 1, b: 2 } as const)[a.priority];
      const pb = ({ a1: 0, a2: 1, b: 2 } as const)[b.priority];
      return pa - pb || a.number - b.number;
    });

  const strengthenConstructions = curriculum.constructions
    .filter((x) => ['recognized', 'active'].includes(state.constructions[x.id]?.production ?? ''))
    .sort((a, b) => (state.constructions[b.id]?.consecutiveFailures ?? 0) - (state.constructions[a.id]?.consecutiveFailures ?? 0))
    .slice(0, 4);

  const selectedConstructionIds = new Set([
    ...newConstructions.slice(0, 2).map((x) => x.id),
    ...strengthenConstructions.map((x) => x.id),
    ...Object.entries(state.constructions).filter(([, s]) => productionRank(s.production) >= 1).map(([id]) => id),
  ]);

  const chunkIds = CHUNK_ORDER
    .filter((id) => state.chunks[id]?.production !== 'automatic')
    .sort((a, b) => (state.chunks[b]?.consecutiveFailures ?? 0) - (state.chunks[a]?.consecutiveFailures ?? 0))
    .slice(0, 2);
  const selectedChunkIds = new Set([...chunkIds, ...Object.entries(state.chunks).filter(([, s]) => productionRank(s.production) >= 1).map(([id]) => id)]);

  const eligibleContrasts = curriculum.contrasts.filter((contrast) => {
    const ids = contrast.member_lexeme_ids;
    if (!ids.length) return false;
    return ids.every((id) => projectedLexemeReady(state, selectedNewIds, id));
  }).sort((a, b) => (state.contrasts[b.id]?.consecutiveFailures ?? 0) - (state.contrasts[a.id]?.consecutiveFailures ?? 0));

  const candidateFunction = curriculum.functions.find((fn) => {
    if (state.functions[fn.id]?.production === 'automatic') return false;
    const constructionReady = fn.construction_ids.filter((id) => selectedConstructionIds.has(id)).length;
    const chunkReady = fn.chunk_ids.filter((id) => selectedChunkIds.has(id)).length;
    const total = fn.construction_ids.length + fn.chunk_ids.length;
    return total === 0 || (constructionReady + chunkReady) / total >= 0.5;
  });

  const candidateScenario = curriculum.scenarios.find((scenario) => {
    const functionCoverage = scenario.required_function_ids.filter((id) => productionRank(state.functions[id]?.production) >= 1 || id === candidateFunction?.id).length;
    return scenario.required_function_ids.length > 0 && functionCoverage / scenario.required_function_ids.length >= 0.5;
  });

  const coreAutomaticRate = curriculum.lexemes.filter((x) => x.priority === 'core_a' && state.lexemes[x.id]?.production === 'automatic').length / 75;
  const scenarioLevel: 'A' | 'B' | 'C' = coreAutomaticRate >= 0.5 ? 'C' : coreAutomaticRate >= 0.2 ? 'B' : 'A';

  const rotatingTarget = (order: string[], bucket: Record<string, TargetState>) => order
    .filter((id) => bucket[id]?.production !== 'automatic')
    .sort((a, b) => (bucket[b]?.consecutiveFailures ?? 0) - (bucket[a]?.consecutiveFailures ?? 0)
      || (bucket[a]?.sessionsSeen.length ?? 0) - (bucket[b]?.sessionsSeen.length ?? 0)
      || order.indexOf(a) - order.indexOf(b))[0];

  const closedSystemId = rotatingTarget(CLOSED_SYSTEM_ORDER, state.closedSystems);
  const pronunciationId = rotatingTarget(PRONUNCIATION_ORDER, state.pronunciation);

  return {
    id: `b1-${crypto.randomUUID()}`,
    kind: 'training',
    band: 1,
    generatedAt: new Date().toISOString(),
    acquireLexemeIds: selectedNewLexemes.map((x) => x.id),
    strengthenLexemeIds: strengthen.slice(0, 12).map((x) => x.id),
    maintainLexemeIds: maintain.slice(0, 12).map((x) => x.id),
    acquireConstructionIds: newConstructions.slice(0, 2).map((x) => x.id),
    strengthenConstructionIds: strengthenConstructions.map((x) => x.id),
    chunkIds,
    contrastSetIds: eligibleContrasts.slice(0, 1).map((x) => x.id),
    closedSystemIds: closedSystemId ? [closedSystemId] : [],
    pronunciationTargetIds: pronunciationId ? [pronunciationId] : [],
    functionId: candidateFunction?.id,
    scenario: candidateScenario ? { id: candidateScenario.id, variantLevel: scenarioLevel } : undefined,
    listening: trainingListeningLevels(state),
    correctionPolicy: 'near_total',
    pinyinPolicy: 'acquisition_only',
    modes: ['acquire', 'drill', 'manipulate', 'listen', ...(candidateScenario ? ['simulate' as const] : []), 'converse', 'test'],
  };
}
