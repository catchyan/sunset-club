# Documentation map

Two layers. **Framework** is mirrored read-only from the studio; **project** is this game.

If a document would still be true for a completely different game, it belongs upstream.

---

## Framework · `docs/_studio/` — read-only

| Question | File |
|---|---|
| The rules that outrank everything | `docs/_studio/docs/00-charter/constitution.md` |
| Why the studio exists | `docs/_studio/docs/00-charter/studio-charter.md` |
| Process vocabulary | `docs/_studio/docs/00-charter/glossary.md` |
| How a day runs | `docs/_studio/docs/01-framework/framework.md` |
| What is scheduled, and who owns it | `docs/_studio/docs/01-framework/cadence.md` |
| Role cards, one per role | `docs/_studio/docs/02-roles/` |
| What counts as passing | `docs/_studio/docs/03-gates/gates.md` |
| The ownership table format | `docs/_studio/docs/03-gates/ownership-schema.md` |
| The six SOPs | `docs/_studio/docs/04-grokbot/skills/` |
| Setting up the team | `docs/_studio/docs/04-grokbot/setup.md` |
| Scheduled routines | `docs/_studio/docs/04-grokbot/routines.md` |

Never edited here. Changes go upstream and arrive by moving `.studio-version`.

---

## Project

### Charter · `00-charter/`

| File | What |
|---|---|
| `vision.md` | What this game is, who for, what success is, what we are not doing. Human-owned |
| `glossary.md` | Game vocabulary. One definition per term, no synonyms |

### Design · `01-game/`

| File | What |
|---|---|
| `gdd-core.md` | The loop, the classes, retirement and lineage |
| `gdd-world.md` | The world, the characters, what is true about them |
| `gdd-encounters.md` | Delve structure, enemies, encounter design |
| `gdd-economy.md` | Currencies, sinks, faucets, services between players |
| `feel-spec.md` | Frame data. The numbers that decide whether combat is any good |
| `art-bible.md` | The look, as rules a linter can check |
| `audio-bible.md` | Sound events, mix budget, loudness targets |
| `econ-dashboard.md` | Which economy numbers are watched, and their healthy bands |
| `telemetry-spec.md` | What is measured in play, and why each field exists |

### Technology · `02-tech/`

| File | What |
|---|---|
| `architecture.md` | How the pieces fit together |
| `contracts/` | Interfaces and schemas. A `FROZEN` one changes only through an ADR |
| `adr/` | Decisions, each with the condition that would reverse it |
| `dependency-graph.md` | Which package may import which. Enforced in CI |
| `infra.md` | Environments, CI, deployment |
| `backup.md` | What is backed up, and the restore that has actually been tested |

### Process · `03-process/`

| File | What |
|---|---|
| `ownership.md` | Paths to owners. The only input to the lane gate |
| `staffing.md` | Which roles are active when, and the role-card placeholder values |

### Plan · `04-plan/`

| File | What |
|---|---|
| `roadmap.md` | Milestones, each with an observable release condition |

---

## The board is not documentation

`board/` is working state, not reference. Only two things there are written by hand: the
queue (`backlog.md`) and the envelopes (`tasks/`). Everything else is derived:

```bash
node tools/board/status.mjs   # where every task stands
node tools/board/stall.mjs    # lanes that have stopped, and nothing else
```
