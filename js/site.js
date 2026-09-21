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

  function firstName(name) { return String(name || "Member").split(/\s+/)[0]; }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function init() {
    initNav();
    initAnchors();
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
