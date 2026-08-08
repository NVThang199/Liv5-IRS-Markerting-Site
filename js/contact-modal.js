(function () {
  'use strict';
  console.log('[contact-modal.js] loaded and parsed');

  function buildModal() {
    var backdrop = document.createElement('div');
    backdrop.className = 'contact-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Contact information');

    backdrop.innerHTML =
      '<div class="contact-modal">' +
        '<button type="button" class="contact-modal-close" aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
        '<div class="contact-modal-eyebrow contact-modal-stagger" style="--stagger-i:0" data-vi="Liên hệ hợp tác" data-en="Get in touch">Liên hệ hợp tác</div>' +
        '<h3 class="contact-modal-stagger" style="--stagger-i:1" data-vi="Liên hệ với chúng tôi" data-en="Contact us">Liên hệ với chúng tôi</h3>' +
        '<p class="contact-modal-stagger" style="--stagger-i:2" data-vi="Đội ngũ Liv5 Solutions sẵn sàng tư vấn và trao đổi trực tiếp với bạn." data-en="The Liv5 Solutions team is ready to talk and advise you directly.">Đội ngũ Liv5 Solutions sẵn sàng tư vấn và trao đổi trực tiếp với bạn.</p>' +
        '<div class="contact-modal-card contact-modal-stagger" style="--stagger-i:3">' +
          '<div class="contact-modal-avatar">PQ</div>' +
          '<div class="contact-modal-person">' +
            '<div class="contact-modal-name">Phạm Văn Quân</div>' +
            '<div class="contact-modal-role" data-vi="Head of Project" data-en="Head of Project">Head of Project</div>' +
          '</div>' +
        '</div>' +
        '<ul class="contact-modal-list">' +
          '<li class="contact-modal-stagger" style="--stagger-i:4">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>' +
            '<div>' +
              '<div class="contact-modal-label" data-vi="Email" data-en="Email">Email</div>' +
              '<a href="mailto:phamvanquana@yahoo.com">phamvanquana@yahoo.com</a>' +
            '</div>' +
          '</li>' +
          '<li class="contact-modal-stagger" style="--stagger-i:5">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
            '<div>' +
              '<div class="contact-modal-label" data-vi="Điện thoại" data-en="Phone">Điện thoại</div>' +
              '<a href="tel:+84889449560">+84 889 449 560</a>' +
            '</div>' +
          '</li>' +
          '<li class="contact-modal-stagger" style="--stagger-i:6">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            '<div>' +
              '<div class="contact-modal-label" data-vi="Đơn vị" data-en="Studio">Đơn vị</div>' +
              '<span data-vi="Liv5Solutions — Hà Nội, Việt Nam" data-en="Liv5Solutions — Hanoi, Vietnam">Liv5Solutions — Hà Nội, Việt Nam</span>' +
            '</div>' +
          '</li>' +
        '</ul>' +
      '</div>';

    return backdrop;
  }

  function closeModal(backdrop) {
    backdrop.classList.remove('is-revealed');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }, 280);
  }

  function showModal() {
    console.log('[contact-modal.js] showModal() called');
    var backdrop = buildModal();
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    // Match whichever language is currently active on the page.
    if (window.Liv5Lang) {
      window.Liv5Lang.applyLang(window.Liv5Lang.getSavedLang());
    }

    requestAnimationFrame(function () {
      backdrop.classList.add('is-open');
      requestAnimationFrame(function () {
        backdrop.classList.add('is-revealed');
      });
    });

    backdrop.querySelector('.contact-modal-close').addEventListener('click', function () {
      closeModal(backdrop);
    });
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal(backdrop);
    });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal(backdrop);
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  function initTriggers() {
    var found = document.querySelectorAll('[data-contact-trigger]');
    console.log('[contact-modal.js] initTriggers() ran, found', found.length, 'element(s):', found);
    found.forEach(function (el) {
      if (el.dataset.contactBound) {
        console.log('[contact-modal.js] element already bound, skipping', el);
        return;
      }
      el.dataset.contactBound = '1';
      console.log('[contact-modal.js] binding click listener to', el);
      el.addEventListener('click', function (e) {
        console.log('[contact-modal.js] click event fired on trigger element');
        e.preventDefault();
        showModal();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    console.log('[contact-modal.js] DOMContentLoaded fired, running initTriggers');
    initTriggers();
  });
  // Nav/footer are injected asynchronously — re-scan once they land.
  window.addEventListener('partials:loaded', function () {
    console.log('[contact-modal.js] partials:loaded event received, re-running initTriggers');
    initTriggers();
  });
})();
