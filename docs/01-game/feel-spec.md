# Feel Spec · Frame-Data Contract

> Status: DRAFT v0.1 · Owner: Design Director (D1) · **The tables in this file are a contract, asserted automatically by CI**
> Baseline frame rate: **60 FPS**. 1 frame = 16.67ms. Logic tick = 30Hz (1 tick = 2 frames).
> Every frame count here has matching data in `packages/content/combat/frames/*.json`; CI checks this document and the data files against each other.

---

## 0. Why feel is written as tables

Feel is a measurement, not an opinion. "The hits should land hard" is not a specification, it is noise — and the documents gate rejects it as unmeasurable wording. A specification looks like this:

> Light attack, first hit: 5 frames of startup, active frames 6–8, 9 frames of recovery, cancellable into the second hit from frame 12.

Only in that form can E1 implement it, CI assert it, Q1 accept it, and anyone who breaks it be caught.

---

## 1. Non-negotiable global metrics

| Metric | Target | Ceiling | How it is measured |
|---|---|---|---|
| **Input → first frame on screen** | ≤ 1 frame | **≤ 2 frames** | inject input headless, compare screenshots frame by frame for the first changed pixel |
| Input buffer window | 8 frames | — | a press up to 8 frames early is recorded and executed the instant it becomes legal |
| Input to server acknowledgement (local, 100ms RTT) | — | ≤ 8 frames (prediction included; not perceptible to the player) | network test rig |
| Frame rate (1080p, 4 players, screen full of enemies) | 60 | 99th percentile not below 55 | performance benchmark |
| Load: main menu → able to act | ≤ 3 seconds | ≤ 5 seconds | automated timing |
| Scene transition (between floors) | ≤ 1.5 seconds | ≤ 2.5 seconds | automated timing |

**Over the ceiling = CI red = no merge.** No exceptions, and no "leave it like this for now".

---

## 2. Juice Six

**Every action that can connect must carry all six of the following. Miss one and the content data fails schema validation.**

| # | Item | Field | Default | Notes |
|---|---|---|---|---|
| 1 | **Hitstop** | `hitstop_frames` | see §3 | frames for which the two parties (or everything) freeze at the moment of contact |
| 2 | **Screenshake** | `shake_amp_px`, `shake_frames` | 2px / 4 frames | amplitude in pixels (at this render resolution 1px reads clearly) |
| 3 | **VFX** particles | `vfx_id` | required | the hit effect; must match the weapon material |
| 4 | **SFX** | `sfx_id` | required | ≥3 variants in rotation |
| 5 | **Damage number** | `dmg_popup_style` | required | three styles: critical, Poise break, ordinary |
| 6 | **Hit flash** | `flash_frames`, `flash_color` | 3 frames / palette white | the struck party's material is swapped for an instant |

**Lint tool**: `tools/art-lint/juice-lint.ts`, run by `pnpm art-lint` in gate G6.

---

## 3. Hitstop table

Hitstop does more for impact than anything else on the list. By tier:

| Hit type | Freeze frames | Who freezes |
|---|---|---|
| Light attack connects | 2 | the two parties only |
| Heavy attack connects | 4 | the two parties only |
| Full charge connects | 6 | both parties + slight global slow motion (0.8×, 4 frames) |
| Parry succeeds | **8** | global (one of this game's high points) |
| Poise break | 6 | global |
| Execution connects | 12 | global + small camera push |
| Duet triggers | 10 (on the trigger frame) + 2 per hit | global |
| Player is hit | 5 | global |

**Implementation constraint (important)**: hitstop is a **render-layer concept** and does not enter `packages/sim`. sim emits a `hit_confirmed` event; the client reads the event type, looks up the table, and decides the freeze. The server never freezes, so the tick stays constant.

---

## 4. Character action frame data

### 4.1 Common actions

| Action | Startup | Active | Recovery | Cancellable from | Stamina cost |
|---|---|---|---|---|---|
| Roll | 3 | **invincible 4–16** | 8 | 20 | Agility 12 |
| Stance (entry) | 4 | — | — | — | Endurance 2/second while held |
| Parry window | — | success if an enemy attack becomes active within **6 frames** of release | 14 frames of opening on failure | — | Endurance 15 restored on success |
| Pick up | 6 | — | 4 | 8 | 0 |
| Drink a potion | 12 | takes effect on frame 12 | 10 | not cancellable | 0 |

### 4.2 Lu Laosan (Blade Instructor)

| Action | Startup | Active | Recovery | Cancel window | Damage coefficient | Poise damage |
|---|---|---|---|---|---|---|
| Light attack, hit 1 | 5 | 6–8 | 9 | 12–20 | 1.00 | 8 |
| Light attack, hit 2 | 4 | 5–7 | 10 | 12–20 | 1.15 | 10 |
| Light attack, hit 3 | 6 | 8–12 | 16 | 20–26 | 1.60 | 22 |
| Heavy attack | 11 | 12–16 | 20 | 26–32 | 2.20 | 35 |
| Charged heavy (full) | 40 (charge included) | 41–47 | 24 | not cancellable | 4.00 | 70 |
| Counter-cut (after a successful Parry) | 2 | 3–7 | 12 | 14–20 | 2.80 | 50 |

### 4.3 Su Jiuniang (Lead Dancer)
> Trait: every action is 2–4 frames faster than the Instructor's, damage coefficients are 20–30% lower, and back attacks are multiplied by 1.8

| Action | Startup | Active | Recovery | Cancel window | Damage coefficient | Poise damage |
|---|---|---|---|---|---|---|
| Light attack, hit 1 | 3 | 4–5 | 6 | 8–14 | 0.75 | 5 |
| Light attack, hit 2 | 3 | 4–5 | 6 | 8–14 | 0.80 | 5 |
| Light attack, hit 3 | 3 | 4–6 | 8 | 10–16 | 0.95 | 8 |
| Light attack, hit 4 | 4 | 5–8 | 12 | 14–20 | 1.30 | 14 |
| Sidestep (Stance) | 2 | displacement 3–8 | 5 | 7 | — | — |
| Back attack (within 30 frames of a sidestep) | 4 | 5–8 | 10 | 12–18 | 2.40 | 20 |

### 4.4 Lao Nie (Talisman-Maker) and 4.5 Zhong Bu'er (Guard Captain)
> Status: to be filled in after M1. M1 implements Lu Laosan only.

---

## 5. Rules for enemy frame data

Every enemy action must supply:
- **Telegraph**: the number of frames of unambiguous visual warning before the attack. **Minimum 10 frames**; minimum 18 for an elite or boss heavy attack.
- **Active frames** and **recovery frames**
- **Parryable flag**: `parryable: true/false`. An attack that cannot be parried must carry a **red** warning effect, so the visual language stays uniform.

**Readability, iron rules**:
1. Any attack that deals more than 30% of a health bar must have a telegraph of ≥18 frames and a sound of its own.
2. At most 2 enemies on screen may be in active attack frames at the same time, guaranteed by the AI's attack-token mechanism. This is what keeps a gang-up in the Shining Soul and Diablo lines from turning into noise.
3. Enemies may not open a melee attack from off screen.

---

## 6. Camera

| Parameter | Value |
|---|---|
| Type | perspective, FOV 27 |
| Tilt | 30° (adjustable ±5° in settings) |
| Follow damping | position lerp 0.12/frame, with a 0.5-unit dead zone |
| Combat pull-in | 8% closer within 0.4 seconds of entering combat, restored 1.2 seconds after leaving it |
| Execution / Duet | push in 15%, held for the action's duration + 0.3 seconds |
| **Pixel stability** | the camera position must **snap to the pixel grid of the render resolution**, or the image shakes at low resolution. This is the most common way 3D pixel art fails |

---

## 7. Automated assertions

Each is a root script, because CI runs root scripts. The command underneath is given so the
script can be rewritten without anyone having to guess what it was supposed to do. The full
list of scripts the gates require is in `docs/02-tech/architecture.md`.

### 7.1 Frame-data snapshot test
```
pnpm test:frames        # pnpm -C packages/sim test -- frames.snapshot.spec.ts
```
- For each action, drive sim with a fixed input sequence and record the state-machine phase on every tick
- Compare frame by frame against `packages/content/combat/frames/*.json`
- **A mismatch is a failure.** Changing frame data means changing the JSON and this document together, and stating why in the PR description

### 7.2 Input latency test
```
pnpm test:latency       # pnpm -C packages/client test:latency
```
- Headless render, inject input events, capture the render target frame by frame
- Assert that the first changed pixel occurs within ≤2 frames

### 7.3 Juice lint
```
pnpm art-lint           # runs tools/art-lint, including juice-lint.ts
```
- Scan every combat action's data; check that the six fields are all present and that the assets they reference exist

### 7.4 Performance benchmark
```
pnpm bench:combat
```
- Fixed scene (4 players + 24 enemies + a screen full of effects), run 600 frames
- Assert p99 frame time ≤ 18.2ms

**All four are gate G6, the `feel` job. If any one fails, the PR cannot merge.**

G6, not G7. G7 is the studio repository's cause-for-framework-change gate and does not run
here at all — a specification citing a gate that never runs in its own repository describes
protection nobody has.

---

## 8. The feel-tuning workflow

1. D1 changes the numbers in this document and changes `packages/content/combat/frames/*.json` to match
2. E1/E2 implement, and run the four tests in §7
3. E2 produces a playable build; D1 **plays it in person** and records the screen
4. D1 writes the subjective verdict in `board/fun-audit/<date>.md`
5. If the subjective verdict contradicts the numbers → the spec itself is wrong → change the spec and return to step 1

**Step 3 cannot be skipped.** Every number green while the game is unpleasant to play is entirely possible. The numbers guarantee the floor; playing it finds the ceiling.
