/* ==========================================================================
   Pranali Space — the Courses page
   Category filtering, the always-free course, and the pretend join flow.
   ========================================================================== */

(function () {
  "use strict";

  var $  = PranaliSite.$;
  var $$ = PranaliSite.$$;
  var esc = PranaliSite.escapeHtml;

  var freeCourse = pranaliCourseById(PRANALI_FREE_COURSE_ID);
  var paidCourses = PRANALI_COURSES.filter(function (c) { return !c.free; });

  var activeCategory = "all";

  /* ------------------------------------------------------------ filters */

  function buildFilters() {
    var bar = $("#courseFilters");
    if (!bar) return;

    var counts = {};
    paidCourses.concat([freeCourse]).forEach(function (c) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    var buttons = [{ id: "all", name: "All courses", count: PRANALI_COURSES.length }]
      .concat(PRANALI_CATEGORIES.map(function (cat) {
        return { id: cat.id, name: cat.name, count: counts[cat.id] || 0 };
      }));

    bar.innerHTML = buttons.map(function (b) {
      return '<li>' +
        '<button type="button" class="filter-btn" data-filter="' + esc(b.id) + '"' +
        ' aria-pressed="' + (b.id === activeCategory) + '">' +
          esc(b.name) + ' <span class="filter-btn__count">' + b.count + '</span>' +
        '</button></li>';
    }).join("");

    bar.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".filter-btn");
      if (!btn) return;
      activeCategory = btn.dataset.filter;
      $$(".filter-btn", bar).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.filter === activeCategory));
      });
      renderCourses();
    });
  }

  /* ------------------------------------------------------- course cards */

  function accessLabel(course) {
    if (course.free) return { cls: "is-free", text: "Free · no account needed" };
    if (PranaliMembership.canAccess(course)) return { cls: "is-open", text: "Included in your membership" };
    return { cls: "is-locked", text: "Members only" };
  }

  function courseCard(course) {
    var cat = pranaliCategoryById(course.category);
    var access = accessLabel(course);
    var unlocked = course.free || PranaliMembership.canAccess(course);

    return '' +
    '<li class="course-card ' + access.cls + '" data-category="' + esc(course.category) + '">' +
      '<a class="course-card__media" href="course.html?id=' + esc(course.id) + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + esc(course.image) + '" alt="" loading="lazy" decoding="async" />' +
      '</a>' +
      '<div class="course-card__body">' +
        '<p class="course-card__cat">' + esc(cat ? cat.name : "") + '</p>' +
        '<h3 class="course-card__title">' +
          '<a href="course.html?id=' + esc(course.id) + '">' + esc(course.title) + '</a>' +
        '</h3>' +
        '<p class="course-card__sub">' + esc(course.subtitle) + '</p>' +
        '<p class="course-card__blurb">' + esc(course.blurb) + '</p>' +
        '<p class="course-card__meta">' +
          esc(course.teacher) + ' · ' + esc(course.place) + '<br />' +
          esc(course.duration) +
        '</p>' +
        '<div class="course-card__foot">' +
          '<span class="course-card__badge">' + esc(access.text) + '</span>' +
          (unlocked
            ? '<a class="btn btn--small" href="course.html?id=' + esc(course.id) + '">' +
                (course.free ? "Start free" : "Open course") + '</a>'
            : '<a class="btn btn--small btn--ghost" href="#pricing">View pricing</a>') +
        '</div>' +
      '</div>' +
    '</li>';
  }

  function renderFree() {
    var slot = $("#freeCourse");
    if (!slot || !freeCourse) return;
    var cat = pranaliCategoryById(freeCourse.category);

    slot.innerHTML = '' +
      '<article class="free-course">' +
        '<a class="free-course__media" href="course.html?id=' + esc(freeCourse.id) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(freeCourse.image) + '" alt="' + esc(freeCourse.imageAlt) + '" />' +
        '</a>' +
        '<div class="free-course__body">' +
          '<p class="free-course__flag">Always free · no account, no payment</p>' +
          '<p class="course-card__cat">' + esc(cat ? cat.name : "") + '</p>' +
          '<h3 class="free-course__title">' + esc(freeCourse.title) + '</h3>' +
          '<p class="free-course__sub">' + esc(freeCourse.subtitle) + '</p>' +
          '<p class="free-course__blurb">' + esc(freeCourse.blurb) + '</p>' +
          '<p class="course-card__meta">' +
            esc(freeCourse.teacher) + ' · ' + esc(freeCourse.place) + ' · ' + esc(freeCourse.duration) +
          '</p>' +
          '<div class="free-course__actions">' +
            '<a class="btn" href="course.html?id=' + esc(freeCourse.id) + '">Start the free course</a>' +
            '<a class="link-plain" href="#pricing">or see what membership opens</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderCourses() {
    var grid = $("#courseGrid");
    var empty = $("#courseEmpty");
    if (!grid) return;

    var shown = PRANALI_COURSES.filter(function (c) {
      if (c.free) return false;               // the free one has its own place above
      return activeCategory === "all" || c.category === activeCategory;
    });

    grid.innerHTML = shown.map(courseCard).join("");
    if (empty) empty.hidden = shown.length > 0;

    /* when a single category is chosen, say whether the free course is in it */
    var freeNote = $("#freeInCategory");
    if (freeNote) {
      var inThis = activeCategory === "all" || freeCourse.category === activeCategory;
      freeNote.hidden = !inThis;
    }
  }

  /* --------------------------------------------------------- pricing UI */

  function renderPlans() {
    var slot = $("#planGrid");
    if (!slot) return;

    var member = PranaliMembership.get();

    slot.innerHTML = PRANALI_PLANS.map(function (plan) {
      var current = member && member.planId === plan.id;
      return '' +
      '<li class="plan' + (plan.featured ? ' plan--featured' : '') + (current ? ' plan--current' : '') + '">' +
        (plan.featured ? '<p class="plan__flag">Most complete</p>' : '') +
        '<h3 class="plan__name">' + esc(plan.name) + '</h3>' +
        '<p class="plan__summary">' + esc(plan.summary) + '</p>' +
        '<p class="plan__price">' +
          '<span class="plan__amount">$' + plan.monthly + '</span>' +
          '<span class="plan__per">/ month</span>' +
        '</p>' +
        '<p class="plan__billed">Billed annually at $' + plan.yearly + '</p>' +
        '<ul class="plan__list">' +
          plan.includes.map(function (line) {
            return '<li>' + esc(line) + '</li>';
          }).join("") +
        '</ul>' +
        (current
          ? '<p class="plan__current-note">Your current demo plan</p>'
          : '<button type="button" class="btn' + (plan.featured ? '' : ' btn--ghost') + '" data-join="' + esc(plan.id) + '">' +
              'Choose ' + esc(plan.name) + '</button>') +
      '</li>';
    }).join("");

    slot.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-join]");
      if (!btn) return;
      openJoin(btn.dataset.join);
    });
  }

  function renderMemberPanel() {
    var slot = $("#memberPanel");
    if (!slot) return;

    var member = PranaliMembership.get();
    if (!member) { slot.hidden = true; return; }

    var plan = pranaliPlanById(member.planId);
    slot.hidden = false;

    var cats = member.categories.map(function (id) {
      var c = pranaliCategoryById(id);
      return c ? c.name : id;
    });

    slot.innerHTML =
      '<div class="member-panel__inner">' +
        '<p class="section__label">Your demo membership</p>' +
        '<h3 class="member-panel__title">' + esc(plan ? plan.name : "Member") + '</h3>' +
        '<p class="member-panel__cats">' +
          (plan && plan.categoryLimit === null
            ? "All five categories are open to you."
            : "Open to you: " + esc(cats.join(" and "))) +
        '</p>' +
        '<p class="member-panel__demo">This is a prototype. Nothing was charged and no account exists — ' +
          'the membership lives in this browser only, and clearing site data removes it.</p>' +
        '<div class="member-panel__actions">' +
          (plan && plan.categoryLimit !== null
            ? '<button type="button" class="btn btn--small btn--ghost" id="changeCats">Change my two categories</button>'
            : '') +
          '<button type="button" class="link-plain" id="endDemo">End demo membership</button>' +
        '</div>' +
      '</div>';

    var change = $("#changeCats");
    if (change) change.addEventListener("click", function () { openJoin(member.planId, true); });

    var end = $("#endDemo");
    if (end) end.addEventListener("click", function () {
      PranaliMembership.signOut();
      window.location.reload();
    });
  }

  /* ------------------------------------------------- the join "checkout"
     A deliberately obvious mock: it collects a name and an email so the
     interface has something to show, and collects nothing else. There is no
     password field and no card field, because a static page has nowhere safe
     to put either and a realistic-looking one would be worse than none. */

  var dialog, chosenPlanId, chosenCats, editingOnly;

  function openJoin(planId, editOnly) {
    chosenPlanId = planId;
    editingOnly = !!editOnly;
    var member = PranaliMembership.get();
    chosenCats = (editOnly && member) ? member.categories.slice() : [];
    buildDialog();
    dialog.showModal();
  }

  function buildDialog() {
    var plan = pranaliPlanById(chosenPlanId);
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "join-dialog";
      document.body.appendChild(dialog);
      dialog.addEventListener("click", function (ev) {
        if (ev.target === dialog) dialog.close();   // click the backdrop
      });
    }

    var needsCats = plan.categoryLimit !== null;
    var member = PranaliMembership.get();

    dialog.innerHTML = '' +
    '<form method="dialog" class="join" id="joinFlow" novalidate>' +
      '<button type="button" class="join__close" id="joinClose" aria-label="Close">&times;</button>' +

      '<p class="join__demo-flag">Prototype — no payment is taken and no account is created</p>' +

      '<h2 class="join__title">' + (editingOnly ? "Change your categories" : esc(plan.name)) + '</h2>' +

      (editingOnly ? '' :
        '<p class="join__price">$' + plan.monthly + ' / month, billed annually at $' + plan.yearly + '</p>') +

      (needsCats ?
        '<fieldset class="join__cats">' +
          '<legend>Choose your ' + plan.categoryLimit + ' categories</legend>' +
          '<p class="join__hint" id="catHint"></p>' +
          PRANALI_CATEGORIES.map(function (cat) {
            var on = chosenCats.indexOf(cat.id) !== -1;
            return '<label class="cat-pick' + (on ? ' is-on' : '') + '">' +
              '<input type="checkbox" value="' + esc(cat.id) + '"' + (on ? ' checked' : '') + ' />' +
              '<span class="cat-pick__name">' + esc(cat.name) + '</span>' +
              '<span class="cat-pick__blurb">' + esc(cat.blurb) + '</span>' +
            '</label>';
          }).join("") +
        '</fieldset>'
        : '<p class="join__all">All five categories are included — nothing to choose.</p>') +

      (editingOnly ? '' :
        '<div class="join__fields">' +
          '<div class="field">' +
            '<label for="joinName">Your name</label>' +
            '<input type="text" id="joinName" autocomplete="name" placeholder="How should we call you?" value="' +
              esc(member ? member.name : "") + '" />' +
          '</div>' +
          '<div class="field">' +
            '<label for="joinEmail">Email</label>' +
            '<input type="email" id="joinEmail" autocomplete="email" placeholder="you@example.com" value="' +
              esc(member ? member.email : "") + '" />' +
          '</div>' +
        '</div>' +
        '<div class="join__payment">' +
          '<p class="join__payment-title">Payment</p>' +
          '<p class="join__payment-note">A real checkout would appear here, handled by a payment provider. ' +
            'This prototype deliberately asks for no card details and no password.</p>' +
        '</div>') +

      '<div class="join__actions">' +
        '<button type="button" class="btn" id="joinConfirm">' +
          (editingOnly ? "Save categories" : "Start demo membership") +
        '</button>' +
        '<button type="button" class="link-plain" id="joinCancel">Cancel</button>' +
      '</div>' +

      (editingOnly ? '' :
        '<p class="join__bursary-note">Cannot afford this? ' +
          '<a href="#bursary">Ask about the reduced rate</a> — it is a real option, handled by a person.</p>') +
    '</form>';

    wireDialog(plan);
  }

  function wireDialog(plan) {
    var needsCats = plan.categoryLimit !== null;
    var confirmBtn = $("#joinConfirm", dialog);
    var hint = $("#catHint", dialog);

    function refreshHint() {
      if (!needsCats) return;
      var left = plan.categoryLimit - chosenCats.length;
      if (left > 0) {
        hint.textContent = "Choose " + left + " more.";
        hint.className = "join__hint";
        confirmBtn.disabled = true;
      } else {
        hint.textContent = "That is your " + plan.categoryLimit + ". Untick one to swap it.";
        hint.className = "join__hint is-ready";
        confirmBtn.disabled = false;
      }
    }

    if (needsCats) {
      $$(".cat-pick input", dialog).forEach(function (box) {
        box.addEventListener("change", function () {
          var id = box.value;
          var at = chosenCats.indexOf(id);

          if (box.checked) {
            if (chosenCats.length >= plan.categoryLimit) {
              box.checked = false;      // already at the limit — refuse politely
              hint.textContent = "That is " + plan.categoryLimit + " already. Untick one first.";
              hint.className = "join__hint is-full";
              return;
            }
            if (at === -1) chosenCats.push(id);
          } else if (at !== -1) {
            chosenCats.splice(at, 1);
          }
          box.closest(".cat-pick").classList.toggle("is-on", box.checked);
          refreshHint();
        });
      });
      refreshHint();
    }

    $("#joinClose", dialog).addEventListener("click", function () { dialog.close(); });
    $("#joinCancel", dialog).addEventListener("click", function () { dialog.close(); });

    confirmBtn.addEventListener("click", function () {
      if (editingOnly) {
        PranaliMembership.setCategories(chosenCats);
      } else {
        var name = ($("#joinName", dialog).value || "").trim();
        var email = ($("#joinEmail", dialog).value || "").trim();
        PranaliMembership.subscribe({
          planId: plan.id,
          name: name || "Member",
          email: email,
          categories: chosenCats
        });
      }
      dialog.close();
      showConfirmation();
    });
  }

  function showConfirmation() {
    renderPlans();
    renderMemberPanel();
    renderCourses();
    renderFree();

    var panel = $("#memberPanel");
    if (panel) {
      panel.classList.add("is-fresh");
      panel.scrollIntoView({ behavior: PranaliSite.reduceMotion ? "auto" : "smooth", block: "center" });
      window.setTimeout(function () { panel.classList.remove("is-fresh"); }, 2400);
    }
  }

  /* ---------------------------------------------------------------- boot */

  PranaliSite.init();
  buildFilters();
  renderFree();
  renderCourses();
  renderPlans();
  renderMemberPanel();

  /* deep link: courses.html#pricing?plan=tier2 is not a thing, but
     ?join=tier1 is handy for testing the flow */
  var params = new URLSearchParams(window.location.search);
  if (params.get("join") && pranaliPlanById(params.get("join"))) {
    openJoin(params.get("join"));
  }
})();
