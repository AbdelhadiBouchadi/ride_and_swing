/**
 * The handoff between the preloader and everything that wants to animate
 * after it.
 *
 * A module-level promise rather than context, deliberately. The hero's
 * entrance timeline is built inside `useGSAP` at mount, which happens *while*
 * the curtain is still up — it needs a value it can await from wherever it
 * sits in the tree, not a prop that re-renders it later. A promise is also
 * naturally idempotent under React 19's double-invoked effects: awaiting it
 * twice is free, whereas a context flag would rebuild the timeline.
 *
 * An event is dispatched alongside it for anything non-React that wants to
 * listen without holding a reference to this module.
 */

export const PRELOADER_READY_EVENT = 'ridewswing:preloader-ready';

let resolveReady: (() => void) | undefined;
let isReady = false;

const readyPromise: Promise<void> = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

/**
 * Await the moment the page is handed over — the curtain is gone, the scroll
 * is at the top and ScrollTrigger has been refreshed.
 *
 * Resolves immediately if that has already happened.
 */
export function whenPreloaderReady(): Promise<void> {
  return readyPromise;
}

/** True once the handover has happened. Cheap synchronous check. */
export function isPreloaderReady(): boolean {
  return isReady;
}

/** Called once by the preloader when the exit sequence finishes. */
export function signalPreloaderReady(): void {
  if (isReady) return;
  isReady = true;
  resolveReady?.();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PRELOADER_READY_EVENT));
  }
}

/**
 * The session flag.
 *
 * A reload inside the same tab should not replay the sequence — it is an
 * arrival, and you only arrive once. `sessionStorage` rather than
 * `localStorage` so a genuinely new visit still gets it, and wrapped because
 * it throws outright in some privacy modes.
 */
export const PRELOADER_SESSION_KEY = 'rideandswing:preloaded';

export function markPreloadedThisSession(): void {
  try {
    sessionStorage.setItem(PRELOADER_SESSION_KEY, '1');
  } catch {
    // Storage denied. The sequence replays on reload; nothing breaks.
  }
}

/**
 * Whether the curtain should be skipped.
 *
 * Reads the class the blocking `<head>` script sets rather than
 * `sessionStorage` directly, so the CSS and the JavaScript can never disagree
 * about whether a curtain is on screen.
 */
export function shouldSkipPreloader(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('preloaded');
}
