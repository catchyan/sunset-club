# ADR-0001 · Build on Three.js rather than Unity / Godot / Unreal

- Status: **ACCEPTED**
- Date: 2026-08-20
- Proposed by: A1 Architect
- Decided by: the human executive producer
- Supersedes: —

> This ADR doubles as the **format example**. Every later ADR follows this structure.

---

## 1. Context

Sunset Club is a four-player online ARPG on Steam, in 3D pixel art. The bulk of the development is done by a team of Grok Bots; the human only makes the daily decisions and guards taste.

Choosing an engine is constrained **completely differently** here than on an ordinary project:

- The developers are LLM agents. They **cannot see an editor UI**; they can only read and write text files.
- An agent's competence depends heavily on how much of a given technology appeared in its training data, and on the quality of that documentation.
- Every artefact has to be verifiable headlessly in CI (constitution article 7: nobody certifies their own work).
- Parallel development requires artefacts that **can be diffed and reviewed**.

## 2. Alternatives

### Option A: Unity
- ✅ Mature, one-click Steam integration, the strongest performance and tooling
- ❌ **The core problem: scenes and prefabs are binary or pseudo-YAML, so agents cannot edit them reliably and cannot review a diff of them.** One prefab change lands in a PR as hundreds of lines of GUID churn, and no reviewer — human or bot — can tell what it did
- ❌ A great deal of the work has to happen in the GUI, so agents can only get at it through computer use: slow and extremely error-prone
- ❌ Headless CI needs a Unity license and a multi-gigabyte image, and takes minutes per run

### Option B: Godot
- ✅ Open source, and `.tscn` is text, so more diffable than Unity
- ✅ Reasonable built-in support for 3D pixel art
- ❌ GDScript has weak static typing, and the C# path in Godot 4 still has export pitfalls
- ❌ **An order of magnitude fewer samples in training data than Three.js**, so the Godot code agents write is measurably less often correct (this is the deciding factor for this project)
- ❌ A weak headless testing ecosystem

### Option C: Three.js + TypeScript, built ourselves (selected)
- ✅ **Every artefact is TypeScript or JSON**, which is inherently diffable, reviewable and statically checkable
- ✅ Three.js has the largest public sample base in 3D, so agents get it wrong least often
- ✅ TypeScript strict mode is the most effective guard rail for a weak agent — **type errors are caught at compile time, not left for review**
- ✅ Vitest runs headless in seconds, which makes replay tests and frame-data snapshot tests straightforward
- ✅ It runs in a browser → staging deployment costs nothing, and the barrier to a D1 playtest is zero
- ❌ Engine-level features (scene editor, animation state machine, lightmap baking) have to be built
- ❌ Steam requires an Electron wrapper (see the follow-up ADR)
- ❌ A lower performance ceiling than native

## 3. Decision

**Option C is adopted.**

## 4. Reasoning

The deciding point: **the bottleneck on this project is not engine capability, it is how often agents produce correct work and how auditable that work is.**

A 3D pixel-art ARPG never touches 90% of Unity's features. And the convenience of the other 10% has to be paid for with artefacts that cannot be reviewed — on a project whose quality rests on automated gates, that price is unacceptable. Constitution article 9 requires evidence for any claim that something works; the diff of a `.prefab` cannot provide it.

Conversely, the things Three.js lacks — a scene editor, an animation state machine — are exactly **the things we were going to express as data anyway** (see `contracts/content-schema.md`). So "building it ourselves" costs less than it appears: we are not catching up to an engine, we are building the data-driven pipeline this project needed regardless.

On performance: the target is a 384×216 render resolution, ≤60k triangles on screen, and 4-player rooms. WebGL has plenty of headroom at that scale.

## 5. Consequences

**Costs accepted:**
- We have to write ourselves: the ECS, the animation state machine, collision queries, scene loading, the post-processing pipeline
- The first playable slice in M1 will land later than it would have with Unity
- The art pipeline has to be built in-house (which is also the precondition for the `proc_ai` asset route)

**Capabilities gained:**
- Every change can be diffed, linted and asserted on by headless tests
- Agents can work entirely with text tools, with no GUI computer use
- staging is a URL: the human clicks it and plays

**Homework we must do:**
- The ECS and the deterministic core (the first priority in M1)
- The 3D pixel render pipeline (M2)
- The Electron + Steamworks wrapper (M6, needs an early spike)

## 6. ★ Rollback conditions (measurable)

If **any** of the following occurs, A1 must raise a new ADR to re-evaluate the engine choice:

| # | Condition | How it is measured | Reviewed at |
|---|---|---|---|
| 1 | At the end of M1, p99 frame time in the target scene (4 players + 24 enemies + a screen full of effects) is > 25ms and one round of optimisation still cannot bring it under 18.2ms | `pnpm bench:combat` | M1 convergence |
| 2 | The custom ECS plus animation state machine exceeds 8000 lines and still does not support every action in feel-spec §4 | `cloc packages/sim` | M1 convergence |
| 3 | The M6 spike shows that Electron cannot reliably support the Steam overlay / achievements / cloud saves | Spike report | Pulled forward into M2 |
| 4 | Across two consecutive milestones, "rendering / engine infrastructure" tasks account for > 40% of all tasks | Task statistics | Every milestone |

**Cost of rolling back**: rolling back before the end of M1 costs roughly one milestone. Rolling back after M2, the pure-logic parts of `packages/sim` (ECS, combat, content data) migrate intact, and the loss is mostly `packages/client`. Which is why **condition 3 must be verified by a spike during M2 and cannot wait until M6**.

---

## 7. Related

- `docs/02-tech/architecture.md §1`
- ADR-0002 (the multiplayer decision)
