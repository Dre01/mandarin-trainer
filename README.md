# Mandarin Control — Band 1 app scaffold

React/TypeScript scaffold for the spoken-first Band 1 Mandarin curriculum.

## Implemented

- canonical `band1.bundle.json` embedded as static curriculum data;
- first-run cold voice calibration;
- local learner-state persistence and migration;
- deterministic session generation;
- coherent foundation ordering for early sessions;
- lexeme, construction, chunk, contrast, closed-system, function, and pronunciation state;
- pinyin/English-only learner curriculum view;
- mastery based on behavioral evidence rather than lesson completion;
- hesitation-sensitive automaticity and failure-based regression;
- OpenAI Realtime Agents SDK integration scaffold;
- batched browser-side learning-evidence tool;
- local token server that protects the permanent OpenAI API key;
- voice UI with raw transcripts hidden;
- learner-state export/import/reset.

## Setup

Use a current Node 22 release.

```bash
npm install
```

The development token endpoint reads `OPENAI_API_KEY` from the process environment.

Terminal A:

```bash
export OPENAI_API_KEY="sk-proj-..."
npm run dev:token
```

Terminal B:

```bash
npm run dev
```

Open the Vite URL and run the baseline calibration.

## Validate

```bash
npm run validate
npm run build
```

## Production boundary

`server/realtime-token.mjs` is development-only. Move the same `POST /v1/realtime/client_secrets` operation to a same-origin serverless function. The permanent API key must remain server-side.

## Learner-facing script rule

Do not render `hanzi_internal` or raw speech transcripts to the learner. Character data exists only internally for disambiguation/tooling. Learner-facing Mandarin is tone-marked pinyin, with English during acquisition when useful.

See:

- `APP_SPEC.md` — product/architecture specification;
- `CODEX_BRIEF.md` — implementation handoff constraints;
- `IMPLEMENTATION_STATUS.md` — what has and has not been verified in this scaffold.
