# Dependency Graph

> Status: **STUB** · Owner: A1 Architect · To be drafted: **M1** (once the `packages/` skeleton exists)
> The authoritative definition is `architecture.md §2.1`. This file's job is turning it into machine-checkable rules and a visualisation.

---

## Target dependency direction (from `architecture.md §2.1`)

```
content ──┐
shared ───┼──> sim ──┬──> client
protocol ─┘          └──> server
                            │
telemetry <─────────────────┘
econ-sim ──> content, shared   (standalone; does not depend on sim)
```

## Forbidden dependencies (enforced in CI, `pnpm gates:deps`)

| Forbidden | Reasoning |
|---|---|
| `sim` → `client` / `server` | The one-sim principle. sim is shared by both sides, so it must not know which side it is running on |
| `sim` → `three` / any DOM | sim has to run headless under Node, or it cannot be tested |
| `sim` → any Node IO / `Date.now()` / `Math.random()` | The determinism principle. These three are the main reasons replay tests stop working |
| `client` → `server` | |
| `content` → any code package | content is pure data |

## What the draft has to do

1. Express the table above as configuration, using `dependency-cruiser` or an equivalent
2. Generate the dependency graph as an SVG, embed it in this file, and have CI keep it updated
3. **Give every forbidden rule a "violating example" test** — so that the rule itself is known to work

Item 3 is easy to skip, and it matters. A lint rule that has never fired once gives you no way to know whether it is working at all.
Write a sample that deliberately violates it, assert that lint does report the error, and only then do you know the gate is real.

> This is the thinking behind M0's negative acceptance criteria (a deliberate out-of-lane change must get caught), carried down to the code layer:
> **gates need to be tested too.**
