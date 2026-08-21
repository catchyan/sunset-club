# Project Vision · Sunset Club

> Status: DRAFT v0.1 · Owner: the human producer · Changes require human approval
> This file is the project's **first truth**. Where any design, code, art, or economy decision conflicts with it, this file wins; if this file itself has to change, that goes through the ADR process and needs human approval.

---

## In one line

Four old-timers whose bodies are giving out and whose craft is not, walking back into the Delve.

## Elevator pitch

Sunset Club is a 3D pixel-art, four-player online action role-playing game. You do not play the chosen one. You play someone who **used to be somebody** — a retired royal blade instructor, a dancer who once headlined in three cities, an old talisman-maker expelled from his school, a former guard captain with one ruined leg. Their Might, Agility and Endurance decline a little every day, and the decline does not reverse; their Craft, their judgement and their read on each other only ever grow.

The tension the whole game rests on: **you cannot win by grinding. Only by precision, by coordination, and by Lineage.**

When a character gets too old to hold a sword, he does not die — he Retires to a deck chair back at the Club and becomes a Mentor. He passes on his Memories, what he learned the hard way about his Old Wounds, and part of his Renown. This Lineage is both where the story lands and the heart of the entire economy.

## Intent and tone

**Heroes in twilight.** Not misery, not comedy — **restrained romance**.

Reference points:
- Mood: the bleakness of *No Country for Old Men*; the last shred of dignity a veteran keeps in *Mad Max*; the ordinary street-level warmth of *My Own Swordsman*.
- Play: *Shining Soul II* (GBA) — four-player co-op, complementary classes, Force Link combination attacks, equipment that must be identified, three ores forged by Purity and arrangement.
- Economy: *Fantasy Westward Journey* — few faucets and many sinks, an anchor on output per unit of time, the account itself as the asset, and probability plus content updates stretching inflation out indefinitely.

**Three slopes we must not slide down** (written into the constitution; anyone may veto a proposal on these grounds):
1. **Sliding into comedy.** Old age as a subject turns into cheap laughs very easily. Humour is allowed here, but it has to come from dignity, never from mocking the decline itself.
2. **Sliding into despair.** Decline is a mechanic, not a punishment. Every step of decline must open a door at the same time — a new build direction, a new Memory to recall, a new chance at Lineage.
3. **Sliding into stat inflation.** This game's depth comes from **choices** and **relationships**, not from bigger numbers. Any "+10% damage" style design needs a separate justification.

## Who it is for

- People who have played feel-first ARPGs — *Diablo II*, *Shining Soul*, *Witch Spring* — and are particular about how a hit lands.
- People who have spent time studying the economy in *Fantasy Westward Journey*, *EVE* or *Path of Exile*, and have played in-game merchant.
- People with a settled group of 3–4 who are willing to get together and play two or three evenings a week.
- People to whom "being over thirty" means something.

## Target platform and shape

| Dimension | Decision | Notes |
|---|---|---|
| Launch platform | Steam (PC / Windows first) | Electron + steamworks.js wrapping the web stack |
| Tech stack | TypeScript + Three.js + authoritative server | The first version runs in a browser, which makes agent-driven verification straightforward |
| Multiplayer | Persistent accounts + one shared server-wide economy + 4-player party runs | 300–1000 CCU per server as the target |
| Business model | Buy-to-play + seasonal cosmetics (no cash trading between players) | The economy is a **closed loop in game currency only** |
| Language | Simplified Chinese first, English second | All text goes through i18n keys, never hard-coded |
| Release cadence | Early Access → 1.0 | No deadlines; quality and taste come first |

## What counts as having made it

Success criteria in priority order. If the previous one is not met, the next one is meaningless.

1. **Feel**: one person with a controller, no story whatsoever, cutting down three trash mobs — ten minutes in, they still do not want to put it down.
2. **Coordination**: four people finish one fight, and afterwards somebody says "that bit we just pulled off was great".
3. **Look**: a single static screenshot posted to social media, and a stranger asks "what game is this?"
4. **Economy**: a player writes a "Silver market report for the week" on a forum, unprompted, and the analysis is correct.
5. **Lineage**: a player screenshots a character's Retirement and posts it, with a caption that carries something.

These five are the final standard the milestone gates judge against (see `docs/04-plan/roadmap.md`).

## Non-goals (explicitly not doing)

- No open world. A Delve, a town, and the Club as a home base — three kinds of location is enough.
- No PvP arena (at least not before 1.0). The stability of the economy comes before adversarial content.
- No mobile (before 1.0). The stack keeps a port possible, but the PC experience will not be sacrificed for it.
- No cash trading, NFTs or blockchain. The closed economic loop may go arbitrarily deep, but it never connects to real currency.
- No monetisation designed to pressure players into paying. Seasons sell cosmetics only, and cosmetics never affect readability.

## Vocabulary (the formal terms live in glossary.md)

The core proper nouns in this document are used project-wide with no synonyms substituted:
**Club / Active / Mentor / Craft / Stamina (the attribute group) / Vigor (the daily resource) / Old Wound / Memory / Duet / Rapport / Lineage / Legacy / Renown / Silver / Delve Permit**.
