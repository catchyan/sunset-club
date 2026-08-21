# Roadmap

> Owner: P0. Changing a milestone's scope or release conditions needs the human's approval.

Milestones are vertical slices, and none of them has a date. Each has a **scope** and a set
of **release conditions**. If the conditions are not met the next milestone does not start,
however long that takes.

Three reasons there are no dates. One human reviews for thirty minutes a day, so a date only
buys rushed work. Agent throughput is not predictable, so estimates are fiction. And the
brief was explicit: quality and taste, not speed.

The only clock is the one in `docs/_studio/docs/01-framework/cadence.md`, and it exists to
catch a stall, not to set a pace.

---

## At a glance

| # | Name | The question it answers | The one-line release test | Roles added |
|---|---|---|---|---|
| **M0** | Foundation | Can this process run at all? | A deliberately boring pull request goes from dispatch to merge through every gate with no human touching it | P0 A1 Q1 S1 O1 |
| **M1** | The Feel | Is fighting good? | The human plays for ten minutes and does not want to stop | D1 E1 E2 |
| **M2** | The Look | Does it look and sound like something? | One screenshot makes a stranger ask what game it is | V1 U1 |
| **M3** | The Party | Is it still good with four? | Four players clear a floor under injected latency with no rubber-banding | E3 |
| **M4** | The Aging | Does the long arc hold? | One character goes from first delve to retirement to lineage, and the retirement lands | C1 N1 |
| **M5** | The Market | Is the economy alive? | A simulated year stays inside its bands, and twenty real players for a week do too | — |
| **M6** | The Long Dusk | Can we sell it? | The Steam page is live and the Early Access build installs, runs, and can be bought | — |

Headcount per milestone is in `docs/03-process/staffing.md`. Scope is cut before headcount is
raised.

---

## M0 · Foundation

> M0 produces no game. It produces the ability to produce a game.
>
> The requirement it exists to satisfy: the work has to be feasible, recursively improvable,
> and auditable **even when the agents are not clever**. That property is built here or not
> at all — a team that skips it does not discover the cost until the thing it is building is
> too large to inspect.

### Scope

1. The repository, branch protection, and the framework mirror pinned and verified.
2. The pnpm workspace: TypeScript strict, Vite, Vitest, and the empty packages that
   `docs/02-tech/dependency-graph.md` names.
3. G1 to G6 running in CI as jobs, matching the table in
   `docs/_studio/docs/03-gates/gates.md` clause for clause.
4. `tools/gates/` complete: the ownership assertions, the dependency-direction check.
5. `tools/lanes/`: create a worktree lane, and reclaim an abandoned one.
6. The five M0 roles online, each configured from its role card plus
   `docs/03-process/staffing.md`, with the six SOPs installed.
7. The routines in `docs/_studio/docs/04-grokbot/routines.md` scheduled and firing.
8. A staging deployment that updates on merge.

### Release conditions

- [ ] **The boring task.** P0 dispatches something with no interest in it whatsoever — render
      a spinning triangle, add a unit test — and it reaches `main` **without a human
      intervening at any point**, with a complete evidence pack.
- [ ] **Every negative test** in `docs/_studio/docs/04-grokbot/setup.md` step 9 has been run
      and produced the expected red, each recorded with its output. Task T-004. The count is
      not repeated here: it was written as eight, the framework grew to nineteen, and this line
      went on asking for eight.
- [ ] Three consecutive nights where the generated board plus P0's note takes the human under
      five minutes to read, and carries at most three decisions.
- [ ] One command rebuilds the whole environment on a blank Linux machine.

> **The negative tests are the point of M0.** Proving the pipeline works when nothing goes
> wrong proves nothing: the entire reason this framework exists is to catch the case where
> something does. A gate nobody has watched fail is a gate nobody knows works, and the first
> time it stays green during a real failure is the worst possible time to find out.

---

## M1 · The Feel

> The line the project lives or dies on. If the feel is not there, nothing after it matters
> and we would rather spend six months here.

### Scope

- One character, Lu Laosan, with the complete move set: three-hit light, heavy, charge, roll,
  Stance, Parry.
- Three enemies: a melee grunt, a ranged grunt, and an elite with a telegraphed heavy.
- One room. Grey boxes; M1 has no art.
- The Juice Six in full.
- Every frame value in `docs/01-game/feel-spec.md` implemented and asserted by a test.
- The `packages/sim` ECS, determinism, and the replay test.
- Controller and keyboard/mouse, both.
- Poise and executions.

### Release conditions

- [ ] The four automated tests in `feel-spec.md` are green: frame-data snapshot, input
      latency within two frames, juice lint, performance benchmark.
- [ ] Replay: the world hash after 2000 ticks matches across runs and across machines.
- [ ] **Taste review at or above 4.0 of 5**, with impact and input response each at or above
      4. Rubric in `docs/_studio/docs/03-gates/gates.md`, section H2.
- [ ] **The ten-minute test.** The human plays ten consecutive minutes without checking the
      clock. D1 watches, writes down every moment that felt wrong in `board/playtests/`, and
      each one is either fixed or accepted in writing. Accepted in writing counts; forgotten
      does not.
- [ ] All three enemies' telegraph frames satisfy the readability rule in `feel-spec.md`.
- [ ] At least three playtest notes in `board/playtests/`.

### Explicitly not doing

Networking, art, economy, story, more characters, loot, UI polish. Every "while we're in
here" proposal is refused, including the good ones — especially the good ones, which are the
only ones anyone argues for.

---

## M2 · The Look

### Scope

- The pixel render pipeline finished: the passes named in `docs/02-tech/architecture.md`.
- Camera pixel snapping, dithering, palette quantisation.
- `assets/palettes/sunset-40.png` final.
- **`tools/art-lint` complete.** This, not any individual picture, is what M2 delivers.
- `tools/asset-gen`: procedural plus generated, with compliance checked before an asset is
  ever looked at.
- The first compliant batch: Lu Laosan, three enemies, one room.
- The first audio batch: three-layer combat sound, three variants per impact.
- Pixel jitter under a moving camera solved.

### Release conditions

- [ ] art-lint covers every machine-checkable clause of `docs/01-game/art-bible.md`, and every
      existing asset passes.
- [ ] One 1920×1080 screenshot, with visual distinctiveness at or above 4 in the taste review.
- [ ] **The stranger test.** Show the screenshot to three people who know nothing about the
      project. At least two ask what it is or say something unprompted and positive, and their
      exact words are written down. Paraphrase is not evidence.
- [ ] No pixel jitter while the camera moves, checked frame by frame from a recording.
- [ ] No performance budget in `art-bible.md` exceeded.
- [ ] Generated assets pass on the first attempt at least half the time. Below that the
      constraints in asset-gen are too loose, and the fix is the generator, not a person
      sorting through its output.

---

## M3 · The Party

### Scope

- The authoritative server, with `packages/sim` running identically on both ends.
- Client prediction, server reconciliation, snapshot interpolation.
- Four-player rooms, matchmaking, reconnection.
- At least two Duets, and Rapport.
- Zhong Bu'er implemented. His prosthetic seizing is a forced cooperation point, so it has to
  be proven with four real players rather than reasoned about.
- The command wheel.
- Per-player loot.
- The network rig: injectable latency, jitter, packet loss.
- The persistence skeleton and the audit table.

### Release conditions

- [ ] At **100 ms round trip, 30 ms jitter, 2% loss**, four players clear a floor with:
  - [ ] fewer than three visible rollback displacements over 0.5 units per minute;
  - [ ] hit adjudication agreeing at or above 99% — the client predicts a hit and the server
        disagrees in under 1% of swings.
- [ ] A disconnected player is back in the fight within 30 seconds.
- [ ] Server CPU at or below 8% of one core per room.
- [ ] **Duets read.** Record a full four-player run containing at least three Duets. For each
      one the human writes down whether it was legible — could you tell what happened? — and
      whether it looked good.
- [ ] Hand-craft a client message claiming damage it did not earn. The server rejects it and
      writes an audit row.
- [ ] Taste review at or above 4.0, with the sense of coordination at or above 4.

---

## M4 · The Aging

### Scope

- Long-term decline on all three Stamina axes.
- Old Wounds: flare-ups, worsening, convalescence, wound-specific Memories.
- Memories: trigger conditions, recollection scenes, at least twelve.
- The retirement rite and Legacy settlement.
- Lineage: Craft, Memories, and hard-won knowledge of a wound passing to the next character.
- Mentors in the Club, and mentor dialogue.
- Vigor, and Silver at its simplest.
- Su Jiuniang and Lao Nie implemented, so all four exist.
- N1's first pass of world facts and text.

### Release conditions

- [ ] **The full lifecycle runs.** One character from creation through retirement into a
      successor, end to end, no hangs and nothing lost.
- [ ] 100 lifecycles at accelerated time, one game day per minute, with no invalid state
      reported.
- [ ] Every Memory's trigger is discoverable. D1 goes through them one at a time and writes
      down the in-game signal that could lead a player there. "Knowing nothing, could I have
      found this?" A Memory with no answer is cut or given a signal.
- [ ] **The retirement lands.** The human goes through one rite in full and records a verdict.
      One vote, not a score. This one is not quantifiable and pretending otherwise would only
      launder the judgement.
- [ ] N1 checks the tone against the vision's three slopes clause by clause; S1 re-checks.
- [ ] The Stamina decline rate has been through at least two rounds of tuning.

---

## M5 · The Market

### Scope

- Silver, Renown, and Legacy complete.
- The Delve Permit pricing regulator.
- Auction house, player stalls, the Job Board.
- Services between players: tuition, commissioned crafting, appraisal.
- Three-slot forging and the furnace-temperature minigame.
- The market board and the personal ledger.
- **`packages/econ-sim`, and the simulation gate that runs it.**
- Progressive trade tax and the Common Fund.
- The instrumentation in `docs/01-game/telemetry-spec.md`, wired and reporting.

### Release conditions

- [ ] Every stability criterion in `docs/01-game/gdd-economy.md` inside its band, over 10,000
      players and 365 simulated days.
- [ ] Sensitivity: perturb each of α, P_base and M_target by ±30% and the system still
      converges.
- [ ] **Stress.** Inject 500 accounts playing purely to maximise output. The economy recovers
      on its own within 60 simulated days, with no intervention.
- [ ] **Live.** At least twenty people play a full week. The same criteria, computed on real
      data, stay inside their bands, and at least one person posts market analysis nobody
      asked them for. That last one is the real test: a market people theorise about is alive,
      and one they ignore is a number going up.
- [ ] Every currency movement has an audit row, and a random hundred can be traced end to end.
- [ ] The auction house answers in under 200 ms with a thousand listings.

---

## M6 · The Long Dusk

### Scope

- Content: at least five delve themes, forty enemy types, three bosses, a rotating affix pool.
- The Codex, Common Fund events, reputation.
- The Electron wrapper and Steam integration: achievements, cloud saves, invites, overlay.
- The store page, art, a trailer.
- Onboarding and accessibility: remapping, colour-blind modes, text size.
- Localisation, Chinese and English.
- Operations: monitoring, backups, the tooling to act on an exploit.

### Release conditions

- [ ] The build installs and runs on a clean Windows machine, and the overlay opens over it.
- [ ] One full playthrough, new character to final boss, with no blocking bug.
- [ ] At least fifty people in a closed beta for a week, crashing under 0.5% per hour.
- [ ] Every item in the taste review at or above 4.0, averaging at or above 4.3.
- [ ] The human approves the store page.
- [ ] The incident drill has been run once: simulate an economy exploit, find it, roll it
      back, publish the notice. Rehearsed before it is needed, because the first time is
      always at the worst moment.

---

## Inside a milestone

Weekly, per `docs/_studio/docs/01-framework/cadence.md`: planning Monday, demo Friday,
retrospective straight after. Planning answers one question — what is the smallest thing that
would be playable by Friday.

**Sprint completion is not a measure of anything.** The only one is how many release
conditions closed. A week with ten tasks finished and no condition closed was a wasted week,
and it goes in the retrospective as one.

---

## Risks

| Risk | Cost | The signal that it is happening | What we do |
|---|---|---|---|
| **The feel never comes together in M1** | Ends the project | Three rounds of playtesting and the taste review is still under 3.5 | Stop. The human and D1 redesign, with an outside consultant if it comes to that. Do not proceed to M2 on the theory that art will fix it |
| Throughput cannot cover the scope | High | Three consecutive weeks with no release condition closed | Cut scope — M6 content volume first, then M5 depth. Never quality, and never the gates |
| The shared machine is the bottleneck | Medium | Lock waits show up in the stall check | Move heavy work to CI runners; run some agents locally |
| The economy simulation does not resemble real players | Medium | The M5 live test diverges from the simulation by more than half | Recalibrate against real data. The simulator is a thing we iterate on, not an oracle |
| **The human runs out of energy** | High | The nightly report goes unread three days running | The largest hidden risk in the whole plan. Everything here funnels through one person's attention. P0 is obliged to cut the number of decisions before adding any |
| 3D pixel art does not survive contact with reality | Medium | The M2 stranger test fails | Fall back to higher-resolution pixel art at 768×432, or hand-painted textures on low-poly geometry. Both are acceptable; shipping something that looks muddy is not |
