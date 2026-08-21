# Canonical Context Merge Bootstrap Prompt

Use this once, in the fresh repository, to merge the context package without changing runtime behaviour.

---

You are integrating the canonical Mandarin Control project context into a freshly restored, known-good repository.

The current application code is intentionally the original v0.2 scaffold. It has passed `npm install`, `npm run validate`, and `npm run build` without source changes. Do **not** implement any historical optimisation or roadmap code during this task.

Your task is documentation/context integration only:

1. Read this package's `MERGE_INSTRUCTIONS.md` and `AGENTS.md`.
2. Inspect the repository and confirm it matches the broad v0.2 architecture described in `docs/canonical/KNOWN_GOOD_BASELINE.md`.
3. Copy/merge `AGENTS.md`, `docs/canonical/`, `docs/experiments/`, and `scripts/validate-canonical-context.mjs` into the repository.
4. Preserve existing application source and canonical Band 1 dataset unchanged.
5. Add a short pointer near the top of the existing README to `AGENTS.md` and `docs/canonical/PROJECT_CHARTER.md`.
6. Wire `node scripts/validate-canonical-context.mjs` into the existing validation command, without changing learning/runtime behaviour.
7. Run `npm run validate` and `npm run build`.
8. Inspect the resulting diff and verify it contains only documentation/validation wiring, not Voice/session/mastery/curriculum behaviour changes.
9. Commit this merge separately with a clear docs/context commit message.
10. Record the resulting commit SHA in `docs/canonical/KNOWN_GOOD_BASELINE.md` and create annotated Git tag `baseline-known-good-v0.2`. If recording the SHA requires a tiny follow-up docs commit, do so and state which commit the tag points to.
11. Report: baseline commit/tag, validation/build result, files changed, and confirmation that runtime behaviour was untouched.

STOP after completing the context merge. Do not implement Mini, VAD, reasoning, prompt, truncation, startup, calibration, or evidence-attribution changes yet.

---
