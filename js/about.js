/* ==========================================================================
   Pranali Space — the about page
   The five pillars and the hubs under each, rendered from js/data.js.
   ========================================================================== */

(function () {
  "use strict";

  var esc = PranaliSite.escapeHtml;

  function paintIcon(node, el) {
    var url = "url('images/" + el.num + ".png')";
    node.style.webkitMaskImage = url;
    node.style.maskImage = url;
  }

  function renderPillars() {
    var host = document.getElementById("pillarsList");
    if (!host) return;

    host.innerHTML = PRANALI_ELEMENTS.map(function (el) {
      var cards = pranaliHubsFor(el.id).map(function (h) {
        /* A hub shows a link, or a note that it is not live yet, or neither.
           Guard the else branch or a hub with entries renders "undefined". */
        var action = "";
        if (h.href) {
          action = '<a class="link-plain" href="' + esc(h.href) + '">' + esc(h.cta) + '</a>';
        } else if (h.status) {
          action = '<span class="hub__soon">' + esc(h.status) + '</span>';
        }

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
      '<section class="pillar" style="--el-accent:' + esc(el.accent) + '">' +
        '<header class="pillar__head">' +
          '<span class="pillar__mark icon-mask" data-mark="' + esc(el.id) + '" aria-hidden="true"></span>' +
          '<div class="pillar__titles">' +
            '<p class="pillar__dir">' + esc(el.briefDirection) + ' · ' + esc(el.sanskrit) + ' ' + esc(el.roman) + '</p>' +
            '<h3 class="pillar__name">' + esc(el.name) + '</h3>' +
            '<p class="pillar__principle">' + esc(el.principle) + '</p>' +
          '</div>' +
          '<a class="link-plain pillar__go" href="index.html?element=' + esc(el.id) + '#realm">Open ' + esc(el.name) + '</a>' +
        '</header>' +
        '<ul class="hubs">' + cards + '</ul>' +
      '</section>';
    }).join("");

    Array.prototype.forEach.call(host.querySelectorAll("[data-mark]"), function (span) {
      var el = pranaliElementById(span.dataset.mark);
      if (el) paintIcon(span, el);
    });
  }

  renderPillars();
  PranaliSite.init();
})();
