# Economy Design · Sunset Club

> Status: DRAFT v0.1 · Owner: Economist (C1) · Freezing requires human approval
> Iron law: **any change that moves a faucet or a sink must clear the simulation gate in `packages/econ-sim` first.** See section 9.

---

## 0. What we are copying, and why we cannot copy it straight

Fantasy Westward Journey has kept its economy standing for twenty years on three pillars:

1. **The subscription card is the anchor.** A player's unit of online time carries an explicit price in yuan (0.6 yuan per hour), so "what is an hour of output worth" is computable, and therefore **the cost of every item traces back to one shared denominator**.
2. **Far more sinks than faucets.** Per-point repair, skill levelling, equipment repair, gem fusion, pet lifespan, trade commission — coin is destroyed continuously and compulsorily.
3. **The dual-track auction house.** The same object carries both an in-game price and a yuan price, and the two have to stay in balance or an arbitrage window opens, so the market calibrates itself.

The parts we **cannot** copy:
- No subscription card (buy-to-play), so pillar one needs different material.
- No real-money trading (an explicit non-goal in the vision), so pillar three comes out whole.
- No live-operations team watching the market every day, so **algorithms have to replace manual intervention**.

Our substitution: **Vigor replaces the subscription card as the time anchor, the Delve Permit becomes an algorithmic automatic sink, and service professions replace the cash market as the price-discovery mechanism.**

---

## 1. The anchor: Vigor × Delve Permit, two gates

### 1.1 Vigor — the time anchor

| Property | Setting |
|---|---|
| Regeneration | 120 points per **account** per 24 hours (not per character — this blocks multiboxing) |
| Cap | 360 points (three days of stock, for weekend players) |
| Costs | Delve entry 40 each; gathering 5 each; forging 15 each; teaching 10 each; contract carry 30 each |
| Not tradable | Correct. Vigor cannot be bought, sold, or gifted |
| Acceleration | None. **We do not sell Vigor and we do not sell speed-ups.** This is not negotiable |

**Effect**: the **hard ceiling** on server-wide daily output = active accounts × 120 Vigor ÷ output per unit of Vigor.

This makes "the output value of a unit of time" computable again — priced not in yuan but in **Vigor**. The cost of any item traces back to "how much Vigor does it take to make". That is our denominator.

> **Design intent**: the Vigor gate serves the premise directly. Old people cannot work around the clock. This mechanic is not a live-operations lever; it is the theme itself.

### 1.2 Delve Permit — the algorithmic sink

Entering a **paying Delve** (one with valuable drops) requires a Delve Permit. Permits are sold for Silver by the NPC Club steward.

**This is the single most important formula in the game**:

```
P(t) = P_base × clamp( (M(t) / M_target) ^ α , 0.5 , 4.0 )

P(t)      : permit price this cycle (Silver)
P_base    : base price (2,000 Silver initially, rising slowly with server-average level)
M(t)      : current server-wide Silver stock (player bags, vaults, Silver frozen in listings)
M_target  : target Silver stock = active accounts × target holding per account (50,000 initially)
α         : elasticity coefficient, 1.5 initially
clamp     : movement per cycle bounded to 0.5×–4× of base
cycle     : recomputed every 6 hours; price moves are smoothed over 30 minutes (no buying rushes or stampedes)
```

**It is a negative-feedback controller**:
- Silver rises (inflation) → permits get expensive → recycling accelerates and the bar to produce rises → Silver falls back
- Silver falls (deflation) → permits get cheap → players enter Delves more easily → output accelerates → Silver recovers

**Why this design is mandatory**: we have no live-operations team. Fantasy Westward Journey regulates by hand — cutting instance output, adding wandering-merchant faucets — and we let this controller do the same job automatically. **It is also where "auditable" becomes concrete: the regulation logic is one formula, so it can be simulated, verified, and audited rather than guessed at.**

**Transparency**: permit price, current server-wide Silver stock, and target stock are all published in the in-game Market screen. Players can study it, forecast it, and arbitrage it. **That is a metagame in its own right.**

### 1.3 What the two gates do together

| Gate | Limits | Character |
|---|---|---|
| Vigor | how much one person **can do** | hard ceiling, strictly fair (multiboxing gains nothing) |
| Delve Permit | whether a given action **is worth doing** | soft regulator, self-stabilising |

Multiplied together, total server output has both a ceiling and a way to correct itself. This is our "subscription card + auction house".

---

## 2. Three currencies

| Currency | Tradable | Sources | Uses | Role |
|---|---|---|---|---|
| **Silver** | ✅ fully free | quests, selling loot to NPCs (low floor price), player trade | permits, repair, appraisal, tuition, commissions, Lineage fees, Club upkeep | everyday circulating currency |
| **Renown** | ❌ account-bound | high-difficulty first clears, teaching rated well by other players, rare Memory collection, seasonal ladders | unlocking advanced recipes, Club facility upgrades, more Mentor seats | **the core anti-farming measure** |
| **Legacy** | ⚠️ severely restricted (usable only for your own Lineage, never tradable) | **settled only when a character retires** | heirlooms (the only source of "levelless" grade equipment), starting talents for a new character, Mentor ability ceilings | the top-level anchor of account worth |

### Why three

- **Silver** carries liquidity and price discovery. It has to trade freely or there is no market.
- **Renown** shuts the door on gold farmers. **The key to top-tier content is not tradable** — a farm can grind Silver but cannot grind Renown, because Renown comes from high-difficulty first clears and from being rated well by real people.
- **Legacy** carries long-term accumulation. It turns "you played three hundred hours" into something nobody can buy. **This is where account worth actually comes from, and it is the reason a player does not walk away from an account.**

> Against Fantasy Westward Journey: Silver ≈ their coin, Renown ≈ sect / guild / realm merit (untradable), Legacy ≈ levelless weapons and the sediment of an old account. The difference is that we make the untradable top layer harder.

---

## 3. Faucets (sources)

**Design principle: few faucets, predictable, all of them behind the Vigor gate.**

| Channel | Output | Vigor | Notes |
|---|---|---|---|
| Delve run | materials, unappraised equipment, recipe fragments, Silver (small) | 40 | the main faucet. Needs a Delve Permit |
| Daily commissions | Silver (fixed), a few materials | 0 | three per day, floor income, no permit needed. **The lifeline for new and casual players** |
| Gathering nodes | ore, herbs (they carry Purity) | 5 each | inside Delves and in the field, daily count capped |
| Salvage | materials (recovered from equipment) | 0 | the exit route for equipment. Recovery rate undefined — Q6 |
| Teaching | Silver (from other players) | 10 | **creates no new Silver, only moves it** |
| Contract work / carries | Silver (from other players) | 15–30 | **creates no new Silver, only moves it** |

**Key point**: only the first two lines create Silver **out of nothing** (a small amount from Delves, plus daily commissions), and both are small. Most Silver reaches players through **the NPC floor price paid for goods**, and that price is deliberately depressed — roughly 30–50% of what the same item fetches between players — in order to push players toward player-to-player trade.

---

## 4. Sinks

**Design principle: many sinks, part of daily life, growing as the player grows stronger.**

| Channel | Recycling strength | Notes |
|---|---|---|
| **Delve Permit** | ★★★★★ | the main valve, algorithmically regulated. Projected at 35–45% of all recycling |
| **Equipment repair** | ★★★★ | durability. Repair cost on high-grade equipment rises exponentially |
| **Appraisal** | ★★★ | unappraised equipment has to be appraised. The NPC is expensive; a player appraiser is cheap but you wait in line |
| **Lineage fee** | ★★★ | charged per Lineage against the value of what is passed on. The largest single outlay in the long loop |
| **Trade tax (progressive)** | ★★★ | auction house commission: ≤10k 3%, 10k–100k 5%, >100k 8%. Discourages large-lot hoarding and resale |
| **Forging losses and consumption** | ★★★ | forging burns ore and Silver, and quality is partly random |
| **Convalescence / Old Wound care** | ★★ | a fixed cost after each run, rising with Old Wound rank |
| **Club upkeep** | ★★ | charged weekly against Club size (Mentor count, facility count). **This is what stops unlimited Mentor hoarding** |
| **Medicine and consumables** | ★★ | routine combat spend |
| **Tuition** | ★ (mostly a transfer) | player → player, but 5% is taxed |

### 4.1 What Club upkeep is really for
Players will want to accumulate Mentors without limit, because a Mentor earns Silver by teaching. Upkeep grows faster than the number of Mentors but slower than its square — in practice `n^1.4`, so income scales with `n` and cost with `n^1.4` — which produces a natural optimum Club size beyond which further Mentors stop paying for themselves. That blocks the rich-get-richer effect of the oversized veteran account.

### 4.2 Common Fund (recycle, then redistribute)
All trade tax and part of permit revenue flow into the **Common Fund**. It is **not destroyed; it becomes the prize pool for weekly events** — but the pool pays out **Renown and materials, never Silver**.

That gives us: **Silver removed (deflationary), non-inflationary resources handed back (players still gain something)**. This is our one improvement on Fantasy Westward Journey: their recycling is pure destruction and the player feels only the loss, while we turn the loss into a server-wide public good.

---

## 5. Production chains and craft

### 5.1 Three-slot forging (taken from Shining Soul II and deepened)

The original design in Shining Soul II: three pieces of ore on the anvil, where **total purity** sets the grade of the output and **the order they are placed in** decides whether the result is a weapon or armour. It is a deterministic recipe table — players can research it and write it down. We keep that core and add three layers of depth:

```
Output = F(ore type sequence, total purity, forger's Craft, forge heat state)

Layer one   : ore type sequence  → sets the output category and its affix pool (deterministic, table-lookup)
Layer two   : total purity       → sets the output grade band (deterministic, table-lookup)
Layer three : forger's Craft     → shifts the quality distribution (higher Craft, higher chance of a good roll)
Layer four  : forge heat state   → a real-time minigame (bellows rhythm) worth ±1 band
```

- Layers one and two are **knowledge**: they can be researched, recorded, and traded (see 5.3, the Codex).
- Layer three is **service**: a player with high Craft can forge for others and charge a fee.
- Layer four is **execution**: clumsy hands and deft hands differ, but the spread is bounded (±1 band).

**Those four layers together make forging a knowledge economy, a service economy, and a skill game at the same time.**

### 5.2 Appraisal
Most equipment dropped in a delve is unappraised (marked with a question mark). Affixes stay hidden until it is appraised.
- NPC appraisal: expensive (a Silver sink), instant.
- Player appraiser: cheap, but the appraiser has to be online to take the job; **an appraiser with high Craft has a chance to "spot" an extra hidden affix**, which is the appraiser's differentiated value.

### 5.3 Codex — turning guides into goods

**This is the design in this economy that I want most.**

- Players can write a **Codex** in game: recipes, the conditions that trigger a Memory, boss tactics, affix counters.
- A Codex is a **tradable item** and can be sold at the auction house.
- A Codex **can be wrong**. Before buying, the buyer sees only the summary and the author's Renown.
- A Mentor can **endorse** a Codex; the endorser's Renown suffers when that Codex is disproved.

The result is a complete **information market**:
- pioneers work out a recipe → write a Codex and sell it high
- the information spreads → the Codex loses value
- a new version or a new affix rotation → a fresh round of information asymmetry
- frauds write false Codices → Renown penalises them → Renown becomes a reputation currency

This takes the guide ecosystem that lives outside Fantasy Westward Journey and **turns it into a system inside the game**. It is the largest original departure from our references.

---

## 6. The service economy (the soul of this economy)

A traditional game economy is a **goods economy** (I sell you a sword). The core of this one is a **labour economy** (I forge your sword for you). That comes straight from the premise: a veteran's worth is craft, not loot.

| Profession | Provides | Priced on | Requirement |
|---|---|---|---|
| **Mentor** | training (raising Craft, passing on a Memory) | the Mentor's Craft rank + Renown | a retired character |
| **Artisan** | contract forging | Craft + public record of past output quality | high forging Craft |
| **Appraiser** | appraisal + finding hidden affixes | Craft + success record | high appraisal Craft |
| **Escort** | taking lower-level players through hard content | clear record + Renown | a history of high-difficulty clears |
| **Bonesetter** | Old Wound care (faster and cheaper than the NPC) | Craft | a specific Memory |
| **Author** | writing a Codex | Renown + the historical accuracy of their Codices | knowledge and experience |

### 6.1 Job Board
A notice board in the Club where players post what they need and what they will pay, and service providers take the job. Every transaction record is public — who did what for whom, and how it was rated — which makes it a **reputation market**.

### 6.2 Why a service economy has more depth
1. **It cannot be hoarded.** A service cannot be stockpiled like an item and held for a price rise; supply is bounded by the Vigor gate by construction.
2. **It carries information.** Service quality varies, so it needs ratings, reputation, and word of mouth — all of which are social content.
3. **It resists gold farming.** A farm can grind items; it is far harder to grind a record of teaching that real people rated well.
4. **It fits the premise.** A veteran lives on craft. This is the theme turned into a mechanic.

---

## 7. Depreciation and turnover (nothing is permanent)

A common way for an economy to collapse is **assets holding their value forever**, which lets the veteran's stock crush the newcomer's flow. This game depreciates by force:

| Asset | Depreciation mechanism |
|---|---|
| Equipment | durability wear; rising repair cost; past a repair-count limit it must be reforged (consumes materials, stats re-roll slightly) |
| Character | irreversible Stamina decline → mandatory Retire → mandatory rotation |
| Rapport | decays slowly after seven days without travelling together |
| Codex | parts stop being true after a version update or an affix rotation (the system marks them "outdated") |
| Mentor | weekly upkeep; teaching count bounded by Vigor |
| Renown | **does not depreciate** (one of the only permanent assets, because it is untradable and therefore cannot inflate) |
| Legacy | **does not depreciate** (same reason) |

**Principle: anything tradable depreciates; anything untradable may be permanent.**

---

## 8. Anti-inflation and anti-farming checklist

| Threat | Countermeasure |
|---|---|
| Silver inflation | the permit controller (negative feedback) + many sinks + progressive trade tax |
| Multiboxed farming | Vigor regenerates per **account**, not per character |
| Farms selling currency | there is a ceiling on what Silver can buy; top-tier content needs Renown, and Renown is untradable |
| Veteran account monopoly | Club upkeep rises faster than linearly with Club size; the Vigor cap is a hard ceiling |
| Price collapse (deflation) | permits get cheaper → output recovers; Common Fund events inject demand |
| Exploit farming | every currency and item change writes an audit log (E3 iron law); daily anomaly detection; rollback possible |
| Auction house manipulation | the progressive tax discourages large lots; listings carry a time limit and a fee; public market data reduces information advantage |
| Gap between new and old players | Legacy and Lineage mean a new character does not start from zero; daily commissions give floor income; Escort services provide a way in |

---

## 9. Stability criteria (the simulator gate)

**No economy change enters main without a clean run in `packages/econ-sim` and an attached report.**

### 9.1 Simulation setup
- 10,000 simulated accounts, distributed: casual 60% (one run per day) / moderate 30% (three) / hardcore 8% (six, all Vigor spent) / farm 2% (a strategy that maximises Silver output)
- 365 in-game days
- each simulated account runs a simplified decision policy (buy greedily by value, choose activities by ROI)
- full time series output

### 9.2 Pass criteria (hard)

| Metric | Pass band | Notes |
|---|---|---|
| Annualised Silver inflation | **-5% to +15%** | mild inflation is healthy (new players arriving) |
| Silver held per account | reaches steady state by day 90, swing <±25% | must not drift one way indefinitely |
| Gini coefficient (Silver) | **< 0.55** | above this, wealth concentration is out of control |
| Permit price | inside the clamp band, and **not pinned to an edge for long** | pinned to the ceiling = not enough recycling; pinned to the floor = not enough output |
| Casual player wealth growth over 90 days | **> 0**, and able to cover basic spending | casual players must not be priced out of the market |
| ROI of the farm strategy | **≤ 1.5× the moderate player's** | above this there is a farmable hole |
| Median price of key items | stable after day 90, swing <±30% | prices have to be predictable |
| Renown acquisition rate | **weakly correlated** with Silver held (|r| < 0.3) | proof that money cannot buy Renown |

**Any one of these missed → the change does not enter main.** The report goes in `board/econ/`.

### 9.3 Continuous monitoring after launch
C1 publishes a weekly economy health report — the same metrics, computed on live data. Any metric outside its band goes to P0 for the nightly report the same day, and a metric outside its band for three consecutive reports is an andon pull, not a note.

---

## 10. Economy screens the player can see

- **Market board**: server-wide Silver stock / target stock / permit price curve (last 30 days) / median price of key items
- **Auction house**: search, filter, historical sale price curves
- **Stall**: set up a stall outside the Club, up to 6 items listed plus custom sign text (social)
- **Job Board**: supply-and-demand matching for the service professions
- **My ledger**: personal income and outgoings, categorised (the core tool for the merchant-minded player)

**Design intent**: publish all the economy data, so that studying the economy becomes a playstyle a player can show off. Fantasy Westward Journey's economic analysis ecosystem grew on forums; we want ours to grow inside the game.

---

## 11. Delivery by milestone

| Milestone | Economy content |
|---|---|
| M4 | Vigor system, Silver, basic faucets and sinks, Lineage and Legacy |
| M5 | permit controller, auction house, all three currencies, service professions (Mentor / Artisan / Appraiser), market board, economy simulator gate |
| M6 | Codex system, Job Board, Common Fund events, reputation system, live economy instrumentation |

## 12. Open questions

| # | Question | Resolve before |
|---|---|---|
| Q1 | Do we want a cross-server market? (leaning: each server stands alone, so excess liquidity does not destroy small servers) | M5 |
| Q2 | Is 120 Vigor per day the right number? Needs live testing. Too little drives players away, too much and the gate stops gating | M4 |
| Q3 | The value of the permit elasticity coefficient α — needs a parameter sweep in the simulator | M5 |
| Q4 | How does the Codex "disproved" mechanism resist malicious reporting? | M6 |
| Q5 | Do we allow direct Silver gifts between players? (leaning: allow, with a cap and a tax, otherwise it routes around the auction house tax) | M5 |
| Q6 | What fraction of an item's materials does salvage return, and does it scale with grade? Below roughly a third nobody salvages and equipment never leaves circulation; above roughly two thirds forging becomes free | M5 |
