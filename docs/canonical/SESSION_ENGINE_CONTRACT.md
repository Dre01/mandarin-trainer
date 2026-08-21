# Session Engine Contract

## Core rule

**The application/orchestrator chooses the pedagogy. The Voice model improvises conversation inside the assigned pedagogy.**

The Voice model must not become a generic tutor that decides what to study next.

## Required session payload

A Voice training/calibration session operates from an application-generated payload defining the relevant targets, modes, listening range, function/scenario where applicable, and correction/evidence policy.

If the payload is invalid or empty in a way that prevents the intended session, fail clearly rather than asking the Voice model to invent curriculum.

## Important distinction: invariant vs mechanism

Canonical invariant:

- session content/trajectory comes from the app/orchestrator;
- the learner's greeting must not cause the model to replace that trajectory with a menu or a self-selected lesson;
- Band 1 input must remain comprehensible and graded.

**Not yet canonical:** the exact technical startup mechanism.

An app-injected `sendMessage()` control signal, an instruction-only startup, or another mechanism may be tested. Do not adopt one merely because it appeared in a previous roadmap. Preserve whichever mechanism empirically maintains the known-good tutor quality with the least complexity.

## Startup behaviour target

At the beginning of a normal session:

- do not ask “what would you like to practise?” when a session has already been selected;
- do not offer scenario/chat/vocabulary menus unless the product intentionally introduces that feature later;
- a greeting such as `Hello` or `Nǐ hǎo` may be acknowledged naturally but should not replace the assigned session;
- do not open Band 1 training with several sentences of unexplained Mandarin beyond the learner's evidenced/assigned language;
- keep initial teacher turns compact and begin the assigned work.

Whether extra startup controls are needed should be established experimentally, especially when testing Mini.

## Comprehensibility

Prefer Mandarin that is already evidenced or currently assigned. New language should be introduced/grounded before expecting comprehension. Simplify or briefly use English when necessary.

Controlled difficulty is preferred over immersion-by-confusion.

## Turn economy

The tutor should generally be concise:

- one pedagogical action at a time;
- minimal motivational filler;
- minor correction → brief model/retry → continue;
- longer explanations only for repeated/systematic issues or learner request.

The baseline occasionally emits process narration. Removing that is a future isolated prompt experiment, not a reason to rewrite the whole instruction contract.

## Retrieval before rescue

Allow the learner time to search. Progress through the hint ladder instead of immediately supplying answers.

## Correction

Near-total correction remains canonical. Minor errors are cheap; systematic errors receive focused intervention. Resume the conversation promptly.

## Modes and recycling

Acquisition, retrieval, manipulation, listening, simulation, conversation, and testing are orchestrated modes, not a startup menu. Targets should recur after interference/delay and in varied contexts.

## Listening

Begin at assigned clarity/speed and adapt from evidence. Do not equate slow-textbook comprehension with listening mastery.

## Evidence reporting

Voice reports observations; deterministic application logic owns mastery state.

## Session boundaries

The baseline has no special short-session truncation policy. Short Realtime resets are a cost hypothesis to test later. Do not introduce session-lifetime/truncation changes in the same experiment as model or prompt changes.
