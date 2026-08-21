# Andon

Append-only. Add your own entry; never edit anyone else's.

Four triggers, and only these four:

1. The default branch is red.
2. Two specifications contradict each other and code is being written against one of them.
3. A `FROZEN` contract was violated.
4. Work in flight rests on an assumption now known to be false.

Anything else is a blocker report. Keeping the list short is what keeps the cord meaningful.

**Pulling unnecessarily is never penalised. Failing to pull is.** A false alarm costs an
hour. An unpulled cord costs everything built on the broken assumption between now and
whenever somebody eventually notices, which is always later than this.

---

## A-2026-08-21-1 · Nothing in this repository could merge

- Pulled by: A1 at 2026-08-21T08:05:00Z
- Type: false-assumption
- Affected: T-000, and every task that would have followed it. Nothing to stop, because
  nothing had started — which is the only reason this cost a day instead of a month.
- Evidence: `gh api repos/catchyan/sunset-club/branches/main/protection` returned
  `required_status_checks.contexts = ["gates"]`. That is the workflow's name; GitHub matches
  job names, and the jobs here are mirror, lane, envelope, docs, build, feel, summary. The
  required check never reported. Pull request #2 showed seven green gates and
  `mergeStateStatus: BLOCKED`. Captured in `evidence/T-000/protection.txt`.
- Second cause on the same configuration: `required_approving_review_count: 1`, which no
  shared account can ever satisfy, because GitHub will not let an account approve its own
  pull request.
- Assumption now known to be false: that a green pull request is a mergeable one, and more
  generally that a gate which has been read is a gate that works. Three audits of the
  framework found sixteen more defects of the same shape.
- Status: CLOSED at 2026-08-21T09:10:00Z
- What was actually wrong: the repository's own configuration, which is the one thing no
  gate in the repository can see. Behind it, a framework that had never been used: the
  hand-written CI here was written from a paragraph of prose because no template shipped,
  and it is where both the unreachable required check and the missing upstream mirror
  comparison came from.
- What was done: protection corrected to require `summary`, with reviews left to the
  envelope gate's `APPROVED-BY` since a shared account cannot use GitHub's. Framework
  v3.0.0 closed the audit findings; this repository pins it and now takes its workflow from
  the shipped template.
- Which gate should have caught it: **none existed.** Now R11 runs
  `node docs/_studio/tools/verify-protection.mjs` weekly, and G4 refuses a workflow with no
  `summary` job or one whose `needs` list omits a gate. Neither could have caught it from
  inside; the first check that matters here runs from outside the repository.

<!--
On close, replace the status line with all three of these:

- Status: CLOSED at <ISO timestamp>
- What was actually wrong:
- What was done:
- Which gate should have caught it: <gate id, or "none exists">

The last line is mandatory. "None exists" is the only legitimate source of new gates —
the constitution requires a real incident before the process is allowed to grow.
-->
