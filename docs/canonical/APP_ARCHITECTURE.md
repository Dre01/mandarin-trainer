# Application Architecture

## Product shape

Local-first React/TypeScript spoken-Mandarin trainer backed by static canonical curriculum JSON and local learner state.

```text
Canonical curriculum
      ↓
Learner state + evidence
      ↓
Deterministic session selector
      ↓
Session payload
      ↓
Voice instruction compiler
      ↓
Realtime Voice model
      ↓
Batched evidence observations
      ↓
Deterministic mastery updater
      ↓
Persisted learner state
```

## Current implementation baseline

The current repository is the restored original v0.2 scaffold. See `KNOWN_GOOD_BASELINE.md` before altering Voice behaviour.

The baseline currently uses:

- React + TypeScript + Vite;
- canonical `src/data/band1.bundle.json`;
- localStorage learner state with export/import/reset;
- deterministic session selection;
- first-run sampled calibration;
- OpenAI Agents SDK Realtime session over browser WebRTC;
- server token endpoint using permanent `OPENAI_API_KEY` to mint a short-lived client secret;
- full `gpt-realtime-2.1` hard-coded in the original browser/token-server paths;
- semantic VAD with eagerness `low`;
- batched `record_learning_evidence` calls;
- raw transcripts hidden by default.

Do not treat the historical E002 Mini configuration as active code.

## Source-of-truth boundary

The canonical Band 1 dataset controls what belongs in the curriculum. The Voice model must not silently expand/reorder it.

## Learner-facing representation

- tone-marked pinyin + English as needed;
- no character-reading requirement;
- internal Hanzi may be retained for homophone disambiguation/tooling;
- raw model/transcription output containing Hanzi should not become the default learner UI.

## API/security boundary

- permanent API key remains server-side;
- browser receives only short-lived Realtime client credentials;
- never put the permanent key in source, browser storage, or `VITE_*` variables.

## Cost objective

Target API spend is approximately USD 20/month or less.

E001 full-model calibration cost ~USD 0.31 for ~10 minutes, with output audio/text dominating spend. This makes Mini and terse tutor output attractive hypotheses, but they are **not accepted optimisations until tested in isolation**.

## Deliberately deferred

Avoid adding until repeated usage justifies it:

- accounts/authentication;
- cloud database;
- gamification;
- broad analytics dashboards;
- model-generated curriculum;
- character-learning mode;
- multi-band complexity before Band 1 behaviour is validated.
