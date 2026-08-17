# Design System — "Memphis × Mathematics"

This document describes the visual language of the portfolio so any developer
(or future AI session) can extend it without breaking the aesthetic.

---

## 1. Philosophy

The site is a collision of two ideas:

1. **Memphis Design** (Ettore Sottsass, Milan, 1981): anti-minimalist,
   playful, paper backgrounds, bold geometry, squiggles, clashing colour
   blocks, hard shadows, and the confidence to look a little "wrong".
2. **Mathematics**: the content and motifs of the owner's life — a philomath
   studying Math/Physics/Chemistry. Equations, constants, coordinates, and a
   live age counter are design elements, not just content.

The result: a portfolio that looks like a page torn out of a 1980s poster
book, doodled on by a math student.

**Design commandments:**

- Depth is drawn with **hard offset shadows**, never soft blur shadows.
- Rotations are used for life: **±1° to ±8°**, never more.
- Accent colours appear as **solid blocks**, not tints or gradients-fades.
  (The only gradients are the four-colour "party" fills: logo block,
  portrait block, preloader bar, progress bar.)
- Paper background + ink text is the base; accents are toppings.
- Nothing is perfectly aligned — slight rotation is a feature.

---

## 2. Palette

Defined as CSS custom properties in `style.css` `:root`.

| Token | Hex | Usage |
|-------|-----|-------|
| `--paper` | `#FBF6EC` | Page background, card fill |
| `--ink` | `#16130F` | Text, borders, shadows |
| `--cyan` | `#00B8F0` | Accent: chips, buttons, wave |
| `--violet` | `#7C4DFF` | Accent: HAI block, contact section, chips |
| `--magenta` | `#FF2E9A` | Accent: CTAs, hover underlines, confetti |
| `--lime` | `#B8F000` | Accent: highlights, chips, to-top button |
| `--white` | `#FFFFFF` | Card backgrounds, text-on-accent |

**On-colour text:** white text on magenta/violet; ink text on cyan/lime/white.

**Do not** introduce new hues without updating this table. If you need a
muted variant, use the paper/ink greys, not new colours.

---

## 3. Typography

Google Fonts (with system fallbacks):

| Font | Role | Sizes |
|------|------|-------|
| **Archivo Black** | Display — headlines, buttons, marquee | hero: `clamp(2.8rem, 13vw, 9rem)`; sections: `clamp(1.7rem, 5vw, 2.9rem)` |
| **Space Grotesk** | Body copy | ~`1.06rem`, `line-height 1.6` |
| **Space Mono** | Labels, chips, meta, footer, constants | `.62–.95rem`, letter-spaced |

Headlines are `text-transform: uppercase`. The hero name is two stacked
blocks (FAIZUL / HAI), HAI on a violet block with a hard shadow.

**Monospace** signals "system"/"machine"/"label" — use it for coordinates,
tags, stat labels, meta lines.

---

## 4. Texture & shapes

- **Dotted paper** — `.bg-dots`: fixed radial-gradient dots over the page.
- **Squiggle SVG** — hand-drawn-looking wave path, used under headlines and
  next to the portrait (cyan/violet/magenta variants).
- **Floating shapes** — `.bg-shapes`: a squiggle, circle, triangle, half-disk,
  dot-grid square, and zigzag, bobbing/spinning slowly, fixed to viewport.
  Hidden on very small screens.
- **Stickers & tape** — `.sticker` (birth "est. 2007"), `.tape` on the
  portrait, `.chip` fact cards: bordered, hard-shadowed, slightly rotated,
  hover-rotating.

---

## 5. Components

### Buttons (`.btn`)
- Font: Archivo Black, uppercase, `padding .8rem 1.5rem`.
- 2 px ink border + `6px 6px 0` ink shadow.
- Hover: translate `(-3px, -3px)`, shadow grows to `9px`.
- Active: pressed down (shadow shrinks).
- Colour variants: `btn-magenta`, `btn-cyan`, `btn-white`, `btn-violet`.
- Also carry `.magnetic` for cursor-attraction.

### Cards (`.field-card`, `.project-card`)
- White fill, ink border, hard shadow, `padding ~1.3rem`.
- Hover: shadow grows; icon tilts; card tilts in 3D (`.tilt`, max 7°).
- Project cards carry a `c-*` colour class that themes the icon border/colour
  and link hover background.

### Chips (`.chip`)
- Mono label, border, `3px 3px 0` shadow, hover lifts & rotates ~-1.5°.

### Marquee ribbons (`.marquee`)
- Full-width strips: cyan (subjects), ink (constants, rainbow text), lime
  (contact CTA). Content duplicated in the track for seamless loops; pauses
  on hover.

### The portrait block
- Square (`aspect-ratio: 1/1`) with the four-colour diagonal fill, ink border,
  `10px 10px 0` shadow, rotated -3° (straightens on hover).
- Tape sticker at top; caption bar at bottom; squiggle overlapping the corner.
- When a photo is present, `.portrait-img` covers the square with
  `object-fit: cover`.

---

## 6. Layout & spacing

- Max content width: `1100px` for sections, `900px` for contact.
- Section padding: `clamp(4rem, 9vw, 7rem)` vertical, `clamp(1.2rem, 4vw, 2rem)` horizontal.
- Grids: fields/projects use `auto-fit, minmax(...)` so columns collapse
  gracefully; about is `340px 1fr` collapsing to one column at ≤820px.
- Breakpoints: **820px** (about stacks, nav shrinks, shapes thinned),
  **560px** (hero shrinks, grids go single column, buttons tighten),
  **420px** (nav condensed, footer stacks, stats shrink).

---

## 7. Motion principles

- Default easing: `--ease-pop: cubic-bezier(0.2, 1.4, 0.4, 1)` — a springy
  "pop" used everywhere for transforms.
- Reveal: elements translate up 34 px and fade over `.7s`, staggered with
  the `--d` custom property (0–0.32 s).
- Duration psychology: micro-interactions (hover) 0.2 s; entrances 0.7–0.8 s;
  ambient loops (marquees, bobbing shapes) 7–26 s.
- **Reduced motion:** every animation collapses to ≤0.01 ms; reveals become
  instant; cursor and confetti are disabled. New animations must be wrapped
  or keyed off `prefers-reduced-motion`.

---

## 8. Extending the system

**New component checklist:**
1. Use the palette tokens (no new hex literals).
2. Paper/ink base + one accent block, hard shadow, ≤8° rotation.
3. Match border width (`--border: 2px solid var(--ink)`).
4. Respect reduced motion.
5. Document it in this file + `docs/ANIMATIONS.md` if it animates.
