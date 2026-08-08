(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = !(window.matchMedia && window.matchMedia('(hover: none)').matches);

  /* ---------- Scroll progress bar + nav elevation ---------- */
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress-bar');
    var nav = document.querySelector('.nav');
    if (!bar && !nav) return;

    function update() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (bar) bar.style.width = pct + '%';
      if (nav) nav.classList.toggle('is-scrolled', scrollTop > 8);
    }
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Back-to-top button ---------- */
  // ease-in-out-cubic: slow start, fast middle, slow finish — same easing
  // used for anchor-link scrolling in motion.js, kept local here so this
  // file doesn't depend on load order relative to motion.js.
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scrollToTopSmooth(duration) {
    var startY = window.pageYOffset || document.documentElement.scrollTop;
    if (startY <= 0) return;
    var startTime = null;

    // Suspend CSS scroll-behavior:smooth for the duration of the custom
    // animation so it doesn't fight our own rAF-driven scrolling.
    var htmlEl = document.documentElement;
    var previousScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY * (1 - easeInOutCubic(progress)));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        htmlEl.style.scrollBehavior = previousScrollBehavior;
      }
    }
    requestAnimationFrame(step);
  }

  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn || btn.dataset.backToTopBound) return;
    btn.dataset.backToTopBound = '1';

    function update() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      btn.classList.toggle('is-visible', scrollTop > 600);
    }
    document.addEventListener('scroll', update, { passive: true });
    btn.addEventListener('click', function () {
      // Intentionally always smooth, even under prefers-reduced-motion:
      // this is a deliberate, user-initiated single action (not looping/
      // parallax motion), so we don't gate it behind that OS setting.
      scrollToTopSmooth(700);
    });
    update();
  }

  /* ---------- Cursor-follow spotlight on cards & image frames ---------- */
  function initSpotlight() {
    if (prefersReducedMotion || !hasHover) return;
    var selector = [
      '.problem-card', '.segment-card', '.partner-card', '.team-card',
      '.roadmap-item', '.feat-visual .ph-filled', '.validation-visual .ph-filled',
      '.overview-img-wrap'
    ].join(',');

    document.querySelectorAll(selector).forEach(function (el) {
      if (el.dataset.spotBound) return;
      el.dataset.spotBound = '1';
      el.classList.add('spot');
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--spot-x', x + '%');
        el.style.setProperty('--spot-y', y + '%');
      });
    });
  }

  /* ---------- Animated count-up numbers (hero stats) ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 1100;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = prefix + Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target;
      }
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var targets = document.querySelectorAll('.count-target');
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.textContent = (el.getAttribute('data-prefix') || '') + el.getAttribute('data-count');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Hero glow blobs drift toward the pointer ---------- */
  function initGlowParallax() {
    if (prefersReducedMotion || !hasHover) return;
    var hero = document.querySelector('.hero-visual');
    if (!hero || hero.dataset.parallaxBound) return;
    hero.dataset.parallaxBound = '1';

    var blobs = hero.querySelectorAll('.glow-blob');
    if (!blobs.length) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      blobs.forEach(function (blob, i) {
        var strength = i % 2 === 0 ? 18 : -14;
        blob.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      });
    });
    hero.addEventListener('mouseleave', function () {
      blobs.forEach(function (blob) { blob.style.transform = ''; });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initBackToTop();
    initSpotlight();
    initCounters();
    initGlowParallax();
  });

  // Nav/footer are injected asynchronously by include.js — re-run once they land.
  window.addEventListener('partials:loaded', function () {
    initScrollProgress();
    initBackToTop();
    initSpotlight();
  });
})();
