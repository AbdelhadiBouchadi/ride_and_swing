'use client';

import { useCallback, useRef } from 'react';

import { LogoMark } from '@/components/brand/LogoMark';
import { usePreloader } from '@/components/preloader/PreloaderContext';
import { usePreloaderTimeline } from '@/components/preloader/usePreloaderTimeline';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { gsap } from '@/lib/gsap';
import { loadAssets } from '@/lib/preloader/assetLoader';
import { HOME_MANIFEST } from '@/lib/preloader/manifest';
import {
  markPreloadedThisSession,
  signalPreloaderReady,
} from '@/lib/preloader/ready';

/** Coarse milestones announced to assistive tech, as fractions. */
const ANNOUNCE_AT = [0.25, 0.5, 0.75, 1] as const;

/**
 * First-load curtain.
 *
 * Rendered on the server so the opaque ground exists in the very first paint —
 * there is no window in which the page shows through and is then covered. The
 * covering styles live in `globals.css` under `html.js`, so a visitor without
 * JavaScript never gets a curtain that has nothing to lift it.
 *
 * The hero underneath is **not** hidden. It paints normally and stays the LCP
 * candidate; this element merely sits on top of it. Hiding the hero would move
 * LCP to whatever this overlay contains, and make a fast page measure slow.
 */
export function Preloader(): React.JSX.Element {
  const scope = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  const { finish } = usePreloader();

  // Created once, on first use. `useRef` rather than state: nothing renders
  // off it, and re-running the manifest under React 19's double-invoked
  // effects would double every request.
  const promiseRef = useRef<Promise<unknown> | null>(null);
  const proxyRef = useRef<{ value: number }>({ value: 0 });
  const announcedRef = useRef<number>(-1);

  useIsomorphicLayoutEffect(() => {
    // The browser restoring a previous scroll position mid-curtain would
    // reveal the page somewhere other than the top.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  /**
   * Ease the displayed number instead of letting it jump.
   *
   * The counter is honest — every increment is a real settled asset — but a
   * weighted manifest of two items moves in big steps, and a number that
   * teleports 0 → 29 → 100 reads as fake even though it is the truthful one.
   * Tweening a proxy keeps the value real and the motion legible.
   *
   * Written straight to the text node. This runs every frame; through React
   * state it would re-render the tree instead.
   */
  const handleProgress = useCallback((ratio: number): void => {
    gsap.to(proxyRef.current, {
      value: ratio,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: () => {
        const pct = Math.round(proxyRef.current.value * 100);
        const node = counterRef.current;
        if (node) {
          node.textContent = String(pct).padStart(3, '0');
        }

        // Announce milestones only. An aria-live region updated at 60fps is
        // unusable — screen readers queue every change and read none of it in
        // time. Four announcements carry the same information.
        const live = liveRef.current;
        if (!live) return;
        const milestone = ANNOUNCE_AT.findIndex(
          (m) => proxyRef.current.value >= m,
        );
        if (milestone > announcedRef.current) {
          announcedRef.current = milestone;
          live.textContent = `Loading, ${String(pct)} percent`;
        }
      },
    });
  }, []);

  const waitFor = useCallback((): Promise<unknown> => {
    promiseRef.current ??= loadAssets({
      manifest: HOME_MANIFEST,
      onProgress: handleProgress,
      ceilingMs: 6000,
      floorMs: 1200,
    });
    return promiseRef.current;
  }, [handleProgress]);

  const handleComplete = useCallback((): void => {
    markPreloadedThisSession();
    // Lets the hero build its entrance, and releases Lenis via the provider.
    signalPreloaderReady();
    finish();

    // Focus lands on the document rather than wherever it was before the
    // curtain, so a keyboard user starts at the top of the page like everyone
    // else. `tabindex` is added and removed so the body does not linger in the
    // tab order.
    document.body.setAttribute('tabindex', '-1');
    document.body.focus({ preventScroll: true });
    document.body.removeAttribute('tabindex');
  }, [finish]);

  usePreloaderTimeline({
    scope,
    waitFor,
    onComplete: handleComplete,
  });

  return (
    <div
      ref={scope}
      data-preloader
      // z-70: above the header (z-50) and the mobile menu (z-60).
      className="fixed inset-0 z-[70] flex items-center justify-center bg-abyss text-horizon"
    >
      <div
        data-preloader-badge
        className="flex items-center justify-center"
        // Decorative here: the page's accessible name is already carried by
        // the header wordmark and the document title.
        aria-hidden="true"
      >
        <LogoMark className="w-[min(52vw,240px)]" title={null} />
      </div>

      <div
        data-preloader-meta
        className="gutter absolute inset-x-0 bottom-8 flex items-baseline gap-3 sm:bottom-10"
      >
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="flex items-baseline gap-3"
        >
          <span
            ref={counterRef}
            aria-hidden="true"
            data-numeric
            className="font-mono text-xs text-horizon/70"
          >
            000
          </span>
          <span ref={liveRef} className="sr-only" />
        </span>
        <span aria-hidden="true" className="label-mono text-horizon/35">
          Ride and Swing
        </span>
      </div>
    </div>
  );
}
