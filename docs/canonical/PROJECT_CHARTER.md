# Project Charter — Mandarin Control

## Mission

Build a high-intensity, evidence-driven system that helps the learner reach approximately B2-like **spoken functional Mandarin** within about six months, with Mandarin usable for everyday life in China.

The target is practical spoken competence rather than formal four-skill certification.

## Success priorities

In order:

1. Function comfortably living in China.
2. Understand ordinary conversations, videos, and podcasts.
3. Sustain 30–60 minute conversations with Mandarin speakers.

Reading and writing Chinese characters are **not learning objectives**. Chinese characters may exist internally for disambiguation, dictionaries, speech tooling, or model reliability, but learner-facing language must include pinyin and must never require character literacy.

## Learning intensity assumption

The learner is willing to devote roughly 2–3 hours per day overall, including short deliberate memorisation and substantial repetition. API-powered live tutoring is only one component of that total and must be cost-controlled.

## Product mission

The app is not a generic AI tutor. It is a **curriculum-controlled practice engine** built around a finite, graded body of language and behavioural evidence.

The system must answer:

- What can the learner actually retrieve and understand?
- What is weak?
- What should be practised next?
- Has knowledge transferred beyond memorised examples?

## Non-negotiable invariants

### 1. Automaticity over nominal coverage

A word or construction does not count as meaningful progress merely because the learner has seen it or can translate it. Progress means rapid active retrieval and/or rapid listening recognition.

The desired subjective state for high-value language is closer to the automaticity of “hello” than conscious translation/search.

### 2. Generative leverage over vocabulary accumulation

High-frequency grammatical machinery, question forms, connectors, modal verbs, repair language, and reusable verbs receive more attention than low-value topic nouns.

The curriculum should maximize what the learner can **generate** and recover from, not merely how many flashcards have been encountered.

### 3. Conversation repair is a core capability

The learner must be able to stay inside Mandarin when comprehension fails: ask for repetition, slower speech, meaning, clarification, or rephrasing. Repair is a hard graduation gate.

### 4. Listening is independently trained

Known language must be decoded at increasingly natural speeds. Understanding slow textbook Mandarin is insufficient.

### 5. Transfer is required

Scenario memorisation is not mastery. The learner must use known machinery in novel contexts with missing vocabulary.

### 6. Voice is the practice engine, not curriculum authority

The model may vary examples, create natural dialogue, correct, probe, and simulate. It does not decide what the learner should study, whether the curriculum should change, or whether a target is mastered.

### 7. Evidence, not learner confidence, controls progression

Behavioural evidence includes independent retrieval, hint level, latency, listening level, spontaneous use, context diversity, pronunciation, and delayed retrieval. The deterministic mastery engine owns status transitions.

### 8. Nearly all errors should be corrected economically

Minor errors: brief correction and continue. Meaningful/systematic errors: retry or short focused intervention. Do not let correction destroy conversational flow.

### 9. Controlled novelty

The Voice tutor should prefer known and assigned language. Incidental new language must not silently expand the curriculum.

### 10. Pinyin-first learner interface

Learner-facing Mandarin uses tone-marked pinyin. Raw Hanzi transcripts should not become the teaching interface.

### 11. Cost is a design constraint

Target API spend is approximately **USD 20/month or less**. Cost reduction must preserve learning quality. The app should favour cheaper inference where adequate, terse tutor output, session resets/context management, and local/deterministic practice where live intelligence is not necessary.

### 12. No engagement theatre

Do not optimize for streaks, XP, badges, motivational chatter, or time-in-app. Optimize for acquired spoken capability.
