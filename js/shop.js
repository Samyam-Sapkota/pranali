/* ==========================================================================
   Pranali Space — the shop (Earth · Sustainable Product Ecosystem)
   --------------------------------------------------------------------------
   A demo cart and the four places products appear: the grid on the home
   page, the full shop, a single product, and the cart itself. Each renderer
   checks for its own slot, so one file serves every page.

   The cart is a list of { id, qty } in localStorage. There is no checkout:
   nothing is charged and nothing leaves the browser.
   ========================================================================== */

var PranaliCart = (function () {
  "use strict";

  var KEY = "pranali:cart";
  var listeners = [];

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var lines = raw ? JSON.parse(raw) : [];
      /* drop anything the catalogue no longer carries */
      return Array.isArray(lines)
        ? lines.filter(function (l) { return l && pranaliProductById(l.id) && l.qty > 0; })
        : [];
    } catch (e) {
      return [];
    }
  }

  function write(lines) {
    try { window.localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) { /* private mode */ }
    listeners.forEach(function (fn) { fn(lines); });
  }

  function maxFor(id) {
    var p = pranaliProductById(id);
    return p && p.stock ? p.stock : 99;
  }

  function setQty(id, qty) {
    var lines = read();
    var found = false;
    qty = Math.max(0, Math.min(qty, maxFor(id)));
    lines = lines.map(function (l) {
      if (l.id !== id) return l;
      found = true;
      return { id: id, qty: qty };
    }).filter(function (l) { return l.qty > 0; });
    if (!found && qty > 0) lines.push({ id: id, qty: qty });
    write(lines);
  }

  function qtyOf(id) {
    var lines = read();
    for (var i = 0; i < lines.length; i++) if (lines[i].id === id) return lines[i].qty;
    return 0;
  }

  return {
    lines: read,
    add: function (id, n) { setQty(id, qtyOf(id) + (n || 1)); },
    set: setQty,
    remove: function (id) { setQty(id, 0); },
    clear: function () { write([]); },
    count: function () {
      return read().reduce(function (sum, l) { return sum + l.qty; }, 0);
    },
    subtotal: function () {
      return read().reduce(function (sum, l) {
        var p = pranaliProductById(l.id);
        return sum + (p ? p.price * l.qty : 0);
      }, 0);
    },
    onChange: function (fn) { listeners.push(fn); }
  };
})();


var PranaliShop = (function () {
  "use strict";

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var esc = function (s) { return PranaliSite.escapeHtml(s); };

  /* Rs. 1,450 — grouped the plain western way, which is how Nepali shops
     print prices online */
  function price(n) {
    return "Rs. " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /* A real photograph when there is one; otherwise a typeset plate with the
     Earth mark, rather than a photograph of some other thing. */
  function media(p, cls) {
    if (p.image) {
      return '<img class="' + cls + '" src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || "") +
             '" loading="lazy" decoding="async" />';
    }
    var cat = pranaliShopCategoryById(p.category);
    return '<span class="plate plate--' + esc(p.category) + ' ' + cls + '" role="img" aria-label="' +
             esc(p.name) + ' — photograph to come">' +
             '<span class="plate__mark" aria-hidden="true"></span>' +
             '<span class="plate__name" aria-hidden="true">' + esc(p.name) + '</span>' +
             '<span class="plate__cat" aria-hidden="true">' + esc(cat ? cat.name : "") + '</span>' +
           '</span>';
  }

  function card(p) {
    var href = "product.html?id=" + encodeURIComponent(p.id);
    return '' +
    '<li class="product" data-category="' + esc(p.category) + '">' +
      '<a class="product__media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
        media(p, "product__img") +
      '</a>' +
      '<div class="product__body">' +
        '<p class="product__maker">' + esc(p.maker) + '</p>' +
        '<h3 class="product__name"><a href="' + href + '">' + esc(p.name) + '</a></h3>' +
        '<p class="product__unit">' + esc(p.unit) + '</p>' +
        '<div class="product__foot">' +
          '<span class="product__price">' + price(p.price) + '</span>' +
          '<button type="button" class="product__add" data-add="' + esc(p.id) + '">Add to cart</button>' +
        '</div>' +
      '</div>' +
    '</li>';
  }

  /* one delegated handler per grid, with a quiet "Added" acknowledgement */
  function wireAdds(host) {
    host.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-add]");
      if (!btn) return;
      PranaliCart.add(btn.dataset.add, 1);
      btn.classList.add("is-added");
      btn.textContent = "Added";
      window.clearTimeout(btn._t);
      btn._t = window.setTimeout(function () {
        btn.classList.remove("is-added");
        btn.textContent = "Add to cart";
      }, 1400);
    });
  }

  /* ----------------------------------------------------- home page grid
     Twelve on a laptop — four rows of three. The CSS hides the last two on
     a phone, so a single column stops at ten. */
  function renderHome() {
    var grid = $("#homeProducts");
    if (!grid) return;
    grid.innerHTML = PRANALI_PRODUCTS.slice(0, 12).map(card).join("");
    wireAdds(grid);
  }

  /* --------------------------------------------------------- the shop */
  function renderShop() {
    var grid = $("#shopGrid");
    var bar = $("#shopFilters");
    if (!grid) return;

    var active = new URLSearchParams(window.location.search).get("c") || "all";
    if (active !== "all" && !pranaliShopCategoryById(active)) active = "all";

    var filters = [{ id: "all", name: "Everything", n: PRANALI_PRODUCTS.length }]
      .concat(PRANALI_SHOP_CATEGORIES.map(function (c) {
        return {
          id: c.id, name: c.name,
          n: PRANALI_PRODUCTS.filter(function (p) { return p.category === c.id; }).length
        };
      }));

    function draw() {
      var shown = PRANALI_PRODUCTS.filter(function (p) {
        return active === "all" || p.category === active;
      });
      grid.innerHTML = shown.map(card).join("");

      var note = $("#shopNote");
      var cat = pranaliShopCategoryById(active);
      if (note) note.textContent = cat ? cat.blurb : "Food, cloth and household things, from people who would rather mend than replace.";
    }

    if (bar) {
      bar.innerHTML = filters.map(function (f) {
        return '<li><button type="button" class="filter-btn" data-c="' + f.id + '" aria-pressed="' + (f.id === active) + '">' +
                 esc(f.name) + ' <span class="filter-btn__count">' + f.n + '</span></button></li>';
      }).join("");

      bar.addEventListener("click", function (ev) {
        var btn = ev.target.closest("[data-c]");
        if (!btn) return;
        active = btn.dataset.c;
        $$(".filter-btn", bar).forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        var url = active === "all" ? "shop.html" : "shop.html?c=" + active;
        try { window.history.replaceState(null, "", url); } catch (e) { /* file:// */ }
        draw();
      });
    }

    draw();
    wireAdds(grid);
  }

  /* -------------------------------------------------- a single product */
  function renderProduct() {
    var root = $("#productRoot");
    if (!root) return;

    var p = pranaliProductById(new URLSearchParams(window.location.search).get("id"));
    if (!p) {
      root.innerHTML =
        '<section class="section"><div class="shell">' +
          '<p class="section__label">The shop</p>' +
          '<h1 class="section__title">That item is not on the shelf</h1>' +
          '<p class="product-missing">The link may be old, or it may have sold through for the season.</p>' +
          '<p><a class="btn" href="shop.html">Back to the shop</a></p>' +
        '</div></section>';
      return;
    }

    document.title = p.name + " — Pranali Space";
    var cat = pranaliShopCategoryById(p.category);
    var low = p.stock && p.stock <= 10;

    var similar = PRANALI_PRODUCTS.filter(function (o) {
      return o.category === p.category && o.id !== p.id;
    }).slice(0, 3);

    root.innerHTML = '' +
    '<section class="item">' +
      '<div class="shell">' +
        '<p class="item__crumb">' +
          '<a href="index.html?element=earth">Earth</a> · ' +
          '<a href="shop.html">Shop</a> · ' +
          '<a href="shop.html?c=' + esc(p.category) + '">' + esc(cat ? cat.name : "") + '</a>' +
        '</p>' +
        '<div class="item__grid">' +
          '<figure class="item__media">' + media(p, "item__img") + '</figure>' +
          '<div class="item__text">' +
            '<p class="item__maker">' + esc(p.maker) + ' · ' + esc(p.origin) + '</p>' +
            '<h1 class="item__name">' + esc(p.name) + '</h1>' +
            '<p class="item__price">' + price(p.price) + ' <span>' + esc(p.unit) + '</span></p>' +
            '<p class="item__blurb">' + esc(p.blurb) + '</p>' +

            '<div class="item__buy">' +
              '<div class="qty" role="group" aria-label="Quantity">' +
                '<button type="button" class="qty__btn" data-step="-1" aria-label="One fewer">−</button>' +
                '<input class="qty__input" id="itemQty" type="number" inputmode="numeric" min="1" max="' + (p.stock || 99) + '" value="1" aria-label="Quantity" />' +
                '<button type="button" class="qty__btn" data-step="1" aria-label="One more">+</button>' +
              '</div>' +
              '<button type="button" class="btn item__add" id="itemAdd">Add to cart</button>' +
            '</div>' +
            '<p class="item__status" id="itemStatus" aria-live="polite">' +
              (low ? "Only " + p.stock + " left this season" : "In stock") +
            '</p>' +

            '<h2 class="item__sub">What it is</h2>' +
            '<ul class="item__details">' +
              p.details.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join("") +
            '</ul>' +
            '<p class="item__note">Made by ' + esc(p.maker) + ', ' + esc(p.origin) + '.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    (similar.length
      ? '<section class="section item-more">' +
          '<div class="shell">' +
            '<header class="section__head">' +
              '<p class="section__label">From the same shelf</p>' +
              '<h2 class="section__title">More ' + esc(cat ? cat.name.toLowerCase() : "") + '</h2>' +
            '</header>' +
            '<ul class="product-grid" id="similarGrid">' + similar.map(card).join("") + '</ul>' +
          '</div>' +
        '</section>'
      : '');

    var input = $("#itemQty");
    var max = p.stock || 99;
    function clampQty() {
      var v = parseInt(input.value, 10);
      input.value = String(isNaN(v) ? 1 : Math.max(1, Math.min(v, max)));
    }
    $$(".qty__btn", root).forEach(function (b) {
      b.addEventListener("click", function () {
        input.value = String((parseInt(input.value, 10) || 1) + Number(b.dataset.step));
        clampQty();
      });
    });
    input.addEventListener("change", clampQty);

    $("#itemAdd").addEventListener("click", function () {
      clampQty();
      var n = parseInt(input.value, 10);
      PranaliCart.add(p.id, n);
      $("#itemStatus").innerHTML = n + (n === 1 ? " is" : " are") +
        ' in your cart. <a href="cart.html">View cart</a>';
    });

    var sim = $("#similarGrid");
    if (sim) wireAdds(sim);
  }

  /* ------------------------------------------------------------ the cart */
  function renderCart() {
    var root = $("#cartRoot");
    if (!root) return;

    function draw() {
      var lines = PranaliCart.lines();
      if (!lines.length) {
        root.innerHTML =
          '<div class="cart-empty">' +
            '<p>Nothing in the cart yet.</p>' +
            '<a class="btn" href="shop.html">Go to the shop</a>' +
          '</div>';
        return;
      }

      var rows = lines.map(function (l) {
        var p = pranaliProductById(l.id);
        var href = "product.html?id=" + encodeURIComponent(p.id);
        return '' +
        '<li class="line">' +
          '<a class="line__media" href="' + href + '" tabindex="-1" aria-hidden="true">' + media(p, "line__img") + '</a>' +
          '<div class="line__text">' +
            '<p class="line__maker">' + esc(p.maker) + '</p>' +
            '<h2 class="line__name"><a href="' + href + '">' + esc(p.name) + '</a></h2>' +
            '<p class="line__unit">' + esc(p.unit) + ' · ' + price(p.price) + ' each</p>' +
          '</div>' +
          '<div class="qty qty--small" role="group" aria-label="Quantity of ' + esc(p.name) + '">' +
            '<button type="button" class="qty__btn" data-id="' + esc(p.id) + '" data-step="-1" aria-label="One fewer">−</button>' +
            '<span class="qty__value" aria-live="polite">' + l.qty + '</span>' +
            '<button type="button" class="qty__btn" data-id="' + esc(p.id) + '" data-step="1" aria-label="One more">+</button>' +
          '</div>' +
          '<p class="line__total">' + price(p.price * l.qty) + '</p>' +
          '<button type="button" class="line__remove" data-remove="' + esc(p.id) + '">Remove</button>' +
        '</li>';
      }).join("");

      root.innerHTML = '' +
        '<div class="cart">' +
          '<ul class="cart__lines">' + rows + '</ul>' +
          '<aside class="cart__summary">' +
            '<dl class="cart__sums">' +
              '<div><dt>Items</dt><dd>' + PranaliCart.count() + '</dd></div>' +
              '<div><dt>Subtotal</dt><dd>' + price(PranaliCart.subtotal()) + '</dd></div>' +
              '<div><dt>Delivery</dt><dd>Worked out at checkout</dd></div>' +
            '</dl>' +
            '<button type="button" class="btn cart__checkout" disabled>Checkout opens soon</button>' +
            '<p class="form-note">The shop isn’t taking orders yet — this cart is here for the design, and lives only in this browser.</p>' +
            '<a class="link-plain" href="shop.html">Keep looking</a>' +
          '</aside>' +
        '</div>';
    }

    root.addEventListener("click", function (ev) {
      var step = ev.target.closest("[data-step]");
      var rm = ev.target.closest("[data-remove]");
      if (step) {
        var id = step.dataset.id;
        var cur = 0;
        PranaliCart.lines().forEach(function (l) { if (l.id === id) cur = l.qty; });
        PranaliCart.set(id, cur + Number(step.dataset.step));
      } else if (rm) {
        PranaliCart.remove(rm.dataset.remove);
      }
    });

    PranaliCart.onChange(draw);
    draw();
  }

  function init() {
    renderHome();
    renderShop();
    renderProduct();
    renderCart();
  }

  return { init: init, price: price };
})();

document.addEventListener("DOMContentLoaded", function () { PranaliShop.init(); });
