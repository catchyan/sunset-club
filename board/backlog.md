# Backlog

The queue. Owned by P0. Ordered — the top item is the next one taken.

Where each task stands is derived (`node docs/_studio/tools/board/status.mjs`); what each
task is lives in its card. This file answers only "what next, and in which order".

The envelope gate rejects any pull request whose task is not listed here. A card with no
backlog entry means somebody chose their own work, which is how a milestone quietly becomes
a different milestone.

---

| # | Task | Title | Owner | Milestone |
|---|---|---|---|---|
| 1 | T-001 | Upgrade the framework mirror to v3.0.1 | A1 | M0 |
| 2 | T-000 | Split the studio out, mount the framework, rewrite in English | A1 | M0 |

---

## Not scheduled

Candidates for M0 dispatch. No cards yet, so no commitments yet.

- Repository scaffold: pnpm workspace, TypeScript strict, the six empty packages.
- The nineteen negative gate tests from `docs/_studio/docs/04-grokbot/setup.md` step 9, each
  run once and recorded. A gate nobody has watched fail is a gate nobody knows works.
- Hello-triangle vertical slice: one screen, one command, the whole pipeline end to end.
- Freeze the combat-events contract at v1, once the five questions in its section 6 have
  answers. M1 cannot be dispatched against a draft contract.
- Settle which meter the art bible's HUD row means — see `board/drift.md`, still open. It is
  a two-word fix and a wrong guess would sit on screen for months.

Keep this section short. A backlog nobody prunes becomes a place where ideas go to look
busy, and reading it stops being worth the time.
