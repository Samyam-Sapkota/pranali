/* ==========================================================================
   Pranali Space — the home page
   The spiral bloom, the element rail, and the pillar list.
   GSAP is optional: without it (or under reduced motion) the mandala renders
   fully bloomed and everything stays usable.
   ========================================================================== */

(function () {
  "use strict";

  /* The elements, their order and their compass directions all live in
     js/data.js so the pillars and any other page read the same list. */
  var ELEMENTS = PRANALI_ELEMENTS;

  var DEFAULT_ID = "space";
  var STORE_KEY = "pranali:element";

  /* ------------------------------------------------------------- helpers */

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function iconSrc(el) { return "images/" + el.num + ".png"; }

  function paintIcon(node, el) {
    var url = "url('" + iconSrc(el) + "')";
    node.style.webkitMaskImage = url;
    node.style.maskImage = url;
  }

  function byId(id) { return pranaliElementById(id); }

  function readStored() {
    try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function writeStored(id) {
    try { window.localStorage.setItem(STORE_KEY, id); } catch (e) { /* private mode */ }
  }

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  /* ------------------------------------------------------- the mandala

     Where each element comes to rest, as a fraction of the mandala's radius.
     COMPASS is the brief's stated geometry; ARC is the mobile fallback, where
     a full compass has no room — the four outer marks swing onto a shallow
     arc below the spiral, reading Earth · Water · (Space) · Fire · Air from
     left to right, which is the brief's own sequence.                      */

  /* How far out the four marks sit, as a fraction of the ring's radius. The
     brief's mandala places them well inside the circle rather than on it, at
     roughly this much of the way out. Keep in step with --fit-marks in
     css/styles.css, which reserves room using the same number. */
  var SEAT = 0.58;

  var COMPASS = {
    North:  { x:  0, y: -1 },
    East:   { x:  1, y:  0 },
    South:  { x:  0, y:  1 },
    West:   { x: -1, y:  0 },
    Centre: { x:  0, y:  0 }
  };

  /* The arc seats sit on the ring itself (x^2 + y^2 = 1), spread across its
     lower half, so the drawn circle still means something in this layout.
     Left to right they read Earth, Water, (Space above), Fire, Air — the
     brief's own sequence. */
  var ARC = {
    earth: { x: -0.94, y: 0.34 },
    water: { x: -0.50, y: 0.87 },
    space: { x:  0.00, y: 0.00 },
    fire:  { x:  0.50, y: 0.87 },
    air:   { x:  0.94, y: 0.34 }
  };

  /* the logo spiral, drawn here at display size */
  var SPIRAL_PATH =
    "M 50 50 A 5 5 0 0 1 40 50 A 10 10 0 0 1 60 50 A 15 15 0 0 1 30 50 " +
    "A 20 20 0 0 1 70 50 A 25 25 0 0 1 20 50 A 30 30 0 0 1 80 50 " +
    "A 35 35 0 0 1 10 50 A 40 40 0 0 1 90 50";

  /* ------------------------------------------------- the two element rows */

  var rows = [
    { node: $("#mandalaNodes"),   buttons: [] },   // the bloom
    { node: $("#elementRailRow"), buttons: [] }    // the fixed rail
  ];

  function nodeMarkup(el, inMandala) {
    var mark;
    if (inMandala && el.id === "space") {
      /* Space is the spiral itself — real SVG, so it stays crisp at the size
         the bloom scales it to, and can turn without resampling. */
      mark = '<span class="node__mark node__mark--spiral">' +
               '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
                 '<path d="' + SPIRAL_PATH + '" fill="none" stroke="currentColor" ' +
                 'stroke-width="4" stroke-linecap="round" />' +
               '</svg>' +
             '</span>';
    } else {
      mark = '<span class="icon-mask"></span>';
    }
    return mark +
      '<span class="element-btn__label">' + el.name + '</span>' +
      '<span class="element-btn__dot"></span>';
  }

  function buildRow(row, i) {
    var inMandala = (i === 0);
    var frag = document.createDocumentFragment();

    ELEMENTS.forEach(function (el) {
      var li = document.createElement("li");
      li.setAttribute("role", "presentation");
      if (inMandala) li.className = "node node--" + el.id;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "element-btn";
      btn.dataset.element = el.id;
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", el.name + " — " + el.roman + ", " + el.direction);
      btn.style.setProperty("--el-accent", el.accent);
      btn.innerHTML = nodeMarkup(el, inMandala);

      var mask = btn.querySelector(".icon-mask");
      if (mask) paintIcon(mask, el);

      btn.addEventListener("click", function () {
        select(el.id, true);
        /* clicking or tapping the spiral is one of the brief's three triggers */
        if (inMandala && el.id === "space") openBloom();
      });

      li.appendChild(btn);
      frag.appendChild(li);
      row.buttons.push(btn);
    });

    row.node.appendChild(frag);

    row.node.addEventListener("keydown", function (ev) {
      var at = row.buttons.indexOf(document.activeElement);
      if (at < 0) return;
      var next = null;
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") next = (at + 1) % row.buttons.length;
      if (ev.key === "ArrowLeft"  || ev.key === "ArrowUp")   next = (at - 1 + row.buttons.length) % row.buttons.length;
      if (ev.key === "Home")       next = 0;
      if (ev.key === "End")        next = row.buttons.length - 1;
      if (next === null) return;
      ev.preventDefault();
      row.buttons[next].focus();
      select(ELEMENTS[next].id, true);
    });
  }

  /* ---------------------------------------------------------- the pillars */

  function renderPillars() {
    var host = $("#pillarsList");
    if (!host) return;
    var esc = PranaliSite.escapeHtml;

    host.innerHTML = ELEMENTS.map(function (el) {
      var cards = pranaliHubsFor(el.id).map(function (h) {
        /* A hub shows a link, or a note that it is not live yet, or neither —
           the ones whose entries are listed below speak for themselves. Guard
           the else branch or a hub with entries renders the word "undefined". */
        var action = "";
        if (h.href) {
          action = '<a class="link-plain" href="' + esc(h.href) + '">' + esc(h.cta) + '</a>';
        } else if (h.status) {
          action = '<span class="hub__soon">' + esc(h.status) + '</span>';
        }

        /* Gatherings, retreats and publications live inside the hub they
           belong to rather than in sections of their own, so each element
           carries its own entries and nothing is repeated between them. */
        var entries = (h.items || []).map(function (it) {
          return '<li class="entry">' +
                   '<p class="entry__meta">' + esc(it.meta) + '</p>' +
                   '<h5 class="entry__title">' + esc(it.title) + '</h5>' +
                   '<p class="entry__blurb">' + esc(it.blurb) + '</p>' +
                 '</li>';
        }).join("");

        return '<li class="hub">' +
                 '<p class="hub__kind">' + (h.kind === "arm" ? "Operational arm" : "Knowledge hub") + '</p>' +
                 '<h4 class="hub__title">' + esc(h.title) + '</h4>' +
                 '<p class="hub__blurb">' + esc(h.blurb) + '</p>' +
                 (entries ? '<ul class="entries">' + entries + '</ul>' : '') +
                 action +
               '</li>';
      }).join("");

      return '' +
      '<section class="pillar" data-element="' + esc(el.id) + '" style="--el-accent:' + esc(el.accent) + '">' +
        '<header class="pillar__head">' +
          '<span class="pillar__mark icon-mask" data-mark="' + esc(el.id) + '" aria-hidden="true"></span>' +
          '<div class="pillar__titles">' +
            '<p class="pillar__dir">' + esc(el.direction) + ' · ' + esc(el.sanskrit) + ' ' + esc(el.roman) + '</p>' +
            '<h3 class="pillar__name">' + esc(el.name) + '</h3>' +
            '<p class="pillar__principle">' + esc(el.principle) + '</p>' +
          '</div>' +
        '</header>' +
        '<ul class="hubs">' + cards + '</ul>' +
      '</section>';
    }).join("");

    $$("[data-mark]", host).forEach(function (span) {
      var el = byId(span.dataset.mark);
      if (el) paintIcon(span, el);
    });
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
      "Showing <strong>" + el.name + "</strong> — " + shown + " of " + filterables.length + " entries.";

    var reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "Show everything";
    reset.addEventListener("click", clearFilter);
    filterNote.appendChild(reset);
  }

  function clearFilter() {
    filterables.forEach(function (n) { n.classList.remove("is-dimmed"); });
    filterNote.textContent = "All five showing. Choose an element to narrow the page.";
  }

  /* ------------------------------------------------------- the hero copy */

  var bloomCopy      = $("#bloomCopy");
  var bloomName      = $("#bloomName");
  var bloomSanskrit  = $("#bloomSanskrit");
  var bloomPrinciple = $("#bloomPrinciple");

  var current = null;
  var onSelectionChange = null;

  function select(id, remember) {
    var el = byId(id);
    if (!el || (current && current.id === id)) return;
    current = el;

    var root = document.documentElement;
    root.style.setProperty("--accent", el.accent);
    root.style.setProperty("--accent-soft", el.accentSoft);
    root.dataset.activeElement = el.id;

    rows.forEach(function (row) {
      row.buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.element === el.id));
      });
    });

    bloomCopy.classList.add("is-swapping");
    window.setTimeout(function () {
      bloomSanskrit.textContent  = el.sanskrit + " · " + el.roman;
      bloomName.textContent      = el.name;
      bloomPrinciple.textContent = el.principle;
      bloomCopy.classList.remove("is-swapping");
    }, reduceMotion ? 0 : 160);

    applyFilter(el);
    if (remember) writeStored(el.id);
    if (onSelectionChange) onSelectionChange();
  }

  /* -------------------------------------------------------- the bloom

     One number, `bloom.p`, runs 0 -> 1 and every node is placed from it. The
     positions are applied with gsap.set() from a plain object rather than
     tweened as CSS custom properties, because an unregistered custom property
     animates discretely — it would snap between seats rather than travel.   */

  var bloom = { p: 0 };
  var STAGGER = 0.07;   // per-node offset, in progress units
  /* The last node is offset by (n-1) * STAGGER, so the usable span is what is
     left after that. Getting this wrong by one leaves the final element —
     Air — stalled short of its seat at full scroll. */
  var SPAN = 1 - STAGGER * (ELEMENTS.length - 1);

  function mandalaRadius() {
    var m = $("#mandala");
    return m ? m.getBoundingClientRect().width / 2 : 0;
  }

  /* Must stay in step with the arc media query in css/styles.css. A short
     landscape phone has the width for a compass but nowhere near the height,
     so height counts here as much as width. */
  function onArc() {
    return window.matchMedia("(max-width: 700px), (max-height: 620px)").matches;
  }

  function seatFor(el) {
    if (el.id === "space") return COMPASS.Centre;
    return onArc() ? ARC[el.id] : COMPASS[el.direction];
  }

  /* The arc needs its marks spread right out to the ring; the compass pulls
     them in to --seat so the ring reads as a drawn circle around them. */
  function seatScale() { return onArc() ? 1 : SEAT; }

  /* gentle overshoot — the "bloom" the brief asks for */
  function easeBloom(t) {
    var c = 1.70158 * 1.12;
    var u = t - 1;
    return 1 + (c + 1) * u * u * u + c * u * u;
  }

  function placeNodes() {
    var r = mandalaRadius();

    rows[0].buttons.forEach(function (btn, i) {
      var el = ELEMENTS[i];
      var li = btn.parentNode;
      var seat = seatFor(el);

      /* Space is the spiral: present from the start, so it only settles —
         no stagger, and it never fades in. */
      if (el.id === "space") {
        gsap.set(li, { x: 0, y: 0, scale: 0.82 + 0.18 * bloom.p, opacity: 1 });
        return;
      }

      var local = clamp((bloom.p - i * STAGGER) / SPAN, 0, 1);
      var out = easeBloom(local);

      var reach = r * seatScale();
      gsap.set(li, {
        x: seat.x * reach * out,
        y: seat.y * reach * out,
        scale: 0.3 + 0.7 * local,
        opacity: local
      });
    });
  }

  /* the same placement without GSAP, for the no-motion path */
  function placeNodesStatic() {
    var r = mandalaRadius();
    rows[0].buttons.forEach(function (btn, i) {
      var seat = seatFor(ELEMENTS[i]);
      var li = btn.parentNode;
      var reach = r * seatScale();
      li.style.transform = "translate(" + (seat.x * reach) + "px," + (seat.y * reach) + "px)";
      li.style.opacity = "1";
    });
  }

  /* Clicking or tapping the spiral is a shortcut to the bloomed state: it
     scrolls to where the scrubbed timeline finishes, so scroll position stays
     the single source of truth for how open the mandala is. */
  var bloomEndScroll = null;
  function openBloom() {
    if (bloomEndScroll === null) return;
    window.scrollTo({ top: bloomEndScroll, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
      document.body.classList.add("no-motion");
      placeNodesStatic();
      window.addEventListener("resize", placeNodesStatic);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    placeNodes();

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#bloom",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        invalidateOnRefresh: true,
        onRefresh: function (self) { bloomEndScroll = self.end; }
      }
    });

    /* the mandala opens */
    tl.to(bloom, { p: 1, duration: 6, ease: "none", onUpdate: placeNodes }, 0);

    /* the ring closes around them, and the wash warms */
    tl.fromTo(".mandala__ring", { opacity: 0, scale: 0.86 },
                                { opacity: 1, scale: 1, duration: 5, ease: "power2.out" }, 0.4);
    tl.fromTo(".bloom__tint", { opacity: 0 }, { opacity: 1, duration: 4.5, ease: "none" }, 0);

    /* then the words */
    tl.fromTo("#bloomCopy", { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 2.4, ease: "power2.out" }, 5.2);
    tl.to("#bloomHint", { opacity: 0, duration: 1.2, ease: "none" }, 0);

    /* a beat of stillness before the page moves on */
    tl.to({}, { duration: 2 }, 8);

    ScrollTrigger.addEventListener("refreshInit", placeNodes);
    onSelectionChange = placeNodes;

    /* gentle reveals below the hero — one trigger each, so anything already
       scrolled past still ends up visible */
    var reveals = $$(".section__head, .intro__body, .pillar, .join__form");
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

  /* ------------------------------------------------------------ the rail */

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

  /* Feeds the hero's sizing the three numbers it cannot work out in CSS: how
     tall the header is, how tall the words under the circle actually are, and
     how far a mark reaches past the ring. The circle is then derived from
     them, so it can never be sized into the text again. */
  function trackHeights() {
    var header = $(".site-header");
    var pin = $(".bloom__pin");
    var copy = $("#bloomCopy");
    if (!header) return;

    var set = function () {
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");

      if (pin && copy) {
        /* offsetHeight ignores opacity and transforms, so this is the real
           laid-out height even while the copy is still faded out */
        pin.style.setProperty("--copy-h", copy.offsetHeight + "px");

        var firstNode = rows[0].buttons.length ? rows[0].buttons[0].parentNode : null;
        if (firstNode && firstNode.offsetHeight) {
          pin.style.setProperty("--node-over", (firstNode.offsetHeight / 2) + "px");
        }
      }

      if (window.ScrollTrigger) ScrollTrigger.refresh();
      placeNodesIfReady();
    };

    set();
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(set);
      ro.observe(header);
      if (copy) ro.observe(copy);     // the principle wraps differently by width
    }
    window.addEventListener("resize", set);

    /* webfonts land after first paint and change the text height */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(set);
  }

  function placeNodesIfReady() {
    if (window.gsap && !reduceMotion) placeNodes();
    else placeNodesStatic();
  }

  function initForm() {
    var form = $("#joinForm");
    var note = $("#formNote");
    if (!form) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      note.textContent = "Noted — the backend isn't wired yet, so nothing was sent.";
    });
  }

  /* ---------------------------------------------------------------- boot */

  rows.forEach(buildRow);
  renderPillars();
  filterables = $$("[data-element]").filter(function (n) {
    return !n.classList.contains("element-btn");
  });
  clearFilter();
  PranaliSite.init();
  initForm();
  initRail();
  initMotion();
  trackHeights();
  select(readStored() || DEFAULT_ID, false);
})();
