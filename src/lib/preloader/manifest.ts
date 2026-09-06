/**
 * What the preloader actually waits for.
 *
 * The rule for this list: an item belongs here only if the first viewport
 * looks wrong without it. Everything below the fold loads on its own schedule
 * and must never hold the curtain up — a preloader that waits for the whole
 * page is just a slow page with a logo on it.
 *
 * Weights are relative, not milliseconds. They set how much of the bar each
 * item is worth, so a 400KB hero does not tick over at the same rate as a
 * font that is probably already cached.
 */

/** Wait on `document.fonts.ready`. */
export interface FontsManifestItem {
  readonly kind: 'fonts';
  readonly id: string;
  readonly weight: number;
}

/** A single known URL, decoded before it counts as loaded. */
export interface ImageManifestItem {
  readonly kind: 'image';
  readonly id: string;
  readonly weight: number;
  readonly src: string;
}

/**
 * An art-directed image whose real URL only the browser can settle.
 *
 * `selector` points at the live `<img>` in the document. The loader reads
 * `currentSrc` off it, which is the exact candidate the browser picked for
 * this viewport, DPR and format support — including the `<picture>` media
 * branch. Re-deriving that from the `srcSet` string by hand would mean
 * reimplementing the browser's selection algorithm and getting AVIF/WebP
 * support detection wrong on top of it.
 *
 * `fallbackSrc` covers the case where the element is missing or has not
 * resolved a candidate yet.
 */
export interface ResponsiveImageManifestItem {
  readonly kind: 'responsive-image';
  readonly id: string;
  readonly weight: number;
  readonly selector: string;
  readonly fallbackSrc: string;
}

export type ManifestItem =
  | FontsManifestItem
  | ImageManifestItem
  | ResponsiveImageManifestItem;

export type PreloadManifest = readonly ManifestItem[];

/**
 * The home route's first-paint manifest.
 *
 * Only two entries, deliberately. The hero photograph is the LCP element and
 * the display face is what the wordmark is set in; nothing else changes what
 * the first screen looks like. The hero carries the larger weight because it
 * is the item that actually varies — fonts are usually a cache hit.
 */
export const HOME_MANIFEST: PreloadManifest = [
  {
    kind: 'fonts',
    id: 'fonts',
    weight: 2,
  },
  {
    kind: 'responsive-image',
    id: 'hero',
    weight: 5,
    // The real <img> inside HeroPicture's <picture>.
    selector: '[data-hero-image] img',
    // Only used if the element is absent — the widest wide-hero JPEG, which
    // every browser can decode.
    fallbackSrc: '/hero/hero-wide-1600.jpg',
  },
];
