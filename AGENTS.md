# AGENTS.md · read this before touching anything

**Sunset Club** — a four-player cooperative action role-playing game in 3D pixel art.
Combat and structure follow Shining Soul II; the economy has the depth of Fantasy Westward
Journey. The subject is heroes in twilight: a retired blade instructor, a former lead
dancer, an exiled talisman-maker, a guard captain with one leg. Bodies in decline, skill
intact. Players cannot win by grinding — only by precision, coordination, and what they pass
on.

TypeScript, Three.js, an authoritative server, packaged for Steam.

---

## This repository has two layers

| | Where | Rule |
|---|---|---|
| Framework | `docs/_studio/` | **Read-only.** A byte-for-byte mirror of `sunset-studio` at the version in `.studio-version`. CI verifies it every time. |
| Project | everything else | This game. |

To change how the team works: open a pull request in the studio repository, cut a release,
then move `.studio-version` here. Never edit the mirror. The gate compares it against the
upstream tag, so editing a file and its manifest entry together does not help.

---

## Before you start, answer three questions

In the first paragraph of your reply. Cannot answer one? Do not start — ask P0.

1. Which files did I read? (exact paths)
2. Which globs may I change? (`docs/03-process/ownership.md`)
3. What is my acceptance command, and what does passing it prove?

---

## Red lines

1. **Do not edit outside your lane.** Out-of-lane pull requests are rejected without the
   content being read.
2. **Do not edit `docs/_studio/`.**
3. **Do not push to `main`.** Everything goes through a pull request.
4. **Do not change** `docs/00-charter/vision.md`, or anything marked `Status: FROZEN`.
   Those need an ADR.
5. **Do not approve your own work.**
6. **Do not fabricate evidence.** A sample of finished work is re-run in a clean
   environment. This is the one offence with no second chance.
7. **Stop at three failed attempts.** Write a blocker report. There is no fourth.
8. **Pull the andon cord** for: a red `main`, two contradicting specifications, a violated
   frozen contract, or work resting on an assumption now known to be false. Pulling
   unnecessarily is never penalised; failing to pull is.

---

## A work session

```bash
cd /workspace/lanes/<your-code>
git fetch origin && git rebase origin/main
# read every file listed in section 2 of your task card
# answer the three questions
git switch -c lane/<CODE>/T-XXX
# run the acceptance command and watch it fail
# implement, committing in small steps
# run it again, capture the evidence pack
# open the PR, request the reviewer named on the card
```

There is no status to update anywhere. Where your task stands is read from git:

```bash
node docs/_studio/tools/board/status.mjs
```

## Commits

```
<type>(<scope>): <subject> [T-XXX]
```

`feat` `fix` `docs` `refactor` `test` `chore` `perf` `content` `art`. Scope is a package or
module — `sim`, `client`, `econ`, `board`. **CI rejects a commit without `[T-XXX]`**, and the
task must be on `board/backlog.md`.

---

## Code rules

- TypeScript strict. An `any` carries a comment saying why.
- `packages/sim` imports no DOM, no Three.js, no network, no filesystem. Checked in CI.
- No `Math.random()` — use the seeded generator in `packages/shared`. No `Date.now()` — use
  the tick counter. Determinism is what makes replay tests and server authority possible.
- Numbers live in `packages/content`, never in source.
- No display strings in source. Localisation keys only. Checked in CI.
- Comments say **why** — a constraint, a trade-off. Not what the code does, and never what
  this change is or who asked for it.
- At most 400 changed lines and 25 files of code per pull request.

---

## The shared machine

Every agent works on one filesystem with one set of ports. Seeing another agent's files does
not mean you may change them, and anything global needs a lock:

```bash
node docs/_studio/tools/lock.mjs acquire <resource> <your-code> "<why>"
```

Locks are git tags — the push wins or fails, so two agents cannot both hold one. Release
immediately when done. See `/sop-lock`.

**Uncommitted work is not saved work.** The machine can be reset. Commit small, push often.

---

## Where things are

| Question | File |
|---|---|
| What is this game? | `docs/00-charter/vision.md` |
| What does this word mean? | `docs/00-charter/glossary.md` — game words; process words are in the mirror |
| What am I supposed to do right now? | `board/backlog.md`, then your task card |
| What is my job? | `docs/_studio/docs/02-roles/<CODE>.md` |
| Who owns which paths? | `docs/03-process/ownership.md` |
| Who is active this milestone? | `docs/03-process/staffing.md` |
| What counts as passing? | `docs/_studio/docs/03-gates/gates.md` |
| How do I do X? | `docs/_studio/docs/04-grokbot/skills/` — six SOPs, that is all of them |
| The rules that outrank everything | `docs/_studio/docs/00-charter/constitution.md` |
| How the game plays | `docs/01-game/gdd-core.md` |
| Exact frame numbers | `docs/01-game/feel-spec.md` |
| The economy | `docs/01-game/gdd-economy.md` |
| The architecture | `docs/02-tech/architecture.md` |
| Why we decided that | `docs/02-tech/adr/INDEX.md` |
| Milestones and release conditions | `docs/04-plan/roadmap.md` |

## Escalation

```
technical / architecture / interfaces  -> A1
gameplay / feel / tuning               -> D1
quality / gates / acceptance           -> Q1
environment / tooling / CI             -> O1
conflicting documents / terminology    -> S1
economy numbers                        -> C1
priority, or genuinely unclear         -> P0  -> the human
```

**Four hours to answer.** "I cannot decide, escalating up" is a complete answer. Silence is
not.
