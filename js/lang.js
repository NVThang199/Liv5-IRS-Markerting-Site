(function () {
  'use strict';

  var STORAGE_KEY = 'liv5-lang';

  function applyLang(lang) {
    var translatable = document.querySelectorAll('[data-vi][data-en]');
    translatable.forEach(function (el) {
      var text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-vi');
      if (text !== null) el.textContent = text;
    });

    var translatableHtml = document.querySelectorAll('[data-vi-html][data-en-html]');
    translatableHtml.forEach(function (el) {
      var html = lang === 'en' ? el.getAttribute('data-en-html') : el.getAttribute('data-vi-html');
      if (html !== null) el.innerHTML = html;
    });

    var langButtons = document.querySelectorAll('.lang');
    langButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'vi');
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function getSavedLang() {
    var saved = 'vi';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'vi'; } catch (e) {}
    return saved;
  }

  function initLangToggle() {
    var langButtons = document.querySelectorAll('.lang');
    langButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'));
      });
    });
    applyLang(getSavedLang());
  }

  // Expose so include.js can re-run this after nav/footer are injected.
  window.Liv5Lang = {
    applyLang: applyLang,
    getSavedLang: getSavedLang,
    init: initLangToggle
  };

  // If nav/footer are already in the DOM (no fetch-include needed), init immediately.
  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.lang')) {
      initLangToggle();
    }
  });
})();
