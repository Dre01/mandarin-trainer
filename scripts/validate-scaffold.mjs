import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const bundle = JSON.parse(fs.readFileSync(path.join(root, 'src/data/band1.bundle.json'), 'utf8'));
const allIds = new Set([
  ...bundle.lexemes.map((x) => x.id),
  ...bundle.constructions.map((x) => x.id),
  ...bundle.chunks.map((x) => x.id),
  ...bundle.contrasts.map((x) => x.id),
  ...bundle.closed_systems.map((x) => x.id),
  ...bundle.functions.map((x) => x.id),
  ...bundle.pronunciation.map((x) => x.id),
  ...bundle.scenarios.map((x) => x.id),
]);

const selector = fs.readFileSync(path.join(root, 'src/session/selectSession.ts'), 'utf8');
const referenced = new Set(selector.match(/['"]((?:lex|con|chunk|cs|closed|pron|fn|scn)_[a-zA-Z0-9_]+)['"]/g)?.map((s) => s.slice(1, -1)) ?? []);
const missing = [...referenced].filter((id) => !allIds.has(id));
if (missing.length) throw new Error(`Selector references unknown curriculum IDs: ${missing.join(', ')}`);

const cjk = /[\u4e00-\u9fff]/;
const sourceRoot = path.join(root, 'src');
const leaked = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (name !== 'band1.bundle.json' && cjk.test(fs.readFileSync(full, 'utf8'))) leaked.push(path.relative(root, full));
  }
}
walk(sourceRoot);
if (leaked.length) throw new Error(`CJK characters found in learner app source: ${leaked.join(', ')}`);

const client = fs.readFileSync(path.join(root, 'src/voice/createVoiceSession.ts'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server/realtime-token.mjs'), 'utf8');
const model = 'gpt-realtime-2.1';
if (!client.includes(model) || !server.includes(model)) throw new Error('Realtime model is not aligned between client and token server.');

console.log(`Scaffold validation passed: ${referenced.size} hard-coded curriculum references exist; learner source has no CJK leakage; Realtime model aligned.`);
