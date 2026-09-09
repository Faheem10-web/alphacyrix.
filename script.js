/**
 * AGENCY SERVICES — PREMIUM SCROLL ANIMATION & MULTI-DESIGN INTERACTION ENGINE
 * Powered by Lenis Smooth Scroll, dynamic video switching, scroll reveals, sticky focus, and responsive sync
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.service-card');
  const servicesContainer = document.querySelector('.services-container');
  const navButtons = document.querySelectorAll('.nav-btn');
  const cardVideos = document.querySelectorAll('.card-video');

  /* ==========================================================================
     1. LENIS SMOOTH SCROLL INITIALIZATION
     ========================================================================== */
  let lenisInstance = null;

  if (typeof Lenis !== 'undefined' && !isReducedMotion) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth momentum curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      smoothTouch: false,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync scroll dynamics with Lenis scroll event
    lenisInstance.on('scroll', () => {
      handleScrollDynamics();
    });
  }

  /* ==========================================================================
     2. DESIGN SWITCHER WITH DYNAMIC VIDEO SOURCE SWITCHING
     ========================================================================== */
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const designId = btn.getAttribute('data-design');
      
      // 1. Update Active Button State
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 2. Update Container Design Mode
      if (servicesContainer) {
        servicesContainer.setAttribute('data-active-design', designId);
      }

      // 3. Switch Video Source between Design 1 and Design 2
      cardVideos.forEach(video => {
        let targetSrc = '';
        if (designId === '1') {
          targetSrc = video.getAttribute('data-video-d1');
        } else if (designId === '2') {
          targetSrc = video.getAttribute('data-video-d2');
        } else if (designId === '3') {
          targetSrc = video.getAttribute('data-video-d2') || video.getAttribute('data-video-d1');
        }

        if (targetSrc && video.getAttribute('src') !== targetSrc) {
          video.src = targetSrc;
          video.load();
          video.muted = true;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }
      });

      // 4. Smooth Height Equalization Re-sync
      setTimeout(() => {
        syncCardHeights();
        if (lenisInstance) {
          lenisInstance.resize();
        }
      }, 60);
    });
  });

  /* ==========================================================================
     3. DYNAMIC EQUAL HEIGHT SYNC (100% Locked Equal Height on Desktop & Tablet)
     ========================================================================== */
  function syncCardHeights() {
    if (window.innerWidth > 860 && cards.length > 0) {
      cards.forEach(card => {
        card.style.height = '520px';
        card.style.minHeight = '520px';
        card.style.maxHeight = '520px';
      });
    } else {
      cards.forEach(card => {
        card.style.height = 'auto';
        card.style.minHeight = 'auto';
        card.style.maxHeight = 'none';
      });
    }
  }

  syncCardHeights();
  window.addEventListener('resize', () => {
    syncCardHeights();
    if (lenisInstance) {
      lenisInstance.resize();
    }
  });

  /* ==========================================================================
     4. SCROLL ENTRANCE REVEAL (IntersectionObserver)
     ========================================================================== */
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
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    cards.forEach(card => revealObserver.observe(card));
  } else {
    cards.forEach(card => card.classList.add('is-revealed'));
  }

  /* ==========================================================================
     5. STICKY CENTER EFFECT, CARD EXIT DYNAMICS & SUBTLE MEDIA PARALLAX
     ========================================================================== */
  function handleScrollDynamics() {
    if (isReducedMotion) return;

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
  }

  // Native scroll fallback listener if lenis is not active
  if (!lenisInstance) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollDynamics();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  handleScrollDynamics();

  /* ==========================================================================
     6. RELIABLE VIDEO AUTOPLAY INITIALIZATION
     ========================================================================== */
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
     7. ACTION PILL KEYBOARD ACCESSIBILITY
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
