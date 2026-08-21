# Roadmap and Current Work Queue

## Current phase — restored stable baseline

The project has been rebuilt from the original v0.2 scaffold and pushed to a fresh GitHub repository. Static validation/build pass. Historical E002 bundled optimisations are **not active**.

The immediate goal is to establish a clean behavioural baseline and then test cost reductions one variable at a time without losing the excellent E001 tutor quality.

## P0 — merge canonical context without changing runtime behaviour

1. Merge this context package as a docs/validation-only change.
2. Run `npm run validate` and `npm run build`.
3. Confirm no application behaviour/config changed.
4. Record the resulting `main` commit in `KNOWN_GOOD_BASELINE.md`.
5. Create annotated tag `baseline-known-good-v0.2`.
6. Keep `main` stable; all behavioural work uses experiment branches per `EXPERIMENT_PROTOCOL.md`.

## P1 — establish a full-model TRAINING baseline before changing code

E001 proved calibration quality, but not an ordinary generated training session.

Using the restored code with full `gpt-realtime-2.1`:

1. Import the preserved E001 calibration learner-state artifact if convenient, or otherwise reach an ordinary training payload without altering curriculum logic.
2. Export/save the pre-session learner state.
3. Generate a normal training session.
4. Run ~5–10 minutes naturally.
5. Record startup behaviour, structure/gradation, comprehensibility, correction, retrieval waiting, novelty control, recycling, latency, process filler, cost, and resulting state.

If ordinary full-model training is already poor, diagnose that from the baseline before testing Mini. Do not attribute it to Mini.

## P2 — E003 model-selection-only experiment

Branch: `exp/e003-mini-model-only`

### Hypothesis

`gpt-realtime-2.1-mini` can preserve the baseline tutor behaviour at materially lower cost.

### Allowed code change

Make the Realtime model selectable **without changing any other Realtime or pedagogical setting**.

Preferred minimal plumbing:

- server reads `OPENAI_REALTIME_MODEL`, defaulting to `gpt-realtime-2.1`;
- token endpoint returns the selected model alongside the ephemeral secret;
- browser uses that same returned model when constructing `RealtimeSession`.

Hold constant:

- original Voice instructions;
- semantic VAD eagerness `low`;
- no reasoning-effort override;
- no new output-token cap;
- no truncation/session-lifetime policy;
- no new startup-control mechanism;
- baseline evidence logic.

### Test A — plumbing control

Run the branch with `OPENAI_REALTIME_MODEL=gpt-realtime-2.1` first. Confirm behaviour remains comparable to the full-model training baseline. If plumbing alone regresses behaviour, fix/revert before Mini testing.

### Test B — Mini

Restore/import the exact same pre-session learner state so deterministic selection yields the same target set. Set only:

```text
OPENAI_REALTIME_MODEL=gpt-realtime-2.1-mini
```

Run the same kind of session. Compare:

- startup/trajectory;
- comprehensibility;
- instruction-following;
- retrieval waiting;
- correction quality;
- Mandarin quality;
- controlled novelty;
- recycling;
- latency;
- cost.

If Mini becomes generic, asks what to practise, or floods unexplained Mandarin while full does not, that is model-condition evidence. Do not simultaneously alter VAD/prompt/reasoning to “fix” it.

Decision after E003: merge model-selectability only if safe. Decide Mini default only after quality/cost evidence.

## P3 — evidence attribution experiment

After model behaviour has a stable comparison point, implement D013 strict construction attribution as an isolated change. Test known case: `yào qù` must not count for `xiǎng + VP`; genuine `xiǎng + VP` must count.

This should not be bundled with Voice prompt/model/VAD changes.

## P4 — individual tutor/cost/latency experiments

Only as needed, one variable per experiment:

- process-narration/turn-economy instruction;
- VAD eagerness low → medium;
- reasoning-effort override;
- output cap;
- context truncation/session resets;
- startup control mechanism **only if model testing demonstrates it is necessary**;
- calibration-coverage semantics.

Each has its own experiment ID/branch and live pass criteria where behavioural.

## P5 — cost architecture

After a measured Mini session, calculate actual cents/minute and daily Realtime allowance under ~$20/month. If required, shift deterministic acquisition/retrieval/SRS/listening work out of Realtime while reserving live inference for correction, manipulation, simulation, listening interaction, and free conversation.

## P6 — curriculum expansion

Do not build Band 2 until Band 1 selection, tutoring, evidence, mastery transitions, and cost have worked repeatedly in real use.
