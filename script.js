/**
 * AGENCY SERVICES — PREMIUM SCROLL ANIMATION & INTERACTION ENGINE
 * Alternating entrances, staggered content reveals, sticky center focus, scroll parallax, & exit dynamics
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.service-card');

  /* ==========================================================================
     1. DYNAMIC EQUAL HEIGHT SYNC (Desktop & Tablet)
     ========================================================================== */
  function syncCardHeights() {
    if (window.innerWidth > 860 && cards.length > 0) {
      cards[0].style.height = 'auto';
      cards[0].style.minHeight = 'auto';
      const firstCardHeight = cards[0].offsetHeight;
      const targetHeight = Math.max(firstCardHeight, 480);

      cards.forEach(card => {
        card.style.height = `${targetHeight}px`;
        card.style.minHeight = `${targetHeight}px`;
      });
    } else {
      cards.forEach(card => {
        card.style.height = 'auto';
        card.style.minHeight = 'auto';
      });
    }
  }

  syncCardHeights();
  window.addEventListener('resize', syncCardHeights);

  /* ==========================================================================
     2. SCROLL ENTRANCE REVEAL (IntersectionObserver)
     ========================================================================== */
  if ('IntersectionObserver' in window && !isReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Trigger smooth entrance once
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    cards.forEach(card => revealObserver.observe(card));
  } else {
    cards.forEach(card => card.classList.add('is-revealed'));
  }

  /* ==========================================================================
     3. STICKY CENTER EFFECT, CARD EXIT DYNAMICS & SUBTLE MEDIA PARALLAX
     ========================================================================== */
  if (!isReducedMotion) {
    let ticking = false;

    function handleScrollDynamics() {
      const windowHeight = window.innerHeight;
      const centerY = windowHeight / 2;

      cards.forEach(card => {
        if (!card.classList.contains('is-revealed')) return;

        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distFromCenter = cardCenter - centerY;
        const normalizedDist = distFromCenter / (windowHeight / 2);

        // Sticky Center Focus (Within 25% of viewport center)
        if (Math.abs(normalizedDist) < 0.28) {
          card.classList.add('card-focused');
          card.classList.remove('card-passed');
        } else if (rect.bottom < centerY * 0.75) {
          // Card scrolled past center towards top exit
          card.classList.remove('card-focused');
          card.classList.add('card-passed');
        } else {
          card.classList.remove('card-focused');
          card.classList.remove('card-passed');
        }

        // Subtle Media Parallax (max 10-14px translation, scale 1 -> 1.025)
        if (window.innerWidth > 860 && rect.top < windowHeight && rect.bottom > 0) {
          const media = card.querySelector('.card-video, .card-img');
          if (media) {
            const parallaxOffset = Math.max(Math.min(-normalizedDist * 12, 14), -14);
            media.style.transform = `translateY(${parallaxOffset}px) scale(1.02)`;
          }
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(handleScrollDynamics);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    handleScrollDynamics();
  }

  /* ==========================================================================
     4. RELIABLE VIDEO AUTOPLAY HANDLER
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
     5. ACTION PILL KEYBOARD ACCESSIBILITY
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
