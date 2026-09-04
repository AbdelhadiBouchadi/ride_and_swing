/**
 * Domain types for the property template.
 *
 * Every piece of page content is described here first, so sections consume
 * typed data rather than inline strings. No `any` anywhere in this project.
 *
 * The site is built to be re-skinned per client: one `PropertyConfig` object in
 * `@/lib/property.config` supplies the identity, the coastline, the packages,
 * the spots and every line of section copy. `@/lib/content` re-exports it under
 * the names the sections import, so a new prospect is a config edit and nothing
 * else. These types are what make that swap fail the build when it is
 * incomplete rather than silently ship a half-renamed business.
 */

/** Aspect ratios we art-direct against. Kept as a union so a typo fails the build. */
export type AspectRatio = "3/4" | "4/5" | "1/1" | "3/2" | "16/9" | "21/9";

/** Tonal treatment for photography placeholders, drawn from the brand palette. */
export type PhotoTone = "dawn" | "noon" | "dusk" | "fairway" | "ocean";

/**
 * An art-direction brief for a photograph.
 *
 * The brief renders as a designed placeholder when no file is bound to its id,
 * so a photographer can shoot to spec and a prospect never sees a grey box.
 */
export interface PhotoBrief {
  /**
   * Stable slot id, also used as the GSAP parallax target key and the lookup
   * into `@/lib/photos`. Slots are named for what the frame *contains*
   * (`board-line`), never for the package that happens to use it — so
   * renaming a package in the config never orphans a photograph.
   */
  readonly id: string;
  /** What the frame must contain. Written for a photographer, not a developer. */
  readonly direction: string;
  /** Time of day / colour treatment. */
  readonly tone: PhotoTone;
  readonly ratio: AspectRatio;
}

/**
 * A bookable package.
 *
 * `photo` is absent here on purpose — see `PackageGroup`. Only the groups the
 * client has photography for carry frames, and the type makes that explicit
 * rather than leaving a hopeful optional field on every entry.
 */
export interface Package {
  readonly id: string;
  readonly name: string;
  /** One line on who it is for, in the operator's voice. */
  readonly meaning: string;
  /** Ability banding, printed as sold: "All Levels", "Beginner". */
  readonly level: string;
  /** Time as sold, e.g. "30 minutes", "9 holes". */
  readonly duration: string;
  /** What is actually included. Concrete items, not benefits. */
  readonly includes: readonly string[];
  /**
   * The price exactly as the client quotes it — "800 DHS", "40€", "80€ pp".
   *
   * Deliberately a display string and not a number plus a currency code. This
   * operator prices in two currencies at once (dirhams for the combined
   * surf-and-golf days, euro for the standalone lessons) and sometimes
   * qualifies a figure inline ("all in", "max 3 pax"). Normalising that into
   * `{ amount, currency }` would force the page to reconstruct a format the
   * client has already chosen, and would silently drop the qualifiers.
   * Rendering is `data-numeric` either way, so figures still hold their column.
   */
  readonly priceDisplay: string;
}

/** A package that is sold with a photograph. */
export interface FeaturePackage extends Package {
  readonly photo: PhotoBrief;
}

/**
 * How a group of packages is set on the page.
 *
 * `feature` gives each package an alternating full-width photographic block.
 * `list` sets the group as a rate card. The distinction is editorial, not
 * cosmetic: a rate card is the honest form for a group with no photography,
 * and it is also the form a reader comparing seven prices actually wants.
 */
export type PackageLayout = "feature" | "list";

interface PackageGroupBase {
  readonly id: string;
  readonly title: string;
  /** One line on what this group is and who it is for. */
  readonly note: string;
  readonly layout: PackageLayout;
}

export interface FeaturePackageGroup extends PackageGroupBase {
  readonly layout: "feature";
  readonly packages: readonly FeaturePackage[];
}

export interface ListPackageGroup extends PackageGroupBase {
  readonly layout: "list";
  readonly packages: readonly Package[];
}

/** Discriminated so a `feature` group cannot compile without photography. */
export type PackageGroup = FeaturePackageGroup | ListPackageGroup;

/** Which half of the brand a spot belongs to. */
export type Discipline = "surf" | "golf";

/** Difficulty banding, shared across both disciplines. */
export type SpotLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "All Levels";

/** Wave direction. */
export type BreakHand = "Right" | "Left" | "Both";

interface SpotBase {
  readonly id: string;
  readonly name: string;
  readonly level: SpotLevel;
  /** Minutes from the front door, by car. */
  readonly minutesAway: number;
  readonly note: string;
}

/** A named surf break within reach. */
export interface SurfSpot extends SpotBase {
  readonly discipline: "surf";
  readonly hand: BreakHand;
  /** Swell direction and size the break wants. */
  readonly worksOn: string;
}

/** A golf course within reach. */
export interface GolfSpot extends SpotBase {
  readonly discipline: "golf";
  readonly holes: number;
  /** What the course asks of you — the golf equivalent of `worksOn`. */
  readonly plays: string;
}

/**
 * Somewhere this business takes you.
 *
 * A discriminated union rather than two parallel lists, so the Points track
 * carries breaks and courses in one run. That is the brand's whole argument —
 * two sports, one coast — made structurally instead of asserted in copy.
 */
export type Spot = SurfSpot | GolfSpot;

/** One phase of the day. */
export interface DayMoment {
  /**
   * The phase this row belongs to — "Morning", "Mid-Day". Deliberately not a
   * clock time: sessions here move with the swell and the tide, so a printed
   * hour would be a promise the ocean has not agreed to.
   */
  readonly marker: string;
  readonly title: string;
  readonly body: string;
}

/** A single reading from the morning almanac band. */
export interface AlmanacReading {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
}

/** Navigation entry. */
export interface NavItem {
  readonly label: string;
  readonly href: string;
}

/** A short label/value pair, used for the standing facts beside a section. */
export interface Fact {
  readonly label: string;
  readonly value: string;
}

/** A titled note, used for the practical column under the enquiry section. */
export interface Note {
  readonly label: string;
  readonly body: string;
}

/* -------------------------------------------------------------------------- */
/*  Property configuration                                                     */
/* -------------------------------------------------------------------------- */

/** Who the property is. Drives metadata, structured data and the social card. */
export interface PropertyIdentity {
  /** Full trading name, e.g. "Ride and Swing". */
  readonly name: string;
  /**
   * Short mark set in the display face at hero scale. Keep it to two words at
   * the outside — the hero sizes it against the viewport, and a longer mark
   * forces the clamp down until it stops reading as a wordmark.
   */
  readonly wordmark: string;
  readonly tagline: string;
  /** Where the name comes from. Printed in the footer. */
  readonly provenance: string;
  /** One or two sentences. Used verbatim as the meta description. */
  readonly description: string;
  /** Human-readable address line. */
  readonly location: string;
  /** Town, for schema.org `addressLocality`. */
  readonly locality: string;
  /** Region, for schema.org `addressRegion`. */
  readonly region: string;
  /** ISO 3166-1 alpha-2, for schema.org `addressCountry`. */
  readonly countryCode: string;
  /** Country as printed to a reader, e.g. "Morocco". */
  readonly country: string;
  /** Printed coordinates. Display only — the almanac uses `CoastConfig`. */
  readonly coordinates: string;
  readonly email: string;
  readonly phone: string;
  readonly url: string;
}

/**
 * The stretch of coast this property sits on.
 *
 * This is what the live almanac queries, so it must be the real position of the
 * house: swapping the config moves the forecast with the brand.
 */
export interface CoastConfig {
  readonly latitude: number;
  readonly longitude: number;
  /**
   * The compass bearing the shore faces, in degrees — 270 for a coast looking
   * due west. Land sits at the reciprocal, and that is what decides whether a
   * given wind is blowing offshore or onshore.
   */
  readonly coastFacingDegrees: number;
}

/** Search metadata that is genuinely property-specific. */
export interface SeoConfig {
  readonly keywords: readonly string[];
  /** Rendered into the `SportsActivityLocation` JSON-LD as `amenityFeature`. */
  readonly amenities: readonly string[];
}

/** A section with a lead-in label and a display heading. */
export interface SectionCopy {
  readonly eyebrow: string;
  readonly title: string;
}

export interface HeroCopy {
  /** Sits under the wordmark. Two sentences at most — it competes with the photo. */
  readonly subtitle: string;
  /** Strapline on the 1200×630 social card. Short enough to read as a thumbnail. */
  readonly ogStrapline: string;
}

export interface ManifestoCopy {
  readonly eyebrow: string;
  readonly statement: string;
  readonly body: readonly string[];
  /** Set large and italic under a rule. The line you want remembered. */
  readonly pullQuote: string;
}

export interface PackagesCopy extends SectionCopy {
  /** What every price includes, and anything held back from the lists above. */
  readonly footnote: string;
}

export interface PointsCopy extends SectionCopy {
  readonly intro: string;
  /** Accessible name for the horizontally scrolled region. */
  readonly trackLabel: string;
}

export interface DayCopy extends SectionCopy {
  readonly intro: string;
  /** Seasonal caveat under the timeline — times shift across the year. */
  readonly footnote: string;
}

export interface TableCopy {
  readonly eyebrow: string;
  readonly statement: string;
  readonly body: readonly string[];
  readonly photo: PhotoBrief;
  readonly facts: readonly Fact[];
}

export interface EnquireCopy extends SectionCopy {
  readonly body: string;
  readonly notes: readonly Note[];
}

/**
 * The whole property, in one object.
 *
 * Everything a re-skin touches lives here. Nothing below this type should need
 * a component change to swap.
 */
export interface PropertyConfig {
  readonly identity: PropertyIdentity;
  readonly coast: CoastConfig;
  readonly seo: SeoConfig;
  readonly nav: readonly NavItem[];
  /** Rendered when a forecast source is unreachable. Labels must match the live builder. */
  readonly almanacFallback: readonly AlmanacReading[];
  readonly hero: HeroCopy;
  readonly heroPhoto: PhotoBrief;
  readonly placePhoto: PhotoBrief;
  readonly manifesto: ManifestoCopy;
  readonly packagesCopy: PackagesCopy;
  readonly packageGroups: readonly PackageGroup[];
  readonly pointsCopy: PointsCopy;
  readonly spots: readonly Spot[];
  readonly dayCopy: DayCopy;
  readonly day: readonly DayMoment[];
  readonly table: TableCopy;
  readonly enquire: EnquireCopy;
}
