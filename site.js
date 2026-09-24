// Finto Films — small progressive enhancements (site works without JS)
(function () {
  // Header background once scrolled
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Click-to-play YouTube (loads the player only when asked)
  document.querySelectorAll('[data-youtube]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-youtube');
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('aria-label') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      btn.replaceWith(f);
    });
  });

  // Lightbox for stills
  var figs = Array.prototype.slice.call(document.querySelectorAll('.stills figure'));
  if (!figs.length) return;
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Film still viewer');
  lb.innerHTML =
    '<img alt="">' +
    '<button class="lb-close" aria-label="Close">Close ✕</button>' +
    '<button class="lb-prev" aria-label="Previous">‹</button>' +
    '<button class="lb-next" aria-label="Next">›</button>' +
    '<div class="lb-count"></div>';
  document.body.appendChild(lb);
  var img = lb.querySelector('img'), count = lb.querySelector('.lb-count'), idx = 0, lastFocus;

  function show(i) {
    idx = (i + figs.length) % figs.length;
    var src = figs[idx].querySelector('img');
    img.src = src.getAttribute('data-full') || src.src;
    img.alt = src.alt;
    count.textContent = (idx + 1) + ' / ' + figs.length;
  }
  function open(i) { lastFocus = document.activeElement; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }

  figs.forEach(function (f, i) {
    f.tabIndex = 0;
    f.setAttribute('role', 'button');
    f.addEventListener('click', function () { open(i); });
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
