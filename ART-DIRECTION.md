# Photography Brief

> **Status:** every slot the page renders is filled with the client's own
> photography — see [PHOTO-CREDITS.md](./PHOTO-CREDITS.md) for what was chosen
> from the twelve-frame intake, why, and where it falls short of the briefs
> below. The shortfall is resolution and register: the library is phone and
> social content, so no frame is the dawn editorial wide this document asks
> for, and **no frame shows both sports at once**.
>
> This document remains the specification: it is what to hand a photographer,
> and it is the standard the intake was judged against.

Each unfilled slot renders its own brief on the page, so nothing is a grey box
and nothing is guessed at later.

Slots are named for **what the frame contains** (`tee-shot`), never for the
package that uses it — package names change with every client this template is
pitched to, and they changed twice during this rebrand alone, so keying on
content means rewriting `property.config.ts` never orphans a photograph.

**Swapping in real photography is a one-line change per slot.** The brief lives
in `src/lib/property.config.ts`; `PhotoPlate` renders the placeholder when no
file is bound to the slot id in `src/lib/photos.ts`, and `next/image` when one
is. Aspect ratio is reserved either way, so swapping causes **zero layout
shift**.

---

## The frames to shoot

| Slot | Ratio | Time of day | The frame |
|---|---|---|---|
| `hero` | 21/9 | Dawn | The point peeling right, offshore spray lit from behind, two surfers small in a very large ocean. Horizon low, room at the top for the wordmark. |
| `hero-portrait` | 3/4 | Dawn | The same morning composed vertically for phones. Sky in the top third, the lineup across the middle, sand at the base. |
| `seaward-green` | 16/9 | Last light | **The priority commission.** A green on the seaward side of the course, pin in, the Atlantic open behind it and low sun raking across the cut grass. This is the one frame that proves the brand's claim — a coast that does both — and nothing in the current library shows it. |
| `place` | 3/2 | Last light | The bay from above. The course on the cliff, the beach below it, the village at the edge, Atlantic filling the top third. Documentary, not aspirational. |
| `tee-shot` | 4/5 | Golden hour | The top of a follow-through against open sky. Shot from behind and low, so the swing sits against nothing but light. |
| `putting-green` | 4/5 | Early morning | A putt on a cut green, flag still, long shadows. The green as maintained ground against everything arid around it. |
| `board-line` | 4/5 | Early morning | Boards laid out on wet sand before the session, running away from the camera. The coach pointing at the water rather than at the lens. |
| `shorebreak-walk` | 4/5 | Mid-morning | Coach and students wading out, boards under arms, seen from behind. The headland compresses the background. |
| `clubhouse` | 16/9 | Midday | The room people end up in between the two halves of the day, shot from the doorway so the architecture frames the light. Bag rack and board rack in the same shot if that is honest. |

---

## Direction that applies to every frame

**Light.** Shoot at the edges of the day. The palette depends on warm ground
against cold Atlantic, and midday sun flattens both into nothing. This matters
more here than for a single-sport brand: the two halves of the library have to
look like the same week.

**People.** Present but incidental, small in frame, never looking at the lens
and never posed mid-laugh. Guests should read as people who happen to be there,
not models demonstrating leisure.

**Against.** No drone-orbit clichés, no infinity-pool-with-cocktail, no
flat-lay breakfast, no cut-out sky, no golfer-silhouette-at-sunset. If the shot
would work for any coastal resort anywhere, it is the wrong shot.

**Grade.** Keep the warm/cool split intact — do not neutralise it toward a
uniform teal-orange. Skin tones warm, water genuinely cold, grass green rather
than lime. Grain is welcome; plastic skin smoothing is not.

**Delivery.** AVIF or WebP, 2400px on the long edge, sRGB. Drop into
`src/assets/photos/` and bind to a slot id in `src/lib/photos.ts`. The 2400px
floor matters: the current intake tops out at 1600px, which is why the hero
`srcSet` stops there instead of serving the wide displays it should.
