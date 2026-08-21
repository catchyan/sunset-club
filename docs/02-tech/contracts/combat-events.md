# Contract · Combat Events

> Status: **DRAFT v0** · Owner: A1 Architect
> Milestone that needs it: M1 · Depended on by: E1-sim / E2-client / V1-visuals / U1-sound
> **Until this contract is frozen, nobody may start writing combat presentation code.**
> Single source of definition: `packages/protocol/src/combat-events.ts` (Zod). This document and that file are compared field by field by CI.

---

## 1. The problem this contract solves

Architectural principle 3.3: **the sim does not know that "effects" exist.** The sim adjudicates; the client makes it look good.

Without this contract, the following will certainly happen. E1 writes `playHitEffect('slash_big')` in the sim, V1 later renames the effect, the game silently stops playing it, and no test can detect it. Two weeks later D1 playtests and says "the impact is gone somehow", and then spends two days tracking it down.

With this contract: the sim emits `hit_confirmed{kind:'heavy'}` and the client looks up which effect to play. **Effects can be changed freely without touching a line of logic, and testing the logic needs no renderer.**

---

## 2. Base types

| Type | Definition | Notes |
|---|---|---|
| `EntityId` | `number` (uint32) | Entity ID. 0 is reserved for "none" |
| `Tick` | `number` (uint32) | Logic frame number, 30Hz |
| `Vec3` | `{x:number, y:number, z:number}` | Fixed point, units of 1/1024. Used for positioning effects |
| `HitKind` | See §3 | Determines the hitstop tier |
| `DamageType` | `'slash' \| 'pierce' \| 'blunt' \| 'inner'` | Determines the sound material and the effect family |
| `WoundId` / `MemoryId` / `DuetId` | `string` (content data primary key) | Must exist in `packages/content/` |

**Why `Vec3` is fixed point**: architectural principle 3.2 — floating point entering the sim breaks determinism. The coordinates in an event are only consumed by the presentation layer, but the events themselves feed the replay hash, so they must be deterministic.

---

## 3. The HitKind enum (one-to-one with feel spec §3)

| Value | Trigger | Corresponding hitstop |
|---|---|---|
| `light` | A light attack connects | 2 frames, attacker and target only |
| `heavy` | A heavy attack connects | 4 frames, attacker and target only |
| `charged` | A fully charged attack connects | 6 frames + a global 0.8× slowdown for 4 frames |
| `counter` | A post-parry counter connects | 8 frames, global |
| `poise_break` | This hit broke the Poise meter | 6 frames, global |
| `execute` | An execution connects | 12 frames, global + a slight camera push-in |
| `duet` | A Duet segment connects | 2 frames per segment |
| `chip` | Chip damage after a parry or block | 1 frame, target only |

**CI assertion**: the set of enum values in this table must be identical across three places — this table, the rows in `docs/01-game/feel-spec.md §3`, and the keys of `packages/content/combat/hitstop.json`. Anything added to one without the others → red.

---

## 4. Event definitions

Fields common to every event: `t` (the discriminant tag) and `tick` (the logic frame it happened on).

### 4.1 Hits

```ts
{ t: 'hit_confirmed',
  tick: Tick,
  attacker: EntityId,
  target: EntityId,
  kind: HitKind,
  dmgType: DamageType,
  dmg: number,            // final damage, all reductions already applied
  crit: boolean,
  poiseDmg: number,       // poise damage dealt by this hit
  pos: Vec3,              // point of impact, where the effect spawns
  dir: Vec3,              // impact normal, sets the spray direction and knockback facing
  fromBehind: boolean }   // backstab, Su Jiuniang's core mechanic; the client needs a different effect
```

```ts
{ t: 'hit_blocked', tick, attacker, target, chipDmg: number, pos: Vec3 }
{ t: 'attack_whiffed', tick, attacker, actionId: string }  // a whiff, used for the "weight" sound
```

### 4.2 Offence and defence state

```ts
{ t: 'parry_success', tick, who: EntityId, against: EntityId }
{ t: 'parry_failed',  tick, who: EntityId }                  // parry window missed, 14 frames of exposure
{ t: 'poise_broken',  tick, target: EntityId, by: EntityId } // enters the executable state
{ t: 'poise_recovered', tick, who: EntityId }
{ t: 'stance_entered', tick, who: EntityId, stanceId: string }
{ t: 'stance_exited',  tick, who: EntityId, stanceId: string, reason: 'input'|'stamina'|'stagger' }
```

### 4.3 Mechanics specific to this game

```ts
{ t: 'duet_triggered', tick, duetId: DuetId, members: EntityId[], level: 1|2|3 }
{ t: 'duet_segment',   tick, duetId: DuetId, seg: number, by: EntityId }
{ t: 'wound_flared',   tick, who: EntityId, woundId: WoundId, severity: 1|2|3 }
{ t: 'memory_recalled',tick, who: EntityId, memoryId: MemoryId }
{ t: 'vigor_spent',    tick, who: EntityId, amount: number, reason: string }
```

> Old Wounds (`wound_flared`) and muscle memory (`memory_recalled`) are the mechanical carriers of this game's "heroes in twilight" theme.
> They **must** have their own distinct sight and sound. This is not optional decoration; it decides whether the player perceives the theme at all. See `docs/01-game/gdd-core.md §5`.

### 4.4 Lifecycle

```ts
{ t: 'entity_spawned', tick, id: EntityId, archetype: string, pos: Vec3 }
{ t: 'entity_died',    tick, id: EntityId, killer: EntityId, overkill: number }
{ t: 'loot_dropped',   tick, from: EntityId, itemInstanceId: string, pos: Vec3 }
```

---

## 5. Hard constraints (violation = CI red)

1. **Events are read-only and immutable.** The client must not modify an event object and pass it on.
2. **The sim must not reference any `vfx_id` / `sfx_id` / animation name.** CI statically checks that these field names do not appear in `packages/sim/`.
3. **Events must not carry presentation parameters.** No `shakeAmount`, no `hitstopFrames`. The client obtains those by looking up `packages/content/combat/hitstop.json`.
   - Reasoning: for the same `heavy` hit, when D1 wants the hitstop moved from 4 frames to 5, that should be one JSON edit — not a change to sim code plus a rerun of the replay tests.
4. **Event order is tick order**, and within one tick events are stably ordered by emission order. The replay hash includes the event sequence.
5. **The client must silently ignore unknown event types** and must not crash. (This is the degradation behaviour on a version mismatch.)
6. **The server is authoritative**: from M3, events produced by client prediction are marked `predicted: true`, and when a server event supersedes one the effect is not played twice.

---

## 6. Questions that must be answered before freezing

> Once A1 has drafted this, each question below must get an explicit "yes" or "no" from the corresponding bot in the standing committee before it can go to the human to be frozen.

| # | Question | Answered by | State |
|---|---|---|---|
| 1 | With these events, can all six items of the Juice Six in feel spec §2 be implemented? | V1 + U1 | ⬜ unanswered |
| 2 | Is there enough information in the events to tier the hitstop? | E2 | ⬜ unanswered |
| 3 | With the event sequence feeding the replay hash, could unstable event ordering make the replay test fail at random? | E1 | ⬜ unanswered |
| 4 | Once networking arrives in M3, which of these events need to be sent down and which can the client derive locally? | E3 | ⬜ unanswered |
| 5 | Is any field here present because "I guess we will need it later"? If so, delete it. | A1 | ⬜ unanswered |

> Question 5 is the one that gets skipped. **Every extra field in a contract is one more place for a future inconsistency**, and a field added speculatively is defended forever by the argument that removing it might break something.

---

## 7. Change history

| Version | Date | Change | ADR |
|---|---|---|---|
| v0 | 2026-08-20 | First draft | — |
