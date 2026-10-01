/* ==========================================================================
   Pranali Space — frontend v1
   No framework. GSAP + ScrollTrigger are optional: everything below degrades
   to a static, fully readable page if they are missing.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- data */

  // Left to right, as drawn. Space (the spiral) sits in the middle and is the
  // default. `num` is the source image; swap to .svg in iconSrc() only.
  //
  // These tint the element surfaces only — the travelling mark, the stage
  // wash, the rail — not the site chrome, which follows the brand palette in
  // css/styles.css. Earth is the brand Tree Green and Space the brand
  // Burgundy; Air and Fire are deepened from their original tones so the
  // selected element's label still clears 4.5:1 on the warm backgrounds.
  var ELEMENTS = [
    {
      id: "air", num: 1, name: "Air", sanskrit: "वायु", roman: "Vayu",
      accent: "#4a6b76", accentSoft: "#e4edf0",   // deepened to stay legible at label size
      lead: "Breath, voice and movement — language, music and everything that travels between us."
    },
    {
      id: "fire", num: 2, name: "Fire", sanskrit: "अग्नि", roman: "Agni",
      accent: "#a8441f", accentSoft: "#f7e6dc",   // deepened to stay legible at label size
      lead: "Transformation and refusal — the heat of justice, and the courage a changing climate asks of us."
    },
    {
      id: "space", num: 3, name: "Space", sanskrit: "आकाश", roman: "Akasha",
      accent: "#763939", accentSoft: "#f0e7e2",
      lead: "The pause between things — silence, spirit, and the room a community needs to become itself."
    },
    {
      id: "water", num: 4, name: "Water", sanskrit: "जल", roman: "Jal",
      accent: "#2f6b8f", accentSoft: "#e2ecf3",
      lead: "Flow, care and memory — rivers, monsoons, and the long patience of tending something alive."
    },
    {
      id: "earth", num: 5, name: "Earth", sanskrit: "पृथ्वी", roman: "Prithvi",
      accent: "#0f5e36", accentSoft: "#e2ece7",   // the brand Tree Green
      lead: "Soil, seed and belonging — land, food, and the knowledge held by the people who stay."
    }
  ];

  var DEFAULT_ID = "space";
  var STORE_KEY = "pranali:element";

  /* ------------------------------------------------------------- helpers */

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // Single place where the icon file is named — swap to .svg here later.
  function iconSrc(el) { return "images/" + el.num + ".png"; }

  // Masks are set inline (not via a CSS variable) so the path resolves against
  // the document rather than against css/styles.css.
  function paintIcon(node, el) {
    var url = "url('" + iconSrc(el) + "')";
    node.style.webkitMaskImage = url;
    node.style.maskImage = url;
  }

  function byId(id) {
    for (var i = 0; i < ELEMENTS.length; i++) {
      if (ELEMENTS[i].id === id) return ELEMENTS[i];
    }
    return null;
  }

  function readStored() {
    try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function writeStored(id) {
    try { window.localStorage.setItem(STORE_KEY, id); } catch (e) { /* private mode */ }
  }

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------- the two element rows */

  var rows = [
    { node: $("#elementRow"),     buttons: [] },   // big, in the stage
    { node: $("#elementRailRow"), buttons: [] }    // the fixed rail on the left
  ];

  function buildRow(row) {
    var frag = document.createDocumentFragment();

    ELEMENTS.forEach(function (el) {
      var li = document.createElement("li");
      li.setAttribute("role", "presentation");

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "element-btn";
      btn.dataset.element = el.id;
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", el.name + " — " + el.roman);
      btn.style.setProperty("--el-accent", el.accent);
      btn.innerHTML =
        '<span class="icon-mask"></span>' +
        '<span class="element-btn__label">' + el.name + "</span>" +
        '<span class="element-btn__dot"></span>';
      paintIcon(btn.firstChild, el);

      btn.addEventListener("click", function () { select(el.id, true); });

      li.appendChild(btn);
      frag.appendChild(li);
      row.buttons.push(btn);
    });

    row.node.appendChild(frag);

    // left/right arrows move through the elements
    row.node.addEventListener("keydown", function (ev) {
      var i = row.buttons.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") next = (i + 1) % row.buttons.length;
      if (ev.key === "ArrowLeft"  || ev.key === "ArrowUp")   next = (i - 1 + row.buttons.length) % row.buttons.length;
      if (ev.key === "Home")       next = 0;
      if (ev.key === "End")        next = row.buttons.length - 1;
      if (next === null) return;
      ev.preventDefault();
      row.buttons[next].focus();
      select(ELEMENTS[next].id, true);
    });
  }

  // the big row is what the travelling mark flies out of
  function stageButton(id) {
    return rows[0].buttons[ELEMENTS.indexOf(byId(id))];
  }

  /* ---------------------------------------------------------- the filter */

  var filterNote = $("#filterNote");
  var filterables = [];

  function applyFilter(el) {
    filterables.forEach(function (node) {
      var tags = (node.dataset.element || "").split(/\s+/);
      node.classList.toggle("is-dimmed", tags.indexOf(el.id) === -1);
    });

    var shown = filterables.filter(function (n) { return !n.classList.contains("is-dimmed"); }).length;
    filterNote.innerHTML =
      "Showing the <strong>" + el.name + "</strong> strand — " + shown +
      " of " + filterables.length + " entries.";

    var reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "Show everything";
    reset.addEventListener("click", clearFilter);
    filterNote.appendChild(reset);
  }

  function clearFilter() {
    filterables.forEach(function (n) { n.classList.remove("is-dimmed"); });
    filterNote.textContent = "All strands showing. Pick an element above to narrow the weave.";
  }

  /* ----------------------------------------------------------- the stage */

  var stageMark     = $("#stageMark");
  var stageSlot     = $("#stageSlot");
  var stageCopy     = $("#stageCopy");
  var stageName     = $("#stageName");
  var stageLead     = $("#stageLead");
  var stageSanskrit = $("#stageSanskrit");

  var current = null;
  var ghostActive = false;         // true once the scroll animation owns the mark
  var onSelectionChange = null;    // set by initMotion()

  function select(id, remember) {
    var el = byId(id);
    if (!el || (current && current.id === id)) return;
    current = el;

    // theme
    var root = document.documentElement;
    root.style.setProperty("--accent", el.accent);
    root.style.setProperty("--accent-soft", el.accentSoft);
    root.dataset.activeElement = el.id;   // not `data-element` — that marks filterable cards

    // both rows
    rows.forEach(function (row) {
      row.buttons.forEach(function (b) {
        var on = b.dataset.element === el.id;
        b.setAttribute("aria-pressed", String(on));
        if (row === rows[0]) b.classList.toggle("is-ghosted", on && ghostActive);
      });
    });

    // the travelling mark
    paintIcon(stageMark, el);
    stageCopy.classList.add("is-swapping");
    window.setTimeout(function () {
      stageSanskrit.textContent = el.sanskrit + " · " + el.roman;
      stageName.textContent = el.name;
      stageLead.textContent = el.lead;
      stageCopy.classList.remove("is-swapping");
    }, reduceMotion ? 0 : 180);

    applyFilter(el);
    if (remember) writeStored(el.id);
    if (onSelectionChange) onSelectionChange();
  }

  /* -------------------------------------------------------------- motion */

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
      document.body.classList.add("no-motion");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ghostActive = true;

    // Where the mark starts: exactly over the chosen icon in the big row.
    // Measured with its own transform cleared, so the numbers are a plain
    // slot → strip-icon delta that stays valid for the whole pinned section
    // (both live inside the same sticky pin).
    var from = { x: 0, y: 0, scale: 0.2 };
    var flight = { t: 0 };   // 0 = still in the row, 1 = landed in its slot

    function placeMark() {
      var k = flight.t;
      gsap.set(stageMark, {
        x: from.x * (1 - k),
        y: from.y * (1 - k),
        scale: from.scale + (1 - from.scale) * k,
        opacity: 1
      });
    }

    function measure() {
      var btn = stageButton(current ? current.id : DEFAULT_ID);
      if (!btn) return;
      var target = btn.querySelector(".icon-mask");

      var saved = stageMark.style.transform;
      stageMark.style.transform = "none";
      var rest = stageMark.getBoundingClientRect();
      stageMark.style.transform = saved;

      var start = target.getBoundingClientRect();
      if (!rest.width || !start.width) return;

      from.scale = start.width / rest.width;
      from.x = (start.left + start.width / 2) - (rest.left + rest.width / 2);
      from.y = (start.top + start.height / 2) - (rest.top + rest.height / 2);
    }

    measure();
    placeMark();

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#stage",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        invalidateOnRefresh: true
      }
    });

    // 1. the four you did not choose drift up and go, and the captions with
    //    them. One number does all of it (see --fade in css/styles.css), so the
    //    rules stay selector-based and follow the choice even mid-scroll.
    tl.fromTo(".stage__pin", { "--fade": 0 },
      { "--fade": 1, duration: 3, ease: "power1.in" }, 0);

    // 2. the mark leaves the row, drifts to the middle and grows into its place.
    //    We tween a bare 0→1 and place the mark ourselves, so the flight path is
    //    read live from `from` — pick a different element halfway down and it
    //    simply re-aims instead of carrying stale start values.
    tl.to(flight, {
      t: 1, duration: 6, ease: "power2.inOut", onUpdate: placeMark
    }, 0);

    tl.fromTo(".stage__tint", { opacity: 0 }, { opacity: 1, duration: 4.5, ease: "none" }, 0);

    // 3. it holds there while the words rise underneath
    tl.fromTo(stageCopy,
      { opacity: 0, y: 34 },
      { opacity: 1, y: 0, duration: 2.4, ease: "power2.out" }, 5.4);

    // 4. a beat of stillness before the page moves on (timeline runs to 10)
    tl.to({}, { duration: 2, ease: "none" }, 8);

    // re-aim the flight path whenever the geometry or the choice changes
    ScrollTrigger.addEventListener("refreshInit", function () { measure(); placeMark(); });
    onSelectionChange = function () { measure(); placeMark(); };

    // gentle reveals for everything below the stage — one trigger each (rather
    // than a batch) so anything already scrolled past still ends up visible
    var reveals = $$(".section__head, .intro__body, .thread, .listing__item, .note, .join__form");
    reveals.forEach(function (node) {
      node.classList.add("reveal");
      ScrollTrigger.create({
        trigger: node,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(node, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", overwrite: true });
        }
      });
    });

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* Nav, anchor scrolling and the member badge now live in js/site.js, so the
     other pages get them too — PranaliSite.init() below wires them up here. */

  // keeps the stage centred in the space left under the header and the chooser
  function trackHeights() {
    var header = $(".site-header");
    var chooser = $("#stageChooser");
    var set = function () {
      var root = document.documentElement;
      root.style.setProperty("--header-h", header.offsetHeight + "px");
      root.style.setProperty("--chooser-h", chooser.offsetHeight + "px");
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };
    set();
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(set);
      ro.observe(header);
      ro.observe(chooser);
    }
    window.addEventListener("resize", set);
  }

  /* The left rail shows from the intro onwards.

     This reads the intro's position on scroll rather than using an
     IntersectionObserver: an observer only fires when the intersection state
     *changes*, so jumping straight from the footer back to the top (an anchor
     link, or a restored scroll position) never fires at all and leaves the
     rail stuck open. A rAF-throttled scroll check is always right, whichever
     way you arrived. Plain DOM, so it also works with GSAP absent or motion
     reduced — the rail is navigation, not decoration. */
  function initRail() {
    var rail = $("#elementRail");
    var intro = $("#intro");
    if (!rail || !intro) return;

    var queued = false;

    function update() {
      queued = false;
      var top = intro.getBoundingClientRect().top;
      document.body.classList.toggle("rail-on", top < window.innerHeight * 0.7);
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  function initForm() {
    var form = $("#joinForm");
    var note = $("#formNote");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      note.textContent = "Noted — the backend isn't wired yet, so nothing was sent.";
    });
  }

  /* ---------------------------------------------------------------- boot */

  rows.forEach(buildRow);
  filterables = $$("[data-element]").filter(function (n) { return !n.classList.contains("element-btn"); });
  clearFilter();
  PranaliSite.init();
  initForm();
  initRail();
  initMotion();
  trackHeights();
  select(readStored() || DEFAULT_ID, false);
})();
