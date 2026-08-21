# AGENTS.md — Mandarin Control

This repository is an evidence-driven spoken-Mandarin training system. Agents must preserve the learning objective and known-good tutor behaviour, not merely keep the app compiling.

## Mandatory reading before behavioural changes

Read in order:

1. `docs/canonical/PROJECT_CHARTER.md`
2. `docs/canonical/LEARNING_PRINCIPLES.md`
3. `docs/canonical/CURRICULUM_ARCHITECTURE.md`
4. `docs/canonical/SESSION_ENGINE_CONTRACT.md`
5. `docs/canonical/MASTERY_AND_EVIDENCE.md`
6. `docs/canonical/APP_ARCHITECTURE.md`
7. `docs/canonical/KNOWN_GOOD_BASELINE.md`
8. `docs/canonical/EXPERIMENT_PROTOCOL.md`
9. `docs/canonical/DECISIONS.md`
10. `docs/canonical/ROADMAP.md`

Read `docs/experiments/EXPERIMENT_LOG.md` before tuning model behaviour, latency, cost, mastery, calibration, or session selection.

## Authority hierarchy

1. `PROJECT_CHARTER.md` — objective/non-negotiables.
2. Canonical curriculum data — exact language content.
3. Canonical behavioural docs.
4. Accepted decisions.
5. Known-good baseline + accepted experiment results for runtime behaviour.
6. Current code.
7. Temporary implementation notes/model defaults.

Code does not silently redefine pedagogy. Conversely, an untested implementation idea in docs does not override known-good behaviour; distinguish canonical policy from experimental mechanism.

## Non-negotiable rules

- Do not invent/reorder curriculum without explicit curriculum decision.
- Voice improvises conversation, not pedagogy.
- App/orchestrator controls session selection.
- Learner-facing Mandarin is pinyin-first; no Hanzi literacy requirement.
- Automaticity, listening, repair, and transfer outrank nominal coverage.
- Voice observations are evidence; deterministic logic owns mastery.
- Semantic equivalence alone does not prove a specific construction.
- No XP/streak/gamification substitution.
- API budget target ≈ USD 20/month unless explicitly changed.
- Permanent OpenAI key never enters browser code/client variables.

## Experimental change control

**Do not reproduce the historical E002 failure by changing model + VAD + reasoning + prompt + truncation + evidence together.**

For behavioural changes:

- keep `main` stable;
- use one experiment branch per hypothesis;
- define test/pass criteria first;
- change one meaningful variable at a time;
- run static validation;
- run live test when behaviour is affected;
- merge only accepted changes;
- revert/discard regressions instead of stacking unrelated fixes.

Follow `docs/canonical/EXPERIMENT_PROTOCOL.md`.

## Documentation obligations

Update `DECISIONS.md` when policy changes. Update `EXPERIMENT_LOG.md` for empirical tuning. Never silently change model, VAD, prompt contract, mastery semantics, session selection, or cost architecture.

## Pre-merge report

For behavioural work, report:

1. baseline commit/tag;
2. experiment branch/commit;
3. exact single variable changed;
4. validation/build results;
5. exact active Realtime configuration if relevant;
6. live-test result still needed/completed;
7. canonical docs updated;
8. merge/revert recommendation.
