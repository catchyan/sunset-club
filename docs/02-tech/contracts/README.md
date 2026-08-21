# Contracts

> Owner: A1 · Freezing requires the human's approval

Constitution, article 2 — contracts before implementations: **any cross-module data structure, network message, save format or content data has its schema defined here and frozen before anyone writes an implementation against it.**

There is exactly one reason this rule exists: when several bots work in parallel, **mismatched interfaces are the most expensive rework there is**. Three hours of one bot's work thrown away because another bot understood a field name differently — in projects without a contract zone, that happens weekly.

---

## 1. The three states of a contract

| State | Meaning | Who may change it |
|---|---|---|
| `DRAFT` | Under discussion; **nobody may start implementing** | A1 edits directly |
| `FROZEN` | Frozen; implementation may begin | **Nobody**. It takes an ADR |
| `SUPERSEDED` | Replaced by a newer version | Read-only, kept for traceability |

Every contract file must carry this at the top:

```markdown
> Status: FROZEN | Version: 3 | Frozen at: 2026-09-01 | Frozen by: the human
> Supersedes: v2 (ADR-0007)
```

## 2. The freezing process

```
A1 drafts (DRAFT)
  → Monday planning review (every implementing role must say "can I build against this or not?")
  → A1 revises
  → the human approves
  → marked FROZEN, version +1
  → then, and only then, P0 may dispatch tasks that depend on this contract
```

**Hard constraint on P0**: if a contract referenced in section 4 of a task card is still `DRAFT`, that card does not go out.

## 3. The change process (after a contract is FROZEN)

When a contract turns out to be wrong — which is normal, and nothing to be embarrassed about:

1. **Stop.** Not "let me just change the code the way I understand it and sort this out later".
2. Raise an ADR per `/sop-adr` covering: why the current contract does not work, at least two alternatives, and the cost of the change.
3. A1 reviews → the human approves.
4. Contract version +1; the old version is marked `SUPERSEDED`.
5. A1 is responsible for listing **every affected code location**, and the Steward dispatches the migration tasks.

**Modifying a FROZEN contract without an ADR = pull the andon cord immediately, and one occurrence goes into the trust ledger as an escalation to two-person review.** This is the most serious violation in this project, far worse than writing bad code — bad code affects one module, a broken contract affects everybody.

## 4. How contracts relate to code

Contract documents are **for humans**, `packages/protocol/` is **for machines**, and the two must agree.

- Single source of definition: `packages/protocol/src/**`, defined with Zod
- Generated from Zod: TS types, runtime validators, JSON Schema
- CI check: the field tables in the contract documents are compared field by field against the Zod definitions (`tools/gates/contract-sync.ts`)
- A mismatch → CI red, and S1 records it in `board/drift.md`

## 5. Contract inventory

| Contract | File | State | Milestone that needs it | Who depends on it |
|---|---|---|---|---|
| Combat events | `combat-events.md` | **DRAFT v0** | M1 | E1, E2, V1, U1 |
| Content data schema | `content-schema.md` | **DRAFT v0** | M1 | E1, D1, V1 |
| Network protocol | `net-protocol.md` | *not drafted* | M3 | E1, E2, E3 |
| Saves and characters | `save-format.md` | *not drafted* | M4 | E3, C1 |
| Economy ledger | `economy-ledger.md` | *not drafted* | M5 | E3, C1 |
| Telemetry events | `telemetry-events.md` | *not drafted* | M5 | C1, D1 |

> **Do not draft contracts for future milestones ahead of time.** Contracts first means "before the implementation", not "the earlier the better".
> A contract frozen too early is built on wrong assumptions, which is worse than having no contract. The M3 network protocol waits until the M1 combat system is running and we know what actually has to be synchronised each tick.
