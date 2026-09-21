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
      slot.innerHTML = '<a class="member-badge member-badge--join" href="courses.html#pricing">Join</a>';
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
    renderMemberBadge();
    PranaliMembership.onChange(renderMemberBadge);
  }

  return {
    init: init,
    escapeHtml: escapeHtml,
    reduceMotion: reduceMotion,
    $: $, $$: $$
  };
})();
