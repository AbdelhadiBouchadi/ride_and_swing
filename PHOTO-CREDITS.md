# Photography credits

**Every photograph on this site is the client's own.** The previous tenant's
photography — Alaïa Surf School's library, depicting identifiable people at a
different business — has been **deleted from the repository**, not merely
unbound. Nothing on the page depicts a business other than Ride and Swing.

Sources are the twelve originals supplied at `assets-raw/`. Processed files
live at `src/assets/photos/*.webp` (cropped to the layout's reserved ratios,
WebP q80) and `public/hero/*` (pre-encoded AVIF/WebP/JPEG for the art-directed
hero). Machine-readable manifest: `src/assets/photos/CREDITS.json`.

| Slot | Ratio | Frame | Intake original |
|---|---|---|---|
| `hero` (wide) | 21/9 | Class lined up on the sand, huge overcast sky | `…11.13.05 PM` |
| `hero-portrait` | 3/4 | Tee shot with the Atlantic behind | `…11.12.25 PM` |
| `place` | 3/2 | The bay end to end, class working on the sand | `…11.13.17 PM` |
| `the-green` | 16/9 | Putting out, arid hillside behind | `…11.12.24 PM` |
| `putting-green` | 4/5 | A putt against a pale sky, pin beside | `…11.12.37 PMM` |
| `board-line` | 4/5 | Soft-tops in a receding line, students on them | `…11.13.16 PM` |
| `tee-shot` | 4/5 | Follow-through against open sky, cactus | `…11.12.37 PM` |

`src/assets/photos/hero.webp` and `hero-portrait.webp` are the processed
masters at full crop size. Nothing imports them — the hero is served from
`public/hero/` through a real `<picture>` — but they are the reference the
`public/hero/` ladder is derived from.

## The mark

`assets-raw/logo.jpeg` is a **phone screenshot**, not a supplied asset: the
badge sits at x82–656, y525–1076 (575 × 552) with an iOS home-indicator pill
further down at y1575–1584, which is discarded. The ground is `#0a0a0a`, not
pure black, so removing "black" leaves a grey halo — the key is a thresholded
luminance-to-alpha curve (`<18 → 0`, `>200 → 255`, linear between) that also
takes out the JPEG mosquito noise and preserves the intentional speckled
texture inside the ring.

`src/app/favicon.ico`, `icon.png` and `apple-icon.png` are rendered from the
**hand-authored `src/app/icon.svg`**, not downscaled from the JPEG. The full
crest — ring, arced lettering, board, two irons, speckle — is illegible below
about 64px, and a vector trace would read the speckle as noise. The SVG keeps
only what survives at 16px.

## How these were chosen

The intake is twelve frames: five golf, six surf, one screenshot of the rate
card. The hero was chosen on one criterion above the others: **the top half
had to survive type.** The winning frame is unbroken overcast sky across its
entire upper half, so the wordmark, the nav and the almanac band read against
it without the scrim having to be heavy enough to grey out the photograph.

Crops are centre-gravity cover crops, capped at the widest the source can fill
without upscaling. Every crop was rendered back out and reviewed before the
slots were bound.

## Honest limitations

**Resolution.** These are phone and social originals, topping out at 1600px on
the axis the crop needs. The wide hero is therefore 1600 × 686 and the `srcSet`
stops there rather than advertising widths that would only be upscales. On a
2560px display the browser will stretch it. It holds under the scrim and the
film grain; it would not hold as a clean full-bleed frame.

**No frame contains both sports.** This is the significant gap. The business
sells one coast that does two things, and the Two Worlds section exists to
argue exactly that — but no photograph in the intake shows a green with the
Atlantic behind it at a usable size. The two frames that do show golf and ocean
together (`…11.12.25 PM`, `…11.12.36 PM`) are 854px-wide portraits, which
cannot fill a 16/9 slot without upscaling. `the-green` is bound instead: the
right course, the wrong background.

> **A single commissioned wide frame of a seaward green at low sun, with the
> Atlantic open behind it, is the highest-value photographic upgrade available
> to this site.** It is the one picture that would prove the brand's central
> claim, and it does not currently exist.

**The two halves are lit differently.** Golf frames are warm, low, hard-sun;
surf frames are flat grey overcast. Untreated they read as two businesses. The
`.photo-film` grade in `globals.css` closes the gap — blue shadows under warm
highlights, applied site-wide from one place — and it is doing considerably
more work here than it did for the previous tenant.

**No clubhouse, interior, equipment still-life or food frame exists**, and
nothing shows anyone actually riding a wave. Two surf frames
(`…11.13.15 PM`, `…11.13.18 PM`) went unused as near-duplicates of stronger
selections.
