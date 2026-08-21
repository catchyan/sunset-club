# Infrastructure

> Status: **STUB** · Owner: O1 Operator · To be drafted: **before M3**
> A placeholder. M0–M2 need no server; see below.

---

## M0–M2: no server needed

`architecture.md §8` already settled it: staging hosts the client-only build on Cloudflare Pages / GitHub Pages. Zero operations, zero cost, and one URL is enough to play it.

**Do not stand up a server early.** A server nobody uses is, two months later, guaranteed to be a server nobody remembers how to configure.

## What is needed from M3

| Component | Purpose | Minimum spec |
|---|---|---|
| Colyseus | Authoritative server | See `architecture.md §6`: ≤8% of 1 core per room |
| PostgreSQL | Accounts, characters, item instances, currency audit table | Needs transactions and an append-only audit table |
| Redis | Sessions, rooms, leaderboards | |
| Reverse proxy | TLS, WebSocket upgrade | Caddy preferred (automatic certificates) |

Against the 300–1000 CCU target (`architecture.md §6`), 4C8G is enough to start with, and it has to be vertically scalable.

## ⚠️ Currently known problem

The server the human provided (the address is not written into a public repository — see the end of this section) is **unreachable from the development environment**:

- The TCP three-way handshake **reports success on all of** 22 / 2222 / 22022 / 80 / 443 / 8080
- But the SSH banner exchange times out (`ssh -vv` hangs at `Connection timed out during banner exchange`)
- ICMP does not get through

Every port ACKs and no service responds: that is the signature of carrier-side responsive filtering or CGNAT — what the outside world sees is a gateway answering on behalf of that address, not the host itself.

**Conclusion**: this machine cannot be the deployment target for M3 unless the human confirms a genuinely reachable address or supplies a different VPS.
**Impact**: none on M0–M2. It must be resolved before M3 begins. The human has confirmed: **deal with it before M3**.

> 🔒 **This repository is public. Host addresses, ports and credentials are never written into it.**
> The deployment target is injected through environment variables or GitHub Secrets; locally it lives in `.env` (already in `.gitignore`).
> This is not only about the server — it applies to any credential. A bot writing documentation will paste a connection string in without thinking about it.

## Branch protection (resolved)

**Current state: in force and verified by test.**

```
Repository:            catchyan/sunset-club  (public)
Require PR:            yes, 1 approving review, dismiss stale reviews
Required status check: gates  (strict)
enforce_admins:        true
Force push / delete:   blocked
```

Verified: `git push origin main` returns `GH006: Protected branch update failed`.

### How we got here (for whoever comes next)

The repository was first created private, but **a free account cannot enable branch protection or rulesets on a private repository** — both the branch protection API and the rulesets API return 403 "Upgrade to GitHub Pro or make this repository public".

This is not a minor annoyance. RELAY's enforcement chain is:

```
lane ownership table → CI gates → branch protection refuses merges that did not pass → out-of-lane changes physically cannot reach main
```

**Remove the last link and the first three degrade into advice.** And the characteristic behaviour of a weak agent that hits an obstacle is precisely to look for a way around it — one successful `git push origin main` and it has learned that route.

The human executive producer chose to **make the repository public**. Side benefit: public repositories have unlimited Actions minutes, which is a real gain for a project that runs CI on every PR.

### ⚠️ `enforce_admins` must be true

On the first configuration `enforce_admins` was set to false, to leave the human an emergency channel. **That was a hole**:

**Bots push using the human's GitHub account.** The human's account is an admin. Admin exempt = bot exempt.
The entire protection scheme was completely ineffective against exactly what it was meant to stop.

It is now `true`. The cost is that the human cannot push to main either — which is correct; see the right way to do it below.

### The right way when the human needs to land something directly

**Do not** leave `enforce_admins` off for any length of time. Use an explicit, traceable switch with the smallest possible time window:

```bash
# 1. Turn it off (this step leaves a record in the repository audit log)
gh api -X DELETE repos/catchyan/sunset-club/branches/main/protection/enforce_admins
# 2. Push
git push origin main
# 3. Restore it immediately. Not "in a bit"
gh api -X POST   repos/catchyan/sunset-club/branches/main/protection/enforce_admins
# 4. Confirm
gh api repos/catchyan/sunset-club/branches/main/protection/enforce_admins
```

**Any bot executing step 1 above = pull the andon cord immediately + an entry in the trust ledger.** This channel belongs to the human alone.
Recommendation: add `enforce_admins` to the Require Approval list in Grok Bot's Auto-review.

## What the draft must state clearly

1. **Rebuild in one command**: `tools/bootstrap/` must be able to rebuild the whole environment on a blank Linux box with a single command. This is what the constitution's reproducibility requirement looks like at the infrastructure layer.
2. **No snowflake servers**: any manual change is written back into the bootstrap script the same day, and recorded in `board/ops/` until it is.
3. Backup and restore drills (see `backup.md`)
4. Monitoring and alerting
5. Deployment process and rollback
6. Secret management: **no credential ever enters git**
