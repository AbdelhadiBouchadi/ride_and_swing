import Image from "next/image";

import { PHOTOS, PHOTO_ALT } from "@/lib/photos";
import type { AspectRatio, PhotoBrief, PhotoTone } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Tonal grounds derived from the brand ramp, used when a brief has no
 * photograph yet. Each stands in for a real frame shot at that time of day, so
 * a plate never reads as "missing image".
 *
 * `dawn` and `dusk` deliberately run in opposite directions — light-top for
 * the morning, dark-top for the evening — because built from one ramp they
 * would otherwise be the same gradient twice.
 */
const TONE_GROUND: Record<PhotoTone, string> = {
  dawn: "linear-gradient(168deg, #ded9ce 0%, #93a6ae 34%, #1d5a72 72%, #142e3b 100%)",
  noon: "linear-gradient(172deg, #edeae3 0%, #ded9ce 42%, #93a6ae 72%, #75878f 100%)",
  dusk: "linear-gradient(166deg, #0b1c26 0%, #1d5a72 44%, #75878f 76%, #ded9ce 100%)",
  fairway:
    "linear-gradient(160deg, #79b98f 0%, #2e6b45 42%, #1f5533 72%, #142e3b 100%)",
  ocean:
    "linear-gradient(180deg, #75878f 0%, #1d5a72 40%, #142e3b 74%, #0b1c26 100%)",
};

/** Tones that depict open water get a horizon rule at the optical third. */
const HAS_HORIZON: ReadonlySet<PhotoTone> = new Set<PhotoTone>([
  "dawn",
  "dusk",
  "ocean",
]);

const RATIO_CLASS: Record<AspectRatio, string> = {
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
};

export interface PhotoPlateProps {
  readonly brief: PhotoBrief;
  /** `sizes` hint. Must match the slot's real rendered width. */
  readonly sizes?: string;
  readonly priority?: boolean;
  readonly className?: string;
  /** Show the shot brief. Only applies to the placeholder state. */
  readonly showBrief?: boolean;
  /** Apply the unified film grade. Off only for deliberately raw frames. */
  readonly graded?: boolean;
}

/**
 * An image slot that resolves to a real photograph when one exists for the
 * brief's id (see `@/lib/photos`), and to an art-directed placeholder when it
 * does not. Aspect ratio is reserved in both states, so photography can be
 * added or swapped with zero layout shift.
 */
export function PhotoPlate({
  brief,
  sizes = "100vw",
  priority = false,
  className,
  showBrief = true,
  graded = true,
}: PhotoPlateProps): React.JSX.Element {
  const ratioClass = RATIO_CLASS[brief.ratio];
  const photo = PHOTOS[brief.id];

  if (photo) {
    return (
      <figure
        className={cn(
          "relative overflow-hidden bg-horizon-deep",
          graded && "photo-film",
          ratioClass,
          className,
        )}
      >
        <Image
          src={photo}
          alt={PHOTO_ALT[brief.id] ?? brief.direction}
          fill
          sizes={sizes}
          priority={priority}
          // Static import → Next generates the blurDataURL at build time.
          placeholder="blur"
          className="object-cover"
        />
      </figure>
    );
  }

  return (
    <figure
      className={cn("grain relative overflow-hidden", ratioClass, className)}
      style={{ backgroundImage: TONE_GROUND[brief.tone] }}
      role="img"
      aria-label={`Photography to be shot: ${brief.direction}`}
    >
      {HAS_HORIZON.has(brief.tone) ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[38%] h-px bg-chalk/25"
        />
      ) : null}

      {showBrief ? (
        <figcaption className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 bg-linear-to-t from-abyss/80 to-transparent p-4 pt-12 sm:p-6 sm:pt-16">
          <span className="label-mono text-chalk/60">
            Frame to shoot · {brief.ratio}
          </span>
          <span className="max-w-prose text-[0.8125rem] leading-snug text-chalk/90">
            {brief.direction}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
