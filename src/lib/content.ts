import { PROPERTY } from "@/lib/property.config";
import type {
  AlmanacReading,
  CoastConfig,
  DayCopy,
  DayMoment,
  EnquireCopy,
  ManifestoCopy,
  NavItem,
  PackageGroup,
  PackagesCopy,
  PhotoBrief,
  PointsCopy,
  PropertyIdentity,
  SeoConfig,
  Spot,
  TableCopy,
} from "@/lib/types";

/**
 * The page's content surface.
 *
 * This file holds no data of its own — it names the pieces of `PROPERTY` that
 * sections consume. The indirection is the point: components import stable
 * names (`SITE`, `PACKAGE_GROUPS`, `SPOTS`) and never reach into the config's
 * shape, so re-skinning the site for a new client is one file
 * (`@/lib/property.config`) and zero component edits.
 */

export const SITE: PropertyIdentity = PROPERTY.identity;
export const COAST: CoastConfig = PROPERTY.coast;
export const SEO: SeoConfig = PROPERTY.seo;

export const NAV_ITEMS: readonly NavItem[] = PROPERTY.nav;

/** Static readings, used per-label when a live source is unreachable. */
export const ALMANAC: readonly AlmanacReading[] = PROPERTY.almanacFallback;

export const HERO = PROPERTY.hero;
export const HERO_PHOTO: PhotoBrief = PROPERTY.heroPhoto;
export const PLACE_PHOTO: PhotoBrief = PROPERTY.placePhoto;

export const MANIFESTO: ManifestoCopy = PROPERTY.manifesto;

export const PACKAGES_COPY: PackagesCopy = PROPERTY.packagesCopy;
export const PACKAGE_GROUPS: readonly PackageGroup[] = PROPERTY.packageGroups;

export const POINTS_COPY: PointsCopy = PROPERTY.pointsCopy;
export const SPOTS: readonly Spot[] = PROPERTY.spots;

export const DAY_COPY: DayCopy = PROPERTY.dayCopy;
export const DAY: readonly DayMoment[] = PROPERTY.day;

export const TABLE: TableCopy = PROPERTY.table;

export const ENQUIRE: EnquireCopy = PROPERTY.enquire;
