# Codex / Cursor implementation brief

## Mission

Take this scaffold from static code to a locally running end-to-end Band 1 training app. Preserve the curriculum and pedagogical architecture. Your job is implementation, debugging, and integration — **not curriculum redesign**.

## Read first

1. `APP_SPEC.md`
2. `README.md`
3. `src/data/band1.bundle.json`
4. `src/session/selectSession.ts`
5. `src/session/buildVoiceInstructions.ts`
6. `src/state/mastery.ts`

## Hard constraints

- Do **not** change the 275 lexemes, 60 constructions, contrast sets, functions, scenarios, graduation architecture, or mastery philosophy unless explicitly instructed.
- Never expose `OPENAI_API_KEY` to browser code.
- Learner-facing Mandarin must use **tone-marked pinyin**. Do not display Chinese characters alone.
- Do not render raw Realtime transcripts by default.
- The model records evidence; deterministic application code decides state promotion/demotion.
- Preserve first-run cold calibration. Do not preview calibration target answers.
- Preserve long-hesitation handling: correct-but-long retrieval must not count as reflex-level evidence.
- Preserve failure-based regression.
- Do not add gamification, accounts, cloud persistence, or a general AI curriculum generator.

## First task

1. Run `npm install`.
2. Run `npm run validate`.
3. Run `npm run build`.
4. Fix compile/type errors against the **currently installed** OpenAI Agents SDK and Vite versions.
5. If an SDK API differs from the scaffold, verify against current official OpenAI Agents SDK/API documentation before changing it.
6. Keep changes minimal and document any API-level adjustment.

## Realtime integration target

Browser:

```text
RealtimeAgent
   ↓
RealtimeSession (WebRTC browser default)
   ↓
ephemeral client secret
```

Server/serverless boundary:

```text
OPENAI_API_KEY
   ↓
POST /v1/realtime/client_secrets
   ↓
ek_... short-lived client secret
   ↓
browser session.connect(...)
```

The development implementation lives in:

- `src/voice/createVoiceSession.ts`
- `server/realtime-token.mjs`

## End-to-end acceptance test

### Calibration

- Fresh localStorage shows **Run baseline calibration**.
- Calibration plan does not expose target words/constructions.
- Microphone connects.
- Agent samples rather than teaches first.
- Evidence arrives through batched `record_learning_evidence` tool calls.
- Ending a calibration with evidence sets `calibrationCompleted=true`.

### Adaptive training

- Next generated payload is `kind=training`.
- Already demonstrated material is not blindly treated as unknown.
- New material begins from the explicit foundation sequence where needed.
- Same-session new lexemes may unlock a construction.
- Repair chunks, one closed system, and one pronunciation target can enter the payload.
- Strong/weak evidence changes later session selection.

### Script/UI

- No learner-facing Hanzi.
- No raw transcript panel.
- Acquisition targets are pinyin + English.
- Calibration target list remains hidden.

### State

- Refresh preserves progress.
- Export/import round-trip works.
- Reset returns to calibration state.

### Security

- Network inspection shows no permanent API key in browser assets or requests.
- Browser only receives ephemeral `ek_...` secret.

## Do not optimize prematurely

After the first successful real sessions, collect actual problems before adding scheduling algorithms, advanced analytics, extra screens, or model orchestration layers. The next design iteration should be driven by learning behavior, not software enthusiasm.
