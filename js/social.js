/* ==========================================================================
   Pranali Space — "What our members say" + the scrolling photo strip
   Rendered from data so both pages stay in step. Drops into any
   <section data-voices></section>.
   ========================================================================== */

(function () {
  "use strict";

  var host = document.querySelector("[data-voices]");
  if (!host) return;

  var esc = PranaliSite.escapeHtml;

  /* ------------------------------------------------------ testimonials */

  var cards = PRANALI_TESTIMONIALS.map(function (t) {
    return '' +
      '<li class="voice">' +
        '<blockquote class="voice__quote">' + esc(t.quote) + '</blockquote>' +
        '<div class="voice__who">' +
          '<p class="voice__name">' + esc(t.name) + '</p>' +
          '<p class="voice__role">' + esc(t.role) + ' · ' + esc(t.place) + '</p>' +
        '</div>' +
      '</li>';
  }).join("");

  /* ---------------------------------------------------- the photo strip
     The list is rendered twice, end to end, and the track is animated by
     exactly half its width — so the moment the first copy scrolls out, the
     second is sitting precisely where it started and the loop is seamless.
     aria-hidden on the duplicate keeps it out of the accessibility tree. */

  function strip(items, hidden) {
    return items.map(function (img) {
      return '<figure class="marquee__item">' +
               '<img src="' + esc(img.src) + '" alt="' + (hidden ? "" : esc(img.alt)) + '"' +
               (hidden ? ' aria-hidden="true"' : '') + ' loading="lazy" decoding="async" />' +
             '</figure>';
    }).join("");
  }

  host.innerHTML =
    '<div class="shell">' +
      '<header class="section__head">' +
        '<p class="section__label">Voices</p>' +
        '<h2 class="section__title">What our members say</h2>' +
      '</header>' +
      '<ul class="voices">' + cards + '</ul>' +
    '</div>' +
    '<div class="marquee" data-marquee>' +
      '<div class="marquee__track">' +
        strip(PRANALI_MARQUEE, false) +
        strip(PRANALI_MARQUEE, true) +
      '</div>' +
    '</div>' +
    '<p class="marquee__note shell">Photographs from Pranali gatherings and the wider region.</p>';

  /* Hovering anywhere over the strip stops it. Focus does the same, so it
     also stops for anyone tabbing through rather than pointing. */
  var marquee = host.querySelector("[data-marquee]");
  if (!marquee) return;

  function pause() { marquee.classList.add("is-paused"); }
  function play()  { marquee.classList.remove("is-paused"); }

  marquee.addEventListener("mouseenter", pause);
  marquee.addEventListener("mouseleave", play);
  marquee.addEventListener("focusin", pause);
  marquee.addEventListener("focusout", play);
  /* on a touch screen there is no hover — holding a finger down pauses it */
  marquee.addEventListener("touchstart", pause, { passive: true });
  marquee.addEventListener("touchend", play);
})();
