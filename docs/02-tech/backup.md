# Backup & Recovery

> Status: **STUB** · Owner: O1 Operator · To be drafted: **before M3** (it must be finished before there is real player data)

---

## The only line that matters

**A backup whose restore has never been rehearsed is not a backup.**

The point of this document is not "we back up daily" — it is "the last time we successfully restored from a backup was *this* date".

## Questions it must answer

1. What is backed up, how often, and retained for how long
2. **How often restore drills happen, and where they are recorded** (monthly, with the result written into `board/ops/`). A backup nobody has restored is a belief, not a backup
3. RPO (how much data we can accept losing) and RTO (how long we can accept being down)
4. Where backups live — **not on the same machine and not under the same account as production**
5. Special handling for economy data: the currency audit table is append-only, so a restore must guarantee no replayed and no dropped entries

## Backups during M0–M2

The only thing currently worth backing up is **this git repository**, and it is already on GitHub.

One thing to watch, though: **uncommitted changes on the cloud machine are not persistent state.** A Grok Bot cloud machine can be reset.
That is one of the reasons the constitution demands small commits — not for a tidy git history, but because anything uncommitted can disappear at any moment.
