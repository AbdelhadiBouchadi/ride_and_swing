import { Bodoni_Moda, JetBrains_Mono, Jost } from "next/font/google";

/**
 * Display: Bodoni Moda. High-contrast didone — the thin/thick stress reads as
 * expensive at large sizes and holds up at 900 weight for the wordmark.
 * Optical size axis is why this over Playfair: it stays sharp at 12rem.
 *
 * Note for anyone touching the reveal animations: this face has a content area
 * meaningfully taller than the `0.92` display line-height, so its ascenders and
 * descenders overflow their line box. `.reveal-line-mask` in `globals.css`
 * widens the SplitText clip to compensate — see the comment there before
 * changing either value.
 */
export const fontDisplay = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--ff-display",
  display: "swap",
});

/**
 * Body: Jost. Geometric grotesque with a slightly humanist tail — pairs with
 * a didone without competing, and its light weights hold at large sizes.
 */
export const fontBody = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--ff-body",
  display: "swap",
});

/**
 * Data: JetBrains Mono. Used only for almanac readings, tide times, tee
 * times and prices — instrument data, set as instrument data. Tabular figures
 * prevent layout shift as values change.
 */
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});
