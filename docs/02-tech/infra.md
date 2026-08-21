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

## Branch protection

**What the settings must be is not written here.** It is in
`docs/_studio/docs/04-grokbot/setup.md` §3, and what they actually are is read from GitHub by
`node tools/verify-protection.mjs`, on O1's weekly routine.

This section used to state the settings itself, and by the time anyone read it again two of
them were wrong — it still required one approving review and a status check named after the
workflow, which is the exact configuration that caused andon A-2026-08-21-1 and left the
repository unmergeable for a day. A copy of a setting is a claim that ages; the tool that reads
the setting cannot.

What belongs here is only what is specific to this repository, and there is one thing:

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

It is now `true`. The cost is that nobody can push to main, the human included, and that is the
point rather than the price.

### When something has to land and the gates are the thing that is broken

Turning protection off is not the answer, and this document used to say it was — it printed the
commands. Nothing that pushes straight to main leaves a reviewable record of what it did.

The framework's answer is the `break-glass` label: the repair pull request carries it, updates
`board/andon.md` in the same diff, and the gates that were blocking it downgrade to warnings.
Human approval is never waived. See `docs/_studio/docs/04-grokbot/skills/sop-andon.md`.

A bot that disables `enforce_admins`, force-pushes, or merges with `--admin` is an andon pull
and an entry in `board/trust-ledger.md`, whatever its reason was.

## What the draft must state clearly

1. **Rebuild in one command**: `tools/bootstrap/` must be able to rebuild the whole environment on a blank Linux box with a single command. This is what the constitution's reproducibility requirement looks like at the infrastructure layer.
2. **No snowflake servers**: any manual change is written back into the bootstrap script the same day, and recorded in `board/ops/` until it is.
3. Backup and restore drills (see `backup.md`)
4. Monitoring and alerting
5. Deployment process and rollback
6. Secret management: **no credential ever enters git**
