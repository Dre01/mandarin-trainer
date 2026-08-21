# Mandarin Control — application specification v0.2

## Product objective

A local-first spoken-Mandarin training application that turns the canonical Band 1 curriculum into repeated, evidence-driven voice practice. It optimizes for automatic spoken retrieval, listening comprehension, conversation repair, and transfer to unfamiliar situations.

The application is **not** a generic language-learning platform and does not invent the curriculum. `src/data/band1.bundle.json` remains the source of truth.

## Non-negotiable product rules

1. **Curriculum controls content.** The model may teach, vary, and test assigned material but may not silently redefine progression.
2. **Evidence controls mastery.** The voice model records observations; deterministic application rules promote or demote targets.
3. **No character dependency.** Learner-facing Mandarin is tone-marked pinyin. English is used when pedagogically useful. Internal Hanzi fields are never rendered alone.
4. **Automaticity beats coverage.** Core-A lexemes, A1 constructions, repair chunks, and hard contrast sets receive disproportionate recycling.
5. **Hesitation matters.** Correct output after a long search is useful evidence, but it does not count as reflex-level evidence.
6. **Failure is diagnostic.** Repeated failures can demote a previously strong target so it returns to strengthening work.
7. **No streaks or XP.** The dashboard describes capability, weakness, and next work.
8. **Local-first state.** Curriculum is static JSON. Learner state is localStorage in v0.2, with explicit export/import.

## Architecture

```text
Canonical Band 1 JSON
        ↓
Curriculum loader
        ↓
Local learner state + evidence
        ↓
Deterministic session selector
        ↓
Session payload
        ↓
Voice instruction compiler
        ↓
RealtimeAgent / RealtimeSession
        ↓
Batched learning-evidence tool calls
        ↓
Deterministic mastery updater
        ↓
Local learner state
```

## API boundary

The permanent OpenAI API key never enters the browser. A tiny server endpoint calls the Realtime client-secret endpoint and returns only a short-lived client secret. The browser connects using the OpenAI Agents SDK.

The scaffold includes a local Node token endpoint for development. In production, move the same operation into a serverless function. No account system, persistent server database, or traditional application backend is required for v1.

## First-run calibration

An empty local state must **not** be treated as evidence that the learner knows nothing.

The first generated session is therefore `kind: calibration`:

- targets are hidden from the learner so answers are not primed;
- the agent samples representative Core-A vocabulary and basic constructions;
- it creates at least one genuine conversation-repair opportunity;
- it samples simple number competence, tones, and L1→L2 listening;
- failed material is recorded rather than taught during calibration;
- only actually tested targets receive evidence.

Calibration completes only if that session produced evidence. Thereafter ordinary training payloads begin.

## Screens

### Overview
Shows only decision-useful progress:
- automatic lexemes;
- active-or-better lexemes;
- active constructions;
- evidence-bearing sessions;
- Core-A automaticity;
- Core-B active coverage;
- recent evidence including rough retrieval latency.

First-run primary action: **Run baseline calibration**. Later: **Generate next session**.

### Curriculum
Searchable pinyin/English lexeme inventory. Shows priority, production state, and listening state. Internal character fields are deliberately not rendered.

### Next session
For training sessions, shows:
- acquire / strengthen / maintain lexemes;
- constructions;
- fixed/repair chunks;
- contrast set;
- communicative function;
- scenario and difficulty;
- closed system;
- pronunciation target;
- listening target.

For calibration, target identities are deliberately hidden.

### Voice session
Minimal visual surface:
- connection state;
- microphone mute;
- manual interrupt;
- end session;
- compact target reminder for training only.

Raw voice transcripts are hidden by default because transcription can contain Chinese characters and is not required for the learning UI.

### Settings
- export learner state;
- import learner state;
- reset progress;
- explain API security boundary.

## Session selection v0.2

### Principles

The selector is deterministic. It does not ask a model to decide what should be learned next.

A small explicit `FOUNDATION_ORDER` bootstraps the earliest spoken machinery so an empty learner state cannot produce six unrelated words merely because they share a curriculum cluster.

After calibration, every training payload can contain multiple evidence roles simultaneously:

1. **Strengthen** targets that are recognized/active, prioritizing repeated failure and weak fast retrieval.
2. **Maintain** automatic targets that have gone longest without evidence.
3. **Acquire** a small amount of new material, Core-A before lower-value breadth.
4. **Constructions** whose lexical prerequisites are already known **or are being acquired in the same payload**.
5. **Chunks**, especially greeting and repair language, until automatic.
6. **Contrast sets** once their members are sufficiently available.
7. **One closed system** and **one pronunciation target** until stable.
8. A communicative function and, when enough functional machinery exists, a scenario.

### Default training payload caps

- 6 new lexemes;
- 12 strengthening lexemes;
- 12 maintenance lexemes;
- 2 new constructions;
- 4 strengthening constructions;
- 2 fixed chunks;
- 1 contrast set;
- 1 closed system;
- 1 pronunciation target;
- 1 function;
- 1 scenario.

These are payload caps, **not daily quotas**. The learner can run multiple sessions.

### Scenario difficulty

Scenario difficulty rises from A→B→C as Core-A automaticity increases. Scenario D remains a deliberate transfer/assessment mode rather than ordinary early practice.

### Listening level

Listening starts L1→L2 while Core-A acoustic decoding is weak, then shifts toward L2→L3 as clear/natural listening evidence accumulates.

## Tracked target types

The learner state treats these as first-class targets:

```text
lexeme
construction
chunk
contrast
closed_system
function
pronunciation
```

Scenarios are environments rather than mastery objects in v0.2; scenario success contributes evidence to the capabilities used inside them.

## Evidence record

Each model observation can include:

```text
target type + ID
mode
correct / incorrect
independent / assisted
hint level 0–5
listening level 1–3
context ID
novel-context flag
spontaneous-use flag
latency: immediate / slight / long
pronunciation: blocked / unclear / acceptable / good
short note
```

Realtime tool calls are **batched** in small groups rather than invoked after every turn, to reduce conversational disruption.

## Mastery rules v0.2

### Recognized
- at least 2 successful observations.

### Active
- at least 3 independent successful retrievals;
- across at least 2 sessions;
- across at least 2 contexts.

### Automatic
- at least 8 independent successful retrievals;
- at least 6 of those without long hesitation;
- across at least 3 sessions;
- across at least 2 contexts;
- at least 1 spontaneous success.

### Regression
A target is not permanently safe merely because it once reached Automatic. Consecutive failures can demote it:
- repeated failures can move Automatic → Active;
- further repeated failure can move Active → Recognized.

These are software defaults. Band-graduation gates remain stricter than these item-level state transitions.

## Voice engine

The compiled RealtimeAgent instructions enforce:

- pinyin-only learner-facing script;
- concise acquisition;
- near-total correction with cheap treatment of minor errors;
- explicit intervention for systematic errors;
- retrieval before hints;
- silence before rescue;
- progressive hint ladder;
- interleaving and transformation;
- small closed-system drills;
- targeted pronunciation work embedded in speech;
- listening-speed escalation;
- scenario complications;
- free conversation;
- surprise tests;
- minimal motivational chatter.

The agent reports evidence; it does **not** declare targets mastered.

## Security and privacy

- Never put `OPENAI_API_KEY` in any `VITE_*` variable.
- Browser receives only a short-lived Realtime client secret.
- Learner progress remains local in v0.2.
- Raw transcript/history is not rendered or persisted by this scaffold.
- Development token server binds to localhost.
- Production should use a same-origin serverless token endpoint and current OpenAI API data-handling settings.

## Deliberately deferred

Do not build yet:

- accounts/authentication;
- cloud database;
- XP/streaks/badges;
- social features;
- multi-band UI;
- large analytics dashboards;
- model-generated curriculum;
- hard-gate automated pronunciation scoring;
- character-learning mode;
- complex spaced-repetition scheduling before real usage evidence shows it is needed.

## Next end-to-end milestone

1. Install dependencies in a normal networked Node environment.
2. Run `npm run validate`.
3. Run `npm run build` and fix any SDK/version type drift without changing curriculum logic.
4. Run token server + Vite.
5. Complete baseline calibration.
6. Confirm evidence tool batches update local state.
7. Generate a second session and verify it responds to the calibration evidence.
8. Run several real sessions and observe whether the selector, prompt, and evidence density feel right.
9. Only then tune thresholds or UX.
