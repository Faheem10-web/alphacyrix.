/**
 * AGENCY SERVICES INTERACTION ENGINE
 * Scroll reveal observer, dynamic equal height sync, & reliable video autoplay
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. DYNAMIC EQUAL HEIGHT SYNC (All cards match Card 1's exact height)
     ========================================================================== */
  const cards = document.querySelectorAll('.service-card');
  
  function syncCardHeights() {
    if (window.innerWidth > 860 && cards.length > 0) {
      // Reset height first to measure natural height of Card 1
      cards[0].style.height = 'auto';
      cards[0].style.minHeight = 'auto';
      const firstCardHeight = cards[0].offsetHeight;
      const targetHeight = Math.max(firstCardHeight, 480);

      cards.forEach(card => {
        card.style.height = `${targetHeight}px`;
        card.style.minHeight = `${targetHeight}px`;
      });
    } else {
      // Mobile auto reset
      cards.forEach(card => {
        card.style.height = 'auto';
        card.style.minHeight = 'auto';
      });
    }
  }

  // Initial sync & resize listener
  syncCardHeights();
  window.addEventListener('resize', syncCardHeights);

  /* ==========================================================================
     2. SCROLL REVEAL OBSERVER (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window && !isReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     3. RELIABLE VIDEO AUTOPLAY HANDLER
     ========================================================================== */
  const cardVideos = document.querySelectorAll('.card-video');
  cardVideos.forEach(video => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const startOnInteraction = () => {
          video.play();
          window.removeEventListener('click', startOnInteraction);
          window.removeEventListener('scroll', startOnInteraction);
          window.removeEventListener('touchstart', startOnInteraction);
        };
        window.addEventListener('click', startOnInteraction);
        window.addEventListener('scroll', startOnInteraction);
        window.addEventListener('touchstart', startOnInteraction);
      });
    }
  });

  /* ==========================================================================
     4. ACTION PILL KEYBOARD ACCESSIBILITY
     ========================================================================== */
  const pills = document.querySelectorAll('.action-pill');
  pills.forEach(pill => {
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.click();
      }
    });
  });
});
