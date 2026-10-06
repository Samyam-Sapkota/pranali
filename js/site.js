/* ==========================================================================
   Pranali Space — chrome shared by every page
   Mobile nav, anchor scrolling, and the little membership badge in the header.
   ========================================================================== */

var PranaliSite = (function () {
  "use strict";

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNav() {
    var toggle = $("#navToggle");
    var nav = $("#siteNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    $$("#siteNav a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* same-page anchors scroll smoothly and stop clear of the sticky header */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var id = a.getAttribute("href").slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        ev.preventDefault();
        var header = $(".site-header");
        var offset = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
        window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }

  /* header badge — shows the pretend membership state */
  function renderMemberBadge() {
    var slot = $("#memberBadge");
    if (!slot) return;

    var member = PranaliMembership.get();
    if (!member) {
      /* "Membership", not "Join" — the primary nav already has a Join link
         pointing at the newsletter, and two identical words in one bar read
         as a duplicate rather than as two different destinations. */
      slot.innerHTML = '<a class="member-badge member-badge--join" href="courses.html#pricing">Membership</a>';
      return;
    }

    var plan = pranaliPlanById(member.planId);
    slot.innerHTML =
      '<span class="member-badge" title="Demo membership — stored in this browser only">' +
        '<span class="member-badge__dot" aria-hidden="true"></span>' +
        '<span class="member-badge__name">' + escapeHtml(firstName(member.name)) + '</span>' +
        '<span class="member-badge__plan">' + escapeHtml(plan ? plan.name : "Member") + '</span>' +
      '</span>' +
      '<button type="button" class="member-badge__out" id="memberSignOut">Sign out</button>';

    var out = $("#memberSignOut");
    if (out) {
      out.addEventListener("click", function () {
        PranaliMembership.signOut();
        window.location.reload();
      });
    }
  }

  /* ------------------------------------------------- step-down arrow ---
     Walks the page one block at a time. The list is built fresh on every
     click rather than cached, because on the courses page the sections are
     rendered by JS and on the course page the whole body is, so a list taken
     at startup would be wrong or empty. */
  function initScrollNext() {
    var btn = $("#scrollNext");
    if (!btn) return;

    function headerHeight() {
      var h = $(".site-header");
      return h ? h.offsetHeight : 0;
    }

    function blocks() {
      return $$("main > section, main > figure, main > header, main > div, .site-footer")
        .filter(function (el) { return el.offsetHeight > 40; });
    }

    /* Scroll position that puts a block's top just under the header. */
    function restingTop(el) {
      return Math.max(el.getBoundingClientRect().top + window.scrollY - headerHeight() - 8, 0);
    }

    /* The next resting position below `fromY`. Compared as scroll positions
       rather than element tops, and with a minimum step, so the arrow can
       never pick the block you are already parked on and move you a pixel —
       which is what happens at the top of a page whose first section starts
       immediately under the header. */
    function nextStop(fromY) {
      var all = blocks();
      for (var i = 0; i < all.length; i++) {
        var top = restingTop(all[i]);
        if (top > fromY + 24) return top;
      }
      return null;
    }

    function nextBlock() { return nextStop(window.scrollY); }

    /* Where the last click was headed. A smooth scroll takes a while — the
       stage alone is three screens tall — so without this a second click
       mid-flight measures from wherever the page happens to be and lands back
       on the section already being scrolled to. Measuring from the pending
       destination instead means each click advances exactly one section,
       however fast they come. */
    var pending = null;

    function settle() { pending = null; }

    btn.addEventListener("click", function () {
      var from = (pending === null) ? window.scrollY : pending;
      var top = nextStop(from);
      if (top === null) return;

      pending = top;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });

      // scrollend is not everywhere yet, so there is a timer behind it
      window.clearTimeout(btn._settleTimer);
      btn._settleTimer = window.setTimeout(settle, 1200);
    });

    window.addEventListener("scrollend", settle);

    var queued = false;
    function refresh() {
      queued = false;
      /* Also done once the page cannot scroll any further: the last block's
         top may still sit below the fold line and never reach the header, so
         "is there a block below?" alone would keep the arrow on at the very
         bottom with nothing left for it to do. */
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var atEnd = window.scrollY >= maxScroll - 2;
      btn.classList.toggle("is-done", atEnd || nextBlock() === null);
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(refresh);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    refresh();
  }

  /* ---------------------------------------------------- eased scrolling

     This page is a scroll-driven piece: the mandala opens across three
     screens. A mouse wheel moves in coarse steps, which makes that read as a
     series of jumps rather than something unfolding, so the wheel feeds a
     target position and the page eases toward it each frame.

     Kept deliberately narrow, because hijacking scrolling is an easy way to
     break a page:
       - wheel only. Keyboard, scrollbar dragging, find-on-page and focus
         scrolling all keep their native behaviour, so nothing can become
         unreachable if this misbehaves.
       - fine pointers only. Touch scrolling already has momentum of its own
         and taking it over makes it worse.
       - off entirely under prefers-reduced-motion.
       - defers to any scrollable element under the cursor, so the dialog and
         any inner scroller still work.
     CSS `scroll-behavior: smooth` is still deliberately absent: it corrupts
     ScrollTrigger.refresh(), which is why this is done here instead. */
  function initEasedScroll() {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    var EASE = 0.14;          // fraction of the remaining distance per frame
    var target = window.scrollY;
    var running = false;
    var selfScroll = false;

    function maxScroll() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    /* the nearest ancestor that can actually scroll in the wheel's direction */
    function scrollerUnder(node) {
      for (var el = node; el && el.nodeType === 1 && el !== document.body &&
                          el !== document.documentElement; el = el.parentElement) {
        var st = getComputedStyle(el);
        if ((st.overflowY === "auto" || st.overflowY === "scroll") &&
            el.scrollHeight > el.clientHeight + 1) return el;
      }
      return null;
    }

    function wheelPixels(ev) {
      if (ev.deltaMode === 1) return ev.deltaY * 16;              // lines
      if (ev.deltaMode === 2) return ev.deltaY * window.innerHeight;  // pages
      return ev.deltaY;
    }

    function step() {
      var diff = target - window.scrollY;
      if (Math.abs(diff) < 0.5) {
        running = false;
        return;
      }
      selfScroll = true;
      window.scrollTo(0, window.scrollY + diff * EASE);
      selfScroll = false;
      if (window.ScrollTrigger) ScrollTrigger.update();
      window.requestAnimationFrame(step);
    }

    window.addEventListener("wheel", function (ev) {
      if (ev.ctrlKey) return;                       // pinch zoom
      if (scrollerUnder(ev.target)) return;         // an inner scroller owns this
      if (maxScroll() <= 0) return;

      ev.preventDefault();
      target = Math.max(0, Math.min(target + wheelPixels(ev), maxScroll()));
      if (!running) {
        running = true;
        window.requestAnimationFrame(step);
      }
    }, { passive: false });

    /* anything that scrolls the page by other means — a keypress, the
       scrollbar, an anchor jump — becomes the new truth */
    window.addEventListener("scroll", function () {
      if (!selfScroll && !running) target = window.scrollY;
    }, { passive: true });

    /* the document grows and shrinks as sections pin, so a stale target
       could sit past the end */
    window.addEventListener("resize", function () {
      target = Math.max(0, Math.min(target, maxScroll()));
    });
  }

  /* ------------------------------------------------------- cart link
     Read straight from storage rather than through PranaliCart, so pages
     that do not load the shop script still show it. Hidden while empty. */
  function cartCount() {
    try {
      var lines = JSON.parse(window.localStorage.getItem("pranali:cart") || "[]");
      return Array.isArray(lines)
        ? lines.reduce(function (n, l) { return n + (l && l.qty > 0 ? l.qty : 0); }, 0)
        : 0;
    } catch (e) {
      return 0;
    }
  }

  function renderCartLink() {
    var slot = $("#memberBadge");
    if (!slot) return;
    var link = $("#cartLink");
    if (!link) {
      link = document.createElement("a");
      link.id = "cartLink";
      link.className = "cart-link";
      link.href = "cart.html";
      slot.parentNode.insertBefore(link, slot);
    }
    var n = cartCount();
    link.hidden = n === 0;
    document.body.classList.toggle("has-cart", n > 0);
    link.innerHTML =
      '<svg class="cart-link__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
        '<path d="M4.5 9.5h15l-1.6 9.1a1.6 1.6 0 0 1-1.6 1.4H7.7a1.6 1.6 0 0 1-1.6-1.4L4.5 9.5Z" ' +
          'stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path d="M8.5 9.5c0-2.6 1.4-5 3.5-5s3.5 2.4 3.5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '</svg>' +
      '<span class="cart-link__word">Cart</span><span class="cart-link__n">' + n + '</span>';
    link.setAttribute("aria-label", "Cart, " + n + (n === 1 ? " item" : " items"));

    /* On a phone the header has no room left, so the cart rides in the menu */
    var nav = $("#siteNav");
    if (nav) {
      var item = $("#navCart");
      if (!item) {
        item = document.createElement("a");
        item.id = "navCart";
        item.className = "site-nav__cart";
        item.href = "cart.html";
        nav.appendChild(item);
      }
      item.hidden = n === 0;
      item.textContent = "Cart · " + n;
    }
  }

  function firstName(name) { return String(name || "Member").split(/\s+/)[0]; }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function init() {
    initNav();
    initAnchors();
    initScrollNext();
    initEasedScroll();
    renderMemberBadge();
    PranaliMembership.onChange(renderMemberBadge);
    renderCartLink();
    if (window.PranaliCart) PranaliCart.onChange(renderCartLink);
    window.addEventListener("storage", renderCartLink);
  }

  return {
    init: init,
    escapeHtml: escapeHtml,
    reduceMotion: reduceMotion,
    $: $, $$: $$
  };
})();
