# Known-Good Baseline

## Purpose

This document anchors the repository to the last known-good application behaviour. It exists so future experiments can be reverted cleanly instead of being repaired by stacking additional changes onto a regression.

## Current baseline state — 2026-08-21

The project was recreated from the original **Mandarin Control application scaffold v0.2**, before the later bundled Mini/cost/latency/evidence changes that produced the E002 startup regression.

The learner reported the recreated project passed:

- `npm install` — 48 packages installed, 0 vulnerabilities;
- `npm run validate` — dataset and scaffold validation passed;
- `npm run build` — TypeScript and Vite production build passed;
- no source-code or SDK API adjustments were needed.

The recreated project has been pushed to a fresh GitHub repository. The repository commit hash/tag must be filled in after this canonical-context package is merged.

### Baseline Git anchor

After docs-only merge, record:

```text
baseline_commit: <FILL_AFTER_MERGE>
baseline_tag: baseline-known-good-v0.2
```

Create the annotated tag only after confirming the merge changed documentation/validation only and did not alter learning behaviour.

## Baseline Realtime behaviour/configuration

The original scaffold code uses:

- model: `gpt-realtime-2.1`;
- model hard-coded consistently in browser session and token server;
- browser Realtime over WebRTC / Agents SDK;
- ephemeral client secret from the server token endpoint;
- semantic VAD eagerness: `low`;
- automatic response creation: enabled;
- interruption: enabled;
- no explicit reasoning-effort override;
- no custom model-output token cap;
- no custom truncation/session-lifetime optimisation;
- original `buildVoiceInstructions` teaching contract.

Do not silently “modernize” these settings while establishing the baseline.

## Behavioural evidence associated with this baseline

E001, the first ~10-minute full-model calibration, was qualitatively excellent:

- felt like a real tutor;
- waited for learner retrieval;
- suitable speech speed;
- near-total but economical correction;
- returned immediately to conversation;
- avoided unnecessary explanation;
- controlled novelty reasonably;
- recycled material;
- forced conversation repair;
- learner did most of the cognitive work.

Known imperfections:

- roughly ~5-second latency on many turns;
- occasional process narration such as “let me think…”;
- cost was USD 0.31 for ~10 minutes;
- evidence attribution incorrectly credited `yào qù` to the `xiǎng + VP` construction;
- calibration completion semantics are only a coarse initial baseline flag.

These are **known baseline defects, not authorization to fix them together**.

## Critical caveat

E001 validated calibration behaviour, not a long ordinary training session. Before concluding that any later training-session behaviour is a Mini regression, obtain a short full-model **training** baseline from this restored code.

## Baseline preservation rule

`main` represents the latest accepted stable behaviour.

Never stack speculative fixes directly onto a regression on `main`. Behavioural experiments occur on isolated branches and are merged only after their pass criteria are met.
