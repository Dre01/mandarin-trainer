import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'docs/canonical/CANONICAL_MANIFEST.json');
if (!fs.existsSync(manifestPath)) throw new Error('Missing canonical manifest.');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const errors = [];
for (const rel of manifest.canonicalDocs ?? []) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) errors.push(`Missing canonical document: ${rel}`);
  else if (!fs.readFileSync(p, 'utf8').trim()) errors.push(`Empty canonical document: ${rel}`);
}

for (const rel of ['AGENTS.md', 'docs/canonical/KNOWN_GOOD_BASELINE.md', 'docs/canonical/EXPERIMENT_PROTOCOL.md']) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`Missing required context file: ${rel}`);
}

const agents = fs.existsSync(path.join(root,'AGENTS.md')) ? fs.readFileSync(path.join(root,'AGENTS.md'),'utf8') : '';
for (const phrase of ['Voice improvises conversation, not pedagogy', 'keep `main` stable', 'one meaningful variable at a time']) {
  if (!agents.includes(phrase)) errors.push(`AGENTS.md missing guardrail phrase: ${phrase}`);
}

if (!Array.isArray(manifest.invariants) || manifest.invariants.length < 12) errors.push('Canonical manifest has too few declared invariants.');

if (errors.length) {
  console.error('Canonical context validation FAILED:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`Canonical context validation passed: ${manifest.canonicalDocs.length} docs, ${manifest.invariants.length} invariants.`);
