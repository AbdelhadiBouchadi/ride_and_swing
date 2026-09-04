import type { StaticImageData } from 'next/image';

import boardLine from '@/assets/photos/board-line.webp';
import place from '@/assets/photos/place.webp';
import puttingGreen from '@/assets/photos/putting-green.webp';
import teeShot from '@/assets/photos/tee-shot.webp';
import theGreen from '@/assets/photos/the-green.webp';

/**
 * Photographs keyed by `PhotoBrief.id`.
 *
 * These are **static imports**, not string paths: Next reads the file at build
 * time, so each entry carries its real width, height and a generated
 * `blurDataURL`. That gives a true blur-up on load and makes layout shift
 * impossible — neither is available when you pass a `/public` string.
 *
 * Slots are named for **what the frame contains** — `tee-shot`, not
 * `surf-and-nine`. Package names change with every client this template is
 * pitched to, and they changed twice during this rebrand alone; a photograph
 * of a follow-through against open sky is still that photograph. Keying on
 * content is what lets `property.config.ts` be rewritten end to end without
 * orphaning a single image.
 *
 * The hero is deliberately absent. It is art-directed across breakpoints
 * (a 21/9 frame on desktop, a separately composed 3/4 frame on phones), which
 * requires a real <picture> element — see `HeroPicture`.
 *
 * A brief with no entry here renders its art-direction placeholder instead, so
 * adding or removing photography needs no component changes.
 */
export const PHOTOS: Readonly<Record<string, StaticImageData>> = {
  place,
  'the-green': theGreen,
  'putting-green': puttingGreen,
  'board-line': boardLine,
  'tee-shot': teeShot,
};

/**
 * Alt text. Written as description, not keyword stuffing — these are read
 * aloud, so they say what is in the frame and stop.
 */
export const PHOTO_ALT: Readonly<Record<string, string>> = {
  place:
    'A wide beach under heavy cloud, a surf class spread along the sand practising pop-ups on their boards, with scrub-covered hills and a village rising behind them.',
  'the-green':
    'A golfer putting on a cut green with the flag still in the hole, an arid, scrub-covered hillside rising behind the course.',
  'putting-green':
    'A golfer standing over a putt on a green, the pin flag hanging beside him against a pale, cloudless sky.',
  'board-line':
    'Soft-top surfboards laid out in a long receding line on wet sand, students in wetsuits standing on them during a beach drill.',
  'tee-shot':
    'A golfer at the top of his follow-through against an open sky, a tall cactus beside him and dry scrub and palms across the ground behind.',
};
