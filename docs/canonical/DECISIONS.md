# Canonical Decision Log

Append decisions; do not rewrite history silently.

## D001 — Spoken-functional target, not formal four-skill B2
**Status:** accepted

Optimize for living in China, listening, and sustained conversation. Reading/writing characters are excluded as learning goals.

## D002 — Pinyin-first learner interface
**Status:** accepted

Characters may exist internally, but learner-facing Mandarin must include pinyin and cannot require Hanzi literacy.

## D003 — Voice as practice engine, not curriculum designer
**Status:** accepted

Persistent curriculum/data and deterministic orchestration choose what is practised. Voice executes, varies, corrects, and reports evidence.

## D004 — Automaticity over coverage
**Status:** accepted

Active/automatic knowledge counts as progress; mere exposure is insufficient for high-value language.

## D005 — Value-maximising curriculum
**Status:** accepted

Generative words/structures, conversational glue, questions, modal verbs, connectors, and repair language receive disproportionate weight.

## D006 — Capability-based band progression
**Status:** accepted

Bands represent Control → Survive → Coordinate → Socialise → Narrate → Explain → Discuss → Operate. Hard capability gates determine advancement.

## D007 — Evidence-driven mastery with regression
**Status:** accepted

Model reports evidence; deterministic rules promote/demote. Long hesitation does not support automaticity; repeated failure may demote.

## D008 — Lexeme, construction, contrast, and function are distinct
**Status:** accepted

Knowing a word does not imply correct construction use or contrast selection.

## D009 — Near-total economical correction
**Status:** accepted

Correct almost everything while keeping minor corrections short and maintaining conversation flow.

## D010 — No gamification/time-streak substitution
**Status:** accepted

Do not substitute engagement metrics for capability.

## D011 — Permanent API key stays server-side
**Status:** accepted

Browser receives ephemeral Realtime credentials only.

## D012 — API cost target ≈ USD 20/month
**Status:** accepted

Cost is a hard design constraint. Mini, terser output, context resets, and local practice are candidate optimisations subject to isolated testing. Cost reduction must not silently degrade tutor quality.

## D013 — Strict construction attribution
**Status:** accepted policy; implementation pending on restored baseline

Only actual registered construction forms count as construction evidence. Semantic-equivalent alternatives must not be credited to the wrong construction.

## D014 — Calibration is sampled, not comprehensive
**Status:** accepted policy; implementation refinement pending

A calibration flag must not be interpreted as proof every subsystem has been tested.

## D015 — Orchestration contract is canonical; startup mechanism is experimental
**Status:** accepted 2026-08-21

The app determines the learning payload/trajectory and Voice must not replace it with learner menus or self-selected pedagogy. However, the exact technical startup mechanism (instruction-only, app-injected control message, etc.) is **not** canonical until tested. Preserve known-good behaviour and prefer the simplest mechanism that works.

## D016 — Behavioural changes require isolated experiments and Git rollback points
**Status:** accepted 2026-08-21

Keep stable behaviour on `main`. Test one meaningful behavioural variable per experiment branch. Define pass/fail criteria before merging. Revert failed experiments instead of stacking unrelated fixes.
