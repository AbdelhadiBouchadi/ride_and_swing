import type { Metadata, Viewport } from "next";

import { Cursor } from "@/components/animations/Cursor";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Preloader } from "@/components/preloader/Preloader";
import { PreloaderProvider } from "@/components/preloader/PreloaderContext";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SEO, SITE } from "@/lib/content";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SEO.keywords],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never cap zoom — pinch-zoom is an accessibility requirement.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edeae3" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1c26" },
  ],
};

/**
 * Two flags, both set before first paint.
 *
 * `js` gates every progressive-enhancement rule in `globals.css`: reveal
 * targets are hidden without a flash, and stay visible when JavaScript is
 * unavailable.
 *
 * `preloaded` is read from a sessionStorage flag the preloader writes when it
 * finishes. Deciding here rather than in React is what makes a reload inside
 * the tab skip the curtain *before* anything paints — checking it at hydration
 * would show the overlay first and then tear it down, which is a worse flash
 * than the one we are avoiding.
 *
 * Both run while the document is still parsing, which is also why `<html>`
 * below carries `suppressHydrationWarning`: by the time React hydrates, the
 * class attribute it server-rendered has already been changed underneath it.
 *
 * Wrapped in try/catch because `sessionStorage` throws outright — not returns
 * null — in some privacy modes.
 */
const BOOT_SCRIPT = `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('rideandswing:preloaded'))document.documentElement.classList.add('preloaded')}catch(e){}`;

/**
 * Structured data. `SportsActivityLocation` rather than `LodgingBusiness`:
 * this business sells coaching, not beds, and the wrong type puts the listing
 * in the wrong search surface entirely.
 *
 * No `aggregateRating` key is emitted. This business has no reviews yet, and
 * an empty or invented rating is penalised harder than none at all — so the
 * key is absent rather than zeroed. Add it back the day there are real
 * reviews to count.
 */
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.location,
    addressLocality: SITE.locality,
    addressRegion: SITE.region,
    addressCountry: SITE.countryCode,
  },
  amenityFeature: SEO.amenities.map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
} as const;

export interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    /*
      `suppressHydrationWarning` is load-bearing, not a papering-over.

      Three things add classes to <html> that React does not know about: the
      progressive-enhancement script above, `Cursor` (`has-custom-cursor`) and
      Lenis (`lenis`). The latter two run in effects, safely after hydration.
      The script does not — it has to run during parse or reveal targets flash
      visible before they are hidden — so React arrives to find a `class`
      attribute that no longer matches what it rendered and warns that the tree
      hydrated with mismatched attributes.

      React does not patch the attribute up, so the class survives and the
      `html.js` selectors in globals.css keep working; the only thing being
      suppressed is the warning about a mutation we asked for. The flag applies
      to this element alone and does not cascade, and <html> carries nothing
      here but `lang` and the three static font variables, so it is not hiding
      anything that could realistically drift.
    */
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        fontDisplay.variable,
        fontBody.variable,
        fontMono.variable,
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Keyboard users must be able to bypass the header. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-100 focus:bg-abyss focus:px-5 focus:py-3 focus:text-horizon label-mono"
        >
          Skip to content
        </a>

        {/* The provider wraps SmoothScroll so Lenis can read the curtain's
            state and stay stopped for the whole preload. The overlay itself is
            a sibling of the scrolled tree, not a child of it — it must not be
            affected by, or affect, the scroller it is covering. */}
        <PreloaderProvider>
          <SmoothScroll>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
            {/* Both self-disable on coarse pointers and under reduced motion. */}
            <Cursor />
            <ScrollProgress />
          </SmoothScroll>

          <Preloader />
        </PreloaderProvider>
      </body>
    </html>
  );
}
