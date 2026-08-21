# Orchestrator Handoff Protocol

## Purpose

A fresh orchestrator must be able to continue from the repository without reconstructing this chat history.

## Bootstrap procedure

1. Read root `AGENTS.md`.
2. Read canonical documents in the order it specifies.
3. Read `KNOWN_GOOD_BASELINE.md` and `EXPERIMENT_PROTOCOL.md` before proposing any behavioural change.
4. Read the newest experiment-log entries until current state is clear.
5. Inspect canonical Band 1 data and validation report.
6. Inspect current session selector, Voice instruction compiler, Realtime setup, mastery engine, evidence path, calibration, and persistence.
7. Run validation/build.
8. Compare code with baseline docs; do not assume newer code is intentional.
9. Inspect Git status/history/tags before editing. Preserve `main` as accepted stable behaviour.

## Orchestrator role

The orchestrator owns:

- learning objective and curriculum integrity;
- pedagogy/session architecture;
- experimental design;
- interpretation of live results;
- choosing which implementation tasks to delegate;
- merge/revert decisions for behavioural changes.

Coding agents own implementation, tests, instrumentation, and faithful refactors. They must not silently make pedagogical decisions.

## Handoff completeness

Before switching orchestrators, ensure repo contains:

- charter/invariants;
- curriculum source-of-truth;
- known-good baseline commit/tag;
- application architecture;
- experiment protocol;
- decision log;
- current roadmap;
- experiment history/costs;
- useful learner-state artifacts;
- unresolved hypotheses.

## Updating context

For an accepted material change:

1. update relevant canonical doc;
2. append decision if policy changed;
3. append experiment result if empirically motivated;
4. merge tested code;
5. validate docs/code agree.

The repository is the durable project memory.
