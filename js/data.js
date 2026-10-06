/* ==========================================================================
   Pranali Space — shared content data
   Plain globals, no modules, so every page can just <script src> this.
   ========================================================================== */

var PRANALI_CATEGORIES = [
  { id: "indigenous", name: "Indigenous & local knowledge",
    blurb: "Seed keepers, weavers, herbalists and oral historians teaching on their own terms." },
  { id: "land", name: "Relationships with land & nature",
    blurb: "Learning a place by the life it can still hold — watersheds, soil, seasons." },
  { id: "food", name: "Food & agricultural traditions",
    blurb: "Millets, ferments, monsoon cooking and the politics of the plate." },
  { id: "spirit", name: "Spirituality & ecological thinking",
    blurb: "Practice without sales pitch, and the long argument about what a self is." },
  { id: "community", name: "Community & collective living",
    blurb: "How people actually hold things in common, and what it costs them." }
];

/* ==========================================================================
   The five elements — Pancha Pranali
   --------------------------------------------------------------------------
   Order and compass directions are the brief's: Earth, Water, Space, Fire,
   Air. `num` is the source image; the CEO's own labelled key confirms the
   mapping (1 Air, 2 Fire, 3 Space, 4 Water, 5 Earth).

   NOTE ON THE COMPASS: the brief's text states Earth = West and Fire = South,
   but the mandala drawing shows them the other way round, and the drawing is
   what we follow — confirmed with the client. Air = North and Water = East
   are the same in both. `briefDirection` keeps the written version for the
   section headings under the hero, which quote the brief's text. Swapping these two `direction` values is all it takes
   to go back to the written version; the hero reads placement from this field
   and nothing else depends on it.

   The accents tint the element surfaces only (the marks, the stage wash, the
   rail), not the site chrome, which follows the brand palette. Earth is the
   brand Tree Green and Space the brand Burgundy; Air and Fire are deepened
   from their original tones so a selected label clears 4.5:1 on warm panels.
   ========================================================================== */

var PRANALI_ELEMENTS = [
  {
    id: "earth", num: 5, name: "Earth", sanskrit: "पृथ्वी", roman: "Bhumi",
    direction: "South", principle: "Equanimity, value and distribution",
    briefDirection: "West",
    accent: "#0f5e36", accentSoft: "#e2ece7",
    lead: "Soil, seed and belonging — land, food, and the knowledge held by the people who stay."
  },
  {
    id: "water", num: 4, name: "Water", sanskrit: "जल", roman: "Jal",
    direction: "East", principle: "Fluidity, grounding and clarity with depth and stillness",
    briefDirection: "East",
    accent: "#2f6b8f", accentSoft: "#e2ecf3",
    lead: "Flow, care and memory — rivers, monsoons, and the long patience of tending something alive."
  },
  {
    id: "space", num: 3, name: "Space", sanskrit: "आकाश", roman: "Akasha",
    direction: "Centre", principle: "Whole, interconnectedness and openness for emergence",
    briefDirection: "Centre",
    accent: "#763939", accentSoft: "#f0e7e2",
    lead: "The pause between things — silence, spirit, and the room a community needs to become itself."
  },
  {
    id: "fire", num: 2, name: "Fire", sanskrit: "अग्नि", roman: "Agni",
    direction: "West", principle: "Perception, reception and relationships",
    briefDirection: "South",
    /* The drawing has this mark turned around from how the labelled key on
       page 4 shows it: the sparse side to the left, the mass up and to the
       right. Applied in the mandala only, so the key's orientation still
       stands everywhere else. */
    mandalaRotate: 180,
    accent: "#a8441f", accentSoft: "#f7e6dc",
    lead: "Transformation and refusal — the heat of justice, and the courage a changing climate asks of us."
  },
  {
    id: "air", num: 1, name: "Air", sanskrit: "वायु", roman: "Vayu",
    direction: "North", principle: "Ideas to completion, compassion in motion",
    briefDirection: "North",
    accent: "#4a6b76", accentSoft: "#e4edf0",
    lead: "Breath, voice and movement — language, music and everything that travels between us."
  }
];

/* ==========================================================================
   Knowledge hubs and operational arms, under the five elemental pillars
   Seven hubs plus two operational arms (Access & Membership, and Projects
   and Activism), which is how the brief's nine entries reconcile with its
   "7 core knowledge hubs and operational arms".
   ========================================================================== */

var PRANALI_HUBS = [
  {
    element: "earth", kind: "hub",
    title: "Sustainable Product Ecosystem",
    blurb: "An e-commerce space for earth-aligned food products, organic clothing and circular home appliances.",
    status: "The shop is not open yet"
  },
  {
    element: "earth", kind: "hub",
    title: "Regenerate Landscape",
    blurb: "Design, strategic planning and implementation of regenerative farm landscapes and living agricultural systems.",
    status: "Commissions are not listed yet"
  },
  {
    element: "water", kind: "hub",
    title: "Ecological Courses",
    blurb: "Online and infield educational modules covering multispecies living, regenerative agriculture and indigenous practices.",
    href: "courses.html", cta: "Browse the courses",
    items: [
      { meta: "Feb 2027 \u00b7 Online \u00b7 6 weeks",
        title: "Mother Tongue Studio",
        blurb: "A writing cohort in Nepali, Bangla, Tamil and Urdu. Translate nothing until week five." }
    ]
  },
  {
    element: "water", kind: "hub",
    title: "Publications",
    blurb: "Educational manuals, books, newsletters and video series advocating for multispecies justice.",
    items: [
      { meta: "Essay \u00b7 9 min",
        title: "The seed is not a museum piece",
        blurb: "On why \u201ctraditional variety\u201d is the wrong phrase for something still being invented every season." },
      { meta: "Report \u00b7 14 min",
        title: "Notes from a delta that keeps moving",
        blurb: "Three villages, one embankment, and the arithmetic of who gets to stay." },
      { meta: "Conversation \u00b7 22 min",
        title: "What silence is for",
        blurb: "A teacher who refuses the word \u201cmindfulness\u201d explains what she teaches instead." },
      { meta: "Letter \u00b7 5 min",
        title: "Writing in the language you dream in",
        blurb: "A note to the cohort about why we are not translating anything for six weeks." }
    ]
  },
  {
    element: "space", kind: "arm",
    title: "Access & Membership",
    blurb: "The infrastructure underneath everything else: what is open to all, and what membership opens.",
    href: "courses.html#pricing", cta: "See what membership opens"
  },
  {
    element: "fire", kind: "hub",
    title: "Gatherings & Workshops",
    blurb: "Community dining experiences, seasonal brunches, ecological events, and venue rental of the physical space.",
    items: [
      { meta: "Oct 2026 \u00b7 Kathmandu Valley \u00b7 3 days",
        title: "The Millet Table",
        blurb: "Three days of cooking, seed exchange and argument with growers from Jumla, Bihar and the Deccan." },
      { meta: "Jan 2027 \u00b7 Dhaka \u00b7 2 days",
        title: "Who Pays for the Flood",
        blurb: "An open assembly on loss, damage and delta futures. Organisers, insurers, farmers and journalists in one room." }
    ]
  },
  {
    element: "fire", kind: "hub",
    title: "Retreats & Festivals",
    blurb: "Immersive ecology retreats and seasonal festivals hosted across diverse ecological venues in Nepal.",
    items: [
      { meta: "Nov 2026 \u00b7 Brahmaputra \u00b7 6 days",
        title: "Walking a River Backwards",
        blurb: "A slow upstream walk with boatmen, hydrologists and two poets. Notebooks essential, opinions optional." },
      { meta: "Dec 2026 \u00b7 Pokhara \u00b7 8 days",
        title: "Silence Retreat: Akasha",
        blurb: "Eight days of near-silence, breath practice and shared meals." },
      { meta: "Mar 2027 \u00b7 Sikkim \u00b7 5 days",
        title: "Apprentice to a Forest",
        blurb: "Five days with herbalists and forest-dwelling families, learning what a canopy asks of the people beneath it." }
    ]
  },
  {
    element: "air", kind: "hub",
    title: "Policy and Action",
    blurb: "Collaborative initiatives with government bodies and urban planning entities for communal landscape projects.",
    status: "Current collaborations are not published yet"
  },
  {
    element: "air", kind: "arm",
    title: "Projects and Activism",
    blurb: "Farmfit, and campaigning around Pancha Pranali.",
    status: "Campaign pages are still being written"
  }
];

function pranaliElementById(id) {
  for (var i = 0; i < PRANALI_ELEMENTS.length; i++) {
    if (PRANALI_ELEMENTS[i].id === id) return PRANALI_ELEMENTS[i];
  }
  return null;
}

function pranaliHubsFor(elementId) {
  return PRANALI_HUBS.filter(function (h) { return h.element === elementId; });
}

/* ==========================================================================
   Access & membership
   --------------------------------------------------------------------------
   The brief defines one Member tier against a Free Public tier, across four
   content areas — not the two paid tiers this prototype first carried.

   The brief names no price. $19/month billed annually at $190 is carried
   forward from the earlier spec and still needs the CEO's confirmation.
   ========================================================================== */

var PRANALI_ACCESS = [
  {
    area: "Advocacy & Publications",
    free: "Public newsletters, media clips and core manifestos",
    member: "Full downloads of educational manuals, research papers and books"
  },
  {
    area: "Courses & Learning",
    free: "Introductory course previews and syllabus overviews",
    member: "Unrestricted access to full infield and online learning modules"
  },
  {
    area: "Events & Gatherings",
    free: "Public event calendars and civic project summaries",
    member: "Priority booking for dining events, seasonal retreats and festivals"
  },
  {
    area: "Services & Consultations",
    free: "Overview of consulting frameworks",
    member: "Direct portal for consultation enquiries and project onboarding"
  }
];

var PRANALI_PLANS = [
  {
    id: "member",
    name: "Member",
    monthly: 19,
    yearly: 190,
    summary: "Everything Pranali makes, and a seat in the room where it is argued about.",
    featured: true,
    includes: [
      "Full downloads of manuals, research papers and books",
      "Unrestricted infield and online learning modules",
      "Priority booking for dining events, retreats and festivals",
      "Direct portal for consultations and project onboarding",
      "Full community access, including regional circles"
    ]
  }
];


/* The one course that is always free and public — no login, no payment. */
var PRANALI_FREE_COURSE_ID = "reading-a-field";

var PRANALI_COURSES = [
  /* ---------------------------------------------- the free, public course */
  {
    id: "reading-a-field",
    title: "Reading a Field",
    subtitle: "An introduction to land literacy",
    category: "land",
    free: true,
    teacher: "Anjali Thapa",
    place: "Chitwan, Nepal",
    level: "Open to everyone",
    duration: "4 lessons · about 2 hours",
    image: "images/stock/land-demo-paddy.jpg",
    hero: "images/stock/land-demo-paddy-wide.jpg",
    imageAlt: "A farmer working a flooded rice paddy with a two-wheel tractor, palms along the far edge",
    blurb: "Stand at the edge of a field and learn to read it — water, soil, labour and season — before anyone tells you what it is worth.",
    about: [
      "Most of us were taught to look at farmland and see scenery. This course teaches you to see a working argument instead: about water, about who does which labour, about which season is being bet on, and about what the land is being asked to carry.",
      "It is deliberately short and deliberately free. It is the course we point people to when they ask what Pranali Space actually does — no account, no payment, no email required."
    ],
    modules: [
      {
        title: "What a field is actually telling you",
        length: "18 min",
        summary: "Bunds, slope, standing water and field edges — the first four things to look at, and what each one usually means.",
        body: "Walk to the highest point you can reach near any cultivated land and stay there for ten minutes before you form an opinion. You are looking for the shape of the water: where it enters, where it is held, and where it is allowed to leave. Almost every decision visible in a field follows from that one question.\n\nBunds — the low earth walls between plots — are the clearest handwriting on the land. Their height tells you how much water the plot is expected to hold. Their condition tells you how recently someone was responsible for them. Where bunds are wide enough to walk, they are also paths, which tells you the plot is visited often, probably daily.\n\nThe field edge is where you learn the most. A hard, clean edge against a road means land under pressure. A soft edge that fades into scrub, with trees left standing, usually means the boundary is old and socially settled — nobody is arguing about those metres."
      },
      {
        title: "Water, and who decides where it goes",
        length: "22 min",
        summary: "Irrigation as a social arrangement, not a piece of infrastructure. Following a channel upstream until you find the decision.",
        body: "An irrigation channel is a sentence written by whoever controls its head. Follow any channel upstream and you will arrive, sooner or later, at a person or a committee. That is the real technology.\n\nIn much of South Asia the arrangement is older than the state that now nominally regulates it. Rotational systems — where each household takes water for a fixed period in a fixed order — encode centuries of negotiation about fairness, and they break in predictable ways: when the rotation is long enough that the tail-enders' crop fails before their turn, when a pump lets someone opt out of the rotation entirely, and when the crop changes to something thirstier than the system was designed for.\n\nYour task for this lesson is to find one channel, walk it upstream as far as you are permitted, and write down where you had to stop and why."
      },
      {
        title: "Soil you can hold",
        length: "20 min",
        summary: "Three field tests you can do with your hands, a jar and some water — and how to read what they tell you.",
        body: "You do not need a laboratory to learn something useful about soil. You need your hands, a jar, water, and the willingness to be wrong.\n\nThe ribbon test: take a lump of moist soil and press it between thumb and forefinger into a ribbon. Sandy soil will not ribbon at all. Loam gives you two or three centimetres before it breaks. Heavy clay will run to five or more and feel slick. This tells you roughly how the soil will hold water and how it will behave when worked wet.\n\nThe jar test: fill a jar one-third with soil, top it with water, shake hard, and leave it overnight. Sand settles first, then silt, then clay, in visible bands. Measure them. The proportions matter far less than the fact that you now know them for a specific piece of ground.\n\nThe smell test is the one people dismiss and should not. Healthy soil smells of rain on stone — that is geosmin, produced by actinobacteria. Soil that smells sour, or of nothing at all, is telling you about its biology and about how it has been treated."
      },
      {
        title: "The season you are standing in",
        length: "16 min",
        summary: "Why the agricultural calendar rarely matches the printed one, and how to ask a better first question.",
        body: "Ask a farmer what month it is and you may get the month. Ask what season it is and you will get an answer with far more information in it — one keyed to the monsoon's arrival, to a festival, to the state of a particular crop rather than to a grid printed in an office.\n\nThis matters practically. The same field in the same week is a different proposition depending on whether the rains came early, on time, or not yet. Advice, policy and well-meaning outside intervention all tend to arrive on the printed calendar, which is one reason so much of it lands badly.\n\nA better opening question than \"what do you grow here\" is \"what are you waiting for right now\". It is a question about time rather than output, and it almost always produces a longer and more honest conversation.\n\nThat is the end of this short course. If it was useful, the rest of the library goes considerably deeper — but this one stays free, permanently, for anyone who wants it."
      }
    ]
  },

  /* ------------------------------------- Indigenous & local knowledge */
  {
    id: "seed-keepers",
    title: "Seed Keepers",
    subtitle: "Saving what was nearly lost",
    category: "indigenous",
    teacher: "Bimala Rai",
    place: "Jumla, Nepal",
    level: "Foundational",
    duration: "8 lessons · about 6 hours",
    image: "images/stock/seeds-soil.jpg",
    imageAlt: "Dark soil and seeds with a scoop, photographed from above",
    blurb: "With the growers who kept varieties alive through the decades nobody was counting — how selection actually works, and who pays for it.",
    modules: [
      { title: "A variety is not a museum piece", length: "40 min" },
      { title: "Selection as an annual argument", length: "45 min" },
      { title: "Storage: ash, oil, clay and cold", length: "38 min" },
      { title: "Who owns a seed that nobody bred", length: "52 min" },
      { title: "Seed exchanges and their unwritten rules", length: "41 min" },
      { title: "Working with a national gene bank", length: "47 min" },
      { title: "When a variety should be allowed to go", length: "35 min" },
      { title: "Starting a keeping practice where you are", length: "44 min" }
    ]
  },
  {
    id: "monsoon-oral-histories",
    title: "Oral Histories of the Monsoon",
    subtitle: "Listening as method",
    category: "indigenous",
    teacher: "Farhana Karim",
    place: "Sylhet, Bangladesh",
    level: "Intermediate",
    duration: "6 lessons · about 5 hours",
    image: "images/stock/valley-mist.jpg",
    imageAlt: "Mist moving through a green river valley at dawn",
    blurb: "How to record, hold and honour testimony about weather from people who have watched it change across sixty years.",
    modules: [
      { title: "Why the monsoon resists the archive", length: "42 min" },
      { title: "Consent, and what it means over decades", length: "50 min" },
      { title: "The interview that is not an interview", length: "46 min" },
      { title: "Transcription, translation, and what is lost", length: "55 min" },
      { title: "Returning the recording to the person", length: "38 min" },
      { title: "Building a community archive that survives you", length: "49 min" }
    ]
  },
  {
    id: "knowledge-in-cloth",
    title: "The Knowledge in Cloth",
    subtitle: "Weaving, dyeing and technical memory",
    category: "indigenous",
    teacher: "Devi Subramanian",
    place: "Kanchipuram, India",
    level: "Foundational",
    duration: "7 lessons · about 6 hours",
    image: "images/stock/craft-table.jpg",
    imageAlt: "Two people in conversation over a work table lined with books",
    blurb: "Textile as a technology with a memory — what a weaver knows that was never written down, and what happens when the loom stops.",
    modules: [
      { title: "Reading a cloth backwards", length: "44 min" },
      { title: "Indigo, madder, iron: chemistry without a lab", length: "58 min" },
      { title: "The apprenticeship that takes nine years", length: "41 min" },
      { title: "What a motif is allowed to mean", length: "39 min" },
      { title: "Power looms, and the honest version of that story", length: "52 min" },
      { title: "Pricing work that took a lifetime to learn", length: "47 min" },
      { title: "Commissioning well", length: "36 min" }
    ]
  },

  /* ------------------------------- Relationships with land & nature */
  {
    id: "walking-a-watershed",
    title: "Walking a Watershed",
    subtitle: "Six days upstream",
    category: "land",
    teacher: "Tenzin Norbu",
    place: "Brahmaputra basin",
    level: "Intermediate",
    duration: "9 lessons · about 8 hours",
    image: "images/stock/forest-walk.jpg",
    imageAlt: "A raised wooden walkway leading into dense forest",
    blurb: "A watershed is the only map that does not lie about consequence. Learn to walk one, read it, and argue with it.",
    modules: [
      { title: "Why the catchment is the real unit", length: "43 min" },
      { title: "Reading a river from its banks", length: "51 min" },
      { title: "Springs, and the people who tend them", length: "46 min" },
      { title: "Upstream, downstream, and blame", length: "54 min" },
      { title: "Embankments: the hundred-year mistake", length: "60 min" },
      { title: "Measuring flow with what you have", length: "38 min" },
      { title: "Fish, and what they tell you about everything else", length: "44 min" },
      { title: "The politics of a barrage", length: "57 min" },
      { title: "Planning a walk of your own", length: "35 min" }
    ]
  },
  {
    id: "soil-beneath-argument",
    title: "The Soil Beneath the Argument",
    subtitle: "Regeneration without the sales pitch",
    category: "land",
    teacher: "Anjali Thapa",
    place: "Chitwan, Nepal",
    level: "Intermediate",
    duration: "8 lessons · about 7 hours",
    image: "images/stock/seedlings.jpg",
    imageAlt: "Young maize seedlings pushing through dark tilled soil",
    blurb: "What the soil-health movement gets right, what it oversells, and how to tell the difference on your own ground.",
    modules: [
      { title: "Organic matter is not a moral category", length: "48 min" },
      { title: "Cover crops that actually fit a monsoon", length: "52 min" },
      { title: "Tillage: the argument in full", length: "56 min" },
      { title: "Compost at scale, and its real costs", length: "45 min" },
      { title: "Reading a soil test you did not order", length: "40 min" },
      { title: "Carbon claims and how to check them", length: "58 min" },
      { title: "Five years in: what actually changed", length: "43 min" },
      { title: "Advising someone else's land", length: "37 min" }
    ]
  },
  {
    id: "living-with-mountains",
    title: "Living With Mountains",
    subtitle: "Altitude, risk and staying put",
    category: "land",
    teacher: "Pema Lhamo",
    place: "Sikkim, India",
    level: "Foundational",
    duration: "6 lessons · about 5 hours",
    image: "images/stock/mountains.jpg",
    imageAlt: "Snow-capped mountains above a dark conifer forest",
    blurb: "Mountain communities are asked to move more often than anyone else. This is about what makes staying possible.",
    modules: [
      { title: "Slope, aspect and where a village sits", length: "41 min" },
      { title: "Landslides: reading the ground for warning", length: "53 min" },
      { title: "Terracing as a hundred-year contract", length: "46 min" },
      { title: "Glacial lakes and honest risk talk", length: "50 min" },
      { title: "Roads, and what they bring both ways", length: "44 min" },
      { title: "Relocation, consent and refusal", length: "48 min" }
    ]
  },

  /* ------------------------------ Food & agricultural traditions */
  {
    id: "millets-came-back",
    title: "Millets: The Grain That Came Back",
    subtitle: "From orphan crop to policy darling",
    category: "food",
    teacher: "Kavitha Reddy",
    place: "Deccan plateau, India",
    level: "Foundational",
    duration: "7 lessons · about 6 hours",
    image: "images/stock/grain-field.jpg",
    imageAlt: "A grain field at low sun, stalks catching the light",
    blurb: "Millets went from a grain nobody would admit to eating to a national mission in thirty years. Who did that work, and who is collecting on it.",
    modules: [
      { title: "Nine grains, and why we lump them together", length: "39 min" },
      { title: "The abandonment: what actually happened", length: "51 min" },
      { title: "Growing them: water, weeds and labour", length: "47 min" },
      { title: "Processing is the real bottleneck", length: "44 min" },
      { title: "Cooking millets so people want them", length: "42 min" },
      { title: "The policy turn, read sceptically", length: "55 min" },
      { title: "Buying in a way that reaches the grower", length: "36 min" }
    ]
  },
  {
    id: "ferments-subcontinent",
    title: "Ferments of the Subcontinent",
    subtitle: "Preservation as everyday science",
    category: "food",
    teacher: "Shirin Qureshi",
    place: "Hyderabad, India",
    level: "Open to everyone",
    duration: "6 lessons · about 5 hours",
    image: "images/stock/vegetables.jpg",
    imageAlt: "Bowls and heaps of fresh vegetables, chillies and roots on a dark surface",
    blurb: "Kanji, gundruk, idli batter, pickles that outlive their makers — the microbiology already running in your kitchen.",
    modules: [
      { title: "What is actually happening in the jar", length: "43 min" },
      { title: "Salt, acid, temperature: the three dials", length: "46 min" },
      { title: "Gundruk and the Himalayan sour", length: "40 min" },
      { title: "Batters: idli, dosa and the wild yeast question", length: "49 min" },
      { title: "Oil pickles and the long keep", length: "38 min" },
      { title: "When to throw it out", length: "31 min" }
    ]
  },
  {
    id: "monsoon-kitchen",
    title: "The Monsoon Kitchen",
    subtitle: "Cooking with a season, not against it",
    category: "food",
    teacher: "Farhana Karim",
    place: "Sylhet, Bangladesh",
    level: "Foundational",
    duration: "6 lessons · about 4 hours",
    image: "images/stock/dishes.jpg",
    imageAlt: "Several prepared dishes with herbs and chillies on a wooden table",
    blurb: "What you cook when the rain has been falling for eleven days, the market is thin, and everything wants to spoil.",
    modules: [
      { title: "The monsoon pantry", length: "37 min" },
      { title: "Bitter, sour and the logic of wet-season food", length: "44 min" },
      { title: "Cooking with flood-country fish", length: "48 min" },
      { title: "Greens that only exist for six weeks", length: "35 min" },
      { title: "Keeping things dry, keeping things alive", length: "40 min" },
      { title: "Feeding a house with the road cut off", length: "39 min" }
    ]
  },

  /* --------------------------- Spirituality & ecological thinking */
  {
    id: "silence-as-practice",
    title: "Silence as Practice",
    subtitle: "Without the word mindfulness",
    category: "spirit",
    teacher: "Ravi Menon",
    place: "Pokhara, Nepal",
    level: "Open to everyone",
    duration: "8 lessons · about 6 hours",
    image: "images/stock/meditation.jpg",
    imageAlt: "A person seated in meditation, silhouetted against low sun and palms",
    blurb: "A teacher who refuses the wellness vocabulary explains what he actually teaches, and what it is for.",
    modules: [
      { title: "Why the word gets in the way", length: "36 min" },
      { title: "Sitting: the boring, necessary part", length: "44 min" },
      { title: "Breath, without instruction", length: "41 min" },
      { title: "The lineages, honestly described", length: "58 min" },
      { title: "What practice does not fix", length: "47 min" },
      { title: "Silence in a house full of people", length: "39 min" },
      { title: "Retreat, and coming back badly", length: "45 min" },
      { title: "Keeping it up for thirty years", length: "42 min" }
    ]
  },
  {
    id: "spiral-and-circle",
    title: "The Spiral and the Circle",
    subtitle: "Cyclical time and ecological thought",
    category: "spirit",
    teacher: "Devi Subramanian",
    place: "Chennai, India",
    level: "Intermediate",
    duration: "7 lessons · about 6 hours",
    image: "images/stock/spiral-field.jpg",
    imageAlt: "Green hillside with a wide spiral pattern cut into the grass",
    blurb: "South Asian cosmologies are full of returning time. What happens when you take that seriously as an ecological position?",
    modules: [
      { title: "Linear progress and its costs", length: "50 min" },
      { title: "Yugas, seasons and the long return", length: "54 min" },
      { title: "Against nostalgia: the honest objection", length: "46 min" },
      { title: "Cyclical time in practical planning", length: "43 min" },
      { title: "Death, decay and soil", length: "48 min" },
      { title: "Ritual as an ecological instrument", length: "45 min" },
      { title: "Holding two cosmologies at once", length: "41 min" }
    ]
  },
  {
    id: "breath-body-biosphere",
    title: "Breath, Body, Biosphere",
    subtitle: "Practice that points outward",
    category: "spirit",
    teacher: "Pema Lhamo",
    place: "Gangtok, India",
    level: "Foundational",
    duration: "6 lessons · about 4 hours",
    image: "images/stock/yoga-group.jpg",
    imageAlt: "A group practising a standing balance posture together on a beach at dawn",
    blurb: "Embodied practice that ends somewhere other than the self — and the traditions that always intended it to.",
    modules: [
      { title: "The self was never the destination", length: "42 min" },
      { title: "Breath as exchange, not technique", length: "38 min" },
      { title: "Practising outdoors, seriously", length: "40 min" },
      { title: "Collective practice and its risks", length: "44 min" },
      { title: "When wellness culture borrowed this", length: "49 min" },
      { title: "Building a practice with a place", length: "36 min" }
    ]
  },

  /* ------------------------------- Community & collective living */
  {
    id: "running-a-commons",
    title: "Running a Commons",
    subtitle: "The unglamorous middle years",
    category: "community",
    teacher: "Tenzin Norbu",
    place: "Kathmandu Valley, Nepal",
    level: "Intermediate",
    duration: "9 lessons · about 8 hours",
    image: "images/stock/gathering.jpg",
    imageAlt: "A crowd gathered under strings of warm lights at an outdoor evening event",
    blurb: "Founding a commons is the easy part. This is about years three to fifteen, when the rules meet real people.",
    modules: [
      { title: "What a commons actually is", length: "45 min" },
      { title: "Boundaries, and why they are not a betrayal", length: "48 min" },
      { title: "Monitoring without policing", length: "52 min" },
      { title: "Graduated sanctions in practice", length: "50 min" },
      { title: "The free-rider conversation nobody wants", length: "47 min" },
      { title: "Money entering a commons", length: "56 min" },
      { title: "Succession: handing it on", length: "44 min" },
      { title: "When to dissolve it", length: "38 min" },
      { title: "Writing rules people will actually read", length: "41 min" }
    ]
  },
  {
    id: "grief-circles-repair-days",
    title: "Grief Circles and Repair Days",
    subtitle: "Structures for holding hard things",
    category: "community",
    teacher: "Shirin Qureshi",
    place: "Dhaka, Bangladesh",
    level: "Foundational",
    duration: "6 lessons · about 5 hours",
    image: "images/stock/circle-sunset.jpg",
    imageAlt: "A line of people standing arm in arm looking out at a bright horizon",
    blurb: "Two formats that ask very little and hold a great deal — how to run them, and how they fail.",
    modules: [
      { title: "Why a format helps", length: "38 min" },
      { title: "Facilitating a grief circle", length: "54 min" },
      { title: "Repair day: the practical version", length: "43 min" },
      { title: "Holding conflict inside the circle", length: "51 min" },
      { title: "The facilitator's own weight", length: "45 min" },
      { title: "When to send someone to a professional", length: "36 min" }
    ]
  },
  {
    id: "cooking-for-forty",
    title: "Cooking for Forty",
    subtitle: "The logistics of feeding a gathering",
    category: "community",
    teacher: "Kavitha Reddy",
    place: "Bengaluru, India",
    level: "Open to everyone",
    duration: "5 lessons · about 4 hours",
    image: "images/stock/shared-table.jpg",
    imageAlt: "A table laid with many shared dishes, bowls and plates seen from above",
    blurb: "Every collective eventually has to feed itself. The arithmetic, the fire, the washing up, and who ends up doing it.",
    modules: [
      { title: "The arithmetic of forty", length: "40 min" },
      { title: "Menus that survive being late", length: "38 min" },
      { title: "Fire, fuel and pot size", length: "42 min" },
      { title: "The washing-up problem is a power problem", length: "45 min" },
      { title: "Feeding people with restrictions, gracefully", length: "35 min" }
    ]
  }
];

/* --------------------------------------------------- member voices */

var PRANALI_TESTIMONIALS = [
  {
    quote: "I came for the millet course and stayed for the argument in the comments. Nobody here talks down to farmers, which I did not expect from something you open on a laptop.",
    name: "Sunita Gurung",
    role: "Grower and seed keeper",
    place: "Jumla, Nepal"
  },
  {
    quote: "The free course did its job. I watched all four lessons standing in my uncle's field, then paid for the year before I got home.",
    name: "Imran Chowdhury",
    role: "Agricultural extension officer",
    place: "Sylhet, Bangladesh"
  },
  {
    quote: "I teach environmental history and I have assigned three of these to my students. The oral history course is better than most methods training I have sat through.",
    name: "Dr Meera Nair",
    role: "Lecturer",
    place: "Kochi, India"
  },
  {
    quote: "What I value is the refusal to make everything uplifting. The commons course spends a whole lesson on when to dissolve the thing. That honesty is why I renewed.",
    name: "Tashi Dorji",
    role: "Community land trust organiser",
    place: "Thimphu, Bhutan"
  },
  {
    quote: "I asked for the reduced rate and someone wrote back the same week, as a person, with no forms. That told me more about this place than the course list did.",
    name: "Priya Raman",
    role: "Student",
    place: "Madurai, India"
  }
];

/* photographs for the scrolling strip (all local, all Unsplash licence) */
var PRANALI_MARQUEE = [
  { src: "images/stock/land-demo-paddy.jpg", alt: "A farmer working a flooded rice paddy" },
  { src: "images/stock/valley-mist.jpg",     alt: "Mist moving through a green river valley" },
  { src: "images/stock/gathering.jpg",       alt: "An evening gathering under warm lights" },
  { src: "images/stock/seedlings.jpg",       alt: "Maize seedlings in dark soil" },
  { src: "images/stock/forest-walk.jpg",     alt: "A wooden walkway into dense forest" },
  { src: "images/stock/shared-table.jpg",    alt: "A table laid with many shared dishes" },
  { src: "images/stock/spiral-field.jpg",    alt: "A spiral pattern cut into a green hillside" },
  { src: "images/stock/circle-sunset.jpg",   alt: "People standing arm in arm at a bright horizon" },
  { src: "images/stock/grain-field.jpg",     alt: "A grain field at low sun" },
  { src: "images/stock/mountains.jpg",       alt: "Snow-capped mountains above conifer forest" }
];

/* --------------------------------------------------------- helpers */

function pranaliCourseById(id) {
  for (var i = 0; i < PRANALI_COURSES.length; i++) {
    if (PRANALI_COURSES[i].id === id) return PRANALI_COURSES[i];
  }
  return null;
}

function pranaliCategoryById(id) {
  for (var i = 0; i < PRANALI_CATEGORIES.length; i++) {
    if (PRANALI_CATEGORIES[i].id === id) return PRANALI_CATEGORIES[i];
  }
  return null;
}

function pranaliPlanById(id) {
  for (var i = 0; i < PRANALI_PLANS.length; i++) {
    if (PRANALI_PLANS[i].id === id) return PRANALI_PLANS[i];
  }
  return null;
}

/* ==========================================================================
   The shop — Sustainable Product Ecosystem (Earth)
   --------------------------------------------------------------------------
   Demo stock until the backend supplies it. The shape is what the shop pages
   read, so a fetch that returns objects like these is a drop-in swap.

   Prices are in Nepali rupees. `image` is optional: anything without a real
   photograph renders as a typeset plate rather than borrowing a picture of
   something else.
   ========================================================================== */

var PRANALI_SHOP_CATEGORIES = [
  { id: "food",     name: "Food",             blurb: "Grown, milled and dried by people we know by name." },
  { id: "clothing", name: "Organic clothing", blurb: "Plant fibres, plant dyes, hand looms." },
  { id: "home",     name: "Circular home",    blurb: "Things that are repaired, returned and used again." }
];

var PRANALI_PRODUCTS = [
  /* ------------------------------------------------------------- food */
  {
    id: "kodo-millet-flour", category: "food",
    name: "Kodo millet flour", unit: "1 kg", price: 420,
    maker: "Karnali Grain Collective", origin: "Jumla, Nepal",
    image: "images/stock/grain-field.jpg",
    imageAlt: "A grain field at low sun, stalks catching the light",
    blurb: "Stone-milled in small batches from rain-fed kodo. Nutty, a little bitter, and the base of a proper dhindo.",
    details: ["Stone-milled within two weeks of packing", "Rain-fed, no synthetic inputs", "Paper bag, compostable liner"],
    stock: 34
  },
  {
    id: "heirloom-seed-kit", category: "food",
    name: "Monsoon seed kit", unit: "12 varieties", price: 950,
    maker: "Pranali seed library", origin: "Kathmandu Valley",
    image: "images/stock/seeds-soil.jpg",
    imageAlt: "Dark soil and seeds with a scoop, photographed from above",
    blurb: "Twelve open-pollinated varieties saved from our own spiral beds — beans, gourds, amaranth, mustard and marigold.",
    details: ["Open-pollinated, save your own next year", "Sowing notes in Nepali and English", "Return seed to the library at harvest"],
    stock: 18
  },
  {
    id: "gundruk", category: "food",
    name: "Gundruk", unit: "200 g", price: 380,
    maker: "Women’s group, Sindhupalchok", origin: "Sindhupalchok, Nepal",
    image: "images/stock/vegetables.jpg",
    imageAlt: "Bowls and heaps of fresh vegetables, chillies and roots",
    blurb: "Fermented and sun-dried mustard and radish greens. Sour, deep, and the reason winter soup tastes of anything.",
    details: ["Naturally fermented, no vinegar", "Sun-dried on bamboo racks", "Keeps a year, sealed and dry"],
    stock: 40
  },
  {
    id: "timur-pepper", category: "food",
    name: "Timur pepper", unit: "100 g", price: 290,
    maker: "Forest gatherers, Salyan", origin: "Salyan, Nepal",
    blurb: "Wild Himalayan Sichuan pepper, hand-picked and shade-dried. Citrus first, then the tingle.",
    details: ["Wild-harvested under a community forest plan", "Whole husks, seeds removed", "Grind just before use"],
    stock: 52
  },
  {
    id: "wild-honey", category: "food",
    name: "Cliff-forest honey", unit: "500 g", price: 1450,
    maker: "Chepang honey hunters", origin: "Chitwan hills, Nepal",
    blurb: "A dark, slow honey from wild colonies, harvested once a year and never heated.",
    details: ["Raw, unfiltered beyond a cloth", "One harvest a year, quantities vary", "Glass jar — return it for a refund"],
    stock: 9
  },
  {
    id: "jumli-marshi-rice", category: "food",
    name: "Jumli marshi rice", unit: "2 kg", price: 760,
    maker: "Karnali Grain Collective", origin: "Jumla, Nepal",
    blurb: "Red rice from some of the highest paddies in the world, grown in cold water at 2,500 metres.",
    details: ["Cold-tolerant landrace, unpolished", "Cooks in 35 minutes", "Cloth sack, reusable"],
    stock: 26
  },
  {
    id: "buckwheat", category: "food",
    name: "Tartary buckwheat", unit: "1 kg", price: 480,
    maker: "Mustang growers’ co-op", origin: "Mustang, Nepal",
    blurb: "Bitter buckwheat, roasted lightly for flatbreads and porridge. A crop that asks almost nothing of the soil.",
    details: ["Whole groats, lightly roasted", "High-altitude, rain-fed", "Paper bag"],
    stock: 31
  },
  {
    id: "seedling-tray", category: "food",
    name: "Kitchen-garden seedlings", unit: "tray of 24", price: 650,
    maker: "Pranali nursery", origin: "Kathmandu Valley",
    image: "images/stock/seedlings.jpg",
    imageAlt: "Young seedlings pushing through dark soil",
    blurb: "Whatever the season wants planted this fortnight, raised in our nursery. Collection from the garden only.",
    details: ["Varieties change with the season", "Collect from the Kathmandu garden", "Return the tray for the next batch"],
    stock: 12
  },

  /* --------------------------------------------------------- clothing */
  {
    id: "allo-shawl", category: "clothing",
    name: "Allo nettle shawl", unit: "180 × 70 cm", price: 4800,
    maker: "Weavers of Sankhuwasabha", origin: "Sankhuwasabha, Nepal",
    blurb: "Himalayan giant nettle, hand-spun and back-strap woven. Softens every year you wear it.",
    details: ["100% allo (Girardinia) fibre", "Undyed, natural oat colour", "Hand wash cold, dry flat"],
    stock: 7
  },
  {
    id: "hemp-shirt", category: "clothing",
    name: "Hemp work shirt", unit: "S – XL", price: 3600,
    maker: "Studio Dhaago", origin: "Lalitpur, Nepal",
    blurb: "A plain, heavy shirt for the garden and the city. Hemp grown without irrigation, stitched with cotton thread.",
    details: ["Himalayan hemp, hand-loomed", "Corozo nut buttons", "Free repairs for life"],
    stock: 15
  },
  {
    id: "khadi-kurta", category: "clothing",
    name: "Khadi kurta", unit: "S – XL", price: 2900,
    maker: "Charkha Collective", origin: "Janakpur, Nepal",
    blurb: "Hand-spun, hand-woven cotton, loose in the body and cool in the heat.",
    details: ["Hand-spun organic cotton", "Indigo or undyed", "Washes softer each time"],
    stock: 20
  },
  {
    id: "madder-scarf", category: "clothing",
    name: "Madder-dyed scarf", unit: "200 × 50 cm", price: 1900,
    maker: "Studio Dhaago", origin: "Lalitpur, Nepal",
    blurb: "Silk-cotton dyed in madder root and walnut hull. No two come out of the pot the same.",
    details: ["Plant dyes only, mordanted with alum", "Each piece varies in tone", "Hand wash, dry in shade"],
    stock: 11
  },
  {
    id: "wool-socks", category: "clothing",
    name: "Hand-knit wool socks", unit: "one size", price: 950,
    maker: "Knitting circle, Helambu", origin: "Helambu, Nepal",
    blurb: "Undyed highland sheep wool, knitted over a winter of evenings. Darnable, and we will show you how.",
    details: ["Undyed local wool", "Reinforced heel", "Darning thread included"],
    stock: 24
  },

  /* ----------------------------------------------------- circular home */
  {
    id: "clay-filter", category: "home",
    name: "Terracotta water filter", unit: "18 litres", price: 3200,
    maker: "Potters of Thimi", origin: "Bhaktapur, Nepal",
    blurb: "Two fired-clay vessels and a ceramic candle. No electricity, no plastic, and the clay keeps the water cool.",
    details: ["Ceramic candle replaceable", "Fired at the Thimi kilns", "Broken pieces go back to the clay"],
    stock: 6
  },
  {
    id: "copper-vessel", category: "home",
    name: "Hammered copper vessel", unit: "1.5 litres", price: 2700,
    maker: "Tamrakar workshop", origin: "Patan, Nepal",
    blurb: "Hand-beaten from reclaimed copper. Dents can be hammered out at the workshop for as long as it exists.",
    details: ["Reclaimed copper", "Re-tinning and repair offered", "Polish with lemon and ash"],
    stock: 10
  },
  {
    id: "refurb-pressure-cooker", category: "home",
    name: "Refurbished pressure cooker", unit: "5 litres", price: 1800,
    maker: "Repair Saturday", origin: "Kathmandu",
    blurb: "Donated, stripped, re-gasketed and tested. A good cooker should outlive the kitchen it started in.",
    details: ["New gasket, valve and weight", "Pressure-tested before sale", "Bring it back for parts, any time"],
    stock: 8
  },
  {
    id: "solar-dryer", category: "home",
    name: "Solar food dryer", unit: "flat-pack", price: 6500,
    maker: "Pranali workshop", origin: "Kathmandu Valley",
    blurb: "A pine-and-mesh cabinet for drying greens, chillies and fruit without fuel. Assembles with a screwdriver.",
    details: ["Untreated pine, steel mesh, glass", "Plans included so you can build the next one", "Replacement mesh sold separately"],
    stock: 4
  },
  {
    id: "compost-bin", category: "home",
    name: "Bamboo compost bin", unit: "120 litres", price: 2200,
    maker: "Bamboo makers, Dhading", origin: "Dhading, Nepal",
    blurb: "Woven bamboo with a loose lid. When it finally breaks down, it goes into the compost it held.",
    details: ["Untreated local bamboo", "Lasts three to four seasons", "Entirely compostable at end of life"],
    stock: 14
  },
  {
    id: "beeswax-wraps", category: "home",
    name: "Beeswax cloth wraps", unit: "set of 3", price: 850,
    maker: "Studio Dhaago offcuts", origin: "Lalitpur, Nepal",
    blurb: "Cotton offcuts from the shirt bench, coated in local beeswax and pine resin. Instead of cling film.",
    details: ["Made from workshop offcuts", "Rinse cool, re-wax yearly", "Compost when worn out"],
    stock: 30
  }
];

function pranaliProductById(id) {
  for (var i = 0; i < PRANALI_PRODUCTS.length; i++) {
    if (PRANALI_PRODUCTS[i].id === id) return PRANALI_PRODUCTS[i];
  }
  return null;
}

function pranaliShopCategoryById(id) {
  for (var i = 0; i < PRANALI_SHOP_CATEGORIES.length; i++) {
    if (PRANALI_SHOP_CATEGORIES[i].id === id) return PRANALI_SHOP_CATEGORIES[i];
  }
  return null;
}
