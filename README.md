# Taghazout Bay — sport & hospitality site template

A production marketing site for small operators on the Agadir coast — surf
camps, golf, guest houses and lodges from Anza north to Imsouane.

It is currently skinned for a real client — **Ride and Swing**, surf and golf
at Taghazout — and is built to be re-skinned per prospect: everything that
identifies a business lives in one config object. See
[Re-skinning for a client](#re-skinning-for-a-client).

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · GSAP ·
Lenis

---

## Running it

```bash
npm run dev      # http://localhost:3000
npm run build
npm start
npx tsc --noEmit # type check
npx eslint .     # lint
```

---

## Re-skinning for a client

**One file: `src/lib/property.config.ts`.** No component holds a
property-specific string, so a new prospect is a config edit and nothing else.

| Field | What it drives |
|---|---|
| `identity` | Name, wordmark, contact, URL, metadata, JSON-LD, social card |
| `coast` | Latitude/longitude and shore aspect — **the live almanac retargets itself** |
| `seo` | Keywords and the `amenityFeature` list in structured data |
| `packageGroups`, `spots`, `day` | What the business sells, where it takes you, and how a day runs |
| `manifesto`, `packagesCopy`, `pointsCopy`, `dayCopy`, `table`, `enquire` | Every line of section copy |
| `almanacFallback` | Static readings shown if a forecast source is unreachable |

`src/lib/content.ts` re-exports the config under the names sections import
(`SITE`, `PACKAGE_GROUPS`, `SPOTS`…), so components never reach into the
config's shape. The types in `src/lib/types.ts` make an incomplete swap **fail the
build** rather than ship a half-renamed business.

Photography binds by slot id in `src/lib/photos.ts`. Slots are named for what
the frame contains (`lesson-lineup`), never for the package using it — so
rewriting every package name orphans no images. An unbound slot renders its
art-direction brief, so an unshot business is still presentable to its owner.

---

## Architecture

### Server / client split

The page is **fully static**. Every section is a Server Component; the only
client JavaScript is the isolated motion layer.

| Client component | Why it must be |
|---|---|
| `SmoothScroll` | Owns the Lenis instance and the GSAP ticker |
| `HeroChoreography` | Page-load timeline |
| `RevealText`, `Reveal`, `Parallax` | ScrollTrigger + refs |
| `HorizontalTrack` | Pinned scroll mechanic |
| `SiteHeader` | Menu state + anchor scrolling |

No client boundary sits above a page section, so all copy is server-rendered
for SEO. Verified: the HTML response contains every heading, room description
and break note before hydration.

### Motion

Lenis and GSAP share **one** rAF loop — GSAP's ticker drives `lenis.raf`, and
every Lenis scroll event calls `ScrollTrigger.update()`. Two competing rAF
loops is the usual cause of jittery smooth-scroll integrations.

`gsap.ticker.lagSmoothing(0)` is required: without it GSAP skips time after a
slow frame and desynchronises from Lenis' own interpolation.

### Reduced motion

Gated at three levels:

1. `gsap.matchMedia()` — timelines are never constructed
2. Lenis is never instantiated; native scrolling is kept
3. A CSS media-query safety net

The pinned horizontal section falls back to native snap-scrolling, which also
applies on touch devices at any motion setting — hijacking vertical scroll on
a phone fights the OS gesture model.

Verified under emulated `prefers-reduced-motion: reduce`: 0/44 animated
elements hidden, Lenis inactive, pin disabled.

### Progressive enhancement

Animated elements are hidden pre-animation by CSS scoped to `html.js`, a class
set by a blocking inline script in `<head>`. It lands before first paint (so no
flash), and if JavaScript fails the class never appears and **all content
renders visible**.

---

## Design system

**Two sports, one coast.** The dark ground is the Atlantic at depth; the
accent is the fairway. Each half of the brand owns one structural role, which
is why there is no third brand colour.

| Token | Hex | Use |
|---|---|---|
| `--horizon` | `#EDEAE3` | Page ground — the silver overcast sky off Taghazout |
| `--horizon-deep` | `#DED9CE` | The same sky with weather in it |
| `--chalk` | `#F8F6F1` | Raised surfaces |
| `--abyss` | `#0B1C26` | Ink and dark sections — the Atlantic at depth |
| `--tide` | `#1D5A72` | Mid-tone sections and graphic rules |
| `--fairway` | `#2E6B45` | Cut grass — graphic fills, never type |
| `--fairway-ink` | `#1F5533` | Accent **text** — 7.27:1 on horizon |
| `--haze-ink` | `#4B5C64` | Secondary text — 5.80:1 on horizon |

Contrast ratios are computed, not eyeballed. Note the pairs: `--fairway` is
5.29:1 on horizon and is reserved for graphics and large marks; `--fairway-ink`
is what carries accent type. The same split applies on dark grounds
(`--fairway-light`, 7.57:1 on abyss).

Type: **Newsreader** (display) / **Manrope** (body) / **JetBrains Mono** —
the mono is reserved for instrument data: tide times, swell readings, spot
specs, prices. All numeric runs use tabular figures so values cannot reflow.
Newsreader is a transitional serif rather than a didone on purpose: the brand
mark is a heavy collegiate crest, and hairline display faces fight it.

### shadcn/ui and 21st.dev

`src/app/globals.css` maps the brand ramp onto the full shadcn semantic token
set (`--background`, `--primary`, `--muted-foreground`, `--ring`, `--radius`…),
and `cn()` lives at `@/lib/utils`. Registry components drop in and inherit the
brand with no restyling. `motion` (Framer Motion v13) and `class-variance-authority`
are installed for the same reason.

---

## Photography

Eight photographs are integrated, sourced from Pexels — see
[PHOTO-CREDITS.md](./PHOTO-CREDITS.md) for credits, selection method and honest
limitations (the four "rooms" are material studies, not rooms). The original
briefs live in [ART-DIRECTION.md](./ART-DIRECTION.md).

- **Sources**: `src/assets/photos/*.jpg`, **static-imported** via
  `src/lib/photos.ts` so Next generates real dimensions and a `blurDataURL`
- **Hero**: art-directed across breakpoints via a genuine `<picture>` —
  a 21/9 frame ≥1024px, a separately composed 3/4 frame below. `next/image`
  scales one source and cannot express that. AVIF at 2800px is 111KB
- **Unified grade**: `.photo-film` in `globals.css` desaturates, lifts
  contrast, lays a warm-highlight / cool-shadow gradient in `soft-light` and
  finishes with grain. This is what makes eight photographers read as one
  shoot — re-grade the whole site from that one block
- **Reveal**: `ImageReveal` wipes each frame in with `clip-path`, matching the
  mask gesture the typography already uses

A brief with no entry in `PHOTOS` falls back to its art-direction placeholder,
so adding or removing photography needs no component changes.

---

## The live almanac

The hero band is real data, not decoration. Position comes from `coast` in the
property config, so pointing the site at a different house moves the forecast
with it — no coordinate is hard-coded in `almanac.ts`.

`getLiveAlmanacData()` in `src/lib/almanac.ts` reads **Open-Meteo** (free, no
key, no rate limit an hourly revalidation could reach): the marine API for
swell, direction and sea-surface temperature; the forecast API for wind and
sunrise; and the marine hourly `sea_level_height_msl` series for tides.

**Swell uses the partition, not the combined sea.** `wave_*` sums ground swell
and local wind chop; `swell_wave_*` is the part that actually breaks as a
rideable wave. On a blown-out afternoon the two diverge and only the swell
figure is worth printing. The combined value is the fallback, because the
partition is occasionally null where the total never is.

**Both tides are derived**, not given — Open-Meteo has no tide-extremes
endpoint. The code finds turning points in the hourly sea-level series and fits
a parabola through each and its neighbours, recovering sub-hour precision from
hourly data (a raw minimum at `19:00` resolves to `18:43`). Low *and* high are
shown, because "low water 06:44" alone does not say whether the tide is
currently filling or draining — and on these reefs that is the difference
between a session and a walk back over urchins.

> The freshness test is applied to the **interpolated vertex, not the sample
> that revealed it**. A crest sampled at `12:00` whose vertex lands at `12:21`
> is still ahead of you at `12:15`. Testing the sample instead discards it and
> reports the *following* extreme — half a tide cycle wrong, and wrong in the
> most confident-looking way, because the printed time is a real high water,
> just not the next one. This was a live bug, caught by checking the rendered
> band against the raw series.

**Wind** is classified relative to the shore's aspect (land at the reciprocal):
≤60° from land is `Offshore`, ≥120° is `Onshore`, between is `Cross-shore` —
a real condition, not rounded away. Speed converts km/h → knots.

Two deliberate deviations from a naive reading of the spec:

- **Sea uses `sea_surface_temperature`, not `temperature_2m`.** The latter is
  air temperature and reads ~36°C under a label saying "Sea".
- **The reading is labelled `Sunrise`, not `First light`.** Open-Meteo exposes
  sunrise but not civil twilight, and first light is genuinely ~25–30 min
  earlier. Printing sunrise under a `First light` label would be a quietly
  wrong number, so the fallback set carries the `Sunrise` label too.

### Caching and resilience

`{ next: { revalidate: 3600 } }` makes the route **ISR** — `next build` reports
`Revalidate 1h` while the page stays `○ Static`. Readings are in the first HTML
byte, so no visitor waits on Open-Meteo and there is no layout shift.

This also avoids a real hazard: `globals.css` hides `[data-hero-reading]` until
GSAP reveals it, and `HeroChoreography` collects those nodes **once on mount**.
Readings streamed in later would never be revealed. Server-rendering sidesteps
it, and a `gsap.delayedCall` sweep in `HeroChoreography` guarantees no reading
can ever be left permanently invisible.

Each of the three requests is guarded independently with a 4s timeout, so a
marine outage falls back to static swell figures without blanking the wind.
Total failure returns the static `ALMANAC` unchanged. **Verified** by building
against unreachable hosts: all eight readings rendered their static values.

Fallbacks are resolved **by label**, so a label added to the live builder must
also exist in `almanacFallback` — a mismatch silently prints an em dash.

`AlmanacSkeleton` exists but never renders under ISR. It is metric-matched to
the band so that switching to an uncached, streamed almanac
(`cache: 'no-store'` behind Suspense) is a one-line change with a designed
loading state already in place.

---

## Known deviations from the original spec

- **`lenis` instead of `@studio-freight/lenis`.** The Studio Freight package is
  deprecated and frozen at 1.0.42; the library moved to the bare `lenis`
  package (1.3.26). Identical API.
- **Contact details are placeholders and must be replaced before launch.**
  Package names and prices are the client's own rate card, reproduced exactly
  — including the two currencies, which is how they quote it. But the street
  address, email, phone and canonical URL were never supplied and are marked
  `TO CONFIRM` in `property.config.ts`. **The phone number is deliberately
  `+212 000 000 000` so it cannot be mistaken for real.** So is the drive time
  to the golf course, and the green-fee inclusions line in the packages
  footnote. Confirm all of them with the client before any launch.
- **There is no reviews section.** The business has no reviews yet, so the
  section and the JSON-LD `aggregateRating` were removed rather than filled.
  An empty or invented rating is penalised harder than none at all.
- **The almanac is the exception — it is genuinely live.** Swell, wind, tides,
  sunrise and sea temperature are real Open-Meteo readings for the configured
  coordinates, refreshed hourly. The static `almanacFallback` values are the
  only fictional numbers, and they render only when the API is unreachable.
- **Tides are model-derived, not harmonic.** Open-Meteo's sea-level field is
  accurate to a few minutes, which is the right precision for "go now or eat
  first". A property advertising tide times as operational guidance should pay
  for a harmonic source (Stormglass `/tide/extremes/point`) — the provider is
  isolated in `almanac.ts` and swapping it touches nothing else. Surfline is
  **not** an option: it has no public API, and the endpoints in circulation are
  undocumented and against its terms.
