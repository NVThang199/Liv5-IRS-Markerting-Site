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
    if (!target) return Promise.resolve();
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + url + ': ' + res.status);
        return res.text();
      })
      .then(function (html) {
        target.outerHTML = html;
      })
      .catch(function (err) {
        console.error(err);
        target.innerHTML = '<p style="padding:16px;color:#EF4444;">Không tải được ' + url + '. Trang này cần chạy qua một web server (không thể mở trực tiếp bằng file://).</p>';
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
      loadPartial('#nav-placeholder', 'partials/nav.html'),
      loadPartial('#footer-placeholder', 'partials/footer.html')
    ]).then(function () {
      markActiveNavLink();
      if (window.Liv5Lang) window.Liv5Lang.init();
      window.dispatchEvent(new CustomEvent('partials:loaded'));
    });
  });
})();
