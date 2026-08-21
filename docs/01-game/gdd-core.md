# Core Gameplay Design · Sunset Club

> Status: DRAFT v0.1 · Owner: Design Director (D1) · Freezing requires human approval
> Governing document: `docs/00-charter/vision.md` (on conflict, the vision wins)
> Subordinate document: `docs/01-game/feel-spec.md` (the frame-data contract; this file states design intent only, the numbers in feel-spec are authoritative)

---

## 1. The game in one sentence

Four veterans whose bodies are failing take a Delve apart one floor at a time, on precision, coordination and a lifetime of Craft; when they can no longer fight they Retire, become Mentors, and hand what they know to whoever comes next.

## 2. The core loop

```
        ┌─────────────────────────────────────────────────────────────────────┐
        │                                                                     │
   CLUB (home base)                                                           │
   ├─ pick the Active, build the party                                        │
   ├─ learn Craft from a Mentor (Silver + Vigor)                              │
   ├─ forge, identify, repair (do it yourself or hire a player)               │
   ├─ work the market (auction house, stall, Job Board)                       │
   └─ buy a Delve Permit ─────────────┐                                       │
                                      ↓                                       │
                            DELVE (4-player co-op)                            │
                            ├─ spends Vigor                                   │
                            ├─ combat: Stamina drain, Old Wound risk          │
                            ├─ trigger a Memory (exploration)                 │
                            ├─ Duet (Rapport grows)                           │
                            └─ drops: materials, unidentified gear, leads     │
                                      ↓                                       │
                            SETTLE UP AND COME HOME                           │
                            ├─ Stamina drops a little, permanently            │
                            ├─ Old Wound worsens, or a new one appears        │
                            └─ Renown, Silver, materials banked ──────────────┘
                                      ↓
                        (when Stamina falls below threshold)
                                      ↓
                             RETIREMENT RITE
                             ├─ settle Legacy
                             ├─ becomes a Mentor, can teach for Silver
                             └─ Lineage to a new character → back to the Club
```

**Two time scales**:
- **Short loop (15–40 minutes)**: one Delve run. This is where feel and payoff are decided.
- **Long loop (20–60 hours)**: one character from first duty to Retire. This is where the emotion and the economy are decided.

---

## 3. Camera and controls

### 3.1 Camera

Fixed 3/4 top-down view (isometric tilt 30°), low-FOV perspective camera (FOV 25–30 — close to orthographic, but keeping some depth). Camera follow is damped and pulls in slightly during combat.

**Reason**: this is the steadiest angle for pixel art rendered in 3D, and it matches the reading habits players bring from Shining Soul II and the Diablo line.

### 3.2 Control scheme

Gamepad and keyboard-and-mouse are both supported. **The gamepad is the design baseline**, because impact has to be built for it.

| Gamepad | Keyboard/mouse | Action |
|---|---|---|
| Left stick | WASD | Move (free eight-direction, not grid) |
| Right stick | Mouse position | Facing / aim |
| A / ✕ | Left button | **Light attack** (chains; hold = charge) |
| X / □ | Right button | **Heavy attack / class signature action** |
| B / ○ | Space | **Dodge roll** (has invincible frames, spends Stamina) |
| Y / △ | E | **Interact / pick up** |
| RB / R1 | Shift | **Stance key** (hold to enter the class Stance, see 3.3) |
| LB / L1 | Q | **Swap weapon set** (from the L-button weapon rack in Shining Soul II) |
| RT / R2 | 1–4 | **Signature move** (spends Chi) |
| LT / L2 | Tab | **Quick-use item slot** (from the R-button item rack in Shining Soul II) |
| D-pad | F1–F4 | **Command wheel** (call out / regroup / need help / push in — co-op communication) |
| Start | Esc | Menu |

### 3.3 Stance — the control innovation of this game

A veteran does not fight on reaction speed. He fights on **reading the other man**. Hold the stance key and the character enters a defensive posture specific to their class:

- Movement slows inside Stance, but the character gains a **parry window**.
- Release the stance key during the specific frames before an enemy attack lands → **Parry**: the enemy is staggered, Endurance is restored, Chi accumulates.
- A failed Parry (wrong timing) → a brief opening, and Stamina is spent.

**Why this mechanic serves the theme**: the young roll through attacks and eat them. A veteran buys one breath with one clean Parry. A successful Parry is the only combat action in this game that **restores Stamina**, which forces the player to fight with their head instead of trading their health bar for progress.

Each class has a different Stance:

| Class | Stance form | On a successful Parry |
|---|---|---|
| Blade Instructor | Blade held level, mid-guard | Counter-cut (high damage, carries Poise damage) |
| Lead Dancer | Sidestep past the shoulder | Displaces behind the enemy; the next hit is a guaranteed critical |
| Talisman-Maker | Standing talisman ward | Reflects projectiles; a melee Parry roots the enemy briefly |
| Guard Captain | Raised shield, braced on the prosthesis | 20% damage reduction for the whole party for 1.5 seconds (team-facing) |

---

## 4. The characters: four people

There is no class system. There are **four specific people**. They have names, they have pasts, and each of them is missing something. (Expandable to 6–8 after 1.0.)

### 4.1 Lu Laosan · retired Blade Instructor to the kingdom
- **Past**: he trained three successive commanders of the palace guard. The last one died in a coup, and Lu was stripped of his post.
- **Body**: Old Wound in the right shoulder, from the cut he took for a student. Triggers after 3 consecutive heavy attacks; heavy attacks are disabled for 8 seconds.
- **Play**: mid-range, rhythm-led. Mixed light and heavy chains; the Parry is his core. Balanced attack and defence, but no movement tool, so being surrounded is his problem.
- **Signature direction**: breaking a move (answers aimed at specific enemy actions), instruction (short-lived bonuses for allies).

### 4.2 Su Jiuniang · lead dancer of three cities
- **Past**: she was the most expensive dancer there was. Her knees were broken for her. Nobody was ever caught.
- **Body**: Old Wound in both knees. Triggers after 3 consecutive dodges; dodge distance is halved for 12 seconds.
- **Play**: very high mobility, very low health. Damage comes from sidesteps and back attacks. She needs more positioning than anyone else on the team, and she has the highest ceiling.
- **Signature direction**: chained dance (damage climbs while the run of hits stays unbroken), confusion (enemies attack each other).

### 4.3 Lao Nie · a Talisman-Maker expelled from his school
- **Past**: he used a forbidden art to save someone and was struck from the rolls. He gets by writing protection charms.
- **Body**: nearly blind (sight radius 25% smaller than everyone else's, but enemy weak points are highlighted for him — he cannot *see*, and he can still *tell*).
- **Play**: ranged, prepared. He lays talisman arrays in advance and turns the room into ground of his own choosing. Weak single-target damage, very strong control.
- **Signature direction**: talisman arrays (area effects), forbidden arts (high risk, high return; they worsen Old Wounds).

### 4.4 Zhong Bu'er · former Guard Captain
- **Past**: he lost a leg and walks on a prosthesis he forged himself. The man he was guarding died anyway.
- **Body**: the prosthesis **seizes** — a heavy hit has a chance to lock him in place for 2 seconds, and an ally has to come into contact range and knock it loose (**a forced coordination point**).
- **Play**: tank and party protection. Raise the shield, hold aggro, take the hit meant for someone else. Lowest damage on the team, and a great deal of content is unbeatable without him.
- **Signature direction**: guarding (redirect damage onto himself), overawe (crowd control).

**Design principle**: what each of them is missing is at the same time a **limit** and their identity. Lao Nie sees less and sees weak points; Zhong Bu'er seizes up, and that gives his allies something to do. **What is missing is not a debuff. It is the gameplay.**

---

## 5. Three value axes

This is where the numbers in this game differ most from a traditional ARPG.

### 5.1 Craft — only ever rises
- Earned through combat, training and Lineage. It is the character's **ceiling**.
- It sets: judgement window width for each move, damage coefficients, forging quality spread, the tier of signature moves the character can learn.
- **It never decays.** This is where the veteran's dignity lives.

### 5.2 Stamina — only falls (over a career)
Three sub-values: **Might / Agility / Endurance**.

- **In combat**: a consumable resource (rolling spends Agility, heavy attacks spend Might, absorbing hits spends Endurance), and a Parry restores it mid-fight.
- **Over a career**: every completed Delve **permanently subtracts** a small amount, scaled by difficulty and by injuries taken (example: one standard-difficulty run costs 0.3–1.2 points, against a starting total of 100).
- Gear, medicine and Club facilities grant **temporary bonuses**, but nothing reverses the base value.
- When any sub-value drops below 30% → the character enters the **exhaustion phase**, a hard signal that it is time to Retire.

**This axis is the clock for the whole game.** It makes grinding self-defeating: the more you grind, the faster the character ages.

### 5.3 Rapport — a party asset
- Records how many fights and how many Duets character A has completed with character B.
- It sets: whether a Duet can trigger, how strong the Duet is, and the extra bonuses the pair gets while grouped.
- **It decays**: more than 7 in-game days apart and Rapport falls slowly.
- It works across accounts — you and the friends you always play with accumulate real Rapport. This is social stickiness turned into a mechanic.

---

## 6. Combat

### 6.1 Design goals
- Feel baseline: the crispness of Shining Soul II, the attack-and-defence rhythm of Sekiro, and the room-clearing payoff of Diablo II. Take the midpoint of the three.
- One standard encounter: 4–8 seconds to finish a group of trash, 30–90 seconds to finish an elite.
- The player's attention belongs **on the enemy**, not on their own cooldowns.

### 6.2 Combat elements

**Poise**: every enemy has a Poise meter that fills as it takes hits. When it breaks, the enemy is weakened for 3 seconds and can be executed (high damage plus an execution animation legible across the whole screen). Poise recovers over time.
→ This is the reason to gang up on one target, and the main source of co-op tension.

**Weak point marking**: Lao Nie can see enemy weak points (the back, the joints, the gaps in armour). Hitting a weak point doubles Poise damage.
→ This keeps Lao Nie necessary despite low damage, and it is the concrete form of "the old man can tell how the thing works".

**Chi**: the resource for signature moves. Earned only by **a successful Parry, a Poise break, or a Duet**. **Ordinary attacks never build it.**
→ The player has to execute at a high level to spend a signature move, rather than charging one up with mindless swings.

**Stamina cost**: rolling, heavy attacks and absorbing hits all spend Stamina. Stamina at zero = a long stagger (very dangerous).
→ A veteran cannot keep moving. This is where the rhythm comes from.

### 6.3 Duet — taken from Shining Soul II's Force Link and pushed further

**Trigger condition**: two characters satisfy the conditions at the same **moment and in the right spatial relationship**; the game signals it automatically (a resonance effect appears on both characters, and the stance key triggers it within a 0.8-second window).

Examples:

| Duet | Pair | Trigger condition | Effect |
|---|---|---|---|
| Dance of Old Days | Instructor + Dancer | the instant the Instructor lands a Parry, with the Dancer inside the enemy's 90°–180° arc | the Dancer blinks in; an 8-hit two-person chain that costs no Stamina |
| Iron Wall, Drawn Lightning | Captain + Talisman-Maker | while the Captain is absorbing an attack behind the raised shield, with the Talisman-Maker within 3 units behind him | the shield face reflects a talisman array, dealing lightning damage in a cone plus Poise damage to the group |
| Broken Blade | Instructor + Captain | both are in contact range the instant an enemy's Poise breaks | a two-person execution; always drops one extra material |
| Afterimage | Dancer + Talisman-Maker | the Talisman-Maker marks the Dancer with a rune while she has 5 or more hits in a row | the afterimage she leaves behind repeats her attacks from the last 3 seconds |

**Three iron rules for Duets**:
1. **A macro must not be able to trigger one.** It has to depend on a real moment in the fight, so that pulling it off carries feeling.
2. **Both players must feel they contributed.** No arrangement where one person presses a key and the other is a prop.
3. **It must be visually unmissable.** A Duet is this game's high point; every player on screen should know what just happened.

**What Rapport does**: at Rapport 0, only tier 1 Duets trigger (baseline damage); at full Rapport, tier 3 triggers (extra effects such as added Poise damage or Chi restored).

### 6.4 Old Wounds

Each character carries 2–3 Old Wounds from the start and can pick up more in the field.

- **Trigger**: the wound flares once its condition is met (such as "3 consecutive heavy attacks"), imposing one severe temporary limit.
- **Recovery**: none for the rest of the run. Back at the Club the wound has to be tended (costs Vigor and Silver, or hire the massage service another player sells).
- **Worsening**: keep using the matching action while the wound is flared → the Old Wound rises a level and its trigger threshold falls permanently.
- **Exploitation**: some signature moves can be used **only while an Old Wound is flared** — the moves a man throws when he has stopped caring. **This is the design that turns a penalty into a resource.**

### 6.5 Memory (muscle memory) — the skill system rebuilt

A veteran **does not learn new moves. He remembers old ones.**

- Signature moves are not bought on a skill tree. They unlock by **triggering a recollection in a specific situation**.
- Example: Lu Laosan, in a Delve on a rainy floor, facing an enemy with paired blades, lands 3 Parries → the recollection scene fires (a 5-second black-and-white flashback) → unlocks Paired-Blade Break.
- Each character has 12–18 Memories. Trigger conditions live in the content data, and players have to **explore, guess and talk to each other** to find them all.
- Some trigger conditions are deliberately obscure (example: carrying one specific old item into one specific room).

**Three returns from this design**:
1. It turns the skill tree into archaeology, which puts pressure on exploration.
2. It produces a **strategy-guide economy** on its own (see the Codex item in the economy design).
3. It serves the theme exactly — you are not becoming stronger, you are remembering how strong you were.

---

## 7. The Delve

### 7.1 Structure
- Hand-designed **room modules** stitched together procedurally (not fully procedural, so that design density survives).
- One run = 3–5 floors, 6–12 rooms per floor, a boss on the last floor.
- Between floors there is a **Camp**: take a breath, use items, say a few words. No Vigor is recovered there.

### 7.2 Modifiers
A server-wide modifier set rotating weekly (borrowed from Diablo III Greater Rifts and Path of Exile map mods), for example:
- "Rain": sight is reduced, lightning damage is raised, and certain rain-only Memories become triggerable
- "Echo": an enemy leaves an afterimage on death that repeats its last attack 3 seconds later
- "Old Ailment": Old Wound trigger thresholds -1, loot quality +1 tier

**The modifier rotation is the metronome of the economy**: it makes demand for different materials swing on a cycle, which produces a real market.

### 7.3 Difficulty and player-count scaling
- Scaling comes from **enemy composition and count**, not from health inflation (aligned with the co-op design principle).
- 1 player can clear it, but part of the content **requires more than one**: Zhong Bu'er's prosthesis seizing, mechanisms two people have to stand on at once, Duet-only rooms.
- Loot is personal (personal loot), so nobody fights over gear.

---

## 8. Lineage and Retirement

This is the end of the long loop and the entrance to the economy.

### 8.1 Retire
When any Stamina sub-value drops below 30%, the player may — and is strongly steered to — perform the **Retirement Rite**:
- A farewell scene of that character's own (different for each; N1 owns it)
- Settle **Legacy**: computed from that character's whole career (runs cleared, Memory collection, Duet count, highest difficulty, how other players rated them)
- The character becomes a **Mentor** and stays in the Club permanently

### 8.2 What a Mentor can do
1. **Lineage**: pass up to N points of Craft, 1–2 Memories, and hard-won knowledge of Old Wounds on to a new character. The new character does not start from zero.
2. **Teach**: train the characters of **other players**. The player sets the price and takes Silver. This is the core **service economy**.
3. **Vouch**: vouch for a piece of gear or a Codex, raising how much the market trusts it (a tradable reputation asset).
4. **Remember**: inside the Club, Mentors talk to each other. This is the main vehicle for the narrative, and the player's emotional anchor.

### 8.3 Why Retire is not death
Death triggers loss aversion, and players leave. Retire **fixes the character's value into assets** — a Mentor, Legacy, Lineage — so the player has not lost anything; they have put something away. That is emotional design and economic design at once.

---

## 9. Open questions

For the `clarify` stage to handle. Each must be resolved before the milestone named:

| # | Question | Resolve before |
|---|---|---|
| Q1 | What is the death penalty? (Leaning: no death; only a "carried out wounded" retreat that costs this run's loot plus extra Stamina decay) | M1 |
| Q2 | How many Actives can one account hold at once? (Leaning: 1 Active plus unlimited Mentors, to concentrate emotional investment) | M3 |
| Q3 | May the same character appear twice in one party? (Leaning: no. Four people means four people) | M3 |
| Q4 | What Stamina decay rate do we ship? Settle it by playtest. Too fast and players are anxious, too slow and the tension is gone | M4 |
| Q5 | How strongly should a Memory trigger be hinted at? No hint at all drives players away; too much hint destroys the discovery | M4 |
