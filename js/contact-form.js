(function () {
  'use strict';

  // TODO: thay bằng link Google Form thật khi đã tạo xong.
  // Ví dụ: 'https://forms.gle/xxxxxxxxxxxx'
  var GOOGLE_FORM_URL = 'https://forms.gle/REPLACE_WITH_REAL_FORM_LINK';

  function getLang() {
    return (window.Liv5Lang && window.Liv5Lang.getSavedLang()) || 'vi';
  }

  function initGoToFormButton() {
    var btn = document.getElementById('cf-submit');
    if (!btn || btn.dataset.contactFormBound) return;
    btn.dataset.contactFormBound = '1';

    btn.addEventListener('click', function () {
      var lang = getLang();
      var statusEl = document.getElementById('cf-status');

      btn.classList.add('is-loading');
      btn.disabled = true;
      if (statusEl) {
        statusEl.textContent = lang === 'en' ? 'Opening the form…' : 'Đang mở biểu mẫu…';
        statusEl.className = 'form-status';
      }

      setTimeout(function () {
        window.open(GOOGLE_FORM_URL, '_blank', 'noopener');
        btn.classList.remove('is-loading');
        btn.disabled = false;
        if (statusEl) {
          statusEl.textContent = lang === 'en' ? 'Opened in a new tab.' : 'Đã mở ở tab mới.';
          statusEl.className = 'form-status is-success';
        }
      }, 350);
    });
  }

  document.addEventListener('DOMContentLoaded', initGoToFormButton);
  window.addEventListener('partials:loaded', initGoToFormButton);
})();

