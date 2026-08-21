# Staffing · Sunset Club

Which roles are active when, and the values that fill the placeholders in the studio's role
cards. A role card plus this page is the complete bot description; there is no third source.

---

## Activation

| Milestone | Added | Total | Why then |
|---|---|---|---|
| M0 | P0, A1, Q1, S1, O1 | 5 | Nothing exists yet. These five build the pipeline that everything else runs through |
| M1 | D1, E1, E2 | 8 | First vertical slice: one character, one room, one enemy, one loop |
| M2 | V1, U1 | 10 | The look and the sound become rules a linter can check. Both attach to the same simulation events, so they arrive together |
| M3 | E3 | 11 | Four-player authority |
| M4 | C1, N1 | 13 | Economy and narrative arrive once there is a loop worth pricing and a world worth describing |
| M5, M6 | — | 13 | Full complement. Scope is cut before headcount is raised |

A role with no work has no lane. Staffing ahead of the work produces discussion, and
discussion resembles progress closely enough to be mistaken for it.

There is no telemetry role. Instrumentation is owned by whoever the numbers are for — C1 for
the economy, D1 for feel — because a role that owns measurement and nothing else ends up
measuring what is easy rather than what is decided by.

---

## Placeholder values

Substitute these when creating each bot from its role card.

### `{{PROJECT}}`

> Sunset Club — a four-player cooperative action role-playing game in 3D pixel art.
> Combat and structure follow Shining Soul II; the economy has the depth of Fantasy
> Westward Journey. Players are retired veterans: bodies in decline, skill intact.

### `{{TONE}}` — for D1, U1, N1

> Heroes in twilight. A former blade instructor whose wrists no longer hold a guard. A
> former lead dancer who still knows exactly where the beat is. An exiled talisman-maker
> whose hands shake. A guard captain with one leg.
>
> Three rules:
>
> 1. **No big words.** No legendary, no epic, no destiny. Veterans do not describe
>    themselves that way. They talk about weather, old injuries, and what things cost.
> 2. **Decline is not a debuff, it is the subject.** Stamina falls over a career and never
>    recovers. That is the game, not an obstacle in front of it.
> 3. **Skill is what remains.** A character who has lost half their Might can still parry
>    on the exact frame. Everything the player earns is knowledge, and knowledge does not
>    decay when the body does.
>
> The feeling to aim for is not tragedy. It is a competent person, past their peak, doing
> the thing they are still good at, in front of people who are watching.

### `{{ECONOMY}}` — for C1

> Two anchors, and everything else derives from them:
>
> - **Vigor** — the time anchor. 120 per account per day, cap 360, untradable and
>   unpurchasable. It is what stops money buying progress outright.
> - **Delve Permit** — the main sink. Bought with Silver at an algorithmic price that rises
>   when Silver supply rises. It is what stops Silver accumulating without limit.
>
> Three currencies: Silver freely tradable, Renown account-bound, Legacy settled only at
> retirement.
>
> The economy is built on player labour and service between players. Value comes from what
> one player can do for another — forging, bonesetting, escorting, writing a Codex — not
> from what the system hands out. Every faucet has a named sink; a faucet without one is a
> defect, not a generosity.

### `{{ART}}` — for V1

> PSX-era 3D geometry rendered with modern pixel discipline. Low polygon counts, hand-placed
> texels, deliberate vertex snapping.
>
> Every rule in the art bible is a number a linter can check: internal resolution, palette
> size, texel density, filtering mode, snapping grid, silhouette readability at target
> resolution. A style rule that cannot be linted will be broken, so if a rule resists being
> expressed as a check, find a proxy measurement or say out loud that it will drift.

---

## Reviewer pairings

The envelope gate rejects a card whose owner and reviewer are the same. These are the
defaults; P0 may name someone else on the card.

| Author | Default reviewer | Why |
|---|---|---|
| E1 | A1 | Determinism is an architectural property |
| E2 | D1 | Whether it feels right is a design judgement |
| E3 | A1 | Authority and protocol are architecture |
| V1 | D1 | Art serves legibility in play |
| U1 | D1 | Audio serves the same |
| C1 | Q1 | Economy changes need someone outside the economy |
| N1 | S1 | Consistency with world facts |
| D1 | Q1 | |
| A1 | Q1 | |
| P0, Q1, S1, O1 | Q1, or A1 when Q1 is the author | |

Q1 is the reviewer of last resort and never reviews its own work. When Q1 authors something,
A1 reviews it.
