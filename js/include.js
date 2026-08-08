(function () {
  'use strict';

  function markActiveNavLink() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === current) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  function loadPartial(selector, url) {
    var target = document.querySelector(selector);
    if (!target) {
      console.log('[include.js] target not found for selector', selector);
      return Promise.resolve();
    }
    console.log('[include.js] fetching', url);
    return fetch(url)
      .then(function (res) {
        console.log('[include.js] fetch response for', url, '-> status', res.status, res.ok ? 'OK' : 'FAILED');
        if (!res.ok) throw new Error('Failed to load ' + url + ': ' + res.status);
        return res.text();
      })
      .then(function (html) {
        console.log('[include.js] injected', url, '(' + html.length + ' chars) into', selector);
        target.outerHTML = html;
      })
      .catch(function (err) {
        console.error('[include.js] ERROR loading', url, err);
        target.innerHTML = '<p style="padding:16px;color:#EF4444;">Không tải được ' + url + '. Trang này cần chạy qua một web server (không thể mở trực tiếp bằng file://).</p>';
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    console.log('[include.js] DOMContentLoaded, starting partial loads');
    // Cache-busting query param: bump this (or generate it dynamically)
    // whenever partials/nav.html or partials/footer.html change, so
    // browsers/CDN don't keep serving a stale cached copy after a deploy.
    var CACHE_BUST = 'v=20260808v5';
    Promise.all([
      loadPartial('#nav-placeholder', 'partials/nav.html?' + CACHE_BUST),
      loadPartial('#footer-placeholder', 'partials/footer.html?' + CACHE_BUST)
    ]).then(function () {
      console.log('[include.js] both partials settled, dispatching partials:loaded');
      markActiveNavLink();
      if (window.Liv5Lang) window.Liv5Lang.init();
      window.dispatchEvent(new CustomEvent('partials:loaded'));
    });
  });
})();
