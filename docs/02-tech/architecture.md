# Technical Architecture

> Status: DRAFT v0.1 · Owner: Architect (A1) · Freezing requires human approval
> Changes require an ADR. Contract files live in `docs/02-tech/contracts/`.

---

## 1. Technology choices and why

| Layer | Choice | Reasoning | Alternatives and why they lost |
|---|---|---|---|
| Language | **TypeScript** (strict) | Type checking is the single most effective guard rail for a weak agent; mature ecosystem | JS has no types → out; Rust/C++ iterate slowly and agents get them wrong more often |
| Rendering | **Three.js** | The de facto standard for 3D on the web, with the most documentation and examples (which matters enormously for agents) | Babylon.js would also work, but Three has an order of magnitude more community samples |
| Physics / collision | **Custom 2.5D collision** (M1) → bring in Rapier only if a case appears that capsules plus sweep queries cannot express | An ARPG needs capsules and sweep queries, nothing more; a full rigid-body solver is overhead and breaks determinism | Rapier 3D: configuring it for determinism is involved, and M1 does not need it |
| Multiplayer | **Colyseus** (MIT, self-hostable) | Rooms, matchmaking and state sync out of the box; WebSocket is stable and has no traversal problems | geckos.io (WebRTC/UDP) is smoother but costs more in operations and debugging. **Colyseus for M3; at M4 the measurements decide whether to move to UDP**, via ADR |
| State management | **Custom ECS** (bitECS-style, SoA) | We need strict determinism and serialisability; most off-the-shelf ECS libraries carry implicit global state | bitECS could be used directly; evaluate during M1 |
| UI | **React** (HUD/menus only) | Menus and economy screens are complex, and React's ecosystem is mature | Iron law: **React never enters the game loop** |
| Build | **Vite + pnpm workspaces** | Fast, little configuration | — |
| Validation | **Zod** (runtime) + generated JSON Schema | One definition yields TS types, runtime validation and the content data schema | — |
| Testing | **Vitest** + custom frame-data snapshots | Same toolchain as Vite, and fast | — |
| Database | **PostgreSQL** (accounts/economy/audit) + Redis (sessions/leaderboards) | The economy needs transactions and an audit trail, so it has to be relational | SQLite: fine standalone, but the economy service must be Postgres |
| Desktop wrapper | **Electron + steamworks.js** | The most established path to official Steam support; Chromium renders faster than the system WebView | Tauri: WebKit renders poorly on Mac/Linux and Steam integration means writing Rust. NW.js: easy to package but its ecosystem is shrinking |
| CI | **GitHub Actions** (+ self-hosted runner) | Same home as the repository, and events can trigger Grok Bot routines | — |

---

## 2. Repository layout (monorepo)

```
sunset-club/
├─ AGENTS.md                    # Bot entry constraints (required reading for every bot)
├─ docs/                        # All documentation (see docs/README.md)
│  └─ _studio/                  # Read-only mirror of the studio framework, pinned by .studio-version
├─ board/                       # The queue, task cards, and the records nothing derives (see board/README.md)
├─ evidence/                    # Task evidence packs
├─ packages/
│  ├─ sim/         # ★ Pure logic core. Zero DOM / zero network / zero IO. Shared by client and server
│  ├─ protocol/    # ★ Network messages and save schemas (Zod). The frozen contract zone
│  ├─ content/     # ★ Data-driven content: enemies/equipment/recipes/frame data/delves/text
│  ├─ client/      # Three.js rendering, input, UI, audio, prediction and interpolation
│  ├─ server/      # Colyseus authoritative server, persistence, matchmaking, auditing
│  ├─ econ-sim/    # Economy Monte Carlo simulator
│  ├─ telemetry/   # Instrumentation and analysis
│  └─ shared/      # Pure utility functions (maths, randomness, serialisation)
├─ assets/                      # Art and audio source assets + palettes
├─ tools/
│  ├─ bootstrap/   # Environment setup (idempotent)
│  ├─ lanes/       # worktree lane management
│  ├─ gates/       # Gate scripts (lane check, diff size, task-id check)
│  ├─ art-lint/    # Art style lint + juice lint
│  └─ asset-gen/   # Procedural / AI asset generation pipeline
├─ deploy/                      # Deployment scripts and environment definitions
└─ .github/workflows/           # CI
```

### 2.1 Dependency direction (not negotiable)

```
content ──┐
shared ───┼──> sim ──┬──> client
protocol ─┘          └──> server
                            │
telemetry <─────────────────┘
econ-sim ──> content, shared   (standalone; does not depend on sim)
```

**Forbidden dependencies** (CI-checked):
- `sim` → `client` / `server` / `three` / any DOM or Node IO
- `client` → `server`
- `content` → any code package (content is pure data)

---

## 3. Three core architectural principles

### 3.1 One sim
Client and server run **the same `packages/sim`**. A "server-side version of the combat logic" is not permitted to exist.

- Client: runs sim for prediction plus rendering
- Server: runs sim for authoritative adjudication
- When the two disagree → the server wins, and the client reconciles by rolling back

Break this principle and network sync problems grow exponentially; a weak agent will certainly write divergent behaviour into two copies of the logic.

### 3.2 Determinism
- Fixed logic tick: **30Hz**
- All randomness goes through a seeded PRNG (`shared/rng.ts`, xorshift128+); `Math.random()` is forbidden
- `Date.now()` must not enter sim (time comes from the tick counter)
- Floating point: normalise the critical calculations with `Math.fround`; collision and displacement use fixed point (units of 1/1024)
- **Verification**: replay test — given a seed plus an input sequence, the world state hash after 2000 ticks must match the snapshot

### 3.3 Sim emits, client renders
The sim does not know that "effects" exist. It only emits structured events:

```ts
// packages/protocol/src/combat-events.ts (DRAFT v0 — see contracts/combat-events.md)
type CombatEvent =
  | { t: 'hit_confirmed'; attacker: EntityId; target: EntityId; kind: HitKind; dmg: number; crit: boolean; pos: Vec3 }
  | { t: 'parry_success'; who: EntityId; against: EntityId; tick: number }
  | { t: 'poise_broken'; target: EntityId; by: EntityId }
  | { t: 'duet_triggered'; duetId: DuetId; members: EntityId[]; level: 1|2|3 }
  | { t: 'wound_flared'; who: EntityId; woundId: WoundId }
  | { t: 'memory_recalled'; who: EntityId; memoryId: MemoryId }
  // ...
```

The client subscribes to events → looks them up in a table → plays VFX / SFX / screen shake / hitstop.
What this buys us: **presentation can be changed freely without touching the logic, and testing the logic needs no renderer.**

---

## 4. Network model (from M3)

```
Client                                            Server (Colyseus Room)
  │                                                  │
  ├─ sample input ──> predict locally immediately    │
  ├─ send InputCommand{tick, seq, buttons} ──────────┤
  │                                                  ├─ buffer input, run sim in tick order
  │                                                  ├─ snapshot state every tick
  │  <── StateSnapshot{tick, ackSeq, delta} ─────────┤ (20Hz downstream, delta compressed)
  ├─ reconcile: roll back to ackSeq, replay unacked  │
  └─ remote entities: 100ms buffer + interpolation   │
```

| Parameter | Value |
|---|---|
| Logic tick | 30Hz |
| Downstream snapshots | 20Hz (delta compressed) |
| Interpolation buffer | 100ms |
| Extrapolation limit | 200ms (beyond that, freeze and show a connection warning) |
| Room capacity | 4 players |
| Authoritative scope | Damage, drops, currency, trades, experience, every persisted change |

**Anti-cheat boundary**: the client sends **buttons and facing only** — never positions, never damage. The server validates input for legality (rate, rate of change of facing).

---

## 5. Render pipeline (3D pixel art)

The full specification is in `docs/01-game/art-bible.md`; this section only gives the pipeline structure.

```
Scene (Three.js)
  ↓ render into a low-resolution WebGLRenderTarget  384×216, NearestFilter, no mipmaps, no MSAA
  ↓ [Pass 1] vertex snapping (injected via material onBeforeCompile; snap grid = render target resolution)
  ↓ [Pass 2] depth fog (linear space)
  ↓ [Pass 3] palette quantisation + Bayer 4×4 ordered dithering
  ↓ [Pass 4] optional CRT / scanlines (off by default, switchable in settings)
  ↓ upsample to the canvas with a fullscreen triangle, integer scaling preferred (1080p = 5× of 384×216 → exactly 1920×1080)
```

**Key constraints**:
- Render resolution is **384×216** (= 1920×1080 ÷ 5, an integer factor, so zero interpolation blur)
- The camera position snaps to the pixel grid (otherwise everything jitters; this is the most common way 3D pixel art falls over)
- The palette is fixed at 40 colours (see `assets/palettes/sunset-40.png`)
- **UI does not go through post-processing**: the HUD renders on its own layer at full resolution (text at the low resolution is unreadable)

---

## 6. Performance budgets

| Item | Budget |
|---|---|
| Draw calls (typical combat scene) | ≤ 120 |
| Triangles (on screen) | ≤ 60k |
| Texture memory | ≤ 128MB |
| sim tick cost (4 players + 24 enemies) | ≤ 2ms |
| Client frame time p99 | ≤ 18.2ms |
| Server CPU per room | ≤ 8% of 1 core |
| Per-server target | 300–1000 CCU (roughly 75–250 rooms) |

Over budget = CI red. Changing a budget requires an ADR.

---

## 7. Data and persistence (from M3)

| Data | Storage | Notes |
|---|---|---|
| Accounts, characters, clubs, mentors | PostgreSQL | |
| Item instances | PostgreSQL (unique ID per item) | Makes auditing and tracing possible |
| Currency changes | PostgreSQL **append-only audit table** | Iron law: no direct UPDATE of a balance without a record |
| Trades and auctions | PostgreSQL (transactional) | |
| Sessions, rooms, leaderboards | Redis | |
| Telemetry | Separate database/files, written asynchronously | Must not block game logic |

**Audit table design** (contract-level): every currency movement records `(id, account, currency, delta, balance_after, reason_code, ref_id, tick/ts)`. When the economy breaks, this is what a rollback is built on.

---

## 8. Environments and deployment

| Environment | Purpose | Deployment |
|---|---|---|
| `local` | The development environment a bot runs inside its lane | `pnpm dev` |
| `ci` | GitHub Actions | Every PR |
| `staging` | Internal playable build, for D1 playtests and Q1 acceptance | Auto-deployed from main |
| `prod` | Player-facing servers (from M5) | Manually approved deployment |

**During M0**: `staging` hosts the client-only build on GitHub Pages / Cloudflare Pages (no server) — sufficient, and zero operations work.
**From M3**: one Linux server is needed to run Colyseus + Postgres + Redis. See `docs/02-tech/infra.md`.

---

## 9. Known risks and contingencies

| Risk | Likelihood | Impact | Contingency |
|---|---|---|---|
| Colyseus latency is unacceptable in fast four-player combat | Medium | High | Measure on the network test rig before M3 closes; if it misses the targets, ADR the switch to geckos.io |
| Determinism broken by floating point | Medium | High | Fixed point on the critical path; the replay test runs in every CI job |
| The Steam overlay does not work under Electron | Medium | Medium | Spike early in M6; NW.js as the fallback |
| 3D pixel art jitters or flickers under dynamic lighting | High | Medium | Address it first thing in M2; if necessary switch to fully baked lighting plus a small number of dynamic point lights |
| The shared cloud machine cannot run the full test suite | Medium | Medium | CI runs on GitHub Actions or a self-hosted runner; heavy work never runs on the cloud machine |
