import { cn } from '@/lib/utils';

/**
 * ============================================================================
 *  RIDE AND SWING — badge mark, as inline SVG.
 * ============================================================================
 *
 * COORDINATE SPACE — read this before replacing any `d` attribute.
 *
 *   viewBox            0 0 200 200      (square, y increases DOWNWARD)
 *   badge centre       (100, 100)
 *   ring               centre (100,100), r = 80
 *   frame              rect inset 8 → corners (8,8) (192,8) (192,192) (8,192)
 *   safe margin        keep all geometry inside 4 → 196 so strokes never clip
 *
 * These numbers are not invented. They were measured off the client's own
 * badge (`src/assets/brand/mark-dark.png`, 575×552 of artwork) by sampling
 * the alpha channel: the ring's widest chord sits at x 0.0925..0.9065 of the
 * artwork width, which maps to centre 100 / r 81.4 in this space, rounded to
 * 80. The frame bars measured x 7.5 and 192.2, hence the inset of 8. Mapping
 * is width-fitted with the artwork centred vertically, which is where the
 * 4-unit vertical offset comes from.
 *
 * ----------------------------------------------------------------------------
 * WHAT IS PROCEDURAL vs WHAT IS PLACEHOLDER
 * ----------------------------------------------------------------------------
 *
 * Procedural — pure geometry, cleaner than any trace of a 575px source, leave
 * these alone:
 *   #ring       a <circle>, stroke only
 *   #frame      four bracket corners as stroked paths
 *   #wordmark   "RIDE AND SWING" on an invisible arc via <textPath>
 *
 * PLACEHOLDER — replace the `d` attributes with your Inkscape traces:
 *   #board        vertical surfboard, centre
 *   #club-left    club with its head at the UPPER-LEFT
 *   #club-right   club with its head at the UPPER-RIGHT
 *
 * Each placeholder is marked `data-placeholder` so you can find them, and each
 * carries the bounding box its replacement should roughly occupy. Positions
 * come from the same measurement pass:
 *
 *   #board       x  87 → 113,  y  14 → 141   nose at TOP, tail at BOTTOM
 *   #club-left   x  11 →  40,  y  17 →  45   is the HEAD; the shaft runs
 *                down-RIGHT, crossing the centre line, to about (129, 134)
 *   #club-right  x 160 → 189,  y  17 →  45   is the HEAD; the shaft runs
 *                down-LEFT,  crossing the centre line, to about ( 71, 134)
 *
 * Nothing should descend past y≈145. The wordmark's capitals top out around
 * y 152 at the base of the arc, and the printed badge carries a banner there
 * that this reduction does not — so geometry that runs lower collides with
 * the lettering instead of sitting behind it.
 *
 * The shafts must CROSS — they meet around (100, 107), behind the board, which
 * is drawn last and covers the join. Shafts that converge at the base instead
 * read as a V, which is the one silhouette this badge must not be.
 *
 * REQUIREMENTS FOR YOUR REPLACEMENT PATHS
 *
 *   1. FILL, not stroke. A 575px source will not give usable centrelines, so
 *      these three animate by mask wipe rather than by stroke draw. Deliver
 *      closed outlines. `fill-rule="evenodd"` is already set, so counters and
 *      holes work without you flattening them.
 *   2. Absolute coordinates in the 0..200 space above. In Inkscape: set the
 *      document to 200×200 px, "Scale stroke width" off, and save as Plain
 *      SVG — then paste only the `d` string.
 *   3. No transform on the path itself. Both clubs are rotated by the
 *      animation via their wrapper <g>; a baked transform would compound.
 *   4. Draw each club in its RESTING crossed position. The entrance rotates
 *      it in from a few degrees off; it does not build the cross for you.
 *
 * Nothing else needs to change when you swap them — the masks, the timeline
 * and the ids all address the wrappers, not the geometry.
 * ============================================================================
 */

export interface LogoMarkProps {
  readonly className?: string;
  /**
   * Accessible name. Pass `null` for a purely decorative instance — the SVG
   * is then hidden from assistive tech entirely.
   */
  readonly title?: string | null;
}

/** "RIDE AND SWING", pre-split so each glyph is individually addressable. */
const WORDMARK_CHARS = 'RIDE AND SWING'.split('');

export function LogoMark({
  className,
  title = 'Ride and Swing',
}: LogoMarkProps): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      role={title === null ? 'presentation' : 'img'}
      aria-hidden={title === null ? true : undefined}
      aria-label={title ?? undefined}
    >
      <defs>
        {/*
          MASK INFRASTRUCTURE.

          `maskUnits="userSpaceOnUse"` with an explicit region pinned to the
          viewBox, rather than the default objectBoundingBox. The default
          region is derived from the masked element's own bbox, which means it
          would silently move the moment a real traced path replaces a
          placeholder of a different size — and the wipe would land somewhere
          else. Pinning to user space makes the mask geometry independent of
          whatever `d` ends up inside.

          White = visible. Each rect is oversized past the shape it reveals so
          that at rest it covers completely and no edge creeps into frame.
        */}

        {/* Board: wiped upward from its base. The animation scales this on Y
            about svgOrigin "100 145" — the tail — so the board grows out of
            the water rather than fading in. */}
        <mask
          id="mask-board"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="200"
          height="200"
        >
          <rect
            data-mask-board
            x="76"
            y="6"
            width="48"
            height="139"
            fill="#fff"
          />
        </mask>

        {/* Club left: wiped in diagonally from the upper-left corner. */}
        <mask
          id="mask-club-left"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="200"
          height="200"
        >
          <rect
            data-mask-club-left
            x="-20"
            y="-20"
            width="180"
            height="200"
            fill="#fff"
          />
        </mask>

        {/* Club right: mirrored, wiped in from the upper-right corner. */}
        <mask
          id="mask-club-right"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="200"
          height="200"
        >
          <rect
            data-mask-club-right
            x="40"
            y="-20"
            width="180"
            height="200"
            fill="#fff"
          />
        </mask>

        {/*
          The wordmark's baseline.

          Drawn left → right through the BOTTOM of the circle: from (37,100)
          with sweep-flag 0, which in SVG's y-down space is the
          counter-clockwise (lower) half. Traversed that way the path's left
          normal points at the screen's top, so glyphs sit upright and read
          left to right — the same arc as the printed badge.

          r = 63 rather than the ring's 80: measured off the badge, the
          lettering's own arc radius is ~74 through the middle of the glyphs,
          so a 63 baseline with a ~15 cap height lands the caps just inside
          the ring.
        */}
        <path
          id="wordmark-arc"
          d="M 37 100 A 63 63 0 0 0 163 100"
          fill="none"
          stroke="none"
        />
      </defs>

      {/* ------------------------------------------------------------------
          #frame — four bracket corners on a rect inset 8.

          Four separate paths rather than one, so the entrance can stagger
          them. Each is an L: 26 units along each arm from its corner.
          ------------------------------------------------------------------ */}
      <g
        id="frame"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      >
        <path d="M 8 34 L 8 8 L 34 8" />
        <path d="M 166 8 L 192 8 L 192 34" />
        <path d="M 192 166 L 192 192 L 166 192" />
        <path d="M 34 192 L 8 192 L 8 166" />
      </g>

      {/* #ring — stroke only. A <circle>'s implicit path starts at 3 o'clock
          and runs clockwise, which is exactly the direction DrawSVG scribes
          it in, so no reversing is needed. */}
      <circle
        id="ring"
        cx="100"
        cy="100"
        r="80"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />

      {/* ------------------------------------------------------------------
          The two clubs.

          Wrapper <g> carries the mask and is what the timeline rotates; the
          inner path carries only geometry. Keeping those on separate elements
          is what lets a traced path drop in without the rotation origin
          shifting.
          ------------------------------------------------------------------ */}
      <g id="club-left-wrap" mask="url(#mask-club-left)">
        <path
          id="club-left"
          data-placeholder="club-left"
          /* PLACEHOLDER — head upper-left (11..40, 17..45), shaft crossing
             down-RIGHT to (129,134). It must cross its partner, not meet it:
             two shafts converging at the centre read as a V, which is the one
             silhouette this badge is not. Replace this `d` with your trace. */
          d="M 11 30 L 26 17 L 40 32 L 32 39 L 129 128 L 123 134 L 26 45 Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>

      <g id="club-right-wrap" mask="url(#mask-club-right)">
        <path
          id="club-right"
          data-placeholder="club-right"
          /* PLACEHOLDER — mirror of club-left about x=100: head upper-right
             (160..189, 17..45), shaft crossing down-LEFT to (71,134).
             Replace this `d` with your trace. */
          d="M 189 30 L 174 17 L 160 32 L 168 39 L 71 128 L 77 134 L 174 45 Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>

      {/* ------------------------------------------------------------------
          The board. Drawn last of the three so it sits over the crossed
          shafts, matching the printed badge.
          ------------------------------------------------------------------ */}
      <g id="board-wrap" mask="url(#mask-board)">
        <path
          id="board"
          data-placeholder="board"
          /* PLACEHOLDER — nose at top (y≈14), tail at bottom (y≈141),
             x 87..113, widest around 45% down. The tail stops well short of
             the wordmark's cap line (~152) on purpose; run it lower and the
             board sits on top of the lettering.
             Replace this `d` with your trace. */
          d="M 100 14 C 106 32 113 64 113 90 C 113 114 108 131 100 141 C 92 131 87 114 87 90 C 87 64 94 32 100 14 Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>

      {/* ------------------------------------------------------------------
          #wordmark — set along the lower arc.

          Each glyph is its own <tspan> so the entrance can stagger them.
          See the note in `usePreloaderTimeline` for why these are pre-split
          tspans and not SplitText, and why they animate on opacity alone.

          Spaces are rendered as non-breaking so a glyph index never collapses
          — the stagger walks the DOM order and a dropped node would desync it
          from the arc.
          ------------------------------------------------------------------ */}
      <text
        id="wordmark"
        fill="currentColor"
        fontSize="15"
        letterSpacing="2.4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <textPath href="#wordmark-arc" startOffset="50%" textAnchor="middle">
          {WORDMARK_CHARS.map((char, index) => (
            <tspan
              // Index is the identity here: this is a fixed-length, never
              // reordered array of glyphs, and two "N"s must stay distinct.
              key={`${char}-${String(index)}`}
              data-wordmark-char
            >
              {char === ' ' ? ' ' : char}
            </tspan>
          ))}
        </textPath>
      </text>
    </svg>
  );
}
