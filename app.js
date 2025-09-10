(() => {
  const root = document.querySelector('.carousel');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  const prevButtons = Array.from(root.querySelectorAll('.nav.prev'));
  const nextButtons = Array.from(root.querySelectorAll('.nav.next'));
  const dotsContainer = root.querySelector('.dots');

  let activeIndex = slides.findIndex(s => s.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 6000;

  function renderDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Show testimonial ${idx + 1}`);
      dot.setAttribute('aria-selected', String(idx === activeIndex));
      dot.addEventListener('click', () => goTo(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function updateActive() {
    slides.forEach((el, idx) => {
      el.classList.toggle('is-active', idx === activeIndex);
    });
    dotsContainer.querySelectorAll('button').forEach((b, idx) => {
      b.setAttribute('aria-selected', String(idx === activeIndex));
    });
  }

  function goTo(index) {
    activeIndex = (index + slides.length) % slides.length;
    updateActive();
  }

  function next() { goTo(activeIndex + 1); }
  function prev() { goTo(activeIndex - 1); }

  prevButtons.forEach(btn => btn.addEventListener('click', prev));
  nextButtons.forEach(btn => btn.addEventListener('click', next));

  // Keyboard support
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Touch / drag support
  let touchStartX = 0;
  let touchDeltaX = 0;
  const trackEl = root.querySelector('.slides');

  function onStart(x) { touchStartX = x; touchDeltaX = 0; }
  function onMove(x) { touchDeltaX = x - touchStartX; }
  function onEnd() {
    if (Math.abs(touchDeltaX) > 50) {
      if (touchDeltaX < 0) next();
      else prev();
    }
    touchStartX = 0; touchDeltaX = 0;
  }

  trackEl.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
  trackEl.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  trackEl.addEventListener('touchend', onEnd);

  // Autoplay with hover pause
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  // Init
  renderDots();
  updateActive();
  startAutoplay();
})();

