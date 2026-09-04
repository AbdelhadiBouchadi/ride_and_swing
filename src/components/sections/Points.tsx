import { HorizontalTrack } from "@/components/animations/HorizontalTrack";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { POINTS_COPY, SPOTS } from "@/lib/content";
import type { Spot, SpotLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Level is encoded by a rule weight as well as colour — never colour alone. */
const LEVEL_RULE: Record<SpotLevel, string> = {
  "All Levels": "h-px bg-haze-dim",
  Beginner: "h-px bg-haze-dim",
  Intermediate: "h-0.5 bg-fairway-light",
  Advanced: "h-1 bg-tide",
};

interface SpotCardProps {
  readonly spot: Spot;
}

function SpotCard({ spot }: SpotCardProps): React.JSX.Element {
  // Narrowed once, here, so the JSX below stays flat. The two disciplines
  // publish genuinely different facts — a wave has a hand and a swell window,
  // a course has a hole count and a character — and flattening them into one
  // shared shape would have meant printing "—" in half the cards.
  const lead = spot.discipline === "surf" ? spot.hand : `${spot.holes} holes`;
  const factLabel = spot.discipline === "surf" ? "Works on" : "Plays";
  const factValue = spot.discipline === "surf" ? spot.worksOn : spot.plays;

  return (
    <article
      className={cn(
        "group/card flex w-[80vw] shrink-0 snap-start flex-col justify-between",
        "border border-horizon/15 bg-abyss-soft p-8 sm:w-[62vw] sm:p-10",
        "lg:w-[38vw] xl:w-[30vw]",
        // Transform and colour only — never width/height — so the row never
        // reflows mid-scroll while the track is pinned.
        "transition-[transform,border-color,background-color] duration-500 ease-out",
        "motion-safe:hover:-translate-y-1.5 hover:border-horizon/35 hover:bg-abyss-soft/80",
      )}
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="label-mono text-fairway-light">{lead}</span>
          <span className="label-mono text-haze-dim" data-numeric>
            {spot.minutesAway} min
          </span>
        </div>

        <h3 className="mt-8 text-balance font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] text-horizon">
          {spot.name}
        </h3>

        {/* Weight carries the difficulty; the label states it in words. */}
        <div
          aria-hidden="true"
          className={cn(
            "mt-6 w-full origin-left transition-transform duration-700 ease-out",
            "motion-safe:scale-x-[0.42] motion-safe:group-hover/card:scale-x-100",
            LEVEL_RULE[spot.level],
          )}
        />
        <p className="label-mono mt-3 text-haze-dim">{spot.level}</p>

        <p className="mt-8 text-pretty text-sm leading-relaxed text-horizon/80">
          {spot.note}
        </p>
      </div>

      <dl className="mt-10 border-t border-horizon/15 pt-5">
        <dt className="label-mono text-haze-dim">{factLabel}</dt>
        <dd className="mt-2 font-mono text-sm text-horizon" data-numeric>
          {factValue}
        </dd>
      </dl>
    </article>
  );
}

/**
 * Server Component. The pinned horizontal mechanic is isolated in
 * `HorizontalTrack`, which is the only client code in this section.
 */
export function Points(): React.JSX.Element {
  return (
    <section id="points" data-ground="dark" className="grain relative bg-abyss">
      <div className="gutter pt-section">
        <SectionHeading
          eyebrow={POINTS_COPY.eyebrow}
          title={POINTS_COPY.title}
          inverse
          titleClassName="max-w-[24ch]"
        />
        <p className="mt-8 max-w-[58ch] text-pretty text-base leading-relaxed text-horizon/70">
          {POINTS_COPY.intro}
        </p>
      </div>

      <HorizontalTrack
        label={POINTS_COPY.trackLabel}
        className="mt-16 pb-section lg:mt-0 lg:flex lg:min-h-dvh lg:items-center lg:pb-0"
      >
        {/* Leading gutter spacer keeps the first card off the viewport edge. */}
        <div aria-hidden="true" className="w-gutter shrink-0" />
        {SPOTS.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
        <div aria-hidden="true" className="w-gutter shrink-0" />
      </HorizontalTrack>
    </section>
  );
}
