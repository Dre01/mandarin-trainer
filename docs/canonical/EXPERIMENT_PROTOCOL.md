# Behavioural Experiment Protocol

## Why this exists

A previous optimisation pass changed several variables together: model, reasoning effort, VAD, prompt behaviour, truncation/session lifetime, and evidence attribution. Startup behaviour then degraded, but the cause could not be isolated. The project had no Git baseline at the time, making clean reversion difficult.

That must not happen again.

## Core experimental rule

**One behavioural hypothesis at a time.**

A single experiment may contain multiple mechanical edits only when they are inseparable implementation plumbing for one variable. Example: making the model selectable in both token server and browser is one “model-selection” experiment. It must not also alter VAD, instructions, reasoning effort, truncation, or evidence policy.

## Git workflow

1. Keep `main` at the latest accepted stable state.
2. Before an experiment, ensure validation/build pass on `main`.
3. Create a branch named `exp/eNNN-short-description`.
4. Write the hypothesis and pass/fail test in `docs/experiments/EXPERIMENT_LOG.md` **before or with** the behavioural commit.
5. Make the smallest change that tests the hypothesis.
6. Run static validation/build.
7. Run the defined live test when Voice behaviour is affected.
8. Record exact configuration, result, cost where relevant, and learner-state artifact if useful.
9. Decide: **merge / iterate on same variable / abandon and revert**.
10. Merge only accepted behaviour to `main`.

If an experiment regresses behaviour, prefer discarding/reverting the branch over layering unrelated fixes on top.

## No compound tuning

Do not change two or more of the following in the same experiment unless the learner/orchestrator explicitly approves the compound test:

- Realtime model;
- Voice instructions/prompt contract;
- VAD eagerness/turn detection;
- reasoning effort;
- response/output caps;
- context truncation or session lifetime;
- session-start mechanism;
- session selection;
- mastery thresholds;
- evidence-attribution semantics;
- calibration semantics.

## Required experiment record

Every behavioural experiment records:

```text
Experiment ID
Baseline commit/tag
Branch/commit
Hypothesis
Single variable being changed
Exact code/config change
What is deliberately held constant
Test procedure
Pass/fail criteria
Qualitative observations
Cost/latency metrics if relevant
Learner-state/evidence artifact if relevant
Decision: merge / iterate / revert
```

## Voice-model comparison procedure

When comparing full vs Mini:

- use the same code except model selection;
- restore/import the same pre-session learner-state snapshot before each run;
- because session selection is deterministic, verify the selected target IDs match;
- keep VAD, instructions, reasoning configuration, truncation, and session boundaries identical;
- compare startup, instruction-following, comprehensibility, correction, retrieval pressure, listening, controlled novelty, latency, and cost.

Natural wording need not match. Pedagogical trajectory should.

## Documentation-only changes

Canonical-doc merges may go directly through a docs-only branch/commit after validation because they do not alter runtime behaviour. Keep them separate from behavioural code changes.

## Evidence policy experiments

Changes to evidence attribution can usually be tested independently from Voice pedagogy. Prefer deterministic validators in application code where feasible. Conservative false negatives are safer than false mastery.
