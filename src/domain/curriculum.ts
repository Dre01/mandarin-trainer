import rawBundle from '../data/band1.bundle.json';
import type { CurriculumBundle } from './types';

export const curriculum = rawBundle as unknown as CurriculumBundle;

export const lexemeById = new Map(curriculum.lexemes.map((item) => [item.id, item]));
export const constructionById = new Map(curriculum.constructions.map((item) => [item.id, item]));
export const chunkById = new Map(curriculum.chunks.map((item) => [item.id, item]));
export const contrastById = new Map(curriculum.contrasts.map((item) => [item.id, item]));
export const closedSystemById = new Map(curriculum.closed_systems.map((item) => [item.id, item]));
export const functionById = new Map(curriculum.functions.map((item) => [item.id, item]));
export const pronunciationById = new Map(curriculum.pronunciation.map((item) => [item.id, item]));
export const scenarioById = new Map(curriculum.scenarios.map((item) => [item.id, item]));

export function learnerLexeme(id: string) {
  const item = lexemeById.get(id);
  if (!item) return null;
  return { id: item.id, pinyin: item.pinyin, meaning: item.meaning_core, priority: item.priority };
}

export function learnerConstruction(id: string) {
  const item = constructionById.get(id);
  if (!item) return null;
  return {
    id: item.id,
    pattern: item.pattern_pinyin,
    meaning: item.core_function,
    priority: item.priority,
    examples: item.examples.map((e) => ({ pinyin: e.pinyin ?? '', meaning: e.meaning ?? '' })),
  };
}

export function learnerChunk(id: string) {
  const item = chunkById.get(id);
  if (!item) return null;
  return { id: item.id, pinyin: item.pinyin, meaning: item.meaning, priority: item.priority, type: item.type };
}
