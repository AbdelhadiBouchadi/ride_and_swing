import { JetBrains_Mono, Manrope, Newsreader } from "next/font/google";

/**
 * Display: Newsreader. A transitional serif, deliberately not a didone.
 *
 * The mark this brand is built around is a heavy collegiate crest — a
 * surfboard and crossed irons inside a ring — and a hairline didone fights
 * it on sight. Newsreader has the editorial authority the register needs
 * with stems sturdy enough to survive at 9rem over a photograph, where
 * Bodoni's hairlines dissolved into the film grain.
 *
 * Loaded as a variable font so the whole 200–800 range costs one file. The
 * `opsz` axis is the reason this beat the alternatives: it keeps the wordmark
 * sharp at display size and the pull-quotes readable at 1.125rem, from a
 * single family.
 */
export const fontDisplay = Newsreader({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--ff-display",
  display: "swap",
});

/**
 * Body: Manrope. Semi-rounded geometric grotesque, variable 200–800.
 *
 * Body copy is set at 300 (see `globals.css`), so the deciding criterion was
 * which face holds a light weight at large sizes without going spindly —
 * Manrope does, and its two-storey `a` drops the 1930s Bauhaus note that made
 * the outgoing Jost read period rather than premium.
 *
 * No italic is published for this family. Nothing needs one: every italic on
 * the site is set in the display face, which has a true italic.
 */
export const fontBody = Manrope({
  subsets: ["latin"],
  weight: "variable",
  variable: "--ff-body",
  display: "swap",
});

/**
 * Data: JetBrains Mono. Used only for almanac readings, tide times, tee
 * times and prices — instrument data, set as instrument data. Tabular figures
 * prevent layout shift as values change.
 *
 * Deliberately unchanged by the rebrand. It is doing real work and no brand
 * argument was served by churning it.
 */
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});
