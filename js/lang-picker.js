(function () {
  'use strict';

  var STORAGE_KEY = 'liv5-lang';
  var DONT_SHOW_KEY = 'liv5-lang-dont-show';
  var SESSION_ASKED_KEY = 'liv5-lang-asked';

  function shouldSkipModal() {
    try {
      if (localStorage.getItem(DONT_SHOW_KEY) === '1') return true;
    } catch (e) {}
    try {
      // Already asked once this browser session (tab/window) — don't ask again
      // until the session ends, even without ticking "don't show again".
      if (sessionStorage.getItem(SESSION_ASKED_KEY) === '1') return true;
    } catch (e) {}
    return false;
  }

  function markAskedThisSession() {
    try {
      sessionStorage.setItem(SESSION_ASKED_KEY, '1');
    } catch (e) {}
  }

  function getSavedLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  // Vietnam flag: red field, yellow 5-point star (SVG, viewBox 30x20 = 3:2 ratio)
  var FLAG_VI =
    '<svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="30" height="20" fill="#DA251D"/>' +
      '<polygon points="15.00,4.00 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15.00,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15" fill="#FFCD00"/>' +
    '</svg>';

  // England flag: St George's Cross, red on white (SVG, viewBox 30x20 = 3:2 ratio)
  var FLAG_EN =
    '<svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="30" height="20" fill="#FFFFFF"/>' +
      '<rect x="12" y="0" width="6" height="20" fill="#CE1124"/>' +
      '<rect x="0" y="7" width="30" height="6" fill="#CE1124"/>' +
    '</svg>';

  function buildModal() {
    var backdrop = document.createElement('div');
    backdrop.className = 'lang-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Choose your language / Chọn ngôn ngữ');

    var savedLang = getSavedLang();

    backdrop.innerHTML =
      '<div class="lang-modal">' +
        '<h3>Chọn ngôn ngữ / Choose language</h3>' +
        '<p>Bạn muốn xem trang bằng ngôn ngữ nào? &nbsp;·&nbsp; Which language would you like to use?</p>' +
        '<div class="lang-modal-options">' +
          '<button type="button" class="lang-modal-btn' + (savedLang === 'vi' ? ' is-selected' : '') + '" data-lang="vi">' +
            '<span class="lang-modal-flag">' + FLAG_VI + '</span> Tiếng Việt' +
          '</button>' +
          '<button type="button" class="lang-modal-btn' + (savedLang === 'en' ? ' is-selected' : '') + '" data-lang="en">' +
            '<span class="lang-modal-flag">' + FLAG_EN + '</span> English' +
          '</button>' +
        '</div>' +
        '<label class="lang-modal-dontshow">' +
          '<input type="checkbox" id="lang-dont-show">' +
          '<span data-vi="Không hiển thị lại" data-en="Don\u2019t show this again">Không hiển thị lại</span>' +
        '</label>' +
      '</div>';

    return backdrop;
  }

  function showModal() {
    markAskedThisSession();

    // Defensive fix: <body> has a page-load animation (`page-in`) whose
    // fill-mode keeps applying its final transform value to <body> forever.
    // Any non-"none" transform on an ancestor turns it into a CSS
    // "containing block", which breaks position:fixed centering for this
    // modal (it ends up positioned relative to the full page instead of
    // the visible screen). Explicitly killing the animation + any leftover
    // transform on <html>/<body> guarantees this can't happen, regardless
    // of what CSS is actually deployed.
    document.documentElement.style.transform = 'none';
    document.body.style.animation = 'none';
    document.body.style.transform = 'none';

    var backdrop = buildModal();
    // Attach to <html> rather than <body> as an extra safety net — even if
    // something else on <body> re-introduces a transform later, this modal
    // still won't be affected by it.
    document.documentElement.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    // Make sure the modal's own text (e.g. the checkbox label) matches
    // whatever language is currently active on the page.
    if (window.Liv5Lang) {
      window.Liv5Lang.applyLang(window.Liv5Lang.getSavedLang());
    }

    // Trigger transition on next frame
    requestAnimationFrame(function () {
      backdrop.classList.add('is-open');
    });

    var checkbox = backdrop.querySelector('#lang-dont-show');

    backdrop.querySelectorAll('.lang-modal-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (window.Liv5Lang) window.Liv5Lang.applyLang(lang);

        try {
          if (checkbox && checkbox.checked) {
            localStorage.setItem(DONT_SHOW_KEY, '1');
          } else {
            localStorage.removeItem(DONT_SHOW_KEY);
          }
        } catch (e) {}

        closeModal(backdrop);
      });
    });
  }

  function closeModal(backdrop) {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }, 300);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!shouldSkipModal()) {
      showModal();
    }
  });
})();
