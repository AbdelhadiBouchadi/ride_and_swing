import { ImageReveal } from '@/components/animations/ImageReveal';
import { Parallax } from '@/components/animations/Parallax';
import { Reveal } from '@/components/animations/Reveal';
import { RevealText } from '@/components/animations/RevealText';
import { PhotoPlate } from '@/components/ui/PhotoPlate';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PACKAGES_COPY, PACKAGE_GROUPS } from '@/lib/content';
import type { FeaturePackage, Package, PackageGroup } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FeatureEntryProps {
  readonly pkg: FeaturePackage;
  /** Alternating sides give the group a rhythm without a grid of cards. */
  readonly flipped: boolean;
}

/** The photographic treatment. Reserved for the combined days. */
function FeatureEntry({ pkg, flipped }: FeatureEntryProps): React.JSX.Element {
  return (
    <article className="group/pkg grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div
        className={cn(
          'lg:col-span-7',
          flipped ? 'lg:order-2 lg:col-start-6' : 'lg:col-start-1',
        )}
      >
        <Parallax amount={30}>
          <ImageReveal>
            <PhotoPlate
              brief={pkg.photo}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="transition-transform duration-[900ms] ease-out motion-safe:group-hover/pkg:scale-[1.03]"
            />
          </ImageReveal>
        </Parallax>
      </div>

      <div
        className={cn(
          'lg:col-span-4',
          flipped ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9',
        )}
      >
        <Reveal className="flex items-baseline justify-between gap-6 border-b border-haze/30 pb-4">
          <span className="label-mono text-fairway-ink">{pkg.level}</span>
          <span className="label-mono text-haze-ink">{pkg.duration}</span>
        </Reveal>

        <RevealText
          as="h4"
          className="mt-8 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] tracking-[-0.02em] text-abyss"
        >
          {pkg.name}
        </RevealText>

        <RevealText className="mt-4 font-display text-lg italic text-tide">
          {pkg.meaning}
        </RevealText>

        <Reveal className="mt-8" staggerChildren>
          {pkg.includes.map((item) => (
            <p
              key={item}
              className="flex gap-4 border-t border-haze/20 py-3.5 text-sm leading-relaxed text-haze-ink first:border-t-0 first:pt-0"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1 shrink-0 rounded-full bg-fairway"
              />
              {item}
            </p>
          ))}
        </Reveal>

        <Reveal className="mt-8 border-t border-haze/30 pt-6">
          <span className="font-mono text-2xl text-abyss" data-numeric>
            {pkg.priceDisplay}
          </span>
        </Reveal>
      </div>
    </article>
  );
}

interface RateRowProps {
  readonly pkg: Package;
}

/**
 * The rate-card treatment.
 *
 * Used for the groups the client has no photography for. That is the honest
 * reason, but it is also the better one: a reader comparing seven standalone
 * prices wants them in a column they can run an eye down, not spread across
 * seven full-width photographic blocks.
 */
function RateRow({ pkg }: RateRowProps): React.JSX.Element {
  return (
    <article className="grid gap-x-8 gap-y-3 border-t border-haze/25 py-7 sm:grid-cols-12">
      <div className="sm:col-span-5">
        <h4 className="font-display text-2xl leading-tight tracking-[-0.01em] text-abyss">
          {pkg.name}
        </h4>
        <p className="mt-1.5 font-display text-base italic text-tide">
          {pkg.meaning}
        </p>
      </div>

      <div className="sm:col-span-4">
        <p className="label-mono text-haze-ink">{pkg.duration}</p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {pkg.includes.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-relaxed text-haze-ink"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1 shrink-0 rounded-full bg-fairway"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="sm:col-span-3 sm:text-right">
        <span className="font-mono text-xl text-abyss" data-numeric>
          {pkg.priceDisplay}
        </span>
      </div>
    </article>
  );
}

interface GroupProps {
  readonly group: PackageGroup;
}

function Group({ group }: GroupProps): React.JSX.Element {
  return (
    <section aria-labelledby={`pkg-${group.id}`}>
      <Reveal className="flex flex-col gap-4 border-b border-abyss/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h3
          id={`pkg-${group.id}`}
          className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-none tracking-[-0.02em] text-abyss"
        >
          {group.title}
        </h3>
        <p className="max-w-[44ch] text-sm leading-relaxed text-haze-ink">
          {group.note}
        </p>
      </Reveal>

      {group.layout === 'feature' ? (
        <div className="mt-20 flex flex-col gap-28 sm:gap-36">
          {group.packages.map((pkg, index) => (
            <FeatureEntry
              key={pkg.id}
              pkg={pkg}
              flipped={index % 2 === 1}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          {group.packages.map((pkg) => (
            <RateRow key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
}

/** Server Component. */
export function Packages(): React.JSX.Element {
  return (
    <section id="packages" className="grain relative bg-horizon-deep py-section">
      <div className="gutter">
        <SectionHeading
          eyebrow={PACKAGES_COPY.eyebrow}
          title={PACKAGES_COPY.title}
          titleClassName="max-w-[20ch]"
        />

        <div className="mt-24 flex flex-col gap-28 sm:gap-36">
          {PACKAGE_GROUPS.map((group) => (
            <Group key={group.id} group={group} />
          ))}
        </div>

        <Reveal className="mt-24 border-t border-haze/30 pt-8">
          <p className="max-w-[56ch] text-sm leading-relaxed text-haze-ink">
            {PACKAGES_COPY.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
