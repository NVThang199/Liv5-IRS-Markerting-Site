(function () {
  'use strict';

  // Link Web App sau khi deploy Google Apps Script (xem hướng dẫn deploy đi kèm).
  // Dạng: 'https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXX/exec'
  var ENDPOINT_URL = 'https://script.google.com/macros/s/REPLACE_WITH_REAL_DEPLOYMENT_ID/exec';

  var MSG = {
    sending:   { vi: 'Đang gửi…',                                   en: 'Sending…' },
    success:   { vi: 'Đã gửi! Chúng tôi sẽ liên hệ lại sớm nhất.',   en: 'Sent! We\u2019ll get back to you soon.' },
    error:     { vi: 'Gửi không thành công. Vui lòng thử lại hoặc liên hệ trực tiếp qua email/điện thoại bên trái.', en: 'Something went wrong. Please try again or contact us directly via the email/phone on the left.' },
    notReady:  { vi: 'Biểu mẫu chưa sẵn sàng — vui lòng liên hệ trực tiếp qua email/điện thoại bên trái.', en: 'The form isn\u2019t ready yet — please contact us directly via the email/phone on the left.' }
  };

  function getLang() {
    return (window.Liv5Lang && window.Liv5Lang.getSavedLang()) || 'vi';
  }

  function setStatus(el, key, cls) {
    if (!el) return;
    var lang = getLang();
    el.textContent = MSG[key][lang] || MSG[key].vi;
    el.className = 'form-status' + (cls ? ' ' + cls : '');
  }

  function setFieldError(fieldEl, hasError) {
    if (!fieldEl) return;
    fieldEl.classList.toggle('has-error', hasError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate(fields) {
    var valid = true;

    var nameOk = fields.name.value.trim().length > 0;
    setFieldError(fields.nameField, !nameOk);
    if (!nameOk) valid = false;

    var emailOk = isValidEmail(fields.email.value.trim());
    setFieldError(fields.emailField, !emailOk);
    if (!emailOk) valid = false;

    var messageOk = fields.message.value.trim().length > 0;
    setFieldError(fields.messageField, !messageOk);
    if (!messageOk) valid = false;

    return valid;
  }

  function initContactForm() {
    var form = document.getElementById('cf-form');
    if (!form || form.dataset.contactFormBound) return;
    form.dataset.contactFormBound = '1';

    var submitBtn = document.getElementById('cf-submit');
    var statusEl = document.getElementById('cf-status');

    var fields = {
      name: document.getElementById('cf-name'),
      email: document.getElementById('cf-email'),
      phone: document.getElementById('cf-phone'),
      message: document.getElementById('cf-message'),
      nameField: document.getElementById('cf-field-name'),
      emailField: document.getElementById('cf-field-email'),
      messageField: document.getElementById('cf-field-message')
    };

    // Clear the error state on a field as soon as the user starts fixing it.
    [fields.name, fields.email, fields.message].forEach(function (input) {
      input.addEventListener('input', function () {
        input.closest('.form-field').classList.remove('has-error');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (statusEl) statusEl.className = 'form-status';

      if (!validate(fields)) {
        return;
      }

      if (!ENDPOINT_URL || ENDPOINT_URL.indexOf('REPLACE_WITH_REAL_DEPLOYMENT_ID') !== -1) {
        setStatus(statusEl, 'notReady', 'is-error');
        return;
      }

      var payload = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        phone: fields.phone.value.trim(),
        message: fields.message.value.trim(),
        lang: getLang(),
        page: window.location.href,
        submittedAt: new Date().toISOString()
      };

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      setStatus(statusEl, 'sending');

      // Note: no explicit Content-Type header is set on purpose. This keeps
      // the request a CORS "simple request" (avoids a preflight OPTIONS
      // call, which Apps Script web apps don't handle), while Apps Script
      // still reads the JSON fine from e.postData.contents server-side.
      fetch(ENDPOINT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || data.result !== 'success') throw new Error('Unexpected response');
          setStatus(statusEl, 'success', 'is-success');
          form.reset();
        })
        .catch(function () {
          setStatus(statusEl, 'error', 'is-error');
        })
        .finally(function () {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        });
    });
  }

  document.addEventListener('DOMContentLoaded', initContactForm);
  window.addEventListener('partials:loaded', initContactForm);
})();
