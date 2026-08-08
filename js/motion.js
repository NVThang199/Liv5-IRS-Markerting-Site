(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    if (prefersReducedMotion) return;

    var targets = document.querySelectorAll('[data-reveal], [data-reveal-group]');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Auto-tag common sections for reveal ---------- */
  function autoTagReveal() {
    // Section headers
    document.querySelectorAll('.features-header').forEach(function (el) {
      el.setAttribute('data-reveal', '');
    });
    // Card grids — stagger children
    var groups = [
      '.problem-grid', '.segment-grid', '.partners-grid', '.team-grid',
      '.roadmap-track', '.stats-row', '.validation-facts'
    ];
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.setAttribute('data-reveal-group', '');
      });
    });
    // Standalone blocks
    var singles = [
      '.market-note', '.overview-shot', '.overview-legend',
      '.compare-scroll', '.compare-note', '.validation-visual',
      '.cta-panel'
    ];
    singles.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.setAttribute('data-reveal', '');
      });
    });
  }

  /* ---------- Smooth anchor scroll (custom easing) ---------- */
  // ease-in-out-cubic: slow start, fast middle, slow finish — gives a
  // more deliberate "pull" feel than the browser's native smooth scroll.
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetEl, duration) {
    var startY = window.pageYOffset;
    var targetY = startY + targetEl.getBoundingClientRect().top;
    var distance = targetY - startY;
    var startTime = null;

    // CSS scroll-behavior:smooth can fight our own rAF-driven scrolling
    // (each scrollTo() call gets its own smoothing pass). Suspend it for
    // the duration of the custom animation, then restore it.
    var htmlEl = document.documentElement;
    var previousScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        htmlEl.style.scrollBehavior = previousScrollBehavior;
      }
    }
    requestAnimationFrame(step);
  }

  function initAnchorScroll() {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      // Only handle same-page anchor jumps: "#id" or "current-page.html#id".
      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      var targetPage = href.slice(0, hashIndex);
      var currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (targetPage !== '' && targetPage !== currentPage) return;

      var id = href.slice(hashIndex + 1);
      if (!id) return;
      var targetEl = document.getElementById(id);
      if (!targetEl) return;

      e.preventDefault();
      smoothScrollTo(targetEl, 900);
    });
  }

  /* ---------- Page transition on internal nav clicks ---------- */
  function initPageTransition() {
    // A plain opacity crossfade (no translate/parallax) is considered safe
    // even under prefers-reduced-motion, so this stays enabled either way.
    var overlay = document.createElement('div');
    overlay.className = 'page-exit';
    document.body.appendChild(overlay);

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;
      if (!href.endsWith('.html') && !href.includes('.html#')) return;

      // Same-page anchor jumps are handled by initAnchorScroll's smooth
      // scroll — skip them here so the fade overlay never gets stuck.
      var currentPage = window.location.pathname.split('/').pop() || 'index.html';
      var targetPage = href.split('#')[0];
      if (targetPage === currentPage || targetPage === '') return;

      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(function () {
        window.location.href = href;
      }, 280);
    });
  }

  /* ---------- Neutralize <body>'s page-load animation once it's done ---------- */
  // <body> has a page-load animation (`page-in` in styles.css) that lifts +
  // fades the page in. Its animation-fill-mode:both keeps applying the
  // animation's end-state to <body> after it finishes — and on some mobile
  // browsers this still counts as <body> having a "transform", which turns
  // it into a CSS containing block for any position:fixed descendant
  // (the scroll-progress bar, the back-to-top button, the page-transition
  // overlay). Those elements then get positioned relative to the whole
  // document instead of the visible screen, so they scroll away instead of
  // staying pinned. Explicitly clearing the animation after it plays once
  // removes any ambiguity, on every browser, without touching how the
  // intro animation itself looks.
  function neutralizeBodyLoadAnimation() {
    function clear() {
      document.body.style.animation = 'none';
      document.body.style.transform = 'none';
    }
    document.body.addEventListener('animationend', function handler(e) {
      if (e.target !== document.body) return;
      clear();
      document.body.removeEventListener('animationend', handler);
    });
    // Fallback in case animationend never fires (e.g. some older mobile
    // browsers under certain conditions) — the intro animation is .45s,
    // so by 600ms it's always safe to clear.
    setTimeout(clear, 600);
  }

  document.addEventListener('DOMContentLoaded', function () {
    neutralizeBodyLoadAnimation();
    autoTagReveal();
    initScrollReveal();
    initAnchorScroll();
    initPageTransition();
  });

  // Re-run reveal tagging after nav/footer partials load, in case footer
  // content (e.g. footer columns) should also animate in future.
  window.addEventListener('partials:loaded', function () {
    autoTagReveal();
    initScrollReveal();
  });
})();
