# Implementation status

## Verified in this workspace

- Canonical Band 1 dataset validation passes.
- Entity counts remain 275 lexemes / 60 constructions and supporting sets.
- Learner-facing source files contain no CJK characters; internal curriculum JSON intentionally does.
- Token-server architecture matches the current OpenAI Realtime browser pattern: server mints a short-lived client secret, browser connects through RealtimeSession.
- Session selector includes calibration, foundation ordering, chunks, closed systems, pronunciation, contrasts, functions, scenarios, and listening-level selection.
- Learner state includes latency-sensitive automaticity and repeated-failure regression.

## Not fully verified in this workspace

Dependency installation could not complete because the execution environment did not finish access to the npm registry. Therefore the final TypeScript/Vite build and live microphone/API connection have **not** been executed here.

The scaffold is intentionally handed to a normal networked Node/Cursor/Codex environment for the next step:

```bash
npm install
npm run validate
npm run build
```

Then run the local token server and Vite app for the end-to-end acceptance test in `CODEX_BRIEF.md`.
