'use client';

import type { RefObject } from 'react';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { shouldSkipPreloader } from '@/lib/preloader/ready';

/**
 * The arrival sequence.
 *
 * Four acts, then an exit. The acts are named on the timeline so the shape is
 * legible from a debugger rather than only from this file.
 *
 *   frame   the badge is ruled out — brackets, then the ring scribing clockwise
 *   swing   the two clubs wipe in from opposite upper corners and settle crossed
 *   ride    the board wipes up out of its own base
 *   sealed  the wordmark lights up along the arc, and the badge settles
 *
 * Acts 1–3 run unconditionally and take about 1.4s. The timeline then *pauses*
 * at `sealed` and waits for the asset manifest. That ordering is the whole
 * point: the frame you hold on is the finished badge, never a half-drawn one,
 * however long the network takes.
 *
 * ---------------------------------------------------------------------------
 * WHY tspans AND NOT SplitText, FOR THE ARCED WORDMARK
 * ---------------------------------------------------------------------------
 *
 * SplitText is an HTML text splitter. It measures line boxes and rewraps
 * content in absolutely-positioned <div>s, none of which exists inside an SVG
 * <textPath>; pointing it at SVG text either no-ops or destroys the layout.
 *
 * Pre-split <tspan>s keep the browser's own text-on-a-path engine doing the
 * positioning — kerning, letter-spacing and the arc distribution all stay
 * native — while still giving one addressable node per glyph.
 *
 * The cost is that <tspan> cannot be reliably transformed. `transform` on a
 * tspan is SVG 2; Chrome honours it, Firefox and Safari are inconsistent. And
 * the obvious alternative, animating `dy`, re-runs text layout every frame —
 * exactly the layout-triggering property this build is meant to avoid. So the
 * glyphs animate on **opacity only**, staggered along the arc.
 *
 * If a glyph-level transform is ever genuinely needed, the escape hatch is to
 * drop <textPath> and emit one <text> per glyph at coordinates computed with
 * trig — full transform control, at the cost of hand-rolling kerning.
 */

export interface PreloaderTimelineOptions {
  /** Root of the overlay. Scopes every selector below. */
  readonly scope: RefObject<HTMLDivElement | null>;
  /** Resolves when the asset manifest has settled. Must be stable. */
  readonly waitFor: () => Promise<unknown>;
  /** Runs once the curtain is gone and the page has been handed over. */
  readonly onComplete: () => void;
}

/** Put the page back where an arrival expects it, before anything is revealed. */
function scrollToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

export function usePreloaderTimeline({
  scope,
  waitFor,
  onComplete,
}: PreloaderTimelineOptions): void {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      // Decided here, in the layout effect, rather than during render. The
      // answer lives on `documentElement` — written by the blocking <head>
      // script — so this is a DOM read, and reading the DOM is exactly what
      // an effect is for. It also keeps the CSS and the timeline reading the
      // same source of truth about whether a curtain is on screen.
      if (shouldSkipPreloader()) {
        // Nothing to play. Hand over on the next tick so subscribers that
        // mount in the same commit still see the event.
        const call = gsap.delayedCall(0, onComplete);
        return () => {
          call.kill();
        };
      }

      const q = gsap.utils.selector(root);
      const badge = root.querySelector<HTMLElement>('[data-preloader-badge]');
      const overlay = root;
      const counter = root.querySelector<HTMLElement>('[data-preloader-meta]');

      const mm = gsap.matchMedia();

      /* ------------------------------------------------------------------
         Reduced motion: no draw, no wipe. The badge is simply present, the
         manifest is still awaited — the wait is information, not decoration,
         and removing it would show a half-loaded page sooner, not better —
         and the curtain crossfades out in 200ms.
         ------------------------------------------------------------------ */
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(badge, { opacity: 1 });

        let cancelled = false;
        void waitFor().then(() => {
          if (cancelled) return;
          scrollToTop();
          gsap.to(overlay, {
            autoAlpha: 0,
            duration: 0.2,
            ease: 'none',
            onComplete: () => {
              ScrollTrigger.refresh();
              onComplete();
            },
          });
        });

        return () => {
          cancelled = true;
        };
      });

      /* ------------------------------------------------------------------
         Full sequence.
         ------------------------------------------------------------------ */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const framePaths = q('#frame path');
        const ring = q('#ring');
        const wordmarkChars = q('[data-wordmark-char]');
        /*
          Queried straight off the document, and that is not incidental.

          `useGSAP({ scope })` runs this inside a `gsap.context`, and inside a
          context `gsap.utils.toArray` quietly rewrites itself to the context's
          scoped selector (`gsap-core.js`: `_context && !scope &&
          _context.selector ? _context.selector(value) : …`) — a matchMedia
          created inside a scoped context inherits that same selector. The
          header lives outside this overlay, so the scoped lookup returned
          nothing at all and the stagger silently never ran.

          Scoping is right for every other selector in this file: the badge's
          parts are inside the overlay and should never be addressable beyond
          it. The header is the one deliberate exception, so it says so.
        */
        const headerChars = Array.from(
          document.querySelectorAll<HTMLElement>('[data-header-char]'),
        );

        // Pre-roll. Set every start state in one synchronous block so the
        // first painted frame is already correct — useGSAP runs in a layout
        // effect, so this lands before the browser paints.
        gsap.set(badge, { opacity: 1 });
        gsap.set([...framePaths, ...ring], { drawSVG: '0%' });
        gsap.set(wordmarkChars, { opacity: 0 });
        gsap.set('#club-left-wrap', { rotation: -7, svgOrigin: '25 32' });
        gsap.set('#club-right-wrap', { rotation: 7, svgOrigin: '175 32' });
        gsap.set('[data-mask-club-left]', { x: -170, y: -150 });
        gsap.set('[data-mask-club-right]', { x: 170, y: -150 });
        gsap.set('[data-mask-board]', { scaleY: 0, svgOrigin: '100 145' });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          // One frame of breathing room so the opaque ground is painted
          // before anything starts moving.
          delay: 0.12,
        });

        /* --- Act 1 — frame ------------------------------------------- */
        tl.addLabel('frame', 0);
        tl.to(
          framePaths,
          { drawSVG: '100%', duration: 0.5, stagger: 0.07, ease: 'power2.out' },
          'frame',
        );
        // The ring scribes clockwise: a <circle>'s implicit path starts at
        // 3 o'clock and runs clockwise, so a plain 0→100% draw is already the
        // direction we want.
        tl.to(
          ring,
          { drawSVG: '100%', duration: 0.95, ease: 'power2.inOut' },
          'frame+=0.22',
        );

        /* --- Act 2 — swing ------------------------------------------- */
        // power4.out, and nothing else. No back, no elastic: a golf club
        // arriving with a bounce reads as a toy.
        tl.addLabel('swing', 0.62);
        tl.to(
          '[data-mask-club-left]',
          { x: 0, y: 0, duration: 0.75, ease: 'power4.out' },
          'swing',
        );
        tl.to(
          '[data-mask-club-right]',
          { x: 0, y: 0, duration: 0.75, ease: 'power4.out' },
          'swing+=0.06',
        );
        tl.to(
          '#club-left-wrap',
          { rotation: 0, duration: 0.85, ease: 'power4.out' },
          'swing',
        );
        tl.to(
          '#club-right-wrap',
          { rotation: 0, duration: 0.85, ease: 'power4.out' },
          'swing+=0.06',
        );

        /* --- Act 3 — ride -------------------------------------------- */
        // Fluid rather than snappy: the board rises out of its own base.
        tl.addLabel('ride', 0.95);
        tl.to(
          '[data-mask-board]',
          { scaleY: 1, duration: 0.8, ease: 'power2.inOut' },
          'ride',
        );

        /* --- Hold ----------------------------------------------------- */
        tl.addLabel('sealed', 1.42);

        /*
          Everything above is unconditional. Playback stops here until the
          manifest settles, so the held frame is always the complete badge.

          The guard matters. `addPause` fires whenever the playhead crosses it,
          with no knowledge of whether we still need to wait — so on a warm
          cache, where the assets resolve *before* the playhead ever gets here,
          the `play()` in the resolve handler below lands on an
          already-playing timeline (a no-op) and this pause would then trap the
          sequence permanently. Checking the flag on the way past covers that
          ordering; the resolve handler covers the other one.

          Resumed on the next tick rather than inline: calling `play()` from
          inside the callback that is in the middle of pausing the same
          timeline is asking GSAP to unwind its own render.
        */
        let assetsSettled = false;
        let resume: gsap.core.Tween | undefined;

        tl.addPause('sealed', () => {
          if (!assetsSettled) return;
          resume = gsap.delayedCall(0, () => {
            tl.play();
          });
        });

        /* --- Act 4 — sealed ------------------------------------------- */
        tl.to(
          wordmarkChars,
          {
            opacity: 1,
            duration: 0.34,
            ease: 'power1.out',
            // Left to right along the arc. The tspans are already in reading
            // order, so DOM order is arc order.
            stagger: 0.032,
          },
          'sealed',
        );
        tl.fromTo(
          badge,
          { scale: 1.012 },
          { scale: 1, duration: 0.7, ease: 'power3.out' },
          'sealed+=0.1',
        );

        /* --- Exit ------------------------------------------------------ */
        tl.addLabel('exit', 'sealed+=0.95');

        // Put the page where an arrival expects it *before* the reveal, so
        // nothing is seen mid-scroll and ScrollTrigger measures the real
        // resting layout when it refreshes below.
        tl.call(scrollToTop, undefined, 'exit');

        // The badge contracts very slightly — a breath in, not a shrink.
        tl.to(
          badge,
          { scale: 0.965, duration: 0.62, ease: 'power2.inOut' },
          'exit',
        );
        tl.to(
          [badge, counter],
          { autoAlpha: 0, duration: 0.4, ease: 'power2.in' },
          'exit+=0.18',
        );

        // The panel clears upward. Transform and opacity only — this is a
        // full-viewport element and anything layout-bound here would jank.
        tl.to(
          overlay,
          { yPercent: -100, duration: 0.9, ease: 'power4.inOut' },
          'exit+=0.3',
        );

        /* --- The typographic rhyme -------------------------------------
           The header has no logo to morph into, so nothing is morphed. The
           badge leaves, and the header's own wordmark writes itself in on the
           same beat — same letterforms, straight instead of arced. Timed to
           land as the panel clears.

           Only the letters are touched. The header's transform belongs to its
           own ScrollTrigger and must not be written to from here.
           ---------------------------------------------------------------- */
        if (headerChars.length > 0) {
          tl.to(
            headerChars,
            {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.035,
            },
            'exit+=0.5',
          );
        }

        tl.call(onComplete, undefined, 'exit+=1.2');

        // The manifest gate, for the ordering where the choreography gets
        // here first: the playhead is already sitting on the pause, and this
        // steps it past.
        let cancelled = false;
        void waitFor().then(() => {
          assetsSettled = true;
          if (cancelled) return;
          tl.play();
        });

        return () => {
          cancelled = true;
          resume?.kill();
          tl.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope, dependencies: [waitFor, onComplete] },
  );
}
