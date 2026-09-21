/* ==========================================================================
   Pranali Space — a single course
   The free course renders in full. Everything else renders its shape — the
   real lesson list, the teacher, the length — and stops at a paywall, so a
   visitor can see exactly what they would be paying for.
   ========================================================================== */

(function () {
  "use strict";

  var $ = PranaliSite.$;
  var esc = PranaliSite.escapeHtml;

  var params = new URLSearchParams(window.location.search);
  var course = pranaliCourseById(params.get("id") || PRANALI_FREE_COURSE_ID);
  var root = $("#courseRoot");

  if (!course) {
    root.innerHTML =
      '<div class="shell course-missing">' +
        '<h1 class="section__title">That course is not here</h1>' +
        '<p>The link may be old, or the course may have been renamed.</p>' +
        '<p><a class="btn" href="courses.html">Back to all courses</a></p>' +
      '</div>';
    PranaliSite.init();
    return;
  }

  document.title = course.title + " — Pranali Space";

  var cat = pranaliCategoryById(course.category);
  var unlocked = PranaliMembership.canAccess(course);
  var why = PranaliMembership.reason(course);

  /* ------------------------------------------------------------- header */

  var hero = course.hero || course.image;

  var head = '' +
  '<header class="course-hero' + (course.free ? ' course-hero--free' : '') + '">' +
    '<div class="shell course-hero__inner">' +
      '<div class="course-hero__text">' +
        '<p class="course-hero__crumb">' +
          '<a href="courses.html">Courses</a> · ' + esc(cat ? cat.name : "") +
        '</p>' +
        (course.free
          ? '<p class="free-course__flag">Always free · no account, no payment</p>'
          : '<p class="course-hero__flag' + (unlocked ? ' is-open' : '') + '">' +
              (unlocked ? "Included in your membership" : "Members only") + '</p>') +
        '<h1 class="course-hero__title">' + esc(course.title) + '</h1>' +
        '<p class="course-hero__sub">' + esc(course.subtitle) + '</p>' +
        '<p class="course-hero__blurb">' + esc(course.blurb) + '</p>' +
        '<dl class="course-facts">' +
          '<div><dt>Taught by</dt><dd>' + esc(course.teacher) + '</dd></div>' +
          '<div><dt>From</dt><dd>' + esc(course.place) + '</dd></div>' +
          '<div><dt>Length</dt><dd>' + esc(course.duration) + '</dd></div>' +
          '<div><dt>Level</dt><dd>' + esc(course.level) + '</dd></div>' +
        '</dl>' +
      '</div>' +
      '<figure class="course-hero__media">' +
        '<img src="' + esc(hero) + '" alt="' + esc(course.imageAlt || "") + '" />' +
      '</figure>' +
    '</div>' +
  '</header>';

  /* -------------------------------------------------------------- body */

  var body;

  if (unlocked) {
    var about = (course.about || []).map(function (p) {
      return '<p>' + esc(p) + '</p>';
    }).join("");

    var lessons = course.modules.map(function (m, i) {
      var n = String(i + 1).padStart(2, "0");
      var hasBody = !!m.body;
      return '' +
      '<li class="lesson">' +
        '<details' + (i === 0 ? ' open' : '') + '>' +
          '<summary>' +
            '<span class="lesson__num">' + n + '</span>' +
            '<span class="lesson__title">' + esc(m.title) + '</span>' +
            '<span class="lesson__len">' + esc(m.length) + '</span>' +
          '</summary>' +
          '<div class="lesson__body">' +
            (m.summary ? '<p class="lesson__summary">' + esc(m.summary) + '</p>' : '') +
            (hasBody
              ? m.body.split("\n\n").map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("")
              : '<p class="lesson__placeholder">Lesson material for this course is not part of the ' +
                'front-end prototype — only the free course carries its full text.</p>') +
          '</div>' +
        '</details>' +
      '</li>';
    }).join("");

    body = '' +
    '<div class="shell course-body">' +
      (about ? '<div class="course-about"><h2 class="course-h2">About this course</h2>' + about + '</div>' : '') +
      '<div class="course-lessons">' +
        '<h2 class="course-h2">Lessons</h2>' +
        '<ol class="lessons">' + lessons + '</ol>' +
      '</div>' +
      (course.free
        ? '<aside class="course-after">' +
            '<p class="section__label">After this</p>' +
            '<h2 class="course-h2">The rest of the library</h2>' +
            '<p>Fifteen more courses across five categories, taught by the people doing the work. ' +
              'Membership starts at $9 a month, billed annually.</p>' +
            '<p><a class="btn" href="courses.html#pricing">See membership</a> ' +
              '<a class="link-plain" href="courses.html">Browse all courses</a></p>' +
          '</aside>'
        : '') +
    '</div>';

  } else {
    /* locked: show the real shape of the course, then the wall */
    var lockedList = course.modules.map(function (m, i) {
      var n = String(i + 1).padStart(2, "0");
      return '<li class="lesson lesson--locked">' +
        '<span class="lesson__num">' + n + '</span>' +
        '<span class="lesson__title">' + esc(m.title) + '</span>' +
        '<span class="lesson__len">' + esc(m.length) + '</span>' +
      '</li>';
    }).join("");

    var wallTitle, wallCopy, wallActions;

    if (why === "wrong-categories") {
      var plan = PranaliMembership.plan();
      wallTitle = "Not in your two categories";
      wallCopy = "Your " + esc(plan ? plan.name : "membership") + " covers two categories, and " +
        esc(cat ? cat.name : "this one") + " is not currently one of them. You can swap your " +
        "categories, or move up to full access.";
      wallActions =
        '<a class="btn" href="courses.html#pricing">Change or upgrade</a>' +
        '<a class="link-plain" href="course.html?id=' + esc(PRANALI_FREE_COURSE_ID) + '">Read the free course</a>';
    } else {
      wallTitle = "This course is for members";
      wallCopy = "Membership opens the full lesson material, the discussion around it, and the live " +
        "sessions with teachers. One course stays free and public for anyone who wants to see how we work first.";
      wallActions =
        '<a class="btn" href="courses.html#pricing">See membership — from $9/month</a>' +
        '<a class="link-plain" href="course.html?id=' + esc(PRANALI_FREE_COURSE_ID) + '">Start the free course instead</a>';
    }

    body = '' +
    '<div class="shell course-body">' +
      '<div class="course-lessons">' +
        '<h2 class="course-h2">What is inside</h2>' +
        '<p class="course-locked-note">The full lesson list, so you know what membership actually buys.</p>' +
        '<ol class="lessons lessons--locked">' + lockedList + '</ol>' +
      '</div>' +
      '<aside class="paywall">' +
        '<span class="paywall__mark" aria-hidden="true"></span>' +
        '<h2 class="paywall__title">' + wallTitle + '</h2>' +
        '<p class="paywall__copy">' + wallCopy + '</p>' +
        '<div class="paywall__actions">' + wallActions + '</div>' +
        '<p class="paywall__bursary">On a low income or a student? ' +
          '<a href="courses.html#bursary">Ask about the reduced rate.</a></p>' +
      '</aside>' +
    '</div>';
  }

  root.innerHTML = head + body;
  PranaliSite.init();
})();
