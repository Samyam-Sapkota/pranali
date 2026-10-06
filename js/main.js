/* ==========================================================================
   Pranali Space — the home page
   The spiral bloom, the element rail, and the section for each element.
   GSAP is optional: without it (or under reduced motion) the mandala renders
   fully bloomed and everything stays usable.
   ========================================================================== */

(function () {
  "use strict";

  /* The elements, their order and their compass directions all live in
     js/data.js so the pillars and any other page read the same list. */
  var ELEMENTS = PRANALI_ELEMENTS;

  var DEFAULT_ID = "space";

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

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  /* ------------------------------------------------------- the mandala

     Where each element comes to rest, as a fraction of the mandala's radius.
     COMPASS is the brief's stated geometry; ARC is the mobile fallback, where
     a full compass has no room — the four outer marks swing onto a shallow
     arc below the spiral, reading Earth · Water · (Space) · Fire · Air from
     left to right, which is the brief's own sequence.                      */

  /* How far out the four marks sit, as a fraction of the ring's radius. Read
     from the --seat property in css/styles.css rather than duplicated here:
     the same number also sizes the circle, and two copies of it would drift
     the first time one was tuned. */
  function seat() {
    var m = $("#mandala");
    var v = m && parseFloat(getComputedStyle(m).getPropertyValue("--seat"));
    return (v > 0 && v <= 1.2) ? v : 0.76;
  }

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

      /* A mark the drawing shows turned around. Only in the mandala — the
         labelled key in the brief has it the other way up, and that is the
         orientation the rail and the pillars use. */
      if (inMandala && el.mandalaRotate) {
        btn.style.setProperty("--mark-rotate", el.mandalaRotate + "deg");
      }

      btn.addEventListener("click", function () {
        select(el.id, true, !inMandala);
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

  /* ----------------------------------------------------------- the realms

     One section per element under the hero. The copy is in index.html; the
     parts that will come from the backend are drawn here. */

  var esc = PranaliSite.escapeHtml;
  var realmHost = $("#realm");
  var realms = realmHost ? $$(".realm", realmHost) : [];

  function paintRealmMarks() {
    $$("[data-mark]", realmHost).forEach(function (span) {
      var el = byId(span.dataset.mark);
      if (!el) return;
      paintIcon(span, el);
      span.style.color = el.accent;
    });
  }

  /* Space: the other four, each with what it holds — and each a way in. */
  function renderSpace() {
    var list = $("#spaceCompass");
    if (list) {
      list.innerHTML = ELEMENTS.filter(function (el) { return el.id !== "space"; }).map(function (el) {
        var hubs = pranaliHubsFor(el.id).map(function (h) {
          return '<li>' + esc(h.title) + '</li>';
        }).join("");
        return '' +
        '<li class="compass__row" style="--el-accent:' + esc(el.accent) + '">' +
          '<span class="compass__mark icon-mask" data-compass="' + esc(el.id) + '" aria-hidden="true"></span>' +
          '<div class="compass__name">' +
            '<p class="compass__dir">' + esc(el.briefDirection) + '</p>' +
            '<h4>' + esc(el.name) + '</h4>' +
          '</div>' +
          '<ul class="compass__hubs">' + hubs + '</ul>' +
          '<button type="button" class="compass__go" data-go="' + esc(el.id) + '">' +
            'Go to ' + esc(el.name) + '<span aria-hidden="true"> →</span>' +
          '</button>' +
        '</li>';
      }).join("");

      $$("[data-compass]", list).forEach(function (span) {
        paintIcon(span, byId(span.dataset.compass));
      });
      list.addEventListener("click", function (ev) {
        var go = ev.target.closest("[data-go]");
        if (go) select(go.dataset.go, true, true);
      });
    }

    var access = $("#spaceAccess");
    if (access) {
      access.innerHTML =
        '<table class="access__table">' +
          '<caption class="access__caption">By area</caption>' +
          '<thead><tr><td></td><th scope="col">Free public</th><th scope="col" class="access__member">Member</th></tr></thead>' +
          '<tbody>' + PRANALI_ACCESS.map(function (a) {
            return '<tr><th scope="row">' + esc(a.area) + '</th>' +
                   '<td>' + esc(a.free) + '</td>' +
                   '<td class="access__member">' + esc(a.member) + '</td></tr>';
          }).join("") + '</tbody>' +
        '</table>';
    }
  }

  /* Water: the free course, then a handful of the library. */
  function renderWater() {
    var free = $("#waterFree");
    var grid = $("#waterCourses");
    var catName = function (c) { var x = pranaliCategoryById(c.category); return x ? x.name : ""; };

    var freeCourse = pranaliCourseById(PRANALI_FREE_COURSE_ID);
    if (free && freeCourse) {
      var href = "course.html?id=" + encodeURIComponent(freeCourse.id);
      free.innerHTML =
        '<article class="free-course">' +
          '<a class="free-course__media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + esc(freeCourse.image) + '" alt="" loading="lazy" decoding="async" />' +
          '</a>' +
          '<div class="free-course__body">' +
            '<p class="free-course__flag">Always free · no account, no payment</p>' +
            '<p class="course-card__cat">' + esc(catName(freeCourse)) + '</p>' +
            '<h4 class="free-course__title">' + esc(freeCourse.title) + '</h4>' +
            '<p class="free-course__sub">' + esc(freeCourse.subtitle) + '</p>' +
            '<p class="free-course__blurb">' + esc(freeCourse.blurb) + '</p>' +
            '<div class="free-course__actions">' +
              '<a class="btn" href="' + href + '">Start the free course</a>' +
            '</div>' +
          '</div>' +
        '</article>';
    }

    if (grid) {
      var picks = ["seed-keepers", "walking-a-watershed", "soil-beneath-argument",
                   "monsoon-oral-histories", "millets-came-back", "spiral-and-circle"];
      grid.innerHTML = picks.map(pranaliCourseById).filter(Boolean).map(function (c) {
        var href = "course.html?id=" + encodeURIComponent(c.id);
        var open = PranaliMembership.canAccess(c);
        return '' +
        '<li class="course-card ' + (open ? "is-open" : "is-locked") + '">' +
          '<a class="course-card__media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + esc(c.image) + '" alt="" loading="lazy" decoding="async" />' +
          '</a>' +
          '<div class="course-card__body">' +
            '<p class="course-card__cat">' + esc(catName(c)) + '</p>' +
            '<h4 class="course-card__title"><a href="' + href + '">' + esc(c.title) + '</a></h4>' +
            '<p class="course-card__sub">' + esc(c.subtitle) + '</p>' +
            '<p class="course-card__meta">' + esc(c.teacher) + ' · ' + esc(c.place) + '<br />' + esc(c.duration) + '</p>' +
            '<div class="course-card__foot">' +
              '<span class="course-card__badge">' + (open ? "Included in your membership" : "Members only") + '</span>' +
            '</div>' +
          '</div>' +
        '</li>';
      }).join("");
    }
  }

  function showRealm(el, scrollTo) {
    realms.forEach(function (r) { r.hidden = r.dataset.realm !== el.id; });

    var shown = realmHost && $('.realm[data-realm="' + el.id + '"]', realmHost);
    if (shown && window.gsap && !reduceMotion) {
      gsap.fromTo(shown, { opacity: 0, y: 18 },
                         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", overwrite: true });
    }

    /* Changing element from the rail while reading below the hero brings the
       new section's top into view; from inside the hero, nothing moves. */
    if (scrollTo && realmHost) {
      var header = $(".site-header");
      var top = realmHost.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0);
      if (window.scrollY > top - 4) {
        window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? "auto" : "smooth" });
      }
    }

    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  /* The choice rides in the URL rather than in storage: a fresh visit opens
     on Space, but Back from a product page returns to Earth. */
  function readChoice() {
    var id = new URLSearchParams(window.location.search).get("element");
    return byId(id) ? id : null;
  }
  function writeChoice(id) {
    try {
      var url = new URL(window.location.href);
      if (id === DEFAULT_ID) url.searchParams.delete("element");
      else url.searchParams.set("element", id);
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (e) { /* file:// in some browsers */ }
  }

  /* ------------------------------------------------------- the hero copy */

  var bloomCopy      = $("#bloomCopy");
  var bloomName      = $("#bloomName");
  var bloomSanskrit  = $("#bloomSanskrit");
  var bloomPrinciple = $("#bloomPrinciple");

  var current = null;
  var onSelectionChange = null;

  function select(id, remember, scrollTo) {
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

    showRealm(el, scrollTo);
    if (remember) writeChoice(el.id);
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
  function seatScale() { return onArc() ? 1 : seat(); }

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
    var reveals = $$(".join__intro, .join__form");
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
    var intro = $("#realm");
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
  paintRealmMarks();
  renderSpace();
  renderWater();
  PranaliSite.init();
  initForm();
  initRail();
  initMotion();
  trackHeights();
  select(readChoice() || DEFAULT_ID, false);
})();
