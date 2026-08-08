(function () {
  'use strict';

  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    if (toggle.dataset.navBound) return;
    toggle.dataset.navBound = '1';

    function isOpen() {
      return links.classList.contains('is-open');
    }

    function openMenu() {
      links.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      links.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close after picking a destination.
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    // Close on outside click/tap.
    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (links.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    // Close on Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) closeMenu();
    });

    // If the viewport grows past the mobile breakpoint, reset state so the
    // menu doesn't stay "open" (and body scroll doesn't stay locked) once
    // the full desktop nav is showing again.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1180 && isOpen()) closeMenu();
    });
  }

  document.addEventListener('DOMContentLoaded', initNavToggle);
  // Nav is injected asynchronously by include.js — re-run once it lands.
  window.addEventListener('partials:loaded', initNavToggle);
})();
