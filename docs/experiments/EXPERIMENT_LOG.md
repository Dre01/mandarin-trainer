# Experiment Log

Append-only record of behavioural/cost experiments. Follow `docs/canonical/EXPERIMENT_PROTOCOL.md`.

## 2026-08-20 — E001: First live full-model calibration

### Configuration

Original v0.2 Realtime scaffold using full `gpt-realtime-2.1`.

### Duration

Approximately 10 minutes.

### Qualitative result

Very strong. Tutor felt close to a real tutor:

- waited for learner retrieval rather than rescuing quickly;
- suitable speech speed;
- corrected errors and kept minor corrections brief;
- returned quickly to conversation;
- avoided excessive English/explanation;
- controlled new vocabulary reasonably during calibration;
- recycled material;
- forced conversation repair;
- learner performed most of the cognitive work.

Observed downside:

- many responses had roughly ~5 seconds latency;
- model sometimes said process filler such as “Let me think about how to respond to that”.

### Cost

- USD 0.31 total;
- 19 requests;
- 47,223 total tokens;
- models: `gpt-realtime-2.1` (~46,957 tokens) + `gpt-4o-mini-transcribe` (266 tokens);
- dominant cost: Realtime output audio/text.

### Evidence finding

Learner-state export correctly captured a `méiyǒu` weakness and spontaneous repair, but incorrectly attributed `yào qù` to canonical `xiǎng + VP`.

### Decision

Tutor pedagogy is the quality reference. Cost/latency/evidence issues should be improved without sacrificing that behaviour.

---

## 2026-08-20 — E002: Bundled optimisation pass — FAILED / REVERTED HISTORICALLY

### Changes were bundled

Reported changes included:

- default model → `gpt-realtime-2.1-mini`;
- reasoning effort → low;
- semantic VAD eagerness low → medium;
- maximum output 512;
- truncation/session-lifetime changes;
- process-filler prohibition;
- strict evidence attribution.

### Outcome

Three startup attempts degraded:

1. English “let's start” → multiple unexplained Mandarin sentences.
2. `Nǐ hǎo` → generic English menu asking learner to choose scenario/chat/words.
3. “Hello” → multiple unexplained Mandarin sentences.

### Interpretation

Because multiple variables changed simultaneously, the causal variable was not identifiable. The project also lacked a clean repository rollback point.

### Status

**Do not recreate E002 as a bundle.** The project was later reset to the original v0.2 scaffold.

---

## 2026-08-21 — E002-R: Repository reset / new stable baseline

### Action

The learner deleted the regressed project, recreated it from the original v0.2 scaffold supplied before E002, and pushed it to a fresh GitHub repository.

### Static validation

- `npm install`: 48 packages, 0 vulnerabilities;
- `npm run validate`: passed;
- `npm run build`: passed;
- no source-code or SDK compatibility changes required.

### Decision

This restored scaffold is the current stable code baseline. From now on, isolate behavioural changes through Git branches and explicit experiments. Historical E002 changes are not active code.

### Next evidence needed

Obtain a short ordinary **full-model training** session on this restored baseline before testing Mini, because E001 only validated calibration behaviour.
