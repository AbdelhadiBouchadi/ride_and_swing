import type { ManifestItem, PreloadManifest } from '@/lib/preloader/manifest';

/**
 * Real asset loading for the preloader.
 *
 * No faked progress. Every increment here corresponds to something the
 * browser genuinely finished, which is the only reason a progress number is
 * worth showing at all.
 *
 * Two guards bracket the wait:
 *
 * - a **ceiling**, so a stalled CDN cannot trap someone behind a curtain. It
 *   resolves regardless and reports what was still outstanding.
 * - a **floor**, so a warm cache does not flash the badge for 80ms. The
 *   sequence is choreography; it needs time to read as deliberate rather
 *   than as a glitch.
 */

export interface AssetLoadResult {
  /** True when the ceiling fired before everything settled. */
  readonly timedOut: boolean;
  /** Manifest ids still pending when the ceiling fired. */
  readonly outstanding: readonly string[];
  readonly elapsedMs: number;
}

export interface LoadAssetsOptions {
  readonly manifest: PreloadManifest;
  /** Called with 0..1 as weighted items resolve. Fires on every settle. */
  readonly onProgress: (ratio: number) => void;
  /** Hard ceiling. Resolves regardless once this elapses. */
  readonly ceilingMs?: number;
  /** Minimum on-screen time for the sequence. */
  readonly floorMs?: number;
}

const DEFAULT_CEILING_MS = 6000;
const DEFAULT_FLOOR_MS = 1200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Decode an image rather than merely load it.
 *
 * `onload` fires when the bytes have arrived; the browser can still block on
 * the main thread decoding them at paint time, which is exactly the stutter a
 * preloader is supposed to absorb. `decode()` resolves only once the frame is
 * ready to paint.
 */
async function decodeImage(src: string): Promise<void> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  try {
    await img.decode();
  } catch {
    // A decode failure must not hold the page hostage. The <img> in the
    // document will show its own broken/alt state; the curtain still lifts.
  }
}

/** Resolve the URL the browser actually chose for an art-directed image. */
function resolveResponsiveSrc(selector: string, fallbackSrc: string): string {
  const el = document.querySelector(selector);
  if (el instanceof HTMLImageElement && el.currentSrc !== '') {
    return el.currentSrc;
  }
  return fallbackSrc;
}

function loadItem(item: ManifestItem): Promise<void> {
  switch (item.kind) {
    case 'fonts': {
      // `document.fonts.ready` resolves once font loading has settled for the
      // current layout. Guarded because it is absent in some embedded views.
      if (typeof document === 'undefined' || !('fonts' in document)) {
        return Promise.resolve();
      }
      return document.fonts.ready.then(() => undefined);
    }
    case 'image':
      return decodeImage(item.src);
    case 'responsive-image':
      return decodeImage(
        resolveResponsiveSrc(item.selector, item.fallbackSrc),
      );
  }
}

/**
 * Run the manifest, reporting weighted progress, bounded by a floor and a
 * ceiling. Always resolves — never rejects.
 */
export async function loadAssets({
  manifest,
  onProgress,
  ceilingMs = DEFAULT_CEILING_MS,
  floorMs = DEFAULT_FLOOR_MS,
}: LoadAssetsOptions): Promise<AssetLoadResult> {
  const startedAt = performance.now();

  const totalWeight = manifest.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) {
    onProgress(1);
    await delay(floorMs);
    return { timedOut: false, outstanding: [], elapsedMs: floorMs };
  }

  let settledWeight = 0;
  const outstanding = new Set<string>(manifest.map((item) => item.id));

  const work = manifest.map((item) =>
    loadItem(item)
      .catch(() => undefined)
      .then(() => {
        outstanding.delete(item.id);
        settledWeight += item.weight;
        onProgress(Math.min(1, settledWeight / totalWeight));
      }),
  );

  let timedOut = false;

  // The ceiling races the work; the floor is awaited alongside it, never
  // after, so a slow load and the minimum display overlap instead of adding
  // up. `allSettled` because a rejection here must not skip the floor.
  await Promise.all([
    Promise.race([
      Promise.allSettled(work),
      delay(ceilingMs).then(() => {
        if (outstanding.size > 0) {
          timedOut = true;
        }
      }),
    ]),
    delay(floorMs),
  ]);

  if (timedOut) {
    console.warn(
      `[preloader] Ceiling of ${String(ceilingMs)}ms reached with ${String(
        outstanding.size,
      )} item(s) outstanding: ${[...outstanding].join(', ')}. ` +
        'Revealing the page anyway.',
    );
    // Show a complete bar rather than freezing it mid-count — the number is
    // a courtesy, and stopping at 62% forever reads as broken.
    onProgress(1);
  }

  return {
    timedOut,
    outstanding: [...outstanding],
    elapsedMs: performance.now() - startedAt,
  };
}
