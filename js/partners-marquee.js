(function () {
  'use strict';

  var SPEED_PX_PER_SEC = 34; // auto-scroll speed

  function initMarquee() {
    var viewport = document.getElementById('partners-marquee-viewport');
    var track = document.getElementById('partners-marquee-track');
    if (!viewport || !track || viewport.dataset.marqueeBound) return;
    viewport.dataset.marqueeBound = '1';

    // The track markup contains the item set duplicated twice back-to-back
    // (set A + set B) — halfWidth is the width of ONE set, i.e. the exact
    // distance we need to shift before seamlessly snapping back to 0,
    // since set B is a pixel-identical copy of set A at that offset.
    var halfWidth = track.scrollWidth / 2;
    var x = 0; // current translateX, always kept in [-halfWidth, 0]
    var lastTs = null;
    var dragging = false;
    var dragStartClientX = 0;
    var dragStartX = 0;
    var rafId = null;

    function wrap(value) {
      while (value <= -halfWidth) value += halfWidth;
      while (value > 0) value -= halfWidth;
      return value;
    }

    function apply() {
      track.style.transform = 'translateX(' + x + 'px)';
    }

    function frame(ts) {
      if (!dragging && viewport.classList.contains('is-scrolling')) {
        if (lastTs === null) lastTs = ts;
        var dt = (ts - lastTs) / 1000;
        lastTs = ts;
        x = wrap(x - SPEED_PX_PER_SEC * dt);
        apply();
      } else {
        lastTs = null;
      }
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }

    function updateScrollingState() {
      var viewportWidth = viewport.clientWidth;
      var shouldScroll = halfWidth > viewportWidth;
      viewport.classList.toggle('is-scrolling', shouldScroll);
      if (!shouldScroll) {
        x = 0;
        apply();
      }
      return shouldScroll;
    }

    function refreshHalfWidth() {
      var w = track.scrollWidth / 2;
      if (w > 0) halfWidth = w;
      updateScrollingState();
    }
    track.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', refreshHalfWidth);
    });
    window.addEventListener('resize', updateScrollingState);

    function onPointerDown(e) {
      if (!viewport.classList.contains('is-scrolling')) return;
      dragging = true;
      viewport.classList.add('is-dragging');
      dragStartClientX = e.clientX;
      dragStartX = x;
      viewport.setPointerCapture && viewport.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e) {
      if (!dragging) return;
      var delta = e.clientX - dragStartClientX;
      x = wrap(dragStartX + delta);
      apply();
    }
    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      viewport.releasePointerCapture && e.pointerId != null && viewport.releasePointerCapture(e.pointerId);
    }

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('pointerleave', function (e) {
      if (dragging && e.buttons === 0) onPointerUp(e);
    });

    apply();
    var willScroll = updateScrollingState();
    if (willScroll) start();
  }

  document.addEventListener('DOMContentLoaded', initMarquee);
  window.addEventListener('partials:loaded', initMarquee);
})();
