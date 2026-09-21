/* ==========================================================================
   Pranali Space — DEMO membership only
   --------------------------------------------------------------------------
   There is no backend and no real authentication here. This file fakes the
   shape of a membership so the interface can be designed and clicked through:
   a "member" is just an object in localStorage, and anyone who opens devtools
   can award themselves any tier they like.

   Deliberately, there is NO password field anywhere in this prototype. A
   static page collecting a password would look exactly like a real one, and
   nothing here could store it safely. When a real backend arrives, sign-in
   moves there and this file is deleted rather than extended.
   ========================================================================== */

var PranaliMembership = (function () {
  "use strict";

  var KEY = "pranali:demo-member";
  var listeners = [];

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;   // private mode, blocked storage, or corrupt JSON
    }
  }

  function write(member) {
    try {
      if (member) window.localStorage.setItem(KEY, JSON.stringify(member));
      else window.localStorage.removeItem(KEY);
    } catch (e) { /* nothing we can do, and nothing important is lost */ }
    listeners.forEach(function (fn) { fn(member); });
  }

  return {
    /** The current pretend member, or null. */
    get: function () { return read(); },

    isMember: function () { return !!read(); },

    /** Pretend to take a subscription. No payment, no account, no network. */
    subscribe: function (details) {
      var plan = pranaliPlanById(details.planId);
      if (!plan) return null;

      var categories;
      if (plan.categoryLimit === null) {
        categories = PRANALI_CATEGORIES.map(function (c) { return c.id; });
      } else {
        categories = (details.categories || []).slice(0, plan.categoryLimit);
      }

      var member = {
        name: details.name || "Member",
        email: details.email || "",
        planId: plan.id,
        categories: categories,
        startedAt: new Date().toISOString(),
        demo: true
      };
      write(member);
      return member;
    },

    /** Change the two chosen categories on the lower tier. */
    setCategories: function (categories) {
      var member = read();
      if (!member) return null;
      var plan = pranaliPlanById(member.planId);
      if (!plan || plan.categoryLimit === null) return member;
      member.categories = categories.slice(0, plan.categoryLimit);
      write(member);
      return member;
    },

    signOut: function () { write(null); },

    plan: function () {
      var member = read();
      return member ? pranaliPlanById(member.planId) : null;
    },

    /**
     * Can the current visitor open this course?
     * The free course is true for everybody, logged in or not.
     */
    canAccess: function (course) {
      if (!course) return false;
      if (course.free) return true;

      var member = read();
      if (!member) return false;

      var plan = pranaliPlanById(member.planId);
      if (!plan) return false;
      if (plan.categoryLimit === null) return true;

      return member.categories.indexOf(course.category) !== -1;
    },

    /** Why access was refused — drives the message on the paywall. */
    reason: function (course) {
      if (!course || course.free) return null;
      if (!read()) return "no-membership";
      return this.canAccess(course) ? null : "wrong-categories";
    },

    onChange: function (fn) { listeners.push(fn); }
  };
})();
