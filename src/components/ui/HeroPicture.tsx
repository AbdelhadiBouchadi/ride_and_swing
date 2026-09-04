import { cn } from '@/lib/utils';

export interface HeroPictureProps {
  readonly className?: string;
  readonly alt?: string;
}

const ALT =
  'A surf class lined up along the sand beside their boards, the Atlantic behind them under a wide overcast sky.';

/**
 * The hero frame, art-directed across breakpoints.
 *
 * A 21/9 landscape composition is right on a desktop and destroys itself on a
 * phone — `object-cover` would crop the wide frame to roughly its centre fifth.
 * So phones get a separately composed 3/4 frame (a tee shot with the Atlantic
 * behind it) rather than a squeezed version of the wide one.
 *
 * The two frames are deliberately different halves of the brand: the wide one
 * is the water, the portrait one is the course. Both are true, and each is the
 * strongest frame the client's library holds at that shape.
 *
 * `next/image` scales a single source and cannot express that, so this is a
 * real <picture>: the browser evaluates `media` before fetching and downloads
 * exactly one file. AVIF first, WebP next, JPEG as the floor.
 *
 * The advertised widths stop at the largest crop the client's originals can
 * actually fill — 1600px wide, 854px portrait. Listing 2800w here would only
 * buy an upscale, and a browser asked to choose between real pixels and
 * invented ones should never be shown the invented ones.
 */
export function HeroPicture({
  className,
  alt = ALT,
}: HeroPictureProps): React.JSX.Element {
  return (
    // `display: contents` — a <picture> is inline by default, which gives the
    // <img> no percentage height to resolve `h-full` against.
    <picture className="contents">
      {/* Desktop: wide frame */}
      <source
        media="(min-width: 1024px)"
        type="image/avif"
        sizes="100vw"
        srcSet="/hero/hero-wide-1024.avif 1024w, /hero/hero-wide-1280.avif 1280w, /hero/hero-wide-1600.avif 1600w"
      />
      <source
        media="(min-width: 1024px)"
        type="image/webp"
        sizes="100vw"
        srcSet="/hero/hero-wide-1024.webp 1024w, /hero/hero-wide-1280.webp 1280w, /hero/hero-wide-1600.webp 1600w"
      />

      {/* Phone and tablet: portrait frame */}
      <source
        type="image/avif"
        sizes="100vw"
        srcSet="/hero/hero-portrait-640.avif 640w, /hero/hero-portrait-854.avif 854w"
      />
      <source
        type="image/webp"
        sizes="100vw"
        srcSet="/hero/hero-portrait-640.webp 640w, /hero/hero-portrait-854.webp 854w"
      />

      <img
        src="/hero/hero-wide-1600.jpg"
        alt={alt}
        width={1600}
        height={686}
        // This is the LCP element on every visit.
        fetchPriority="high"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    </picture>
  );
}
