# Contract · Content Data Schema

> Status: **DRAFT v0** · Owner: A1 (schema structure) + D1 (field semantics)
> Milestone that needs it: M1 · Depended on by: E1 / D1 / V1 / C1
> Single source of definition: `packages/protocol/src/content/*.ts` (Zod) → generates JSON Schema → validates `packages/content/**/*.json`

---

## 1. Why content has to be data

Constitution, article 3 — numbers live in data, not in code: **frame data, drop tables, recipes and text are not compiled into source.**

Three reasons, in order of importance:

1. **D1 does not need E1 to change a number.** Tuning feel takes dozens of iterations; going through "raise a task → write code → review → merge" every time will never converge.
2. **The diff of a value change is readable.** `"hitstop_frames": 4 → 5` is understood at a glance; the same change buried in TypeScript leaves a reviewer unable to see what it affects.
3. **Machines can check it.** JSON Schema can assert "every attack action has a vfx_id and that id exists". Code cannot.

**The test**: if D1 wants to change this value, does he need to open a PR against a `.ts` file? If yes, the value is in the wrong place.

---

## 2. Directory layout

```
packages/content/
├─ combat/
│  ├─ frames/<character>.json     # frame data, frame for frame against feel-spec.md §4
│  ├─ hitstop.json                # HitKind → hitstop frames and scope
│  ├─ actions/<character>.json    # action definitions (including the Juice Six references)
│  └─ enemies/<archetype>.json    # enemy actions and telegraph frames
├─ characters/<id>.json           # character base attributes, old wounds, muscle memory slots
├─ items/                         # equipment, materials, consumables
├─ recipes/                       # forging and crafting recipes
├─ dungeons/<id>.json             # floor count, room pools, enemy mix, drop tables
├─ economy/                       # price curves, faucet/sink coefficients (M5)
└─ text/zh-CN/*.json              # all text. Chinese string literals are forbidden in code
```

---

## 3. The core schema: an attack action

```jsonc
{
  "id": "lu_light_1",                 // globally unique, snake_case
  "character": "lu_laosan",
  "displayNameKey": "action.lu_light_1",   // points into text/; never write Chinese inline

  // —— frame data: must match docs/01-game/feel-spec.md §4 exactly (CI validates both directions) ——
  "startup": 5,
  "active": [6, 8],
  "recovery": 9,
  "cancelWindow": [12, 20],
  "staminaCost": 0,

  // —— adjudication ——
  "dmgMult": 1.00,
  "poiseDmg": 8,
  "dmgType": "slash",
  "hitKind": "light",
  "hitbox": { "shape": "capsule", "offset": [0, 900, 1200], "radius": 500, "height": 1400 },

  // —— Juice Six: all six are mandatory; miss one and schema validation fails ——
  "juice": {
    "hitstopRef": "light",           // looked up in hitstop.json; never hard-code the frame count
    "shakeAmpPx": 2,
    "shakeFrames": 4,
    "vfxId": "hit_slash_s",
    "sfxId": "sfx_hit_flesh_s",      // must have ≥3 variants
    "dmgPopupStyle": "normal",
    "flashFrames": 3,
    "flashColor": "pal_38"           // must be an index into the 40-colour palette
  }
}
```

### 3.1 Why `juice` is mandatory rather than optional

Because an optional field will certainly get skipped. Everybody remembers to fill it in for the 8 actions in M1; by the 60th action in M6 somebody will have forgotten. At that point the symptom is "this move feels off somehow, I can't say why", and it is extremely expensive to track down.

**Making it mandatory at the schema level = that class of bug cannot exist in this project.** That is more reliable than any amount of review.

---

## 4. Referential integrity (CI assertions)

`tools/gates/content-lint.ts` checks every cross-reference in the content data:

| Rule | Notes |
|---|---|
| `vfxId` exists | A matching asset exists under `assets/vfx/` |
| `sfxId` exists and has ≥3 variants | One sound played over and over sounds cheap |
| `flashColor` is in the palette | See the 40-colour constraint in `art-bible.md` |
| `hitstopRef` is a valid HitKind | See `combat-events.md §3` |
| `displayNameKey` exists in `text/zh-CN/` | Stops `action.xxx` placeholders shipping to players |
| Frame data agrees with feel-spec | Both directions: in the document but not the JSON → red; in the JSON but not the document → red |
| Drop table item ids exist | Stops a drop table producing nothing |
| Recipe material ids exist and are obtainable | **Obtainability check**: every material must have at least one source, otherwise the recipe is dead |
| No orphan data | Defined but referenced nowhere → warning (not red), listed in `board/drift.md` |

> The last two matter most. In a Fantasy Westward Journey-style economy, a single unobtainable material silently kills an entire production chain,
> and in game that shows up as "nobody seems to make this recipe" — which can go unnoticed for months.

---

## 5. Hard constraints

1. **Chinese string literals are forbidden in code.** CI scans `packages/*/src/` with a regular expression; a match is red. (Exception: comments.)
2. **Magic numbers are forbidden in code.** Any constant that enters a damage, probability or price calculation must come from `content/`.
3. **The content package depends on no code package.** It is pure data. CI checks that its `package.json` has no dependencies.
4. **All ids are globally unique**, including across files.
5. **Every value change states "why" in the PR description.** Combat values live under `packages/content/combat/`, which the ownership table assigns to D1, so the lane gate already refuses a combat value change from anyone else.

---

## 6. Questions that must be answered before freezing

| # | Question | Answered by | State |
|---|---|---|---|
| 1 | With this schema, can we express an action with a conditional window, such as Su Jiuniang's "backstab within 30 frames of a misstep"? | D1 | ⬜ |
| 2 | What data fields does the enemy "attack token" mechanic need (at most 2 enemies adjudicating at once on screen)? | E1 | ⬜ |
| 3 | For procedural / AI-generated assets, can the metadata they produce go straight into the `juice` fields? | V1 | ⬜ |
| 4 | Does economy data (M5) use this same schema system or a separate one? | C1 | ⬜ |
| 5 | Is any field here present because "I guess we will need it later"? Delete it. | A1 | ⬜ |

---

## 7. Change history

| Version | Date | Change | ADR |
|---|---|---|---|
| v0 | 2026-08-20 | First draft | — |
