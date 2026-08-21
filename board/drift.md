# Drift

Documents that have started disagreeing. Owned by S1, written daily at 14:00.

**Nothing is written on a clean day.** A report that says "all consistent" every day trains
everyone to skip it, and they will still be skipping it on the day it says otherwise.

Three kinds: **number** (one quantity, two values), **term** (one concept, two names, or one
name, two concepts), **reality** (a document describing what the code no longer does).

Quote both sides exactly. Do not choose a winner — the specification's owner decides.
Unresolved after 48 hours goes to P0. Two contradicting `FROZEN` specifications are an andon
pull, because code is already being written against one of them.

---

## D-2026-08-21-1 · Combat events contract is frozen in one document and draft in another

- Found: 2026-08-21, during the English rewrite
- Kind: number
- Side A: `docs/02-tech/architecture.md` — the combat-events block is labelled `FROZEN v1`
- Side B: `docs/02-tech/contracts/combat-events.md` and `docs/02-tech/contracts/README.md` —
  both say `DRAFT v0`
- Owner of the specification: @A1
- Status: CLOSED 2026-08-21

Frozen and draft are not a wording difference. One says changing it needs an ADR; the other
says change it freely, and whoever reads only one will be wrong. Resolved downward to
`DRAFT v0`, which is the truthful state: freezing needs the human's approval and nobody has
given it. Freezing it at v1 is on the backlog, where it belongs — the wrong way to close a
contradiction is to promote the more impressive of the two claims.

## D-2026-08-21-2 · Constitution citations point at the old numbering

- Found: 2026-08-21
- Kind: reality
- Side A: several game and technical documents cited constitution articles 8, 11, 15, 17 and 18
- Side B: the mirrored constitution at v2.0.0 numbers its articles 0 to 14
- Owner of the specification: @S1
- Status: CLOSED 2026-08-21

Five citations, remapped one at a time against what each sentence was actually claiming
rather than by arithmetic. Three had a successor: articles 7, 9, 2 and 3. Two cited an
article that v2.0.0 deleted — the power to delete, and feel as a hard metric — and those
sentences now stand on their own reasoning, because a citation of a deleted article is worse
than no citation: it borrows authority that no longer exists and nobody checks.

## D-2026-08-21-3 · Economy document points to a section that does not exist

- Found: 2026-08-21
- Kind: reality
- Side A: `docs/01-game/gdd-economy.md` §3, salvage row — "see 6.3"
- Side B: section 6 of that document has only 6.1 and 6.2
- Owner of the specification: @C1
- Status: CLOSED 2026-08-21

There was no section 6.3 in the Chinese original either, and no salvage rate anywhere in the
document. The pointer was hiding a gap rather than a renumbering, so it became open question
Q6 with the band it has to fall in. A dangling reference reads as "somebody covered this".

## D-2026-08-21-4 · One bar, two possible meanings

- Found: 2026-08-21
- Kind: term
- Side A: `docs/01-game/art-bible.md` §8 lists a HUD bar among otherwise player-side
  resources, which reads as **Endurance**
- Side B: the glossary reserves **Poise** for the enemy break meter, and the Chinese source
  word was the one the glossary maps to Endurance
- Owner of the specification: @V1, with @D1
- Status: OPEN

Rendered as Endurance during the rewrite. If that bar is in fact the target's break meter,
the art bible needs the other word — and the two are on opposite sides of the screen, so
the mistake would survive a long time before anyone noticed.

## D-2026-08-21-5 · Sublinear growth stated as a superlinear formula

- Found: 2026-08-21
- Kind: number
- Side A: `docs/01-game/gdd-economy.md` §4.1 describes mentor upkeep as growing sublinearly
  against `n²`, in practice `n^1.4`
- Side B: `n^1.4` is superlinear in `n`; §8 of the same document says "faster than linear"
- Owner of the specification: @C1
- Status: CLOSED 2026-08-21

The exponent was right and the prose was wrong. §4.1 now states both curves — income scales
with `n`, upkeep with `n^1.4` — because the whole point of the mechanism is the gap between
them, and a reader who has to infer the comparison will infer it wrongly half the time.
