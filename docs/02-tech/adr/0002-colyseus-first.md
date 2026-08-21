# ADR-0002 · Colyseus first for M3 multiplayer; the UDP option waits for M4 and real measurements

- Status: **ACCEPTED**
- Date: 2026-08-20
- Proposed by: A1 Architect
- Decided by: the human executive producer
- Supersedes: —

---

## 1. Context

M3 delivers four-player multiplayer. This is a fast ARPG: the feel spec requires "input → first visible frame ≤2 frames", and mechanics such as Parry (a 6-frame window) are extremely sensitive to latency.

In the browser there are only two transports to choose between: WebSocket (TCP, reliable and ordered) and WebRTC DataChannel (which can be configured for UDP semantics).

## 2. Alternatives

### Option A: Colyseus (WebSocket / TCP)
- ✅ Rooms, matchmaking, state sync and schema serialisation out of the box
- ✅ MIT licensed, self-hostable, simple to operate (one Node process)
- ✅ Easy to debug: messages are readable straight from Chrome DevTools
- ✅ No NAT traversal problems and no TURN server costs
- ❌ TCP head-of-line blocking: on packet loss every following packet waits, which shows up as a stutter followed by a teleport

### Option B: geckos.io (WebRTC / UDP)
- ✅ No head-of-line blocking; a lost packet costs only that one frame
- ❌ Needs STUN/TURN, and some corporate networks will still fail
- ❌ Hard to debug, and an agent's ability to diagnose network problems is limited to begin with
- ❌ Rooms and matchmaking have to be written ourselves
- ❌ Operational complexity rises substantially

### Option C: Abstract the transport layer from the start and implement both
- ✅ The most flexible
- ❌ **An abstraction built before we know what needs synchronising is certain to be the wrong abstraction**
- ❌ Two implementations = twice the bug surface, and weak agents will certainly let the two paths' behaviour diverge

## 3. Decision

**M3 adopts option A (Colyseus).** In addition:

1. The transport calls between `packages/server` and `packages/client` are **funnelled through a single module** (`transport.ts`), but **not abstracted into an interface ahead of time** — the point is only to guarantee that when we do swap it, the change is confined to one place.
2. The M3 release conditions **must include measurements from the network test rig**: with 80ms / 150ms RTT + 2% packet loss injected, how far parry success rate drops relative to local play.
3. At the start of M4, A1 uses those measurements to decide whether to raise an ADR switching to option B.

## 4. Reasoning

The core judgement: **there is not enough information to make this decision now.**

"TCP is not suitable for action games" is true and too coarse to act on. Its actual impact depends on how many bytes have to be synchronised per tick, the snapshot rate, how long the interpolation buffer is, and what the players' real network quality looks like. Before M3 we know none of those numbers.

While ignorant, pick the option that is **easiest to debug and simplest to operate**, and **defer the decision until there is data**. That beats guessing at UDP now and then fighting through debugging hell.

Option C was rejected because **premature abstraction is debt.** What would a transport abstraction abstract? Before we know the shape of the messages, the interface we extract will most likely have to be torn down, and by then two implementations will depend on it.

## 5. Consequences

**Costs accepted:**
- If measurement proves TCP does not work, M4 spends time migrating (an estimated 1–2 weeks of equivalent effort)
- Network-related tasks pause during the migration

**Capabilities gained:**
- M3 reaches a playable multiplayer build sooner, which exposes the more important question — is four people playing together actually fun — earlier
- Network problems are easy to diagnose, so bots do not get stuck on WebRTC connection negotiation

**Preparation that is not optional:**
- M3 must build the **network test rig** (latency/packet-loss injection). This is one of the M3 release conditions and cannot be dropped
- `transport.ts` stays the single point of contact; calling the Colyseus API directly from game code is forbidden (CI-checked)

## 6. ★ Rollback conditions (measurable)

At the M3 convergence review, if **any** of the following holds, A1 must raise ADR-00XX to switch transports:

| # | Condition | How it is measured |
|---|---|---|
| 1 | At 150ms RTT + 2% packet loss, parry success rate drops > 25% relative to local play | Automated script on the network test rig, 200 attempts |
| 2 | Under the same conditions, visible position jumps on remote characters (single-frame displacement > 0.8 units) occur more than 3 times per minute | Telemetry instrumentation |
| 3 | Per-room upstream bandwidth > 40 kbps or downstream > 120 kbps | Test rig statistics |
| 4 | With 4 players in a full enemy scene, server CPU per room > 8% of 1 core | Load test |

**Also agreed**: even if every condition passes, M4 reviews this once more; and even if every condition fails, **the remaining M3 release conditions are completed first** before migrating — the transport layer is never swapped mid-milestone.

---

## 7. Related

- `docs/02-tech/architecture.md §1 §4`
- `docs/04-plan/roadmap.md` M3 release conditions
- Future contract: `contracts/net-protocol.md` (drafted in M3)
