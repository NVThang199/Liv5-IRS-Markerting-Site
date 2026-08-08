(function () {
  'use strict';

  function initGalleryFilter() {
    var filterBar = document.getElementById('gallery-filters');
    var grid = document.getElementById('gallery-grid');
    var emptyNote = document.getElementById('gallery-empty-note');
    if (!filterBar || !grid || filterBar.dataset.galleryFilterBound) return;
    filterBar.dataset.galleryFilterBound = '1';

    var items = grid.querySelectorAll('.gallery-item');

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.gallery-filter-btn');
      if (!btn) return;

      filterBar.querySelectorAll('.gallery-filter-btn').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });

      var filter = btn.getAttribute('data-filter');
      var visibleCount = 0;

      items.forEach(function (item) {
        var tags = (item.getAttribute('data-tag') || '').split(' ');
        var show = filter === 'all' || tags.indexOf(filter) !== -1;
        item.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      if (emptyNote) emptyNote.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', initGalleryFilter);
  window.addEventListener('partials:loaded', initGalleryFilter);
})();
