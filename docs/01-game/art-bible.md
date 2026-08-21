# Art Bible · 3D Pixel

> Status: DRAFT v0.1 · Owner: Visual Director (V1) · Freezing requires human approval
> **Clauses marked 🤖 are checked automatically by `tools/art-lint`. A non-compliant asset is rejected outright.**

---

## 0. The style in one line

**A PSX-era 3D skeleton wearing modern pixel art.** Low resolution, limited palette, hard edges, vertices that wobble — but the composition and the colour are contemporary.

## 1. Why this style

1. **It can be mass-produced procedurally and by AI.** A strict palette and a low triangle budget mean compliance is machine-checkable, so AI output can be filtered automatically. That is the precondition for an agent team producing art at all.
2. **It fits the theme.** Low resolution carries age, memory, and fading for free. That is exactly what heroes in twilight needs.
3. **It is cheap to render.** At a render resolution of 384×216, Three.js holds 60 fps in a browser with headroom to spare.
4. **It is recognisable.** 3D pixel is still not everywhere in 2026; one screenshot is enough to identify the game.

---

## 2. Render spec 🤖

| Parameter | Value | Non-negotiable |
|---|---|---|
| Render resolution | **384 × 216** | ✅ |
| Upscale | integer-multiple NearestFilter (1080p = 5×, 1440p = 6.67× needs letterbox, or 6× plus a border) | ✅ |
| Anti-aliasing | **off** (MSAA off, FXAA off) | ✅ |
| Mipmaps | **off** | ✅ |
| Texture filter | NearestFilter | ✅ |
| Palette | `assets/palettes/sunset-40.png` (40 colours) | ✅ |
| Dither | Bayer 4×4 ordered dither | |
| Vertex snapping | snap to the 384×216 grid | ✅ |
| Camera pixel snapping | **required**. Without it the image shakes while the camera moves | ✅ |
| UI layer | **not put through post-processing**, rendered separately at full resolution | ✅ |

> ⚠️ **Camera pixel snapping is the most common way a 3D pixel style falls over.**
> Camera position must be quantised to the pixel grid of the render resolution, or static objects will crawl as the camera moves.
> Acceptance procedure: record 10 seconds of the camera panning at constant speed and step through it frame by frame, checking that the edges of static objects hold still.

---

## 3. Palette · sunset-40 🤖

40 colours in five groups. **Every pixel of every texture must land exactly on a palette entry, tolerance 0.**

| Group | Colours | Use | Hue direction |
|---|---|---|---|
| Warm light | 8 | sunset, torches, metal highlights | orange-gold → dark red |
| Cool shadow | 8 | shadow, night, stone | blue-violet → deep indigo |
| Skin and cloth | 8 | characters | faded ochre, grey-green, old cotton white |
| Environment neutrals | 10 | ground, walls, wood | grey-brown ramp |
| Accents | 6 | **combat feedback only** | pure white (hit flash), warning red, parry gold, break purple, heal cyan, poison green |

### Accent discipline ⚠️
**Accent colours may be used for combat feedback and never for environment decoration.**
Reason: at this resolution the player's information channel is very narrow. If there is red in the environment, the player can no longer tell at a glance that a red warning means danger.

This is the first practical application of **readability outranks looks**.

---

## 4. Model spec 🤖

| Type | Triangle limit | Texture size |
|---|---|---|
| Player character | 1500 | 128×128 |
| Elite enemy | 1000 | 128×128 |
| Trash enemy | 600 | 64×64 |
| Boss | 3000 | 256×256 |
| Item / drop | 200 | 32×32 |
| Scene module (one room block) | 2000 | 256×256 (atlas) |

**Texel density**: **1 world unit = 16 texels**, tolerance ±5%. 🤖
This clause keeps the pixel grain identical across every object. Break it and the image shows large pixels in one place and small pixels in another, which reads as cheap.

**Texture rules** 🤖:
- dimensions must be powers of two and ≤256
- no alpha gradients (0 or 255 only, hard edges)
- no normal maps, no PBR maps. Albedo only, plus an optional emissive mask

---

## 5. Lighting

- **Key light**: one directional light standing in for a low sun (elevation 15–25°). This is the game's visual signature.
- **Ambient light**: cool (blue-violet), set against the warm key for contrast.
- **Dynamic lights**: at most 4 point lights per scene (torches, talisman arrays, ability effects).
- **Bake first**: bake static scene lighting into vertex colours wherever possible, to cut dynamic computation and flicker.

> ⚠️ At low resolution and under palette quantisation, **a smooth lighting gradient turns into ugly banding**.
> The counter: accept hard-edged shadows (cel-shaded, 2–3 steps) and use dithering for transitions instead of gradients.
> If an effect needs a smooth gradient to work, it does not belong in this style. Replace it.

---

## 6. Character design language

The theme is heroes in twilight. A character design has to make it **visible at a glance that this person was formidable once and is not any more**:

| Means | How |
|---|---|
| **Silhouette** | the silhouette is still upright (the foundation is intact), with one clear break or tilt in it |
| **Posture** | the idle pose carries a slight shift of weight, guarding one part of the body |
| **Equipment** | the equipment is good equipment, but old, patched, and mismatched |
| **Colour** | faded versions of bright colours (the fine robe of years ago is grey-rose now, not rose red) |
| **Animation** | slow wind-up, fast recovery (the Craft is intact, the explosiveness is gone) |

**What to avoid**: do not draw hunched old people. These are **former masters**, not **the elderly**. A boxing champion at 60 still stands straight; it is the knees that are gone.

---

## 7. Animation spec

| Item | Spec |
|---|---|
| Frame rate | logic at 30 Hz, animation sampled at 30 fps (aligned with logic, so frame data can be asserted) |
| Interpolation | **off**, or extremely short. Pixel style should snap, not slide |
| Attack animation | must align **frame for frame** with the wind-up / active / recovery frame counts in `feel-spec.md` 🤖 |
| Telegraph pose | an enemy attack telegraph must contain a pose **held still for 3 frames** (poser frame); this is the key to readability |
| Hit feedback | the character taking the hit must show displacement + hit flash + at least 2 frames of deformation |

---

## 8. UI spec

- UI is **not put through post-processing**; it renders on a full-resolution layer (text is unreadable at 384×216)
- Fonts: pixel font for numbers and headings; body text in a readable modern serif or sans
- Minimal HUD elements: health, Endurance, Chi, Vigor, teammate status. **No minimap** (finding the way through a Delve is the design)
- Damage numbers: three styles — critical / break / normal — coloured from the accent group
- All text goes through an i18n key 🤖

---

## 9. `tools/art-lint` checklist

This is V1's most important deliverable. Run `pnpm art-lint`, which checks:

```
[palette]      every texture pixel ∈ sunset-40, tolerance 0
[texel]        1 world unit = 16 texels, tolerance ±5%
[tris]         triangle count within the limit for the type
[texsize]      texture dimensions are powers of two and ≤256
[alpha]        no alpha gradients (0 or 255 only)
[mipmap]       asset metadata has mipmap = false
[naming]       filename matches <type>_<name>_<variant>.<ext>
[structure]    the asset sits in the correct directory
[accent]       accent colours do not appear in environment assets
[anim-frames]  attack animation frame counts match content/combat/frames/*.json
[juice]        every combat action carries the complete Juice Six
```

**Any single failure → the asset is rejected and does not enter the repository.**

> V1's iron law: **never wave a non-compliant asset through by hand.**
> "It is only slightly over" is where a style starts to come apart. If a rule frequently blocks work that is reasonable,
> change the rule (through an ADR) instead of making an exception.

---

## 10. Workflow for AI-generated assets

```
1. V1 writes the generation prompt templates and constraints (tools/asset-gen/prompts/)
2. Generate candidates in batches (8–16 at a time)
3. Automatic post-processing: palette quantisation → dimension normalisation → alpha gradient removal
4. Run art-lint, discard the non-compliant automatically
5. V1 picks from what passed (an aesthetic judgement only, never a compliance judgement)
6. Commit to the repository
```

**One of M2's release conditions**: AI-generated assets pass **at ≥50% on the first attempt**.
Below that number the generation constraints are too weak — the fix is `asset-gen`'s prompts and post-processing, not more human filtering.
This is where "recursively self-correcting" lands in the art pipeline.
