import fs from 'node:fs';

const bundle = JSON.parse(fs.readFileSync(new URL('../src/data/band1.bundle.json', import.meta.url), 'utf8'));
const errors = [];
const ids = new Set();
for (const group of ['lexemes','constructions','chunks','contrasts','closed_systems','functions','pronunciation','scenarios','assessments']) {
  for (const item of bundle[group]) {
    if (!item.id) errors.push(`${group}: missing id`);
    if (ids.has(item.id)) errors.push(`duplicate id: ${item.id}`);
    ids.add(item.id);
  }
}
if (bundle.lexemes.length !== 275) errors.push(`expected 275 lexemes; got ${bundle.lexemes.length}`);
if (bundle.constructions.length !== 60) errors.push(`expected 60 constructions; got ${bundle.constructions.length}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Dataset scaffold validation passed.');
