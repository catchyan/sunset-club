# Economy Dashboard

> Status: **STUB** · Owner: C1 Economy Lead · Drafting starts: **M5**
> Placeholder file. Rationale at the top of `gdd-encounters.md`.

---

## Preconditions for drafting

- [ ] `telemetry-spec.md` complete
- [ ] the `packages/econ-sim/` Monte Carlo simulator available
- [ ] the eight stability criteria in `gdd-economy.md` each have an explicit computation rule

## What this file will define

This document defines the fixed format of `board/econ/<date>.md` — the one screen C1 reads every day.

The **daily measured value, the simulated prediction, and the deviation** for each of the eight stability criteria, plus:

| Section | Content |
|---|---|
| Faucets | currency issued per source, with shares, over 24h / 7d / 30d |
| Sinks | currency recovered per destination, with shares |
| Net flow | issued − recovered, and its ratio to total stock |
| Prices | median sale price and volatility for key items |
| Permits | current algorithmic price and recent trajectory (**watch specifically for oscillation**) |
| Tiers | hourly earnings and share of activity for each Delve tier |
| Service economy | income distribution across Mentors / Artisans / Codices |
| Anomalies | automatically flagged outlier accounts and suspicious trades |

## Two design disciplines

**First, the dashboard exists to surface anomalies, not to display data.**
If one screen holds 40 numbers and every one of them is green, people (and bots) stop reading it.
The default view should show only **the items outside their expected band**, with normal items collapsed.

**Second, every metric needs an expected band, not just a current value.**
"120 million Silver issued today" carries no information on its own.
"120 million Silver issued today, expected band 90–115 million, **above the ceiling**" does.

A metric without an expected band does not go on the dashboard — all it produces is noise.
