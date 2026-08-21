# Architecture Decision Record Index

> Owner: A1 Architect · Format: see `/sop-adr`
> ADRs are **immutable**. When a decision turns out to be wrong you do not edit the old one; you write a new one that supersedes it. That is the only way "what we were thinking at the time" survives.

## When an ADR is mandatory

- Changing any `FROZEN` contract
- Adding or removing a major technical dependency
- Changing a performance budget, the network model, or the render pipeline
- Two bots disagreeing on the same question with a sound case on each side
- Any decision we might regret later

## When it is not needed

- Implementation detail (how to split a function, what to name a variable)
- Value tuning (that is content data; a PR is enough)
- Bug fixes

> The test: **will somebody a year from now look at this code and ask "why not the obvious approach?"** If yes → write an ADR.

---

## Index

| # | Title | Status | Date | Supersedes | Decided by |
|---|---|---|---|---|---|
| [0001](0001-threejs-over-engine.md) | Build on Three.js instead of an off-the-shelf engine | ACCEPTED | 2026-08-20 | — | the human executive producer |
| [0002](0002-colyseus-first.md) | Colyseus first for M3 multiplayer; UDP left to M4, decided on measurements | ACCEPTED | 2026-08-20 | — | the human executive producer |

**Statuses**: `PROPOSED` → `ACCEPTED` / `REJECTED` → `SUPERSEDED by ADR-XXXX`

---

## Reviewing the rollback conditions

Every ADR has a "rollback condition" section, and it must be **measurable**. A1 goes through them one by one whenever a milestone converges:

| ADR | Rollback condition | Last reviewed | Conclusion |
|---|---|---|---|
| 0001 | See §6 of the file | — | pending M1 |
| 0002 | See §6 of the file | — | pending M3 |

> An ADR with no rollback condition is not a decision. It is a belief.
