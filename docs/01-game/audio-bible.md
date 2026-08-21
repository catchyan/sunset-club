# Audio Bible

> Status: **STUB** · Owner: U1 Audio Lead · Drafting starts: **M2**
> Placeholder file. Rationale at the top of `gdd-encounters.md`.

---

## Preconditions for drafting

- [ ] `art-bible.md` finalised (the audio has to sit in the same era as the image)
- [ ] the Juice Six in `feel-spec.md` implemented, so we know which events the sounds hang off

## Questions this file will answer

1. **Layering rules for hit sounds**: every hit uses at least two layers (material layer + force layer). Minimum variant count (≥3, see `contracts/content-schema.md §4`).
2. **Mapping between sound and `combat-events.md`**: which event fires which sound family.
3. **Dynamic mixing**: what happens to the audio during hitstop? (The point: if the audio stops when the frame stops, the hit reads as cheap.)
4. **Music**: a layered music system driven by combat intensity. Which mode does the Club hub use?
5. **Era**: the image is PSX-era 3D under a modern pixel skin. What is the audio equivalent?
6. **Accessibility**: every critical piece of audio information (parryable telegraph, attack from behind) must have a visual equivalent.

## Hard constraints already fixed

- A successful parry is this game's high point (an 8-frame global freeze). Its sound is the single most important sound in the project and is worth its own block of time.
- Every sound effect needs ≥3 variants in rotation. One sample played repeatedly makes combat cheap fast.
- Sound asset ids must be referenced from `packages/content/`; orphaned assets are reported by lint.

## One item tied to the theme

**Breathing.** These characters are old. Panting after a run of actions, and breathing whose rhythm shifts after a long fight, is the cheapest and most effective way to voice heroes in twilight.
It belongs to the narrative, not to decoration — treat it as a theme mechanic when drafting, rather than filing it under "ambience".
