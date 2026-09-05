import type { PropertyConfig } from "@/lib/types";

/**
 * ============================================================================
 *  THE ONLY FILE A NEW CLIENT NEEDS.
 * ============================================================================
 *
 * This site is a template for small sport and hospitality operators on the
 * Moroccan Atlantic. Everything that identifies a business lives in this
 * object: the name, the coastline the live almanac reads from, the packages,
 * the spots, and every line of section copy. No component holds a
 * business-specific string.
 *
 * To pitch a new prospect:
 *
 *   1. Edit `identity` — name, wordmark, contact, url.
 *   2. Edit `coast` — the real latitude/longitude, and the bearing its shore
 *      faces. The almanac band retargets itself; nothing else to do.
 *   3. Edit `packageGroups` and `spots` to what they actually sell and where
 *      they actually take people.
 *   4. Rewrite the copy blocks in their voice.
 *   5. Drop photography into `src/assets/photos/` against the slot ids in
 *      `@/lib/photos`. Unbound slots render their art-direction brief, so an
 *      unshot business is still presentable.
 *
 * ---------------------------------------------------------------------------
 *  Current tenant: Ride and Swing, Taghazout.
 * ---------------------------------------------------------------------------
 *
 * Surf and golf sold as one coast. Package names and prices are the client's
 * own rate card, reproduced exactly — including the two currencies, which is
 * how they quote it.
 *
 * Fields that could not be sourced from the client's materials are marked
 * TO CONFIRM inline. They are placeholders, not guesses, and every one of them
 * must be filled before this goes anywhere near a customer.
 */
export const PROPERTY: PropertyConfig = {
  identity: {
    name: "Ride and Swing",
    wordmark: "RIDE & SWING",
    tagline: "Surf & Golf on the Atlantic",
    /** Footer standing line. Says where the business is, not what it promises. */
    provenance:
      "Taghazout, on the Souss coast — a cliff-top course above the Atlantic and, twenty minutes down the same road, the points that made this stretch of water worth flying for.",
    description:
      "Surf and golf on one coast, in one day. Cliff-top rounds at Tazegzout Golf Course above the Atlantic, coached surf sessions on the Taghazout points, and combined days that put you on both.",
    /** TO CONFIRM — no street address was supplied in the client intake. */
    location: "Taghazout, Morocco",
    locality: "Taghazout",
    region: "Souss-Massa",
    countryCode: "MA",
    country: "Morocco",
    coordinates: "30.5442° N, 9.7108° W",
    /** TO CONFIRM — placeholder. No address was supplied. */
    email: "hello@rideandswing.ma",
    /** TO CONFIRM — placeholder digits. Do not publish this. */
    phone: "+212 000 000 000",
    /** TO CONFIRM — placeholder. No domain was supplied. */
    url: "https://rideandswing.ma",
  },

  /**
   * Taghazout. The points along this stretch look roughly due west, which puts
   * the land at 90° — the reciprocal the wind classifier measures against.
   */
  coast: {
    latitude: 30.5442,
    longitude: -9.7108,
    coastFacingDegrees: 270,
  },

  seo: {
    keywords: [
      "surf and golf Morocco",
      "Tazegzout golf course",
      "golf Taghazout",
      "surf lessons Taghazout",
      "surf and golf package Agadir",
      "Taghazout Bay golf and surf",
    ],
    amenities: [
      "Combined surf and golf days",
      "Course guiding, 9 and 18 holes",
      "Group and private surf coaching",
      "Surf guiding for experienced surfers",
      "Equipment included",
    ],
  },

  nav: [
    { label: "The Idea", href: "#idea" },
    { label: "Packages", href: "#packages" },
    { label: "Where We Play", href: "#points" },
    { label: "A Day", href: "#day" },
    { label: "Two Worlds", href: "#two-worlds" },
  ],

  /**
   * Fallback almanac — representative autumn readings for this coast.
   *
   * The band is live: `getLiveAlmanacData()` in `@/lib/almanac` pulls real
   * conditions from Open-Meteo. This set renders when a source is unreachable,
   * and it is resolved per-reading, so a marine outage does not blank the wind.
   * Keep these labels in sync with the live builder — it looks fallbacks up by
   * label, and a mismatch silently prints an em dash.
   */
  almanacFallback: [
    { label: "Swell", value: "1.8", unit: "m" },
    { label: "Period", value: "14", unit: "s" },
    { label: "Direction", value: "NW 305", unit: "°" },
    { label: "Wind", value: "Offshore 8", unit: "kt" },
    { label: "Low water", value: "06:44" },
    { label: "High water", value: "12:58" },
    { label: "Sunrise", value: "07:21" },
    { label: "Sea", value: "19", unit: "°C" },
  ],

  hero: {
    subtitle:
      "Eighteen holes on a cliff above the Atlantic, and the points that ocean feeds twenty minutes down the road. Most people book both.",
    ogStrapline: "Surf & golf, one coast",
  },

  heroPhoto: {
    id: "hero",
    direction:
      "The class lined up on their boards before the session, the Atlantic filling the frame behind them and a very large sky above. The sky is what keeps the wordmark legible, so the horizon sits low.",
    tone: "ocean",
    ratio: "21/9",
  },

  placePhoto: {
    id: "place",
    direction:
      "The bay end to end — the beach, the hills behind it, the village stacked at the far edge and a class working on the sand. Documentary, not aspirational: this is a working coast and it should look like one.",
    tone: "noon",
    ratio: "3/2",
  },

  manifesto: {
    eyebrow: "The Idea",
    statement:
      "A cliff-top course above the Atlantic, and the waves that ocean makes — twenty minutes apart.",
    body: [
      "Most people come to this coast for one of the two and find out about the other by accident. Ride and Swing exists because there is no reason to choose. The course sits on the cliff above Taghazout Bay with the ocean in play on half the holes; the points that ocean feeds are a short drive down the same road. One morning covers both.",
      "The offer is built that way. You can book a round or a session on its own, and plenty of people do. But the combined days are the point of the business: practice or a full round in the cool of the morning, then the water when the wind has settled. Equipment for both is included, and the order of the day is set on the day, by the swell and the tee sheet rather than by a timetable.",
    ],
    pullQuote: "The same ocean decides both halves of your day.",
  },

  packagesCopy: {
    eyebrow: "Packages",
    title: "Book the pair, or book either half.",
    footnote:
      "Combined days are quoted in dirhams and standalone sessions in euro, exactly as we price them. Surf packages include board, wetsuit and the transfer to whichever point is working. Golf prices cover the round as listed; buggy, caddie and club rental are quoted separately. TO CONFIRM — confirm exactly what green fees do and do not include before this line is published.",
  },

  packageGroups: [
    {
      id: "combined",
      title: "Surf & Golf",
      note: "Both halves of the coast in one day. This is what the business is for.",
      layout: "feature",
      packages: [
        {
          id: "surf-and-practice",
          name: "Surf Session & Golf Practice",
          meaning: "The short version of the idea, and the easiest way in",
          level: "All Levels",
          duration: "A morning and an afternoon",
          includes: [
            "One coached surf session, board and wetsuit included",
            "One golf practice session on the range and the putting green",
            "Transfer between the course and the water",
          ],
          priceDisplay: "800 DHS",
          photo: {
            id: "putting-green",
            direction:
              "A putt on a cut green, pin in, the flag still. Hard low sun, long shadow, nobody watching. The green reads as maintained ground against everything arid behind it.",
            tone: "fairway",
            ratio: "4/5",
          },
        },
        {
          id: "surf-and-nine",
          name: "Surf Session & Nine Holes",
          meaning: "A guided nine in the morning, the water after it",
          level: "All Levels",
          duration: "Nine holes plus a session",
          includes: [
            "One coached surf session, board and wetsuit included",
            "Nine holes on the course with a guide alongside you",
            "Transfer between the course and the water",
          ],
          priceDisplay: "1750 DHS",
          photo: {
            id: "board-line",
            direction:
              "Soft-tops laid out in a receding line on wet sand, students standing on them mid-drill. Shot low and along the row so the boards run out of frame. Flat overcast light.",
            tone: "noon",
            ratio: "4/5",
          },
        },
        {
          id: "surf-and-eighteen",
          name: "Surf Session & Eighteen Holes",
          meaning: "The full round, and still in the water the same day",
          level: "All Levels",
          duration: "Eighteen holes plus a session",
          includes: [
            "One coached surf session, board and wetsuit included",
            "Eighteen holes on the course with a guide alongside you",
            "Transfer between the course and the water",
          ],
          priceDisplay: "2150 DHS",
          photo: {
            id: "tee-shot",
            direction:
              "The top of a follow-through against open sky, cactus and scrub holding the middle distance. Shot from behind and low, so the swing sits against nothing but light.",
            tone: "fairway",
            ratio: "4/5",
          },
        },
      ],
    },
    {
      id: "golf-only",
      title: "Golf",
      note: "On the course at Tazegzout, with or without someone alongside you.",
      layout: "list",
      packages: [
        {
          id: "golf-practice",
          name: "Practice",
          meaning: "Range and putting green, everything provided",
          level: "All Levels",
          duration: "30 minutes",
          includes: ["Range balls", "Putting green", "Club rental"],
          priceDisplay: "500 DHS all in",
        },
        {
          id: "golf-nine",
          name: "Nine Holes, Guided",
          meaning: "A guide on the bag for the front nine",
          level: "All Levels",
          duration: "Nine holes",
          includes: ["Guiding on the course for nine holes"],
          priceDisplay: "45€",
        },
        {
          id: "golf-eighteen",
          name: "Eighteen Holes, Guided",
          meaning: "The full round with a guide alongside",
          level: "All Levels",
          duration: "Eighteen holes",
          includes: ["Guiding on the course for eighteen holes"],
          priceDisplay: "80€",
        },
      ],
    },
    {
      id: "surf-only",
      title: "Surf",
      note: "Coaching for people learning, guiding for people who already surf.",
      layout: "list",
      packages: [
        {
          id: "surf-group",
          name: "Group Surf Lesson",
          meaning: "Coached in a small group, the usual way in",
          level: "All Levels",
          duration: "One session",
          includes: [
            "Coaching in a small group",
            "Board and wetsuit",
            "Transfer to the spot working that day",
          ],
          priceDisplay: "40€ / person",
        },
        {
          id: "surf-private",
          name: "Private Surf Lesson",
          meaning: "One coach, one surfer",
          level: "All Levels",
          duration: "One session",
          includes: [
            "One-to-one coaching",
            "Board and wetsuit",
            "Transfer to the spot that suits your level",
          ],
          priceDisplay: "80€",
        },
        {
          id: "surf-guiding",
          name: "Surf Guiding",
          meaning: "For surfers who need the spot, not the lesson",
          level: "Intermediate",
          duration: "One session, up to three surfers",
          includes: [
            "A guide who reads the chart and picks the spot",
            "Transfer to the break",
            "Maximum three surfers",
          ],
          priceDisplay: "80€",
        },
        {
          id: "surf-coaching",
          name: "Surf Coaching",
          meaning: "Video and analysis for surfers working on something specific",
          level: "Intermediate",
          duration: "One session",
          includes: [
            "Coaching aimed at one thing you are trying to fix",
            "Board and wetsuit if you need them",
          ],
          priceDisplay: "80€ / person",
        },
      ],
    },
  ],

  pointsCopy: {
    eyebrow: "Where We Play",
    title: "One course and seven points, all inside an hour.",
    intro:
      "The course is fixed. Which point you surf is not — that is decided at the morning check, by the buoy rather than by us. Roughly in the order the coaches reach for them.",
    trackLabel: "The course and the surf breaks we use",
  },

  /**
   * Golf and surf in one list, deliberately.
   *
   * The Points track is where the brand's argument gets made structurally:
   * a course and seven breaks scrolling past in the same row says "one coast,
   * two sports" more convincingly than any sentence in the manifesto does.
   */
  spots: [
    {
      id: "tazegzout-golf",
      discipline: "golf",
      name: "Tazegzout Golf Course",
      level: "All Levels",
      holes: 18,
      plays: "Cliff-top, Atlantic in play",
      /** TO CONFIRM — drive time from the meeting point was not supplied. */
      minutesAway: 5,
      note: "Eighteen holes cut into the hillside above Taghazout Bay, with the ocean open behind the greens on the seaward holes and arid scrub and cactus off the fairways. Wind off the Atlantic is the defence; it gets up through the day, which is the argument for an early tee time.",
    },
    {
      id: "anchor-point",
      discipline: "surf",
      name: "Anchor Point",
      hand: "Right",
      level: "Advanced",
      minutesAway: 5,
      worksOn: "NW 2–4m, 12s+",
      note: "The wave that put this coast on the map. Four sections, and on the right day it joins them all the way to the boulders. Crowded by eight — which is why the vans leave at six.",
    },
    {
      id: "panoramas",
      discipline: "surf",
      name: "Panoramas",
      hand: "Right",
      level: "Intermediate",
      minutesAway: 7,
      worksOn: "NW 1–2.5m, any period",
      note: "Softer point break over sand and rock, between Taghazout and Tamraght. Where most of our coaching happens. Forgiving take-off, long wall, easy paddle back.",
    },
    {
      id: "banana",
      discipline: "surf",
      name: "Banana Point",
      hand: "Right",
      level: "Beginner",
      minutesAway: 11,
      worksOn: "NW 0.8–2m, low tide",
      note: "Where first-timers stand up, below Aourir. Sandy bottom, slow shoulder, and the plantations behind it that give it the name.",
    },
    {
      id: "boilers",
      discipline: "surf",
      name: "Boilers",
      hand: "Right",
      level: "Advanced",
      minutesAway: 14,
      worksOn: "NW 2–4m, high tide",
      note: "Fast reef wave over urchins, marked by the rusted boiler of a wrecked ship. Boots on. Not a beginner's wave on any day of the year.",
    },
    {
      id: "imi-ouaddar",
      discipline: "surf",
      name: "Imi Ouaddar",
      hand: "Right",
      level: "Intermediate",
      minutesAway: 20,
      worksOn: "NW 1–3m, mid tide",
      note: "Point and beach break sharing one bay, twenty minutes north. Half the crowd of Taghazout for two thirds of the wave, and the fish at the village is the reason to stay past the session.",
    },
    {
      id: "tamri",
      discipline: "surf",
      name: "Tamri",
      hand: "Right",
      level: "Advanced",
      minutesAway: 35,
      worksOn: "NW 2.5–5m, low to mid",
      note: "The river mouth that holds size when everything south of it has closed out. Cold, exposed, and the first place we look when the chart turns properly dark.",
    },
    {
      id: "imsouane",
      discipline: "surf",
      name: "Imsouane",
      hand: "Right",
      level: "Beginner",
      minutesAway: 70,
      worksOn: "NW 1–3m, all tides",
      note: "The Bay — arguably the longest ride in Morocco. An hour and a bit north, so we go when the forecast earns it and we make a day of it.",
    },
  ],

  dayCopy: {
    eyebrow: "A Day",
    title: "The tee sheet and the buoy write the timetable.",
    intro:
      "Four parts to a combined day, and only the order is fixed. Which half comes first is decided on the morning — the wind is usually the deciding vote.",
    footnote:
      "Order moves with the conditions · we confirm the shape of your day the evening before",
  },

  day: [
    {
      marker: "Early",
      title: "Tee time & wave check",
      body: "Out on the course while the air is still cool and the wind is still off the land. Somebody reads the swell, the period and the wind at the same time, because that is what decides where the afternoon happens.",
    },
    {
      marker: "Mid-Day",
      title: "The round, or the range",
      body: "Nine or eighteen with a guide alongside, or half an hour on the range and the putting green if you are here for the shorter combination. Clubs are provided either way.",
    },
    {
      marker: "Afternoon",
      title: "The session",
      body: "Transfer to whichever point suits your level on the day. Boards and wetsuits are handed out before you leave — you carry nothing to the beach but yourself.",
    },
    {
      marker: "Evening",
      title: "Down tools",
      body: "The wind is usually up by now and the water has done what it was going to do. Most people are done. Anyone who is not gets the second session, if the chart says it is worth it.",
    },
  ],

  table: {
    eyebrow: "Two Worlds",
    statement: "One coast that happens to be good at two things.",
    body: [
      "Golf and surf are not obviously the same holiday. One is early, quiet and precise; the other is loud, cold and largely outside your control. What they share here is the Atlantic — the same swell that makes the points work is the wind that defends the course, and the same morning decides both.",
      "That is the whole business case. Nobody flies to Taghazout to do one thing badly. The combined days exist so that the half of your trip you did not plan for turns out to be the half you talk about.",
    ],
    photo: {
      id: "the-green",
      direction:
        "A putt on a cut green, pin in, the arid hillside rising behind it. Low sun raking across the grass so the mown lines read against everything unwatered around them.",
      tone: "fairway",
      ratio: "16/9",
    },
    facts: [
      { label: "Course", value: "18 holes" },
      { label: "To the water", value: "20 min" },
    ],
  },

  enquire: {
    eyebrow: "Book",
    title: "Tell us your dates. We answer the same day.",
    body: "Say how many of you there are, which half you are confident about, and whether anyone has stood on a board or held a club before. We will tell you honestly which combination fits and what the swell tends to do that week.",
    notes: [
      {
        label: "Where we are",
        body: "Taghazout, on the Souss coast. Agadir Al Massira (AGA) is about an hour by road.",
      },
      {
        label: "What to bring",
        body: "Nothing for the water — board, wetsuit and transfer are included. Clubs can be provided; bring your own if you are particular.",
      },
      {
        label: "Best season",
        body: "October to March for swell. The course plays year round and is at its best early.",
      },
    ],
  },
};
