# Mastery and Evidence

## Principle

The model observes. Deterministic application logic judges state transitions.

## Evidence dimensions

An observation may record target type/ID, mode, correctness, independence, hint level, listening level, context, novel context, spontaneous use, latency, pronunciation, and a short note.

## Distinct mastery layers

Do not collapse these into one generic mastery state:

1. lexeme retrieval/recognition;
2. construction instantiation;
3. contrast selection;
4. communicative function;
5. listening decoding;
6. pronunciation/intelligibility.

## Strict construction attribution — accepted policy, not yet baseline implementation

Positive construction evidence requires the learner to instantiate that construction or an explicitly registered valid form. Semantic equivalence is insufficient.

Known E001 evidence error:

- learner produced `yào qù`;
- logger credited canonical `xiǎng + VP`;
- policy: `yào qù` must not count for that construction.

The restored v0.2 baseline predates the hardening implementation. Implement this as its own isolated evidence experiment after Voice-model behaviour has a stable comparison point. Prefer deterministic validation and conservative false negatives.

## Item-state defaults

Baseline software defaults:

### Recognized
At least 2 successful observations.

### Active
At least 3 independent successful retrievals across at least 2 sessions and 2 contexts.

### Automatic
At least 8 independent successful retrievals, at least 6 without long hesitation, across at least 3 sessions and 2 contexts, with at least 1 spontaneous success.

Changes require evidence and a decision entry.

## Regression

Repeated failures may demote Automatic → Active and Active → Recognized.

## Hesitation

Correct output after long searching is useful but is not reflex-level evidence.

## Calibration semantics

Canonical interpretation: calibration is a **sampled baseline**, not proof that every subsystem was tested.

The restored baseline code currently uses a coarse `calibrationCompleted` mechanism. Improving the flag/coverage semantics is an isolated future experiment, not part of the model-cost test.

Do not discard valid learner evidence merely because calibration sampling was incomplete.
