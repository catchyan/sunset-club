# Encounters

> Status: **STUB** · Owner: D1 Design Director · Drafting starts: **late M1**
> This file is a placeholder for now. The reason it exists at all: the ownership table lists
> it, so a file has to exist, otherwise `ownership.md` is assigning an owner to something that
> does not exist — and that is exactly where spec drift starts.

---

## Preconditions for drafting

- [ ] Lu Laosan's frame data in `feel-spec.md` is implemented and has passed the feel audit
- [ ] At least 3 trash-enemy archetypes are playable
- [ ] `contracts/content-schema.md` is FROZEN (the enemy data schema is settled)

## Questions this file will answer

1. **The attack-token mechanism**: at most 2 enemies on screen may be in active attack frames at once. How are tokens handed out, how are they returned, and can the player perceive it?
   > This is what keeps a gang-up in the Shining Soul line from collapsing into noise, and it is the precondition for 4 players on one screen holding together.
2. **Enemy families**: each family's behaviour pattern, its readability language (which warning colour means what), and what counters what.
3. **The room-template library**: when a Delve is generated procedurally, rooms are not stitched at random. They are drawn from templates that carry design intent. Every template has to answer "what does this room want the player to do".
4. **The pacing curve**: 8–12 rooms per floor. How tension and breathing room alternate.
5. **Elites and bosses**: how often they appear, how they are telegraphed, what failure costs.
6. **Scaling from 4 players to 1**: not health multiplied. It has to answer "once there are more players, where does the difficulty come from".

## Hard constraints (already settled by governing documents; not to be overturned while drafting)

- Enemy telegraph ≥10 frames, heavy attacks ≥18 (`feel-spec.md §5`)
- An attack that cannot be parried must have a red telegraph
- Enemies may not open a melee attack from off screen
- At most 2 attack tokens on screen
