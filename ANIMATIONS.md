# Animation Reference

Every animation on the site, where it lives, and how to modify it.
CSS keyframes are in `style.css`; JS-driven ones in `script.js`.
Unless noted, everything respects `prefers-reduced-motion`.

---

## Entrance / load animations

### Preloader (`#preloader`, `#pre-fill`)
- **JS:** `script.js` — interval adds 8–30% fake progress every 130 ms;
  completes on `window.load` or a 2.6 s failsafe.
- **CSS:** `pre-pop` bounce on the FH logo block; blinking dots via
  `.pre-dots::after` content animation.
- **To change:** edit interval/failsafe numbers in `script.js`.

### Text scramble (`.scramble`)
- `script.js` — splits `data-text` into `<span class="sc-ch">`, then each
  frame settles one more char to its final value (28 frames total); unsettled
  chars show random glyphs from `scrambleChars`.
- **To change:** adjust `total` frames; keep `data-text` synced.

### Rotating word wheel (`#wheel`)
- `script.js` — every 2.6 s, fades out, swaps to the next word from the
  `words` array, fades in.
- **To change:** edit the array.

### Sine wave (`#wave-path`)
- `script.js` — builds the `d` path (amplitude 22, period 300 over 1200 wide).
- **CSS:** dashed stroke (`stroke-dasharray: 6 18`) marching via
  `@keyframes dash` (3 s linear, infinite).

### Title entrance (`@keyframes title-in`)
- `.hero-title` pops in with rotation; 0.8 s `--ease-pop`, 0.1 s delay.

---

## Scroll-driven animations

### Scroll reveals (`.reveal`)
- **JS:** IntersectionObserver (threshold 0.12, rootMargin -40 px bottom)
  adds `.in`; stagger via inline `--d` (0–0.32 s).
- **CSS:** opacity 0→1, translateY(34px)→0, 0.7 s.
- **Reduced motion:** instant, no transform.
- **To change:** observer options in `script.js`; transition in `style.css`.

### Count-up numbers (`[data-count]`)
- **JS:** IO threshold 0.6; 1.2 s cubic-out (`1 - (1-p)^3`).
- `#stat-age` counts to decimal age (years); others to integers.
- **Reduced motion:** still counts (fast) — acceptable.

### Scroll progress bar (`#progress`)
- **JS:** scroll listener sets width % = scrollTop / (scrollHeight - clientHeight).
- **CSS:** 4-colour horizontal gradient, 5 px tall, fixed top.

### Nav state (`.nav.scrolled`, active links)
- Scroll > 40 px → nav gets paper background + blur + bottom border.
- Active section link gets an underline (`.nav-link.active::after`).
- Back-to-top button appears after 600 px.

---

## Pointer-driven animations

### Custom cursor (`.cursor-dot`, `.cursor-ring`)
- Active only for `(hover: hover) and (pointer: fine)` and no reduced motion.
- Dot follows instantly; ring lerps at 0.16 per frame.
- Hovering `a, button, [data-cursor]` grows the ring and turns it violet.
- Body gets `cursor-on` class to hide the native cursor.

### Magnetic elements (`.magnetic`)
- On mousemove: `translate(dx*0.22, dy*0.32)` from element center.
- On leave: transform cleared.
- Applied to: logo, hero/contact buttons, to-top button.

### 3D tilt (`.tilt`)
- On mousemove: `perspective(900px) rotateX/rotateY` up to 7°.
- Applied to: portrait, field cards, project cards.

### Confetti easter egg (FH logo click)
- Spawns 26 `<span class="confetti-bit">` with math symbols
  (π ∑ Δ √ ∞ × ± ƒ λ ω) in palette colours, launched via CSS custom
  properties `--cx/--cy/--cr`; `@keyframes confetti-fly` animates 1.3 s,
  then nodes are removed.
- Also smooth-scrolls to top.

---

## Ambient / loop animations

### Marquees (`.marquee-track`)
- `@keyframes scroll-left` (22 s) and `scroll-right` (26 s, constants strip).
- Tracks are duplicated by JS for seamless `translateX(-50%)` loops.
- Pause on hover via `.marquee:hover .marquee-track`.

### Floating shapes (`.bg-shapes .shape`)
- `bob` (7–10 s), `floaty` (9–11 s), `spin` (16 s) keyframes; decorative,
  fixed to viewport, hidden ≤820px partially and ≤560px further.

### Sticker wiggle (`.sticker-birth:hover`)
- `wiggle` keyframe: ±6–8° oscillation at 0.5 s.

### Scroll hint (`.scroll-hint`)
- `nudge`: translateY 0→8 px, 1.6 s infinite. Hidden on phones.

### Stat "∞" pulse (`.stat-inf`)
- `pulse` scale 1→1.18, 2 s infinite, violet.

---

## Adding a new animation

1. Add the keyframes to `style.css` (near related rules).
2. Wire the trigger in `script.js` (IO, scroll, or pointer listener).
3. Guard with `matchMedia("(prefers-reduced-motion: reduce)")`.
4. Update this file.
