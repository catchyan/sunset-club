# Sunset Club

A four-player cooperative action role-playing game in 3D pixel art, for Steam.

Combat and structure follow Shining Soul II. The economy has the depth of Fantasy Westward
Journey. The subject is heroes in twilight.

Your characters are past their best. A blade instructor whose wrists no longer hold a guard.
A former lead dancer who still knows exactly where the beat is. An exiled talisman-maker
whose hands shake. A guard captain with one leg. Stamina falls across a career and never
comes back, and no amount of playing changes that.

What does not decline is Craft — and Craft is only ever gained. So the game cannot be won by
grinding. It is won by precision, by coordination, and by what one character passes to the
next. When a character retires, they become a mentor, and what they knew becomes the next
character's starting point.

---

## Two repositories

This one holds the game. [`sunset-studio`](https://github.com/catchyan/sunset-studio) holds
how the team works.

```
sunset-studio    the constitution, the roles, the gates, the tooling
    │
    │  pinned in .studio-version, mirrored read-only into docs/_studio/
    ▼
sunset-club      this game: design, code, content, milestones
```

The separation is deliberate. Games are output; a team that can build them repeatedly is the
asset, and it only stays an asset if it lives somewhere no single game can bend it.

`docs/_studio/` is read-only and CI verifies it against the upstream tag on every pull
request. To change the framework, change it upstream and move the pin here.

---

## Where to start

- **An agent joining the team:** [`AGENTS.md`](AGENTS.md), then your role card in
  `docs/_studio/docs/02-roles/`, then `/sop-task`. Nothing else is required reading.
- **Understanding the game:** [`docs/00-charter/vision.md`](docs/00-charter/vision.md), then
  [`docs/01-game/gdd-core.md`](docs/01-game/gdd-core.md).
- **Understanding the economy:**
  [`docs/01-game/gdd-economy.md`](docs/01-game/gdd-economy.md).
- **Understanding how it is built:**
  [`docs/02-tech/architecture.md`](docs/02-tech/architecture.md), then
  [`docs/02-tech/adr/INDEX.md`](docs/02-tech/adr/INDEX.md) for why.
- **What is happening right now:** [`board/backlog.md`](board/backlog.md) for what is
  queued; `node docs/_studio/tools/board/status.mjs` for where everything stands.

## State of the project

Milestone zero. The pipeline is being built; there is no game to play yet.

Progress is not tracked in a status file anywhere. It is read from git and CI, because a
status file is a second answer to a question that already has one, and it is always the
stale one.

## Stack

TypeScript strict · Three.js · deterministic ECS simulation · authoritative server ·
pnpm workspace · Vitest · Electron for Steam.

The simulation package imports no DOM, no rendering, no network, and no filesystem, and CI
enforces that. It is what makes replay tests and server authority possible at the same time.
