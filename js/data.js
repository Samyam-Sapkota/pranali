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

   NOTE ON THE COMPASS: the brief's text states Earth = West and Fire = South
   twice, but the mandala image on page 3 shows them the other way round. We
   follow the text. If that is wrong, swap the two `direction` values here and
   nothing else needs to change — the hero reads placement from this field.

   The accents tint the element surfaces only (the marks, the stage wash, the
   rail), not the site chrome, which follows the brand palette. Earth is the
   brand Tree Green and Space the brand Burgundy; Air and Fire are deepened
   from their original tones so a selected label clears 4.5:1 on warm panels.
   ========================================================================== */

var PRANALI_ELEMENTS = [
  {
    id: "earth", num: 5, name: "Earth", sanskrit: "पृथ्वी", roman: "Bhumi",
    direction: "West", principle: "Equanimity, value and distribution",
    accent: "#0f5e36", accentSoft: "#e2ece7",
    lead: "Soil, seed and belonging — land, food, and the knowledge held by the people who stay."
  },
  {
    id: "water", num: 4, name: "Water", sanskrit: "जल", roman: "Jal",
    direction: "East", principle: "Fluidity, grounding and clarity with depth and stillness",
    accent: "#2f6b8f", accentSoft: "#e2ecf3",
    lead: "Flow, care and memory — rivers, monsoons, and the long patience of tending something alive."
  },
  {
    id: "space", num: 3, name: "Space", sanskrit: "आकाश", roman: "Akasha",
    direction: "Centre", principle: "Whole, interconnectedness and openness for emergence",
    accent: "#763939", accentSoft: "#f0e7e2",
    lead: "The pause between things — silence, spirit, and the room a community needs to become itself."
  },
  {
    id: "fire", num: 2, name: "Fire", sanskrit: "अग्नि", roman: "Agni",
    direction: "South", principle: "Perception, reception and relationships",
    accent: "#a8441f", accentSoft: "#f7e6dc",
    lead: "Transformation and refusal — the heat of justice, and the courage a changing climate asks of us."
  },
  {
    id: "air", num: 1, name: "Air", sanskrit: "वायु", roman: "Vayu",
    direction: "North", principle: "Ideas to completion, compassion in motion",
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
    status: "in development"
  },
  {
    element: "earth", kind: "hub",
    title: "Regenerate Landscape",
    blurb: "Design, strategic planning and implementation of regenerative farm landscapes and living agricultural systems.",
    status: "in development"
  },
  {
    element: "water", kind: "hub",
    title: "Ecological Courses",
    blurb: "Online and infield educational modules covering multispecies living, regenerative agriculture and indigenous practices.",
    href: "courses.html", cta: "Browse the courses"
  },
  {
    element: "water", kind: "hub",
    title: "Publications",
    blurb: "Educational manuals, books, newsletters and video series advocating for multispecies justice.",
    status: "in development"
  },
  {
    element: "space", kind: "arm",
    title: "Access & Membership",
    blurb: "The infrastructure underneath everything else — what is open to all, and what membership opens.",
    href: "courses.html#pricing", cta: "See what membership opens"
  },
  {
    element: "fire", kind: "hub",
    title: "Gatherings & Workshops",
    blurb: "Community dining experiences, seasonal brunches, ecological events, and venue rental of the physical space.",
    href: "#gatherings", cta: "What is coming"
  },
  {
    element: "fire", kind: "hub",
    title: "Retreats & Festivals",
    blurb: "Immersive ecology retreats and seasonal festivals hosted across diverse ecological venues in Nepal.",
    href: "#gatherings", cta: "What is coming"
  },
  {
    element: "air", kind: "hub",
    title: "Policy and Action",
    blurb: "Collaborative initiatives with government bodies and urban planning entities for communal landscape projects.",
    status: "in development"
  },
  {
    element: "air", kind: "arm",
    title: "Projects and Activism",
    blurb: "Farmfit, and campaigning around Pancha Pranali.",
    status: "in development"
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
