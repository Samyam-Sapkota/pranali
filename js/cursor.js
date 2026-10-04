/* ==========================================================================
   Pranali Space — leaf cursor
   Replaces the pointer with a leaf that trails the mouse and turns to face
   the direction of travel. Self-contained, no libraries, no dependencies on
   anything else on the page.
   ========================================================================== */

(function () {
  "use strict";

  /* The leaf, resized for the job: it is drawn at 42-50px, so a 160px file
     covers even a 3x display. The 500px original stays in the repo as
     leaf.png. Change this one line to point somewhere else.
     Every page also preloads this, so the download starts with the HTML
     rather than waiting for this deferred script to run. */
  var IMAGE = "images/leaf-cursor.png";

  /* No cursor to replace on a touch screen, and a lagging image that follows
     taps would be worse than nothing. Leave the native cursor alone too. */
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  var SIZE        = window.matchMedia("(min-width: 1440px)").matches ? 50 : 42;
  var POS_EASE    = 0.18;   // fraction of the remaining distance per frame
  var ANGLE_EASE  = 0.12;
  var TURN_AFTER  = 3;      // px of travel before the angle is allowed to change

  /* Hide the real pointer everywhere. Injected rather than put in the
     stylesheet so that if this script does not run — an old browser, a
     blocked file — the native cursor is still there. */
  var style = document.createElement("style");
  style.textContent = "*, *::before, *::after { cursor: none !important; }";
  document.head.appendChild(style);

  var leaf = document.createElement("div");
  leaf.id = "leaf-cursor";
  leaf.style.cssText =
    "position:fixed;top:0;left:0;pointer-events:none;z-index:999999;" +
    "will-change:transform;opacity:0;transition:opacity 0.3s;" +
    "width:" + SIZE + "px;height:" + SIZE + "px;";

  var mouseX = 0, mouseY = 0;      // where the pointer actually is
  var curX   = 0, curY   = 0;      // where the leaf has got to
  var prevX  = 0, prevY  = 0;      // last point the angle was taken from
  var targetAngle = 0, curAngle = 0;
  var started = false;             // has the pointer been seen yet
  var ready   = false;             // has the image arrived yet

  var img = document.createElement("img");
  img.alt = "";
  img.draggable = false;
  img.decoding = "async";
  img.style.cssText = "width:100%;height:100%;display:block;pointer-events:none;";

  img.addEventListener("load", function () {
    ready = true;
    if (started) leaf.style.opacity = "1";
  });

  /* If the leaf never arrives, the page would be left with no pointer at all,
     because the native one is already hidden. Give it back rather than strand
     anyone with an invisible cursor. */
  img.addEventListener("error", function () {
    ready = false;
    if (style.parentNode) style.parentNode.removeChild(style);
    if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
  });

  img.src = IMAGE;
  leaf.appendChild(img);
  document.body.appendChild(leaf);

  /* Shortest way round: without wrapping the difference, going from 350 to 10
     degrees would spin the long way instead of crossing zero. */
  function lerpAngle(a, b, t) {
    var d = b - a;
    while (d > 180)  d -= 360;
    while (d < -180) d += 360;
    return a + d * t;
  }

  function snapTo(x, y) {
    mouseX = curX = prevX = x;
    mouseY = curY = prevY = y;
    /* only show once there is something to show, or the first thing you see
       is an empty box where the leaf will be */
    if (ready) leaf.style.opacity = "1";
  }

  document.addEventListener("mousemove", function (ev) {
    mouseX = ev.clientX;
    mouseY = ev.clientY;

    /* First sighting: start where the pointer is, so it does not sail in
       from the top-left corner. */
    if (!started) {
      started = true;
      snapTo(mouseX, mouseY);
      return;
    }

    var dx = mouseX - prevX;
    var dy = mouseY - prevY;

    /* Only re-aim once the pointer has actually gone somewhere. Taking the
       angle from every event makes the leaf twitch when the hand is still.
       The +90 suits a leaf drawn pointing up: travelling right is atan2 = 0,
       and a quarter turn clockwise puts the tip to the right. */
    if (Math.abs(dx) + Math.abs(dy) > TURN_AFTER) {
      targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      prevX = mouseX;
      prevY = mouseY;
    }
  });

  document.addEventListener("mouseleave", function () {
    leaf.style.opacity = "0";
  });

  document.addEventListener("mouseenter", function (ev) {
    started = true;
    snapTo(ev.clientX, ev.clientY);
  });

  function frame() {
    curX += (mouseX - curX) * POS_EASE;
    curY += (mouseY - curY) * POS_EASE;
    curAngle = lerpAngle(curAngle, targetAngle, ANGLE_EASE);

    /* Centred on the pointer: the leaf is symmetrical about its own middle
       and the artwork is centred in its canvas, so no hotspot offset is
       needed. Once the pointer stops, the leaf settles over the exact point
       a click will land on. */
    leaf.style.transform =
      "translate3d(" + (curX - SIZE / 2) + "px," + (curY - SIZE / 2) + "px,0) " +
      "rotate(" + curAngle + "deg)";

    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
})();
