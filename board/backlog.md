# Backlog

The queue. Owned by P0. Ordered — the top item is the next one taken.

Where each task stands is derived (`node tools/board/status.mjs`); what each task is lives in
its card. This file answers only "what next, and in which order".

The envelope gate rejects any pull request whose task is not listed here. A card with no
backlog entry means somebody chose their own work, which is how a milestone quietly becomes
a different milestone.

---

| # | Task | Title | Owner | Milestone |
|---|---|---|---|---|
| 1 | T-002 | Everything the first agent will read, made true | A1 | M0 |
| 2 | T-003 | The workspace, and the eight steps it switches on | A1 | M0 |
| 3 | T-004 | Watch every gate fail once | Q1 | M0 |

A task leaves this table when it merges. Its card stays, and where it stands is derived; a
finished row here would be a second answer to a question `status.mjs` already answers, and the
two would disagree within a week.

T-003 is second rather than first because T-002 is what makes the instructions T-003 follows
correct. T-004 can run alongside either.

---

## Not scheduled

Candidates for M0 dispatch. No cards yet, so no commitments yet.

- Hello-triangle vertical slice: one screen, one command, the whole pipeline end to end.
- `tools/bootstrap/`: one command rebuilds the environment on a blank Linux machine. Named in
  the M0 exit condition and the only one of the four nobody can currently check.
- Freeze the combat-events contract at v1, once the five questions in its section 6 have
  answers. M1 cannot be dispatched against a draft contract, and the contract says so itself.
- Settle the two open items in `board/drift.md`: which meter the art bible's HUD row means,
  and where the eight-frame freeze belongs. Both are small; both would sit on screen or in the
  feel of every fight for months if guessed wrong.

Keep this section short. A backlog nobody prunes becomes a place where ideas go to look
busy, and reading it stops being worth the time.
